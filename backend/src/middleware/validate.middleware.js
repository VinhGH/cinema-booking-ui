// backend/src/middleware/validate.middleware.js
const { ValidationError } = require('../utils/error');

/**
 * Validate request using Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, query, params)
 */
exports.validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return next(new ValidationError('Validation failed', errors));
        }

        // Replace request property with validated value
        req[property] = value;
        next();
    };
};
