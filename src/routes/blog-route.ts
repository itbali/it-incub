import {Router} from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validator";
import {createPostInBlogValidation} from "../validators/post-validator";
import {blogController} from "../composition-roots/blog-composition";
import {getUserFromTokenMiddleware} from "../middlewares/auth/jwt-middleware";

export const blogRoute = Router();

blogRoute.get("/", getUserFromTokenMiddleware, blogController.getBlogs.bind(blogController));
blogRoute.get("/:id", getUserFromTokenMiddleware, blogController.getBlog.bind(blogController));
blogRoute.get("/:id/posts", getUserFromTokenMiddleware, blogController.getPosts.bind(blogController));
blogRoute.post("/", authMiddleware, blogValidation(), blogController.createBlog.bind(blogController));
blogRoute.post("/:id/posts", authMiddleware, createPostInBlogValidation(), blogController.createPostInBlog.bind(blogController));
blogRoute.put("/:id", authMiddleware, blogValidation(), blogController.updateBlog.bind(blogController));
blogRoute.delete("/:id", authMiddleware, blogController.deleteBlog.bind(blogController));