import mongoose from "mongoose";

// Define product schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    images: { type: [String] },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// Avoid OverwriteModelError in Next.js hot reload
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;

