export type BlogDBType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

export type PostDBType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type UserDBType = {
    login: string,
    email: string,
    createdAt:  string,
    passwordHash: string,
    passwordSalt: string,
    registerCode?: string | null
    isConfirmed: boolean,
    refreshToken?: string | null
}

export type CommentDBType = {
    content: string,
    createdAt: string,
    postId: string,
    postTitle: string,
    commentatorInfo: {
        userId: string,
        userLogin: string,
    }
}

type ApiRequest = {IP:string, URL:string, date:Date}
export type ApiRequestDBType = ApiRequest[]