import {Router, Request, Response} from "express";
import {SecurityService} from "../services/security-service";
import {JwtService} from "../application/jwt-service";
import {DeviceInfo} from "../models/security/devicesInfo";
import {refreshTokenValidator} from "../validators/refresh-token-validator";

export const securityRoute = Router();

securityRoute.get("/devices", refreshTokenValidator, async (req: Request, res: Response<DeviceInfo[] | null>) => {
    const refreshToken = req.cookies.refreshToken;
    const {data: userId} = JwtService.decodeJwtToken(refreshToken)
    const userDevices = await SecurityService.getDevices(userId)
    res.send(userDevices)
})

securityRoute.delete("/devices", refreshTokenValidator, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const {data: userId, deviceId } = JwtService.decodeJwtToken(refreshToken)
    await SecurityService.removeDevicesExceptCurrent(userId, deviceId)
    res.sendStatus(204)
})

securityRoute.delete("/devices/:deviceId", refreshTokenValidator, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const {data: userId} = JwtService.decodeJwtToken(refreshToken)
    await SecurityService.removeDevice(userId, req.params.deviceId)
    res.sendStatus(204)
});