import {UserDBType} from "../models/db/db";
import {GetUsersResponse, UserVM} from "../models/users/output";
import {usersCollection} from "../db/db";
import {userMapper} from "../models/users/mappers/userMapper";
import {ObjectId} from "mongodb";
import {getUserQueryParams} from "../models/users/getUserQueryParams";
import {UserWithHash} from "../models/users/userWithHash";
import {JwtService} from "../application/jwt-service";
import {DeviceInfo} from "../models/security/devicesInfo";

export class UserRepository {
    static async createUser({
                                createdAt,
                                passwordHash,
                                login,
                                passwordSalt,
                                email,
                                isConfirmed,
                                registerCode
                            }: UserDBType): Promise<string | null> {
        const existingUser = await usersCollection.findOne({$or: [{login}, {email}]})
        if (existingUser) {
            return null
        }

        const createdUser = await usersCollection.insertOne({
            email,
            createdAt,
            login,
            passwordSalt,
            passwordHash,
            isConfirmed,
            registerCode
        })
        return createdUser.insertedId.toString()
    }

    static async getUserDevicesInfo(id: string): Promise<DeviceInfo[] | null> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        return user?.refreshTokens
            ? user.refreshTokens.map(rt => {
                const { deviceId,title,ip, iat} = JwtService.decodeJwtToken(rt)
                return {ip, title, deviceId, lastActiveDate: new Date(iat!*1000).toString()}
            })
            : null
    }

    static async updateUser(id: string, {isConfirmed, registerCode, refreshToken}: {
        isConfirmed?: boolean,
        registerCode?: string | null,
        refreshToken?: string | null
    }) {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        const userRefreshTokens = user?.refreshTokens || []
        return await usersCollection.findOneAndUpdate({_id: new ObjectId(id)}, {
            $set: {
                isConfirmed,
                registerCode,
                refreshTokens: refreshToken ? [...userRefreshTokens, refreshToken] : userRefreshTokens
            }
        })
    }

    static async removeRefreshToken(id: string, refreshToken: string) {
        const userRefreshTokens = await UserRepository.getUserDevicesInfo(id) || []
        const {deviceId} = JwtService.decodeJwtToken(refreshToken)
        return await usersCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: {refreshToken: userRefreshTokens.filter(rt => rt.deviceId !== deviceId)}}
        )
    }

    static async getUserById(id: string): Promise<UserVM | null> {
        const foundUser = await usersCollection.findOne({_id: new ObjectId(id)})
        return foundUser ? userMapper(foundUser) : null
    }

    static async validateUserRefreshToken(id: string, refreshToken: string): Promise<boolean> {
        const foundUser = await usersCollection.findOne({_id: new ObjectId(id), refreshToken})
        return !!foundUser
    }

    static async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserWithHash | null> {
        const foundUser = await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        return foundUser ? {
            email: foundUser.email,
            id: foundUser._id.toString(),
            login: foundUser.login,
            passwordHash: foundUser.passwordHash,
            passwordSalt: foundUser.passwordSalt,
            isConfirmed: foundUser.isConfirmed
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