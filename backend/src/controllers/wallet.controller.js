// backend/src/controllers/wallet.controller.js
const walletService = require('../services/wallet.service');
const { successResponse, paginatedResponse } = require('../utils/response');

/**
 * Get user's wallet balance
 * GET /api/v1/wallet
 */
exports.getWallet = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const balance = await walletService.getBalance(userId);

        return successResponse(res, { balance }, 'Wallet balance retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get wallet transactions
 * GET /api/v1/wallet/transactions
 */
exports.getTransactions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { type, from_date, to_date, page, limit } = req.query;

        const result = await walletService.getTransactions(userId, {
            type,
            from_date,
            to_date,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        return paginatedResponse(
            res,
            result.transactions,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Transactions retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};
