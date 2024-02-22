import {
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/common/RequestTypes";
import {PostQueryParams} from "../models/posts/query-params";
import {Request, Response} from "express";
import {PostsGetResponse, PostVM} from "../models/posts/output";
import {PostService} from "../services/post-service";
import {ObjectId} from "mongodb";
import {PostCreateModel} from "../models/posts/input";
import {CommentCreateModel} from "../models/comments/input";
import {CommentsGetResponse} from "../models/comments/output";
import {CommentService} from "../services/comment-service";
import {inject, injectable} from "inversify";

@injectable()
export class PostController {

    constructor(
        @inject(PostService) protected postService: PostService,
        @inject(CommentService) protected commentService: CommentService) {
    }

    async getAllPosts(req: RequestWithQuery<PostQueryParams>, res: Response<PostsGetResponse>) {
        const sortData = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
        }
        const posts = await this.postService.getAllPosts(sortData);
        res.send(posts);
    }

    async getPost(req: Request<{ id: string }>, res: Response<PostVM | number>) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400)
            return;
        }
        const post = await this.postService.getPostById(req.params.id);
        if (!post) {
            res.sendStatus(404)
            return;
        }
        res.send(post);
    }

    async createPost(req: RequestWithBody<PostCreateModel>, res: Response<PostVM | number>) {
        if (!ObjectId.isValid(req.body.blogId)) {
            res.sendStatus(400)
            return;
        }
        const {title, shortDescription, content, blogId} = req.body;
        const post = await this.postService.createPost({title, shortDescription, content, blogId})
        if (!post) {
            res.sendStatus(404)
            return;
        }
        res.status(201).send(post);
    }

    async updatePost(req: Request<{ id: string }>, res: Response<number>) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400)
            return;
        }
        const {title, shortDescription, content, blogId} = req.body;
        const post = await this.postService.updatePost({id: req.params.id, title, shortDescription, content, blogId})
        if (!post) {
            res.sendStatus(404)
            return;
        }
        res.sendStatus(204);
    }

    async deletePost(req: Request<{ id: string }>, res: Response<number>) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400)
            return;
        }
        const post = await this.postService.deletePost(req.params.id);
        if (!post) {
            res.sendStatus(404)
            return;
        }
        res.sendStatus(204);
    }

    async createComment(req: RequestWithParamsAndBody<{ id: string }, CommentCreateModel>, res: Response) {
        const postId = req.params.id
        const content = req.body.content
        const comment = await this.postService.addCommentToPost(postId, content, req.userId!)
        if (!comment) {
            res.sendStatus(404)
            return
        }
        res.status(201).send(comment)
    }

    async getComments(req: RequestWithParamsAndQuery<{
        id: string
    }, PostQueryParams>, res: Response<CommentsGetResponse>) {
        const userId = req.userId || undefined;
        const sortData = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            postId: req.params.id
        }
        const post = await this.postService.getPostById(req.params.id);
        if (!post) {
            res.sendStatus(404)
            return;
        }

        const comments = await this.commentService.getCommentsByPostId(sortData, userId);
        res.send(comments);
    }
}