import jwt from "jsonwebtoken";

export class JwtService {

    public static generateJwtToken(data:string) {
        return jwt.sign({data},process.env.SECRET_KEY as string, {expiresIn: "1h"})
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
        try{
            return jwt.decode(token);
        }
        catch (e) {
            throw new Error(JSON.stringify(e))
        }
    }
}
