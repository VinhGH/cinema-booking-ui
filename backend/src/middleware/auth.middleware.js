// backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const { AuthenticationError, AuthorizationError } = require('../utils/error');

/**
 * Verify JWT token and authenticate user
 */
exports.authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            throw new AuthenticationError('Invalid or expired token');
        }

        // Get user profile from database
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            role: profile?.role || 'user',
            ...profile
        };

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Check if user is admin
 */
exports.requireAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            throw new AuthenticationError('Authentication required');
        }

        if (req.user.role !== 'admin') {
            throw new AuthorizationError('Admin access required');
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Optional authentication (doesn't fail if no token)
 */
exports.optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        const { data: { user } } = await supabase.auth.getUser(token);

        if (user) {
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            req.user = {
                id: user.id,
                email: user.email,
                role: profile?.role || 'user',
                ...profile
            };
        }

        next();
    } catch (error) {
        // Don't fail, just continue without user
        next();
    }
};
