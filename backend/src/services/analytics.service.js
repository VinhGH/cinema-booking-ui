// backend/src/services/analytics.service.js
const { supabase } = require('../config/supabase');
const { logger } = require('../utils/logger');

class AnalyticsService {
    /**
     * Get dashboard statistics
     */
    async getDashboardStats() {
        try {
            // Get total revenue (confirmed and pending bookings)
            // Note: In current flow, payment_status stays 'pending' even after successful booking
            const { data: revenueData } = await supabase
                .from('bookings')
                .select('final_amount')
                .in('status', ['confirmed', 'pending']);

            const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.final_amount || 0), 0) || 0;
            logger.info(`[Analytics] Total revenue: ${totalRevenue} from ${revenueData?.length} bookings`);

            // Get tickets sold (count booking_seats for confirmed bookings)
            // Note: We count 'confirmed' status because payment happens after booking creation
            const { data: ticketsData, error: ticketsError } = await supabase
                .from('booking_seats')
                .select('id, bookings!inner(status)')
                .in('bookings.status', ['confirmed', 'pending']);

            if (ticketsError) {
                logger.error('[Analytics] Error fetching tickets:', ticketsError);
            }

            const ticketsSold = ticketsData?.length || 0;
            logger.info(`[Analytics] Tickets sold: ${ticketsSold} seats from booking_seats`);

            // Get now showing movies count
            const { data: nowShowingData } = await supabase
                .from('movies')
                .select('id')
                .eq('status', 'now-showing');

            const nowShowingMovies = nowShowingData?.length || 0;

            // Get upcoming showtimes count (today and future)
            const today = new Date().toISOString().split('T')[0];
            const { data: showtimesData } = await supabase
                .from('showtimes')
                .select('id')
                .gte('show_date', today);

            const upcomingShowtimes = showtimesData?.length || 0;

            return {
                totalRevenue,
                ticketsSold,
                nowShowingMovies,
                upcomingShowtimes
            };
        } catch (error) {
            logger.error('AnalyticsService.getDashboardStats error:', error);
            throw error;
        }
    }

    /**
     * Get revenue trend by month
     */
    async getRevenueTrend(months = 6) {
        try {
            // Calculate date range
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - months);

            const { data, error } = await supabase
                .from('bookings')
                .select('final_amount, created_at')
                .in('status', ['confirmed', 'pending'])
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Group by month
            const monthlyRevenue = {};
            data?.forEach(booking => {
                const month = booking.created_at.substring(0, 7); // YYYY-MM
                monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (booking.final_amount || 0);
            });

            // Convert to array format
            const result = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
                month,
                revenue
            }));

            return result;
        } catch (error) {
            logger.error('AnalyticsService.getRevenueTrend error:', error);
            throw error;
        }
    }

    /**
     * Get recent bookings with details
     */
    async getRecentBookings(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    id,
                    booking_code,
                    final_amount,
                    status,
                    created_at,
                    users (
                        full_name
                    ),
                    showtimes (
                        movies (
                            title
                        )
                    ),
                    booking_seats (
                        seats (
                            row_label,
                            seat_number
                        )
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            // Transform data
            const bookings = data?.map(booking => ({
                id: booking.id,
                booking_code: booking.booking_code,
                movie_title: booking.showtimes?.movies?.title || 'N/A',
                user_name: booking.users?.full_name || 'Guest',
                seats: booking.booking_seats?.map(bs =>
                    `${bs.seats?.row_label}${bs.seats?.seat_number}`
                ) || [],
                final_amount: booking.final_amount,
                status: booking.status,
                created_at: booking.created_at
            })) || [];

            return bookings;
        } catch (error) {
            logger.error('AnalyticsService.getRecentBookings error:', error);
            throw error;
        }
    }
}

module.exports = new AnalyticsService();
