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
    extendedLikesInfo: {
        likesCount: comment.extendedLikesInfo.likesCount,
        dislikesCount: comment.extendedLikesInfo.dislikesCount,
        myStatus: comment.extendedLikesInfo.usersLiked?.find(like => like.userId === userId)?.likeStatus || 'None',
    }
})