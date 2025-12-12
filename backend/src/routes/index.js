// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const movieRoutes = require('./movie.routes');
const showtimeRoutes = require('./showtime.routes');
const userRoutes = require('./user.routes');
const bookingRoutes = require('./booking.routes');
const analyticsRoutes = require('./analytics.routes');
const authRoutes = require('./auth.routes');

// API info endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Cinema Booking API',
        version: process.env.API_VERSION || 'v1',
        endpoints: {
            auth: '/auth',
            movies: '/movies',
            showtimes: '/showtimes',
            bookings: '/bookings',
            users: '/users',
            analytics: '/analytics',
            admin: '/admin'
        }
    });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/users', userRoutes);
router.use('/bookings', bookingRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
