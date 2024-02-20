import {BlogController} from "../controllers/blog-controller";
import {BlogService} from "../services/blog-service";
import {BlogRepository} from "../repositories/blog-repository";
import {postRepository, postService} from "./post-composition";

export const blogRepository = new BlogRepository();
export const blogService = new BlogService(blogRepository, postRepository);
export const blogController = new BlogController(blogService, postService);