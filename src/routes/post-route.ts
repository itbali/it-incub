import express, {Request, Response} from "express";
import {RequestWithBody, RequestWithQuery} from "../models/common/RequestTypes";
import {PostCreateModel} from "../models/posts/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {postValidation} from "../validators/post-validator";
import {ObjectId} from "mongodb";
import {PostQueryParams} from "../models/posts/query-params";
import {PostModel, PostsGetResponse} from "../models/posts/output";
import {PostService} from "../services/post-service";

export const postRoute = express.Router();

postRoute.get("/", async (req: RequestWithQuery<PostQueryParams>, res: Response<PostsGetResponse>) => {
    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
    }
    const posts = await PostService.getAllPosts(sortData);
    res.send(posts);
});

postRoute.get("/:id", async (req: Request<{ id: string }>, res: Response<PostModel | number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(400)
        return;
    }
    const post = await PostService.getPostById(req.params.id);
    if (!post) {
        res.sendStatus(404)
        return;
    }
    res.send(post);
});

postRoute.post("/", authMiddleware, postValidation(), async (req: RequestWithBody<PostCreateModel>, res: Response<PostModel | number>) => {
    if (!ObjectId.isValid(req.body.blogId)) {
        res.sendStatus(400)
        return;
    }
    const {title, shortDescription, content, blogId} = req.body;
    const post = await PostService.createPost({title, shortDescription, content, blogId})
    if (!post) {
        res.sendStatus(404)
        return;
    }
    res.status(201).send(post);
});

postRoute.put("/:id", authMiddleware, postValidation(), async (req: Request<{ id: string }>, res: Response<number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(400)
        return;
    }
    const {title, shortDescription, content, blogId} = req.body;
    const post = await PostService.updatePost({id: req.params.id, title, shortDescription, content, blogId})
    if (!post) {
        res.sendStatus(404)
        return;
    }
    res.sendStatus(204);
});

postRoute.delete("/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response<number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(400)
        return;
    }
    const post = await PostService.deletePost(req.params.id);
    if (!post) {
        res.sendStatus(404)
        return;
    }
    res.sendStatus(204);
});