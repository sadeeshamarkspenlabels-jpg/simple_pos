import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/mongoose";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();
  const { username, password } = await req.json();
console.log(username);

  const user = await User.findOne({ username });
  if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

  const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

  return NextResponse.json({ token, role: user.role });
}
