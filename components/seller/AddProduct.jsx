'use client';
import React, { useState } from "react";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [category, setCategory] = useState(""); // ✅ added
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (offerPrice) formData.append("offerPrice", offerPrice);
    formData.append("category", category); // ✅ added
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const res = await axios.post("/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status >= 200 && res.status < 300 && res.data.success) {
        setStatus("success");
        setName("");
        setPrice("");
        setOfferPrice("");
        setCategory(""); // ✅ reset category
        setFiles([]);
        document.querySelector("form").reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("error");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-semibold text-gray-700">Add New Product</h1>

      <form onSubmit={handleAddProduct} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-gray-600 mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-600 mb-1">Price (R)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter product price"
            required
          />
        </div>

        {/* Offer Price */}
        <div>
          <label className="block text-gray-600 mb-1">Offer Price (optional)</label>
          <input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter offer price"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-600 mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter product category"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-gray-600 mb-1">Upload Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            accept="image/*"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-medium transition duration-200 ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* Success / Error Message */}
      {status && (
        <div className={`flex items-center justify-center space-x-2 mt-4 transition-all duration-500`}>
          {status === "success" ? (
            <>
              <CheckCircleIcon className="h-6 w-6 text-green-500 animate-bounce" />
              <p className="text-green-600 font-medium">Product added successfully!</p>
            </>
          ) : (
            <>
              <XCircleIcon className="h-6 w-6 text-red-500 animate-pulse" />
              <p className="text-red-600 font-medium">Failed to add product!</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AddProduct;
