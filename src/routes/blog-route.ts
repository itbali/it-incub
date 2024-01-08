import {Router, Request, Response} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/common/RequestTypes";
import {BlogCreateModel, CreatePostInBlogModel} from "../models/blogs/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validator";
import {ObjectId} from "mongodb";
import {BlogQueryParams} from "../models/blogs/query-params";
import {PostRepository} from "../repositories/post-repository";
import {createPostInBlogValidation } from "../validators/post-validator";
import {PostModel, PostsGetResponse} from "../models/posts/output";
import {BlogModel, BlogsGetResponse} from "../models/blogs/output";

export const blogRoute = Router();

blogRoute.get("/", async (req: RequestWithQuery<BlogQueryParams>, res: Response<BlogsGetResponse>) => {
    const sortData = {
        sortBy: req.query.sortBy ?? "createdAt",
        sortDirection: req.query.sortDirection ?? "desc",
        pageNumber: req.query.pageNumber || 1,
        pageSize: req.query.pageSize || 10,
        searchNameTerm: req.query.searchNameTerm || "",
    };
    const blogs = await BlogRepository.getAllBlogs(sortData);
    res.send(blogs);
});

blogRoute.get("/:id", async (req: Request<{ id: string }>, res: Response<BlogModel | number>) => {
    if (!ObjectId.isValid(req.params.id)) {
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

blogRoute.get("/:id/posts", async (req: RequestWithParamsAndQuery<{
    id: string
}, BlogQueryParams>, res: Response<PostsGetResponse | number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.send(404)
        return;
    }

    const blog = await BlogRepository.getBlogById(req.params.id);
    if (!blog) {
        res.send(404)
        return;
    }

    const sortData = {
        sortBy: req.query.sortBy ?? "createdAt",
        sortDirection: req.query.sortDirection ?? "desc",
        pageNumber: req.query.pageNumber || 1,
        pageSize: req.query.pageSize || 10,
        searchNameTerm: req.query.searchNameTerm || "",
    };
    const posts = await PostRepository.getAllPostsByBlogId({...sortData, blogId: req.params.id});
    res.send(posts);
});

blogRoute.post("/", authMiddleware, blogValidation(), async (req: RequestWithBody<BlogCreateModel>, res: Response) => {
    const {name, websiteUrl, description} = req.body;
    const blog = await BlogRepository.createBlog({name, websiteUrl, description})
    res.status(201).send(blog);
});

blogRoute.post("/:id/posts", authMiddleware, createPostInBlogValidation(), async (req: RequestWithParamsAndBody<{
    id: string
}, CreatePostInBlogModel>, res: Response<PostModel | number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.send(400)
        return;
    }

    const blog = await BlogRepository.getBlogById(req.params.id);
    if (!blog) {
        res.send(404)
        return;
    }

    const {title, shortDescription, content} = req.body;
    const post = await PostRepository.createPost({title, shortDescription, content, blogId: req.params.id})

    res.status(201).send(post);
});

blogRoute.put("/:id", authMiddleware, blogValidation(), async (req: RequestWithParamsAndBody<{
    id: string
}, BlogCreateModel>, res: Response<number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.send(400)
        return;
    }

    const {name, websiteUrl, description} = req.body;
    const blog = await BlogRepository.updateBlog({id: req.params.id, name, websiteUrl, description})

    if (!blog) {
        res.send(404)
        return;
    }
    res.send(204);
});

blogRoute.delete("/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response<number>) => {
    if (!ObjectId.isValid(req.params.id)) {
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