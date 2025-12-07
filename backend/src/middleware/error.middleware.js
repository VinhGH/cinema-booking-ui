// backend/src/middleware/error.middleware.js
const { logger } = require('../utils/logger');
const { errorResponse } = require('../utils/response');

/**
 * Global error handling middleware
 */
exports.errorHandler = (err, req, res, next) => {
    // Log error
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });

    // Operational errors (known errors)
    if (err.isOperational) {
        return errorResponse(res, err.message, err.statusCode, err.errors);
    }

    // Programming or unknown errors
    if (process.env.NODE_ENV === 'development') {
        return res.status(500).json({
            success: false,
            message: err.message,
            stack: err.stack
        });
    }

    // Production: don't leak error details
    return errorResponse(res, 'Something went wrong', 500);
};

/**
 * Handle 404 errors
 */
exports.notFound = (req, res) => {
    return errorResponse(res, 'Route not found', 404);
};
