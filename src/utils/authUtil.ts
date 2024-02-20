import {LoginModel} from "../models/auth/input";
import {bcriptService, jwtService} from "../composition-roots/security-composition";
import {userService} from "../composition-roots/user-composition";

export class AuthUtil {
    static async validatePassword(password: string, salt: string, hash: string) {
        return bcriptService.validatePasswordWithSalt(password, salt, hash)
    }

    //TODO CHECKUP
    static async login(credentials: LoginModel) {
        const user = await userService.getUserByEmailOrLogin(credentials.loginOrEmail)
        if(!user){
            return null
        }
        if(await AuthUtil.validatePassword(credentials.password, user.passwordSalt, user.passwordHash)){
            return jwtService.generateJwtToken(user.id)
        }
        return null
    }
}