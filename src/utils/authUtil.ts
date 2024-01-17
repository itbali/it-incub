import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export class AuthUtil {
    static async validatePassword(password: string, salt: string, hash: string) {
        const passwordHash = await bcrypt.hash(password, salt);
        return passwordHash === hash;
    }

    static async generateHash(salt: string, password: string) {
        return await bcrypt.hash(password, salt);
    }

    static async generateSalt() {
        return await bcrypt.genSalt(10);
    }

    static generateJwtToken(userId:string) {
        return jwt.sign({id:userId},process.env.SECRET_KEY as string, {expiresIn: "1h"})
    }

    static verifyJwtToken(token: string) {
        try {
            jwt.verify(token, process.env.SECRET_KEY as string);
            return true;
        } catch (e) {
            return false;
        }
    }

    static decodeJwtToken(token: string) {
        return jwt.decode(token);
    }
}