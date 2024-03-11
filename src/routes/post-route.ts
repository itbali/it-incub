import express from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {postValidation} from "../validators/post-validator";
import {jwtMiddleware} from "../middlewares/auth/jwt-middleware";
import {commentValidation} from "../validators/comment-validator";
import {postController} from "../composition-roots/post-composition";

export const postRoute = express.Router();

postRoute.get("/", postController.getAllPosts.bind(postController));
postRoute.get("/:id", postController.getPost.bind(postController));
postRoute.post("/", authMiddleware, postValidation(), postController.createPost.bind(postController));
postRoute.put("/:id", authMiddleware, postValidation(), postController.updatePost.bind(postController));
postRoute.delete("/:id", authMiddleware, postController.deletePost.bind(postController));
postRoute.post("/:id/comments",jwtMiddleware, commentValidation() ,postController.createComment.bind(postController));
postRoute.get("/:id/comments", postController.getComments.bind(postController));