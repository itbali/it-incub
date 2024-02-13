import {WithId} from "mongodb";
import {CommentVM} from "../output";
import {CommentDBType} from "../../../schemas/commentDB";

export const commentMapper = (comment: WithId<CommentDBType>): CommentVM => ({
    id: comment._id.toString(),
    content: comment.content,
    createdAt: comment.createdAt,
    commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
    }
})