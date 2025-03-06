import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const mailSender = async (email, subject, templateName, data) => {
    try { 
        
        const templatePath = path.join(__dirname, `../../mail-template/${templateName}.ejs`);
        const emailTemplate = fs.readFileSync(templatePath, "utf-8");
        const htmlContent = ejs.render(emailTemplate, data);

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT || 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `"Atulya Karigiri" <${process.env.MAIL_USER}>`,
            to: email,
            subject: subject,
            html: htmlContent
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}: ${info.messageId}`);
        return info;
    } catch (err) {
        console.error("Email sending failed:", err);
        throw err;
    }
};

export default mailSender;
