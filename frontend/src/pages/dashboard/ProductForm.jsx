import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/const";
import Swal from "sweetalert2";
import { FaTag, FaDollarSign, FaImage } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";

const ProductForm = ({
  onAddProduct,
  onUpdateProduct,
  selectedProduct,
  setSelectedProduct,
  setIsEditing,
  isEditing,
}) => {
  const [product, setProduct] = useState({ name: "", price: "", image: null });

  useEffect(() => {
    if (selectedProduct) {
      setProduct({
        name: selectedProduct.name || "",
        price: selectedProduct.price || "",
        image: null, // You will handle image separately
      });
    } else {
      setProduct({ name: "", price: "", image: null });
    }
  }, [selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    if (product.image) {
      formData.append("image", product.image);
    }

    try {
      let response;

      if (isEditing) {
        response = await axios.put(
          `${API_URL}/api/products/${selectedProduct.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        onUpdateProduct(response.data);
        Swal.fire({
          title: "Success!",
          text: "Product updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        response = await axios.post(`${API_URL}/api/products`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        onAddProduct(response.data);
        Swal.fire({
          title: "Success!",
          text: "Product added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }

      setProduct({ name: "", price: "", image: null });
      setSelectedProduct(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error processing product:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to process the product.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-emerald-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-800 flex items-center gap-2">
        <IoMdAddCircle className="text-emerald-600 text-3xl" />
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center border border-emerald-300 rounded-md shadow-sm">
          <FaTag className="text-emerald-600 ml-3" />
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full px-4 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="mb-4 flex items-center border border-emerald-300 rounded-md shadow-sm">
          <FaDollarSign className="text-emerald-600 ml-3" />
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="w-full px-4 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter product price"
            required
          />
        </div>
        <div className="mb-6 flex items-center border border-emerald-300 rounded-md shadow-sm">
          <FaImage className="text-emerald-600 ml-3" />
          <input
            type="file"
            onChange={(e) =>
              setProduct({ ...product, image: e.target.files[0] })
            }
            className="w-full px-4 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
        >
          {isEditing ? "Update Product" : "Add Product"}
          <IoMdAddCircle className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
