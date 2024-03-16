import {Router} from "express";
import {getUserFromTokenMiddleware, jwtMiddleware} from "../middlewares/auth/jwt-middleware";
import {commentValidation} from "../validators/comment-validator";
import {commentController} from "../composition-roots/comment-composition";
import {likeStatusValidator} from "../validators/like-status-validator";

export const commentRoute = Router();

commentRoute.get("/:id", getUserFromTokenMiddleware, commentController.getComment.bind(commentController))
commentRoute.put("/:id", jwtMiddleware, commentValidation(), commentController.updateComment.bind(commentController))
commentRoute.put("/:id/like-status", jwtMiddleware, likeStatusValidator(), commentController.likeComment.bind(commentController))
commentRoute.delete("/:id", jwtMiddleware, commentController.deleteComment.bind(commentController))