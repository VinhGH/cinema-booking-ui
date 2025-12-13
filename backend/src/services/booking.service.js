// backend/src/services/booking.service.js
const { supabase } = require('../config/supabase');
const { NotFoundError, ValidationError, ConflictError } = require('../utils/error');
const { logger } = require('../utils/logger');

class BookingService {
    /**
     * Create new booking
     * This is a complex transaction involving:
     * 1. Validate showtime and seats
     * 2. Calculate pricing
     * 3. Create booking record
     * 4. Link seats to booking
     * 5. Add concessions (if any)
     */
    async create(userId, bookingData) {
        try {
            const { showtime_id, seats, concessions = [], points_used = 0 } = bookingData;

            // Step 1: Get showtime details
            const { data: showtime, error: showtimeError } = await supabase
                .from('showtimes')
                .select(`
          *,
          movies (title, duration),
          halls (total_seats, cinemas (name))
        `)
                .eq('id', showtime_id)
                .single();

            if (showtimeError || !showtime) {
                throw new NotFoundError('Showtime not found');
            }

            // Allow testing with inactive showtimes
            // if (!showtime.is_active) {
            //   throw new ValidationError('Showtime is not active');
            // }

            // Step 2: Validate seats availability
            const { data: seatDetails, error: seatsError } = await supabase
                .from('seats')
                .select('*')
                .in('id', seats);

            if (seatsError || !seatDetails || seatDetails.length !== seats.length) {
                throw new ValidationError('Invalid seats selected');
            }

            // Check if seats are already booked for this showtime
            const { data: bookedSeats } = await supabase
                .from('booking_seats')
                .select(`
          seat_id,
          bookings!inner(showtime_id, status)
        `)
                .in('seat_id', seats)
                .eq('bookings.showtime_id', showtime_id)
                .in('bookings.status', ['pending', 'confirmed']);

            if (bookedSeats && bookedSeats.length > 0) {
                throw new ConflictError('Some seats are already booked for this showtime');
            }

            // Step 3: Calculate pricing
            let totalAmount = 0;
            const seatPricing = seatDetails.map(seat => {
                let price = showtime.price;

                // VIP seats cost more
                if (seat.seat_type === 'vip') {
                    price = price * 1.5;
                } else if (seat.seat_type === 'couple') {
                    price = price * 1.3;
                }

                totalAmount += price;

                return {
                    seat_id: seat.id,
                    price
                };
            });

            // Add concessions pricing
            let concessionsTotal = 0;
            const concessionPricing = [];

            if (concessions.length > 0) {
                const concessionIds = concessions.map(c => c.concession_id);
                const { data: concessionDetails } = await supabase
                    .from('concessions')
                    .select('*')
                    .in('id', concessionIds);

                for (const item of concessions) {
                    const concession = concessionDetails.find(c => c.id === item.concession_id);
                    if (concession && concession.is_available) {
                        const itemTotal = concession.price * item.quantity;
                        concessionsTotal += itemTotal;
                        concessionPricing.push({
                            concession_id: item.concession_id,
                            quantity: item.quantity,
                            price: concession.price
                        });
                    }
                }
            }

            totalAmount += concessionsTotal;

            // Calculate discount from points (1 point = 1000 VND)
            const discountAmount = Math.min(points_used * 1000, totalAmount * 0.5); // Max 50% discount
            const finalAmount = totalAmount - discountAmount;

            // Calculate loyalty points earned (1% of final amount)
            const pointsEarned = Math.floor(finalAmount / 100);

            // Step 4: Create booking
            const { data: booking, error: bookingError } = await supabase
                .from('bookings')
                .insert({
                    user_id: userId,
                    showtime_id,
                    total_amount: totalAmount,
                    discount_amount: discountAmount,
                    final_amount: finalAmount,
                    status: 'pending',
                    payment_status: 'pending',
                    points_earned: pointsEarned,
                    points_used: points_used
                })
                .select()
                .single();

            if (bookingError) {
                logger.error('Booking creation error:', bookingError);
                throw bookingError;
            }

            // Step 5: Link seats to booking
            const { error: bookingSeatsError } = await supabase
                .from('booking_seats')
                .insert(
                    seatPricing.map(sp => ({
                        booking_id: booking.id,
                        ...sp
                    }))
                );

            if (bookingSeatsError) {
                // Rollback: delete booking
                await supabase.from('bookings').delete().eq('id', booking.id);
                throw bookingSeatsError;
            }

            // Step 6: Link concessions to booking (if any)
            if (concessionPricing.length > 0) {
                const { error: bookingConcessionsError } = await supabase
                    .from('booking_concessions')
                    .insert(
                        concessionPricing.map(cp => ({
                            booking_id: booking.id,
                            ...cp
                        }))
                    );

                if (bookingConcessionsError) {
                    logger.error('Booking concessions error:', bookingConcessionsError);
                    throw bookingConcessionsError;
                }
            }

            // Step 7: Update user loyalty points
            if (pointsEarned > 0) {
                const { error: updatePointsError } = await supabase.rpc('increment_user_points', {
                    p_user_id: userId,
                    p_points: pointsEarned
                });

                // If RPC doesn't exist, fallback to manual update
                if (updatePointsError) {
                    logger.warn('RPC increment_user_points not found, using manual update');

                    // Get current points
                    const { data: userData } = await supabase
                        .from('users')
                        .select('loyalty_points')
                        .eq('id', userId)
                        .single();

                    const currentPoints = userData?.loyalty_points || 0;

                    // Update points
                    await supabase
                        .from('users')
                        .update({
                            loyalty_points: currentPoints + pointsEarned,
                            reward_points: currentPoints + pointsEarned
                        })
                        .eq('id', userId);
                }
            }

            logger.info('Booking created successfully:', {
                bookingId: booking.id,
                userId,
                seats: seats.length,
                finalAmount
            });

            return booking;
        } catch (error) {
            logger.error('BookingService.create error:', error);
            throw error;
        }
    }

