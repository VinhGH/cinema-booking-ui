// backend/src/config/supabase.js
const { createClient } = require('@supabase/supabase-js');
const { logger } = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    logger.error('Missing Supabase environment variables');
    throw new Error('Missing Supabase configuration');
}

// Create Supabase client with service role key for backend
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

logger.info('✅ Supabase client initialized');

module.exports = { supabase };
