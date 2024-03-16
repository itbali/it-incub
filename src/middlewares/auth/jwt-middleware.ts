import {NextFunction, Request, Response} from "express";
import {userService} from "../../composition-roots/user-composition";

export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const [type, token] = authHeader?.split(" ") ?? [];
    console.log({token})
    if (type !== "Bearer" || !token) {
        res.sendStatus(401)
        return;
    }

    const user = await userService.getUserByIdFromToken(token)
    console.log({user})
    if (!user) {
        res.sendStatus(401)
        return;
    }
    req.userId = user.userId
    next();
}

export const getUserFromTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const [type, token] = authHeader?.split(" ") ?? [];
    console.log({token})
    if (type !== "Bearer" || !token) {
        next();
        return;
    }

    const user = await userService.getUserByIdFromToken(token)
    console.log({user})
    if (!user) {
        next();
        return;
    }
    req.userId = user.userId
    next();
    return;
}