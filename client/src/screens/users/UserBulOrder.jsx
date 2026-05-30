import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Filter,
  Layers,
} from "lucide-react";
import UserNavbar from "../../components/common/UserNavbar";
import { useNavigate } from "react-router-dom";
import BedsCarousel from "../../components/common/BedsCarousel";
import { FaChevronRight } from "react-icons/fa";

const UserBulkOrder = () => {
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

      // Filter only bulk orders (orders with more than 1 product)
      const bulkOrders = data.filter((order) => order.products.length > 1);

      setOrders(bulkOrders);
      setFilteredOrders(bulkOrders);
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

  // Filter orders by status
  useEffect(() => {
    if (selectedStatus === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(
          (order) => order.status.toLowerCase() === selectedStatus.toLowerCase()
        )
      );
    }
  }, [selectedStatus, orders]);

  // Calculate order total manually
  const calculateOrderTotal = (order) => {
    const subtotal = order?.products?.reduce(
      (sum, item) => sum + item?.product?.price * item?.quantity,
      0
    );

    const shipping = order?.products?.reduce(
      (sum, item) => sum + item?.product?.shippingCharge * item?.quantity,
      0
    );

    const gst = order?.products?.reduce(
      (sum, item) =>
        sum +
        (item?.product?.price * item?.quantity * item?.product?.gstPercentage) /
          100,
      0
    );

    const extraTax = order?.products?.reduce(
      (sum, item) =>
        sum +
        (item?.product?.price *
          item?.quantity *
          item?.product?.extraTaxPercentage) /
          100,
      0
    );

    return subtotal + shipping + gst + extraTax;
  };

  // Get unique statuses for filter
  const getOrderStatuses = () => {
    const statuses = ["All", ...new Set(orders.map((order) => order.status))];
    return statuses;
  };

  // Get status counts
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

        <div className="w-full mx-auto px-4 md:px-6 lg:px-6 py-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>

            {/* Filter Skeleton */}
            <div className="mb-8">
              <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-gray-300 rounded w-24"></div>
                ))}
              </div>
            </div>

            {/* Orders Skeleton */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  {/* Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-32"></div>
                        <div className="h-4 bg-gray-300 rounded w-40"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <BedsCarousel />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Orders
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <BedsCarousel />

      <div className="w-full mx-auto px-4 md:px-6 lg:px-6 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Layers className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Bulk Orders
                </h1>
              </div>
              <div className="flex items-center text-gray-500 mt-2 text-sm">
                <span>Home</span>
                <FaChevronRight className="mx-2 text-xs" />
                <span>My Orders</span>
                <FaChevronRight className="mx-2 text-xs" />
                <span className="text-gray-900 font-medium">Bulk Orders</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Orders with multiple items (2+ products)
              </p>
            </div>
            {!loading && (
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {orders.length} Bulk {orders.length === 1 ? "Order" : "Orders"}
              </span>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filter by Status
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {getOrderStatuses().map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-200`}
              >
                {status}
                {status !== "All" && statusCounts[status] && (
                  <span className="ml-2 text-sm">({statusCounts[status]})</span>
                )}
                {status === "All" && (
                  <span className="ml-2 text-sm">({orders.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedStatus === "All"
                ? "No Bulk Orders Found"
                : `No ${selectedStatus} Bulk Orders`}
            </h2>
            <p className="text-gray-600">
              {selectedStatus === "All"
                ? "You haven't placed any bulk orders yet. Bulk orders contain 2 or more products."
                : `You have no ${selectedStatus.toLowerCase()} bulk orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const calculatedTotal = calculateOrderTotal(order);
              const totalItems = order.products.reduce(
                (sum, item) => sum + item.quantity,
                0
              );

              return (
                <div
                  onClick={() => navigate(`/orders/${order._id}`)}
                  key={order._id}
                  className="bg-white cursor-pointer rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white p-2 rounded-lg">
                          <Layers className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order._id.slice(-8)}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(order.createdAt)}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-blue-700 font-medium">
                            <Package className="w-3 h-3 mr-1" />
                            {order.products.length} Products • {totalItems}{" "}
                            Total Items
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(calculatedTotal)}
                          </p>
                          <p className="text-sm text-gray-500">Total Amount</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products List */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.products.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-shrink-0 relative">
                            <img
                              src={
                                item?.product?.images?.[0] ||
                                "/api/placeholder/80/80"
                              }
                              alt={item?.product?.name || "Product"}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/80/80";
                              }}
                            />
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {item?.quantity}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {item?.product?.name || "Unknown Product"}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {item?.product?.description ||
                                "No description available"}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>
                                Brand: {item?.product?.brand || "N/A"}
                              </span>
                              <span>•</span>
                              <span>
                                Price:{" "}
                                {formatCurrency(item?.product?.price || 0)}
                              </span>
                            </div>
                            {item?.product?.warranty?.hasWarranty && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {item?.product?.warranty?.warrantyDays} Days
                                  Warranty
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBulkOrder;
