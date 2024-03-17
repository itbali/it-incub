import mongoose from "mongoose";

export class CommentDBType {
    constructor(
        public content: string,
        public createdAt: string,
        public postId: string,
        public postTitle: string,
        public commentatorInfo: {
            userId: string,
            userLogin: string,
        },
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            usersLiked?: {
                userId: string,
                likeStatus: LikeStatus,
            }[],
        }
    ) {
    }
}

const commentsSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
    postTitle: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    extendedLikesInfo: {
        likesCount: { type: Number, default: 0 },
        dislikesCount: { type: Number, default: 0 },
        usersLiked: [{
            userId: { type: String, required: true },
            likeStatus: { type: String, required: true },
        }],
    },
})

export type LikeStatus = 'Like' | 'Dislike' | 'None';

export const CommentsModel = mongoose.model<CommentDBType>('comments', commentsSchema);