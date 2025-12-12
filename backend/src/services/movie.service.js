// backend/src/services/movie.service.js
const { supabase } = require('../config/supabase');
const { NotFoundError, ValidationError } = require('../utils/error');
const { logger } = require('../utils/logger');

class MovieService {
    /**
     * Get all movies with optional filters
     */
    async getAll(filters = {}) {
        try {
            let query = supabase.from('movies').select('*', { count: 'exact' });

            // Apply filters
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.genre) {
                query = query.eq('genre', filters.genre);
            }

            // Pagination
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query.range(from, to).order('release_date', { ascending: false });

            const { data, error, count } = await query;

            if (error) {
                logger.error('Error fetching movies:', error);
                throw error;
            }

            return {
                movies: data,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('MovieService.getAll error:', error);
            throw error;
        }
    }

    /**
     * Get now showing movies
     */
    async getNowShowing() {
        try {
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .eq('status', 'now-showing')
                .order('release_date', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('MovieService.getNowShowing error:', error);
            throw error;
        }
    }

    /**
     * Get coming soon movies
     */
    async getComingSoon() {
        try {
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .eq('status', 'coming-soon')
                .order('release_date', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('MovieService.getComingSoon error:', error);
            throw error;
        }
    }

    /**
     * Get movie by ID
     */
    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new NotFoundError('Movie not found');
                }
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('MovieService.getById error:', error);
            throw error;
        }
    }

    /**
     * Search movies by title
     */
    async search(query) {
        try {
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .or(`title.ilike.%${query}%,title_en.ilike.%${query}%`)
                .order('release_date', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('MovieService.search error:', error);
            throw error;
        }
    }

    /**
     * Create new movie (admin only)
     */
    async create(movieData) {
        try {
            const { data, error } = await supabase
                .from('movies')
                .insert(movieData)
                .select()
                .single();

            if (error) throw error;

            logger.info('Movie created:', { movieId: data.id, title: data.title });
            return data;
        } catch (error) {
            logger.error('MovieService.create error:', error);
            throw error;
        }
    }

    /**
     * Update movie (admin only)
     */
    async update(id, movieData) {
        try {
            const { data, error } = await supabase
                .from('movies')
                .update(movieData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new NotFoundError('Movie not found');
                }
                throw error;
            }

            logger.info('Movie updated:', { movieId: id });
            return data;
        } catch (error) {
            logger.error('MovieService.update error:', error);
            throw error;
        }
    }

    /**
     * Delete movie (admin only)
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('movies')
                .delete()
                .eq('id', id);

            if (error) throw error;

            logger.info('Movie deleted:', { movieId: id });
            return { message: 'Movie deleted successfully' };
        } catch (error) {
            logger.error('MovieService.delete error:', error);
            throw error;
        }
    }
}

module.exports = new MovieService();
