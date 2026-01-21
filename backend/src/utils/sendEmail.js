// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.BREVO_USER,      
        pass: process.env.BREVO_SMTP_KEY,  
      },
    });

    await transporter.sendMail({
      from: `"InfoSphere" <${process.env.BREVO_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log("Email sent successfully via Brevo");
  } catch (error) {
    console.error("Brevo Email Error details:", error);
    // 🔥 Yahan error throw karein taaki controller ise pakad sake
    throw new Error(`Email Service Error: ${error.message}`); 
  }
};

module.exports = sendEmail;