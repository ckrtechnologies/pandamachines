import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";

const AdminQuotation = () => {
  const [allQuotations, setAllQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const quotationsPerPage = 12;

  // Get unique categories from quotations
  const categories = [
    ...new Set(
      allQuotations.map((quotation) => quotation.category?.name).filter(Boolean)
    ),
  ];

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/quotation/get-all-quotation`
        );

        const data = await response.json();

        if (data.success) {
          setAllQuotations(data.data);
          setFilteredQuotations(data.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching quotations:", error);
        setIsLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  useEffect(() => {
    let results = allQuotations;

    if (searchQuery) {
      results = results.filter(
        (quotation) =>
          quotation.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          quotation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quotation.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      results = results.filter(
        (quotation) =>
          quotation.category && quotation.category.name === selectedCategory
      );
    }

    setFilteredQuotations(results);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, allQuotations]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredQuotations.length / quotationsPerPage);
  const indexOfLastQuotation = currentPage * quotationsPerPage;
  const indexOfFirstQuotation = indexOfLastQuotation - quotationsPerPage;
  const currentQuotations = filteredQuotations.slice(
    indexOfFirstQuotation,
    indexOfLastQuotation
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openModal = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuotation(null);
  };

  // Skeleton loader matching AdminProducts style
  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
    </tr>
  );

  // Modal Component
  const QuotationModal = ({ quotation, isOpen, onClose }) => {
    if (!isOpen || !quotation) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Quotation Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {quotation.fullName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      <span className="text-blue-600">{quotation.email}</span>
                    </div>
                    <div>
                      <span className="font-medium">Mobile:</span>{" "}
                      {quotation.mobNumber}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(quotation.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Product Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {quotation?.category?.name || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Sub-Category:</span>{" "}
                      {quotation?.subCategory?.name || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Tier-3 Category:</span>{" "}
                      {quotation?.subSubCategory?.name || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Product:</span>{" "}
                      {quotation?.product?.name || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Subject</h3>
                <p className="text-gray-700">{quotation.subject}</p>
              </div>

              {quotation.message && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Message</h3>
                  <p className="text-gray-700">{quotation.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header - matching AdminProducts style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Quotations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your all quotation requests
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Quotations..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 md:mt-0">
          <button
            onClick={clearAllFilters}
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition duration-150 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <X className="mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedCategory) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchQuery && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Search: {searchQuery}
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("")}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Quotation Table - matching AdminProducts style */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Sl</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Cat</th>
                <th className="px-4 py-3 text-left">Sub-Cat</th>
                <th className="px-4 py-3 text-left">Sub-Sub-Cat</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[...Array(quotationsPerPage)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredQuotations.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table
              className="bg-white shadow-md rounded-lg overflow-hidden"
              style={{ minWidth: "1400px" }}
            >
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left" style={{ width: "60px" }}>
                    Sl
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "150px" }}
                  >
                    Name
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "200px" }}
                  >
                    Email
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "120px" }}
                  >
                    Mobile
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "250px" }}
                  >
                    Subject
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "140px" }}
                  >
                    Cat
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "140px" }}
                  >
                    Sub-Cat
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "160px" }}
                  >
                    Sub-Sub-Cat
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "140px" }}
                  >
                    Product
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentQuotations.map((quotation, index) => (
                  <tr
                    key={quotation._id}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openModal(quotation)}
                  >
                    <td className="px-4 py-3" style={{ width: "60px" }}>
                      {indexOfFirstQuotation + index + 1}
                    </td>
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ width: "150px" }}
                    >
                      <div className="truncate" title={quotation.fullName}>
                        {quotation.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "200px" }}>
                      <div className="truncate" title={quotation.email}>
                        {quotation.email}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "120px" }}>
                      {quotation.mobNumber}
                    </td>
                    <td className="px-4 py-3" style={{ width: "250px" }}>
                      <div className="truncate" title={quotation.subject}>
                        {quotation.subject}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "140px" }}>
                      <div
                        className="truncate"
                        title={quotation?.category?.name || "N/A"}
                      >
                        {quotation?.category?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "140px" }}>
                      <div
                        className="truncate"
                        title={quotation?.subCategory?.name || "N/A"}
                      >
                        {quotation?.subCategory?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "160px" }}>
                      <div
                        className="truncate"
                        title={quotation?.subSubCategory?.name || "N/A"}
                      >
                        {quotation?.subSubCategory?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "140px" }}>
                      <div
                        className="truncate"
                        title={quotation?.product?.name || "N/A"}
                      >
                        {quotation?.product?.name || "N/A"}
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
                  className={`px-3 py-1 rounded-l-md border ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 border-gray-300"
                      : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  <ChevronLeft size={18} />
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
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-4">
            No quotations found for the selected filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="text-[#FF8617] hover:text-[#CC5F0F] font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Modal */}
      <QuotationModal
        quotation={selectedQuotation}
        isOpen={showModal}
        onClose={closeModal}
      />
    </div>
  );
};

export default AdminQuotation;
