import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import {BcriptSrvice} from "../application/bcript-srvice";
import {LoginModel} from "../models/auth/input";
import {userService} from "../services/user-service";
import {JwtService} from "../application/jwt-service";

export class AuthUtil {
    static async validatePassword(password: string, salt: string, hash: string) {
        return BcriptSrvice.validatePasswordWithSalt(password, salt, hash)
    }

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
}