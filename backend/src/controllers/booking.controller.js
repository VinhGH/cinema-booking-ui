// backend/src/controllers/booking.controller.js
const bookingService = require('../services/booking.service');
const { successResponse, paginatedResponse } = require('../utils/response');

/**
 * Create new booking
 * POST /api/v1/bookings
 */
exports.createBooking = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const booking = await bookingService.create(userId, req.body);

        return successResponse(
            res,
            booking,
            'Booking created successfully. Please proceed to payment.',
            201
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's bookings
 * GET /api/v1/bookings
 */
exports.getMyBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { status, payment_status, from_date, to_date, page, limit } = req.query;

        const result = await bookingService.getUserBookings(userId, {
            status,
            payment_status,
            from_date,
            to_date,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        return paginatedResponse(
            res,
            result.bookings,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Bookings retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get booking by ID
 * GET /api/v1/bookings/:id
 */
exports.getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Regular users can only view their own bookings
        // Admins can view any booking
        const booking = await bookingService.getById(
            id,
            req.user.role === 'admin' ? null : userId
        );

        return successResponse(res, booking, 'Booking retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Cancel booking
 * DELETE /api/v1/bookings/:id
 */
exports.cancelBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await bookingService.cancel(id, userId);
        return successResponse(res, booking, 'Booking cancelled successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Update booking status (admin only)
 * PUT /api/v1/bookings/:id/status
 */
exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await bookingService.updateStatus(id, status);
        return successResponse(res, booking, 'Booking status updated successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Update payment status (admin/system only)
 * PUT /api/v1/bookings/:id/payment
 */
exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { payment_status, payment_method } = req.body;

        const booking = await bookingService.updatePayment(id, payment_status, payment_method);
        return successResponse(res, booking, 'Payment status updated successfully');
    } catch (error) {
        next(error);
    }
};
