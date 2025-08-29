import React from "react";
import ReactDOM from "react-dom";
import ProductForm from "./ProductForm"; // Sesuaikan path jika berbeda

const Modal = ({
  isOpen,
  onClose,
  onAddProduct,
  onUpdateProduct,
  selectedProduct,
  setSelectedProduct,
  setIsEditing,
  isEditing,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-6 md:mx-8 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <ProductForm
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
      </div>
    </div>,
    document.body
  );
};

export default Modal;
