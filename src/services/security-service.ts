import {UserRepository} from "../repositories/user-repository";
import {DeviceInfo} from "../models/security/devicesInfo";
import {JwtService} from "../application/jwt-service";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityService {

    constructor(
        @inject(UserRepository) protected userRepository: UserRepository,
        @inject(JwtService) protected jwtService: JwtService) {
    }

    async getUserDevices(userId: string): Promise<DeviceInfo[] | null> {
        return this.userRepository.getUserDevicesInfo(userId)
    }

    async removeDevicesExceptCurrent(userId: string, deviceId: string) {
        return this.userRepository.removeRefreshTokensExceptCurrent(userId, deviceId)
    }

    async removeDevice(deviceId:string, refreshToken: string) {
        const {data: userId} = this.jwtService.decodeJwtToken(refreshToken)
        const userRefreshTokens = await this.userRepository.getUserRefreshTokes(userId)
        if (!userRefreshTokens) {
            return null
        }
        const refreshTokenForRemove = userRefreshTokens.find(rt => {
            const {deviceId: rtDeviceId} = this.jwtService.decodeJwtToken(rt)
            return rtDeviceId === deviceId
        })
        if (!refreshTokenForRemove) {
            return null
        }
        return this.userRepository.removeRefreshToken(refreshTokenForRemove)
    }

    async getAllDevices() {
        return this.userRepository.getAllDevices()
    }
}