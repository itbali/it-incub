import {blogsCollection, postsCollection} from "../db/db";
import {BlogModel, BlogsGetResponse} from "../models/blogs/output";
import {blogMapper} from "../models/blogs/mappers/blogMapper";
import {ObjectId} from "mongodb";
import {BlogCreateModel} from "../models/blogs/input";
import {BlogQueryParams} from "../models/blogs/query-params";
import {PostCreateModel} from "../models/posts/input";
import {BlogDBType} from "../models/db/db";

export class BlogRepository {

    static async getAllBlogs({sortBy, sortDirection, pageSize, pageNumber, searchNameTerm}: Required<BlogQueryParams>): Promise<BlogsGetResponse>{
        const blogs = await blogsCollection
            .find({name: {$regex: searchNameTerm, $options: "i"}})
            .sort(sortBy, sortDirection)
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .toArray();

        const totalBlogs = await blogsCollection.countDocuments({name: {$regex: searchNameTerm, $options: "i"}});
        const pageCount = Math.ceil(totalBlogs / Number(pageSize));

        return {
            pagesCount: pageCount,
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: totalBlogs,
            items: blogs.map(blogMapper),
        };
    }

    static async getBlogById(id: string): Promise<BlogModel | null>{
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)});
        return blog ? blogMapper(blog) : null;
    }

    static async createBlog(blog: BlogDBType): Promise<BlogModel>{
        const createdBlog = await blogsCollection.insertOne({...blog});
        return {...blog, id: createdBlog.insertedId.toString()}
    }

    static async updateBlog({id, name, websiteUrl, description}: BlogCreateModel &{id:string}): Promise<BlogModel | null>{
        const blog = await blogsCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set:{description,name,websiteUrl}});
        return blog ? blogMapper(blog) : null;
    }

    static async deleteBlog(id: string): Promise<BlogModel | null>{
        const blog = await blogsCollection.findOneAndDelete({_id: new ObjectId(id)});
        return blog ? blogMapper(blog) : null;
    }
}