    /**
     * Get booking by ID with full details
     */
    async getById(bookingId, userId = null) {
        try {
            let query = supabase
                .from('bookings')
                .select(`
          *,
          showtimes (
            *,
            movies (id, title, poster_url, duration, genre, age_rating),
            halls (
              id,
              name,
              screen_type,
              cinemas (id, name, address, city)
            )
          ),
          booking_seats (
            *,
            seats (id, row_label, seat_number, seat_type)
          ),
          booking_concessions (
            *,
            concessions (id, name, category, image_url)
          )
        `)
                .eq('id', bookingId);

            // If userId provided, ensure user owns the booking
            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { data, error } = await query.single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new NotFoundError('Booking not found');
                }
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('BookingService.getById error:', error);
            throw error;
        }
    }

    /**
     * Get user's bookings
     */
    async getUserBookings(userId, filters = {}) {
        try {
            let query = supabase
                .from('bookings')
                .select(`
          *,
          showtimes (
            show_date,
            show_time,
            movies (id, title, poster_url, genre),
            halls (
              id,
              name,
              cinemas (name, city)
            )
          ),
          booking_seats (
            seat_id,
            seats (
              row_label,
              seat_number,
              seat_type
            )
          )
        `, { count: 'exact' })
                .eq('user_id', userId);

            // Apply filters
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.payment_status) {
                query = query.eq('payment_status', filters.payment_status);
            }

            if (filters.from_date && filters.to_date) {
                query = query.gte('created_at', filters.from_date).lte('created_at', filters.to_date);
            }

            // Pagination
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query
                .range(from, to)
                .order('created_at', { ascending: false });

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                bookings: data,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('BookingService.getUserBookings error:', error);
            throw error;
        }
    }

    /**
     * Update booking status
     */
    async updateStatus(bookingId, status, userId = null) {
        try {
            let query = supabase
                .from('bookings')
                .update({ status })
                .eq('id', bookingId);

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { data, error } = await query.select().single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new NotFoundError('Booking not found');
                }
                throw error;
            }

            logger.info('Booking status updated:', { bookingId, status });
            return data;
        } catch (error) {
            logger.error('BookingService.updateStatus error:', error);
            throw error;
        }
    }

    /**
     * Update payment status
     */
    async updatePayment(bookingId, paymentStatus, paymentMethod = null) {
        try {
            const updateData = { payment_status: paymentStatus };
            if (paymentMethod) {
                updateData.payment_method = paymentMethod;
            }

            const { data, error } = await supabase
                .from('bookings')
                .update(updateData)
                .eq('id', bookingId)
                .select()
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new NotFoundError('Booking not found');
                }
                throw error;
            }

            // If payment is successful, update booking status to confirmed
            if (paymentStatus === 'paid') {
                await this.updateStatus(bookingId, 'confirmed');
            }

            logger.info('Payment status updated:', { bookingId, paymentStatus });
            return data;
        } catch (error) {
            logger.error('BookingService.updatePayment error:', error);
            throw error;
        }
    }

    /**
     * Cancel booking with refund
     */
    async cancel(bookingId, userId) {
        try {
            // Get booking with showtime details
            const booking = await this.getById(bookingId, userId);

            // Can only cancel if status is pending or confirmed
            if (!['pending', 'confirmed'].includes(booking.status)) {
                throw new ValidationError('Only pending or confirmed bookings can be cancelled');
            }

            // Calculate refund amount based on time until showtime
            const showDateTime = new Date(`${booking.showtimes.show_date}T${booking.showtimes.show_time}`);
            const now = new Date();
            const hoursUntilShow = (showDateTime - now) / (1000 * 60 * 60);

            let refundAmount = 0;
            let refundPercentage = 0;

            if (hoursUntilShow >= 24) {
                // 100% refund if cancelled 24+ hours before show
                refundAmount = booking.final_amount;
                refundPercentage = 100;
            } else if (hoursUntilShow >= 2) {
                // 50% refund if cancelled 2-24 hours before show
                refundAmount = booking.final_amount * 0.5;
                refundPercentage = 50;
            } else {
                // No refund if cancelled less than 2 hours before show
                refundAmount = 0;
                refundPercentage = 0;
            }

            // Update booking status to cancelled
            const { data, error } = await supabase
                .from('bookings')
                .update({
                    status: 'cancelled',
                    updated_at: new Date().toISOString()
                })
                .eq('id', bookingId)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;

            // Delete booking_seats to release seats
            const { error: deleteSeatError } = await supabase
                .from('booking_seats')
                .delete()
                .eq('booking_id', bookingId);

            if (deleteSeatError) {
                logger.error('Error releasing seats:', deleteSeatError);
            }

            // Process refund if amount > 0
            if (refundAmount > 0) {
                const walletService = require('./wallet.service');
                await walletService.processRefund(
                    userId,
                    bookingId,
                    refundAmount,
                    `Hoàn ${refundPercentage}% tiền hủy vé ${booking.booking_code}`
                );
                logger.info(`[Booking] Refund processed: ${refundAmount} (${refundPercentage}%) for booking ${bookingId}`);
            }

            logger.info('Booking cancelled:', {
                bookingId,
                refundAmount,
                refundPercentage,
                hoursUntilShow: hoursUntilShow.toFixed(2)
            });

            return {
                ...data,
                refund_amount: refundAmount,
                refund_percentage: refundPercentage
            };
        } catch (error) {
            logger.error('BookingService.cancel error:', error);
            throw error;
        }
    }
}

module.exports = new BookingService();
