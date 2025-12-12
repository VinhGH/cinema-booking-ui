// backend/src/controllers/analytics.controller.js
const analyticsService = require('../services/analytics.service');
const { successResponse } = require('../utils/response');

/**
 * Get dashboard statistics
 * GET /api/v1/analytics/dashboard
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        const stats = await analyticsService.getDashboardStats();
        return successResponse(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get revenue trend
 * GET /api/v1/analytics/revenue-trend
 */
exports.getRevenueTrend = async (req, res, next) => {
    try {
        const { months = 6 } = req.query;
        const trend = await analyticsService.getRevenueTrend(parseInt(months));
        return successResponse(res, trend, 'Revenue trend retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get recent bookings
 * GET /api/v1/analytics/recent-bookings
 */
exports.getRecentBookings = async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;
        const bookings = await analyticsService.getRecentBookings(parseInt(limit));
        return successResponse(res, bookings, 'Recent bookings retrieved successfully');
    } catch (error) {
        next(error);
    }
};
