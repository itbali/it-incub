import mongoose from "mongoose";
export class BlogDBType {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean,
    ) {
    }
}

const blogsSchema = new mongoose.Schema({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean,
})
export const BlogsModel = mongoose.model<BlogDBType>("blogs", blogsSchema)