import {WithId} from "mongodb";
import {CommentVM} from "../output";
import {CommentDBType} from "../../../schemas/commentDB";

export const commentMapper = (comment: WithId<CommentDBType>, userId?: string): CommentVM => ({
    id: comment._id.toString(),
    content: comment.content,
    createdAt: comment.createdAt,
    commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
    },
    likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: comment.likesInfo.usersLiked?.find(like => like.userId === userId)?.likeStatus || 'None',
    }
})