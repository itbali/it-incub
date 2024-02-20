import {PostController} from "./post-controller";
import {PostService} from "../services/post-service";
import {PostRepository} from "../repositories/post-repository";
import {BlogService} from "../services/blog-service";
import {BlogRepository} from "../repositories/blog-repository";
import {CommentRepository} from "../repositories/comment-repository";
import {UserRepository} from "../repositories/user-repository";
import {JwtService} from "../application/jwt-service";
import {CommentService} from "../services/comment-service";

const postRepository = new PostRepository();
const blogRepository = new BlogRepository();
const commentRepository = new CommentRepository();
const jwtService = new JwtService();
const userRepository = new UserRepository(jwtService);
const blogService = new BlogService(blogRepository, postRepository);
const postService = new PostService(postRepository, blogService, commentRepository, userRepository);
const commentService = new CommentService(commentRepository, postService);
export const postController = new PostController(postService, commentService);