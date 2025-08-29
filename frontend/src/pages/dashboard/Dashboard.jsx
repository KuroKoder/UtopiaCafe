import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import { API_URL } from "../utils/const";
import ProductList from "../dashboard/ProductList";
import Modal from "../dashboard/FormModal";
import Tabs from "../dashboard/Tabs";
import TransactionHistory from "../dashboard/TransactionHistory";
import UserList from "../dashboard/UserList";
import { useNavigate } from "react-router-dom";
import useIdleTimeout from "../minicomponent/UseIdleTimeout";

const Dashboard = () => {
  useIdleTimeout();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("Products");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Cek autentikasi dengan permintaan ke server
        await axios.get(`${API_URL}/api/users/authenticate`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("User is not authenticated:", error);
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/products`, {
            withCredentials: true,
          });
          const products = response.data.data;
          setProducts(Array.isArray(products) ? products : []);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
      };

      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleAddProduct = (product) => {
    setProducts([...products, product]);
    setIsModalOpen(false);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setIsEditing(false);
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        withCredentials: true,
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      // Mengirimkan permintaan logout ke server
      await axios.delete(`${API_URL}/api/users/logout`, {
        withCredentials: true,
      });

      // Mengalihkan pengguna ke halaman login
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Optionally show a loading spinner or message
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-primary-color"
      style={{
        backgroundImage: `url("./src/assets/img/kopi.jpg")`,
        backgroundSize: "cover",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="container mx-11 bg-white p-6 m-7 rounded-xl shadow-lg mt-10 sm:mt-6 md:mt-8 lg:mt-10 h-auto">
        <h1 className="text-4xl font-bold text-center p-5 mb-5 rounded-xl">
          <span className="bg-clip-text text-black">Dashboard</span>
        </h1>
        <button
          onClick={handleLogout}
          className="mb-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>
        <Tabs
          tabs={[
            { label: "Products" },
            { label: "Transaction History" },
            { label: "Users" },
          ]}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
        <div className="mt-6">
          {currentTab === "Products" ? (
            <>
              <button
                onClick={openModal}
                className="mb-6 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <FaPlus />
                Add New Product
              </button>
              <ProductList
                products={products}
                onEditProduct={(product) => {
                  setSelectedProduct(product);
                  setIsEditing(true);
                  openModal();
                }}
                onDeleteProduct={handleDeleteProduct}
                setIsEditing={setIsEditing}
              />
            </>
          ) : currentTab === "Transaction History" ? (
            <TransactionHistory isAuthenticated={isAuthenticated} />
          ) : (
            <UserList isAuthenticated={isAuthenticated} />
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Dashboard;
