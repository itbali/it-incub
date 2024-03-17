import {CommentRepository} from "../repositories/comment-repository";
import {CommentsQueryParams} from "../models/comments/query-params";
import {CommentsGetResponse} from "../models/comments/output";
import {LikeStatus} from "../schemas/commentDB";
import {inject, injectable} from "inversify";

@injectable()
export class CommentService {
    constructor(@inject(CommentRepository) protected commentRepository: CommentRepository) {
    }

    async getCommentsByPostId({
                                  postId,
                                  pageNumber,
                                  pageSize,
                                  sortBy,
                                  sortDirection
                              }: CommentsQueryParams, userId?: string): Promise<CommentsGetResponse> {
        const searchParams = {
            postId: postId,
            pageNumber: Number(pageNumber) || 1,
            pageSize: Number(pageSize) || 10,
            sortBy: sortBy || 'createdAt',
            sortDirection: sortDirection || 'desc',
        }
        return await this.commentRepository.getCommentsByPostId(searchParams, userId);
    }

    async getCommentById(id: string, userId?: string) {
        const comment = await this.commentRepository.getCommentById(id, userId);
        if (!comment) {
            return {error: "not_found"};
        }
        return comment;
    }

    async getCommentUserId(id: string) {
        const comment = await this.commentRepository.getCommentById(id);
        if (!comment) {
            return null;
        }
        return comment.commentatorInfo.userId;
    }

    async updateComment(commentId: string, content: string, userId: string) {
        const commentToUpdate = await this.commentRepository.getCommentById(commentId);
        const commentUserId = await this.getCommentUserId(commentId);

        if (!commentToUpdate) {
            return {error: "not_found"};
        }
        if (commentUserId !== userId) {
            return {error: "forbidden"};
        }
        const updatedComment = await this.commentRepository.updateComment({
            ...commentToUpdate,
            content: content,
        });
        if (!updatedComment) {
            return {error: "not_found"};
        }
        return updatedComment;
    }

    async deleteComment(commentId: string, userId: string) {
        const commentUserId = await this.getCommentUserId(commentId);
        const commentToDelete = await this.commentRepository.getCommentById(commentId);
        if (!commentToDelete) {
            return {error: "not_found"};
        }
        if (commentUserId !== userId) {
            return {error: "forbidden"};
        }
        await this.commentRepository.deleteComment(commentId);
        return commentToDelete;
    }

    async likeComment(commentId: string, userId: string, likeStatus: LikeStatus) {
        const comment = await this.commentRepository.getCommentById(commentId,userId);
        if (!comment) {
            return {error: "not_found"};
        }
        if (comment.extendedLikesInfo.myStatus === likeStatus) {
            return comment;
        }
        return await this.commentRepository.setLike(commentId, userId, likeStatus);
    }
}