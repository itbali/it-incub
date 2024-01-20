import jwt from "jsonwebtoken";

export class JwtService {

    public static generateJwtToken(userId:string) {
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
