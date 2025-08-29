import React from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaDollarSign } from "react-icons/fa";
import { MdImage } from "react-icons/md";

const ProductList = ({
  products,
  onEditProduct,
  onDeleteProduct,
  setIsEditing,
}) => {
  const handleDelete = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#F44336",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteProduct(productId);
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      }
    });
  };

  return (
    <div className="space-y-6 h-auto mx-auto">
      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No products available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-500 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-3 text-white flex items-center gap-2">
                <FaDollarSign className="text-white" />
                {product.name}
              </h2>
              <div className="relative mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-cover "
                />
                {!product.image && (
                  <MdImage className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-6xl" />
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-2xl font-extrabold">
                  <span className="text-white">Rp.{product.price}</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      onEditProduct(product);
                      setIsEditing(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
