import {ApiRequestDbType, BlogDBType, CommentDBType, PostDBType, UserDBType} from "../models/db/db";
import {MongoClient} from "mongodb";
import {configDotenv} from "dotenv";

configDotenv()

const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017"
const client = new MongoClient(uri)

const db = client.db("blogs-hws")

export const blogsCollection = db.collection<BlogDBType>("blogs")
export const postsCollection = db.collection<PostDBType>("posts")
export const usersCollection = db.collection<UserDBType>("users")
export const commentsCollection = db.collection<CommentDBType>("comments")
export const apiRequests = db.collection<ApiRequestDbType>("apiRequests")

export const runDb = async () => {
    try {
        await client.connect()
        console.log("Connected successfully to server")
    } catch (e) {
        console.error(`${e}`)
        await client.close()
    }
}