import React from "react";
import { numberToRupiah } from "../utils/number-to-rupiah";
import { FaCoffee, FaLeaf, FaStar } from "react-icons/fa";
import "animate.css";

const ProductComponent = ({
  image,
  productName,
  productPrice,
  quantity,
  handleQuantityChange,
  handleDecrement,
  handleIncrement,
}) => {
  // Tentukan deskripsi berdasarkan nama produk
  const getProductDescription = (name) => {
    if (name.toLowerCase().includes("coffee")) {
      return "A rich and aromatic coffee blend perfect for your morning.";
    } else if (name.toLowerCase().includes("tea")) {
      return "A soothing and relaxing tea blend for any time of the day.";
    } else {
      return "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    }
  };

  return (
    <div className="w-full mb-4 animate__animated animate__fadeInUp">
      <div className="bg-black rounded-lg overflow-hidden shadow-lg max-w-xs mx-auto">
        <div className="relative">
          <img
            src={image}
            className="w-full h-48 object-cover animate__animated animate__zoomIn"
            alt={productName}
          />
          <div className="absolute top-2 right-2 bg-secondary-color text-yellow-400 rounded-full p-1 flex items-center">
            <FaStar className="mr-1" />
            <span>5.4</span>
          </div>
        </div>
        <div className="p-4">
          <h6 className="text-lg font-bold text-white mb-2 animate__animated animate__fadeIn">
            {productName}{" "}
            {productName.toLowerCase().includes("coffee") ? (
              <FaCoffee className="inline text-white" />
            ) : (
              <FaLeaf className="inline text-green-600" />
            )}
          </h6>
          <p className="text-sm text-gray-300 mb-4">
            {getProductDescription(productName)}
          </p>

          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-bold text-white animate__animated animate__fadeIn animate__delay-1s">
              {numberToRupiah(productPrice)}
            </p>
          </div>

          <div className="flex justify-center items-center">
            <button
              className="btn tombol-jumlah bg-orange-900 text-white rounded-full w-8 h-8 flex items-center justify-center animate__animated animate__pulse animate__infinite"
              type="button"
              onClick={handleDecrement}
            >
              -
            </button>
            <input
              className="quantity font-bold text-center mx-2 border border-gray-300 rounded-md w-16 h-8 text-black"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <button
              className="btn tombol-jumlah bg-yellow-900 text-white rounded-full w-8 h-8 flex items-center justify-center animate__animated animate__pulse animate__infinite"
              type="button"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComponent;
