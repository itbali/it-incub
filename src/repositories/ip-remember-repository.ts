import {ApiRequestsModel} from "../schemas/apiRequestDb";

export class IpRememberRepository {
    async saveRequestIp(ip: string, URL: string): Promise<void> {
        const requestInstance = new ApiRequestsModel({
            IP: ip,
            URL: URL,
            date: new Date()
        });
        await requestInstance.save();
    }
}