// backend/src/services/email.service.js
const transporter = require('../config/email');
const env = require('../config/env');
const { logger } = require('../utils/logger');

class EmailService {
    /**
     * Send OTP email
     */
    async sendOTP(email, otpCode, purpose = 'password_reset') {
        try {
            const subject = purpose === 'password_reset'
                ? 'Mã OTP đặt lại mật khẩu - CineBook'
                : 'Mã OTP xác minh - CineBook';

            const html = this.getOTPEmailTemplate(otpCode, purpose);

            const mailOptions = {
                from: env.EMAIL_FROM,
                to: email,
                subject,
                html
            };

            const info = await transporter.sendMail(mailOptions);
            logger.info(`OTP email sent to ${email}:`, info.messageId);

            return { success: true, messageId: info.messageId };
        } catch (error) {
            logger.error('EmailService.sendOTP error:', error);
            throw error;
        }
    }

    /**
     * Get OTP email HTML template
     */
    getOTPEmailTemplate(otpCode, purpose) {
        const title = purpose === 'password_reset' ? 'Đặt lại mật khẩu' : 'Xác minh email';
        const message = purpose === 'password_reset'
            ? 'Bạn đã yêu cầu đặt lại mật khẩu. Sử dụng mã OTP bên dưới:'
            : 'Sử dụng mã OTP bên dưới để xác minh:';

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
        }
        .header {
            background: linear-gradient(135deg, #E50914 0%, #B20710 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            color: white;
            font-size: 36px;
            font-weight: bold;
            margin: 0;
        }
        .subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 8px;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #333;
            margin-top: 0;
            font-size: 24px;
        }
        .content p {
            color: #666;
            line-height: 1.6;
            font-size: 16px;
        }
        .otp-box {
            background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
            border: 2px dashed #E50914;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-label {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .otp-code {
            font-size: 42px;
            font-weight: bold;
            color: #E50914;
            letter-spacing: 12px;
            font-family: 'Courier New', monospace;
        }
        .notice {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .notice strong {
            color: #856404;
        }
        .notice ul {
            margin: 10px 0 0 0;
            padding-left: 20px;
        }
        .notice li {
            color: #856404;
            margin: 5px 0;
        }
        .footer {
            background: #f8f8f8;
            padding: 30px;
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #eee;
        }
        .footer a {
            color: #E50914;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">🎬 CineBook</h1>
            <p class="subtitle">Hệ thống đặt vé xem phim trực tuyến</p>
        </div>
        
        <div class="content">
            <h2>${title}</h2>
            <p>${message}</p>
            
            <div class="otp-box">
                <div class="otp-label">MÃ OTP CỦA BẠN</div>
                <div class="otp-code">${otpCode}</div>
            </div>
            
            <div class="notice">
                <strong>⚠️ Lưu ý quan trọng:</strong>
                <ul>
                    <li>Mã OTP có hiệu lực trong <strong>${env.OTP_EXPIRE_MINUTES} phút</strong></li>
                    <li><strong>Không chia sẻ</strong> mã này với bất kỳ ai</li>
                    <li>Nếu bạn không yêu cầu, vui lòng <strong>bỏ qua</strong> email này</li>
                    <li>CineBook sẽ <strong>không bao giờ</strong> yêu cầu mã OTP qua điện thoại</li>
                </ul>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
                Email này được gửi tự động. Vui lòng không trả lời email này.
            </p>
        </div>
        
        <div class="footer">
            <p>© 2025 CineBook. All rights reserved.</p>
            <p>
                <a href="${env.FRONTEND_URL}">Trang chủ</a> | 
                <a href="${env.FRONTEND_URL}/contact">Liên hệ</a> | 
                <a href="${env.FRONTEND_URL}/help">Trợ giúp</a>
            </p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Send welcome email (optional - for future use)
     */
    async sendWelcomeEmail(email, name) {
        try {
            const mailOptions = {
                from: env.EMAIL_FROM,
                to: email,
                subject: 'Chào mừng đến với CineBook! 🎬',
                html: `
                    <h1>Xin chào ${name}!</h1>
                    <p>Cảm ơn bạn đã đăng ký tài khoản CineBook.</p>
                    <p>Bạn đã sẵn sàng để đặt vé xem phim yêu thích!</p>
                `
            };

            const info = await transporter.sendMail(mailOptions);
            logger.info(`Welcome email sent to ${email}:`, info.messageId);

            return { success: true, messageId: info.messageId };
        } catch (error) {
            logger.error('EmailService.sendWelcomeEmail error:', error);
            // Don't throw - welcome email is not critical
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();
