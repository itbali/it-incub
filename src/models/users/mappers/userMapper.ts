import {WithId} from "mongodb";
import {UserVM} from "../output";
import {UserDBType} from "../../../schemas/userDB";

export const userMapper = (user: WithId<UserDBType>): UserVM=>{
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}