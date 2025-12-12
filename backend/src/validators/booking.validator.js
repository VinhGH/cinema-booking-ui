// backend/src/validators/booking.validator.js
const Joi = require('joi');

// Validation schemas for booking operations
const bookingValidators = {
    // Create booking
    create: Joi.object({
        showtime_id: Joi.string().uuid().required(),
        seats: Joi.array().items(Joi.string().uuid()).min(1).required(),
        concessions: Joi.array().items(
            Joi.object({
                concession_id: Joi.string().uuid().required(),
                quantity: Joi.number().integer().min(1).required()
            })
        ).optional(),
        points_used: Joi.number().integer().min(0).default(0),
        payment_method: Joi.string().valid('credit-card', 'vnpay', 'momo', 'zalopay', 'cash').optional()
    }),

    // Get booking by ID
    getById: Joi.object({
        id: Joi.string().uuid().required()
    }),

    // Get bookings with filters
    getBookings: Joi.object({
        status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').optional(),
        payment_status: Joi.string().valid('pending', 'paid', 'failed', 'refunded').optional(),
        from_date: Joi.date().optional(),
        to_date: Joi.date().optional(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20)
    }),

    // Update booking status
    updateStatus: Joi.object({
        status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').required()
    }),

    // Update payment status
    updatePayment: Joi.object({
        payment_status: Joi.string().valid('pending', 'paid', 'failed', 'refunded').required(),
        payment_method: Joi.string().valid('credit-card', 'vnpay', 'momo', 'zalopay', 'cash').optional()
    })
};

module.exports = bookingValidators;
