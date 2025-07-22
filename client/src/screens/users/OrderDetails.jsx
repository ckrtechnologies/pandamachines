// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import UserNavbar from "../../components/common/UserNavbar";
// import axios from "axios";
// import {
//   FiTruck,
//   FiCalendar,
//   FiCreditCard,
//   FiFileText,
//   FiMessageSquare,
//   FiHome,
//   FiCheckCircle,
// } from "react-icons/fi";

// function OrderDetails() {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const dataById = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/orders/get-order-by-id/${orderId}`
//       );
//       setOrder(response?.data);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch order details.");
//       setLoading(false);
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const handleExchangeRequest = async () => {
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/orders/request-exchange/${orderId}`
//       );
//       dataById();
//     } catch (err) {
//       console.error(err);
//       setError("Failed to request exchange.");
//     }
//   };

//   useEffect(() => {
//     if (orderId) {
//       dataById();
//     }
//   }, [orderId]);

//   if (loading) {
//     return (
//       <>
//         <UserNavbar />
//         <div className="p-8 w-full mx-auto animate-pulse">
//           <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
//           <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
//           <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
//           <div className="h-48 bg-gray-300 rounded mb-4"></div>
//           <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
//           <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
//           <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
//         </div>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <UserNavbar />
//         <div className="p-8 text-center text-red-500">Error: {error}</div>
//       </>
//     );
//   }

//   if (!order) {
//     return (
//       <>
//         <UserNavbar />
//         <div className="p-8 text-center">Order not found.</div>
//       </>
//     );
//   }

//   return (
//     <>
//       <UserNavbar />
//       <div className="p-4 md:p-6 w-full mx-auto">
//         {/* Breadcrumb */}
//         <div className="text-sm text-gray-500 mb-6 flex items-center">
//           <span className="hover:text-blue-600 cursor-pointer">Home</span>
//           <span className="mx-2">/</span>
//           <span className="hover:text-blue-600 cursor-pointer">My Account</span>
//           <span className="mx-2">/</span>
//           <span className="hover:text-blue-600 cursor-pointer">My Orders</span>
//           <span className="mx-2">/</span>
//           <span className="text-gray-700 font-medium">
//             Order #{order._id?.slice(-8)}
//           </span>
//         </div>

//         {/* Two Column Layout */}
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Left Column */}
//           <div className="w-full lg:w-2/3">
//             <div className="bg-white rounded-lg shadow-sm border p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <FiCheckCircle className="text-green-500 mr-2" />
//                 Order Details
//               </h2>

//               {/* Product Card */}
//               <div className="border rounded-lg p-4 mb-6">
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   {/* Product Image */}
//                   <div className="w-full sm:w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
//                     {order.products?.[0]?.product?.images?.[0] ? (
//                       <img
//                         src={order.products[0].product.images[0]}
//                         alt={order.products[0].product.name}
//                         className="w-full h-full object-contain"
//                       />
//                     ) : (
//                       <span className="text-gray-400">No image available</span>
//                     )}
//                   </div>

//                   {/* Product Info */}
//                   <div className="flex-1">
//                     <h3 className="text-lg font-medium">
//                       {order.products?.[0]?.product?.name || "Product Name"}
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       <span className="font-bold text-lg">Description:</span>{" "}
//                       {order.products?.[0]?.product?.description || " "}
//                     </p>
//                     <p className="text-gray-600 text-sm">
//                       <span className="font-medium">Rating:</span>{" "}
//                       {order.products?.[0]?.product?.ratings || " "}
//                     </p>
//                     {/* <p className="text-gray-600 text-sm mt-1">
//                       <span className="font-medium">Color:</span>{" "}
//                       {order.products?.[0]?.product?.color || "N/A"}
//                     </p> */}
//                     {/* <p className="text-gray-600 text-sm">
//                       <span className="font-medium">Seller:</span>{" "}
//                       {order.products?.[0]?.product?.seller || "Seller Name"}
//                     </p> */}

//                     <div className="mt-3 flex items-center">
//                       <span className="text-lg font-bold text-gray-900">
//                         {formatPrice(order.products?.[0]?.product?.price || 0)}
//                       </span>
//                       {order.products?.[0]?.product?.originalPrice && (
//                         <>
//                           <span className="text-sm text-gray-500 line-through ml-2">
//                             {formatPrice(
//                               order.products[0].product.originalPrice
//                             )}
//                           </span>
//                           <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded ml-2">
//                             {Math.round(
//                               ((order.products[0].product.originalPrice -
//                                 order.products[0].product.price) /
//                                 order.products[0].product.originalPrice) *
//                               100
//                             )}
//                             % OFF
//                           </span>
//                         </>
//                       )}
//                     </div>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                         {order.products?.[0]?.product?.warranty?.hasWarranty
//                           ? `${order.products[0].product.warranty.warrantyDays} days warranty`
//                           : "No warranty"}
//                       </span>
//                       <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
//                         Qty: {order.products?.[0]?.quantity || 1}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Timeline */}
//               <div className="border rounded-lg p-4 mb-6">
//                 <h3 className="font-medium mb-3 flex items-center">
//                   <FiTruck className="mr-2 text-blue-600" />
//                   Delivery Updates
//                 </h3>

//                 <div className="space-y-3">
//                   <div className="flex items-start">
//                     <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5">
//                       <FiCheckCircle className="text-white text-sm" />
//                     </div>
//                     <div>
//                       <p className="font-medium">Order Confirmed</p>
//                       <p className="text-gray-500 text-sm">
//                         {order.createdAt
//                           ? new Date(order.createdAt).toLocaleString("en-IN")
//                           : "N/A"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <div
//                       className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${order.status === "Delivered"
//                           ? "bg-green-500"
//                           : "bg-gray-300"
//                         }`}
//                     >
//                       <FiCheckCircle
//                         className={`text-white text-sm ${order.status !== "Delivered" ? "opacity-50" : ""
//                           }`}
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium">Delivered</p>
//                       {order.deliveredAt ? (
//                         <p className="text-gray-500 text-sm">
//                           {new Date(order.deliveredAt).toLocaleString("en-IN")}
//                         </p>
//                       ) : (
//                         <p className="text-gray-400 text-sm">In transit</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Address */}
//               <div className="border rounded-lg p-4">
//                 <h3 className="font-medium mb-3 flex items-center">
//                   <FiHome className="mr-2 text-blue-600" />
//                   Delivery Address
//                 </h3>

