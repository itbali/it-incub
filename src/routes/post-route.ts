import express, {Request, Response} from "express";
import {PostRepository} from "../repositories/post-repository";
import {RequestWithBody, RequestWithQuery} from "../models/common/RequestTypes";
import {PostCreateModel} from "../models/posts/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {postValidation} from "../validators/post-validator";
import {ObjectId} from "mongodb";
import {PostQueryParams} from "../models/posts/query-params";
import {PostModel, PostsGetResponse} from "../models/posts/output";

export const postRoute = express.Router();

postRoute.get("/", async (req: RequestWithQuery<PostQueryParams>, res: Response<PostsGetResponse>) => {
    const sortData = {
        sortBy: req.query.sortBy ?? "createdAt",
        sortDirection: req.query.sortDirection ?? "desc",
        pageNumber: Number(req.query.pageNumber) || 1,
        pageSize: Number(req.query.pageSize) || 10,
    }
    const posts = await PostRepository.getAllPosts(sortData);
    res.send(posts);
});

postRoute.get("/:id", async (req: Request<{id: string}>, res: Response<PostModel | number>) => {
    if(!ObjectId.isValid(req.params.id)) {
        res.send(400)
        return;
    }
    const post = await PostRepository.getPostById(req.params.id);
    if (!post) {
        res.send(404)
        return;
    }
    res.send(post);
});

postRoute.post("/", authMiddleware, postValidation(), async (req: RequestWithBody<PostCreateModel>, res: Response<PostModel | number>) => {
    if(!ObjectId.isValid(req.body.blogId)) {
        res.send(400)
        return;
    }
    const {title, shortDescription, content, blogId} = req.body;
    const post = await PostRepository.createPost({title, shortDescription, content, blogId})
    if (!post) {
        res.send(404)
        return;
    }
    res.status(201).send(post);
});

postRoute.put("/:id", authMiddleware, postValidation(), async (req: Request<{id: string}>, res: Response<number>) => {
    if(!ObjectId.isValid(req.params.id)) {
        res.send(400)
        return;
    }
    const {title, shortDescription, content, blogId} = req.body;
    const post = await PostRepository.updatePost({id:req.params.id, title, shortDescription, content, blogId})
    if (!post) {
        res.send(404)
        return;
    }
    res.send(204);
});

postRoute.delete("/:id", authMiddleware, async (req: Request<{id: string}>, res: Response<number>) => {
    if(!ObjectId.isValid(req.params.id)) {
        res.send(400)
        return;
    }
    const post = await PostRepository.deletePost(req.params.id);
    if (!post) {
        res.send(404)
        return;
    }
    res.send(204);
});