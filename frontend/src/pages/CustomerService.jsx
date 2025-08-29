import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";

const CustomerService = () => {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    // Menjalankan animasi saat komponen dimuat
    setAnimationClass("animate__animated animate__zoomIn");
  }, []);

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-primary-color relative overflow-hidden`}
      style={{
        backgroundImage: `url("./src/assets/img/kopi.jpg")`,
        backgroundSize: "cover",
        backgroundBlendMode: "overlay",
      }}
    >
      <div
        className={`flex flex-col items-center bg-white rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${animationClass}`}
      >
        <img
          className="object-cover w-full rounded-t-lg h-72 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
          src="./src/assets/img/customer.jpg"
          alt=""
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Customer Support
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Need assistance? Contact our customer support team via WhatsApp for
            quick help.
          </p>
          <div className="flex items-center mt-4">
            <span className="inline-block bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2">
              WhatsApp
            </span>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <FaWhatsapp className="text-3xl" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;
