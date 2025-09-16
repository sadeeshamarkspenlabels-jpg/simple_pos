import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await dbConnect();

  // 🔒 Check Authorization Header
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Only admin can see users
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await User.find().select("-password"); // exclude passwords
    return NextResponse.json(users);

  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
