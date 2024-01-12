import {UserDBType} from "../models/db/db";
import {GetUsersResponse, UserVM} from "../models/users/output";
import {usersCollection} from "../db/db";
import {userMapper} from "../models/users/mappers/userMapper";
import {ObjectId} from "mongodb";
import {getUserQueryParams} from "../models/users/getUserQueryParams";

export class userRepository {
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

    static async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
        const foundUser = await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        return foundUser ? foundUser : null
    }

    static async getAllUsers({
                                 searchLoginTerm,
                                 searchEmailTerm,
                                 pageSize,
                                 pageNumber,
                                 sortDirection,
                                 sortBy
                             }: Required<getUserQueryParams>): Promise<GetUsersResponse> {
        const users = await usersCollection
            .find({login: {$regex: searchLoginTerm, $options: "i"}, email: {$regex: searchEmailTerm, $options: "i"}})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const usersCount = await usersCollection.countDocuments({
            login: {$regex: searchLoginTerm, $options: "i"},
            email: {$regex: searchEmailTerm, $options: "i"}
        })
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