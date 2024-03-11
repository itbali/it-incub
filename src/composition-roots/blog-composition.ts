import {BlogController} from "../controllers/blog-controller";
import {BlogService} from "../services/blog-service";
import {BlogRepository} from "../repositories/blog-repository";
import {PostRepository} from "../repositories/post-repository";
import {PostService} from "../services/post-service";
import {CommentRepository} from "../repositories/comment-repository";
import {UserRepository} from "../repositories/user-repository";
import {JwtService} from "../application/jwt-service";

export const blogRepository = new BlogRepository();
const postRepository = new PostRepository();
const commentRepository = new CommentRepository();
const jwtService = new JwtService();
const userRepository = new UserRepository(jwtService);
const blogService = new BlogService(blogRepository, postRepository);
const postService = new PostService(postRepository, blogService, commentRepository, userRepository);
export const blogController = new BlogController(blogService, postService);
