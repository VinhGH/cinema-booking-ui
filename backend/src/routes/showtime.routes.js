// backend/src/routes/showtime.routes.js
const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtime.controller');
const showtimeValidator = require('../validators/showtime.validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get(
    '/',
    validate(showtimeValidator.getShowtimes, 'query'),
    showtimeController.getShowtimes
);

router.get(
    '/movie/:movieId',
    validate(showtimeValidator.getByMovie, 'params'),
    showtimeController.getShowtimesByMovie
);

router.get(
    '/date/:date',
    validate(showtimeValidator.getByDate, 'params'),
    showtimeController.getShowtimesByDate
);

router.get(
    '/:id/seats',
    validate(showtimeValidator.getById, 'params'),
    showtimeController.getShowtimeSeats
);

router.get(
    '/:id',
    validate(showtimeValidator.getById, 'params'),
    showtimeController.getShowtimeById
);

// Admin routes
router.post(
    '/',
    authenticate,
    requireAdmin,
    validate(showtimeValidator.create, 'body'),
    showtimeController.createShowtime
);

router.put(
    '/:id',
    authenticate,
    requireAdmin,
    validate(showtimeValidator.getById, 'params'),
    validate(showtimeValidator.update, 'body'),
    showtimeController.updateShowtime
);

router.delete(
    '/:id',
    authenticate,
    requireAdmin,
    validate(showtimeValidator.getById, 'params'),
    showtimeController.deleteShowtime
);

module.exports = router;
