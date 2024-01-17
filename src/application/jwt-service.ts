import {LoginModel} from "../models/auth/input";
import {AuthUtil} from "../utils/authUtil";
import {JwtPayload} from "jsonwebtoken";
import {userService} from "../services/user-service";

export class JwtService {
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
        const {id} = AuthUtil.decodeJwtToken(token) as JwtPayload
        console.log(JSON.stringify(AuthUtil.decodeJwtToken))
        return await userService.getUserById(id)
    }
}
