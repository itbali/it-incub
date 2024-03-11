import {NextFunction, Response, Request} from "express";
import {ApiRequestsModel} from "../schemas/apiRequestDb";

export const ipAttemptsValidator = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const requestedPath = req.originalUrl.split("?")[0];

    // find all attempts from one IP-address during 10 seconds to the same URL
    const ipAttempts = await ApiRequestsModel.find({IP: ip, URL: requestedPath}).lean();
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10000);
    const filteredIpAttempts = ipAttempts.filter(attempt => attempt.date > tenSecondsAgo);
    const isBlocked = filteredIpAttempts.length > 5;

    if (isBlocked) {
        console.log({isBlocked, ipAttempts, filteredIpAttempts})
        res.sendStatus(429);
        return;
    }
    next();
}