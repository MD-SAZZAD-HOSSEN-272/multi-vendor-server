import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URI;
let client;
let db;

const dbConnect = async (collectionName) => {
    if(!client){
        client = new MongoClient(url);
        await client.connect();
        db = client.db("multi-vendor");
        console.log("Connected to MongoDB");
    }
    return db.collection(collectionName);
}

export default dbConnect;