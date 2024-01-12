import {postsCollection} from "../db/db";
import {PostModel, PostsGetResponse} from "../models/posts/output";
import {postMapper} from "../models/posts/mappers/postMapper";
import {ObjectId} from "mongodb";
import {PostCreateModel} from "../models/posts/input";
import {PostQueryParams} from "../models/posts/query-params";
import {PostRepository} from "../repositories/post-repository";
import {BlogService} from "./blog-service";

export class PostService {

    static async getAllPosts(sortData: PostQueryParams): Promise<PostsGetResponse> {
        const {sortBy = "createdAt", sortDirection = "desc", pageSize = 10, pageNumber = 10} = sortData;
        return await PostRepository.getAllPosts({
            sortBy,
            sortDirection,
            pageSize: Number(pageSize),
            pageNumber: Number(pageNumber)
        })
    }

    static async getAllPostsByBlogId(sortData: PostQueryParams & { blogId: string }): Promise<PostsGetResponse> {
        const filledSortData = {
            sortBy: sortData.sortBy ?? "createdAt",
            sortDirection: sortData.sortDirection ?? "desc",
            pageNumber: Number(sortData.pageNumber) || 1,
            pageSize: Number(sortData.pageSize) || 10,
            blogId: sortData.blogId
        };
        return await PostRepository.getAllPostsByBlogId(filledSortData);
    }

    static async getPostById(id: string): Promise<PostModel | null> {
        return await PostRepository.getPostById(id);
    }

    static async createPost({title, shortDescription, content, blogId}: PostCreateModel): Promise<PostModel> {
        const blog = await BlogService.getBlogById(blogId)
        const post = {title, shortDescription, content, blogId, blogName: blog!.name, createdAt: new Date().toISOString()}
        return await PostRepository.createPost(post)
    }

    static async updatePost(post: PostCreateModel & {
        id: string
    }): Promise<PostModel | null> {
        return await PostRepository.updatePost(post);
    }

    static async deletePost(id: string): Promise<PostModel | null> {
        return await PostRepository.deletePost(id);
    }
}