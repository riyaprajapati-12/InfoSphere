// src/utils/sendEmail.js
const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
  // Render environment se API Key uthayenge
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
  to: options.email,
  from: process.env.SENDER_EMAIL,
  subject: "Verify your InfoSphere Account",
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333;">Welcome to InfoSphere!</h2>
      <p>Hello,</p>
      <p>Your one-time password (OTP) for account verification is:</p>
      <h1 style="color: #007bff; letter-spacing: 5px;">${options.message}</h1>
      <p>This code will expire in 10 minutes. Please do not share this code with anyone.</p>
      <hr style="border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
    </div>
  `,
};

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully via SendGrid API");
  } catch (error) {
    console.error("SendGrid API Error:", error.response ? error.response.body : error);
    throw new Error(`Email Service Error: ${error.message}`);
  }
};

module.exports = sendEmail;