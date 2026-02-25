import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";
import exportToExcel from "../../../utils/exportToExcel";
import QuotationPDF from "../../../utils/QuotationPDF";
import MultiProductQuotationPDF from "../../../utils/MultiProductQuotationPDF";

const AdminQuotation = () => {
  const [allQuotations, setAllQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const quotationsPerPage = 10;
  const Navigate = useNavigate();

  // Extract unique categories from quotations (using category field directly)
  const categories = [
    ...new Set(
      allQuotations
        .map((quotation) => quotation.category?.name)
        .filter(Boolean),
    ),
  ];

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/quotation/get-all-quotation`,
        );

        const data = await response.json();

        console.log("data", data);

        if (data.success) {
          const reversedData = [...(data?.data || [])].reverse();
          setAllQuotations(reversedData);
          setFilteredQuotations(reversedData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching quotations:", error);
        toast.error("Failed to fetch quotations");
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
          quotation.subject.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory) {
      results = results.filter(
        (quotation) => quotation.category?.name === selectedCategory,
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
    indexOfLastQuotation,
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/quotation/delete-quotation/${id}`,
          {
            method: "DELETE",
          },
        );
        const data = await response.json();
        if (data.success) {
          toast.success("Quotation deleted successfully");
          setAllQuotations(allQuotations.filter((item) => item._id !== id));
          setFilteredQuotations(
            filteredQuotations.filter((item) => item._id !== id),
          ); // Also update filtered list
        } else {
          toast.error(data.message || "Failed to delete quotation");
        }
      } catch (error) {
        console.error("Error deleting quotation:", error);
        toast.error("Failed to delete quotation");
      }
    }
  };

  const handleDownload = async (e, quotation) => {
    e.stopPropagation();
    try {
      toast.loading("Generating PDF...");
      const quotationPDF = new QuotationPDF();
      const multiProductQuotationPDF = new MultiProductQuotationPDF();

      if (quotation.products && quotation.products.length > 0) {
        await multiProductQuotationPDF.generatePDFWithJSPDF(quotation);
      } else {
        await quotationPDF.generatePDFWithJSPDF(quotation);
      }
      toast.dismiss();
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.dismiss();
      toast.error("Error generating PDF");
      console.error(error);
    }
  };

  const openModal = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      const quotations =
        filteredQuotations.length > 0 ? filteredQuotations : allQuotations;

      if (quotations?.length > 0) {
        const tableData = quotations.map((quota) => ({
          "Full Name": quota.fullName || "N/A",
          Email: quota.email || "N/A",
          Phone: quota.mobNumber || "N/A",
          Subject: quota.subject || "N/A",
          City: quota.city || "N/A",
          State: quota.state || "N/A",
          Category: quota.category?.name || "N/A",
          "Sub-Category": quota.subCategory?.name || "N/A",
          "Sub-Sub-Category": quota.subSubCategory?.name || "N/A",
          Product: quota.product?.name || "N/A",
          Quantity: quota.quantity || "N/A",
          "Request Date": formatDate(quota.createdAt),
        }));

        const fileName = `Quotations_${new Date()
          .toLocaleDateString("en-IN")
          .replace(/\//g, "-")}`;
        exportToExcel(tableData, fileName);
        toast.success("Quotations exported successfully");
      } else {
        toast.error("No quotations data to export");
      }
    } catch (error) {
      console.error("Error during export:", error);
      toast.error("Failed to export quotations");
    } finally {
      setIsExporting(false);
    }
  };

  // Skeleton loader
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
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Quotations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your all quotation requests
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
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

          <button
            onClick={handleExportClick}
            disabled={isExporting}
            className="flex items-center gap-2 border border-green-300 rounded-lg px-3 py-2.5 w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-medium text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiDownload size={16} />
            {isExporting ? "Exporting..." : "Export"}
          </button>
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

        <div className="mt-6 md:mt-0 flex gap-4 items-center">
          <button
            onClick={clearAllFilters}
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition duration-150 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <X className="mr-2" />
            Clear Filters
          </button>
          <button
            onClick={() => Navigate("/admin-add-quotation")}
            className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <Plus className="mr-2" />
            Add Quotation
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

      {/* Quotation Table */}
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
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Ref No</th>
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
      ) : currentQuotations.length > 0 ? (
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
                    style={{ width: "120px" }}
                  >
                    City
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "120px" }}
                  >
                    State
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
                    Category
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "140px" }}
                  >
                    Sub-Category
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "160px" }}
                  >
                    Sub-Sub-Category
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "140px" }}
                  >
                    Product
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "100px" }}
                  >
                    Quantity
                  </th>
                  <th
                    className="px-4 py-3 text-left whitespace-nowrap"
                    style={{ width: "130px" }}
                  >
                    Ref No
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "100px" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentQuotations.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      Navigate(`/admin-quotation-details/${item._id}`);
                    }}
                  >
                    <td className="px-4 py-3" style={{ width: "60px" }}>
                      {indexOfFirstQuotation + index + 1}
                    </td>

                    <td
                      className="px-4 py-3 font-medium"
                      style={{ width: "150px" }}
                    >
                      <div className="truncate" title={item.fullName}>
                        {item.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "200px" }}>
                      <div className="truncate" title={item.email}>
                        {item.email}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "120px" }}>
                      {item.mobNumber}
                    </td>
                    <td className="px-4 py-3" style={{ width: "120px" }}>
                      {item.city}
                    </td>
                    <td className="px-4 py-3" style={{ width: "120px" }}>
                      {item.state}
                    </td>
                    <td className="px-4 py-3" style={{ width: "250px" }}>
                      <div className="truncate" title={item.subject}>
                        {item.subject}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "140px" }}>
                      <div
                        className="truncate"
                        title={item.category?.name || "N/A"}
                      >
                        {item.category?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "140px" }}>
                      <div
                        className="truncate"
                        title={item.subCategory?.name || "N/A"}
                      >
                        {item.subCategory?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "160px" }}>
                      <div
                        className="truncate"
                        title={item.subSubCategory?.name || "N/A"}
                      >
                        {item.subSubCategory?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "140px" }}>
                      <div
                        className="truncate"
                        title={item.product?.name || "N/A"}
                      >
                        {item.product?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "100px" }}>
                      {item.quantity || "N/A"}
                    </td>
                    <td
                      className="px-4 py-3 font-medium text-blue-600 whitespace-nowrap"
                      style={{ width: "130px" }}
                    >
                      {item.quotationRef || "N/A"}
                    </td>
                    <td className="px-4 py-3" style={{ width: "100px" }}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDownload(e, item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <FiDownload size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            Navigate(`/admin-edit-quotation/${item._id}`);
                          }}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, item._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
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
                  ),
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
          <p className="text-gray-500 text-lg mb-4">No quotations found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminQuotation;
