import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongoose";
import Sale from "@/models/Sale";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await dbConnect();
  const authHeader = req.headers.get("authorization");
  if (!authHeader)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can delete products" },
        { status: 403 }
      );
    }
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    const sales = await Sale.find();
    return NextResponse.json(sales);
  } catch (error) {
    return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
  }
}

export async function POST(req) {
  await dbConnect();

  // 🔒 Step 1: Extract token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!["admin", "cashier"].includes(decoded.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // 📦 Step 2: Get sale data from request body
  const { items } = await req.json();
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: "No items in sale" }, { status: 400 });
  }

  // 💰 Step 3: Process items and calculate total
  let total = 0;
  const saleItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return NextResponse.json({ message: `Product not found: ${item.productId}` }, { status: 404 });
    }

    const qty = item.quantity || 1;
    total += product.price * qty;

    saleItems.push({
      productId: product._id,
      pId: product.pId,
      name: product.name,
      price: product.price,
      quantity: qty,
    });
     console.log(product.pId);
  }
 
  
  // 💾 Step 4: Save sale
  const sale = await Sale.create({
    items: saleItems,
    total,
    cashier: decoded.username,
  });
  console.log(saleItems);
  

  // ✅ Step 5: Return response
  return NextResponse.json({
    message: "Sale created successfully",
    sale,
  });
}
