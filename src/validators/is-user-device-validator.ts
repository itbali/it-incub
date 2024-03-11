import {SecurityService} from "../services/security-service";
import {JwtService} from "../application/jwt-service";
import {NextFunction, Request, Response} from "express";

export const isUserDeviceValidator = async (req: Request, res: Response, next:NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.params.deviceId;

    const { data: userId } = JwtService.decodeJwtToken(refreshToken);

    const allDevices = await SecurityService.getAllDevices();
    const isDeviceExist = allDevices?.find(d => d.deviceId === deviceId);

    if (!allDevices || !isDeviceExist) {
        res.sendStatus(404);
        return;
    }

    const userDevices = await SecurityService.getUserDevices(userId);
    console.log({ deviceId, userDevices });
    if (!userDevices || !userDevices.find(d => d.deviceId === deviceId)) {
        res.sendStatus(403);
        return;
    }

    next();
}