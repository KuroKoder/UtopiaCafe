import React, { useState } from "react";
import { numberToRupiah } from "../utils/number-to-rupiah";
import { motion } from "framer-motion";

const OrderModal = ({
  show,
  handleClose,
  handleSubmit,
  orderData,
  setOrderData,
  calculateTotal,
  coffeePrice,
  teaPrice,
}) => {
  const [nameError, setNameError] = useState("");
  const [orderError, setOrderError] = useState("");

  const handleNameChange = (e) => {
    setOrderData({ ...orderData, name: e.target.value });
    if (e.target.value) {
      setNameError(""); // Clear error if input is not empty
    }
  };

  const handleFormSubmit = () => {
    let isValid = true;
    if (!orderData.name) {
      setNameError("Nama Pengguna harus diisi");
      isValid = false;
    } else {
      setNameError("");
    }

    const coffeeOrder = orderData.detail_order.find(
      (item) => item.name.toLowerCase() === "coffee"
    );
    const teaOrder = orderData.detail_order.find(
      (item) => item.name.toLowerCase() === "tea"
    );

    if (
      (!coffeeOrder || coffeeOrder.quantity <= 0) &&
      (!teaOrder || teaOrder.quantity <= 0)
    ) {
      setOrderError("Minimal satu pesanan kopi atau teh harus ada");
      isValid = false;
    } else {
      setOrderError("");
    }

    if (isValid) {
      handleSubmit(orderData);
    }
  };

  const coffeeOrder = orderData.detail_order.find(
    (item) => item.name.toLowerCase() === "coffee"
  );
  const teaOrder = orderData.detail_order.find(
    (item) => item.name.toLowerCase() === "tea"
  );

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        show ? "flex" : "hidden"
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg z-10 max-w-md w-full mx-4 p-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold text-white">Detail Pesanan</h2>
          <button
            onClick={handleClose}
            className="text-gray-300 hover:text-gray-500 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="px-4 py-6">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Nama Pengguna
            </label>
            <input
              type="text"
              value={orderData.name}
              onChange={handleNameChange}
              placeholder="Nama Pengguna"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>
          <h5 className="text-lg font-semibold mb-2 text-white">
            Pesanan Kamu
          </h5>
          <div className="mb-4">
            <p className="text-white">
              Kopi: {coffeeOrder ? coffeeOrder.quantity : 0} x {coffeePrice} ={" "}
              {numberToRupiah(
                (coffeeOrder ? coffeeOrder.quantity : 0) * coffeePrice
              )}
            </p>
            <p className="text-white">
              Teh: {teaOrder ? teaOrder.quantity : 0} x {teaPrice} ={" "}
              {numberToRupiah((teaOrder ? teaOrder.quantity : 0) * teaPrice)}
            </p>
            <p className="font-bold text-white">
              Total: {numberToRupiah(calculateTotal())}
            </p>
            {orderError && (
              <p className="text-red-500 text-sm mt-1">{orderError}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="bg-gray-600 text-gray-300 py-2 px-4 rounded hover:bg-gray-700 mr-2 transition-colors duration-300"
            >
              Batal
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFormSubmit}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors duration-300"
            >
              Bayar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderModal;
