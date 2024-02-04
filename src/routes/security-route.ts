import {Router, Request, Response} from "express";
import {SecurityService} from "../services/security-service";
import {JwtService} from "../application/jwt-service";
import {DeviceInfo} from "../models/security/devicesInfo";
import {refreshTokenValidator} from "../validators/refresh-token-validator";
import {isUserDeviceValidator} from "../validators/is-user-device-validator";

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

securityRoute.delete("/devices/:deviceId", isUserDeviceValidator, refreshTokenValidator, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.params.deviceId;
    const removeDeviceResult = await SecurityService.removeDevice(deviceId, refreshToken)
    if (!removeDeviceResult) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
});