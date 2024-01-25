import {JwtService} from "../application/jwt-service";
import {JwtPayload} from "jsonwebtoken";
import {userService} from "../services/user-service";

export const checkEmailJwtCode = async (confirmCode: string) => {
    const valid = JwtService.verifyJwtToken(confirmCode)
    if (!valid) {
        throw Error("Incorrect code");
    }
    const {data: email} = JwtService.decodeJwtToken(confirmCode) as JwtPayload
    if (!email) {
        throw Error("Incorrect code");
    }
    const user = await userService.getUserByEmailOrLogin(email)
    if (!user || user.isConfirmed) {
        throw Error("Incorrect code");
    }
    return true;
};