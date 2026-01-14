const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Must be false for port 587
            auth: {
                user: process.env.EMAIL_USER,
                // Make sure to remove all spaces from the App Password in Render
                pass: process.env.EMAIL_PASS, 
            },
            tls: {
                // This bypasses network-level certificate issues common on cloud servers
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `InfoSphere <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        // Detailed error logging to help you debug in the Render dashboard
        console.error('Error sending email detail:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;