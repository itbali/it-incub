import {CommentDBType} from "../models/db/db";
import {commentsCollection} from "../db/db";
import {CommentsGetResponse, CommentVM} from "../models/comments/output";
import {commentMapper} from "../models/comments/mappers/commentMapper";
import {CommentsQueryParams} from "../models/comments/query-params";
import {ObjectId} from "mongodb";

export class commentRepository {
    static async create(commentToCreate: CommentDBType): Promise<CommentVM | null> {
        const createdComment = await commentsCollection.insertOne(commentToCreate);
        if (!createdComment) {
            return null;
        }
        return {
            createdAt: commentToCreate.createdAt,
            content: commentToCreate.content,
            id: createdComment.insertedId.toString(),
            commentatorInfo: {
                userId: commentToCreate.commentatorInfo.userId,
                userLogin: commentToCreate.commentatorInfo.userLogin,
            }
        };
    }

    static async getCommentsByPostId({
                                         postId,
                                         pageNumber,
                                         pageSize,
                                         sortBy,
                                         sortDirection
                                     }: Required<CommentsQueryParams>): Promise<CommentsGetResponse> {
        const comments = await commentsCollection
            .find({postId: postId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
        const commentsCount = await commentsCollection.countDocuments({postId: postId});
        return {
            items: comments.map(commentMapper),
            totalCount: commentsCount,
            pageSize,
            page: pageNumber,
            pagesCount: Math.ceil(commentsCount / pageSize),
        };
    }

    static async getCommentById(id: string): Promise<CommentVM | null> {
        const comment = await commentsCollection.findOne({_id: new ObjectId(id)});
        return comment ? commentMapper(comment) : null;
    }

    static async updateComment(comment: CommentVM): Promise<CommentVM | null> {
        const updatedComment = await commentsCollection.findOneAndUpdate(
            {_id: new ObjectId(comment.id)},
            {$set: {...comment}}
        );
        return updatedComment ? comment : null;
    }

    static async deleteComment(id: string): Promise<CommentVM | null> {
        const deletedComment = await commentsCollection.findOneAndDelete({_id: new ObjectId(id)});
        return deletedComment ? commentMapper(deletedComment) : null;
    }
}