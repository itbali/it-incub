import {BlogRepository} from "../repositories/blog-repository";
import {BlogCreateModel} from "../models/blogs/input";
import {BlogQueryParams} from "../models/blogs/query-params";
import {PostCreateModel} from "../models/posts/input";
import {BlogModel, BlogsGetResponse} from "../models/blogs/output";
import {PostRepository} from "../repositories/post-repository";
import {inject, injectable} from "inversify";

@injectable()
export class BlogService {

    constructor(
        @inject(BlogRepository) protected blogRepository: BlogRepository,
        @inject(PostRepository) protected postRepository: PostRepository
    ) {
    }

    async getAllBlogs({
                          sortBy,
                          sortDirection,
                          pageSize,
                          pageNumber,
                          searchNameTerm
                      }: Required<BlogQueryParams>): Promise<BlogsGetResponse> {
        return await this.blogRepository.getAllBlogs({sortBy, sortDirection, pageSize, pageNumber, searchNameTerm})
    }

    async getBlogById(id: string): Promise<BlogModel | null> {
        return await this.blogRepository.getBlogById(id)
    }

    async createBlog({name, websiteUrl, description}: BlogCreateModel): Promise<BlogModel> {
        const blog = {name, websiteUrl, description, isMembership: false, createdAt: new Date().toISOString()}
        return await this.blogRepository.createBlog(blog);
    }

    async createPostBlog({blogId, title, shortDescription, content, userId}: PostCreateModel & {userId: string}): Promise<string> {
        const blog = await this.blogRepository.getBlogById(blogId);
        const post = {
            blogId,
            title,
            shortDescription,
            content,
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                usersLiked: [],
            }
        }
        const createdPost = await this.postRepository.createPost(post, userId);
        return createdPost.id;
    }

    async updateBlog({id, name, websiteUrl, description}: BlogCreateModel & { id: string }): Promise<BlogModel | null> {
        return await this.blogRepository.updateBlog({id, name, websiteUrl, description})
    }

    async deleteBlog(id: string): Promise<BlogModel | null> {
        return await this.blogRepository.deleteBlog(id);
    }
}