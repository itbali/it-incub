import {WithId} from "mongodb";
import {UserDBType} from "../../db/db";
import {UserVM} from "../output";

export const userMapper = (user: WithId<UserDBType>): UserVM=>{
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}