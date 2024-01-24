import {LoginModel, UserCreateModel} from "../models/auth/input";
import {JwtService} from "../application/jwt-service";
import {userService} from "./user-service";
import {AuthUtil} from "../utils/authUtil";
import {JwtPayload} from "jsonwebtoken";
import {UserVM} from "../models/users/output";
import {BcriptSrvice} from "../application/bcript-srvice";
import {UserDBType} from "../models/db/db";
import {UserRepository} from "../repositories/user-repository";
import {EmailService} from "./email-service";

export class AuthService {
    static async register({password, login, email}: UserCreateModel): Promise<UserVM | null> {
        const passwordSalt =  await BcriptSrvice.generateSalt()
        const passwordHash = await BcriptSrvice.generateHash(passwordSalt, password)
        const registerCode = JwtService.generateJwtToken(email)

        const user: UserDBType = {
            createdAt: new Date().toISOString(),
            login,
            email,
            passwordHash,
            passwordSalt,
            registerCode,
            isConfirmed: false,
        }
        const createdUserId = await UserRepository.createUser(user);
        if(!createdUserId) {
            return null
        }
        await EmailService.confirmEmail(email, registerCode)
        return {
            createdAt: user.createdAt,
            login: user.login,
            email: user.email,
            id: createdUserId
        }
    }

    static async confirmEmail(confirmCode: string): Promise<boolean> {
        const {data:email} = JwtService.decodeJwtToken(confirmCode) as JwtPayload
        const user = await userService.getUserByEmailOrLogin(email)
        await UserRepository.updateUser(user!.id, {
            isConfirmed: true,
            registerCode: null
        })
        return true
    }

    static async resendConfirmEmail(email: string): Promise<boolean> {
        const user = await userService.getUserByEmailOrLogin(email)
        if(!user || user.isConfirmed){
            return false
        }
        const registerCode = JwtService.generateJwtToken(email)
        await EmailService.confirmEmail(email, registerCode)
        return true
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

    static async getUserIdFromToken(token: string) {
        const isTokenValid = JwtService.verifyJwtToken(token)
        if(!isTokenValid){
            return null
        }
        const {data:id} = JwtService.decodeJwtToken(token) as JwtPayload
        return await userService.getUserById(id)
    }
}