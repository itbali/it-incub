import {LoginModel} from "../models/auth/input";
import {userService} from "./user-service";
import {AuthUtil} from "../utils/authUtil";
import {JwtPayload} from "jsonwebtoken";

export class AuthService {
    static async login(credentials: LoginModel) {
        const user = await userService.getUserByEmailOrLogin(credentials.loginOrEmail)
        if(!user){
            return null
        }
        if(await AuthUtil.validatePassword(credentials.password, user.passwordSalt, user.passwordHash)){
            return AuthUtil.generateJwtToken(user.id)
        }
        return null
    }

    static async getUserByToken(token: string) {
        const isTokenValid = AuthUtil.verifyJwtToken(token)
        if(!isTokenValid){
            return null
        }
        const {userId} = AuthUtil.decodeJwtToken(token) as JwtPayload
        return await userService.getUserById(userId)
    }
}