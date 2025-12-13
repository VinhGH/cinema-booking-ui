-- =====================================================
-- CREATE WALLET_TRANSACTIONS TABLE
-- Tracks all wallet transactions (refunds, payments, etc.)
-- =====================================================

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('refund', 'payment', 'deposit', 'withdrawal')),
    amount NUMERIC NOT NULL CHECK (amount > 0),
    balance_after NUMERIC NOT NULL CHECK (balance_after >= 0),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_booking_id ON wallet_transactions(booking_id);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);

-- Add comment
COMMENT ON TABLE wallet_transactions IS 'Stores all wallet transaction history for users';
