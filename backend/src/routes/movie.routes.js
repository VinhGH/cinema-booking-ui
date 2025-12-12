// backend/src/routes/movie.routes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const movieValidator = require('../validators/movie.validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

// Public routes (no auth required)
router.get(
    '/',
    validate(movieValidator.getMovies, 'query'),
    movieController.getMovies
);

router.get(
    '/now-showing',
    movieController.getNowShowing
);

router.get(
    '/coming-soon',
    movieController.getComingSoon
);

router.get(
    '/search',
    validate(movieValidator.search, 'query'),
    movieController.searchMovies
);

router.get(
    '/:id',
    validate(movieValidator.getById, 'params'),
    movieController.getMovieById
);

// Admin routes (require authentication + admin role)
router.post(
    '/',
    authenticate,
    requireAdmin,
    validate(movieValidator.create, 'body'),
    movieController.createMovie
);

router.put(
    '/:id',
    authenticate,
    requireAdmin,
    validate(movieValidator.getById, 'params'),
    validate(movieValidator.update, 'body'),
    movieController.updateMovie
);

router.delete(
    '/:id',
    authenticate,
    requireAdmin,
    validate(movieValidator.getById, 'params'),
    movieController.deleteMovie
);

module.exports = router;
