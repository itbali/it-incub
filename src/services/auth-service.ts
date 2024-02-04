import {LoginModel, UserCreateModel} from "../models/auth/input";
import {JwtService} from "../application/jwt-service";
import {UserService} from "./user-service";
import {AuthUtil} from "../utils/authUtil";
import {JwtPayload} from "jsonwebtoken";
import {UserVM} from "../models/users/output";
import {BcriptSrvice} from "../application/bcript-srvice";
import {UserDBType} from "../models/db/db";
import {UserRepository} from "../repositories/user-repository";
import {EmailService} from "./email-service";

export class AuthService {
    static async register({password, login, email}: UserCreateModel): Promise<UserVM | null> {
        const passwordSalt = await BcriptSrvice.generateSalt()
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
        if (!createdUserId) {
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
        const {data: email} = JwtService.decodeJwtToken(confirmCode) as JwtPayload
        const user = await UserService.getUserByEmailOrLogin(email)
        await UserRepository.updateUser(user!.id, {
            isConfirmed: true,
            registerCode: null
        })
        return true
    }

    static async resendConfirmEmail(email: string): Promise<boolean> {
        const user = await UserService.getUserByEmailOrLogin(email)
        if (!user || user.isConfirmed) {
            return false
        }
        const registerCode = JwtService.generateJwtToken(email)
        await EmailService.confirmEmail(email, registerCode)
        return true
    }

    static async login(credentials: LoginModel): Promise<{ accessToken: string, refreshToken: string } | null> {
        const user = await UserService.getUserByEmailOrLogin(credentials.loginOrEmail)
        if (!user) {
            return null
        }
        if (await AuthUtil.validatePassword(credentials.password, user.passwordSalt, user.passwordHash)) {
            const accessToken = JwtService.generateJwtToken(user.id, 100)
            const refreshToken = JwtService.generateJwtToken(user.id, 2000, {deviceId: Date.now().toString(), title:  credentials.userAgentTitle, ip: credentials.ip})
            await UserRepository.updateUser(user.id, {refreshToken})
            return {accessToken, refreshToken}
        }
        return null
    }

    static async refreshToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        const {data: id, deviceId, title, ip} = JwtService.decodeJwtToken(refreshToken) as JwtPayload
        const isRefreshTokenValid = await UserRepository.validateUserRefreshToken(id, refreshToken)
        if (!isRefreshTokenValid) {
            return null
        }
        const newAccessToken = JwtService.generateJwtToken(id, 100)
        await UserRepository.removeRefreshToken(refreshToken)
        const newRefreshToken = JwtService.generateJwtToken(id, 2000, {deviceId, title, ip})
        await UserRepository.updateUser(id, {refreshToken:newRefreshToken})
        return {accessToken: newAccessToken, refreshToken: newRefreshToken}
    }

    static async logout(refreshToken: string): Promise<boolean> {
        const isTokenValid = JwtService.verifyJwtToken(refreshToken)
        if (!isTokenValid) {
            return false
        }
        const {data: id} = JwtService.decodeJwtToken(refreshToken) as JwtPayload
        const isRefreshTokenValid = await UserRepository.validateUserRefreshToken(id, refreshToken)
        if (!isRefreshTokenValid) {
            return false
        }
        await UserRepository.updateUser(id, {refreshToken: null})
        await UserRepository.removeRefreshToken(refreshToken)
        return true
    }
}