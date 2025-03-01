import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: 'onwenupmtest@gmail.com',
        pass: process.env.OTP_MAIL_PASS
    }
});

export const sendMail = async (subject, text, html, to) => {
    try {
        await transporter.sendMail({
            from: '"Onwenu Property Management" <onwenupmtest@gmail.com>',
            to,
            subject: `${subject} - Onwenu PM`,
            text,
            html
        })
    } catch (error) {
        console.log("Cannot send mail");
    }
};