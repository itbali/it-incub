import {UserRepository} from "../repositories/user-repository";
import {DeviceInfo} from "../models/security/devicesInfo";

export class SecurityService {
    static async getDevices(userId: string): Promise<DeviceInfo[] | null> {
        return UserRepository.getUserDevicesInfo(userId)
    }

    static async removeDevicesExceptCurrent(userId: string, deviceId: string) {
        return UserRepository.removeRefreshTokensExceptCurrent(userId, deviceId)
    }

    static async removeDevice(userId: string, deviceId: string) {
        return UserRepository.removeRefreshToken(userId, deviceId)
    }
}