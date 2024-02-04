import {SecurityService} from "../services/security-service";
import {JwtService} from "../application/jwt-service";
import {NextFunction, Request, Response} from "express";

export const isUserDeviceValidator = async (req: Request, res: Response, next:NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const { data: userId } = JwtService.decodeJwtToken(refreshToken);
    const deviceId = req.params.deviceId;
    const userDevices = await SecurityService.getDevices(userId);
    console.log({ deviceId, userDevices });
    if (!userDevices || !userDevices.find(d => d.deviceId === deviceId)) {
        res.sendStatus(403);
        return;
    }
    next();
}