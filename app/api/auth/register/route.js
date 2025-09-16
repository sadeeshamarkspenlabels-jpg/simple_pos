import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/mongoose";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  // 🔒 Extract token from Authorization header
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
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can register users" },
        { status: 403 }
      );
    }
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // ✅ Get request body
  const { username, password, role } = await req.json();
  if (!username || !password || !role) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  // ✅ Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  // ✅ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Create user
  const user = await User.create({
    username,
    password: hashedPassword,
    role,
  });

  return NextResponse.json({
    message: "User created",
    user: { username: user.username, role: user.role },
  });
}
