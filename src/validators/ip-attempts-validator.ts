import {apiRequests} from "../db/db";
import {NextFunction, Response, Request} from "express";

export const ipAttemptsValidator = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const requestedPath = req.originalUrl.split("?")[0];

    // find all attempts from one IP-address during 10 seconds to the same URL
    const ipAttempts = await apiRequests.find({IP: ip, URL: requestedPath}).toArray();
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10000);
    const filteredIpAttempts = ipAttempts.filter(attempt => attempt.date > tenSecondsAgo);
    const isBlocked = filteredIpAttempts.length >= 5;

    if (isBlocked) {
        res.sendStatus(429);
        return;
    }
    next();
}