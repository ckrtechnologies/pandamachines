import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StockChangeModal from "../../../components/AdminSideComponents/Products/StockChangeModal";

const AdminCustomers = () => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const navigate = useNavigate();

  const [stockChangeModalOpen, setStockChangeModalOpen] = useState(false);
  const [cHngModalData, setCHngModalData] = useState({
    prod_id: "",
    prod_status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/get-all-products`
        );

        setAllProducts(response.data);
        setFilteredProducts(response.data);

        const uniqueCategories = {};
        response.data.forEach((product) => {
          if (product.category) {
            if (!uniqueCategories[product.category.name]) {
              uniqueCategories[product.category.name] = {
                id: product.category._id,
                name: product.category.name,
                subCategories: [],
              };
            }
            if (
              product.subCategory &&
              !uniqueCategories[product.category.name].subCategories.includes(
                product.subCategory.name
              )
            ) {
              uniqueCategories[product.category.name].subCategories.push(
                product.subCategory.name
              );
            }
          }
        });

        setCategories(Object.values(uniqueCategories));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let results = allProducts;

    if (searchQuery) {
      results = results.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      results = results.filter(
        (product) =>
          product.category && product.category.name === selectedCategory
      );
    }

    if (selectedSubCategory) {
      results = results.filter(
        (product) =>
          product.subCategory &&
          product.subCategory.name === selectedSubCategory
      );
    }

    if (stockStatus) {
      results = results.filter(
        (product) => product.stock_status === stockStatus
      );
    }

    setFilteredProducts(results);
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategory,
    selectedSubCategory,
    stockStatus,
    allProducts,
  ]);

  const handleGetStatus = (pid, current_status) => {
    setCHngModalData({
      prod_id: pid,
      prod_status: current_status,
    });
    setStockChangeModalOpen(true);
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/get-all-products`
      );
      setAllProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    setStockStatus("");
    setCurrentPage(1);
  };

  const subCategories =
    categories.find((cat) => cat.name === selectedCategory)?.subCategories ||
    [];

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
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
          {/* Order Status Filter */}
          <div>
            <select
              value={stockStatus}
              onChange={(e) => {
                setStockStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Join</option>
              <option value="Today's Orders">Today's Joins</option>
              <option value="Last 30 Day's Orders">Last 30 Day's Joins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery ||
        selectedCategory ||
        selectedSubCategory ||
        stockStatus) && (
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
          {selectedCategory && (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("")}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {selectedSubCategory && (
            <span className="inline-flex items-center bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
              Sub-Category: {selectedSubCategory}
              <button
                onClick={() => setSelectedSubCategory("")}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {stockStatus && (
            <span
              className={`inline-flex items-center text-sm px-3 py-1 rounded-full ${
                stockStatus === "active"
                  ? "bg-green-100 text-green-800"
                  : stockStatus === "inactive"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              Stock:{" "}
              {stockStatus === "active"
                ? "In Stock"
                : stockStatus === "inactive"
                ? "Inactive"
                : "Out of Stock"}
              <button
                onClick={() => setStockStatus("")}
                className={`ml-2 ${
                  stockStatus === "active"
                    ? "text-green-600 hover:text-green-800"
                    : stockStatus === "inactive"
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
                <th className="px-4 py-3 text-left">First Name</th>
                <th className="px-4 py-3 text-left">Last Name</th>
                <th className="px-4 py-3 text-left">IMG URL</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Joining Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[...Array(productsPerPage)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Sl</th>
                  <th className="px-4 py-3 text-left">First Name</th>
                  <th className="px-4 py-3 text-left">Last Name</th>
                  <th className="px-4 py-3 text-left">IMG URL</th>
                  <th className="px-4 py-3 text-left">Gender</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Joining Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {indexOfFirstProduct + index + 1}
                    </td>
                    <td
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => {
                        navigate(`/product-details/${product._id}`);
                      }}
                    >
                      <img
                        src={
                          product.images?.[0] ||
                          "https://c92abd90.delivery.rocketcdn.me/main-files/uploads/2018/01/Top6Sales.png"
                        }
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">
                      {product.category?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {product.subCategory?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 font-medium">${product.price}</td>
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
            No products found for the selected filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="text-[#FF8617] hover:text-[#CC5F0F] font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      <StockChangeModal
        isOpen={stockChangeModalOpen}
        onClose={() => setStockChangeModalOpen(false)}
        cHngModalData={cHngModalData}
        getAllProducts={getAllProducts}
      />
    </div>
  );
};

export default AdminCustomers;
