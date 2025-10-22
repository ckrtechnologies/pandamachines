import React, { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { FaTruck } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="p-4 md:p-6 bg-orange-100/50 h-full animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-gray-300 rounded-full w-10 h-10"></div>
        <div className="bg-gray-300 rounded h-8 w-48"></div>
      </div>
      <div className="py-2 flex justify-between mb-4">
        <div className="bg-gray-300 rounded h-6 w-64"></div>
        <div className="bg-gray-300 rounded-full h-8 w-24"></div>
      </div>
      <div className="overflow-x-auto py-4">
        <div className="min-w-full bg-white shadow-md rounded-t-lg overflow-hidden">
          <div className="bg-gray-200 text-gray-700 text-sm uppercase">
            <div className="flex rounded-t-full">
              <div className="px-4 py-3 flex-1">
                <div className="bg-gray-300 rounded h-4 w-16"></div>
              </div>
              <div className="px-4 py-3 flex-1">
                <div className="bg-gray-300 rounded h-4 w-12"></div>
              </div>
              <div className="px-4 py-3 flex-1">
                <div className="bg-gray-300 rounded h-4 w-16"></div>
              </div>
              <div className="px-4 py-3 flex-1">
                <div className="bg-gray-300 rounded h-4 w-12"></div>
              </div>
              <div className="px-4 py-3 flex-1">
                <div className="bg-gray-300 rounded h-4 w-20"></div>
              </div>
              <div className="px-4 py-3 flex-1">
                <div className="bg-gray-300 rounded h-4 w-14"></div>
              </div>
              <div className="px-4 py-3 flex-1">
                <div className="bg-gray-300 rounded h-4 w-12"></div>
              </div>
              <div className="px-4 py-3 flex-1">
                <div className="bg-gray-300 rounded h-4 w-12"></div>
              </div>
            </div>
          </div>
          <div className="text-gray-700">
            {[1, 2].map((item, index) => (
              <div key={index} className="border-b">
                <div className="flex">
                  <div className="px-4 py-3 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-300 rounded w-8 h-8"></div>
                      <div className="bg-gray-300 rounded h-4 w-32"></div>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex-1">
                    <div className="bg-gray-300 rounded h-4 w-20"></div>
                  </div>
                  <div className="px-4 py-3 flex-1">
                    <div className="bg-gray-300 rounded h-4 w-8"></div>
                  </div>
                  <div className="px-4 py-3 flex-1">
                    <div className="bg-gray-300 rounded h-4 w-8"></div>
                  </div>
                  <div className="px-4 py-3 flex-1">
                    <div className="bg-gray-300 rounded h-4 w-8"></div>
                  </div>
                  <div className="px-4 py-3 flex-1">
                    <div className="bg-gray-300 rounded h-4 w-8"></div>
                  </div>
                  <div className="px-4 py-3 flex-1">
                    <div className="bg-gray-300 rounded h-4 w-16"></div>
                  </div>
                  <div className="px-4 py-3 flex-1">
                    <div className="bg-gray-300 rounded h-4 w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-200 w-full rounded-b-lg">
          <div className="flex px-4 py-2">
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <div className="bg-gray-300 rounded h-4 w-12"></div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-300 rounded h-4 w-20"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full py-4">
        <div className="p-4 space-y-2 bg-white rounded-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gray-300 rounded w-5 h-5"></div>
            <div className="bg-gray-300 rounded h-6 w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-300 rounded h-4 w-40"></div>
            <div className="bg-gray-300 rounded h-4 w-32"></div>
            <div className="bg-gray-300 rounded h-4 w-48"></div>
          </div>
        </div>
        <div className="p-4 space-y-2 bg-white rounded-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gray-300 rounded w-5 h-5"></div>
            <div className="bg-gray-300 rounded h-6 w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-300 rounded h-4 w-36"></div>
            <div className="bg-gray-300 rounded h-4 w-44"></div>
            <div className="bg-gray-300 rounded h-4 w-full"></div>
            <div className="bg-gray-300 rounded h-4 w-40"></div>
          </div>
        </div>
        <div className="p-4 space-y-2 bg-white rounded-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gray-300 rounded w-5 h-5"></div>
            <div className="bg-gray-300 rounded h-6 w-36"></div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-300 rounded h-4 w-28"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOrderDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dataById();
  }, []);

  useEffect(() => {
    if (orderDetails.user) {
      dataUserById();
    }
  }, [orderDetails]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const dateOnly = date.toISOString().split("T")[0];
    const formattedDate = dateOnly.split("-").reverse().join("-");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${formattedDate} ${hours}:${minutes}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium";
      case "Cancelled":
        return "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium";
      case "Pending":
        return "bg-yellow-100 text-yellow-500 px-3 py-1 rounded-full text-sm font-medium";
      case "Shipped":
        return "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium";
      default:
        return "bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium";
    }
  };

  const dataUserById = () => {
    if (!orderDetails.user) return;

    // setIsLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/customers/get-user-by-id/${orderDetails.user}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response?.data));
        setUserDetails(response?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const dataById = () => {
    setIsLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/orders/get-order-by-id/${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response?.data));
        setOrderDetails(response?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // Skeleton Loader
  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="p-4 md:p-6 bg-orange-100/50 h-full">
      <div className="flex items-center gap-4">
        <div className="bg-gray-200 rounded-full px-3 py-2 w-10 h-10">
          <MdArrowBackIos
            onClick={() => navigate(-1)}
            size={25}
            className="text-center flex items-center justify-center cursor-pointer"
          />
        </div>
        <h1 className="font-bold text-2xl ">Order Details</h1>
      </div>
      <div className="py-2 flex justify-between">
        <p className="font-semibold">
          Order Date :{" "}
          <span className="font-normal">
            {formatDateTime(orderDetails?.createdAt)}
          </span>
        </p>
        <div className={getStatusColor(orderDetails?.status)}>
          {orderDetails?.status}
        </div>
      </div>
      <div className="overflow-x-auto py-4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-orange-700 text-sm uppercase">
            <tr className="rounded-t-full">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Quantity</th>
              <th className="px-4 py-3 text-left">GST(%)</th>
              <th className="px-4 py-3 text-left">Extra Tax (%)</th>
              <th className="px-4 py-3 text-left">Ratings</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Price</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orderDetails?.products?.map((productItem, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={productItem?.product?.images?.[0] || ""}
                      alt="product-icon"
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-sm">
                      {productItem?.product?.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">{productItem?.product?.brand}</td>
                <td className="px-4 py-3 text-center">
                  {productItem?.quantity}
                </td>
                <td className="px-4 py-3 text-center">
                  {productItem?.product?.gstPercentage}%(
                  {productItem?.gst?.toFixed(2)})
                </td>
                <td className="px-4 py-3 text-center">
                  {productItem?.product?.extraTaxPercentage}%(
                  {productItem?.extraTax?.toFixed(2)})
                </td>
                <td className="px-4 py-3 flex items-center gap-1 justify-center">
                  {productItem?.product?.ratings}
                  <FaStarHalfAlt className="text-yellow-400" />
                </td>
                <td className="px-4 py-3">
                  {/* <span className={getStatusColor(orderDetails?.status)}>
                    {orderDetails?.status}
                  </span> */}
                  {orderDetails?.status}
                </td>
                <td className="px-4 py-3">₹{productItem?.product?.price}</td>
              </tr>
            ))}
            <tr className="bg-gray-200 text-gray-700 rounded-b-full">
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3 font-bold ">Total : </td>
              <td className="px-4 py-3 text-orange-700 font-bold">
                ₹{orderDetails?.totalAmount?.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full py-4">
        <div className="p-4 space-y-2 bg-white rounded-md">
          <div className="flex items-center gap-2">
            <FaUser className="text-orange-700" size={20} />
            <span className="font-semibold text-lg">Customer</span>
          </div>
          <div>
            <h1>
              Name: {userDetails?.data?.firstName} {userDetails?.data?.lastName}
            </h1>
          </div>
          <div>
            <h1>Phone: {userDetails?.data?.phone}</h1>
          </div>
          <div>
            <h1>Email: {userDetails?.data?.email}</h1>
          </div>
        </div>
        <div className="p-4 space-y-2 bg-white rounded-md">
          <div className="flex items-center gap-2">
            <IoLocationSharp className="text-orange-700" size={20} />
            <span className="font-semibold text-lg">Shipping Address</span>
          </div>
          <div>
            <h1>{orderDetails?.shippingAddress?.fullName}</h1>
          </div>
          <div>
            <h1>{orderDetails?.shippingAddress?.addressLine1}</h1>
          </div>
          <div>
            <h1>
              {orderDetails?.shippingAddress?.addressLine2},{" "}
              {orderDetails?.shippingAddress?.city},{" "}
              {orderDetails?.shippingAddress?.state},{" "}
              {orderDetails?.shippingAddress?.postalCode}
            </h1>
          </div>
          <div>
            <h1>{orderDetails?.shippingAddress?.landmark}</h1>
          </div>
        </div>
        <div className="p-4 space-y-2 bg-white rounded-md">
          <div className="flex items-center gap-2">
            <FaTruck className="text-orange-700" size={20} />
            <span className="font-semibold text-lg">Shipping Information</span>
          </div>
          <div>
            <h1>Status: {orderDetails?.status}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
