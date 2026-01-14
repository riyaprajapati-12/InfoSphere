const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Debugging ke liye log add karein
    console.log("Attempting to send email to:", options.email);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, // SSL port try karte hain
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, 
        },
        debug: true, // Console mein detail dikhayega
        logger: true  // SMTP traffic log kareya
    });

    const mailOptions = {
        from: `"InfoSphere" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email successfully sent');
    } catch (error) {
        console.error('Nodemailer Error Details:', error);
        throw error; // Controller ko error pass karein
    }
};

module.exports = sendEmail;