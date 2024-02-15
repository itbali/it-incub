import {GetUsersResponse, UserVM} from "../models/users/output";
import {userMapper} from "../models/users/mappers/userMapper";
import {getUserQueryParams} from "../models/users/getUserQueryParams";
import {UserWithHash} from "../models/users/userWithHash";
import {JwtService} from "../application/jwt-service";
import {DeviceInfo} from "../models/security/devicesInfo";
import {JwtPayload} from "jsonwebtoken";
import {UserDBType, UserModel} from "../schemas/userDB";

export class UserRepository {
    static async createUser(user: UserDBType): Promise<string | null> {
        const {login, email,} = user
        const existingUser = await UserModel.findOne({$or: [{login}, {email}]}).lean()
        if (existingUser) {
            return null
        }
        const newUserModel = new UserModel(user)
        const createdUser = await newUserModel.save();
        return createdUser._id.toString()
    }

    static async getUserDevicesInfo(id: string): Promise<DeviceInfo[] | null> {
        const user = await UserModel.findOne({_id: id}).lean();
        return user?.refreshTokens
            ? user.refreshTokens.map(rt => {
                const { deviceId,title,ip, iat} = JwtService.decodeJwtToken(rt)
                return {ip, title, deviceId, lastActiveDate: new Date(iat!*1000).toISOString()}
            })
            : null
    }

    static async updateUser(id: string, {isConfirmed, registerCode, refreshToken, passwordHash, recoveryCode}: {
        isConfirmed?: boolean,
        registerCode?: string | null,
        refreshToken?: string | null,
        passwordHash?: string | null,
        recoveryCode?: string | null
    }) {
        const user = await UserModel.findOne({_id: id}).lean()
        const userRefreshTokens = user?.refreshTokens || []
        return UserModel.findOneAndUpdate({_id: id}, {
            $set: {
                isConfirmed,
                registerCode,
                refreshTokens: refreshToken ? [...userRefreshTokens, refreshToken] : userRefreshTokens,
                passwordHash,
                recoveryCode
            }
        });
    }

    static async removeRefreshToken(refreshToken: string) {
        const {data: id, deviceId} = JwtService.decodeJwtToken(refreshToken) as JwtPayload
        const user = await UserModel.findOne({_id: id}).lean()
        const userRefreshTokens = user?.refreshTokens || []
        const refreshTokens = userRefreshTokens.filter(rt => JwtService.decodeJwtToken(rt).deviceId !== deviceId)
        return UserModel.findOneAndUpdate(
            {_id: id},
            {$set: {refreshTokens}}
        );
    }

    static async getUserById(id: string): Promise<UserVM | null> {
        const foundUser = await UserModel.findOne({_id: id}).lean()
        return foundUser ? userMapper(foundUser) : null
    }

    static async validateUserRefreshToken(id: string, refreshToken: string): Promise<boolean> {
        const foundUser = await UserModel.findOne({_id: id}).lean()
        const userRefreshTokens = foundUser?.refreshTokens || []
        return userRefreshTokens.includes(refreshToken)
    }

    static async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserWithHash | null> {
        const foundUser = await UserModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}).lean()
        return foundUser ? {
            email: foundUser.email,
            id: foundUser._id.toString(),
            login: foundUser.login,
            passwordHash: foundUser.passwordHash,
            passwordSalt: foundUser.passwordSalt,
            isConfirmed: foundUser.isConfirmed,
            recoveryCode: foundUser.recoveryCode
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
        const users = await UserModel
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()
        const usersCount = await UserModel.countDocuments(filter)
        return {
            pagesCount: Math.ceil(usersCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: users.map(userMapper)
        }
    }

    static async deleteUser(id: string) {
        const foundUser = await UserModel.findOneAndDelete({_id: id})
        return foundUser ? userMapper(foundUser) : null
    }

    static async removeRefreshTokensExceptCurrent(id: string, deviceId: string) {
        const user = await UserModel.findOne({_id: id})
        const userRefreshTokens = user?.refreshTokens || []
        return UserModel.findOneAndUpdate(
            {_id: id},
            {$set: {refreshTokens: userRefreshTokens.filter(rt => JwtService.decodeJwtToken(rt).deviceId === deviceId)}}
        );
    }

    static async getUserRefreshTokes(id: string): Promise<string[] | null> {
        const user = await UserModel.findOne({_id: id}).lean()
        return user?.refreshTokens || null
    }

    static async getAllDevices(): Promise<DeviceInfo[]> {
        const users = await UserModel.find().lean()
        return users.reduce<DeviceInfo[]>((acc, user) => {
            if (user.refreshTokens) {
                acc.push(...user.refreshTokens.map(rt => {
                    const {deviceId, title, ip, iat} = JwtService.decodeJwtToken(rt)
                    return {deviceId, title, ip, lastActiveDate: new Date(iat!*1000).toISOString()}
                }))
            }
            return acc
        }, [])
    }
    
    static async setUserRecoveryCode(email: string, recoveryCode: string): Promise<UserDBType | null> {
        return UserModel.findOneAndUpdate({email}, {$set: {recoveryCode: recoveryCode}})
    }
}