import {Router} from "express";
import {jwtMiddleware} from "../middlewares/auth/jwt-middleware";
import {commentValidation} from "../validators/comment-validator";
import {commentController} from "../composition-roots/comment-composition";

export const commentRoute = Router();

commentRoute.get("/:id", commentController.getComment.bind(commentController))
commentRoute.put("/:id", jwtMiddleware, commentValidation(), commentController.updateComment.bind(commentController))
commentRoute.put("/:id/like-status", jwtMiddleware, commentValidation(), commentController.likeComment.bind(commentController))
commentRoute.delete("/:id", jwtMiddleware, commentController.deleteComment.bind(commentController))