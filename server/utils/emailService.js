// server/utils/emailService.js
const nodemailer = require('nodemailer');

// For development, we can use ethereal.email or a mock
// For production, use Gmail/SendGrid/etc.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : ''
  }
});

const sendEmail = async ({ to, subject, html }) => {
  // Fallback for development if no credentials are provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('-------------------------------------------');
    console.log('📧 MOCK EMAIL SENT (No credentials in .env)');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Body:', html.replace(/<[^>]*>?/gm, '')); // Strip HTML for console readability
    console.log('-------------------------------------------');
    return { messageId: 'mock-id-' + Date.now() };
  }

  try {
    const info = await transporter.sendMail({
      from: '"NAAC Portal" <noreply@naacportal.com>',
      to,
      subject,
      html
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    // Don't throw error to avoid crashing the request, just log it
    return null;
  }
};

module.exports = { sendEmail };
