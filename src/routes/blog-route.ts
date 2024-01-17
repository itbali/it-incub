import {Router, Request, Response} from "express";
import {BlogService} from "../services/blog-service"
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
import {createPostInBlogValidation } from "../validators/post-validator";
import {PostVM, PostsGetResponse} from "../models/posts/output";
import {BlogModel, BlogsGetResponse} from "../models/blogs/output";
import {PostService} from "../services/post-service";

export const blogRoute = Router();

blogRoute.get("/", async (req: RequestWithQuery<BlogQueryParams>, res: Response<BlogsGetResponse>) => {
    const sortData = {
        sortBy: req.query.sortBy ?? "createdAt",
        sortDirection: req.query.sortDirection ?? "desc",
        pageNumber: req.query.pageNumber || 1,
        pageSize: req.query.pageSize || 10,
        searchNameTerm: req.query.searchNameTerm || "",
    };
    const blogs = await BlogService.getAllBlogs(sortData);
    res.send(blogs);
});

blogRoute.get("/:id", async (req: Request<{ id: string }>, res: Response<BlogModel | number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(400)
        return;
    }

    const blog = await BlogService.getBlogById(req.params.id);

    if (!blog) {
        res.sendStatus(404)
        return;
    }
    res.send(blog);
});

blogRoute.get("/:id/posts", async (req: RequestWithParamsAndQuery<{
    id: string
}, BlogQueryParams>, res: Response<PostsGetResponse | number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return;
    }

    const blog = await BlogService.getBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(404)
        return;
    }
    const posts = await PostService.getAllPostsByBlogId({sortBy: req.query.sortBy ,
        sortDirection: req.query.sortDirection,
        pageNumber: Number(req.query.pageNumber),
        pageSize: Number(req.query.pageSize),
        blogId: req.params.id});
    res.send(posts);
});

blogRoute.post("/", authMiddleware, blogValidation(), async (req: RequestWithBody<BlogCreateModel>, res: Response) => {
    const {name, websiteUrl, description} = req.body;
    const blog = await BlogService.createBlog({name, websiteUrl, description})
    res.status(201).send(blog);
});

blogRoute.post("/:id/posts", authMiddleware, createPostInBlogValidation(), async (req: RequestWithParamsAndBody<{
    id: string
}, CreatePostInBlogModel>, res: Response<PostVM | number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(400)
        return;
    }

    const blog = await BlogService.getBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(404)
        return;
    }

    const {title, shortDescription, content} = req.body;

    const createdPostId = await BlogService.createPostBlog({title, shortDescription, content, blogId: req.params.id})
    // const post = await PostRepository.createPost({title, shortDescription, content, blogId: req.params.id})
    const post = await PostService.getPostById(createdPostId);
    if (!post) {
        res.sendStatus(404)
        return;
    }
    res.status(201).send(post);
});

blogRoute.put("/:id", authMiddleware, blogValidation(), async (req: RequestWithParamsAndBody<{
    id: string
}, BlogCreateModel>, res: Response<number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(400)
        return;
    }

    const {name, websiteUrl, description} = req.body;
    const blog = await BlogService.updateBlog({id: req.params.id, name, websiteUrl, description})

    if (!blog) {
        res.sendStatus(404)
        return;
    }
    res.sendStatus(204);
});

blogRoute.delete("/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response<number>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(400)
        return;
    }

    const blog = await BlogService.deleteBlog(req.params.id);

    if (!blog) {
        res.sendStatus(404)
        return;
    }
    res.sendStatus(204);
});