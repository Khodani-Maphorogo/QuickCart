import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectToDB from "@/libs/mongodb"; // make sure this path is correct
import Product from "@/models/Product";  // make sure this path is correct

export async function GET(req) {
  try {
    // Optional: Clerk auth
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectToDB();

    // Fetch products
    const products = await Product.find({});

    return NextResponse.json({ success: true, products });
  } catch (error) {
    // Explicit semicolon to avoid Turbopack parsing issues
    return NextResponse.json(
      { success: false, message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
