import {blogsCollection, postsCollection} from "../db/db";
import {PostModel, PostsGetResponse} from "../models/posts/output";
import {postMapper} from "../models/posts/mappers/postMapper";
import {ObjectId} from "mongodb";
import {PostCreateModel} from "../models/posts/input";
import {PostQueryParams} from "../models/posts/query-params";

export class PostRepository {

    static async getAllPosts(sortData: Required<PostQueryParams>): Promise<PostsGetResponse> {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData;
        const postsCount = await postsCollection.countDocuments();
        const posts = await postsCollection
            .find()
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .toArray()

        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts.map(postMapper),
        }
    }

    static async getAllPostsByBlogId({sortBy, sortDirection, pageSize, pageNumber, blogId}: Required<PostQueryParams> & {blogId: string}): Promise<PostsGetResponse> {
        const postsCount = await postsCollection.countDocuments({blogId});
        const posts = await postsCollection
            .find({blogId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts.map(postMapper),
        }
    }

    static async getPostById(id: string): Promise<PostModel | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)});
        return post ? postMapper(post) : null;
    }

    static async createPost({title, shortDescription, content, blogId}: PostCreateModel): Promise<PostModel> {
        const blogName = (await blogsCollection.findOne({_id: new ObjectId(blogId)}))!.name;
        const post = { title, shortDescription, content, blogId, blogName, createdAt: new Date().toISOString() }
        const createdPost = await postsCollection.insertOne({...post})
        return {...post, id: createdPost.insertedId.toString()}
    }

    static async updatePost({id, title, shortDescription, content, blogId}: PostCreateModel & {
        id: string
    }): Promise<PostModel | null> {
        const updatedPost = await postsCollection.findOneAndUpdate({_id: new ObjectId(id)}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId
            }
        });
        return updatedPost ? postMapper(updatedPost) : null;
    }

    static async deletePost(id: string): Promise<PostModel | null> {
        const deletedPost = await postsCollection.findOneAndDelete({_id: new ObjectId(id)});
        return deletedPost ? postMapper(deletedPost) : null;
    }
}