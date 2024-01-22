import {createTransport} from "nodemailer"
import {SendEmailModel} from "../models/email/output";
import {configDotenv} from "dotenv";

configDotenv();

const emails = createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASS
    }
})

export class EmailAdapter {
    static async sendEmail({to, subject, html}:SendEmailModel) {
        return await emails.sendMail({
            from: 'Alex <alex.itbali@gmail.com>',
            to: to,
            subject: subject,
            html: html
        })
    }
}