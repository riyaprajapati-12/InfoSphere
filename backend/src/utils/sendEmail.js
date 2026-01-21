// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 465, // Render par 465 (SSL) zyada stable hai 587 se
      secure: true, 
      auth: {
        user: "apikey", // Yeh fix rahega, "apikey" hi likhna hai
        pass: process.env.SENDGRID_API_KEY, // Aapki lambi API Key
      },
    });

    await transporter.sendMail({
      from: `"InfoSphere" <${process.env.SENDER_EMAIL}>`, // SendGrid par verified email
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log("Email sent successfully via SendGrid");
  } catch (error) {
    console.error("SendGrid Error:", error);
    throw new Error(`Email Service Error: ${error.message}`); 
  }
};

module.exports = sendEmail;