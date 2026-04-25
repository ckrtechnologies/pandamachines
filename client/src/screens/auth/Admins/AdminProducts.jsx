import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch, FiUpload, FiX } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import axios from "axios";
import { LiaFilterSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StockChangeModal from "../../../components/AdminSideComponents/Products/StockChangeModal";
import BestProductButton from "../../../components/AdminSideComponents/Products/BestProductButton";
import { BsCartDashFill } from "react-icons/bs";
import { BsFillCartCheckFill } from "react-icons/bs";
import { BsFillCartXFill } from "react-icons/bs";
import exportToExcel from "../../../utils/exportToExcel";
import BrandStatusButton from "../../../components/AdminSideComponents/Products/BrandStatusButton";

export const updateBrandStatus = async (productId, statusValue) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/products/brand-status/${productId}`,
      {
        brandStatus: statusValue,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating brandStatus:", error);
    throw error.response?.data || error;
  }
};

const AdminProducts = () => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [selectedDuplicateName, setSelectedDuplicateName] = useState("");
  const [isExporting, setIsExporting] = useState(false);
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
          `${process.env.REACT_APP_API_URL}/products/get-all-products`,
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
              subCategory.subSubCategories,
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
  }, []);

  const handleBrandStatusToggle = async (productId, newState) => {
    try {
      console.log(`Toggling brand status for ${productId} to ${newState}`);

      await updateBrandStatus(productId, newState);

      setAllProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, brandStatus: newState }
            : product,
        ),
      );

      setFilteredProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, brandStatus: newState }
            : product,
        ),
      );

      const message = newState
        ? "Product marked as brand product successfully!"
        : "Product removed from brand products successfully!";

      toast.success(message);
      console.log(message);
    } catch (error) {
      console.error("Error updating brand status:", error);
      toast.error("Failed to update brand status");
    }
  };

  const getDuplicateProducts = () => {
    const productNames = {};
    const duplicates = [];

    allProducts.forEach((product) => {
      const nameLower = product.name.toLowerCase();
      if (productNames[nameLower]) {
        productNames[nameLower].push(product);
      } else {
        productNames[nameLower] = [product];
      }
    });

    Object.values(productNames).forEach((products) => {
      if (products.length > 1) {
        duplicates.push(...products);
      }
    });

    return duplicates;
  };

  const getUniqueDuplicateNames = () => {
    const productNames = {};
    const uniqueDuplicateNames = [];

    allProducts.forEach((product) => {
      const nameLower = product.name.toLowerCase();
      if (productNames[nameLower]) {
        productNames[nameLower].push(product);
      } else {
        productNames[nameLower] = [product];
      }
    });

    Object.values(productNames).forEach((products) => {
      if (products.length > 1) {
        uniqueDuplicateNames.push(products[0].name);
      }
    });

    return uniqueDuplicateNames;
  };

  const getProductsByDuplicateName = (name) => {
    const nameLower = name.toLowerCase();
    return allProducts.filter(
      (product) => product.name.toLowerCase() === nameLower,
    );
  };

  useEffect(() => {
    let results = allProducts;

    if (showDuplicates && selectedDuplicateName) {
      results = getProductsByDuplicateName(selectedDuplicateName);
    } else if (showDuplicates) {
      results = [];
    } else {
      if (searchQuery) {
        results = results.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.pm_id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedCategory) {
        results = results.filter(
          (product) =>
            product.category && product.category.name === selectedCategory,
        );
      }

      if (selectedSubCategory) {
        results = results.filter(
          (product) =>
            product.subCategory &&
            product.subCategory.name === selectedSubCategory,
        );
      }

      if (selectedSubSubCategory) {
        results = results.filter(
          (product) =>
            product.subSubCategory &&
            product.subSubCategory.name === selectedSubSubCategory,
        );
      }

      if (stockStatus) {
        results = results.filter(
          (product) => product.stock_status === stockStatus,
        );
      }
    }

    setFilteredProducts(results);
  }, [
    searchQuery,
    selectedCategory,
    selectedSubCategory,
    selectedSubSubCategory,
    stockStatus,
    showDuplicates,
    selectedDuplicateName,
    allProducts,
  ]);

  const handleGetStatus = (pid, current_status) => {
    setCHngModalData({
      prod_id: pid,
      prod_status: current_status,
    });
    setStockChangeModalOpen(true);
  };

  const handleBestProductToggle = async (productId, newState) => {
    try {
      console.log(
        `Toggling best product status for ${productId} to ${newState}`,
      );

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/products/toggle-best-product/${productId}`,
        {
          isBestProduct: newState,
        },
      );

      if (response.status === 200) {
        setAllProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, isBestProduct: newState }
              : product,
          ),
        );

        setFilteredProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, isBestProduct: newState }
              : product,
          ),
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
        `${process.env.REACT_APP_API_URL}/products/get-all-products`,
      );
      setAllProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      const products =
        filteredProducts.length > 0 ? filteredProducts : allProducts;

      if (products?.length > 0) {
        const tableData = products.map((prod) => ({
          "Product ID": prod._id,
          "Product Name": prod.name || "N/A",
          Category: prod?.category?.name || "N/A",
          "Sub-Category": prod?.subCategory?.name || "N/A",
          "Sub-Sub-Category": prod?.subSubCategory?.name || "N/A",
          // Price: prod.price || "N/A",
          "Stock Status": prod.stock_status || "N/A",
          "Is Best Product": prod.isBestProduct ? "Yes" : "No",
        }));

        const fileName = `Products_${new Date()
          .toLocaleDateString("en-IN")
          .replace(/\//g, "-")}`;
        exportToExcel(tableData, fileName);
        toast.success("Products exported successfully!");
      } else {
        toast.error("No products data to export");
      }
    } catch (error) {
      console.error("Error during export:", error);
      toast.error("Failed to export products");
    } finally {
      setIsExporting(false);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedSubSubCategory("");
    setStockStatus("");
    setShowDuplicates(false);
    setSelectedDuplicateName("");
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
        ?.subCategories || {},
    )
    : [];

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
              disabled={showDuplicates}
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

          {/* Buttons Group */}
          <div className="flex gap-2">

            {/*  Bulk Upload */}
            <button
              onClick={() => navigate("/admin-products/bulk-upload")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg whitespace-nowrap"
            >
              <FiUpload size={16} />
              Bulk Upload
            </button>

            {/*  Add Product */}
            <button
              className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
              onClick={() => {
                navigate("/add-products");
              }}
            >
              <FiPlus className="mr-2" />
              Add Product
            </button>

            {/*  Export */}
            <button
              onClick={handleExportClick}
              disabled={isExporting}
              className="flex items-center gap-2 border border-green-300 rounded-lg px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              <FiDownload size={16} />
              {isExporting ? "Exporting..." : "Export"}
            </button>

          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-6">
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
              }}
              disabled={showDuplicates}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
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
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              disabled={!selectedCategory || showDuplicates}
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
              onChange={(e) => setSelectedSubSubCategory(e.target.value)}
              disabled={!selectedSubCategory || showDuplicates}
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
              onChange={(e) => setStockStatus(e.target.value)}
              disabled={showDuplicates}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">All Stocks</option>
              <option value="active">In Stock</option>
              <option value="inactive">Inactive</option>
              <option value="out of stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duplicates
            </label>
            {showDuplicates ? (
              <select
                value={selectedDuplicateName}
                onChange={(e) => setSelectedDuplicateName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Duplicate Product Name</option>
                {getUniqueDuplicateNames().map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            ) : (
              <button
                onClick={() => setShowDuplicates(true)}
                className="px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap bg-gray-200 hover:bg-gray-300 text-gray-700 w-full md:w-56"
              >
                Show Duplicates
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 md:mt-6">
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
        stockStatus ||
        showDuplicates) && (
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
                className={`inline-flex items-center text-sm px-3 py-1 rounded-full ${stockStatus === "active"
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
                  className={`ml-2 ${stockStatus === "active"
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
            {showDuplicates && (
              <span className="inline-flex items-center bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                Duplicates: Showing
                <button
                  onClick={() => setShowDuplicates(false)}
                  className="ml-2 text-red-600 hover:text-red-800"
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
                {/* <th className="px-4 py-3 text-left">Price</th> */}
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Hotshots</th>
                <th className="px-4 py-3 text-left">Brand</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[...Array(12)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredProducts.length > 0 ? (
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
                {/* <th className="px-4 py-3 text-left">Price</th> */}
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Hotshots</th>
                <th className="px-4 py-3 text-left">Brand</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredProducts.map((product, index) => (
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
                    {index + 1}
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
                  {/* <td
                    onClick={() => {
                      navigate(`/product-details/${product._id}`);
                    }}
                    className="px-4 py-3 cursor-pointer font-medium"
                  >
                    ₹{product.price}
                  </td> */}
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
                    <BestProductButton
                      condition={product.isBestProduct}
                      onToggle={(newState) =>
                        handleBestProductToggle(product._id, newState)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <BrandStatusButton
                      condition={product.brandStatus}
                      onToggle={(newState) =>
                        handleBrandStatusToggle(product._id, newState)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default AdminProducts;
