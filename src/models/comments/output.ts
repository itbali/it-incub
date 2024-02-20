import {LikeStatus} from "../../schemas/commentDB";

export type CommentVM = {
    id: string,
    content: string,
    createdAt: string,
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatus,
    }
}

export type CommentsGetResponse = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": CommentVM[]
}