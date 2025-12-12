// backend/src/services/otp.service.js
const { supabase } = require('../config/supabase');
const env = require('../config/env');
const emailService = require('./email.service');
const { logger } = require('../utils/logger');
const { BadRequestError } = require('../utils/error');

class OTPService {
    /**
     * Generate 6-digit OTP code
     */
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Create OTP and send email
     */
    async createOTP(email, purpose = 'password_reset') {
        try {
            // Invalidate all previous OTPs for this email and purpose
            await supabase
                .from('otp_verifications')
                .update({ is_used: true })
                .eq('email', email)
                .eq('purpose', purpose)
                .eq('is_used', false);

            // Generate new OTP
            const otpCode = this.generateOTP();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + env.OTP_EXPIRE_MINUTES);

            // Save to database
            const { data, error } = await supabase
                .from('otp_verifications')
                .insert({
                    email,
                    otp_code: otpCode,
                    purpose,
                    expires_at: expiresAt.toISOString(),
                    is_used: false
                })
                .select()
                .single();

            if (error) throw error;

            // Send email
            await emailService.sendOTP(email, otpCode, purpose);

            logger.info(`OTP created for ${email}, purpose: ${purpose}`);

            return {
                success: true,
                message: 'OTP đã được gửi đến email của bạn',
                expires_in_minutes: env.OTP_EXPIRE_MINUTES
            };
        } catch (error) {
            logger.error('OTPService.createOTP error:', error);
            throw error;
        }
    }

    /**
     * Verify OTP code
     */
    async verifyOTP(email, otpCode, purpose = 'password_reset') {
        try {
            // Find valid OTP
            const { data: otpRecords, error } = await supabase
                .from('otp_verifications')
                .select('*')
                .eq('email', email)
                .eq('otp_code', otpCode)
                .eq('purpose', purpose)
                .eq('is_used', false)
                .gte('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            if (!otpRecords || otpRecords.length === 0) {
                throw new BadRequestError('Mã OTP không hợp lệ hoặc đã hết hạn');
            }

            const otpRecord = otpRecords[0];

            // Mark as used
            await supabase
                .from('otp_verifications')
                .update({ is_used: true })
                .eq('id', otpRecord.id);

            logger.info(`OTP verified for ${email}, purpose: ${purpose}`);

            return {
                success: true,
                message: 'Xác minh OTP thành công',
                otpId: otpRecord.id
            };
        } catch (error) {
            logger.error('OTPService.verifyOTP error:', error);
            throw error;
        }
    }

    /**
     * Check if OTP is valid (without marking as used)
     */
    async isOTPValid(email, otpCode, purpose = 'password_reset') {
        try {
            const { data: otpRecords } = await supabase
                .from('otp_verifications')
                .select('*')
                .eq('email', email)
                .eq('otp_code', otpCode)
                .eq('purpose', purpose)
                .eq('is_used', false)
                .gte('expires_at', new Date().toISOString())
                .limit(1);

            return otpRecords && otpRecords.length > 0;
        } catch (error) {
            logger.error('OTPService.isOTPValid error:', error);
            return false;
        }
    }

    /**
     * Cleanup expired OTPs (optional - can be run as cron job)
     */
    async cleanupExpiredOTPs() {
        try {
            const { data, error } = await supabase
                .from('otp_verifications')
                .delete()
                .lt('expires_at', new Date().toISOString());

            if (error) throw error;

            logger.info(`Cleaned up expired OTPs`);
            return { success: true, deleted: data?.length || 0 };
        } catch (error) {
            logger.error('OTPService.cleanupExpiredOTPs error:', error);
            throw error;
        }
    }
}

module.exports = new OTPService();
