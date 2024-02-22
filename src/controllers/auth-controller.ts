import {RequestWithBody} from "../models/common/RequestTypes";
import {LoginModel, UserCreateModel} from "../models/auth/input";
import {Request, Response} from "express";
import {AuthService} from "../services/auth-service";
import {meOutput} from "../models/users/output";
import {UserService} from "../services/user-service";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {

    constructor(
        @inject(AuthService) protected authService: AuthService,
        @inject(UserService) protected userService: UserService
    ) {
    }
    async register(req: RequestWithBody<UserCreateModel>, res: Response) {
        const createdUser = await this.authService.register({
            email: req.body.email,
            login: req.body.login,
            password: req.body.password
        });
        if (!createdUser) {
            res.sendStatus(400);
            return;
        }
        res.status(204).send(createdUser);
    }

    async confirmEmail(req: RequestWithBody<{ code: string }>, res: Response) {
        const confirmResult = await this.authService.confirmEmail(req.body.code);
        if (!confirmResult) {
            res.sendStatus(400);
            return;
        }
        res.sendStatus(204);
    }

    async resendEmailConfirmation(req: RequestWithBody<{ email: string }>, res: Response) {
        const confirmResult = await this.authService.resendConfirmEmail(req.body.email);
        if (!confirmResult) {
            res.sendStatus(400);
            return;
        }
        res.sendStatus(204);
    }

    async login(req: RequestWithBody<LoginModel>, res: Response) {
        const userAgentTitle = req.headers["user-agent"]
            ? req.headers["user-agent"]
            : "unknown";
        const loginResult = await this.authService.login({
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
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const refreshResult = await this.authService.refreshToken(refreshToken);
        if (!refreshResult) {
            res.sendStatus(401);
            return;
        }
        res.cookie("refreshToken", refreshResult.refreshToken, {httpOnly: true, sameSite: "strict", secure: true})
        res.status(200).send({accessToken: refreshResult.accessToken});
    }

    async me(req: Request, res: Response<meOutput | number>) {
        const authToken = req.headers.authorization?.split(" ")[1];
        if (!authToken) {
            res.sendStatus(401);
            return;
        }
        const user = await this.userService.getUserByIdFromToken(authToken);
        if (!user) {
            res.sendStatus(401);
            return;
        }
        res.send(user);
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const user = await this.userService.getUserByIdFromToken(refreshToken);
        if (!user) {
            res.sendStatus(401);
            return;
        }
        const logoutResult = await this.authService.logout(refreshToken);
        if (!logoutResult) {
            res.sendStatus(401)
            return
        }
        res.sendStatus(204);
    }

    async passwordRecovery(req: RequestWithBody<{ email: string }>, res: Response) {
        const confirmResult = await this.authService.sendRecoveryEmail(req.body.email);
        if (!confirmResult) {
            res.sendStatus(400);
            return;
        }
        res.sendStatus(204);
    }

    async changePassword(req: RequestWithBody<{ newPassword: string, recoveryCode: string }>, res: Response) {
        const password = req.body.newPassword;
        const code = req.body.recoveryCode;
        const resetPasswordResult = await this.userService.resetPassword(code, password);
        if (!resetPasswordResult) {
            res.sendStatus(400);
            return;
        }
        res.sendStatus(204);
    }
}