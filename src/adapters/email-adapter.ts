import { Resend } from 'resend';
import {SendEmailModel} from "../models/email/output";

const resend = new Resend(process.env.RESEND_SECRET_KEY as string);
export const emails = resend.emails;

export class EmailAdapter {
    static async sendEmail({to, subject, html}:SendEmailModel) {
        return await emails.send({
            from: 'Alex <onboarding@resend.dev>',
            to: to,
            subject: subject,
            html: html
        })
    }
}