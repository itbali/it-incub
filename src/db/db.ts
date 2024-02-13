import mongoose from "mongoose";
import {configDotenv} from "dotenv";

configDotenv()

const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017"
const dbName = process.env.MONGO_DB_NAME ?? "blogs-hws"
const fullUri = `${uri}/${dbName}?authSource=admin`

export const runDb = async () => {
    try {
        await mongoose.connect(fullUri)
        console.log("Connected successfully to server")
    } catch (e) {
        console.error(`${e}`)
        await mongoose.disconnect()
    }
}