import {PostsGetResponse, PostVM} from "../models/posts/output";
import {PostCreateModel} from "../models/posts/input";
import {PostQueryParams} from "../models/posts/query-params";
import {PostRepository} from "../repositories/post-repository";
import {BlogService} from "./blog-service";
import {CommentRepository} from "../repositories/comment-repository";
import {CommentVM} from "../models/comments/output";
import {UserRepository} from "../repositories/user-repository";
import {inject, injectable} from "inversify";

@injectable()
export class PostService {
    constructor(
        @inject(PostRepository) protected postRepository: PostRepository,
        @inject(BlogService) protected blogService: BlogService,
        @inject(CommentRepository) protected commentRepository: CommentRepository,
        @inject(UserRepository) protected userRepository: UserRepository
    ) {
    }

    async getAllPosts(sortData: PostQueryParams, userId?:string): Promise<PostsGetResponse> {
        const {sortBy = "createdAt", sortDirection = "desc", pageSize = 10, pageNumber = 1} = sortData;
        return await this.postRepository.getAllPosts({
            sortBy,
            sortDirection,
            pageSize: Number(pageSize),
            pageNumber: Number(pageNumber)
        }, userId)
    }

    async getAllPostsByBlogId(sortData: PostQueryParams & { blogId: string }, userId?:string): Promise<PostsGetResponse> {
        const filledSortData = {
            sortBy: sortData.sortBy ?? "createdAt",
            sortDirection: sortData.sortDirection ?? "desc",
            pageNumber: Number(sortData.pageNumber) || 1,
            pageSize: Number(sortData.pageSize) || 10,
            blogId: sortData.blogId
        };
        return await this.postRepository.getAllPostsByBlogId(filledSortData, userId);
    }

    async getPostById(id: string, userId?:string): Promise<PostVM | null> {
        return await this.postRepository.getPostById(id, userId);
    }

    async createPost({title, shortDescription, content, blogId}: PostCreateModel, userId:string): Promise<PostVM> {
        const blog = await this.blogService.getBlogById(blogId)
        const post = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                usersLiked: [],
            }
        }
        return await this.postRepository.createPost(post, userId);
    }

    async updatePost(post: PostCreateModel & { id: string }, userId?:string): Promise<PostVM | null> {
        return await this.postRepository.updatePost(post, userId);
    }

    async deletePost(id: string, userId?:string): Promise<PostVM | null> {
        return await this.postRepository.deletePost(id, userId);
    }

    async addCommentToPost(postId:string, content: string, userId: string): Promise<CommentVM | null>{
        const post = await this.postRepository.getPostById(postId, userId)
        if(!post){
            return null
        }
        const user = await this.userRepository.getUserById(userId)
        if(!user){
            return null
        }
        return this.commentRepository.create({
            postId,
            content,
            postTitle: post.title,
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                usersLiked: [],
            }
        })
    }

    async setLikeStatus(postId: string, userId: string, likeStatus: "Like" | "Dislike" | "None"): Promise<PostVM | null>{
        const post = await this.postRepository.getPostById(postId, userId)
        if(!post){
            return null
        }
        const user = await this.userRepository.getUserById(userId)
        if(!user){
            return null
        }
        if(post.extendedLikesInfo.myStatus === likeStatus){
            return post
        }
        const updatedPost = await this.postRepository.setLikeStatus(postId, userId, likeStatus)
        if(!updatedPost){
            return null
        }
        return updatedPost
    }
}