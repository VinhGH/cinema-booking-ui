// backend/src/utils/constants.js

module.exports = {
    // User Roles
    ROLES: {
        USER: 'user',
        ADMIN: 'admin'
    },

    // Booking Status
    BOOKING_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        CANCELLED: 'cancelled',
        COMPLETED: 'completed'
    },

    // Payment Status
    PAYMENT_STATUS: {
        PENDING: 'pending',
        PAID: 'paid',
        FAILED: 'failed',
        REFUNDED: 'refunded'
    },

    // Movie Status
    MOVIE_STATUS: {
        COMING_SOON: 'coming-soon',
        NOW_SHOWING: 'now-showing',
        ENDED: 'ended'
    },

    // Seat Types
    SEAT_TYPES: {
        STANDARD: 'standard',
        VIP: 'vip',
        COUPLE: 'couple'
    },

    // Screen Types
    SCREEN_TYPES: {
        TWO_D: '2D',
        THREE_D: '3D',
        IMAX: 'IMAX',
        FOUR_DX: '4DX'
    },

    // Age Ratings
    AGE_RATINGS: {
        P: 'P',      // All ages
        T13: 'T13',  // 13+
        T16: 'T16',  // 16+
        T18: 'T18'   // 18+
    },

    // Payment Methods
    PAYMENT_METHODS: {
        VNPAY: 'vnpay',
        MOMO: 'momo',
        ZALOPAY: 'zalopay',
        CASH: 'cash'
    },

    // Discount Types
    DISCOUNT_TYPES: {
        PERCENTAGE: 'percentage',
        FIXED: 'fixed',
        COMBO: 'combo'
    },

    // Concession Categories
    CONCESSION_CATEGORIES: {
        COMBO: 'combo',
        POPCORN: 'popcorn',
        DRINK: 'drink',
        SNACK: 'snack'
    }
};
