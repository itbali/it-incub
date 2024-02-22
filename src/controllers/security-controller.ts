import {Request, Response} from "express";
import {DeviceInfo} from "../models/security/devicesInfo";
import {JwtService} from "../application/jwt-service";
import {SecurityService} from "../services/security-service";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityController {

    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(SecurityService) protected securityService: SecurityService
    ) {
    }
    async getDevices(req: Request, res: Response<DeviceInfo[] | null>) {
        const refreshToken = req.cookies.refreshToken;
        const {data: userId} = this.jwtService.decodeJwtToken(refreshToken)
        const userDevices = await this.securityService.getUserDevices(userId)
        res.send(userDevices)
    }

    async removeDevicesExceptCurrent(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const {data: userId, deviceId} = this.jwtService.decodeJwtToken(refreshToken)
        await this.securityService.removeDevicesExceptCurrent(userId, deviceId)
        res.sendStatus(204)
    }

    async removeDevice(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const deviceId = req.params.deviceId;
        const removeDeviceResult = await this.securityService.removeDevice(deviceId, refreshToken)
        if (!removeDeviceResult) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }
}