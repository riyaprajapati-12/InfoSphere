// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"InfoSphere" <${process.env.GMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log("Email sent successfully via Gmail");
  } catch (error) {
    console.error("Gmail Error:", error);
    throw new Error(`Email Service Error: ${error.message}`); 
  }
};

module.exports = sendEmail;