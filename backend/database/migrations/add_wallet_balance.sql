-- =====================================================
-- ADD WALLET_BALANCE TO USERS TABLE
-- Stores user's wallet balance for refunds and payments
-- =====================================================

-- Add wallet_balance column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC DEFAULT 0 CHECK (wallet_balance >= 0);

-- Update existing users to have 0 balance
UPDATE users SET wallet_balance = 0 WHERE wallet_balance IS NULL;

-- Add comment
COMMENT ON COLUMN users.wallet_balance IS 'User wallet balance for refunds and future payments';
