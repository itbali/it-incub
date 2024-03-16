import 'reflect-metadata';
import express, {Request, Response} from "express";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {userRoute} from "./routes/user-route";
import {authRoute} from "./routes/auth-route";
import {commentRoute} from "./routes/comment-route";
import cookieParser from "cookie-parser";
import {fixEachRequest} from "./middlewares/ip/fixEachRequest";
import {securityRoute} from "./routes/security-route";
import {BlogsModel} from "./schemas/blogDB";
import {PostsModel} from "./schemas/postDB";
import {UserModel} from "./schemas/userDB";
import {ApiRequestsModel} from "./schemas/apiRequestDb";
import {CommentsModel} from "./schemas/commentDB";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(fixEachRequest);

app.delete("/testing/all-data", async (_req: Request, res: Response) => {
    await BlogsModel.deleteMany({});
    await PostsModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentsModel.deleteMany({});
    await ApiRequestsModel.deleteMany({});
    res.send(204)
})

app.get("/", (_req: Request, res: Response) => {
    res.send("Everything is working")
})

app.use("/blogs", blogRoute)
app.use("/posts", postRoute)
app.use("/users", userRoute)
app.use("/auth", authRoute)
app.use("/comments", commentRoute)
app.use("/security", securityRoute)
