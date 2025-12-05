// import React, { useState, useEffect } from "react";
// import { FiSearch, FiX } from "react-icons/fi";
// import { FaArrowRight } from "react-icons/fa6";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import ProductStatusModal from "../../../components/AdminSideComponents/Products/ProductStatusModal";

// const ProductApprove = () => {
//   const [activeTab, setActiveTab] = useState("pending"); // pending, cancel, approved
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   const [statusModalOpen, setStatusModalOpen] = useState(false);
//   const [modalData, setModalData] = useState({
//     prod_id: "",
//     prod_status: "",
//     prod_name: "",
//     current_tab: "",
//   });

//   const handleStatusChange = (productId, currentStatus, productName) => {
//     setModalData({
//       prod_id: productId,
//       prod_status: currentStatus,
//       prod_name: productName,
//       current_tab: activeTab,
//     });
//     setStatusModalOpen(true);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [activeTab]);

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       let apiUrl = `${process.env.REACT_APP_API_URL}/products/status`;

//       if (activeTab === "pending") {
//         apiUrl = `${process.env.REACT_APP_API_URL}/products/pending`;
//       } else if (activeTab === "approved") {
//         apiUrl = `${process.env.REACT_APP_API_URL}/products/status/approved`;
//       } else if (activeTab === "cancel") {
//         apiUrl = `${process.env.REACT_APP_API_URL}/products/status/cancel`;
//       }

//       const response = await axios.get(apiUrl);

//       const productList = response.data.products || [];
//       setProducts(productList);
//       setFilteredProducts(productList);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     let results = products;

//     if (searchQuery) {
//       results = results.filter((product) =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredProducts(results);
//   }, [searchQuery, products]);

//   const clearAllFilters = () => {
//     setSearchQuery("");
//   };

//   const getTabColor = (tab) => {
//     if (tab === "pending") return "text-yellow-600";
//     if (tab === "approved") return "text-green-600";
//     if (tab === "cancel") return "text-red-600";
//     return "text-gray-600";
//   };

//   const getStatusBadgeColor = (tab) => {
//     if (tab === "pending") return "bg-yellow-100 text-yellow-800";
//     if (tab === "approved") return "bg-green-100 text-green-800";
//     if (tab === "cancel") return "bg-red-100 text-red-800";
//     return "bg-gray-100 text-gray-800";
//   };

//   const getStatusText = (tab) => {
//     if (tab === "pending") return "Pending";
//     if (tab === "approved") return "Approved";
//     if (tab === "cancel") return "Rejected";
//     return "Unknown";
//   };

//   // Skeleton loader
//   const SkeletonRow = () => (
//     <tr className="border-b">
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-8"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-8 w-8 bg-gray-200 rounded"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-32"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-24"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-24"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-16"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-6 bg-gray-200 rounded-full w-24"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-6 bg-gray-200 rounded-full w-20"></div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-xl md:text-2xl font-bold text-gray-800">
//             Product Approvals
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage product approvals and rejections
//           </p>
//         </div>

//         <div className="relative flex-grow max-w-md">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search Products..."
//             className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery("")}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               <FiX className="text-gray-400 hover:text-gray-600" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-6 border-b border-gray-200">
//         {["pending", "approved", "cancel"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => {
//               setActiveTab(tab);
//               setSearchQuery("");
//             }}
//             className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
//               activeTab === tab
//                 ? `${getTabColor(tab)} border-b-2 ${getTabColor(tab)} -mb-0.5`
//                 : "text-gray-600 hover:text-gray-800"
//             }`}
//           >
//             {tab === "pending" && "Pending Products"}
//             {tab === "approved" && "Approved Products"}
//             {tab === "cancel" && "Rejected Products"}
//           </button>
//         ))}
//       </div>

//       {/* Active Filters */}
//       {searchQuery && (
//         <div className="flex flex-wrap gap-2 mb-4">
//           <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
//             Search: {searchQuery}
//             <button
//               onClick={() => setSearchQuery("")}
//               className="ml-2 text-blue-600 hover:text-blue-800"
//             >
//               <FiX size={14} />
//             </button>
//           </span>
//         </div>
//       )}

