import {
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/common/RequestTypes";
import {BlogQueryParams} from "../models/blogs/query-params";
import {Request, Response} from "express";
import {BlogModel, BlogsGetResponse} from "../models/blogs/output";
import {BlogService} from "../services/blog-service";
import {ObjectId} from "mongodb";
import {PostsGetResponse, PostVM} from "../models/posts/output";
import {PostService} from "../services/post-service";
import {BlogCreateModel, CreatePostInBlogModel} from "../models/blogs/input";
import {inject, injectable} from "inversify";

@injectable()
export class BlogController {

    constructor(
        @inject(BlogService) protected blogService: BlogService,
        @inject(PostService) protected postService: PostService
    ) {
    }
    async getBlogs(req: RequestWithQuery<BlogQueryParams>, res: Response<BlogsGetResponse>) {
        const sortData = {
            sortBy: req.query.sortBy ?? "createdAt",
            sortDirection: req.query.sortDirection ?? "desc",
            pageNumber: req.query.pageNumber || 1,
            pageSize: req.query.pageSize || 10,
            searchNameTerm: req.query.searchNameTerm || "",
        };
        const blogs = await this.blogService.getAllBlogs(sortData);
        res.send(blogs);
    }

    async getBlog(req: Request<{ id: string }>, res: Response<BlogModel | number>) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400)
            return;
        }

        const blog = await this.blogService.getBlogById(req.params.id);

        if (!blog) {
            res.sendStatus(404)
            return;
        }
        res.send(blog);
    }

    async getPosts(req: RequestWithParamsAndQuery<{
        id: string
    }, BlogQueryParams>, res: Response<PostsGetResponse | number>) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(404)
            return;
        }

        const blog = await this.blogService.getBlogById(req.params.id);
        if (!blog) {
            res.sendStatus(404)
            return;
        }
        const posts = await this.postService.getAllPostsByBlogId({
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: Number(req.query.pageNumber),
            pageSize: Number(req.query.pageSize),
            blogId: req.params.id
        });
        res.send(posts);
    }

    async createBlog(req: RequestWithBody<BlogCreateModel>, res: Response) {
        const {name, websiteUrl, description} = req.body;
        const blog = await this.blogService.createBlog({name, websiteUrl, description})
        res.status(201).send(blog);
    }

    async createPostInBlog(req: RequestWithParamsAndBody<{
        id: string
    }, CreatePostInBlogModel>, res: Response<PostVM | number>) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400)
            return;
        }

        const blog = await this.blogService.getBlogById(req.params.id);
        if (!blog) {
            res.sendStatus(404)
            return;
        }

        const {title, shortDescription, content} = req.body;

        const createdPostId = await this.blogService.createPostBlog({
            title,
            shortDescription,
            content,
            blogId: req.params.id,
            userId: req.userId!
        })
        const post = await this.postService.getPostById(createdPostId);
        if (!post) {
            res.sendStatus(404)
            return;
        }
        res.status(201).send(post);
    }

    async updateBlog(req: RequestWithParamsAndBody<{
        id: string
    }, BlogCreateModel>, res: Response<number>) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400)
            return;
        }

        const {name, websiteUrl, description} = req.body;
        const blog = await this.blogService.updateBlog({id: req.params.id, name, websiteUrl, description})

        if (!blog) {
            res.sendStatus(404)
            return;
        }
        res.sendStatus(204);
    }

    async deleteBlog(req: Request<{ id: string }>, res: Response<number>) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400)
            return;
        }

        const blog = await this.blogService.deleteBlog(req.params.id);

        if (!blog) {
            res.sendStatus(404)
            return;
        }
        res.sendStatus(204);
    }
}