const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');
const otpValidator = require('../validators/otp.validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

// All user routes require authentication
router.use(authenticate);

// User routes (authenticated users)
router.get('/profile', userController.getProfile);

router.put(
    '/profile',
    validate(userValidator.updateProfile, 'body'),
    userController.updateProfile
);

router.post(
    '/change-password',
    validate(otpValidator.changePassword, 'body'),
    userController.changePassword
);

router.get('/bookings', userController.getMyBookings);

// Admin routes
router.get(
    '/stats',
    requireAdmin,
    userController.getStats
);

router.get(
    '/',
    requireAdmin,
    validate(userValidator.getUsers, 'query'),
    userController.getUsers
);

router.get(
    '/:id',
    requireAdmin,
    validate(userValidator.getUserById, 'params'),
    userController.getUserById
);

module.exports = router;
