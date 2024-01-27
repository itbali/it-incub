import jwt from "jsonwebtoken";

export class JwtService {

    public static generateJwtToken(data:string, expiresIn: string|number = "1h") {
        return jwt.sign({data},process.env.SECRET_KEY as string, {expiresIn})
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
