"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image URLs
  const handleImagesChange = (e) => {
    const value = e.target.value;
    // Split by commas to allow multiple URLs
    setProduct((prev) => ({ ...prev, images: value.split(",").map((url) => url.trim()) }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!product.name || !product.price) {
      toast.error("Product name and price are required.");
      return;
    }

    const priceNumber = parseFloat(product.price);
    if (isNaN(priceNumber)) {
      toast.error("Price must be a valid number.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // or getToken() from context
      const response = await axios.post(
        "/api/product/add",
        {
          ...product,
          price: priceNumber, // ensure number
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.product) {
        toast.success("Product added successfully!");
        setProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          images: [],
        });
      } else {
        toast.error(response.data?.error || "Failed to add product.");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price (e.g., 99.99)"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="images"
          value={product.images.join(", ")}
          onChange={handleImagesChange}
          placeholder="Image URLs (comma separated)"
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
