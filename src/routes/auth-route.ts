import {Router, Response, Request} from "express";
import {RequestWithBody} from "../models/common/RequestTypes";
import {LoginModel, UserCreateModel} from "../models/auth/input";
import {AuthService} from "../services/auth-service";
import {loginValidation} from "../validators/login-validator";
import {registerValidation} from "../validators/register-validatior";
import {emailConfirmationValidator} from "../validators/email-confirmation-validator";
import {emailResendingValidator} from "../validators/email-resending-validatior";
import {UserService} from "../services/user-service";
import {meOutput} from "../models/users/output";
import {refreshTokenValidator} from "../validators/refresh-token-validator";
import {ipAttemptsValidator} from "../validators/ip-attempts-validator";
import {newPasswordValidation} from "../validators/new-password-validator";
import {passwordRecoverEmailValidator} from "../validators/password-recovery-email-validator";

export const authRoute = Router();

authRoute.post("/registration", ipAttemptsValidator, registerValidation(), async (req: RequestWithBody<UserCreateModel>, res: Response) => {
    const createdUser = await AuthService.register({
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    });
    if (!createdUser) {
        res.sendStatus(400);
        return;
    }
    res.status(204).send(createdUser);
})

authRoute.post("/registration-confirmation", ipAttemptsValidator, emailConfirmationValidator(), async (req: RequestWithBody<{
    code: string
}>, res: Response) => {
    const confirmResult = await AuthService.confirmEmail(req.body.code);
    if (!confirmResult) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(204);
})

authRoute.post("/registration-email-resending", ipAttemptsValidator, emailResendingValidator(), async (req: RequestWithBody<{
    email: string
}>, res: Response) => {
    const confirmResult = await AuthService.resendConfirmEmail(req.body.email);
    if (!confirmResult) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(204);
});

authRoute.post("/login", ipAttemptsValidator, loginValidation(), async (req: RequestWithBody<LoginModel>, res: Response) => {
    const userAgentTitle = req.headers["user-agent"]
        ? req.headers["user-agent"]
        : "unknown";
    const loginResult = await AuthService.login({
        loginOrEmail: req.body.loginOrEmail,
        password: req.body.password,
        userAgentTitle,
        ip: req.ip
    });
    if (!loginResult) {
        res.sendStatus(401);
        return;
    }
    res.cookie("refreshToken", loginResult.refreshToken, {httpOnly: true, secure: true})
    res.status(200).send({accessToken: loginResult.accessToken});
})

authRoute.post("/refresh-token", refreshTokenValidator, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const refreshResult = await AuthService.refreshToken(refreshToken);
    if (!refreshResult) {
        res.sendStatus(401);
        return;
    }
    res.cookie("refreshToken", refreshResult.refreshToken, {httpOnly: true, sameSite: "strict", secure: true})
    res.status(200).send({accessToken: refreshResult.accessToken});
})

authRoute.get("/me", async (req: Request, res: Response<meOutput | number>) => {
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
        res.sendStatus(401);
        return;
    }
    const user = await UserService.getUserByIdFromToken(authToken);
    if (!user) {
        res.sendStatus(401);
        return;
    }
    res.send(user);
})

authRoute.post("/logout", refreshTokenValidator, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const user = await UserService.getUserByIdFromToken(refreshToken);
    if (!user) {
        res.sendStatus(401);
        return;
    }
    const logoutResult = await AuthService.logout(refreshToken);
    if (!logoutResult) {
        res.sendStatus(401)
        return
    }
    res.sendStatus(204);
})
authRoute.post("/password-recovery", ipAttemptsValidator, passwordRecoverEmailValidator(), async (req: RequestWithBody<{
    email: string
}>, res: Response) => {
    const confirmResult = await AuthService.sendRecoveryEmail(req.body.email);
    if (!confirmResult) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(204);
});

authRoute.post("/new-password", ipAttemptsValidator, newPasswordValidation(), async (req: RequestWithBody<{
    newPassword: string,
    recoveryCode: string
}>, res: Response) => {
    const password = req.body.newPassword;
    const code = req.body.recoveryCode;
    const resetPasswordResult = await UserService.resetPassword(code, password);
    if (!resetPasswordResult) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(204);
});

