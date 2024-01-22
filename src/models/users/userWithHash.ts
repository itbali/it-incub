export type UserWithHash = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    isConfirmed: boolean,
}