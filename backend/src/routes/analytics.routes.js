// backend/src/routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

// All analytics routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Analytics routes
router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/revenue-trend', analyticsController.getRevenueTrend);
router.get('/recent-bookings', analyticsController.getRecentBookings);

module.exports = router;
