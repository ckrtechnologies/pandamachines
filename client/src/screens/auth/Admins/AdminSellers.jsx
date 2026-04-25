import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiEdit,
  FiUpload,
  FiSlash,
  FiCheckCircle,
} from "react-icons/fi";
import axios from "axios";
import { FaCircleArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import SupplierStatusChangeModal from "../../../components/AdminSideComponents/Supplier/SupplierStatusChangeModal";
import BlockSupplierModal from "../../../components/AdminSideComponents/Supplier/BlockSupplierModal";

const AdminSellers = () => {
  const [allSellers, setAllSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterByStatus, setFilterByStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedBlockSupplier, setSelectedBlockSupplier] = useState(null);

  const sellersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/supplier/suppliers`
      );
      if (response.data.success) {
        setAllSellers(response.data.data);
        setFilteredSellers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingStatus = (status) => {
    return status === "Pending";
  };

  const approvedStatus = (status) => {
    return status === "Approved";
  };

  const rejectedStatus = (status) => {
    return status === "Rejected";
  };

  useEffect(() => {
    let results = allSellers;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter((seller) => {
        return (
          seller?.fullName?.toLowerCase().includes(lowerQuery) ||
          seller?.mobNo?.toLowerCase().includes(lowerQuery) ||
          seller?.businessName?.toLowerCase().includes(lowerQuery) ||
          seller?.panNo?.toLowerCase().includes(lowerQuery) ||
          seller?.gstIn?.toLowerCase().includes(lowerQuery)
        );
      });
    }
    if (selectedDate) {
      const selectedDateString = new Date(selectedDate)
        .toISOString()
        .split("T")[0];
      results = results.filter((seller) => {
        if (!seller.registrationDate) return false;
        const dateString = new Date(seller.registrationDate)
          .toISOString()
          .split("T")[0];
        return dateString === selectedDateString;
      });
    }

    if (filterByStatus) {
      results = results.filter((seller) => {
        if (filterByStatus === "Pending") {
          return pendingStatus(seller.status);
        } else if (filterByStatus === "Approved") {
          return approvedStatus(seller.status);
        } else if (filterByStatus === "Rejected") {
          return rejectedStatus(seller.status);
        }
      });
    }

    setFilteredSellers(results);
    setCurrentPage(1);
  }, [searchQuery, selectedDate, filterByStatus, allSellers]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDate("");
    setFilterByStatus("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredSellers.length / sellersPerPage);
  const indexOfLastSeller = currentPage * sellersPerPage;
  const indexOfFirstSeller = indexOfLastSeller - sellersPerPage;
  const currentSellers = filteredSellers.slice(
    indexOfFirstSeller,
    indexOfLastSeller
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusClick = (seller) => {
    setSelectedSupplier(seller);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleBlockClick = (seller) => {
    setSelectedBlockSupplier(seller);
    setIsBlockModalOpen(true);
  };

  const handleBlockModalClose = () => {
    setIsBlockModalOpen(false);
    setSelectedBlockSupplier(null);
  };

  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
    </tr>
  );

  const StatusBadge = ({ status, seller, onClick }) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case "Pending":
          return {
            text: "Pending",
            className:
              "px-3 py-1 text-xs text-yellow-600 bg-yellow-100 rounded-full transition-colors w-fit cursor-pointer hover:bg-yellow-200",
          };
        case "Rejected":
          return {
            text: "Rejected",
            className:
              "px-3 py-1 text-xs w-fit text-red-700 bg-red-100 rounded-full transition-colors cursor-pointer hover:bg-red-200",
          };
        case "Approved":
          return {
            text: "Approved",
            className:
              "px-3 py-1 text-xs w-fit text-green-700 bg-green-100 rounded-full transition-colors cursor-pointer",
          };
        default:
          return {
            text: status || "Unknown",
            className:
              "px-3 py-1 text-xs w-fit text-gray-700 bg-gray-200 rounded-full transition-colors cursor-default",
          };
      }
    };

    const config = getStatusConfig(status);

    return (
      <p
        className={config.className}
        onClick={() => onClick(seller)}
        title={
          status === "Approved"
            ? "Cannot change approved status"
            : "Click to change status"
        }
      >
        {config.text}
      </p>
    );
  };

  const BlockStatusBadge = ({ isBlocked, seller, onClick }) => {
    return (
      <p
        className={`flex items-center gap-1.5 px-3 py-1 text-xs w-fit rounded-full transition-colors cursor-pointer ${isBlocked
          ? "text-red-700 bg-red-100 hover:bg-red-200"
          : "text-green-700 bg-green-100 hover:bg-green-200"
          }`}
        onClick={() => onClick(seller)}
        title={isBlocked ? "Click to unblock" : "Click to block"}
      >
        {isBlocked ? (
          <>
            <FiSlash size={12} />
            Blocked
          </>
        ) : (
          <>
            <FiCheckCircle size={12} />
            Unblocked
          </>
        )}
      </p>
    );
  };

  const handleEdit = (sellerId) => {
    console.log("Edit seller:", sellerId);
    navigate(`/admin-edit-supplier/${sellerId}`);
  };

  const handleViewDetails = (sellerId) => {
    console.log("View seller details:", sellerId);
    navigate(`/admin-supplier-details/${sellerId}`);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Suppliers
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage all suppliers</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Name, Phone..."
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

          {/* DATE INPUT FILTER */}
          <div className="relative w-full md:w-56">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={filterByStatus}
              onChange={(e) => {
                setFilterByStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2.5 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div
            className="border border-gray-300 rounded-lg px-3 py-2.5 w-full md:w-56 mx-auto bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-gray-800 font-medium text-center cursor-pointer"
            onClick={clearAllFilters}
          >
            <p>Clear All Filters</p>
          </div>
        </div>
      </div>

      {(searchQuery || filterByStatus || selectedDate) && (
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

          {filterByStatus && (
            <span
              className={`inline-flex items-center text-sm px-3 py-1 rounded-full ${filterByStatus === "Approved"
                ? "bg-green-100 text-green-800"
                : filterByStatus === "Rejected"
                  ? "bg-red-100 text-red-500"
                  : filterByStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : ""
                }`}
            >
              Status:{" "}
              {filterByStatus === "Approved"
                ? "Approved"
                : filterByStatus === "Rejected"
                  ? "Rejected"
                  : filterByStatus === "Pending"
                    ? "Pending"
                    : "No suppliers found"}
              <button
                onClick={() => {
                  setFilterByStatus("");
                  setCurrentPage(1);
                }}
                className={`ml-2 ${filterByStatus === "Approved"
                  ? "text-green-600 hover:text-green-800"
                  : filterByStatus === "Rejected"
                    ? "text-red-600 hover:text-red-800"
                    : filterByStatus === "Pending"
                      ? "text-yellow-600 hover:text-yellow-800"
                      : "text-gray-400"
                  }`}
              >
                <FiX size={14} />
              </button>
            </span>
          )}

          {selectedDate && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Date: {selectedDate}
              <button
                onClick={() => setSelectedDate("")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Sellers Table */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Sl</th>
                <th className="px-4 py-3 text-left">Supplier Name</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Business Name</th>
                <th className="px-4 py-3 text-left">Registration Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Block Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[...Array(sellersPerPage)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredSellers.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Sl</th>
                  <th className="px-4 py-3 text-left">Supplier Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Business Name</th>
                  <th className="px-4 py-3 text-left">Registration Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Block Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentSellers.map((seller, index) => (
                  <tr
                    key={seller._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {indexOfFirstSeller + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <h1 className="capitalize font-medium">
                        {seller?.fullName}
                      </h1>
                    </td>
                    <td className="px-4 py-3">{seller?.mobNo || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {seller?.businessName || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {seller?.registrationDate
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-") || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={seller?.status}
                        seller={seller}
                        onClick={handleStatusClick}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <BlockStatusBadge
                        isBlocked={seller?.isBlocked || false}
                        seller={seller}
                        onClick={handleBlockClick}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end items-center gap-3">

                        {/* Upload Products (ONLY if approved & not blocked) */}
                        {seller?.status === "Approved" && !seller?.isBlocked && (
                          <button
                            onClick={() => navigate(`/admin-sellers/bulk-products?supplierId=${seller._id}`)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                            title="Upload Products"
                          >
                            <FiUpload size={14} />
                            Upload
                          </button>
                        )}

                        {/* Edit */}
                        <FiEdit
                          onClick={() => handleEdit(seller._id)}
                          size={20}
                          className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                          title="Edit Seller"
                        />

                        {/* View */}
                        <FaCircleArrowRight
                          onClick={() => handleViewDetails(seller._id)}
                          size={23}
                          className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                          title="View Details"
                        />
                      </div>
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
                  className={`px-3 py-1 rounded-l-md border ${currentPage === 1
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
                      className={`px-4 py-1 border-t border-b ${currentPage === number
                        ? "bg-blue-100 text-blue-600 border-blue-600"
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
                  className={`px-3 py-1 rounded-r-md border ${currentPage === totalPages
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
            No suppliers found for the selected filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <SupplierStatusChangeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        modalData={selectedSupplier}
        refreshSuppliers={fetchData}
      />

      <BlockSupplierModal
        isOpen={isBlockModalOpen}
        onClose={handleBlockModalClose}
        modalData={selectedBlockSupplier}
        refreshSuppliers={fetchData}
      />
    </div>
  );
};

export default AdminSellers;
