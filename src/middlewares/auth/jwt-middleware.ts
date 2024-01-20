import {NextFunction, Request, Response} from "express";
import {JwtService} from "../../application/jwt-service";
import {AuthService} from "../../services/auth-service";

export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const [type, token] = authHeader?.split(" ") ?? [];
    if (type !== "Bearer" || !token) {
        res.sendStatus(401)
        return;
    }

    const user = await AuthService.getUserByToken(token)
    if (!user) {
        res.sendStatus(401)
        return;
    }
    req.userId = user.id
    next();
}