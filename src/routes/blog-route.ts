import {Router, Request, Response} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {RequestWithBody, RequestWithParamsAndBody} from "../models/common/RequestTypes";
import {BlogCreateModel} from "../models/blogs/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validator";
import {ObjectId} from "mongodb";

export const blogRoute = Router();

blogRoute.get("/", async (_req: Request, res: Response) => {
    const blogs = await BlogRepository.getAllBlogs();
    res.send(blogs);
});

blogRoute.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    if(!ObjectId.isValid(req.params.id)) {
        res.send(400)
        return;
    }

    const blog = await BlogRepository.getBlogById(req.params.id);

    if (!blog) {
        res.send(404)
        return;
    }
    res.send(blog);
});

blogRoute.post("/", authMiddleware, blogValidation(),async (req: RequestWithBody<BlogCreateModel>, res: Response) => {
    const {name, websiteUrl, description} = req.body;
    const blog = await BlogRepository.createBlog({name, websiteUrl, description})
    res.status(201).send(blog);
});

blogRoute.put("/:id", authMiddleware, blogValidation(), async (req: RequestWithParamsAndBody<{id:string},BlogCreateModel>, res: Response) => {
    if(!ObjectId.isValid(req.params.id)) {
        res.send(400)
        return;
    }

    const {name, websiteUrl, description} = req.body;
    const blog = await BlogRepository.updateBlog({id:req.params.id,name, websiteUrl, description})

    if (!blog) {
        res.send(404)
        return;
    }
    res.send(204);
});

blogRoute.delete("/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    if(!ObjectId.isValid(req.params.id)) {
        res.send(400)
        return;
    }

    const blog = await BlogRepository.deleteBlog(req.params.id);

    if (!blog) {
        res.send(404)
        return;
    }
    res.send(204);
});