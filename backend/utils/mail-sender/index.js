import nodemailer from "nodemailer"
import "dotenv/config"

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const info = await transporter.sendMail({
            from: "ATULYA KARIGIRI",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log(`info : - > ${info}`);
        return info

    } catch (err) {
        console.log("unable to send mail");
        console.log(err);
        throw err
    }
}

export default mailSender