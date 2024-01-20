import {LoginModel} from "../models/auth/input";
import {JwtService} from "../application/jwt-service";
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
            return JwtService.generateJwtToken(user.id)
        }
        return null
    }

    static async getUserByToken(token: string) {
        const isTokenValid = JwtService.verifyJwtToken(token)
        if(!isTokenValid){
            return null
        }
        const {id} = JwtService.decodeJwtToken(token) as JwtPayload
        return await userService.getUserById(id)
    }
}