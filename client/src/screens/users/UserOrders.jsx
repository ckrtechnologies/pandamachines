import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Printer,
  Truck,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BedsCarousel from "../../components/common/BedsCarousel";
import UserNavbar from "../../components/common/UserNavbar";
import { downloadInvoice, printInvoice } from "../../utils/invoiceUtils";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const navigate = useNavigate();

  const getUserData = () => {
    try {
      const userData = localStorage?.getItem("pm-user-data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const user = getUserData();

      if (!user) {
        setError("User not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/get-user-orders/${user._id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedStatus === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.status.toLowerCase() === selectedStatus.toLowerCase()
        )
      );
    }
  }, [selectedStatus, orders]);

  const calculateOrderTotal = (order) => {
    if (order?.totalAmount) return order.totalAmount;

    return order?.products?.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const gst = Number(item.gst) || 0;
      const extraTax = Number(item.extraTax) || 0;
      const shipping = Number(item.shippingCharge) || 0;
      const qty = Number(item.quantity) || 1;

      return total + (price + gst + extraTax + shipping) * qty;
    }, 0);
  };

  const getOrderStatuses = () => {
    return ["All", ...new Set(orders.map((order) => order.status))];
  };

  const getStatusCounts = () => {
    const counts = {};
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "shipped":
        return "text-purple-600 bg-purple-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handlePrint = (e, order) => {
    e.stopPropagation();
    printInvoice(order);
  };

  const handleDownload = (e, order) => {
    e.stopPropagation();
    downloadInvoice(order);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="size-3 sm:size-4" />;
      case "shipped":
        return <Truck className="size-3 sm:size-4" />;
      case "delivered":
        return <CheckCircle className="size-3 sm:size-4" />;
      case "cancelled":
        return <XCircle className="size-3 sm:size-4" />;
      default:
        return <Clock className="size-3 sm:size-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <BedsCarousel />
        <div className="px-4 py-8 animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              <div className="h-5 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold">Error Loading Orders</h2>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <BedsCarousel />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex  gap-3 flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">My Orders</h1>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              Home <FaChevronRight className="mx-2 text-xs" /> My Orders
            </div>
          </div>

          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs sm:text-sm">
            {orders.length} Orders
          </span>
        </div>

        {/* FILTER */}
        <div className="mb-6 mt-4 flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5" />
            <h2 className="font-semibold">Filter:</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {getOrderStatuses().map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-2 whitespace-nowrap rounded-lg border text-xs sm:text-sm ${selectedStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-white"
                  }`}
              >
                {status} (
                {status === "All"
                  ? orders.length
                  : statusCounts[status] || 0}
                )
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const total = calculateOrderTotal(order);
            const firstProduct = order.products[0];
            const extra = order.products.length - 1;

            return (
              <div
                key={order._id}
                onClick={() =>
                  navigate(`/order-details/${order._id}`)
                }
                className="bg-white rounded-lg shadow border cursor-pointer hover:shadow-md transition"
              >
                {/* HEADER */}
                <div className="p-4 border-b flex flex-col gap-3 md:flex-row md:justify-between">
                  <div className="flex justify-between items-center md:block">
                    <h3 className="font-semibold text-sm md:text-base">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-[0.67rem] sm:text-xs text-gray-500 uppercase flex items-center mt-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <button
                        onClick={(e) => handlePrint(e, order)}
                        className="flex items-center gap-1 bg-gray-600 text-white px-2 py-1 text-xs rounded"
                      >
                        <Printer className="size-3 sm:size-4" /> Print
                      </button>

                      <button
                        onClick={(e) => handleDownload(e, order)}
                        className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 text-xs rounded"
                      >
                        <Download className="size-4" />
                        <span className="hidden sm:inline-block">Download</span>
                      </button>

                      <span
                        className={`flex items-center px-2 py-1 rounded-md text-xs ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </div>

                    <span className="font-semibold text-sm">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* PRODUCT */}
                <div className="p-4 flex gap-3">
                  <img
                    alt=""
                    src={
                      firstProduct?.product?.images?.[0] ||
                      "/api/placeholder/80/80"
                    }
                    className="w-14 h-14 md:w-16 md:h-16 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h4 className="font-semibold text-sm md:text-base line-clamp-1">
                      {firstProduct?.product?.name}
                    </h4>

                    <p className="text-[0.66rem] text-gray-400 line-clamp-2 my-1.5">
                      {firstProduct?.product?.description}
                    </p>

                    <div className="text-xs text-gray-600 font-normal flex flex-wrap gap-1 sm:gap-2">
                      <span>Qty: {firstProduct.quantity}</span>
                      <span>•</span>
                      <span>
                        {formatCurrency(firstProduct.price)}
                      </span>
                    </div>

                    {extra > 0 && (
                      <p className="text-xs text-blue-600 mt-2">
                        + {extra} more items
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
// import React, { useState, useEffect } from "react";
// import {
//   Package,
//   Truck,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Calendar,
//   Filter,
//   Plus,
//   Printer,
//   Download,
// } from "lucide-react";
// import UserNavbar from "../../components/common/UserNavbar";
// import { useNavigate } from "react-router-dom";
// import BedsCarousel from "../../components/common/BedsCarousel";
// import { FaChevronRight } from "react-icons/fa";
// import { downloadInvoice, printInvoice } from "../../utils/invoiceUtils";
// const UserOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const navigate = useNavigate();
//   const getUserData = () => {
//     try {
//       const userData = localStorage?.getItem("pm-user-data");
//       return userData ? JSON.parse(userData) : null;
//     } catch (error) {
//       console.error("Error parsing user data:", error);
//       return null;
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const user = getUserData();

//       if (!user) {
//         setError("User not found");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/orders/get-user-orders/${user._id}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch orders");
//       }

//       const data = await response.json();
//       setOrders(data);
//       setFilteredOrders(data);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     if (selectedStatus === "All") {
//       setFilteredOrders(orders);
//     } else {
//       setFilteredOrders(
//         orders.filter(
//           (order) => order.status.toLowerCase() === selectedStatus.toLowerCase()
//         )
//       );
//     }
//   }, [selectedStatus, orders]);
//   const calculateOrderTotal = (order) => {
//     if (order?.totalAmount) return order.totalAmount;

//     return order?.products?.reduce((total, item) => {
//       const price = Number(item.price) || 0;
//       const gst = Number(item.gst) || 0;
//       const extraTax = Number(item.extraTax) || 0;
//       const shipping = Number(item.shippingCharge) || 0;
//       const qty = Number(item.quantity) || 1;

//       return total + (price + gst + extraTax + shipping) * qty;
//     }, 0);
//   };

//   const getOrderStatuses = () => {
//     const statuses = ["All", ...new Set(orders.map((order) => order.status))];
//     return statuses;
//   };

//   const getStatusCounts = () => {
//     const counts = {};
//     orders.forEach((order) => {
//       counts[order.status] = (counts[order.status] || 0) + 1;
//     });
//     return counts;
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return "text-yellow-600 bg-yellow-100";
//       case "shipped":
//         return "text-purple-600 bg-purple-100";
//       case "delivered":
//         return "text-green-600 bg-green-100";
//       case "cancelled":
//         return "text-red-600 bg-red-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   const handlePrint = (order) => {
//     // e.stopPropagation();
//     printInvoice(order);
//   };

//   const handleDownload = (order) => {
//     // e.stopPropagation();
//     downloadInvoice(order);
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return <Clock className="w-4 h-4" />;
//       case "shipped":
//         return <Truck className="w-4 h-4" />;
//       case "delivered":
//         return <CheckCircle className="w-4 h-4" />;
//       case "cancelled":
//         return <XCircle className="w-4 h-4" />;
//       default:
//         return <Clock className="w-4 h-4" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//     }).format(amount);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <UserNavbar />
//         <BedsCarousel />

//         <div className="w-full mx-auto px-4 py-8">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
//             <div className="space-y-6">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
//                   <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
//                   <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
//                   <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Error Loading Orders
//           </h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={fetchOrders}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const statusCounts = getStatusCounts();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <UserNavbar />

//       <BedsCarousel />
//       <div className="w-full mx-auto px-4 md:px-6 lg:px-6 py-8">
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
//               <div className="flex items-center text-gray-500 mt-1 text-sm">
//                 <span>Home</span>
//                 <FaChevronRight className="mx-2 text-xs" />
//                 <span className="text-gray-900 font-medium">My Orders</span>
//               </div>
//             </div>
//             {!loading && (
//               <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
//                 {orders.length} {orders.length === 1 ? "Order" : "Orders"}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Status Filter */}
//         <div className="mb-8">
//           <div className="flex items-center space-x-2 mb-4">
//             <Filter className="w-5 h-5 text-gray-500" />
//             <h2 className="text-lg font-semibold text-gray-900">
//               Filter by Status
//             </h2>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             {getOrderStatuses().map((status) => (
//               <button
//                 key={status}
//                 onClick={() => setSelectedStatus(status)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   selectedStatus === status
//                     ? "bg-blue-600 text-white"
//                     : "bg-white text-gray-700 hover:bg-gray-50"
//                 } border border-gray-200`}
//               >
//                 {status}
//                 {status !== "All" && statusCounts[status] && (
//                   <span className="ml-2 text-sm">({statusCounts[status]})</span>
//                 )}
//                 {status === "All" && (
//                   <span className="ml-2 text-sm">({orders.length})</span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {filteredOrders.length === 0 ? (
//           <div className="text-center py-12">
//             <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">
//               {selectedStatus === "All"
//                 ? "No Orders Found"
//                 : `No ${selectedStatus} Orders`}
//             </h2>
//             <p className="text-gray-600">
//               {selectedStatus === "All"
//                 ? "You haven't placed any orders yet."
//                 : `You have no ${selectedStatus.toLowerCase()} orders.`}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredOrders.map((order) => {
//               const calculatedTotal = calculateOrderTotal(order);
//               const firstProduct = order.products[0];
//               const additionalProductsCount = order.products.length - 1;

//               return (
//                 <div
//                   onClick={() => navigate(`/order-details/${order._id}`)}
//                   key={order._id}
//                   className="bg-white cursor-pointer  rounded-lg shadow-sm border border-gray-200 overflow-hidden"
//                 >
//                   {/* Order Header */}
//                   <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                       <div className="flex items-center space-x-4">
//                         <div>
//                           <h3 className="text-lg font-semibold text-gray-900">
//                             Order #{order._id.slice(-8)}
//                           </h3>
//                           <p className="text-sm text-gray-600 flex items-center mt-1">
//                             <Calendar className="w-4 h-4 mr-1" />
//                             {formatDate(order.createdAt)}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-4 mt-2 sm:mt-0">
//                         <button
//                           onClick={() => handlePrint(order)}
//                           className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
//                         >
//                           <Printer className="w-4 h-4" />
//                           <span>Print</span>
//                         </button>

//                         {/* Download Button */}
//                         <button
//                           onClick={() => handleDownload(order)}
//                           className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
//                         >
//                           <Download className="w-4 h-4" />
//                           <span>Download</span>
//                         </button>

//                         <span
//                           className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                             order.status
//                           )}`}
//                         >
//                           {getStatusIcon(order.status)}
//                           <span className="ml-1">{order.status}</span>
//                         </span>
//                         <div className="text-right">
//                           <p className="text-lg font-bold text-gray-900">
//                             {formatCurrency(calculatedTotal)}
//                           </p>
//                           <p className="text-sm text-gray-500">Total Amount</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* First Product */}
//                   <div className="p-6">
//                     <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
//                       <div className="flex-shrink-0">
//                         <img
//                           src={
//                             firstProduct?.product?.images?.[0] ||
//                             "/api/placeholder/80/80"
//                           }
//                           alt={firstProduct?.product?.name || "Product"}
//                           className="w-16 h-16 object-cover rounded-lg"
//                           onError={(e) => {
//                             e.target.src = "/api/placeholder/80/80";
//                           }}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-semibold text-gray-900">
//                           {firstProduct?.product?.name || "Unknown Product"}
//                         </h4>
//                         <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                           {firstProduct?.product?.description ||
//                             "No description available"}
//                         </p>
//                         <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
//                           <span>
//                             Brand: {firstProduct?.product?.brand || "N/A"}
//                           </span>
//                           <span>•</span>
//                           <span>Qty: {firstProduct?.quantity || 1}</span>
//                           <span>•</span>
//                           <span>
//                             Price:{" "}
//                             {formatCurrency(firstProduct?.price || 0)}
//                           </span>
//                         </div>
//                         {firstProduct?.product?.warranty?.hasWarranty && (
//                           <div className="mt-2">
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                               <CheckCircle className="w-3 h-3 mr-1" />
//                               {
//                                 firstProduct?.product?.warranty?.warrantyDays
//                               }{" "}
//                               Warranty
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Additional Products Count */}
//                     {additionalProductsCount > 0 && (
//                       <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center space-x-2">
//                             <Plus className="w-4 h-4 text-blue-600" />
//                             <span className="text-sm font-medium text-blue-900">
//                               {additionalProductsCount} more product
//                               {additionalProductsCount > 1 ? "s" : ""} in this
//                               order
//                             </span>
//                           </div>
//                           <button
//                             className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                             onClick={() =>
//                               navigate(`/order-details/${order._id}`)
//                             }
//                           >
//                             View Details
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserOrders;
