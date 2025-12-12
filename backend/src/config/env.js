// backend/src/config/env.js
require('dotenv').config();

module.exports = {
    // Server
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT) || 5000,
    API_VERSION: process.env.API_VERSION || 'v1',

    // Supabase
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

    // JWT
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

    // Booking
    SEAT_HOLD_DURATION_MINUTES: parseInt(process.env.SEAT_HOLD_DURATION_MINUTES) || 10,
    BOOKING_EXPIRY_HOURS: parseInt(process.env.BOOKING_EXPIRY_HOURS) || 24,

    // Email / SMTP
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT) || 465,
    SMTP_SECURE: process.env.SMTP_SECURE !== 'false',
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_USER,

    // OTP
    OTP_EXPIRE_MINUTES: parseInt(process.env.OTP_EXPIRE_MINUTES) || 5,
};
