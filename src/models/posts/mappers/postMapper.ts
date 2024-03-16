import {WithId} from "mongodb";
import {PostVM} from "../output";
import {PostDBType} from "../../../schemas/postDB";

export const postMapper = (post: WithId<PostDBType>, userId?: string): PostVM => {
    return ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt,
        likesInfo: {
            likesCount: post.likesInfo.likesCount,
            dislikesCount: post.likesInfo.dislikesCount,
            myStatus: post.likesInfo.usersLiked?.find(like => like.userId === userId)?.likeStatus || 'None',
            newestLikes: post.likesInfo.usersLiked?.filter(like => like.likeStatus === 'Like').map(like => like.userId).slice(0,2) || [],
            usersLiked: post.likesInfo.usersLiked
        }
    });
}