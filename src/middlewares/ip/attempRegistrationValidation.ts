import {NextFunction, Request, Response} from "express";
import {apiRequests} from "../../db/db";

export const attempRegistrationValidation = async (req: Request, res: Response, next: NextFunction) => {
    const requestsCount = await apiRequests.find({IP: req.ip, date: {$gt: new Date(Date.now() - 10000)}}).toArray();
    if (requestsCount.length > 5) {
        res.sendStatus(429);
        return;
    }
    next();
}