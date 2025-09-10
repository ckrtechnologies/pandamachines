// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import UserNavbar from "../../components/common/UserNavbar";
// import axios from "axios";
// import {
//   FiTruck,
//   FiCreditCard,
//   FiFileText,
//   FiMessageSquare,
//   FiHome,
//   FiCheckCircle,
// } from "react-icons/fi";
// import BedsCarousel from "../../components/common/BedsCarousel";

// function OrderDetails() {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const dataById = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/orders/get-order-by-id/${orderId}`
//       );
//       setOrder(response?.data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch order details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price || 0);
//   };

//   useEffect(() => {
//     if (orderId) {
//       dataById();
//     }
//   }, [orderId]);

//   const calculatedTotals = useMemo(() => {
//     if (!order || !order.products) {
//       return { subtotal: 0, shipping: 0, gst: 0, extraTax: 0, total: 0 };
//     }

//     const subtotal = order.products.reduce(
//       (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
//       0
//     );

//     const shipping = order.products.reduce(
//       (sum, item) =>
//         sum + (item.product?.shippingCharge || 0) * (item.quantity || 1),
//       0
//     );

//     const gst = order.products.reduce(
//       (sum, item) =>
//         sum +
//         ((item.product?.price || 0) *
//           (item.quantity || 1) *
//           (item.product?.gstPercentage || 0)) /
//           100,
//       0
//     );

//     const extraTax = order.products.reduce(
//       (sum, item) =>
//         sum +
//         ((item.product?.price || 0) *
//           (item.quantity || 1) *
//           (item.product?.extraTaxPercentage || 0)) /
//           100,
//       0
//     );

//     const total = subtotal + shipping + gst + extraTax;

//     return { subtotal, shipping, gst, extraTax, total };
//   }, [order]);

//   if (loading) {
//     return (
//       <>
//         <UserNavbar />
//         <BedsCarousel />

//         <div className="flex flex-col lg:flex-row gap-6 p-6">
//           {/* Left Column - Order Details */}
//           <div className="w-full lg:w-2/3 space-y-6 animate-pulse">
//             {/* Section Title */}
//             <div className="h-6 bg-gray-300 rounded w-1/4" />

//             {/* Crawler Dozer Block */}
//             <div className="flex items-start gap-4 border p-4 rounded shadow">
//               <div className="w-24 h-24 bg-gray-300 rounded" />
//               <div className="flex-1 space-y-3">
//                 <div className="h-5 bg-gray-300 rounded w-1/2" />
//                 <div className="h-4 bg-gray-300 rounded w-full" />
//                 <div className="h-4 bg-gray-300 rounded w-5/6" />
//                 <div className="h-4 bg-gray-300 rounded w-1/3" />
//               </div>
//             </div>

//             {/* Water Tanker Block */}
//             <div className="flex items-start gap-4 border p-4 rounded shadow">
//               <div className="w-24 h-24 bg-gray-300 rounded" />
//               <div className="flex-1 space-y-3">
//                 <div className="h-5 bg-gray-300 rounded w-1/2" />
//                 <div className="h-4 bg-gray-300 rounded w-5/6" />
//               </div>
//             </div>

//             {/* Delivery Timeline */}
//             <div className="space-y-3">
//               <div className="h-5 bg-gray-300 rounded w-1/3" />
//               <div className="h-4 bg-gray-300 rounded w-1/2" />
//               <div className="h-4 bg-gray-300 rounded w-1/4" />
//             </div>
//           </div>

//           {/* Right Column - Price Details */}
//           <div className="w-full lg:w-1/3 space-y-4 animate-pulse">
//             <div className="h-6 bg-gray-300 rounded w-1/3" />
//             <div className="space-y-2">
//               <div className="h-4 bg-gray-300 rounded w-2/3" />
//               <div className="h-4 bg-gray-300 rounded w-1/2" />
//               <div className="h-4 bg-gray-300 rounded w-2/3" />
//               <div className="h-4 bg-gray-300 rounded w-1/3" />
//             </div>
//             <div className="h-10 bg-gray-300 rounded w-full" />
//             <div className="h-10 bg-gray-300 rounded w-full" />
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <UserNavbar />
//         <BedsCarousel />

//         <div className="p-8 text-center text-red-500">Error: {error}</div>
//       </>
//     );
//   }

//   if (!order) {
//     return (
//       <>
//         <UserNavbar />
//         <BedsCarousel />

