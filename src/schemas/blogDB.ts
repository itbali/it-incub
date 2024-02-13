import mongoose from "mongoose";
export type BlogDBType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

const blogsSchema = new mongoose.Schema({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean,
})
export const BlogsModel = mongoose.model<BlogDBType>("blogs", blogsSchema)