import bcrypt from "bcrypt";

export class BcriptSrvice {
    static async generateHash(salt: string, password: string) {
        return await bcrypt.hash(password, salt);
    }

    static async generateSalt() {
        return await bcrypt.genSalt(10);
    }

    static async validatePasswordWithSalt(password: string, salt: string, hash: string) {
        const passwordHash = await bcrypt.hash(password, salt);
        return passwordHash === hash;
    }
}