//         <div className="p-8 text-center">Order not found.</div>
//       </>
//     );
//   }

//   return (
//     <>
//       <UserNavbar />
//       <BedsCarousel />

//       <div className="text-sm flex bg-slate-700 text-white">
//         <div className="py-4 px-4 md:px-6 xl:px-6 flex space-x-2">
//           <span
//             onClick={() => navigate("/")}
//             className="cursor-pointer hover:underline"
//           >
//             Home
//           </span>
//           <span>/</span>
//           <span
//             onClick={() => navigate("/user-profile")}
//             className="cursor-pointer hover:underline"
//           >
//             My Account
//           </span>
//           <span>/</span>
//           <span
//             onClick={() => navigate("/user-orders")}
//             className="cursor-pointer hover:underline"
//           >
//             My Orders
//           </span>
//           <span>/</span>
//           <span className="text-gray-300">Order #{order._id?.slice(-8)}</span>
//         </div>
//       </div>

//       <div className="p-4 md:p-6 w-full mx-auto ">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Left Section */}
//           <div className="w-full lg:w-2/3 space-y-6">
//             {/* Product Card */}
//             <div className="bg-white rounded-lg shadow-sm border p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <FiCheckCircle className="text-green-500 mr-2" /> Order Details
//               </h2>
//               {order.products.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="border rounded-lg p-4 mb-4 flex gap-4"
//                 >
//                   <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
//                     {item.product?.images?.[0] ? (
//                       <img
//                         src={item.product.images[0]}
//                         alt={item.product.name}
//                         className="w-full h-full object-contain"
//                       />
//                     ) : (
//                       <span className="text-gray-400 text-xs">No Image</span>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-medium">
//                       {item.product?.name || "Product"}
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       {item.product?.description || "No description."}
//                     </p>
//                     <div className="mt-2 text-sm text-gray-700">
//                       Total:{" "}
//                       {formatPrice(
//                         (item.product?.price || 0) * (item.quantity || 1)
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Delivery Timeline */}
//             <div className="bg-white rounded-lg shadow-sm border p-6">
//               <h3 className="font-medium mb-4 flex items-center">
//                 <FiTruck className="text-blue-600 mr-2" /> Delivery Timeline
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex items-start gap-3">
//                   <FiCheckCircle className="text-green-500 mt-1" />
//                   <div>
//                     <p className="font-medium">Order Confirmed</p>
//                     <p className="text-sm text-gray-500">
//                       {order.createdAt
//                         ? new Date(order.createdAt).toLocaleString("en-IN")
//                         : "N/A"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <FiCheckCircle
//                     className={`mt-1 ${
//                       order.status === "Delivered"
//                         ? "text-green-500"
//                         : "text-gray-400"
//                     }`}
//                   />
//                   <div>
//                     <p className="font-medium">Delivered</p>
//                     {order.deliveredAt ? (
//                       <p className="text-sm text-gray-500">
//                         {new Date(order.deliveredAt).toLocaleString("en-IN")}
//                       </p>
//                     ) : (
//                       <p className="text-sm text-gray-400">In transit</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Delivery Address */}
//             <div className="bg-white rounded-lg shadow-sm border p-6">
//               <h3 className="font-medium mb-4 flex items-center">
//                 <FiHome className="text-blue-600 mr-2" /> Delivery Address
//               </h3>
//               <div className="text-sm text-gray-700">
//                 <p className="font-medium">{order.shippingAddress?.fullName}</p>
//                 <p>
//                   {order.shippingAddress?.addressLine1},{" "}
//                   {order.shippingAddress?.addressLine2}
//                 </p>
//                 <p>
//                   {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
//                   - {order.shippingAddress?.postalCode}
//                 </p>
//                 <p>{order.shippingAddress?.country}</p>
//                 <p>Phone: {order.shippingAddress?.phone}</p>
//               </div>
//             </div>
//           </div>

