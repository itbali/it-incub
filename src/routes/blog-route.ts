import {Router, Request, Response} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {RequestWithBody, RequestWithParamsAndBody} from "../models/common/RequestTypes";
import {BlogCreateModel} from "../models/blogs/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

export const blogRoute = Router();

blogRoute.get("/", (_req: Request, res: Response) => {
    const blogs = BlogRepository.getAllBlogs();
    res.send(blogs);
});

blogRoute.get("/:id", (req: Request<{ id: string }>, res: Response) => {
    const blog = BlogRepository.getBlogById(req.params.id);
    if (!blog) {
        res.send(404)
        return;
    }
    res.send(blog);
});

blogRoute.post("/", authMiddleware, blogValidation(), inputModelValidation,(req: RequestWithBody<BlogCreateModel>, res: Response) => {
    const {name, websiteUrl, description} = req.body;
    const blog = BlogRepository.createBlog(name, websiteUrl, description)
    res.send(blog);
});

blogRoute.put("/:id", authMiddleware, blogValidation(true), inputModelValidation, (req: RequestWithParamsAndBody<{id:string},Partial<BlogCreateModel>>, res: Response) => {
    const {name, websiteUrl, description} = req.body;
    const blog = BlogRepository.updateBlog(req.params.id, name, websiteUrl, description)
    if (!blog) {
        res.send(404)
        return;
    }
    res.send(blog);
});

blogRoute.delete("/:id", authMiddleware, (req: Request<{ id: string }>, res: Response) => {
    const blog = BlogRepository.deleteBlog(req.params.id);
    if (!blog) {
        res.send(404)
        return;
    }
    res.send(blog);
});