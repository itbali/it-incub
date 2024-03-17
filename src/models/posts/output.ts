export type PostVM = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes?: string[]
        usersLiked?: {
            userId: string,
            likeStatus: string,
        }[],
    }
}

export type PostsGetResponse = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": PostVM[]
}