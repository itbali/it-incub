import mongoose from "mongoose";
import {LikeStatus} from "./commentDB";

export class PostDBType  {
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public likesInfo: {
            likesCount: number,
            dislikesCount: number,
            usersLiked?: {
                userId: string,
                likeStatus: LikeStatus,
            }[],
        }
    ) {
    }
}

const postsSchema = new mongoose.Schema({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Number, default: 0},
        dislikesCount: {type: Number, default: 0},
        myStatus: {type: String, default: 'none'},
    },
})
export const PostsModel = mongoose.model<PostDBType>("posts", postsSchema)
