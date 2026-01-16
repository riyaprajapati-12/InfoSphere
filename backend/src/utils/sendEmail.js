const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const sendEmail = async (options) => {
    try {
        const transport = Nodemailer.createTransport(
            MailtrapTransport({
                token: process.env.MAILTRAP_TOKEN, // Render Dashboard me ye name rakhiye
            })
        );

        await transport.sendMail({
            from: { address: "hello@demomailtrap.co", name: "InfoSphere" },
            to: [options.email],
            subject: options.subject,
            text: options.message,
        });
        
        console.log('Email sent successfully via Mailtrap');
    } catch (error) {
        console.error('Mailtrap Error:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;