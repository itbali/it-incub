import {UserDBType} from "../models/db/db";
import {GetUsersResponse, UserVM} from "../models/users/output";
import {usersCollection} from "../db/db";
import {userMapper} from "../models/users/mappers/userMapper";
import {ObjectId} from "mongodb";
import {getUserQueryParams} from "../models/users/getUserQueryParams";
import {UserWithHash} from "../models/users/userWithHash";

export class UserRepository {
    static async createUser({createdAt, passwordHash, login, passwordSalt, email}: UserDBType): Promise<string | null> {
        const existingUser = await usersCollection.findOne({$or: [{login}, {email}]})
        if (existingUser) {
            return null
        }

        const createdUser = await usersCollection.insertOne({email, createdAt, login, passwordSalt, passwordHash})
        return createdUser.insertedId.toString()
    }

    static async getUserById(id: string): Promise<UserVM | null> {
        const foundUser = await usersCollection.findOne({_id: new ObjectId(id)})
        return foundUser ? userMapper(foundUser) : null
    }

    static async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserWithHash | null> {
        const foundUser = await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        return foundUser ? {
            email: foundUser.email,
            id: foundUser._id.toString(),
            login: foundUser.login,
            passwordHash: foundUser.passwordHash,
            passwordSalt: foundUser.passwordSalt
        } : null
    }

    static async getAllUsers({
                                 searchLoginTerm,
                                 searchEmailTerm,
                                 pageSize,
                                 pageNumber,
                                 sortDirection,
                                 sortBy
                             }: Required<getUserQueryParams>): Promise<GetUsersResponse> {
        const filter = {
            $or: [
                {email: {$regex: searchEmailTerm, $options: "i"}},
                {login: {$regex: searchLoginTerm, $options: "i"}}]
        };
        const users = await usersCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const usersCount = await usersCollection.countDocuments(filter)
        return {
            pagesCount: Math.ceil(usersCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: users.map(userMapper)
        }
    }

    static async deleteUser(id: string) {
        const foundUser = await usersCollection.findOneAndDelete({_id: new ObjectId(id)})
        return foundUser ? userMapper(foundUser) : null
    }
}