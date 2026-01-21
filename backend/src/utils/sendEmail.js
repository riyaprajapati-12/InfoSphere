// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, // 16-digit (no spaces)
      },
      connectionTimeout: 10000, // 10 seconds wait
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.sendMail({
      from: `"InfoSphere" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    });
  } catch (error) {
    console.error("Gmail Error:", error);
    throw new Error(`Email Service Error: ${error.message}`); 
  }
};

module.exports = sendEmail;