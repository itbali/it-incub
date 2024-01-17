export type CommentVM = {
    id: string,
    content: string,
    createdAt: string,
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
}

export type CommentsGetResponse = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": CommentVM[]
}