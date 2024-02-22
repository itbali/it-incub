import "reflect-metadata";
import {BlogController} from "../controllers/blog-controller";
import {BlogService} from "../services/blog-service";
import {BlogRepository} from "../repositories/blog-repository";
import {PostRepository} from "../repositories/post-repository";
import {PostService} from "../services/post-service";
import {Container} from "inversify";
import {CommentRepository} from "../repositories/comment-repository";
import {UserRepository} from "../repositories/user-repository";
import {JwtService} from "../application/jwt-service";

const blogContainer = new Container();
blogContainer.bind(PostRepository).to(PostRepository);
blogContainer.bind(UserRepository).to(UserRepository);
blogContainer.bind(JwtService).to(JwtService);
blogContainer.bind(CommentRepository).to(CommentRepository);
blogContainer.bind(PostService).to(PostService);
blogContainer.bind(BlogRepository).to(BlogRepository);
blogContainer.bind(BlogService).to(BlogService);
blogContainer.bind(BlogController).to(BlogController);

export const blogRepository = blogContainer.get(BlogRepository);
export const blogController = blogContainer.get(BlogController);