//       {/* Product Table */}
//       {isLoading ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//               <tr>
//                 <th className="px-4 py-3 text-left">Sl</th>
//                 <th className="px-4 py-3 text-left">Img</th>
//                 <th className="px-4 py-3 text-left">Name</th>
//                 <th className="px-4 py-3 text-left">Category</th>
//                 <th className="px-4 py-3 text-left">Price</th>
//                 <th className="px-4 py-3 text-left">Supplier</th>
//                 <th className="px-4 py-3 text-left">Status</th>
//                 <th className="px-4 py-3 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {[...Array(12)].map((_, index) => (
//                 <SkeletonRow key={index} />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : filteredProducts.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//               <tr>
//                 <th className="px-4 py-3 text-left">Sl</th>
//                 <th className="px-4 py-3 text-left">Img</th>
//                 <th className="px-4 py-3 text-left">Name</th>
//                 <th className="px-4 py-3 text-left">Category</th>
//                 <th className="px-4 py-3 text-left">Price</th>
//                 <th className="px-4 py-3 text-left">Supplier</th>
//                 <th className="px-4 py-3 text-left">Status</th>
//                 <th className="px-4 py-3 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {filteredProducts.map((product, index) => (
//                 <tr
//                   key={product._id}
//                   className="border-b hover:bg-blue-50 transition-colors"
//                 >
//                   <td className="px-4 py-3">{index + 1}</td>
//                   <td className="px-4 py-3">
//                     <img
//                       src={
//                         product.images?.[0] ||
//                         "https://c92abd90.delivery.rocketcdn.me/main-files/uploads/2018/01/Top6Sales.png"
//                       }
//                       alt={product.name}
//                       className="w-8 h-8 object-cover rounded"
//                     />
//                   </td>
//                   <td className="px-4 py-3 font-medium max-w-xs truncate">
//                     {product.name}
//                   </td>
//                   <td className="px-4 py-3">
//                     {product?.category?.name || "N/A"}
//                   </td>
//                   <td className="px-4 py-3">₹{product.price}</td>
//                   <td className="px-4 py-3 max-w-xs truncate">
//                     {product?.supplier?.businessName || "N/A"}
//                   </td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full cursor-pointer hover:shadow-md transition-all ${getStatusBadgeColor(
//                         activeTab
//                       )}`}
//                       onClick={() =>
//                         handleStatusChange(
//                           product._id,
//                           product.status,
//                           product.name
//                         )
//                       }
//                     >
//                       {getStatusText(activeTab)}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() =>
//                         navigate(`/approval-product-details/${product._id}`)
//                       }
//                       className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
//                     >
//                       View
//                       <FaArrowRight size={14} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="text-center py-8">
//           <p className="text-gray-500 text-lg mb-4">
//             No {getStatusText(activeTab).toLowerCase()} products found.
//           </p>
//           {searchQuery && (
//             <button
//               onClick={clearAllFilters}
//               className="text-[#FF8617] hover:text-[#CC5F0F] font-medium"
//             >
//               Clear search
//             </button>
//           )}
//         </div>
//       )}

//       <ProductStatusModal
//         isOpen={statusModalOpen}
//         onClose={() => setStatusModalOpen(false)}
//         modalData={modalData}
//         onStatusUpdate={fetchProducts}
//       />
//     </div>
//   );
// };

// export default ProductApprove;

