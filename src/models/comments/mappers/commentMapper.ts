import {WithId} from "mongodb";
import {CommentDBType} from "../../db/db";
import {CommentVM} from "../output";

export const commentMapper = (comment: WithId<CommentDBType>): CommentVM => ({
    id: comment._id.toString(),
    content: comment.content,
    createdAt: comment.createdAt,
    commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
    }
})