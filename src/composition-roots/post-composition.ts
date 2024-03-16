import "reflect-metadata";
import {PostRepository} from "../repositories/post-repository";
import {PostService} from "../services/post-service";
import {PostController} from "../controllers/post-controller";
import {Container} from "inversify";
import {BlogService} from "../services/blog-service";
import {BlogRepository} from "../repositories/blog-repository";
import {CommentRepository} from "../repositories/comment-repository";
import {CommentService} from "../services/comment-service";
import {JwtService} from "../application/jwt-service";
import {UserRepository} from "../repositories/user-repository";

const postContainer = new Container();
postContainer.bind(JwtService).to(JwtService);
postContainer.bind(CommentRepository).to(CommentRepository);
postContainer.bind(CommentService).to(CommentService);
postContainer.bind(UserRepository).to(UserRepository);
postContainer.bind(BlogService).to(BlogService);
postContainer.bind(BlogRepository).to(BlogRepository);
postContainer.bind(PostRepository).to(PostRepository);
postContainer.bind(PostService).to(PostService);
postContainer.bind(PostController).to(PostController);

export const postController = postContainer.resolve(PostController);