//                 <div className="bg-gray-50 p-3 rounded">
//                   <p className="font-medium">
//                     {order.shippingAddress?.fullName}
//                   </p>
//                   <p className="text-gray-600 text-sm">
//                     {order.shippingAddress?.addressLine1},{" "}
//                     {order.shippingAddress?.addressLine2}
//                   </p>
//                   <p className="text-gray-600 text-sm">
//                     {order.shippingAddress?.city},{" "}
//                     {order.shippingAddress?.state} -{" "}
//                     {order.shippingAddress?.postalCode},{" "}
//                     {order.shippingAddress?.country},{" "}
//                     {order.shippingAddress?.landmark}, {"  "}
//                     {order.shippingAddress?.addressType}
//                   </p>
//                   <p className="text-gray-600 text-sm">
//                     Phone: {order.shippingAddress?.phone}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="w-full lg:w-1/3">
//             <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <FiCreditCard className="text-blue-600 mr-2" />
//                 Price Details
//               </h2>

//               <div className="border-t pt-4 space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">totalAmount</span>
//                   {order.products?.[0]?.product?.previous_price}
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Selling price</span>
//                   {order.products?.[0]?.product?.price}
//                 </div>
//                 {/* <div className="flex justify-between">
//                   <span className="text-gray-600">Extra Discount</span>
//                   <span className="text-green-600">
//                     -
//                     {formatPrice(
//                       (order.products?.[0]?.product?.originalPrice || 0) -
//                       (order.products?.[0]?.product?.price || 0)
//                     )}
//                   </span>
//                 </div> */}
//                 {/* <div className="flex justify-between">
//                   <span className="text-gray-600">Special Price</span>
//                   <span>
//                     {formatPrice(order.products?.[0]?.product?.price || 0)}
//                   </span>
//                 </div> */}
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">gstPercentage</span>
//                   <span>
//                     {order.products?.[0]?.product?.gstPercentage ?? 0}%
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">shippingCharge</span>
//                   {order.products?.[0]?.product?.shippingCharge || " "}
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">extraTaxPercentage</span>
//                   {order.products?.[0]?.product?.extraTaxPercentage ?? 0}%
//                 </div>

//                 <div className="flex justify-between font-medium border-t mt-2 pt-2">
//                   <span>Total Amount</span>
//                   {order.products?.[0]?.product?.price || " "}
//                 </div>
//                 <div className="mt-4 text-sm">
//                   <p>• Cash On Delivery: {order.products?.[0]?.product?.price || " "}</p>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="mt-6 space-y-3">
//                 <button className="w-full flex items-center justify-center py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition">
//                   <FiMessageSquare className="mr-2" />
//                   Need Help?
//                 </button>
//                 <button className="w-full flex items-center justify-center py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition">
//                   <FiFileText className="mr-2" />
//                   Download Invoice
//                 </button>

//                 {order.exchangeRequest && (
//                   <div className="mt-4 pt-4 border-t">
//                     <h3 className="font-medium mb-2">Exchange Request</h3>
//                     <p className="text-sm text-gray-600 mb-3">
//                       Status:{" "}
//                       <span className="font-medium">
//                         {order.exchangeRequest.status || "N/A"}
//                       </span>
//                     </p>
//                     {!order.exchangeRequest.isRequested &&
//                       order.status === "Delivered" && (
//                         <button
//                           onClick={handleExchangeRequest}
//                           className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//                         >
//                           Request Exchange
//                         </button>
//                       )}
//                   </div>
//                 )}
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
} from "react-icons/fi";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading) {
    return (
      <>
        <UserNavbar />
        <div className="p-8 w-full mx-auto animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-48 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserNavbar />
        <div className="p-8 text-center text-red-500">Error: {error}</div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <UserNavbar />
        <div className="p-8 text-center">Order not found.</div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />
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
    <span className="text-gray-300">
      Order #{order._id?.slice(-8)}
    </span>
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
                <div key={idx} className="border rounded-lg p-4 mb-4 flex gap-4">
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
                    <h3 className="font-medium">{item.product?.name || "Product"}</h3>
                    <p className="text-gray-600 text-sm">
                      {item.product?.description || "No description."}
                    </p>
                    <div className="mt-2 text-sm text-gray-700">
                      Total: {formatPrice((item.product?.price || 0) * (item.quantity || 1))}
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
                    className={`mt-1 ${order.status === "Delivered" ? "text-green-500" : "text-gray-400"
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
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-medium mb-4 flex items-center">
                <FiHome className="text-blue-600 mr-2" /> Delivery Address
              </h3>
              <div className="text-sm text-gray-700">
                <p className="font-medium">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine1}, {order.shippingAddress?.addressLine2}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
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
    </>
  );
}

export default OrderDetails;

