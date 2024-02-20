import {Router} from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validator";
import {createPostInBlogValidation} from "../validators/post-validator";
import {blogController} from "../composition-roots/blog-composition";

export const blogRoute = Router();

blogRoute.get("/", blogController.getBlogs.bind(blogController));
blogRoute.get("/:id", blogController.getBlog.bind(blogController));
blogRoute.get("/:id/posts", blogController.getPosts.bind(blogController));
blogRoute.post("/", authMiddleware, blogValidation(), blogController.createBlog.bind(blogController));
blogRoute.post("/:id/posts", authMiddleware, createPostInBlogValidation(), blogController.createPostInBlog.bind(blogController));
blogRoute.put("/:id", authMiddleware, blogValidation(), blogController.updateBlog.bind(blogController));
blogRoute.delete("/:id", authMiddleware, blogController.deleteBlog.bind(blogController));