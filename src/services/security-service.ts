import {UserRepository} from "../repositories/user-repository";
import {DeviceInfo} from "../models/security/devicesInfo";
import {JwtService} from "../application/jwt-service";

export class SecurityService {
    static async getDevices(userId: string): Promise<DeviceInfo[] | null> {
        return UserRepository.getUserDevicesInfo(userId)
    }

    static async removeDevicesExceptCurrent(userId: string, deviceId: string) {
        return UserRepository.removeRefreshTokensExceptCurrent(userId, deviceId)
    }

    static async removeDevice(deviceId:string, refreshToken: string) {
        const {data: userId} = JwtService.decodeJwtToken(refreshToken)
        const userRefreshTokens = await UserRepository.getUserRefreshTokes(userId)
        if (!userRefreshTokens) {
            return null
        }
        const refreshTokenForRemove = userRefreshTokens.find(rt => {
            const {deviceId: rtDeviceId} = JwtService.decodeJwtToken(rt)
            return rtDeviceId === deviceId
        })
        if (!refreshTokenForRemove) {
            return null
        }
        return UserRepository.removeRefreshToken(refreshTokenForRemove)
    }
}