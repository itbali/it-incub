import {PostRepository} from "../repositories/post-repository";
import {PostService} from "../services/post-service";
import {PostController} from "../controllers/post-controller";
import {BlogService} from "../services/blog-service";
import {BlogRepository} from "../repositories/blog-repository";
import {CommentRepository} from "../repositories/comment-repository";
import {CommentService} from "../services/comment-service";
import {JwtService} from "../application/jwt-service";
import {UserRepository} from "../repositories/user-repository";

const postRepository = new PostRepository();
const blogRepository = new BlogRepository();
const commentRepository = new CommentRepository();
const jwtService = new JwtService();
const userRepository = new UserRepository(jwtService);
const blogService = new BlogService(blogRepository, postRepository)
const commentService = new CommentService(commentRepository);
const postService = new PostService(postRepository, blogService, commentRepository, userRepository);
export const postController = new PostController(postService, commentService);