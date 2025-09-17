import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/mongoose";
import Product from "../../../../models/Product";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await dbConnect();
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== "admin") {
        return NextResponse.json({ message: "Only admin can delete products" }, { status: 403 });
      }
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

  try {
    await Product.findByIdAndDelete(id);
    return NextResponse.json({message: "Product Deleted Succerssfully"}, { status: 200});
  } catch (error) {
    return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
  }
}
