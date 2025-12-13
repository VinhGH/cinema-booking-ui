// backend/src/services/wallet.service.js
const { supabase } = require('../config/supabase');
const { logger } = require('../utils/logger');
const { NotFoundError, BadRequestError } = require('../utils/error');

class WalletService {
    /**
     * Get user's wallet balance
     */
    async getBalance(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('wallet_balance')
                .eq('id', userId)
                .single();

            if (error) throw error;
            if (!data) throw new NotFoundError('User not found');

            return data.wallet_balance || 0;
        } catch (error) {
            logger.error('WalletService.getBalance error:', error);
            throw error;
        }
    }

    /**
     * Get wallet transactions with pagination
     */
    async getTransactions(userId, filters = {}) {
        try {
            let query = supabase
                .from('wallet_transactions')
                .select('*', { count: 'exact' })
                .eq('user_id', userId);

            // Filter by type
            if (filters.type) {
                query = query.eq('type', filters.type);
            }

            // Filter by date range
            if (filters.from_date && filters.to_date) {
                query = query
                    .gte('created_at', filters.from_date)
                    .lte('created_at', filters.to_date);
            }

            // Pagination
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query
                .range(from, to)
                .order('created_at', { ascending: false });

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                transactions: data || [],
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit)
                }
            };
        } catch (error) {
            logger.error('WalletService.getTransactions error:', error);
            throw error;
        }
    }

    /**
     * Add transaction and update balance
     */
    async addTransaction(userId, type, amount, bookingId = null, description = '') {
        try {
            // Get current balance
            const currentBalance = await this.getBalance(userId);

            // Calculate new balance
            let newBalance;
            if (type === 'refund' || type === 'deposit') {
                newBalance = currentBalance + amount;
            } else if (type === 'payment' || type === 'withdrawal') {
                newBalance = currentBalance - amount;
                if (newBalance < 0) {
                    throw new BadRequestError('Insufficient wallet balance');
                }
            } else {
                throw new BadRequestError('Invalid transaction type');
            }

            // Create transaction record
            const { data: transaction, error: txError } = await supabase
                .from('wallet_transactions')
                .insert({
                    user_id: userId,
                    booking_id: bookingId,
                    type,
                    amount,
                    balance_after: newBalance,
                    description
                })
                .select()
                .single();

            if (txError) throw txError;

            // Update user balance
            const { error: updateError } = await supabase
                .from('users')
                .update({ wallet_balance: newBalance })
                .eq('id', userId);

            if (updateError) throw updateError;

            logger.info(`[Wallet] Transaction created: ${type} ${amount} for user ${userId}`);

            return transaction;
        } catch (error) {
            logger.error('WalletService.addTransaction error:', error);
            throw error;
        }
    }

    /**
     * Process refund for cancelled booking
     */
    async processRefund(userId, bookingId, amount, description = 'Hoàn tiền hủy vé') {
        try {
            if (amount <= 0) {
                throw new BadRequestError('Refund amount must be greater than 0');
            }

            const transaction = await this.addTransaction(
                userId,
                'refund',
                amount,
                bookingId,
                description
            );

            logger.info(`[Wallet] Refund processed: ${amount} for booking ${bookingId}`);

            return transaction;
        } catch (error) {
            logger.error('WalletService.processRefund error:', error);
            throw error;
        }
    }
}

module.exports = new WalletService();
