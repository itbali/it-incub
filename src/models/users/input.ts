export type UserCreateModel = {
    email: string,
    login: string,
    password: string
}

export type LoginModel = {
    loginOrEmail: string,
    password: string,
}