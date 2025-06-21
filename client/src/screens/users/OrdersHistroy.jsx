import React, { useState } from "react";
import {
  Search,
  Filter,
  ArrowLeft,
  Check,
  Clock,
  Truck,
  X,
  RotateCcw,
} from "lucide-react";
import { Home, ChevronRight } from "lucide-react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";

const OrdersHistroy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    orderStatus: {
      onTheWay: false,
      delivered: false,
      cancelled: false,
      returned: false,
    },
    orderTime: {
      last30Days: false,
      year2023: false,
      year2024: false,
      year2025: false,
    },
  });
  const [showFilters, setShowFilters] = useState(false);

  const orders = [
    {
      id: 1,
      image: "/api/placeholder/80/80",
      name: "Water Purification RO Plant",
      price: "₹1,00,000",
      status: "expected",
      deliveryDate: "31 May",
      message: "Your Order has been placed",
      deliveredDate: null,
    },
    {
      id: 2,
      image: "/api/placeholder/80/80",
      name: "Water Purification RO Plant",
      price: "₹1,00,000",
      status: "expected",
      deliveryDate: "31 May",
      message: "Your Order has been placed",
      deliveredDate: null,
    },
    {
      id: 3,
      image: "/api/placeholder/80/80",
      name: "Water Purification RO Plant",
      price: "₹1,00,000",
      status: "delivered",
      deliveryDate: "16th May",
      message: "Your item has been delivered",
      deliveredDate: "16th May",
    },
    {
      id: 4,
      image: "/api/placeholder/80/80",
      name: "Water Purification RO Plant",
      price: "₹1,00,000",
      status: "delivered",
      deliveryDate: "16th May",
      message: "Your item has been delivered",
      deliveredDate: "16th May",
    },
    {
      id: 5,
      image: "/api/placeholder/80/80",
      name: "Water Purification RO Plant",
      price: "₹1,00,000",
      status: "delivered",
      deliveryDate: "16th May",
      message: "Your item has been delivered",
      deliveredDate: "16th May",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "expected":
        return <Clock className="w-4 h-4 text-green-600" />;
      case "delivered":
        return <Check className="w-4 h-4 text-green-600" />;
      case "onTheWay":
        return <Truck className="w-4 h-4 text-blue-600" />;
      case "cancelled":
        return <X className="w-4 h-4 text-red-600" />;
      case "returned":
        return <RotateCcw className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusText = (status, deliveryDate) => {
    switch (status) {
      case "expected":
        return `Delivery Expected by ${deliveryDate}`;
      case "delivered":
        return `Delivered on ${deliveryDate}`;
      default:
        return `Delivery Expected by ${deliveryDate}`;
    }
  };

  const handleFilterChange = (category, filter) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [filter]: !prev[category][filter],
      },
    }));
  };
  return (
    <React.Fragment>
      <UserNavbar />
      <header className="bg-slate-700 text-white">
        <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-orange-400">Contact Us</span>
          </nav>
        </div>
      </header>
      <div className="min-h-screen bg-orange-50">
        <div className="mx-auto p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <h1 className="text-lg lg:text-xl font-semibold tracking-wide  text-gray-800 mb-4">
                  SEE YOUR PRODUCTS
                </h1>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search For Products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                  <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded transition-colors duration-200">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Orders List */}
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 lg:p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-200">
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <img
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRReqjaQ2C1ONd0pbJPpC237I6E4IC6_D3cGQ&s"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="text-sm lg:text-base font-medium tracking-wide text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                              {order.name}
                            </h3>
                            <p className="text-base lg:text-lg font-semibold text-gray-900 mt-1">
                              {order.price}
                            </p>
                          </div>

                          {/* Status and Delivery Info */}
                          <div className="flex-shrink-0 text-right">
                            <div className="flex items-center justify-end gap-2 mb-1">
                              {getStatusIcon(order.status)}
                              <span className="text-xs lg:text-sm font-medium tracking-wide text-black">
                                {getStatusText(
                                  order.status,
                                  order.deliveryDate
                                )}
                              </span>
                            </div>
                            <p className="text-xs tracking-wide text-gray-500">
                              {order.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Return to Shop Button */}
              <div className="p-4 lg:p-6 border-t border-gray-200 text-center">
                <button className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  Return to shop
                </button>
              </div>
            </div>

            {/* Sidebar Filters */}
            <div className="w-full lg:w-64 xl:w-72">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200 mb-4"
              >
                <span className="font-medium text-gray-900">Filter</span>
                <Filter className="w-4 h-4" />
              </button>

              {/* Filter Panel */}
              <div
                className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
                  showFilters || "hidden lg:block"
                }`}
              >
                <div className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium text-gray-900">Filter</h2>
                    <Filter className="w-4 h-4 text-gray-500" />
                  </div>

                  {/* Order Status Filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      ORDER STATUS
                    </h3>
                    <div className="space-y-2">
                      {[
                        { key: "onTheWay", label: "On the way" },
                        { key: "delivered", label: "Delivered" },
                        { key: "cancelled", label: "Cancelled" },
                        { key: "returned", label: "Returned" },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center group cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.orderStatus[item.key]}
                            onChange={() =>
                              handleFilterChange("orderStatus", item.key)
                            }
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                          />
                          <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Order Time Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      ORDER TIME
                    </h3>
                    <div className="space-y-2">
                      {[
                        { key: "last30Days", label: "Last 30 days" },
                        { key: "year2023", label: "2023" },
                        { key: "year2024", label: "2024" },
                        { key: "year2025", label: "2025" },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center group cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.orderTime[item.key]}
                            onChange={() =>
                              handleFilterChange("orderTime", item.key)
                            }
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                          />
                          <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AllUserFooter />
    </React.Fragment>
  );
};

export default OrdersHistroy;
