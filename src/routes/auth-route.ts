import {Router} from "express";
import {loginValidation} from "../validators/login-validator";
import {registerValidation} from "../validators/register-validatior";
import {emailConfirmationValidator} from "../validators/email-confirmation-validator";
import {emailResendingValidator} from "../validators/email-resending-validatior";
import {refreshTokenValidator} from "../validators/refresh-token-validator";
import {ipAttemptsValidator} from "../validators/ip-attempts-validator";
import {newPasswordValidation} from "../validators/new-password-validator";
import {passwordRecoverEmailValidator} from "../validators/password-recovery-email-validator";
import {authController} from "../composition-roots/auth-composition";

export const authRoute = Router();

authRoute.post("/registration", ipAttemptsValidator, registerValidation(), authController.register.bind(authController));
authRoute.post("/registration-confirmation", ipAttemptsValidator, emailConfirmationValidator(), authController.confirmEmail.bind(authController));
authRoute.post("/registration-email-resending", ipAttemptsValidator, emailResendingValidator(), authController.resendEmailConfirmation.bind(authController));
authRoute.post("/login", ipAttemptsValidator, loginValidation(), authController.login.bind(authController));
authRoute.post("/refresh-token", refreshTokenValidator, authController.refreshToken.bind(authController));
authRoute.get ("/me", authController.me.bind(authController));
authRoute.post("/logout", refreshTokenValidator, authController.logout.bind(authController));
authRoute.post("/password-recovery", ipAttemptsValidator, passwordRecoverEmailValidator(), authController.passwordRecovery.bind(authController));
authRoute.post("/new-password", ipAttemptsValidator, newPasswordValidation(), authController.changePassword.bind(authController));