//           {/* Right Section: Price Summary */}
//           <div className="w-full lg:w-1/3">
//             <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <FiCreditCard className="text-blue-600 mr-2" /> Price Details
//               </h2>
//               <div className="text-sm space-y-2">
//                 <div className="flex justify-between">
//                   <span>Total Amount:</span>
//                   <span>{formatPrice(calculatedTotals.subtotal)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Shipping:</span>
//                   <span>{formatPrice(calculatedTotals.shipping)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>GST:</span>
//                   <span>{formatPrice(calculatedTotals.gst)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Extra Tax:</span>
//                   <span>{formatPrice(calculatedTotals.extraTax)}</span>
//                 </div>
//                 <div className="border-t pt-2 flex justify-between font-semibold">
//                   <span>Total:</span>
//                   <span>{formatPrice(calculatedTotals.total)}</span>
//                 </div>
//               </div>
//               <div className="mt-4 flex flex-col gap-2">
//                 <button className="w-full flex items-center justify-center py-2 px-4 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
//                   <FiMessageSquare className="mr-2" /> Need Help?
//                 </button>
//                 <button className="w-full flex items-center justify-center py-2 px-4 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
//                   <FiFileText className="mr-2" /> Download Invoice
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default OrderDetails;

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserNavbar from "../../components/common/UserNavbar";
import axios from "axios";
import {
  FiTruck,
  FiCreditCard,
  FiFileText,
  FiMessageSquare,
  FiHome,
  FiCheckCircle,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import BedsCarousel from "../../components/common/BedsCarousel";
import toast from "react-hot-toast";

// Exchange Modal Component
function ExchangeModal({ isOpen, onClose, orderId, onSuccess }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert("Please provide a reason for exchange");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/orders/order-exchange-request/${orderId}`,
        { reason: reason.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Exchange request submitted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting exchange request:", error);
      toast.error("Failed to submit exchange request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Exchange Order</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Exchange *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBtnColor focus:border-transparent"
              placeholder="Please describe the reason for exchange..."
              disabled={loading}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primaryBtnColor text-white rounded-md hover:bg-primaryBtnHoverColor transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const navigate = useNavigate();

  const dataById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/get-order-by-id/${orderId}`
      );
      setOrder(response?.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleExchangeSuccess = () => {
    // Refresh the order data to get updated status
    dataById();
  };

  useEffect(() => {
    if (orderId) {
      dataById();
    }
  }, [orderId]);

  const calculatedTotals = useMemo(() => {
    if (!order || !order.products) {
      return { subtotal: 0, shipping: 0, gst: 0, extraTax: 0, total: 0 };
    }

    const subtotal = order.products.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
      0
    );

    const shipping = order.products.reduce(
      (sum, item) =>
        sum + (item.product?.shippingCharge || 0) * (item.quantity || 1),
      0
    );

    const gst = order.products.reduce(
      (sum, item) =>
        sum +
        ((item.product?.price || 0) *
          (item.quantity || 1) *
          (item.product?.gstPercentage || 0)) /
          100,
      0
    );

    const extraTax = order.products.reduce(
      (sum, item) =>
        sum +
        ((item.product?.price || 0) *
          (item.quantity || 1) *
          (item.product?.extraTaxPercentage || 0)) /
          100,
      0
    );

    const total = subtotal + shipping + gst + extraTax;

    return { subtotal, shipping, gst, extraTax, total };
  }, [order]);

  const getExchangeStatusLabel = (exchangeStatus) => {
    switch (exchangeStatus) {
      case "Approved":
        return "Exchange Approved";
      case "Completed":
        return "Exchange Completed";
      case "Rejected":
        return "Exchange Cancelled";
      default:
        return "Exchange Requested";
    }
  };

  const exchangeStatus = order?.exchangeRequest?.status;
  const isExchangeRequested = exchangeStatus && exchangeStatus !== "Rejected";

  if (loading) {
    return (
      <>
        <UserNavbar />
        <BedsCarousel />

        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* Left Column - Order Details */}
          <div className="w-full lg:w-2/3 space-y-6 animate-pulse">
            {/* Section Title */}
            <div className="h-6 bg-gray-300 rounded w-1/4" />

            {/* Crawler Dozer Block */}
            <div className="flex items-start gap-4 border p-4 rounded shadow">
              <div className="w-24 h-24 bg-gray-300 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
                <div className="h-4 bg-gray-300 rounded w-1/3" />
              </div>
            </div>

            {/* Water Tanker Block */}
            <div className="flex items-start gap-4 border p-4 rounded shadow">
              <div className="w-24 h-24 bg-gray-300 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="space-y-3">
              <div className="h-5 bg-gray-300 rounded w-1/3" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
              <div className="h-4 bg-gray-300 rounded w-1/4" />
            </div>
          </div>

          {/* Right Column - Price Details */}
          <div className="w-full lg:w-1/3 space-y-4 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-2/3" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
              <div className="h-4 bg-gray-300 rounded w-2/3" />
              <div className="h-4 bg-gray-300 rounded w-1/3" />
            </div>
            <div className="h-10 bg-gray-300 rounded w-full" />
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserNavbar />
        <BedsCarousel />

        <div className="p-8 text-center text-red-500">Error: {error}</div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <UserNavbar />
        <BedsCarousel />

        <div className="p-8 text-center">Order not found.</div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <BedsCarousel />

      <div className="text-sm flex bg-slate-700 text-white">
        <div className="py-4 px-4 md:px-6 xl:px-6 flex space-x-2">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:underline"
          >
            Home
          </span>
          <span>/</span>
          <span
            onClick={() => navigate("/user-profile")}
            className="cursor-pointer hover:underline"
          >
            My Account
          </span>
          <span>/</span>
          <span
            onClick={() => navigate("/user-orders")}
            className="cursor-pointer hover:underline"
          >
            My Orders
          </span>
          <span>/</span>
          <span className="text-gray-300">Order #{order._id?.slice(-8)}</span>
        </div>
      </div>

      <div className="p-4 md:p-6 w-full mx-auto ">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" /> Order Details
              </h2>
              {order.products.map((item, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 mb-4 flex gap-4"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.product?.name || "Product"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.product?.description || "No description."}
                    </p>
                    <div className="mt-2 text-sm text-gray-700">
                      Total:{" "}
                      {formatPrice(
                        (item.product?.price || 0) * (item.quantity || 1)
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-medium mb-4 flex items-center">
                <FiTruck className="text-blue-600 mr-2" /> Delivery Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1" />
                  <div>
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN")
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheckCircle
                    className={`mt-1 ${
                      order.status === "Delivered" || isExchangeRequested
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                  <div>
                    <p className="font-medium">Delivered</p>
                    {order.deliveredAt ? (
                      <p className="text-sm text-gray-500">
                        {new Date(order.deliveredAt).toLocaleString("en-IN")}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">In transit</p>
                    )}
                  </div>
                </div>
                {isExchangeRequested && (
                  <div className="flex items-start gap-3">
                    <FiRefreshCw className="text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium">Exchange Requested</p>
                      <p className="text-sm text-gray-500">
                        Your exchange request has been submitted and is being
                        processed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-medium mb-4 flex items-center">
                <FiHome className="text-blue-600 mr-2" /> Delivery Address
              </h3>
              <div className="text-sm text-gray-700">
                <p className="font-medium">{order.shippingAddress?.fullName}</p>
                <p>
                  {order.shippingAddress?.addressLine1},{" "}
                  {order.shippingAddress?.addressLine2}
                </p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  - {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p>Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>
          </div>

          {/* Right Section: Price Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiCreditCard className="text-blue-600 mr-2" /> Price Details
              </h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span>{formatPrice(calculatedTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatPrice(calculatedTotals.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST:</span>
                  <span>{formatPrice(calculatedTotals.gst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Extra Tax:</span>
                  <span>{formatPrice(calculatedTotals.extraTax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(calculatedTotals.total)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {/* Exchange Button - Only show if order is delivered and not already exchanged */}
                {order?.status === "Delivered" &&
                  exchangeStatus === "Requested" && (
                    <button
                      onClick={() => setShowExchangeModal(true)}
                      className="w-full flex items-center justify-center py-2 px-4 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
                    >
                      <FiRefreshCw className="mr-2" /> Exchange Order
                    </button>
                  )}

                {exchangeStatus && exchangeStatus !== "Requested" && (
                  <div className="w-full flex items-center justify-center py-2 px-4 bg-orange-100 text-orange-700 rounded border border-orange-200">
                    <FiRefreshCw className="mr-2" />{" "}
                    {getExchangeStatusLabel(exchangeStatus)}
                  </div>
                )}

                <button className="w-full flex items-center justify-center py-2 px-4 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
                  <FiMessageSquare className="mr-2" /> Need Help?
                </button>
                <button className="w-full flex items-center justify-center py-2 px-4 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
                  <FiFileText className="mr-2" /> Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Modal */}
      <ExchangeModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        orderId={order._id}
        onSuccess={handleExchangeSuccess}
      />
    </>
  );
}

export default OrderDetails;
