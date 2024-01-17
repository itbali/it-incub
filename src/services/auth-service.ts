import {LoginModel} from "../models/auth/input";
import bcrypt from "bcrypt"
import {JwtService} from "../application/jwt-service";

export class AuthService {
    static async login(credentials: LoginModel) {
        const user = await JwtService.login(credentials)
        if(!user){
            return null
        }
        return user
    }

    static async _validatePassword(password: string, salt: string, hash: string) {
        const passwordHash = await bcrypt.hash(password, salt)
        return await bcrypt.compare(passwordHash, hash)
    }
}