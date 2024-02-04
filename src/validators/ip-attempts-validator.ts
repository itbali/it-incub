import {apiRequests} from "../db/db";
import {NextFunction, Response, Request} from "express";

export const ipAttemptsValidator = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const requestedPath = req.path;

    // find all attempts from one IP-address during 10 seconds to the same URL
    const ipAttempts = await apiRequests.find({IP: ip, URL: requestedPath, date: {$gt: new Date(Date.now() - 10000)}}).toArray();
    const isBlocked = ipAttempts.length > 5;

    if (isBlocked) {
        res.sendStatus(429);
        return;
    }
    next();
}