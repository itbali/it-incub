import {WithId} from "mongodb";
import {BlogDBType} from "../../db/db";
import {BlogModel} from "../output";

export const blogMapper = (blog: WithId<BlogDBType>): BlogModel=>({
    id: blog._id.toString(),
    name: blog.name,
    websiteUrl: blog.websiteUrl,
    description: blog.description,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
})