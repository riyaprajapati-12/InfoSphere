// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465, 
      secure: true, // Render ke liye ye mandatory hai
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, // 16-digit App Password
      },
    });

    await transporter.sendMail({
      from: `"InfoSphere" <${process.env.GMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    });
    console.log("Mail sent successfully to any domain!");
  } catch (error) {
    console.error("Gmail Error:", error);
    throw new Error(`Email Service Error: ${error.message}`); 
  }
};

module.exports = sendEmail;