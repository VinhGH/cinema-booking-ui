// backend/src/controllers/auth.controller.js
const { supabase } = require('../config/supabase');
const otpService = require('../services/otp.service');
const { successResponse } = require('../utils/response');
const { BadRequestError, UnauthorizedError } = require('../utils/error');
const { logger } = require('../utils/logger');

/**
 * Request password reset - Send OTP to email
 * POST /api/v1/auth/forgot-password
 */
exports.requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;

        logger.info(`Password reset requested for email: ${email}`);

        // Check if user exists in Supabase Auth
        // We use listUsers to check if email exists
        const { data: { users }, error } = await supabase.auth.admin.listUsers();

        const userExists = users && users.some(u => u.email === email);

        // Always return success to prevent email enumeration
        // But only send OTP if user exists
        if (userExists) {
            logger.info(`User found, sending OTP to: ${email}`);
            await otpService.createOTP(email, 'password_reset');
        } else {
            logger.info(`User not found for email: ${email}, but returning success for security`);
        }

        // Always return success message
        return successResponse(
            res,
            {
                message: 'Nếu email tồn tại trong hệ thống, mã OTP đã được gửi đến email của bạn',
                expires_in_minutes: 5
            },
            'OTP request processed'
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Verify reset OTP
 * POST /api/v1/auth/verify-reset-otp
 */
exports.verifyResetOTP = async (req, res, next) => {
    try {
        const { email, otp_code } = req.body;

        // Only check if OTP is valid, don't mark as used yet
        // It will be marked as used in resetPassword after successful password update
        const isValid = await otpService.isOTPValid(email, otp_code, 'password_reset');

        if (!isValid) {
            throw new BadRequestError('Mã OTP không hợp lệ hoặc đã hết hạn');
        }

        return successResponse(res, {
            success: true,
            message: 'Xác minh OTP thành công'
        }, 'OTP verified successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Reset password with OTP
 * POST /api/v1/auth/reset-password
 */
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp_code, new_password } = req.body;

        // Verify OTP is still valid
        const isValid = await otpService.isOTPValid(email, otp_code, 'password_reset');
        if (!isValid) {
            throw new BadRequestError('Mã OTP không hợp lệ hoặc đã hết hạn');
        }

        // Get user from Supabase Auth
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            logger.error('Error listing users:', listError);
            throw new BadRequestError('Không thể xác minh người dùng');
        }

        const user = users.find(u => u.email === email);

        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }

        // Update password in Supabase Auth
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: new_password }
        );

        if (updateError) {
            logger.error('Password update error:', updateError);
            throw new BadRequestError('Không thể cập nhật mật khẩu');
        }

        // Mark OTP as used
        await otpService.verifyOTP(email, otp_code, 'password_reset');

        logger.info(`Password reset successful for user: ${email}`);

        return successResponse(
            res,
            { message: 'Mật khẩu đã được đặt lại thành công' },
            'Password reset successful'
        );
    } catch (error) {
        next(error);
    }
};
