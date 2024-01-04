import {db} from "../db/db";

export class BlogRepository {

    static getAllBlogs(){
        return db.blogs;
    }

    static getBlogById(id: string){
        return db.blogs.find(blog => blog.id === id);
    }

    static createBlog(name: string, websiteUrl: string, description: string){
        const blog = {
            id: Date.now().toString(),
            name,
            websiteUrl,
            description,
        }
        db.blogs.push(blog);
        return blog;
    }

    static updateBlog(id: string, name?: string, websiteUrl?: string, description?: string){
        const blog = db.blogs.find(blog => blog.id === id);
        if(!blog) {
            return null;
        }
        name && (blog.name = name);
        websiteUrl && (blog.websiteUrl = websiteUrl);
        description && (blog.description = description);
        return blog;
    }

    static deleteBlog(id: string){
        const blogIndex = db.blogs.findIndex(blog => blog.id === id);
        if(blogIndex === -1) {
            return null;
        }
        const blog = db.blogs[blogIndex];
        db.blogs.splice(blogIndex, 1);
        return blog;
    }
}