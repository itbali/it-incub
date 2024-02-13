import {WithId} from "mongodb";
import {BlogModel} from "../output";
import {BlogDBType} from "../../../schemas/blogDB";

export const blogMapper = (blog: WithId<BlogDBType>): BlogModel=>({
    id: blog._id.toString(),
    name: blog.name,
    websiteUrl: blog.websiteUrl,
    description: blog.description,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
})