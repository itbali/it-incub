import {PostRepository} from "../repositories/post-repository";
import {PostService} from "../services/post-service";
import {commentRepository, commentService} from "./comment-composition";
import {userRepository} from "./user-composition";
import {blogService} from "./blog-composition";
import {PostController} from "../controllers/post-controller";

export const postRepository = new PostRepository();
export const postService = new PostService(postRepository, blogService, commentRepository, userRepository);
export const postController = new PostController(postService, commentService);