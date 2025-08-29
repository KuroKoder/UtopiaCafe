import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../pages/utils/const";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        { email, password },
        { withCredentials: true } // Mengirim cookie ke server
      );
      Swal.fire({
        icon: "success",
        title: "Login berhasil!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Arahkan ke halaman dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.msg || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: error.response?.data?.msg || "Terjadi kesalahan.",
      });
    }
  };

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
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Welcome Back!
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
