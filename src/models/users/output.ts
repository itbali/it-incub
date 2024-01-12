export type UserVM = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
}

export type GetUsersResponse = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserVM[]
}