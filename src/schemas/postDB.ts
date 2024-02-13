import mongoose from "mongoose";

export type PostDBType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

const postsSchema = new mongoose.Schema({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean,
})
export const PostsModel = mongoose.model<PostDBType>("posts", postsSchema)
