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
        extendedLikesInfo: {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: post.extendedLikesInfo.usersLiked?.find(like => like.userId === userId)?.likeStatus || 'None',
            newestLikes: post.extendedLikesInfo.usersLiked
                ?.filter(like => like.likeStatus === 'Like')
                .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
                .map(like => ({
                addedAt: like.addedAt,
                login: like.login,
                userId: like.userId
            })).slice(0,2) || [],
        }
    });
}