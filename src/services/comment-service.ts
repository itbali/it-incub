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
        return await commentRepository.getCommentById(id);
    }

    static async getCommentUserId(id: string) {
        const comment = await commentRepository.getCommentById(id);
        if (!comment) {
            return null;
        }
        return comment.commentatorInfo.userId;
    }

    static async updateComment(id: string, content: string) {
        const commentToUpdate = await commentRepository.getCommentById(id);
        if (!commentToUpdate) {
            return null;
        }
        const updatedComment = await commentRepository.updateComment({
            ...commentToUpdate,
            content: content,
        });
        if (!updatedComment) {
            return null;
        }
        return updatedComment;
    }

    static async deleteComment(id: string) {
        const commentToDelete = await commentRepository.getCommentById(id);
        if (!commentToDelete) {
            return null;
        }
        await commentRepository.deleteComment(id);
        return commentToDelete;
    }
}