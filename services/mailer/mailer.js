const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // Gmail use kar rahe ho to service = "gmail"
    auth: {
        user: process.env.EMAIL_COMPANY, // tumhara company email
        pass: process.env.EMAIL_PASS,    // email ka password ya app password
    },
});

const sendMail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"GLOBEL" <${process.env.EMAIL_COMPANY}>`,
            to,
            subject,
            text,
            html,
        });
        console.log("✅ Email sent:", info.messageId);
    } catch (error) {
        console.error("❌ Email failed:", error.message);
    }
};

module.exports = sendMail;