import React, { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductStatusModal from "../../../components/AdminSideComponents/Products/ProductStatusModal";

const ProductApprove = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sellers, setSellers] = useState([]);
  const navigate = useNavigate();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    prod_id: "",
    prod_status: "",
    prod_name: "",
    current_tab: "",
  });

  const handleStatusChange = (productId, currentStatus, productName) => {
    setModalData({
      prod_id: productId,
      prod_status: currentStatus,
      prod_name: productName,
      current_tab: activeTab,
    });
    setStatusModalOpen(true);
  };

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let apiUrl = `${process.env.REACT_APP_API_URL}/products/status`;

      if (activeTab === "pending") {
        apiUrl = `${process.env.REACT_APP_API_URL}/products/pending`;
      } else if (activeTab === "approved") {
        apiUrl = `${process.env.REACT_APP_API_URL}/products/status/approved`;
      } else if (activeTab === "cancel") {
        apiUrl = `${process.env.REACT_APP_API_URL}/products/status/cancel`;
      }

      const response = await axios.get(apiUrl);
      const productList = response.data.products || [];
      setProducts(productList);
      setFilteredProducts(productList);

      // Extract unique sellers
      const uniqueSellers = [
        ...new Set(
          productList.map((p) => p?.supplier?.businessName).filter(Boolean)
        ),
      ];
      setSellers(uniqueSellers);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let results = products;

    // Filter by search query (product name)
    if (searchQuery) {
      results = results.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by seller
    if (selectedSeller) {
      results = results.filter(
        (product) => product?.supplier?.businessName === selectedSeller
      );
    }

    // Filter by status
    if (selectedStatus) {
      results = results.filter((product) => product.status === selectedStatus);
    }

    setFilteredProducts(results);
  }, [searchQuery, selectedSeller, selectedStatus, products]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSeller("");
    setSelectedStatus("");
  };

  const getTabColor = (tab) => {
    if (tab === "pending") return "text-yellow-600";
    if (tab === "approved") return "text-green-600";
    if (tab === "cancel") return "text-red-600";
    return "text-gray-600";
  };

  const getStatusBadgeColor = (tab) => {
    if (tab === "pending") return "bg-yellow-100 text-yellow-800";
    if (tab === "approved") return "bg-green-100 text-green-800";
    if (tab === "cancel") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusText = (tab) => {
    if (tab === "pending") return "Pending";
    if (tab === "approved") return "Approved";
    if (tab === "cancel") return "Rejected";
    return "Unknown";
  };

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
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
    </tr>
  );

  const hasActiveFilters = searchQuery || selectedSeller || selectedStatus;

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Product Approvals
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage product approvals and rejections
          </p>
        </div>

        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by product name..."
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
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {["pending", "approved", "cancel"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery("");
              setSelectedSeller("");
              setSelectedStatus("");
            }}
            className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab
                ? `${getTabColor(tab)} border-b-2 ${getTabColor(tab)} -mb-0.5`
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab === "pending" && "Pending Products"}
            {tab === "approved" && "Approved Products"}
            {tab === "cancel" && "Rejected Products"}
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Seller Filter */}
        <select
          value={selectedSeller}
          onChange={(e) => setSelectedSeller(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
        >
          <option value="">All Sellers</option>
          {sellers.map((seller) => (
            <option key={seller} value={seller}>
              {seller}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="cancel">Rejected</option>
        </select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchQuery && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Product: {searchQuery}
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {selectedSeller && (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              Seller: {selectedSeller}
              <button
                onClick={() => setSelectedSeller("")}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {selectedStatus && (
            <span className="inline-flex items-center bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
              Status: {selectedStatus}
              <button
                onClick={() => setSelectedStatus("")}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-[#FF8617] hover:text-[#CC5F0F] font-medium text-sm"
          >
            Clear all
          </button>
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
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Seller</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
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
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Seller</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={
                        product.images?.[0] ||
                        "https://c92abd90.delivery.rocketcdn.me/main-files/uploads/2018/01/Top6Sales.png"
                      }
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium max-w-xs truncate">
                    {product.name}
                  </td>
                  <td className="px-4 py-3">
                    {product?.category?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">₹{product.price}</td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    {product.uploadedBy === "supplier"
                      ? product?.supplier?.businessName || "N/A"
                      : product.uploadedBy === "admin"
                      ? "Panda machine"
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full cursor-pointer hover:shadow-md transition-all ${getStatusBadgeColor(
                        activeTab
                      )}`}
                      onClick={() =>
                        handleStatusChange(
                          product._id,
                          product.status,
                          product.name
                        )
                      }
                    >
                      {getStatusText(activeTab)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        navigate(`/approval-product-details/${product._id}`)
                      }
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      View
                      <FaArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-4">
            No {getStatusText(activeTab).toLowerCase()} products found.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-[#FF8617] hover:text-[#CC5F0F] font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      <ProductStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        modalData={modalData}
        onStatusUpdate={fetchProducts}
      />
    </div>
  );
};

export default ProductApprove;
