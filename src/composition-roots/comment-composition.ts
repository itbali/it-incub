import "reflect-metadata";
import {CommentController} from "../controllers/comment-controller";
import {CommentService} from "../services/comment-service";
import {CommentRepository} from "../repositories/comment-repository";
import {Container} from "inversify";

const commentsContainer = new Container();
commentsContainer.bind(CommentRepository).to(CommentRepository);
commentsContainer.bind(CommentService).to(CommentService);
commentsContainer.bind(CommentController).to(CommentController);

export const commentController = commentsContainer.get(CommentController);