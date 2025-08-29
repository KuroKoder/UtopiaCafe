import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

const FooterComponent = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="./src/assets/img/utopia.png"
              alt="Company Logo"
              className="w-12 h-12 mr-2"
            />
            <div>
              <h1 className="text-xl font-bold">UtopiaCafe</h1>
              <p className="text-sm">© 2024 UtopiaCafe. All rights reserved.</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="/order" className="text-gray-400 hover:text-white">
              Order
            </a>
            <a href="/flow" className="text-gray-400 hover:text-white">
              Order Flow
            </a>
            <a href="/cs" className="text-gray-400 hover:text-white">
              Customer Service
            </a>
            {/* Icon dan link Instagram */}
            <a href="#" className="text-gray-400 hover:text-white">
              <FaInstagram />
            </a>
            {/* Tambahkan ikon dan link sosial media lainnya di sini */}
            <a href="#" className="text-gray-400 hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
