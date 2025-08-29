import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/const";
import AddUserModal from "../dashboard/AddUserModal"; // Import modal

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      await refreshToken();
      await fetchUsers();
    };
    initialize();
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
      if (error.response) {
        navigate("/dashboard");
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(`${API_URL}/api/users/token`, {
          withCredentials: true,
        });
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const fetchUsers = async () => {
    try {
      const response = await axiosJWT.get(`${API_URL}/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        navigate("/dashboard");
      }
    }
  };

  const handleAddUserClick = () => {
    setIsModalOpen(true); // Open modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">User List</h2>
        <button
          onClick={handleAddUserClick}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
        >
          Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">
                ID
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">
                Name
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {user.email}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        axiosJWT={axiosJWT}
      />
    </div>
  );
};

export default UserList;
