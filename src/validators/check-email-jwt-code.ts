import {JwtPayload} from "jsonwebtoken";
import {jwtService} from "../composition-roots/security-composition";
import {userService} from "../composition-roots/user-composition";

export const checkEmailJwtCode = async (confirmCode: string) => {
    const valid = jwtService.verifyJwtToken(confirmCode)
    if (!valid) {
        throw Error("Incorrect code");
    }
    const {data: email} = jwtService.decodeJwtToken(confirmCode) as JwtPayload
    if (!email) {
        throw Error("Incorrect code");
    }
    const user = await userService.getUserByEmailOrLogin(email)
    if (!user || user.isConfirmed) {
        throw Error("Incorrect code");
    }
    return true;
};