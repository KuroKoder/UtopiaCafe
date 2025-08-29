import React, { useContext, useEffect, useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import axios from "axios";
import { API_URL, MIDTRANS_API_URL, MIDTRANS_CLIENT_ID } from "./utils/const";
import { numberToRupiah } from "./utils/number-to-rupiah";
import OrderModal from "./minicomponent/OrderModal";
import ProductComponent from "./minicomponent/ProductComponent";
import Swal from "sweetalert2";

const OrderDrinks = () => {
  const [quantities, setQuantities] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [paymentToken, setPaymentToken] = useState("");
  const [products, setProducts] = useState([]);
  const [orderData, setOrderData] = useState({
    name: "",
    detail_order: [],
    total_order: 0,
    total_price: 0,
    teaPrice: 0,
    coffeePrice: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`);
        if (response?.data?.data) {
          setProducts(response.data.data);
          const initialQuantities = response.data.data.reduce(
            (acc, product) => {
              acc[product.id] = 0;
              return acc;
            },
            {}
          );
          setQuantities(initialQuantities);

          const teaProduct = response.data.data.find(
            (product) => product.name.toLowerCase() === "tea"
          );
          const coffeeProduct = response.data.data.find(
            (product) => product.name.toLowerCase() === "coffee"
          );

          setOrderData((prevData) => ({
            ...prevData,
            teaPrice: teaProduct ? teaProduct.price : 0,
            coffeePrice: coffeeProduct ? coffeeProduct.price : 0,
          }));
        } else {
          console.error(
            "API response data is not an array:",
            response.data.data
          );
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    return () => fetchProducts();
  }, []);

  const handleQuantityChange = (productId, e) => {
    const value = parseInt(e.target.value) || 0;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value,
    }));
  };

  const handleIncrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max((prevQuantities[productId] || 0) - 1, 0),
    }));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const quantity = quantities[product.id] || 0;
      return total + quantity * product.price;
    }, 0);
  };

  const handleSubmitOrder = () => {
    const totalOrder = Object.values(quantities).reduce(
      (total, qty) => total + qty,
      0
    );

    if (totalOrder > 3) {
      Swal.fire({
        icon: "warning",
        title: "Order Limit Exceeded",
        text: "Kamu hanya bisa memesan dengan total jumlah 3 minuman.",
      });
      return;
    }
    const detailOrder = products.reduce((acc, product) => {
      const quantity = quantities[product.id] || 0;
      if (quantity > 0) {
        acc.push({
          id: product.id.toString(),
          price: product.price,
          quantity: quantity,
          name: product.name,
        });
      }
      return acc;
    }, []);

    // const totalOrder = Object.values(quantities).reduce(
    //   (total, qty) => total + qty,
    //   0
    // );
    const totalPrice = calculateTotal();

    setOrderData({
      ...orderData,
      detail_order: detailOrder,
      total_order: totalOrder,
      total_price: totalPrice,
    });

    setShowSummary(true);
  };

  const handleOrderConfirmation = async (orderData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/orders`,
        {
          ...orderData,
          detail_order: orderData.detail_order,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Mengirim kuki bersama permintaan
        }
      );

      if (response.data && response.data.status === 201) {
        const token = response.data.payment_token;
        setPaymentToken(token);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to create order",
        });
      }

      setShowSummary(false);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      } else {
        console.error("Failed to submit order:", error);
        Swal.fire({
          icon: "error",
          title: "System Error",
          text: "Failed to submit order. Please try again later.",
        });
      }
    }
  };

  const handleSnap = (paymentToken) => {
    window.snap.pay(paymentToken, {
      onSuccess: (result) => {
        localStorage.setItem("Pembayaran", JSON.stringify(result));
        setPaymentToken("");
        const { order_id, transaction_status } = result;
        window.location.href = `/order-status?order_id=${order_id}&status=${transaction_status}`;
      },
      onPending: (result) => {
        if (!result.closed_by_user) {
          localStorage.setItem("Pembayaran", JSON.stringify(result));
          setPaymentToken("");

          window.location.href = "/order";
        }
      },
      onError: (error) => {
        console.error(error);
        setPaymentToken("");
        window.location.href = "/order";
      },
      onClose: () => {
        setOrderData({
          name: "",
          detail_order: [],
          total_order: 0,
          total_price: 0,
          teaPrice: orderData.teaPrice,
          coffeePrice: orderData.coffeePrice,
        });
        setShowSummary(false);
        setPaymentToken("");

        // Redirect kembali ke halaman order jika pengguna menutup snap Midtrans
        window.location.href = "/order";
      },
    });
  };

  useEffect(() => {
    if (paymentToken) {
      handleSnap(paymentToken);
    }
  }, [paymentToken]);

  useEffect(() => {
    const scriptUrl = MIDTRANS_API_URL;
    let scriptTag = document.createElement("script");
    scriptTag.src = scriptUrl;
    scriptTag.setAttribute("data-client-key", MIDTRANS_CLIENT_ID);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <div
      className="orderdrinks min-h-screen flex items-center justify-center bg-primary-color"
      style={{
        backgroundImage: `url("./src/assets/img/kopi.jpg")`,
        backgroundSize: "cover",
        backgroundBlendMode: "overlay",
        opacity: 1,
      }}
    >
      <section className="container mx-auto px-4 mt-20 py-4">
        <div className="w-full lg:w-8/12 xl:w-7/12 mx-auto bg p-6 rounded-lg shadow-lg">
          <div className="text-white">
            <div className="flex justify-center">
              <h2 className="pt-2 text-4xl font-extralight text-white font-pacifico animate-bounce">
                Our Menu
              </h2>
            </div>
            <div className="flex flex-wrap justify-center space-x-4 mt-4">
              {Array.isArray(products) &&
                products.map((product) => (
                  <div
                    key={product.id}
                    className="w-full sm:w-1/2 lg:w-1/3 mb-4 flex justify-center"
                  >
                    <ProductComponent
                      image={product.image}
                      productName={product.name}
                      productPrice={product.price}
                      quantity={quantities[product.id] || 0}
                      handleQuantityChange={(e) =>
                        handleQuantityChange(product.id, e)
                      }
                      handleIncrement={() => handleIncrement(product.id)}
                      handleDecrement={() => handleDecrement(product.id)}
                    />
                  </div>
                ))}
            </div>

            <div className="flex justify-between items-center p-2 mb-2 bg-yellow-900 text-white rounded-lg animate__animated animate__fadeIn">
              <h5 className="font-bold mb-0">Total:</h5>
              <h5 className="font-bold mb-0">
                {numberToRupiah(calculateTotal())}
              </h5>
            </div>
            <button
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-green-500 hover:to-yellow-400 text-white py-2 rounded flex items-center justify-center animate__animated animate__pulse"
              onClick={handleSubmitOrder}
            >
              <HiOutlineShoppingCart className="text-xl mr-2" />
              Pesan Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* OrderModal Component */}
      <OrderModal
        show={showSummary}
        handleClose={() => setShowSummary(false)}
        handleSubmit={handleOrderConfirmation}
        orderData={orderData}
        setOrderData={setOrderData}
        calculateTotal={calculateTotal}
        coffeePrice={orderData.coffeePrice}
        teaPrice={orderData.teaPrice}
      />
    </div>
  );
};

export default OrderDrinks;
