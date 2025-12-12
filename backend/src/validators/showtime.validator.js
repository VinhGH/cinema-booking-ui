// backend/src/validators/showtime.validator.js
const Joi = require('joi');

// Validation schemas for showtime operations
const showtimeValidators = {
    // Get showtime by ID
    getById: Joi.object({
        id: Joi.string().uuid().required()
    }),

    // Get showtimes by movie
    getByMovie: Joi.object({
        movieId: Joi.string().uuid().required(),
        date: Joi.date().optional(),
        cinema: Joi.string().uuid().optional()
    }),

    // Get showtimes by date
    getByDate: Joi.object({
        date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(), // YYYY-MM-DD format
        movieId: Joi.string().uuid().optional(),
        cinemaId: Joi.string().uuid().optional()
    }),

    // Get showtimes with filters
    getShowtimes: Joi.object({
        movieId: Joi.string().uuid().optional(),
        cinemaId: Joi.string().uuid().optional(),
        hallId: Joi.string().uuid().optional(),
        date: Joi.date().optional(),
        fromDate: Joi.date().optional(),
        toDate: Joi.date().optional(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20)
    }),

    // Create showtime (admin only)
    create: Joi.object({
        movie_id: Joi.string().uuid().required(),
        hall_id: Joi.string().uuid().required(),
        show_date: Joi.date().required(),
        show_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // HH:MM format
        price: Joi.number().positive().required(),
        special_price: Joi.number().positive().optional(),
        available_seats: Joi.number().integer().min(0).optional(), // Will be calculated from hall
        is_active: Joi.boolean().default(true)
    }),

    // Update showtime (admin only)
    update: Joi.object({
        show_date: Joi.date(),
        show_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        price: Joi.number().positive(),
        special_price: Joi.number().positive(),
        available_seats: Joi.number().integer().min(0),
        is_active: Joi.boolean()
    }).min(1)
};

module.exports = showtimeValidators;
