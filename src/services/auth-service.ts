import {LoginModel} from "../models/auth/input";
import {JwtService} from "../application/jwt-service";

export class AuthService {
    static async login(credentials: LoginModel) {
        const user = await JwtService.login(credentials)
        if(!user){
            return null
        }
        return user
    }
}