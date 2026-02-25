import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiEye,
} from "react-icons/fi";
import axios from "axios";
import { LiaFilterSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import StockChangeModal from "../../../components/AdminSideComponents/Products/StockChangeModal";
import BestProductButton from "../../../components/AdminSideComponents/Products/BestProductButton";
import { BsCartDashFill } from "react-icons/bs";
import { BsFillCartCheckFill } from "react-icons/bs";
import { BsFillCartXFill } from "react-icons/bs";

const StatusReasonModal = ({ isOpen, onClose, reason, status }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {status === "cancel" ? "Cancellation Reason" : "Status Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700">{reason || "No reason provided"}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const SupplierProducts = () => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
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

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

  const supplierData = localStorage.getItem("pm-supplier-data");
  const supplierInfo = supplierData ? JSON.parse(supplierData) : null;
  const supplierId = supplierInfo._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/products-by-supplier/${supplierId}`
        );

        setAllProducts(response?.data?.products);
        setFilteredProducts(response?.data?.products);

        const uniqueCategories = {};
        response?.data?.products?.forEach((product) => {
          if (product.category) {
            if (!uniqueCategories[product.category.name]) {
              uniqueCategories[product.category.name] = {
                id: product.category._id,
                name: product.category.name,
                subCategories: {},
              };
            }
            if (product.subCategory) {
              const subCatName = product.subCategory.name;
              if (
                !uniqueCategories[product.category.name].subCategories[
                  subCatName
                ]
              ) {
                uniqueCategories[product.category.name].subCategories[
                  subCatName
                ] = {
                  id: product.subCategory._id,
                  name: subCatName,
                  subSubCategories: new Set(),
                };
              }
              if (product.subSubCategory) {
                uniqueCategories[product.category.name].subCategories[
                  subCatName
                ].subSubCategories.add(product.subSubCategory.name);
              }
            }
          }
        });

        Object.values(uniqueCategories).forEach((category) => {
          Object.values(category.subCategories).forEach((subCategory) => {
            subCategory.subSubCategories = Array.from(
              subCategory.subSubCategories
            );
          });
        });

        setCategories(Object.values(uniqueCategories));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supplierId]);

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

    if (selectedSubSubCategory) {
      results = results.filter(
        (product) =>
          product.subSubCategory &&
          product.subSubCategory.name === selectedSubSubCategory
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
    selectedSubSubCategory,
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

  const handleStatusClick = (status, reason) => {
    setSelectedStatus(status);
    setSelectedReason(reason);
    setStatusModalOpen(true);
  };

  const handleBestProductToggle = async (productId, newState) => {
    try {
      console.log(
        `Toggling best product status for ${productId} to ${newState}`
      );

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/products/toggle-best-product/${productId}`,
        {
          isBestProduct: newState,
        }
      );

      if (response.status === 200) {
        setAllProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, isBestProduct: newState }
              : product
          )
        );

        setFilteredProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, isBestProduct: newState }
              : product
          )
        );

        const message = newState
          ? "Product marked as best product successfully!"
          : "Product removed from best products successfully!";

        console.log(message);
      }
    } catch (error) {
      console.error("Error updating best product status:", error);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/products-by-supplier/${supplierId}`
      );
      setAllProducts(response?.data?.products);
      setFilteredProducts(response?.data?.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedSubSubCategory("");
    setStockStatus("");
    setCurrentPage(1);
  };

  const subSubCategories =
    selectedCategory && selectedSubCategory
      ? categories.find((cat) => cat.name === selectedCategory)?.subCategories[
          selectedSubCategory
        ]?.subSubCategories || []
      : [];

  const subCategories = selectedCategory
    ? Object.values(
        categories.find((cat) => cat.name === selectedCategory)
          ?.subCategories || {}
      )
    : [];

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
            All Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your all product</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Products..."
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
          <button
            className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
            onClick={() => {
              navigate("/add-products");
            }}
          >
            <FiPlus className="mr-2" />
            Add Product
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
                setSelectedSubCategory("");
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-Category
            </label>
            <select
              value={selectedSubCategory}
              onChange={(e) => {
                setSelectedSubCategory(e.target.value);
                setCurrentPage(1);
              }}
              disabled={!selectedCategory}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">All Sub-Categories</option>
              {subCategories.map((subCat, index) => (
                <option key={index} value={subCat.name}>
                  {subCat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-Sub-Category
            </label>
            <select
              value={selectedSubSubCategory}
              onChange={(e) => {
                setSelectedSubSubCategory(e.target.value);
                setCurrentPage(1);
              }}
              disabled={!selectedSubCategory}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">All Sub-Sub-Categories</option>
              {subSubCategories?.map((subSubCat, index) => (
                <option key={index} value={subSubCat}>
                  {subSubCat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Status
            </label>
            <select
              value={stockStatus}
              onChange={(e) => {
                setStockStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Stocks</option>
              <option value="active">In Stock</option>
              <option value="inactive">Inactive</option>
              <option value="out of stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="mt-6 md:mt-0">
          <button
            onClick={clearAllFilters}
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition duration-150 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <LiaFilterSolid className="mr-2" />
            Clear Filters
          </button>
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
          {selectedSubSubCategory && (
            <span className="inline-flex items-center bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-full">
              Sub-Sub-Category: {selectedSubSubCategory}
              <button
                onClick={() => setSelectedSubSubCategory("")}
                className="ml-2 text-pink-600 hover:text-pink-800"
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
                <th className="px-4 py-3 text-left">Img</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Cat</th>
                <th className="px-4 py-3 text-left">Sub-Cat</th>
                <th className="px-4 py-3 text-left">Sub-Sub-Cat</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Hotshots</th>
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
                  <th className="px-4 py-3 text-left">Img</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Cat</th>
                  <th className="px-4 py-3 text-left">Sub-Cat</th>
                  <th className="px-4 py-3 text-left">Sub-Sub-Cat</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Hotshots</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td
                      onClick={() => {
                        navigate(`/product-details/${product._id}`);
                      }}
                      className="px-4 py-3 cursor-pointer"
                    >
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
                    <td
                      onClick={() => {
                        navigate(`/product-details/${product._id}`);
                      }}
                      className="px-4 py-3 cursor-pointer"
                    >
                      {product.name}
                    </td>
                    <td
                      onClick={() => {
                        navigate(`/product-details/${product._id}`);
                      }}
                      className="px-4 py-3 cursor-pointer"
                    >
                      {product?.category?.name || "N/A"}
                    </td>
                    <td
                      onClick={() => {
                        navigate(`/product-details/${product._id}`);
                      }}
                      className="px-4 py-3 cursor-pointer"
                    >
                      {product?.subCategory?.name || "N/A"}
                    </td>
                    <td
                      onClick={() => {
                        navigate(`/product-details/${product._id}`);
                      }}
                      className="px-4 py-3 cursor-pointer"
                    >
                      {product?.subSubCategory?.name || "N/A"}
                    </td>
                    <td
                      onClick={() => {
                        navigate(`/product-details/${product._id}`);
                      }}
                      className="px-4 py-3 cursor-pointer font-medium"
                    >
                      ₹{product.price}
                    </td>
                    <td className="px-4 py-3">
                      {product.stock_status === "active" && (
                        <button
                          onClick={() =>
                            handleGetStatus(product._id, product.stock_status)
                          }
                          className="px-2 py-1 text-green-700 rounded-full transition-colors cursor-pointer"
                        >
                          <BsFillCartCheckFill size={24} />
                        </button>
                      )}

                      {product.stock_status === "inactive" && (
                        <button
                          onClick={() =>
                            handleGetStatus(product._id, product.stock_status)
                          }
                          className="px-2 py-1 text-yellow-500 rounded-full transition-colors cursor-pointer"
                        >
                          <BsCartDashFill size={24} />
                        </button>
                      )}

                      {product.stock_status === "out of stock" && (
                        <button
                          onClick={() =>
                            handleGetStatus(product._id, product.stock_status)
                          }
                          className="px-2 py-1 text-orange-700 rounded-full transition-colors cursor-pointer"
                        >
                          <BsFillCartXFill size={24} />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.status === "cancel" ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Cancel
                          </span>
                          <button
                            onClick={() =>
                              handleStatusClick(product.status, product.reason)
                            }
                            className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-2 rounded transition"
                            title="View cancellation reason"
                          >
                            <FiEye size={20} />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {product.status === "approved"
                            ? "Approved"
                            : "Pending"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <BestProductButton
                        condition={product.isBestProduct}
                        onToggle={(newState) =>
                          handleBestProductToggle(product._id, newState)
                        }
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

      <StatusReasonModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        status={selectedStatus}
        reason={selectedReason}
      />
    </div>
  );
};

export default SupplierProducts;
