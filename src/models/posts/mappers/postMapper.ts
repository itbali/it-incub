import {WithId} from "mongodb";
import {PostDBType} from "../../db/db";
import {PostVM} from "../output";

export const postMapper = (post: WithId<PostDBType>): PostVM => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt,
})