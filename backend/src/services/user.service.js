// backend/src/services/user.service.js
const { supabase } = require('../config/supabase');
const { NotFoundError, AuthorizationError } = require('../utils/error');
const { logger } = require('../utils/logger');

class UserService {
    /**
     * Get user profile by ID
     */
    async getById(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new NotFoundError('User not found');
                }
                throw error;
            }

            // Get email from auth
            const { data: authData } = await supabase.auth.admin.getUserById(userId);

            return {
                id: data.id,
                email: authData?.user?.email || null,
                full_name: data.full_name,
                phone: data.phone,
                avatar_url: data.avatar_url,
                role: data.role,
                loyalty_points: data.loyalty_points,
                reward_points: data.reward_points,
                created_at: data.created_at,
                updated_at: data.updated_at
            };
        } catch (error) {
            logger.error('UserService.getById error:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(userId, updateData) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new NotFoundError('User not found');
                }
                throw error;
            }

            logger.info('User profile updated:', { userId });
            return data;
        } catch (error) {
            logger.error('UserService.updateProfile error:', error);
            throw error;
        }
    }

    /**
     * Get user bookings history
     */
    async getBookings(userId) {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          showtimes (
            *,
            movies (id, title, poster_url, duration, genre),
            halls (
              id,
              name,
              cinemas (id, name, address)
            )
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data;
        } catch (error) {
            logger.error('UserService.getBookings error:', error);
            throw error;
        }
    }

    /**
     * Get all users (admin only)
     */
    async getAll(filters = {}) {
        try {
            let query = supabase
                .from('users')
                .select('*', { count: 'exact' });

            // Apply filters
            if (filters.role) {
                query = query.eq('role', filters.role);
            }

            if (filters.search) {
                query = query.or(`full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
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
                users: data,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('UserService.getAll error:', error);
            throw error;
        }
    }

    /**
     * Get user statistics (admin only)
     */
    async getStats() {
        try {
            const { data: stats, error } = await supabase
                .from('users')
                .select('role')
                .then(({ data }) => {
                    const total = data?.length || 0;
                    const admins = data?.filter(u => u.role === 'admin').length || 0;
                    const users = total - admins;

                    return {
                        data: { total, admins, users },
                        error: null
                    };
                });

            if (error) throw error;
            return stats;
        } catch (error) {
            logger.error('UserService.getStats error:', error);
            throw error;
        }
    }
}

module.exports = new UserService();
