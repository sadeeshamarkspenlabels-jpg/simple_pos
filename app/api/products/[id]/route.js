import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/mongoose";
import Product from "../../../../models/Product";

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
