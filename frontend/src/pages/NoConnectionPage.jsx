import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URL } from "./utils/const";

const NoConnectionPage = () => {
  const navigate = useNavigate();

  const handleRetry = async () => {
    try {
      const response = await fetch(`${API_URL}/api/check-connection`);
      const data = await response.json();
      if (data.connected) {
        navigate("/order/*"); // ganti dengan rute halaman order Anda
      } else {
        Swal.fire({
          icon: "error",
          title: "ESP32 Not Connected",
          text: "ESP32 masih tidak terhubung. Silakan coba lagi.",
          confirmButtonColor: "#dc3545", // Warna tombol konfirmasi
          confirmButtonText: "OK", // Teks tombol konfirmasi
        });
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      Swal.fire({
        icon: "error",
        title: "ESP32 Not Connected",
        text: "ESP32 masih tidak terhubung. Silakan coba lagi.",
        confirmButtonColor: "#dc3545", // Warna tombol konfirmasi
        confirmButtonText: "OK", // Teks tombol konfirmasi
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary-color to-secondary-color">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">No Connection</h1>
        <p className="text-gray-700 mb-6">
          Server is not connected to ESP32. Please check your connection and try
          again Or call CS.
        </p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default NoConnectionPage;
