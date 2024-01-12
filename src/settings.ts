import express from "express";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {blogsCollection, postsCollection} from "./db/db";
import {userRoute} from "./routes/user-route";
import {authRoute} from "./routes/authRoute";

export const app = express();
app.use(express.json());

app.delete("/testing/all-data", async (_req, res) => {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    res.send(204)
})

app.use("/blogs", blogRoute)
app.use("/posts", postRoute)
app.use("/users", userRoute)
app.use("/auth", authRoute)

