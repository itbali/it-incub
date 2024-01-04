import {BlogModel} from "../blogs/output";
import {PostModel} from "../posts/output";

export type DBType = {
    blogs: BlogModel[],
    posts: PostModel[],
}