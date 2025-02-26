import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: 'onwenupmtest@gmail.com',
        pass: process.env.OTP_MAIL_PASS
    }
});

export const sendMail = async (subject, text, html, to) => {
    await transporter.sendMail({
        from: '"Onwenu Property Management" <onwenupmtest@gmail.com>',
        to,
        subject: `${subject} - Onwenu PM`,
        text,
        html
    })
};