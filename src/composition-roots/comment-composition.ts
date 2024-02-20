import {CommentController} from "../controllers/comment-controller";
import {CommentService} from "../services/comment-service";
import {CommentRepository} from "../repositories/comment-repository";
import {PostService} from "../services/post-service";
import {PostRepository} from "../repositories/post-repository";
import {BlogService} from "../services/blog-service";
import {BlogRepository} from "../repositories/blog-repository";
import {UserRepository} from "../repositories/user-repository";
import { JwtService } from "../application/jwt-service";

const commentRepository = new CommentRepository();
const postRepository = new PostRepository();
const blogRepository = new BlogRepository();
const jwtService = new JwtService();
const userRepository = new UserRepository(jwtService);
const blogService = new BlogService(blogRepository, postRepository);
const postService = new PostService(postRepository, blogService, commentRepository, userRepository);
const commentService = new CommentService(commentRepository, postService);
export const commentController = new CommentController(commentService);