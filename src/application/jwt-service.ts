import jwt, {JwtPayload} from "jsonwebtoken";

export class JwtService {

    constructor() {
    }
    generateJwtToken(data:string, expiresIn: string|number = "1h", extraData: ExtraData = {}) {
        const signData = Object.assign({data}, extraData)
        return jwt.sign(signData,process.env.SECRET_KEY as string, {expiresIn})
    }

    verifyJwtToken(token: string) {
        try {
            jwt.verify(token, process.env.SECRET_KEY as string);
            return true;
        } catch (e) {
            return false;
        }
    }

    decodeJwtToken(token: string) {
        try{
            return jwt.decode(token) as JwtPayload;
        }
        catch (e) {
            throw new Error(JSON.stringify(e))
        }
    }
}

type ExtraData = {
    deviceId?: string,
    title?: string,
    ip?: string,
    LastActiveDate?: string
}