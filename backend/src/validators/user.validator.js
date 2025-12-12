// backend/src/validators/user.validator.js
const Joi = require('joi');

// Validation schemas for user operations
const userValidators = {
    // Update user profile
    updateProfile: Joi.object({
        full_name: Joi.string().min(2).max(100),
        phone: Joi.string().pattern(/^[0-9]{10,11}$/),
        avatar_url: Joi.string().uri()
    }).min(1), // At least one field required

    // Get user by ID (admin only)
    getUserById: Joi.object({
        id: Joi.string().uuid().required()
    }),

    // Get users with filters (admin only)
    getUsers: Joi.object({
        role: Joi.string().valid('user', 'admin').optional(),
        search: Joi.string().optional(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20)
    })
};

module.exports = userValidators;
