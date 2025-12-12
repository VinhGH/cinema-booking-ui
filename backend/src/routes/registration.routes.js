// backend/src/routes/registration.routes.js
const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration.controller');
const otpValidator = require('../validators/otp.validator');
const { validate } = require('../middleware/validate.middleware');

/**
 * Registration routes with OTP verification
 */

// Request OTP for registration
router.post(
    '/request-otp',
    validate(otpValidator.requestRegistrationOTP, 'body'),
    registrationController.requestRegistrationOTP
);

// Verify registration OTP
router.post(
    '/verify-otp',
    validate(otpValidator.verifyRegistrationOTP, 'body'),
    registrationController.verifyRegistrationOTP
);

// Complete registration
router.post(
    '/complete',
    validate(otpValidator.completeRegistration, 'body'),
    registrationController.completeRegistration
);

module.exports = router;
