import {GetUsersResponse, meOutput, UserVM} from "../models/users/output";
import {UserRepository} from "../repositories/user-repository";
import {getUserQueryParams} from "../models/users/getUserQueryParams";
import {UserWithHash} from "../models/users/userWithHash";
import {BcriptSrvice} from "../application/bcript-srvice";
import {UserCreateModel} from "../models/auth/input";
import {JwtService} from "../application/jwt-service";
import {JwtPayload} from "jsonwebtoken";
import {UserDBType} from "../schemas/userDB";

export class UserService {

    static async createUser({password, login, email}: UserCreateModel): Promise<UserVM | null> {
        const passwordSalt =  await BcriptSrvice.generateSalt()
        const passwordHash = await BcriptSrvice.generateHash(passwordSalt, password)

        const user: UserDBType = {
            createdAt: new Date().toISOString(),
            login,
            email,
            passwordHash,
            passwordSalt,
            isConfirmed: true,
        }
        const createdUserId = await UserRepository.createUser(user);
        if(!createdUserId) {
            return null
        }
        return {
            createdAt: user.createdAt,
            login: user.login,
            email: user.email,
            id: createdUserId
        }
    }

    static async getUserById(id: string): Promise<UserVM | null>{
        return await UserRepository.getUserById(id)
    }


    static async getUserByIdFromToken(token: string): Promise<meOutput | null> {
        const isTokenValid = JwtService.verifyJwtToken(token)
        if (!isTokenValid) {
            return null
        }
        const {data: id} = JwtService.decodeJwtToken(token) as JwtPayload
        const user = await UserService.getUserById(id)
        if(!user){
            return null
        }
        return {
            userId: user.id,
            email: user.email,
            login: user.login
        }
    }

    static async getUserByEmailOrLogin(loginOrEmail: string): Promise<UserWithHash | null>{
        return await UserRepository.getUserByLoginOrEmail(loginOrEmail)
    }

    static async deleteUser(id: string): Promise<UserVM | null>{
        return await UserRepository.deleteUser(id)
    }

    static async getAllUsers(sort: getUserQueryParams): Promise<GetUsersResponse>{
        return await  UserRepository.getAllUsers({
            sortBy: sort.sortBy || "createdAt",
            pageNumber: Number(sort.pageNumber) || 1,
            pageSize: Number(sort.pageSize) || 10,
            searchEmailTerm: sort.searchEmailTerm || "",
            sortDirection: sort.sortDirection || "desc",
            searchLoginTerm: sort.searchLoginTerm || ""
        })
    }

    static async resetPassword(recoveryCode: string, newPassword: string): Promise<boolean> {
        const {data: email} = JwtService.decodeJwtToken(recoveryCode) as JwtPayload
        const user = await UserService.getUserByEmailOrLogin(email)
        console.log({user, recoveryCode, newPassword})
        if (!user) {
            return false
        }
        const isRecoveryCodeValid = user.recoveryCode === recoveryCode
        if (!isRecoveryCodeValid) {
            return false
        }
        const passwordSalt = user.passwordSalt
        const passwordHash = await BcriptSrvice.generateHash(passwordSalt, newPassword)
        await UserRepository.updateUser(user.id, {passwordHash, recoveryCode: null})
        return true
    }
}