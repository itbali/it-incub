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
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            usersLiked?: {
                userId: string,
                login: string,
                addedAt: string,
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
    extendedLikesInfo: {
        likesCount: {type: Number, default: 0},
        dislikesCount: {type: Number, default: 0},
        usersLiked: [{
            userId: {type: String, required: true},
            login: {type: String, required: true},
            addedAt: {type: String, required: true},
            likeStatus: {type: String, required: true}
        }]
    },
})
export const PostsModel = mongoose.model<PostDBType>("posts", postsSchema)
