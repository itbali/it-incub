import mongoose from "mongoose";

export class UserDBType {
    constructor(
        public login: string,
        public email: string,
        public createdAt: string,
        public passwordHash: string,
        public passwordSalt: string,
        public registerCode: string | null | undefined,
        public isConfirmed: boolean,
        public refreshTokens: string[] | null | undefined,
        public recoveryCode: string | null | undefined
    ) {
    }
}

const usersSchema = new mongoose.Schema({
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    passwordHash: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    registerCode: {type: String, default: null},
    isConfirmed: {type: Boolean, required: true},
    refreshTokens: {type: [String], default: null},
    recoveryCode: {type: String, default: null}
})

export const UserModel = mongoose.model<UserDBType>('User', usersSchema);