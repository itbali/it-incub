import {blogsCollection, postsCollection} from "../db/db";
import {PostModel} from "../models/posts/output";
import {postMapper} from "../models/posts/mappers/postMapper";
import {ObjectId} from "mongodb";
import {PostCreateModel} from "../models/posts/input";

export class PostRepository {

    static async getAllPosts(): Promise<PostModel[]> {
        return (await postsCollection.find().toArray()).map(postMapper)
    }

    static async getPostById(id: string): Promise<PostModel | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)});
        return post ? postMapper(post) : null;
    }

    static async createPost({title, shortDescription, content, blogId}: PostCreateModel): Promise<PostModel> {
        const blogName = (await blogsCollection.findOne({_id: new ObjectId(blogId)}))!.name;
        const post = { title, shortDescription, content, blogId, blogName, isMembership: false, createdAt: new Date().toISOString() }
        const createdPost = await postsCollection.insertOne(post)
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