import express from "express";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {db} from "./db/db";

export const app = express();
app.use(express.json());

app.use("/blogs", blogRoute)
app.use("/posts", postRoute)

app.delete("testing/all-data", (_req, res) => {
    db.blogs = [];
    db.posts = [];
    res.sendStatus(204)
})
