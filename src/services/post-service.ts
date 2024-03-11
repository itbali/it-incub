import {PostsGetResponse, PostVM} from "../models/posts/output";
import {PostCreateModel} from "../models/posts/input";
import {PostQueryParams} from "../models/posts/query-params";
import {PostRepository} from "../repositories/post-repository";
import {BlogService} from "./blog-service";
import {CommentRepository} from "../repositories/comment-repository";
import {CommentVM} from "../models/comments/output";
import {UserRepository} from "../repositories/user-repository";

export class PostService {
    constructor(protected postRepository: PostRepository, protected blogService: BlogService, protected commentRepository: CommentRepository, protected userRepository: UserRepository) {
    }

    async getAllPosts(sortData: PostQueryParams): Promise<PostsGetResponse> {
        const {sortBy = "createdAt", sortDirection = "desc", pageSize = 10, pageNumber = 1} = sortData;
        return await this.postRepository.getAllPosts({
            sortBy,
            sortDirection,
            pageSize: Number(pageSize),
            pageNumber: Number(pageNumber)
        })
    }

    async getAllPostsByBlogId(sortData: PostQueryParams & { blogId: string }): Promise<PostsGetResponse> {
        const filledSortData = {
            sortBy: sortData.sortBy ?? "createdAt",
            sortDirection: sortData.sortDirection ?? "desc",
            pageNumber: Number(sortData.pageNumber) || 1,
            pageSize: Number(sortData.pageSize) || 10,
            blogId: sortData.blogId
        };
        return await this.postRepository.getAllPostsByBlogId(filledSortData);
    }

    async getPostById(id: string): Promise<PostVM | null> {
        return await this.postRepository.getPostById(id);
    }

    async createPost({title, shortDescription, content, blogId}: PostCreateModel): Promise<PostVM> {
        console.log("blogId", blogId, {blogService: this.blogService})
        const blog = await this.blogService.getBlogById(blogId)
        const post = {title, shortDescription, content, blogId, blogName: blog!.name, createdAt: new Date().toISOString()}
        return await this.postRepository.createPost(post)
    }

    async updatePost(post: PostCreateModel & { id: string }): Promise<PostVM | null> {
        return await this.postRepository.updatePost(post);
    }

    async deletePost(id: string): Promise<PostVM | null> {
        return await this.postRepository.deletePost(id);
    }

    async addCommentToPost(postId:string, content: string, userId: string): Promise<CommentVM | null>{
        const post = await this.postRepository.getPostById(postId)
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
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                usersLiked: [],
            }
        })
    }
}