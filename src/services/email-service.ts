import {EmailAdapter} from "../adapters/email-adapter";

export class EmailService {
    static confirmEmail(userEmail:string, confirmCode: string) {
        return EmailAdapter.sendEmail({
            to: userEmail,
            subject: 'Confirm your email',
            html: `<h1>Thanks for your registration</h1>
                        <p>To finish registration please follow the link below:
                        <a href='https://somesite.com/confirm-email?code=${confirmCode}'>complete registration</a>
                    </p>`
        })
    }
}