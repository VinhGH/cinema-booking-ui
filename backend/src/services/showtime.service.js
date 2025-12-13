// backend/src/services/showtime.service.js
const { supabase } = require('../config/supabase');
const { NotFoundError } = require('../utils/error');
const { logger } = require('../utils/logger');

class ShowtimeService {
    /**
     * Get all showtimes with filters
     */
    async getAll(filters = {}) {
        try {
            let query = supabase
                .from('showtimes')
                .select(`
          *,
          movies (id, title, title_en, poster_url, duration, genre, age_rating),
          halls (
            id,
            name,
            total_seats,
            screen_type,
            cinemas (id, name, address, city)
          )
        `, { count: 'exact' });

            // Apply filters
            if (filters.movieId) {
                query = query.eq('movie_id', filters.movieId);
            }

            if (filters.hallId) {
                query = query.eq('hall_id', filters.hallId);
            }

            if (filters.cinemaId) {
                // Join through halls to filter by cinema
                query = query.eq('halls.cinema_id', filters.cinemaId);
            }

            if (filters.date) {
                query = query.eq('show_date', filters.date);
            }

            if (filters.fromDate && filters.toDate) {
                query = query.gte('show_date', filters.fromDate).lte('show_date', filters.toDate);
            }

            // Only active showtimes
            query = query.eq('is_active', true);

            // Pagination
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query
                .range(from, to)
                .order('show_date', { ascending: true })
                .order('show_time', { ascending: true });

            const { data, error, count } = await query;

            if (error) {
                logger.error('Error fetching showtimes:', error);
                throw error;
            }

            return {
                showtimes: data,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('ShowtimeService.getAll error:', error);
            throw error;
        }
    }

    /**
     * Get showtimes by movie ID
     */
    async getByMovie(movieId, date = null) {
        try {
            let query = supabase
                .from('showtimes')
                .select(`
          *,
          halls (
            id,
            name,
            total_seats,
            screen_type,
            cinemas (id, name, address, city)
          )
        `)
                .eq('movie_id', movieId)
                .eq('is_active', true)
                .gte('show_date', new Date().toISOString().split('T')[0]);

            if (date) {
                query = query.eq('show_date', date);
            }

            query = query
                .order('show_date', { ascending: true })
                .order('show_time', { ascending: true });

            const { data, error } = await query;

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('ShowtimeService.getByMovie error:', error);
            throw error;
        }
    }

    /**
     * Get showtimes by date
     */
    async getByDate(date, movieId = null) {
        try {
            let query = supabase
                .from('showtimes')
                .select(`
          *,
          movies (id, title, title_en, poster_url, duration, genre, age_rating),
          halls (
            id,
            name,
            total_seats,
            screen_type,
            cinemas (id, name, address, city)
          )
        `)
                .eq('show_date', date)
                .eq('is_active', true);

            if (movieId) {
                query = query.eq('movie_id', movieId);
            }

            query = query.order('show_time', { ascending: true });

            const { data, error } = await query;

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('ShowtimeService.getByDate error:', error);
            throw error;
        }
    }

    /**
     * Get showtime by ID with full details
     */
    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('showtimes')
                .select(`
          *,
          movies (*),
          halls (
            *,
            cinemas (*)
          )
        `)
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new NotFoundError('Showtime not found');
                }
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('ShowtimeService.getById error:', error);
            throw error;
        }
    }

    /**
     * Get seats for a showtime with status
     */
    async getSeats(showtimeId) {
        try {
            logger.info(`[getSeats] Fetching seats for showtime: ${showtimeId}`);

            // Query 1: Get hall_id from showtime (fast, single row)
            const { data: showtime, error: showtimeError } = await supabase
                .from('showtimes')
                .select('hall_id')
                .eq('id', showtimeId)
                .single();

            if (showtimeError) {
                logger.error('[getSeats] Showtime query error:', showtimeError);
                throw showtimeError;
            }

            logger.info(`[getSeats] Found hall_id: ${showtime?.hall_id}`);

            // Query 2: Get all seats for this hall (with index on hall_id)
            const { data: seats, error: seatsError } = await supabase
                .from('seats')
                .select('id, hall_id, row_label, seat_number, seat_type')
                .eq('hall_id', showtime.hall_id)
                .order('row_label')
                .order('seat_number');

            if (seatsError) {
                logger.error('[getSeats] Seats query error:', seatsError);
                throw seatsError;
            }

            logger.info(`[getSeats] Found ${seats?.length || 0} seats in hall`);

            // Query 3: Get booked seats (with index on showtime_id)
            const { data: bookedSeats, error: bookedError } = await supabase
                .from('booking_seats')
                .select('seat_id, bookings!inner(showtime_id, status)')
                .eq('bookings.showtime_id', showtimeId)
                .in('bookings.status', ['pending', 'confirmed']);

            if (bookedError) {
                logger.error('[getSeats] Booked seats query error:', bookedError);
                throw bookedError;
            }

            logger.info(`[getSeats] Found ${bookedSeats?.length || 0} booked seats`);

            // Fast Set lookup O(1)
            const bookedSeatIds = new Set((bookedSeats || []).map(bs => bs.seat_id));

            // Map with status
            const result = (seats || []).map(seat => ({
                ...seat,
                is_booked: bookedSeatIds.has(seat.id),
                status: bookedSeatIds.has(seat.id) ? 'booked' : 'available'
            }));

            logger.info(`[getSeats] Returning ${result.length} seats with status`);
            return result;

        } catch (error) {
            logger.error('ShowtimeService.getSeats error:', error);
            throw error;
        }
    }

    /**
     * Create new showtime (admin only)
     */
    async create(showtimeData) {
        try {
            // If available_seats not provided, get from hall
            if (!showtimeData.available_seats) {
                const { data: hall } = await supabase
                    .from('halls')
                    .select('total_seats')
                    .eq('id', showtimeData.hall_id)
                    .single();

                showtimeData.available_seats = hall?.total_seats || 0;
            }

            const { data, error } = await supabase
                .from('showtimes')
                .insert(showtimeData)
                .select()
                .single();

            if (error) throw error;

            logger.info('Showtime created:', { showtimeId: data.id });
            return data;
        } catch (error) {
            logger.error('ShowtimeService.create error:', error);
            throw error;
        }
    }

    /**
     * Update showtime (admin only)
     */
    async update(id, showtimeData) {
        try {
            const { data, error } = await supabase
                .from('showtimes')
                .update(showtimeData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new NotFoundError('Showtime not found');
                }
                throw error;
            }

            logger.info('Showtime updated:', { showtimeId: id });
            return data;
        } catch (error) {
            logger.error('ShowtimeService.update error:', error);
            throw error;
        }
    }

    /**
     * Delete showtime (admin only)
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('showtimes')
                .delete()
                .eq('id', id);

            if (error) throw error;

            logger.info('Showtime deleted:', { showtimeId: id });
            return { message: 'Showtime deleted successfully' };
        } catch (error) {
            logger.error('ShowtimeService.delete error:', error);
            throw error;
        }
    }
}

module.exports = new ShowtimeService();
