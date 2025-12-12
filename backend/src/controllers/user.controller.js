// backend/src/controllers/user.controller.js
const userService = require('../services/user.service');
const { successResponse, paginatedResponse } = require('../utils/response');

/**
 * Get current user profile
 * GET /api/v1/users/profile
 */
exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const profile = await userService.getById(userId);
        return successResponse(res, profile, 'Profile retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Update current user profile
 * PUT /api/v1/users/profile
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const profile = await userService.updateProfile(userId, req.body);
        return successResponse(res, profile, 'Profile updated successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user's bookings
 * GET /api/v1/users/bookings
 */
exports.getMyBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookings = await userService.getBookings(userId);
        return successResponse(res, bookings, 'Bookings retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get all users (admin only)
 * GET /api/v1/users
 */
exports.getUsers = async (req, res, next) => {
    try {
        const { role, search, page, limit } = req.query;

        const result = await userService.getAll({
            role,
            search,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        return paginatedResponse(
            res,
            result.users,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Users retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get user by ID (admin only)
 * GET /api/v1/users/:id
 */
exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userService.getById(id);
        return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get user statistics (admin only)
 * GET /api/v1/users/stats
 */
exports.getStats = async (req, res, next) => {
    try {
        const stats = await userService.getStats();
        return successResponse(res, stats, 'Statistics retrieved successfully');
    } catch (error) {
        next(error);
    }
};
