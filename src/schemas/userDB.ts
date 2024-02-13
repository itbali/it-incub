import mongoose from "mongoose";

export type UserDBType = {
    login: string,
    email: string,
    createdAt: string,
    passwordHash: string,
    passwordSalt: string,
    registerCode?: string | null
    isConfirmed: boolean,
    refreshTokens?: string[] | null
    recoveryCode?: string | null
}

const usersSchema = new mongoose.Schema({
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    registerCode: { type: String, default: null },
    isConfirmed: { type: Boolean, required: true },
    refreshTokens: { type: [String], default: null },
    recoveryCode: { type: String, default: null }
})

export const UserModel = mongoose.model<UserDBType>('User', usersSchema);