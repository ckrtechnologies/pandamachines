import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import axios from "axios";
import { FaCircleArrowRight } from "react-icons/fa6";

const AdminOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredByDay, setFilteredByDay] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [exchangeStatus, setExchangeStatus] = useState("");
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders/get-all-orders`
        );
        setAllOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const last30Days = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    const diffTime = today - date;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 30 && diffDays >= 0;
  };

  useEffect(() => {
    let results = allOrders;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter((order) => {
        return (
          order?.user?.firstName?.toLowerCase().includes(lowerQuery) ||
          order?.user?.lastName?.toLowerCase().includes(lowerQuery) ||
          order?.user?.email?.toLowerCase().includes(lowerQuery) ||
          order?.user?.phone?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    if (filteredByDay) {
      results = results.filter((order) => {
        if (filteredByDay === "today") {
          return isToday(order.createdAt);
        } else if (filteredByDay === "last30") {
          return last30Days(order.createdAt);
        }
        return true;
      });
    }

    if (stockStatus) {
      results = results.filter((order) => order?.status === stockStatus);
    }

    if (exchangeStatus) {
      results = results.filter(
        (order) => order?.exchangeRequest?.status === exchangeStatus
      );
    }

    setFilteredOrders(results);
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedDate,
    filteredByDay,
    allOrders,
    stockStatus,
    exchangeStatus,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilteredByDay("");
    setCurrentPage(1);
    setStockStatus("");
    setExchangeStatus("");
  };

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrder = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Skeleton loader
  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your all orders</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Phone Numbers.."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          {/* Order Date Filter */}
          <div>
            <select
              value={filteredByDay}
              onChange={(e) => {
                setFilteredByDay(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Orders</option>
              <option value="today">Today's Orders</option>
              <option value="last30">Last 30 Day's Orders</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || filteredByDay || stockStatus || exchangeStatus) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchQuery && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Search: {searchQuery}
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {filteredByDay && (
            <span
              className={`inline-flex items-center text-sm px-3 py-1 rounded-full ${
                filteredByDay === "today"
                  ? "bg-green-100 text-green-800"
                  : filteredByDay === "last30"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              Order:{" "}
              {filteredByDay === "today"
                ? "Today's Orders"
                : filteredByDay === "last30"
                ? "Last 30 Day's Orders"
                : "No orders Found"}
              <button
                onClick={() => {
                  setFilteredByDay("");
                  setSelectedDate("");
                  setCurrentPage(1);
                }}
                className={`ml-2 ${
                  filteredByDay === "today"
                    ? "text-green-600 hover:text-green-800"
                    : filteredByDay === "last30"
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-orange-600 hover:text-orange-800"
                }`}
              >
                <FiX size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Product Table */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Sl</th>
                <th className="px-4 py-3 text-left">User Name</th>
                <th className="px-4 py-3 text-left">User Email</th>
                <th className="px-4 py-3 text-left">User Phone</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Exchange Status</th>
                <th className="px-4 py-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[...Array(ordersPerPage)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredOrders.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Sl</th>
                  <th className="px-4 py-3 text-left">User Name</th>
                  <th className="px-4 py-3 text-left">User Email</th>
                  <th className="px-4 py-3 text-left">User Phone</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Exchange Status</th>
                  <th className="px-4 py-3 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentOrder.map((order, index) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {indexOfFirstOrder + index + 1}
                    </td>
                    <td>
                      <h1 className="capitalize">
                        {order?.user?.firstName} {order?.user?.lastName}
                      </h1>
                    </td>
                    <td className="px-4 py-3">{order?.user?.email}</td>
                    <td className="px-4 py-3">{order?.user?.phone || "N/A"}</td>
                    <td className="px-4 py-3">
                      {order?.createdAt
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-") || "N/A"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ₹ {order?.totalAmount}
                    </td>
                    <td className="px-4 py-3">
                      {order?.status === "Pending" && (
                        <p className="px-2 py-1 text-yellow-400 rounded-full transition-colors cursor-pointer">
                          Pending
                        </p>
                      )}
                      {order?.status === "Cancelled" && (
                        <p className="px-2 py-1 text-red-700 rounded-full transition-colors cursor-pointer">
                          Cancelled
                        </p>
                      )}
                      {order?.status === "Delivered" && (
                        <p className="px-2 py-1 text-green-700 rounded-full transition-colors cursor-pointer">
                          Deliverd
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order?.exchangeRequest?.status}
                    </td>
                    <td className="px-4 py-3 flex justify-center items-center">
                      <FaCircleArrowRight
                        size={25}
                        className="bg-white text-red-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l-md border ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 border-gray-300"
                      : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  <FiChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-1 border-t border-b ${
                        currentPage === number
                          ? "bg-blue-100 text-[#00395F] border-[#00395F]"
                          : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r-md border ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 border-gray-300"
                      : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  <FiChevronRight size={18} />
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-4">
            No orders found for the selected filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="text-[#FF8617] hover:text-[#CC5F0F] font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
