import {LoginModel, UserCreateModel} from "../models/auth/input";
import {JwtService} from "../application/jwt-service";
import {UserService} from "./user-service";
import {AuthUtil} from "../utils/authUtil";
import {JwtPayload} from "jsonwebtoken";
import {UserVM} from "../models/users/output";
import {BcriptService} from "../application/bcript-service";
import {UserRepository} from "../repositories/user-repository";
import {EmailService} from "./email-service";
import {UserDBType} from "../schemas/userDB";
import {inject, injectable} from "inversify";

@injectable()
export class AuthService {
    
    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(UserService) protected userService: UserService,
        @inject(BcriptService) protected scriptService: BcriptService,
        @inject(UserRepository) protected userRepository: UserRepository,
        @inject(EmailService) protected emailService: EmailService
    ) {
    }
    async register({password, login, email}: UserCreateModel): Promise<UserVM | null> {
        const passwordSalt = await this.scriptService.generateSalt()
        const passwordHash = await this.scriptService.generateHash(passwordSalt, password)
        const registerCode = this.jwtService.generateJwtToken(email)

        const user = new UserDBType(
            login,
            email,
            new Date().toISOString(),
            passwordHash,
            passwordSalt,
            registerCode,
            false,
            null,
            null
    )
        const createdUserId = await this.userRepository.createUser(user);
        if (!createdUserId) {
            return null
        }
        await this.emailService.confirmEmail(email, registerCode)
        return {
            createdAt: user.createdAt,
            login: user.login,
            email: user.email,
            id: createdUserId
        }
    }

    async confirmEmail(confirmCode: string): Promise<boolean> {
        const {data: email} = this.jwtService.decodeJwtToken(confirmCode) as JwtPayload
        const user = await this.userService.getUserByEmailOrLogin(email)
        await this.userRepository.updateUser(user!.id, {
            isConfirmed: true,
            registerCode: null
        })
        return true
    }

    async resendConfirmEmail(email: string): Promise<boolean> {
        const user = await this.userService.getUserByEmailOrLogin(email)
        if (!user || user.isConfirmed) {
            return false
        }
        const registerCode = this.jwtService.generateJwtToken(email)
        await this.emailService.confirmEmail(email, registerCode)
        return true
    }

    async login(credentials: LoginModel): Promise<{ accessToken: string, refreshToken: string } | null> {
        const user = await this.userService.getUserByEmailOrLogin(credentials.loginOrEmail)
        if (!user) {
            return null
        }
        if (await AuthUtil.validatePassword(credentials.password, user.passwordSalt, user.passwordHash)) {
            const accessToken = this.jwtService.generateJwtToken(user.id, "10m")
            const refreshToken = this.jwtService.generateJwtToken(user.id, "1h", {deviceId: Date.now().toString(), title:  credentials.userAgentTitle, ip: credentials.ip})
            await this.userRepository.updateUser(user.id, {refreshToken})
            return {accessToken, refreshToken}
        }
        return null
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        const {data: id, deviceId, title, ip} = this.jwtService.decodeJwtToken(refreshToken) as JwtPayload
        const isRefreshTokenValid = await this.userRepository.validateUserRefreshToken(id, refreshToken)
        if (!isRefreshTokenValid) {
            return null
        }
        const newAccessToken = this.jwtService.generateJwtToken(id, "10m")
        await this.userRepository.removeRefreshToken(refreshToken)
        const newRefreshToken = this.jwtService.generateJwtToken(id, "1h", {deviceId, title, ip})
        await this.userRepository.updateUser(id, {refreshToken:newRefreshToken})
        return {accessToken: newAccessToken, refreshToken: newRefreshToken}
    }

    async logout(refreshToken: string): Promise<boolean> {
        const isTokenValid = this.jwtService.verifyJwtToken(refreshToken)
        if (!isTokenValid) {
            return false
        }
        const {data: id} = this.jwtService.decodeJwtToken(refreshToken) as JwtPayload
        const isRefreshTokenValid = await this.userRepository.validateUserRefreshToken(id, refreshToken)
        if (!isRefreshTokenValid) {
            return false
        }
        await this.userRepository.updateUser(id, {refreshToken: null})
        await this.userRepository.removeRefreshToken(refreshToken)
        return true
    }

    async sendRecoveryEmail(email: string): Promise<boolean> {
        const recoveryCode = this.jwtService.generateJwtToken(email)
        await this.userRepository.setUserRecoveryCode(email, recoveryCode)
        await this.emailService.resetPasswordEmail(email, recoveryCode)
        return true
    }
}