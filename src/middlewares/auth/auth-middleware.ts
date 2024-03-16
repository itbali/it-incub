import {NextFunction, Request, Response} from "express";
import {configDotenv} from "dotenv";
import {UserRepository} from "../../repositories/user-repository";
import {jwtService} from "../../composition-roots/security-composition";

configDotenv();
// BASE64 auth
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const [type, credentials] = authHeader?.split(" ") ?? [];
    if (type !== "Basic") {
        res.sendStatus(401)
        return;
    }

    const [username, password] = Buffer.from(credentials, "base64").toString().split(":");

    if (username !== process.env.AUTH_LOGIN || password !== process.env.AUTH_PASSWORD) {
        res.sendStatus(401)
        return;
    }
    const user = await new UserRepository(jwtService).getUserByLoginOrEmail(username);
    req.userId = user?.id || null;
    next();
}
