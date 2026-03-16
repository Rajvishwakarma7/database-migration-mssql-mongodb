import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}