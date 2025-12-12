// backend/src/routes/booking.routes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const bookingValidator = require('../validators/booking.validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

// All booking routes require authentication
router.use(authenticate);

// User routes
router.post(
    '/',
    validate(bookingValidator.create, 'body'),
    bookingController.createBooking
);

router.get(
    '/',
    validate(bookingValidator.getBookings, 'query'),
    bookingController.getMyBookings
);

router.get(
    '/:id',
    validate(bookingValidator.getById, 'params'),
    bookingController.getBookingById
);

router.delete(
    '/:id',
    validate(bookingValidator.getById, 'params'),
    bookingController.cancelBooking
);

// Admin routes
router.put(
    '/:id/status',
    requireAdmin,
    validate(bookingValidator.getById, 'params'),
    validate(bookingValidator.updateStatus, 'body'),
    bookingController.updateBookingStatus
);

router.put(
    '/:id/payment',
    requireAdmin,
    validate(bookingValidator.getById, 'params'),
    validate(bookingValidator.updatePayment, 'body'),
    bookingController.updatePaymentStatus
);

module.exports = router;
