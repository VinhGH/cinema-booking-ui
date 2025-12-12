// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const otpValidator = require('../validators/otp.validator');
const { validate } = require('../middleware/validate.middleware');

// Password reset routes (public)
router.post(
    '/forgot-password',
    validate(otpValidator.requestPasswordReset, 'body'),
    authController.requestPasswordReset
);

router.post(
    '/verify-reset-otp',
    validate(otpValidator.verifyResetOTP, 'body'),
    authController.verifyResetOTP
);

router.post(
    '/reset-password',
    validate(otpValidator.resetPassword, 'body'),
    authController.resetPassword
);

module.exports = router;
