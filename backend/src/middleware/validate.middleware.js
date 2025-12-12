// backend/src/middleware/validate.middleware.js
const { ValidationError } = require('../utils/error');

/**
 * Validate request using Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, query, params)
 */
exports.validate = (schema, property = 'body') => {
    return (req, res, next) => {
        console.log(`🔍 [Validation] Validating ${property}:`, JSON.stringify(req[property], null, 2));

        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            console.error('❌ [Validation] Validation failed:');
            console.error('❌ [Validation] Errors:', JSON.stringify(errors, null, 2));
            console.error('❌ [Validation] Received data:', JSON.stringify(req[property], null, 2));

            return next(new ValidationError('Validation failed', errors));
        }

        console.log('✅ [Validation] Validation passed');

        // Replace request property with validated value
        req[property] = value;
        next();
    };
};
