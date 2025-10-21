'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);

  // Fetch products on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/product"); // Make sure GET API exists
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full flex justify-center p-6">
      <div className="w-full max-w-5xl"> {/* Reduce width here */}
        {/* Page Heading */}
        <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price ($)</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  {/* Product name with image */}
                  <td className="p-3 flex items-center gap-3">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span>{product.name}</span>
                  </td>

                  {/* Category */}
                  <td className="p-3">{product.category || "-"}</td>

                  {/* Price */}
                  <td className="p-3">${product.price}</td>

                  {/* Visit button */}
                  <td className="p-3">
                    <a
                      href={`/product/${product._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-500"
                    >
                      Visit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

