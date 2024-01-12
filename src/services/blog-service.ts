import {BlogRepository} from "../repositories/blog-repository";
import {BlogCreateModel} from "../models/blogs/input";
import {BlogQueryParams} from "../models/blogs/query-params";
import {PostCreateModel} from "../models/posts/input";
import {BlogModel, BlogsGetResponse} from "../models/blogs/output";
import {PostRepository} from "../repositories/post-repository";

export class BlogService {

    static async getAllBlogs({sortBy, sortDirection, pageSize, pageNumber, searchNameTerm}: Required<BlogQueryParams>): Promise<BlogsGetResponse>{
        return await BlogRepository.getAllBlogs({sortBy, sortDirection, pageSize, pageNumber, searchNameTerm})
    }

    static async getBlogById(id: string): Promise<BlogModel | null>{
        return await BlogRepository.getBlogById(id)
    }

    static async createBlog({name, websiteUrl, description}: BlogCreateModel): Promise<BlogModel>{
        const blog = {name, websiteUrl, description, isMembership: false, createdAt: new Date().toISOString()}
        return await BlogRepository.createBlog(blog);
    }

    static async createPostBlog({blogId, title, shortDescription, content}: PostCreateModel): Promise<string>{
        const blog = await BlogRepository.getBlogById(blogId);
        const post = {blogId, title, shortDescription, content, blogName: blog!.name, createdAt: new Date().toISOString()}
        const createdPost = await PostRepository.createPost({...post});
        return createdPost.id;
    }

    static async updateBlog({id, name, websiteUrl, description}: BlogCreateModel &{id:string}): Promise<BlogModel | null>{
        return await BlogRepository.updateBlog({id, name, websiteUrl, description})
    }

    static async deleteBlog(id: string): Promise<BlogModel | null>{
        return await BlogRepository.deleteBlog(id);
    }
}