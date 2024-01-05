import express, {Request, Response} from "express";
import {PostRepository} from "../repositories/post-repository";
import {RequestWithBody} from "../models/common/RequestTypes";
import {PostCreateModel} from "../models/posts/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {postValidation} from "../validators/post-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

export const postRoute = express.Router();

postRoute.get("/", (req, res) => {
    const posts = PostRepository.getAllPosts();
    res.send(posts);
});

postRoute.get("/:id", (req: Request<{id: string}>, res) => {
    const post = PostRepository.getPostById(req.params.id);
    if (!post) {
        res.send(404)
        return;
    }
    res.send(post);
});

postRoute.post("/", authMiddleware, postValidation(), inputModelValidation, (req: RequestWithBody<PostCreateModel>, res: Response) => {
    const {title, shortDescription, content, blogId} = req.body;
    const post = PostRepository.createPost(title, shortDescription, content, blogId)
    if (!post) {
        res.send(404)
        return;
    }
    res.status(201).send(post);
});

postRoute.put("/:id", authMiddleware, postValidation(true), inputModelValidation, (req: Request<{id: string}>, res: Response) => {
    const {title, shortDescription, content, blogId} = req.body;
    const post = PostRepository.updatePost(req.params.id, title, shortDescription, content, blogId)
    if (!post) {
        res.send(404)
        return;
    }
    res.send(204);
});

postRoute.delete("/:id", authMiddleware, (req: Request<{id: string}>, res: Response) => {
    const post = PostRepository.deletePost(req.params.id);
    if (!post) {
        res.send(404)
        return;
    }
    res.send(204);
});