import { NextResponse } from "next/server";
import dbConnect from "../../../utils/mongoose";
import Product from "../../../models/Product";
import jwt from "jsonwebtoken";

export async function GET() {
  await dbConnect();
  const products = await Product.find();
  return NextResponse.json(products);
}

export async function POST(req) {
  await dbConnect();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Only admin can create products" }, { status: 403 });
    }
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const { name, price } = await req.json();
  if (!name || !price) return NextResponse.json({ message: "Name and price required" }, { status: 400 });
  try {
  const product = await Product.create({
    name,
    price: Number(price),
  });

  return NextResponse.json(product, { status: 201 });
} catch (error) {
  console.log(error);
  
  return NextResponse.json(
    { message: "Duplicate Product ID" },
    { status: 500 }
  );
}

}
