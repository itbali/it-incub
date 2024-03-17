import {PostVM, PostsGetResponse} from "../models/posts/output";
import {postMapper} from "../models/posts/mappers/postMapper";
import {PostCreateModel} from "../models/posts/input";
import {PostQueryParams} from "../models/posts/query-params";

import {PostDBType, PostsModel} from "../schemas/postDB";
import {injectable} from "inversify";

@injectable()
export class PostRepository {

    async getAllPosts(sortData: Required<PostQueryParams>, userId?:string): Promise<PostsGetResponse> {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData;
        const postsCount = await PostsModel.countDocuments();
        const posts = await PostsModel
            .find()
            .sort({[sortBy]: sortDirection})
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .lean()

        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts.map(p=>postMapper(p, userId)),
        }
    }

    async getAllPostsByBlogId({sortBy, sortDirection, pageSize, pageNumber, blogId}: Required<PostQueryParams> & {blogId: string}, userId?: string): Promise<PostsGetResponse> {
        const postsCount = await PostsModel.countDocuments({blogId});
        const posts = await PostsModel
            .find({blogId})
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts.map(p=>postMapper(p, userId)),
        }
    }

    async getPostById(id: string, userId?:string): Promise<PostVM | null> {
        const post = await PostsModel.findOne({_id: id}).lean();
        return post ? postMapper(post, userId) : null;
    }

    async createPost(post: PostDBType, userId: string): Promise<PostVM> {
        const postInstance = new PostsModel(post);
        const createdPost = await postInstance.save();
        return postMapper(createdPost, userId);
    }

    async updatePost({id, title, shortDescription, content, blogId}: PostCreateModel & {
        id: string
    }, userId?:string): Promise<PostVM | null> {
        const updatedPost = await PostsModel.findOneAndUpdate({_id: id}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId
            }
        });
        return updatedPost ? postMapper(updatedPost, userId) : null;
    }

    async deletePost(id: string, userId?: string): Promise<PostVM | null> {
        const deletedPost = await PostsModel.findOneAndDelete({_id: id});
        return deletedPost ? postMapper(deletedPost, userId) : null;
    }

    async setLikeStatus(postId: string, userId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<PostVM | null> {
        const post = await PostsModel.findOne({_id: postId});
        if(!post){
            return null;
        }
        const myStatus = post.extendedLikesInfo.usersLiked?.find(like => like.userId === userId);
        if(myStatus?.likeStatus === "Like"){
            post.extendedLikesInfo.likesCount--;
        }
        if(myStatus?.likeStatus === "Dislike"){
            post.extendedLikesInfo.dislikesCount--;
        }

        if(myStatus){
            likeStatus === "None"
                ? post.extendedLikesInfo.usersLiked = post.extendedLikesInfo.usersLiked!.filter(like => like.userId !== userId)
                : post.extendedLikesInfo.usersLiked = post.extendedLikesInfo.usersLiked!.map(like => like.userId === userId ? {userId, likeStatus} : like);
        } else {
            post.extendedLikesInfo.usersLiked?.push({userId, likeStatus});
        }

        if(likeStatus === "Like"){
            post.extendedLikesInfo.likesCount++;
        }
        if(likeStatus === "Dislike"){
            post.extendedLikesInfo.dislikesCount++;
        }
        await post.save();
        return postMapper(post, userId);
    }
}