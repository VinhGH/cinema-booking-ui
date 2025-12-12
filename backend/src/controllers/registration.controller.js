// backend/src/controllers/registration.controller.js
const { supabase } = require('../config/supabase');
const otpService = require('../services/otp.service');
const { successResponse } = require('../utils/response');
const { BadRequestError, ConflictError } = require('../utils/error');
const { logger } = require('../utils/logger');

/**
 * Request registration OTP - Send OTP to email
 * POST /api/v1/auth/register/request-otp
 */
exports.requestRegistrationOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        logger.info(`Registration OTP requested for email: ${email}`);

        // Check if email already exists in Supabase Auth
        const { data: { users }, error } = await supabase.auth.admin.listUsers();

        if (error) {
            logger.error('Error checking existing users:', error);
            throw new BadRequestError('Không thể xác minh email');
        }

        const emailExists = users && users.some(u => u.email === email);

        if (emailExists) {
            throw new ConflictError('Email đã được đăng ký');
        }

        // Send OTP
        await otpService.createOTP(email, 'registration');

        logger.info(`Registration OTP sent to: ${email}`);

        return successResponse(
            res,
            {
                message: 'Mã OTP đã được gửi đến email của bạn',
                expires_in_minutes: 5
            },
            'Registration OTP sent'
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Verify registration OTP
 * POST /api/v1/auth/register/verify-otp
 */
exports.verifyRegistrationOTP = async (req, res, next) => {
    try {
        const { email, otp_code } = req.body;

        logger.info(`Verifying registration OTP for: ${email}`);

        // Only check if OTP is valid, don't mark as used yet
        const isValid = await otpService.isOTPValid(email, otp_code, 'registration');

        if (!isValid) {
            throw new BadRequestError('Mã OTP không hợp lệ hoặc đã hết hạn');
        }

        logger.info(`Registration OTP verified for: ${email}`);

        return successResponse(res, {
            success: true,
            message: 'Xác minh OTP thành công'
        }, 'OTP verified successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Complete registration with OTP
 * POST /api/v1/auth/register/complete
 */
exports.completeRegistration = async (req, res, next) => {
    try {
        const { email, otp_code, full_name, phone, password } = req.body;

        logger.info(`Completing registration for: ${email}`);

        // Verify OTP is still valid
        const isValid = await otpService.isOTPValid(email, otp_code, 'registration');
        if (!isValid) {
            throw new BadRequestError('Mã OTP không hợp lệ hoặc đã hết hạn');
        }

        // Check if email already exists (double-check)
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            logger.error('Error checking existing users:', listError);
            throw new BadRequestError('Không thể xác minh email');
        }

        const emailExists = users && users.some(u => u.email === email);
        if (emailExists) {
            throw new ConflictError('Email đã được đăng ký');
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email since we verified via OTP
            user_metadata: {
                full_name,
                phone
            }
        });

        if (authError) {
            logger.error('Auth user creation error:', authError);
            throw new BadRequestError('Không thể tạo tài khoản');
        }

        // Create user profile in database
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                full_name,
                phone,
                role: 'user',
                loyalty_points: 0,
                reward_points: 0
            });

        if (profileError) {
            logger.error('Profile creation error:', profileError);
            // Rollback: delete auth user
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw new BadRequestError('Không thể tạo hồ sơ người dùng');
        }

        // Mark OTP as used
        await otpService.verifyOTP(email, otp_code, 'registration');

        logger.info(`Registration completed successfully for: ${email}`);

        return successResponse(
            res,
            {
                message: 'Đăng ký thành công! Vui lòng đăng nhập.',
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    full_name
                }
            },
            'Registration completed successfully',
            201
        );
    } catch (error) {
        next(error);
    }
};
