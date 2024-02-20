import {BlogModel, BlogsGetResponse} from "../models/blogs/output";
import {blogMapper} from "../models/blogs/mappers/blogMapper";
import {BlogCreateModel} from "../models/blogs/input";
import {BlogQueryParams} from "../models/blogs/query-params";

import {BlogDBType, BlogsModel} from "../schemas/blogDB";

export class BlogRepository {

    async getAllBlogs({sortBy, sortDirection, pageSize, pageNumber, searchNameTerm}: Required<BlogQueryParams>): Promise<BlogsGetResponse>{
        const blogs = await BlogsModel
            .find({name: {$regex: searchNameTerm, $options: "i"}})
            .sort({[sortBy]: sortDirection})
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .lean();

        const totalBlogs = await BlogsModel.countDocuments({name: {$regex: searchNameTerm, $options: "i"}});
        const pageCount = Math.ceil(totalBlogs / Number(pageSize));

        return {
            pagesCount: pageCount,
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: totalBlogs,
            items: blogs.map(blogMapper),
        };
    }

    async getBlogById(id: string): Promise<BlogModel | null>{
        const blog = await BlogsModel.findOne({_id: id}).lean();
        return blog ? blogMapper(blog) : null;
    }

    async createBlog(blog: BlogDBType): Promise<BlogModel>{
        const createdBlog = await BlogsModel.create({...blog});
        return {...blog, id: createdBlog.id};
    }

    async updateBlog({id, name, websiteUrl, description}: BlogCreateModel &{id:string}): Promise<BlogModel | null>{
        const blog = await BlogsModel.findOneAndUpdate(
            {_id: id},
            {$set:{description,name,websiteUrl}},
            {new: true, lean: true});
        return blog ? blogMapper(blog) : null;
    }

    async deleteBlog(id: string): Promise<BlogModel | null>{
        const blog = await BlogsModel.findOneAndDelete({_id: id});
        return blog ? blogMapper(blog) : null;
    }
}