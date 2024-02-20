import {NextFunction, Request, Response} from "express";
import {jwtService, securityService} from "../composition-roots/security-composition";

export const isUserDeviceValidator = async (req: Request, res: Response, next:NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.params.deviceId;

    const { data: userId } = jwtService.decodeJwtToken(refreshToken);

    const allDevices = await securityService.getAllDevices();
    const isDeviceExist = allDevices?.find(d => d.deviceId === deviceId);

    if (!allDevices || !isDeviceExist) {
        res.sendStatus(404);
        return;
    }

    const userDevices = await securityService.getUserDevices(userId);
    if (!userDevices || !userDevices.find(d => d.deviceId === deviceId)) {
        res.sendStatus(403);
        return;
    }
    next();
}