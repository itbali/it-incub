import {WithId} from "mongodb";
import {PostVM} from "../output";
import {PostDBType} from "../../../schemas/postDB";

export const postMapper = (post: WithId<PostDBType>): PostVM => {
    return ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt,
    });
}