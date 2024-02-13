import {EmailAdapter} from "../adapters/email-adapter";

export class EmailService {
    static confirmEmail(userEmail:string, confirmCode: string) {
        return EmailAdapter.sendEmail({
            to: userEmail,
            subject: 'Confirm your email',
            html: `<h1>Thanks for your registration</h1>
                        <p>To finish registration please follow the link below:
                        <a href='https://it-incub.vercel.app/auth/registration-confirmation?code=${confirmCode}'>complete registration</a>
                    </p>`
        })
    }

    static resetPasswordEmail(userEmail:string, resetCode: string) {
        return EmailAdapter.sendEmail({
            to: userEmail,
            subject: 'Reset your password',
            html: `<h1>Reset your password</h1>
                        <p>To reset your password please follow the link below:
                        <a href='https://it-incub.vercel.app/auth/password-reset?code=${resetCode}'>reset password</a>
                    </p>`
        })
    }
}