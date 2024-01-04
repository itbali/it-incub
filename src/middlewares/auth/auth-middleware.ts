import {NextFunction, Request, Response} from "express";
import {configDotenv} from "dotenv";

configDotenv();
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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

    next();
}