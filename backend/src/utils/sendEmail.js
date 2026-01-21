// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.elasticemail.com",
      port: 2525, // Ya 587
      auth: {
        user: process.env.ELASTIC_USER,
        pass: process.env.ELASTIC_API_KEY,
      },
    });

    await transporter.sendMail({
      from: `"InfoSphere" <${process.env.ELASTIC_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log("Email sent successfully via Elastic Email");
  } catch (error) {
    console.error("Email Error:", error);
    throw new Error(`Email Service Error: ${error.message}`); 
  }
};

module.exports = sendEmail;