// backend/src/controllers/showtime.controller.js
const showtimeService = require('../services/showtime.service');
const { successResponse, paginatedResponse } = require('../utils/response');

/**
 * Get all showtimes with filters
 * GET /api/v1/showtimes
 */
exports.getShowtimes = async (req, res, next) => {
    try {
        const { movieId, cinemaId, hallId, date, fromDate, toDate, page, limit } = req.query;

        const result = await showtimeService.getAll({
            movieId,
            cinemaId,
            hallId,
            date,
            fromDate,
            toDate,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        return paginatedResponse(
            res,
            result.showtimes,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Showtimes retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get showtimes by movie ID
 * GET /api/v1/showtimes/movie/:movieId
 */
exports.getShowtimesByMovie = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const { date } = req.query;

        const showtimes = await showtimeService.getByMovie(movieId, date);
        return successResponse(res, showtimes, 'Showtimes retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get showtimes by date
 * GET /api/v1/showtimes/date/:date
 */
exports.getShowtimesByDate = async (req, res, next) => {
    try {
        const { date } = req.params;
        const { movieId } = req.query;

        const showtimes = await showtimeService.getByDate(date, movieId);
        return successResponse(res, showtimes, 'Showtimes retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get showtime by ID
 * GET /api/v1/showtimes/:id
 */
exports.getShowtimeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const showtime = await showtimeService.getById(id);
        return successResponse(res, showtime, 'Showtime retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get seats for showtime
 * GET /api/v1/showtimes/:id/seats
 */
exports.getShowtimeSeats = async (req, res, next) => {
    try {
        const { id } = req.params;
        const seats = await showtimeService.getSeats(id);
        return successResponse(res, seats, 'Seats retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Create showtime (admin only)
 * POST /api/v1/showtimes
 */
exports.createShowtime = async (req, res, next) => {
    try {
        const showtime = await showtimeService.create(req.body);
        return successResponse(res, showtime, 'Showtime created successfully', 201);
    } catch (error) {
        next(error);
    }
};

/**
 * Update showtime (admin only)
 * PUT /api/v1/showtimes/:id
 */
exports.updateShowtime = async (req, res, next) => {
    try {
        const { id } = req.params;
        const showtime = await showtimeService.update(id, req.body);
        return successResponse(res, showtime, 'Showtime updated successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Delete showtime (admin only)
 * DELETE /api/v1/showtimes/:id
 */
exports.deleteShowtime = async (req, res, next) => {
    try {
        const { id } = req.params;
        await showtimeService.delete(id);
        return successResponse(res, null, 'Showtime deleted successfully');
    } catch (error) {
        next(error);
    }
};
