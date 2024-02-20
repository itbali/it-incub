import {GetUsersResponse, meOutput, UserVM} from "../models/users/output";
import {UserRepository} from "../repositories/user-repository";
import {getUserQueryParams} from "../models/users/getUserQueryParams";
import {UserWithHash} from "../models/users/userWithHash";
import {BcriptService} from "../application/bcript-service";
import {UserCreateModel} from "../models/auth/input";
import {JwtService} from "../application/jwt-service";
import {JwtPayload} from "jsonwebtoken";
import {UserDBType} from "../schemas/userDB";

export class UserService {

    constructor(protected userRepository: UserRepository, protected jwtService: JwtService, protected bcriptService: BcriptService) {
    }

    async createUser({password, login, email}: UserCreateModel): Promise<UserVM | null> {

        const passwordSalt = await this.bcriptService.generateSalt()
        const passwordHash = await this.bcriptService.generateHash(passwordSalt, password)

        const user = new UserDBType(login, email, new Date().toISOString(), passwordHash, passwordSalt, null, true, null, null)
        const createdUserId = await this.userRepository.createUser(user);
        if (!createdUserId) {
            return null
        }
        return {
            createdAt: user.createdAt,
            login: user.login,
            email: user.email,
            id: createdUserId
        }
    }

    async getUserById(id: string): Promise<UserVM | null> {
        return await this.userRepository.getUserById(id)
    }


    async getUserByIdFromToken(token: string): Promise<meOutput | null> {
        const isTokenValid = this.jwtService.verifyJwtToken(token)
        if (!isTokenValid) {
            return null
        }
        const {data: id} = this.jwtService.decodeJwtToken(token) as JwtPayload
        const user = await this.getUserById(id)
        if (!user) {
            return null
        }
        return {
            userId: user.id,
            email: user.email,
            login: user.login
        }
    }

    async getUserByEmailOrLogin(loginOrEmail: string): Promise<UserWithHash | null> {
        return await this.userRepository.getUserByLoginOrEmail(loginOrEmail)
    }

    async deleteUser(id: string): Promise<UserVM | null> {
        return await this.userRepository.deleteUser(id)
    }

    async getAllUsers(sort: getUserQueryParams): Promise<GetUsersResponse> {
        return await this.userRepository.getAllUsers({
            sortBy: sort.sortBy || "createdAt",
            pageNumber: Number(sort.pageNumber) || 1,
            pageSize: Number(sort.pageSize) || 10,
            searchEmailTerm: sort.searchEmailTerm || "",
            sortDirection: sort.sortDirection || "desc",
            searchLoginTerm: sort.searchLoginTerm || ""
        })
    }

    async resetPassword(recoveryCode: string, newPassword: string): Promise<boolean> {
        const {data: email} = this.jwtService.decodeJwtToken(recoveryCode) as JwtPayload
        const user = await this.getUserByEmailOrLogin(email)
        if (!user) {
            return false
        }
        const isRecoveryCodeValid = user.recoveryCode === recoveryCode
        if (!isRecoveryCodeValid) {
            return false
        }
        const passwordSalt = user.passwordSalt
        const passwordHash = await this.bcriptService.generateHash(passwordSalt, newPassword)
        await this.userRepository.updateUser(user.id, {passwordHash, recoveryCode: null})
        return true
    }
}