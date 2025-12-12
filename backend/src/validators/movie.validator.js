// backend/src/validators/movie.validator.js
const Joi = require('joi');

// Validation schemas for movie operations
const movieValidators = {
    // Get movie by ID
    getById: Joi.object({
        id: Joi.string().uuid().required()
    }),

    // Search movies
    search: Joi.object({
        q: Joi.string().min(1).max(100).required()
    }),

    // Get movies with filters (query params)
    getMovies: Joi.object({
        status: Joi.string().valid('now-showing', 'coming-soon', 'ended').optional(),
        genre: Joi.string().max(50).optional(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20)
    }),

    // Create movie (admin only)
    create: Joi.object({
        title: Joi.string().required().max(200),
        title_en: Joi.string().optional().max(200),
        poster_url: Joi.string().required(), // Accept both URI and base64 data URIs
        backdrop_url: Joi.string().optional(), // Accept both URI and base64
        trailer_url: Joi.string().uri().optional(),
        rating: Joi.number().min(0).max(10).optional(),
        duration: Joi.number().integer().min(1).required(), // in minutes
        genre: Joi.string().required().max(100),
        director: Joi.string().optional().max(200),
        cast: Joi.string().optional(),
        description: Joi.string().optional(),
        release_date: Joi.date().required(),
        language: Joi.string().default('Tiếng Việt'),
        subtitle: Joi.string().optional(),
        age_rating: Joi.string().valid('P', 'T13', 'T16', 'T18').optional(),
        status: Joi.string().valid('coming-soon', 'now-showing', 'ended').default('coming-soon')
    }),

    // Update movie (admin only)
    update: Joi.object({
        title: Joi.string().max(200),
        title_en: Joi.string().max(200),
        poster_url: Joi.string(), // Accept both URI and base64 data URIs
        backdrop_url: Joi.string(), // Accept both URI and base64
        trailer_url: Joi.string().uri(),
        rating: Joi.number().min(0).max(10),
        duration: Joi.number().integer().min(1),
        genre: Joi.string().max(100),
        director: Joi.string().max(200),
        cast: Joi.string(),
        description: Joi.string(),
        release_date: Joi.date(),
        language: Joi.string(),
        subtitle: Joi.string(),
        age_rating: Joi.string().valid('P', 'T13', 'T16', 'T18'),
        status: Joi.string().valid('coming-soon', 'now-showing', 'ended')
    }).min(1) // At least one field must be provided
};

module.exports = movieValidators;
