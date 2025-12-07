// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
// const authRoutes = require('./auth.routes');
// const movieRoutes = require('./movie.routes');
// const bookingRoutes = require('./booking.routes');
// const userRoutes = require('./user.routes');

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
            admin: '/admin'
        }
    });
});

// Mount routes
// router.use('/auth', authRoutes);
// router.use('/movies', movieRoutes);
// router.use('/bookings', bookingRoutes);
// router.use('/users', userRoutes);

module.exports = router;
