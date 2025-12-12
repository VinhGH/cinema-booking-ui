// Test SMTP connection
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'cinemabooking9@gmail.com',
        pass: 'oyqroujgpqmgqjef' // NO SPACES!
    }
});

// Test send
transporter.sendMail({
    from: 'CineBook <cinemabooking9@gmail.com>',
    to: 't.vinh.1109z@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email from CineBook'
}, (error, info) => {
    if (error) {
        console.error('❌ Error:', error);
    } else {
        console.log('✅ Email sent:', info.messageId);
    }
    process.exit();
});
