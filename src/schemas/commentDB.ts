import mongoose from "mongoose";

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

const commentsSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
    postTitle: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    }
})

export const CommentsModel = mongoose.model<CommentDBType>('comments', commentsSchema);