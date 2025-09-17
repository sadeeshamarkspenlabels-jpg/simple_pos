import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/mongoose";
import Sale from "@/models/Sale";
import jwt from "jsonwebtoken";


export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;
  const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  

  try {
    const sale = await Sale.findById(id);
    if(!sale) {
        return NextResponse.json({ message: "Invalid Sale ID" }, { status: 400 });
    }
    return NextResponse.json({sale}, { status: 200});
  } catch (error) {
    return NextResponse.json({ message: "Invalid Sale ID" }, { status: 400 });
  }
}
