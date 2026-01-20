const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // must be false for 587
      auth: {
        user: process.env.BREVO_USER,      // verified sender email
        pass: process.env.BREVO_SMTP_KEY,  // Brevo SMTP key
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
    console.error("Brevo Email Error:", error.message);

    // ❗ IMPORTANT: email fail should NOT crash signup
    // so DO NOT throw error
  }
};

module.exports = sendEmail;
