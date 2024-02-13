import {CommentsGetResponse, CommentVM} from "../models/comments/output";
import {commentMapper} from "../models/comments/mappers/commentMapper";
import {CommentsQueryParams} from "../models/comments/query-params";
import {CommentDBType, CommentsModel} from "../schemas/commentDB";

export class commentRepository {
    static async create(commentToCreate: CommentDBType): Promise<CommentVM | null> {
        const createdComment = await CommentsModel.create(commentToCreate);
        if (!createdComment) {
            return null;
        }
        return createdComment.toObject();
    }

    static async getCommentsByPostId({
                                         postId,
                                         pageNumber,
                                         pageSize,
                                         sortBy,
                                         sortDirection
                                     }: Required<CommentsQueryParams>): Promise<CommentsGetResponse> {
        const comments = await CommentsModel
            .find({postId: postId})
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();
        const commentsCount = await CommentsModel.countDocuments({postId: postId});
        return {
            items: comments.map(commentMapper),
            totalCount: commentsCount,
            pageSize,
            page: pageNumber,
            pagesCount: Math.ceil(commentsCount / pageSize),
        };
    }

    static async getCommentById(id: string): Promise<CommentVM | null> {
        const comment = await CommentsModel.findOne({_id: id}).lean();
        return comment ? commentMapper(comment) : null;
    }

    static async updateComment(comment: CommentVM): Promise<CommentVM | null> {
        const updatedComment = await CommentsModel.findOneAndUpdate(
            {_id: comment.id},
            {$set: {...comment}}
        );
        return updatedComment ? comment : null;
    }

    static async deleteComment(id: string): Promise<CommentVM | null> {
        const deletedComment = await CommentsModel.findOneAndDelete({_id: id});
        return deletedComment ? commentMapper(deletedComment) : null;
    }
}