import {PostVM, PostsGetResponse} from "../models/posts/output";
import {postMapper} from "../models/posts/mappers/postMapper";
import {PostCreateModel} from "../models/posts/input";
import {PostQueryParams} from "../models/posts/query-params";

import {PostDBType, PostsModel} from "../schemas/postDB";
import {injectable} from "inversify";

@injectable()
export class PostRepository {

    async getAllPosts(sortData: Required<PostQueryParams>): Promise<PostsGetResponse> {
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
            items: posts.map(postMapper),
        }
    }

    async getAllPostsByBlogId({sortBy, sortDirection, pageSize, pageNumber, blogId}: Required<PostQueryParams> & {blogId: string}): Promise<PostsGetResponse> {
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
            items: posts.map(postMapper),
        }
    }

    async getPostById(id: string): Promise<PostVM | null> {
        const post = await PostsModel.findOne({_id: id}).lean();
        return post ? postMapper(post) : null;
    }

    async createPost(post: PostDBType) {
        const postInstance = new PostsModel(post);
        const createdPost = await postInstance.save();
        return postMapper(createdPost)
    }

    async updatePost({id, title, shortDescription, content, blogId}: PostCreateModel & {
        id: string
    }): Promise<PostVM | null> {
        const updatedPost = await PostsModel.findOneAndUpdate({_id: id}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId
            }
        });
        return updatedPost ? postMapper(updatedPost) : null;
    }

    async deletePost(id: string): Promise<PostVM | null> {
        const deletedPost = await PostsModel.findOneAndDelete({_id: id});
        return deletedPost ? postMapper(deletedPost) : null;
    }
}