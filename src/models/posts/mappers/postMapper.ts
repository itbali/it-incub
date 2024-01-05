import {WithId} from "mongodb";
import {PostDBType} from "../../db/db";
import {PostModel} from "../output";

export const postMapper = (post: WithId<PostDBType>): PostModel => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt,
    isMembership: post.isMembership,
})