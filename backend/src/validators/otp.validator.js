// backend/src/validators/otp.validator.js
const Joi = require('joi');

const otpValidators = {
    // Request password reset - send OTP
    requestPasswordReset: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Email không hợp lệ',
            'any.required': 'Email là bắt buộc'
        })
    }),

    // Verify OTP code
    verifyResetOTP: Joi.object({
        email: Joi.string().email().required(),
        otp_code: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
            'string.length': 'Mã OTP phải có 6 chữ số',
            'string.pattern.base': 'Mã OTP chỉ chứa số',
            'any.required': 'Mã OTP là bắt buộc'
        })
    }),

    // Reset password with OTP
    resetPassword: Joi.object({
        email: Joi.string().email().required(),
        otp_code: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
        new_password: Joi.string().min(6).required().messages({
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
            'any.required': 'Mật khẩu mới là bắt buộc'
        })
    }),

    // Change password (authenticated user)
    changePassword: Joi.object({
        current_password: Joi.string().required().messages({
            'any.required': 'Mật khẩu hiện tại là bắt buộc'
        }),
        new_password: Joi.string().min(6).required().messages({
            'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
            'any.required': 'Mật khẩu mới là bắt buộc'
        })
    })
};

module.exports = otpValidators;
