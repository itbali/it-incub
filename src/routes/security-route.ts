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