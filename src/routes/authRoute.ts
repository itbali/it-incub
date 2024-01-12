import {Router, Response} from "express";
import {RequestWithBody} from "../models/common/RequestTypes";
import {LoginModel} from "../models/auth/input";
import {AuthService} from "../services/auth-service";
import {loginValidation} from "../validators/login-validator";

export const authRoute = Router();

authRoute.post("/login", loginValidation(), async (req: RequestWithBody<LoginModel>, res: Response) => {
    const loginResult = await AuthService.login(req.body);
    if (!loginResult) {
        res.sendStatus(401);
        return;
    }
    res.sendStatus(204);
})