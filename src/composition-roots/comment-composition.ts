import {CommentController} from "../controllers/comment-controller";
import {CommentService} from "../services/comment-service";
import {CommentRepository} from "../repositories/comment-repository";

export const commentRepository = new CommentRepository();
export const commentService = new CommentService(commentRepository);
export const commentController = new CommentController(commentService);