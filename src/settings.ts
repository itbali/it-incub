import express, {Request, Response} from "express";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "./db/db";
import {userRoute} from "./routes/user-route";
import {authRoute} from "./routes/auth-route";
import {commentRoute} from "./routes/comment-route";
import cookieParser from "cookie-parser";
import {fixEachRequest} from "./middlewares/ip/fixEachRequest";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(fixEachRequest);

app.delete("/testing/all-data", async (_req: Request, res: Response) => {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    res.send(204)
})

app.use("/blogs", blogRoute)
app.use("/posts", postRoute)
app.use("/users", userRoute)
app.use("/auth", authRoute)
app.use("/comments", commentRoute)
