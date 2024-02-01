import {apiRequests} from "../db/db";

export class IpRememberRepository {
    static async saveRequestIp(ip: string, URL: string): Promise<void> {
        await apiRequests.insertOne({
            IP: ip,
            URL: URL,
            date: new Date()
        });
    }
}