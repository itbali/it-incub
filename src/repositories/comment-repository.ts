import {CommentsGetResponse, CommentVM} from "../models/comments/output";
import {commentMapper} from "../models/comments/mappers/commentMapper";
import {CommentsQueryParams} from "../models/comments/query-params";
import {CommentDBType, CommentsModel, LikeStatus} from "../schemas/commentDB";
import {injectable} from "inversify";

@injectable()
export class CommentRepository {
    async create(commentToCreate: CommentDBType): Promise<CommentVM | null> {
        const createdComment = await CommentsModel.create(commentToCreate);
        if (!createdComment) {
            return null;
        }
        return commentMapper(createdComment, commentToCreate.commentatorInfo.userId);
    }

    async getCommentsByPostId({
                                  postId,
                                  pageNumber,
                                  pageSize,
                                  sortBy,
                                  sortDirection
                              }: Required<CommentsQueryParams>, userId?: string): Promise<CommentsGetResponse> {
        const comments = await CommentsModel
            .find({postId: postId})
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();
        const commentsCount = await CommentsModel.countDocuments({postId: postId});
        return {
            items: comments.map(comment => commentMapper(comment, userId)),
            totalCount: commentsCount,
            pageSize,
            page: pageNumber,
            pagesCount: Math.ceil(commentsCount / pageSize),
        };
    }

    async getCommentById(id: string, userId?: string): Promise<CommentVM | null> {
        const comment = await CommentsModel.findOne({_id: id}).lean();
        return comment ? commentMapper(comment, userId) : null;
    }

    async updateComment(comment: CommentVM): Promise<CommentVM | null> {
        const updatedComment = await CommentsModel.findOneAndUpdate(
            {_id: comment.id},
            {$set: {...comment}}
        );
        return updatedComment ? comment : null;
    }

    async deleteComment(id: string): Promise<CommentVM | null> {
        const deletedComment = await CommentsModel.findOneAndDelete({_id: id});
        return deletedComment ? commentMapper(deletedComment) : null;
    }

    async setLike(commentId: string, userId: string, likeStatus: LikeStatus) {
        const comment = await CommentsModel.findOne({_id: commentId});
        const myStatus = comment?.extendedLikesInfo.usersLiked?.find(like => like.userId === userId);

        if (myStatus?.likeStatus === "Like") {
            comment!.extendedLikesInfo.likesCount--;
        }
        if (myStatus?.likeStatus === "Dislike") {
            comment!.extendedLikesInfo.dislikesCount--;
        }
        if (myStatus) {
            likeStatus === "None"
                ? comment!.extendedLikesInfo.usersLiked = comment!.extendedLikesInfo.usersLiked!.filter(like => like.userId !== userId)
                : comment!.extendedLikesInfo.usersLiked = comment!.extendedLikesInfo.usersLiked!.map(like => like.userId === userId ? { userId, likeStatus } : like);
        } else {
            comment!.extendedLikesInfo.usersLiked?.push({ userId, likeStatus });
        }

        if (likeStatus === "Like") {
            comment!.extendedLikesInfo.likesCount++;
        }
        if (likeStatus === "Dislike") {
            comment!.extendedLikesInfo.dislikesCount++;
        }
        await comment!.save();
        return commentMapper(comment!, userId);
    }
}