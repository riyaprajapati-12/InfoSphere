// src/utils/sendEmail.js
const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
  // Render environment se API Key uthayenge
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email, // Kisi bhi domain par bhej sakte hain
    from: process.env.SENDER_EMAIL, // Wahi email jo SendGrid par verify kiya hai
    subject: options.subject,
    text: options.message,
    html: `<strong>${options.message}</strong>`,
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