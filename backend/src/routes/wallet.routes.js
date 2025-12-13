// backend/src/routes/wallet.routes.js
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * All wallet routes require authentication
 */
router.use(authenticate);

/**
 * Get wallet balance
 * GET /api/v1/wallet
 */
router.get('/', walletController.getWallet);

/**
 * Get wallet transactions
 * GET /api/v1/wallet/transactions
 */
router.get('/transactions', walletController.getTransactions);

module.exports = router;
