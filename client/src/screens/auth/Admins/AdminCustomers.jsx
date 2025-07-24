import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import DeleteAlertModal from "../../../components/AdminSideComponents/Common/DeleteAlertModal";

const AdminCustomers = () => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredByDay, setFilteredByDay] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const customerPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/customers/get-all-users`
      );
      const reversedData = response.data?.data?.slice().reverse();
      setAllCustomers(reversedData);
      setFilteredCustomers(reversedData);
      // console.log("response data __>", response.data?.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setIsLoading(false);
  };

  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      setError("");

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/customers/delete-user/${selectedUser._id}`
      );

      await fetchData();
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(
        err.response?.data?.message || "Failed to delete customer details"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDelete = (customer) => {
    setSelectedUser(customer);
    setDeleteModalOpen(true);
  };

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
    let results = allCustomers;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter((cust) => {
        return (
          cust?.firstName?.toLowerCase().includes(lowerQuery) ||
          cust?.lastName?.toLowerCase().includes(lowerQuery) ||
          cust?.email?.toLowerCase().includes(lowerQuery) ||
          cust?.phone?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    if (filteredByDay) {
      results = results.filter((cust) => {
        if (filteredByDay === "today") {
          return isToday(cust.createdAt);
        } else if (filteredByDay === "last30") {
          return last30Days(cust.createdAt);
        }
        return true;
      });
    }

    setFilteredCustomers(results);
    setCurrentPage(1);
  }, [searchQuery, selectedDate, filteredByDay, allCustomers]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilteredByDay("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredCustomers.length / customerPerPage);
  const indexOfLastCustomers = currentPage * customerPerPage;
  const indexOfFirstCustomer = indexOfLastCustomers - customerPerPage;
  const currentCustomer = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomers
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
      {/* <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td> */}
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
    </tr>
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Customers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your all customers
          </p>
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
              <option value="">All Joins</option>
              <option value="today">Today's Joins</option>
              <option value="last30">Last 30 Day's Joins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || filteredByDay) && (
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
                ? "Today's customers"
                : filteredByDay === "last30"
                ? "Last 30 Day's customers"
                : "No customers Found"}
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
                {/* <th className="px-4 py-3 text-left">Image</th> */}
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Join Date</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[...Array(customerPerPage)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredCustomers.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Sl</th>
                  <th className="px-4 py-3 text-left">User Name</th>
                  {/* <th className="px-4 py-3 text-left">Image</th> */}
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Gender</th>
                  <th className="px-4 py-3 text-left">Join Date</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentCustomer.map((cust, index) => (
                  <tr
                    key={cust?._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {indexOfFirstCustomer + index + 1}
                    </td>
                    <td className="px-4 py-3 cursor-pointer">
                      <h1 className="capitalize">
                        {cust?.firstName} {cust?.lastName}
                      </h1>
                    </td>
                    {/* <td className="px-4 py-3">
                      <img src={cust?.imageUrl} alt={cust?.imageUrl} />
                    </td> */}
                    <td className="px-4 py-3">{cust?.phone || "N/A"}</td>
                    <td className="px-4 py-3">{cust?.email}</td>
                    <td className="px-4 py-3">{cust?.gender}</td>
                    <td className="px-4 py-3">
                      {cust?.createdAt
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-") || "N/A"}
                    </td>
                    <td className="px-4 py-3 flex items-center justify-center">
                      <MdDelete
                        size={20}
                        className="bg-white text-red-700 cursor-pointer"
                        onClick={() => handleDelete(cust)}
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
            No customers found for the selected filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="text-[#FF8617] hover:text-[#CC5F0F] font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
      <DeleteAlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        dltType="Customer"
        dltName={
          selectedUser
            ? `${selectedUser.firstName} ${selectedUser.lastName}`
            : ""
        }
        dltLoading={deleteLoading}
      />
    </div>
  );
};

export default AdminCustomers;
