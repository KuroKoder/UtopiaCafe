import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./utils/const";
import { paymentStatusMapping } from "./utils/status-mapping"; // Import mapping status
import WebSocketComponent from "./minicomponent/WebsocketComponent";

const OrderStatus = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("order_id");

  const [orderDetails, setOrderDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [nameUser, setNameUser] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders/${orderId}`);
        const { data } = response.data;

        // Check the type of detail_order
        if (data && Array.isArray(data.detail_order)) {
          setOrderDetails(data.detail_order);
          setNameUser(data.name);
          setPaymentStatus(data.payment_status);
          setPaymentMethod(data.payment_method);
        } else {
          console.error("Unexpected data format: ", data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      console.error("order_id is undefined");
      setIsLoading(false);
    }
  }, [orderId]);

  const getStatusClass = () => {
    const status = paymentStatusMapping[paymentStatus];
    return status ? status.className : "";
  };

  const getStatusLabel = () => {
    const status = paymentStatusMapping[paymentStatus];
    return status ? status.label : "Status Tidak Dikenal";
  };

  // Define messages for different payment statuses
  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "PAID":
        return {
          title: "Terima Kasih!",
          message: "Pembayaran Anda telah diterima.",
          className: "bg-green-500 text-white",
        };
      case "PENDING_PAYMENT":
        return {
          title: "Menunggu Konfirmasi",
          message: "Pembayaran Anda sedang menunggu konfirmasi.",
          className: "bg-yellow-500 text-white",
        };
      case "CANCELED":
        return {
          title: "Pembayaran Gagal",
          message: "Pembayaran Anda gagal. Silakan coba lagi.",
          className: "bg-red-500 text-white",
        };
      default:
        return {
          title: "Status Tidak Dikenal",
          message: "Status pembayaran tidak dapat dipastikan.",
          className: "bg-gray-500 text-white",
        };
    }
  };

  const { title, message, className } = getStatusMessage();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-primary-color flex flex-col items-center justify-center"
      style={{ backgroundImage: `url("./src/assets/img/kopi.jpg")` }}
    >
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-3xl p-6 md:p-8 flex flex-col md:flex-row">
        <div className="flex-1">
          <div className="border-b py-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-secondary-color">
              Resi Pembayaran
            </h1>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-primary-color mb-2">
              Informasi Pesanan
            </h2>
            <p className="text-sm mb-1">
              Nama Pemesan: <span className="font-semibold">{nameUser}</span>
            </p>
            <p className="text-sm mb-1">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
            <p className={`text-sm ${getStatusClass()}`}>
              Status Pembayaran:{" "}
              <span className="font-semibold">{getStatusLabel()}</span>
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-primary-color mb-2">
              Detail Pembayaran
            </h2>
            <p className="text-sm mb-1">
              Metode Pembayaran:{" "}
              <span className="font-semibold">{paymentMethod}</span>
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-primary-color mb-2">
              Detail Pesanan
            </h2>
            {isLoading ? (
              <p className="text-sm">Loading...</p>
            ) : orderDetails.length === 0 ? (
              <p className="text-sm">Tidak ada detail pesanan.</p>
            ) : (
              orderDetails.map((item) => (
                <div key={item.id} className="text-sm mb-2">
                  <p>
                    Nama Item:{" "}
                    <span className="font-semibold">{item.name}</span>
                  </p>
                  <p>
                    Jumlah:{" "}
                    <span className="font-semibold">{item.quantity}</span>
                  </p>
                  <p>
                    Harga: <span className="font-semibold">{item.price}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 p-4 md:p-8">
          <WebSocketComponent />
        </div>
      </div>
      <div
        className={`border-t pt-4 mt-4 text-center ${className} rounded-lg p-4 w-full max-w-3xl`}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default OrderStatus;
