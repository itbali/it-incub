import {Router, Response, Request} from "express";
import {RequestWithBody, RequestWithQuery} from "../models/common/RequestTypes";
import {LoginModel, UserCreateModel} from "../models/auth/input";
import {AuthService} from "../services/auth-service";
import {loginValidation} from "../validators/login-validator";
import {registerValidation} from "../validators/register-validatior";
import {emailConfirmationValidator} from "../validators/email-confirmation-validator";
import {emailQueryCodeValidation} from "../validators/email-query-confirmation-validator";

export const authRoute = Router();

authRoute.post("/registration",registerValidation(), async (req: RequestWithBody<UserCreateModel>, res: Response)=>{
    const createdUser = await AuthService.register({
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    });
    if(!createdUser){
        res.sendStatus(400);
        return;
    }
    res.status(204).send(createdUser);
})

authRoute.post("/registration-confirmation", emailQueryCodeValidation(), async (req: RequestWithQuery<{code:string}>,res: Response)=>{
    const confirmResult = await AuthService.confirmEmail(req.query.code);
    if(!confirmResult){
        res.sendStatus(400);
        return;
    }
    res.sendStatus(204);
})

authRoute.post("/registration-email-resending", emailConfirmationValidator(), async (req: RequestWithBody<{email:string}>,res: Response)=>{
    const confirmResult = await AuthService.resendConfirmEmail(req.body.email);
    if(!confirmResult){
        res.sendStatus(400);
        return;
    }
    res.sendStatus(204);
});

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
    const user = await AuthService.getUserIdFromToken(authToken);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    res.send(user);
})
