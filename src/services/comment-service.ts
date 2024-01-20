import {PostService} from "./post-service";
import {UserVM} from "../models/users/output";
import {commentRepository} from "../repositories/comment-repository";
import {CommentsQueryParams} from "../models/comments/query-params";
import {CommentsGetResponse} from "../models/comments/output";

export class CommentService {
    static async createComment(content: string, postId: string, user: UserVM) {
        const post = await PostService.getPostById(postId)
        if (!post) {
            return null;
        }
        const commentToCreate = {
            content: content,
            postId: postId,
            postTitle: post.title,
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
        };
        return await commentRepository.create(commentToCreate);
    }

    static async getCommentsByPostId({postId, pageNumber, pageSize, sortBy, sortDirection}: CommentsQueryParams): Promise<CommentsGetResponse> {
        const searchParams = {
            postId: postId,
            pageNumber: Number(pageNumber) || 1,
            pageSize: Number(pageSize) || 10,
            sortBy: sortBy || 'createdAt',
            sortDirection: sortDirection || 'desc',
        }
        return await commentRepository.getCommentsByPostId(searchParams);
    }

    static async getCommentById(id: string) {
        const comment = await commentRepository.getCommentById(id);
        if (!comment) {
            return {error: "not_found"};
        }
        return comment;
    }

    static async getCommentUserId(id: string) {
        const comment = await commentRepository.getCommentById(id);
        if (!comment) {
            return null;
        }
        return comment.commentatorInfo.userId;
    }

    static async updateComment(commentId: string, content: string,userId: string) {
        const commentToUpdate = await commentRepository.getCommentById(commentId);
        const commentUserId = await this.getCommentUserId(commentId);

        if (!commentToUpdate) {
            return {error: "not_found"};
        }
        if (commentUserId !== userId) {
            return {error: "forbidden"};
        }
        const updatedComment = await commentRepository.updateComment({
            ...commentToUpdate,
            content: content,
        });
        if (!updatedComment) {
            return {error: "not_found"};
        }
        return updatedComment;
    }

    static async deleteComment(commentId: string, userId: string) {
        const commentUserId = await this.getCommentUserId(commentId);
        const commentToDelete = await commentRepository.getCommentById(commentId);
        if (!commentToDelete) {
            return {error: "not_found"};
        }
        if (commentUserId !== userId) {
            return {error: "forbidden"};
        }
        await commentRepository.deleteComment(commentId);
        return commentToDelete;
    }
}