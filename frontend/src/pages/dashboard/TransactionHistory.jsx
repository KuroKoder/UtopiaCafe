// TransactionHistory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/const";
import { format } from "date-fns";
import {
  FaDollarSign,
  FaListUl,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

const STATUS_CLASSES = {
  PENDING_PAYMENT: "bg-yellow-400 text-yellow-800",
  PAID: "bg-green-400 text-green-800",
  CANCELED: "bg-red-400 text-red-800",
  All: "bg-gray-400 text-gray-800",
};

const STATUS_ICONS = {
  PENDING_PAYMENT: <FaClock className="text-white" />,
  PAID: <FaCheckCircle className="text-white" />,
  CANCELED: <FaTimesCircle className="text-white" />,
};

const PAGE_SIZE = 10; // Jumlah item per halaman

const TransactionHistory = ({ isAuthenticated }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Status filter state
  const [searchTerm, setSearchTerm] = useState(""); // Pencarian
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [totalTransactions, setTotalTransactions] = useState(0); // Total transactions state
  const [totalTransactionsByStatus, setTotalTransactionsByStatus] = useState(
    {}
  ); // Total by status state

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1); // Reset halaman saat filter berubah
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset halaman saat pencarian berubah
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTransactions = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/orders`, {
            params: {
              status: statusFilter === "All" ? undefined : statusFilter,
            },
          });

          const sortedTransactions = response.data.data || [];

          // Calculate total transactions and total by status
          setTotalTransactions(sortedTransactions.length);
          const statusCounts = sortedTransactions.reduce((acc, transaction) => {
            const status = transaction.payment_status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          setTotalTransactionsByStatus(statusCounts);

          // Sort transactions by date (descending order)
          sortedTransactions.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setTransactions(sortedTransactions);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          setTransactions([]);
        }
      };
      fetchTransactions();
    }
  }, [statusFilter, isAuthenticated]);

  useEffect(() => {
    // Filter transactions based on search term
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = transactions.filter(
      (transaction) =>
        transaction.order_id.toLowerCase().includes(lowercasedSearchTerm) ||
        transaction.name.toLowerCase().includes(lowercasedSearchTerm)
    );

    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  // Paginate the filtered transactions
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDetailOrder = (detailOrder) => {
    // Asumsikan detailOrder adalah array objek
    if (Array.isArray(detailOrder)) {
      return detailOrder.map((item, index) => (
        <div key={index}>
          {item.name} : {item.quantity}
        </div>
      ));
    }
    return "N/A";
  };

  return (
    <div className="bg-emerald-700 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Transaction History
      </h2>
      <div className="mb-4 flex flex-wrap gap-6">
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 flex-1">
          <div className="font-bold text-lg text-gray-700 mb-2">
            Total Transactions
          </div>
          <div className="text-6xl font-semibold text-black">
            {totalTransactions}
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 flex-1">
          <div className="font-bold text-lg text-gray-700 mb-2">
            Total by Status
          </div>
          {Object.entries(totalTransactionsByStatus).map(([status, count]) => (
            <div
              key={status}
              className={`flex items-center space-x-2 mb-4 p-3 rounded-md ${STATUS_CLASSES[status]} border border-gray-300 shadow-sm`}
            >
              <div className="text-xl">{STATUS_ICONS[status]}</div>
              <div className="text-lg font-semibold">
                {status}: {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Search by Order ID or Name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md p-2 w-full sm:flex-1"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="statusFilter" className="text-white">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
          >
            <option value="All" className={STATUS_CLASSES.All}>
              All
            </option>
            <option
              value="PENDING_PAYMENT"
              className={STATUS_CLASSES.PENDING_PAYMENT}
            >
              Pending Payment
            </option>
            <option value="PAID" className={STATUS_CLASSES.PAID}>
              Paid
            </option>
            <option value="CANCELED" className={STATUS_CLASSES.CANCELED}>
              Canceled
            </option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-emerald-900 text-white">
            <tr>
              <th className="py-3 px-4 border-b">Order ID</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Total Price</th>
              <th className="py-3 px-4 border-b">Orders Detail</th>
              <th className="py-3 px-4 border-b">Payment Method</th>
              <th className="py-3 px-4 border-b">Payment Status</th>
              <th className="py-3 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.order_id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{transaction.order_id}</td>
                  <td className="py-2 px-4 border-b">{transaction.name}</td>
                  <td className="py-2 px-4 border-b">
                    {transaction.total_price}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDetailOrder(transaction.detail_order)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {transaction.payment_method || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        STATUS_CLASSES[transaction.payment_status]
                      }`}
                    >
                      {transaction.payment_status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {format(new Date(transaction.createdAt), "yyyy-MM-dd")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory;
