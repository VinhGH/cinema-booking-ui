// backend/src/controllers/movie.controller.js
const movieService = require('../services/movie.service');
const { successResponse, paginatedResponse } = require('../utils/response');

/**
 * Get all movies with filters
 * GET /api/v1/movies
 */
exports.getMovies = async (req, res, next) => {
    try {
        const { status, genre, page, limit } = req.query;

        const result = await movieService.getAll({
            status,
            genre,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        return paginatedResponse(
            res,
            result.movies,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Movies retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get now showing movies
 * GET /api/v1/movies/now-showing
 */
exports.getNowShowing = async (req, res, next) => {
    try {
        const movies = await movieService.getNowShowing();
        return successResponse(res, movies, 'Now showing movies retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get coming soon movies
 * GET /api/v1/movies/coming-soon
 */
exports.getComingSoon = async (req, res, next) => {
    try {
        const movies = await movieService.getComingSoon();
        return successResponse(res, movies, 'Coming soon movies retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get movie by ID
 * GET /api/v1/movies/:id
 */
exports.getMovieById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await movieService.getById(id);
        return successResponse(res, movie, 'Movie retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Search movies
 * GET /api/v1/movies/search?q=keyword
 */
exports.searchMovies = async (req, res, next) => {
    try {
        const { q } = req.query;
        const movies = await movieService.search(q);
        return successResponse(res, movies, `Found ${movies.length} movies`);
    } catch (error) {
        next(error);
    }
};

/**
 * Create movie (admin only)
 * POST /api/v1/movies
 */
exports.createMovie = async (req, res, next) => {
    try {
        const movie = await movieService.create(req.body);
        return successResponse(res, movie, 'Movie created successfully', 201);
    } catch (error) {
        next(error);
    }
};

/**
 * Update movie (admin only)
 * PUT /api/v1/movies/:id
 */
exports.updateMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await movieService.update(id, req.body);
        return successResponse(res, movie, 'Movie updated successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Delete movie (admin only)
 * DELETE /api/v1/movies/:id
 */
exports.deleteMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        await movieService.delete(id);
        return successResponse(res, null, 'Movie deleted successfully');
    } catch (error) {
        next(error);
    }
};
