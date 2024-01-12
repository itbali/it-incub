import {LoginModel} from "../models/auth/input";
import {userService} from "./user-service";
import bcrypt from "bcrypt"

export class AuthService {
    static async login(credentials: LoginModel) {
        const user = await userService.getUserByEmailOrLogin(credentials.loginOrEmail)
        if(!user){
            return null
        }
        const isPasswordValid = await this._validatePassword(credentials.password, user.passwordSalt, user.passwordHash)
        if(!isPasswordValid){
            return null
        }
        return isPasswordValid
    }

    static async _validatePassword(password: string, salt: string, hash: string) {
        const passwordHash = await bcrypt.hash(password, salt)
        return passwordHash === hash
    }
}