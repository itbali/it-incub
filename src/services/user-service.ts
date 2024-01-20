import {UserCreateModel} from "../models/users/input";
import {GetUsersResponse, UserVM} from "../models/users/output";
import {UserDBType} from "../models/db/db";
import {UserRepository} from "../repositories/user-repository";
import {getUserQueryParams} from "../models/users/getUserQueryParams";
import {AuthUtil} from "../utils/authUtil";
import {UserWithHash} from "../models/users/userWithHash";
import {BcriptSrvice} from "../application/bcript-srvice";

export class userService {

    static async createUser({password, login, email}: UserCreateModel): Promise<UserVM | null> {
        const passwordSalt =  await BcriptSrvice.generateSalt()
        const passwordHash = await BcriptSrvice.generateHash(passwordSalt, password)

        const user: UserDBType = {
            createdAt: new Date().toISOString(),
            login,
            email,
            passwordHash,
            passwordSalt,
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
}