import bcrypt from "bcrypt"
import {UserCreateModel} from "../models/users/input";
import {GetUsersResponse, UserVM} from "../models/users/output";
import {UserDBType} from "../models/db/db";
import {userRepository} from "../repositories/user-repository";
import {getUserQueryParams} from "../models/users/getUserQueryParams";

export class userService {

    static async createUser({password, login, email}: UserCreateModel): Promise<UserVM | null> {
        const passwordSalt =  await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(passwordSalt, password)

        const user: UserDBType = {
            createdAt: Date.now().toString(),
            login,
            email,
            passwordHash,
            passwordSalt,
        }
        const createdUserId = await userRepository.createUser(user);
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
        return await userRepository.getUserById(id)
    }

    static async getUserByEmailOrLogin(loginOrEmail: string): Promise<UserDBType | null>{
        return await userRepository.getUserByLoginOrEmail(loginOrEmail)
    }

    static async deleteUser(id: string): Promise<UserVM | null>{
        return await userRepository.deleteUser(id)
    }

    static async getAllUsers(sort: getUserQueryParams): Promise<GetUsersResponse>{
        return await  userRepository.getAllUsers({
            sortBy: sort.sortBy || "CreatedAt",
            pageNumber: Number(sort.pageNumber) || 1,
            pageSize: Number(sort.pageSize) || 10,
            searchEmailTerm: sort.searchEmailTerm || "",
            sortDirection: sort.sortDirection || "desc",
            searchLoginTerm: sort.searchLoginTerm || ""
        })
    }

    static async _generateHash(salt: string, password: string) {
        return await bcrypt.hash(password, salt)
    }
}