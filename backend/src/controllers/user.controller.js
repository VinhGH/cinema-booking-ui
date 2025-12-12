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

/**
 * Change password (authenticated user)
 * POST /api/v1/users/change-password
 */
exports.changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email; // Email from auth middleware
        const { current_password, new_password } = req.body;

        const { supabase } = require('../config/supabase');
        const { UnauthorizedError, BadRequestError } = require('../utils/error');
        const { logger } = require('../utils/logger');

        logger.info(`Attempting password change for user: ${userId} (${userEmail})`);

        // Verify current password by attempting to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: current_password
        });

        if (signInError) {
            logger.error('Sign in error:', signInError);
            throw new UnauthorizedError('Mật khẩu hiện tại không đúng');
        }

        logger.info('Current password verified');

        // Update password using Supabase Admin API
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
            userId,
            { password: new_password }
        );

        if (updateError) {
            logger.error('Password update error:', updateError);
            throw new BadRequestError('Không thể cập nhật mật khẩu');
        }

        logger.info(`Password changed successfully for user: ${userId}`);

        return successResponse(res, { message: 'Mật khẩu đã được thay đổi thành công' }, 'Password changed successfully');
    } catch (error) {
        next(error);
    }
};
