import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Please add MONGODB_URI to .env.local");

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(async (mongoose) => {
      const count = await User.countDocuments();
      if (count === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await User.create({ username: "admin", password: hashedPassword, role: "admin" });
        console.log("Default admin created: username=admin, password=admin123");
      }
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
