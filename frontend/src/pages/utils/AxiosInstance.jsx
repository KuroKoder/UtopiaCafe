import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../utils/const";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/token`, {
          withCredentials: true,
        });
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setExpire(decoded.exp);
      } catch (error) {
        console.error("Error fetching token:", error);
        // Handle token fetch error (e.g., redirect to login)
      }
    };

    fetchToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/token`, {
        withCredentials: true,
      });
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Handle refresh token error (e.g., redirect to login)
    }
  };

  const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        await refreshToken();
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ axiosInstance, axiosJWT }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
