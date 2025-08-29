import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./const";
import ReactLoading from "react-loading";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/check-connection`);
        setIsConnected(response.data.connected);
      } catch (error) {
        console.error("Error checking connection:", error);
      } finally {
        // Simulate a loading delay for 2 seconds
        setTimeout(() => {
          setLoading(false);
        }, 2000); // 2000 milliseconds = 2 seconds
      }
    };
    checkConnection();
  }, []);

  if (loading) {
    // Display a loading spinner while checking connection
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center justify-center space-y-4">
          <ReactLoading
            type="spin"
            color="#007bff"
            height={"5%"}
            width={"5%"}
          />
          <p className="mt-2 text-lg">
            Sedang melakukan pengecekan koneksi alat...
          </p>
        </div>
      </div>
    );
  }

  // Use <Navigate> to decide whether to render the protected component or navigate to "/no-connection"
  return isConnected ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/no-connection" />
  );
};

export default ProtectedRoute;
