export type LoginModel = {
    loginOrEmail: string;
    password: string;
    userAgentTitle?: string;
    ip?: string;
}

export type UserCreateModel = {
    email: string;
    login: string;
    password: string;
}