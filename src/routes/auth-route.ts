import {Router, Response, Request} from "express";
import {RequestWithBody, RequestWithQuery} from "../models/common/RequestTypes";
import {LoginModel, UserCreateModel} from "../models/auth/input";
import {AuthService} from "../services/auth-service";
import {loginValidation} from "../validators/login-validator";

export const authRoute = Router();

authRoute.post("/registration",(req: RequestWithBody<UserCreateModel>, res: Response)=>{
    const createdUser = AuthService.register({
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    });
    if(!createdUser){
        res.sendStatus(400);
        return;
    }
    res.status(201).send(createdUser);
})

authRoute.post("/registration-confirmation",(req: RequestWithQuery<{code:string}>,res: Response)=>{
    const confirmResult = AuthService.confirmEmail(req.query.code);
    if(!confirmResult){
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
})

authRoute.post("/registration-email-resending",(req: RequestWithBody<{email:string}>,res: Response)=>{
    const confirmResult = AuthService.resendConfirmEmail(req.body.email);
    if(!confirmResult){
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
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

authRoute.post("/registration-email-resending",(req: Request, res: Response)=>{

})
