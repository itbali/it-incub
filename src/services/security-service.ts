import {UserRepository} from "../repositories/user-repository";
import {DeviceInfo} from "../models/security/devicesInfo";

export class SecurityService {
    static async getDevices(userId: string): Promise<DeviceInfo[] | null> {
        return UserRepository.getUserDevicesInfo(userId)
    }
}