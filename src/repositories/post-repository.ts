import {db} from "../db/db";
import {PostModel} from "../models/posts/output";

export class PostRepository {

    static getAllPosts(){
        return db.posts;
    }

    static getPostById(id: string){
        return db.posts.find(blog => blog.id === id);
    }

    static createPost(title: string, shortDescription: string, content: string, blogId: string){
        const blog = db.blogs.find(blog => blog.id === blogId);
        if(!blog) {
            return null;
        }
        const post: PostModel = {
            id: Date.now().toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
        }
        db.posts.push(post);
        return post;
    }

    static updatePost(id: string, title?: string, shortDescription?: string, content?: string, blogId?: string){
        const post = db.posts.find(post => post.id === id);
        const blog = db.blogs.find(blog => blog.id === blogId);
        if(!post || !blog) {
            return null;
        }

        title && (post.title = title);
        shortDescription && (post.shortDescription = shortDescription);
        content && (post.content = content);
        blogId && (post.blogId = blogId) && (post.blogName = blog.name);

        return blog;
    }

    static deletePost(id: string){
        const postIndex = db.posts.findIndex(post => post.id === id);
        if(postIndex === -1) {
            return null;
        }
        const post = db.posts[postIndex];
        db.posts.splice(postIndex, 1);
        return post;
    }
}