import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Product from "@/models/Product";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Read multipart form-data
    const formData = await req.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const files = formData.getAll("files");

    // 🧱 Create uploads folder if missing
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    const imagePaths = [];

    // 📸 Save uploaded files
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imagePaths.push(`/uploads/${fileName}`);
    }

    // 💾 Save to MongoDB
    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      images: imagePaths,
    });

    // ✅ Explicitly return 200 OK
    return NextResponse.json(
      { success: true, message: "Product added successfully", product: newProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add product" },
      { status: 500 }
    );
  }
}
