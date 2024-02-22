import bcrypt from "bcrypt";
import {injectable} from "inversify";

@injectable()
export class BcriptService {
    constructor() {
    }
    async generateHash(salt: string, password: string) {
        return await bcrypt.hash(password, salt);
    }

    async generateSalt() {
        return await bcrypt.genSalt(10);
    }

    async validatePasswordWithSalt(password: string, salt: string, hash: string) {
        const passwordHash = await bcrypt.hash(password, salt);
        return passwordHash === hash;
    }
}