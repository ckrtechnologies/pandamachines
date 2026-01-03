import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { MessageCircle } from "lucide-react";
import Swal from "sweetalert2";

const AdminChatBotInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const inquiryPerPage = 10;

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chatbot-inquiry/get-all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const data = responseData?.data || responseData;
      const sortedData = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      setInquiries(sortedData);
      setFilteredInquiries(sortedData);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch inquiries. Please check if the server is running.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (dataToFilter) => {
    let results = dataToFilter;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter((inq) => {
        return (
          inq?.name?.toLowerCase().includes(lowerQuery) ||
          inq?.email?.toLowerCase().includes(lowerQuery) ||
          inq?.phone?.toLowerCase().includes(lowerQuery) ||
          inq?.product?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    setFilteredInquiries(results);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters(inquiries);
  }, [searchQuery, inquiries]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredInquiries.length / inquiryPerPage);
  const indexOfLastInquiry = currentPage * inquiryPerPage;
  const indexOfFirstInquiry = indexOfLastInquiry - inquiryPerPage;
  const currentInquiries = filteredInquiries.slice(
    indexOfFirstInquiry,
    indexOfLastInquiry
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            ChatBot Inquiries
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer inquiries from the chatbot
          </p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800">{inquiries.length}</p>
          <p className="text-gray-500 text-sm">Total Inquiries</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, phone, or product..."
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

        {searchQuery && (
          <button
            onClick={clearAllFilters}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            Search: {searchQuery}
            <button
              onClick={() => setSearchQuery("")}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <FiX size={14} />
            </button>
          </span>
        </div>
      )}
      {isLoading ? (
        <div className="overflow-x-auto bg-white rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase border-b">
              <tr>
                <th className="px-4 py-3 text-left">Sl</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Message</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[...Array(inquiryPerPage)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredInquiries.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white rounded-lg ">
            <table className="min-w-full">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Sl</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Message</th>
                  {/* <th className="px-4 py-3 text-left">Date</th> */}
                  {/* <th className="px-4 py-3 text-center">Action</th> */}
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentInquiries.map((inquiry, index) => (
                  <tr
                    key={inquiry._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {indexOfFirstInquiry + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">{inquiry.name}</td>
                    <td className="px-4 py-3 text-sm break-all">
                      {inquiry.email}
                    </td>
                    <td className="px-4 py-3">{inquiry.phone}</td>
                    <td
                      className="px-4 py-3 text-sm max-w-xs truncate"
                      title={inquiry.product}
                    >
                      {inquiry.product}
                    </td>
                    <td
                      className="px-4 py-3 text-sm max-w-xs truncate"
                      title={inquiry.message}
                    >
                      {inquiry.message}
                    </td>
                    {/* <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {formatDate(inquiry.createdAt)}
                    </td> */}
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
                          ? "bg-blue-100 text-blue-600 border-blue-500"
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
        <div className="bg-white rounded-lg p-12 text-center">
          <MessageCircle
            size={48}
            className="mx-auto mb-4 opacity-50 text-gray-400"
          />
          <p className="text-gray-500 text-lg mb-4">
            {searchQuery
              ? "No inquiries found for the selected search."
              : "No inquiries found."}
          </p>
          {searchQuery && (
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminChatBotInquiry;
