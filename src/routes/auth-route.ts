import {Router, Response, Request} from "express";
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
    res.status(200).send({accessToken:loginResult});
})

authRoute.get("/me", async (req: Request, res: Response) => {
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
        res.sendStatus(401);
        return;
    }
    const user = await AuthService.getUserByToken(authToken);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    res.send(user);
})