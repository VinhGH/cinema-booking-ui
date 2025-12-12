// backend/src/config/email.js
const nodemailer = require('nodemailer');
const env = require('./env');
const { logger } = require('../utils/logger');

// Create transporter
const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: env.SMTP_PORT || 465,
    secure: env.SMTP_SECURE !== 'false', // true for 465, false for other ports
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        logger.error('SMTP connection error:', error);
    } else {
        logger.info('SMTP server is ready to send emails');
    }
});

module.exports = transporter;
