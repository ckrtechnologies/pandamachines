
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiCreditCard,
  FiEdit2,
  FiHome,
  FiMessageSquare,
  FiRefreshCw,
  FiStar,
  FiTruck,
  FiX
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import BedsCarousel from "../../components/common/BedsCarousel";
import UserNavbar from "../../components/common/UserNavbar";
import { AddReviewModal, EditReviewModal } from "./Product/AddReviewModal";

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
  const [showAddReview, setShowAddReview] = useState(false);
  const [showEditReview, setShowEditReview] = useState(false);
  const [reviews, setReviews] = useState({});
  const [selectedReview, setSelectedReview] = useState(null);
  // const [showAddReview, setShowAddReview] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState(null);
  const navigate = useNavigate();

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };
  const user = getUserData();
  const userId = user?._id;

  console.log(userId, "=====????");

  const dataById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/get-order-by-id/${orderId}`
      );
      setOrder(response?.data);
      if (response?.data?.products) {
        fetchReviews(response.data.products);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (products) => {
    try {
      const reviewData = {};
      for (const item of products) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/review/my-product-review/${userId}/${item?.product?._id}?orderId=${orderId}`
          );
          if (response?.data?.data && response.data.hasReviewed) {
            const review = response.data.data;
            if (review.order?._id === orderId) {
              reviewData[item.product._id] = review;
            } else {
              reviewData[item.product._id] = null;
            }
          } else {
            reviewData[item.product._id] = null;
          }
        } catch (err) {
          console.error(
            `Failed to fetch review for product ${item?.product?._id}`,
            err?.response?.data || err.message
          );
          reviewData[item.product._id] = null;
        }
      }
      setReviews(reviewData);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      const emptyReviews = {};
      products.forEach((item) => {
        emptyReviews[item.product._id] = null;
      });
      setReviews(emptyReviews);
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
    dataById();
  };

  useEffect(() => {
    if (orderId) {
      dataById();
    }
  }, [orderId]);

  const calculatedTotals = useMemo(() => {
    if (!order || !order.products) {
      return { subtotal: 0, shipping: 0, gst: 0, extraTax: 0, total: order?.totalAmount || 0 };
    }

    const subtotal = order.products.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
      0
    );

    const shipping = order.products.reduce(
      (sum, item) =>
        sum + (Number(item.shippingCharge) || 0) * (item.quantity || 1),
      0
    );

    const gst = order.products.reduce(
      (sum, item) => sum + (Number(item.gst) || 0) * (item.quantity || 1),
      0
    );

    const extraTax = order.products.reduce(
      (sum, item) => sum + (Number(item.extraTax) || 0) * (item.quantity || 1),
      0
    );

    const total = order.totalAmount || (subtotal + shipping + gst + extraTax);

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
          <div className="w-full lg:w-2/3 space-y-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/4" />

            <div className="flex items-start gap-4 border p-4 rounded shadow">
              <div className="w-24 h-24 bg-gray-300 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
                <div className="h-4 bg-gray-300 rounded w-1/3" />
              </div>
            </div>

            <div className="flex items-start gap-4 border p-4 rounded shadow">
              <div className="w-24 h-24 bg-gray-300 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-5 bg-gray-300 rounded w-1/3" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
              <div className="h-4 bg-gray-300 rounded w-1/4" />
            </div>
          </div>

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

      <div className="text-xs sm:text-sm flex bg-slate-700 text-white">
        <div className="py-4 px-4 md:px-6 xl:px-6 flex space-x-2">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:underline"
          >
            Home
          </span>
          <span>/</span>
          <span
            onClick={() => navigate("/user-profile-details")}
            className="cursor-pointer hover:underline"
          >
            My Account
          </span>
          <span>/</span>
          <span
            onClick={() => navigate("/orders")}
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
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" /> Order Details
              </h2>
              {order.products.map((item, idx) => {
                const review = reviews[item.product._id];
                return (
                  <div key={idx} className="border rounded-lg p-2.5 sm:p-4 sm:mb-4">
                    <div className="flex gap-4 sm:mb-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-medium line-clamp-3">
                          {item.product?.name || "Product"}
                        </h3>
                        <p className="text-gray-400 my-2 text-xs sm:text-sm line-clamp-3">
                          {item.product?.description || "No description."}
                        </p>
                        <div className="mt-2 text-sm text-gray-700">
                          Total:{" "}
                          {formatPrice(
                            (item.price || 0) * (item.quantity || 1)
                          )}
                        </div>
                      </div>
                    </div>

                    {order.status === "Delivered" && (
                      <div className="border-t pt-4">
                        {review ? (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <FiStar
                                      key={i}
                                      size={16}
                                      className={`${i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  {review.rating}.0/5.0
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedReview(review);
                                    setShowEditReview(true);
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition"
                                  title="Edit Review"
                                >
                                  <FiEdit2 size={16} />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                              {review.reviewText}
                            </p>
                            {review.images && review.images.length > 0 && (
                              <div className="flex gap-2 mb-2">
                                {review.images.map((img, imgIdx) => (
                                  <img
                                    key={imgIdx}
                                    src={img}
                                    alt={`Review ${imgIdx + 1}`}
                                    className="w-16 h-16 object-cover rounded-md"
                                  />
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-500">
                              Reviewed on{" "}
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedProductForReview(item.product._id);
                              setShowAddReview(true);
                            }}
                            className="w-full flex items-center justify-center py-2 px-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                          >
                            <FiStar className="mr-2" /> Write a Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

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
                    className={`mt-1 ${order.status === "Delivered" || isExchangeRequested
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

          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="te sm:text-xl font-semibold mb-4 flex items-center">
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
                    <FiRefreshCw className="mr-2" />
                    {getExchangeStatusLabel(exchangeStatus)}
                  </div>
                )}

                <button className="w-full flex items-center justify-center py-2 px-4 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
                  <FiMessageSquare className="mr-2" /> Need Help?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExchangeModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        orderId={order._id}
        onSuccess={handleExchangeSuccess}
      />

      <AddReviewModal
        isOpen={showAddReview}
        onClose={() => {
          setShowAddReview(false);
          setSelectedProductForReview(null);
        }}
        orderId={order._id}
        productId={selectedProductForReview}
        userId={userId}
        onSuccess={() => {
          setShowAddReview(false);
          setSelectedProductForReview(null);
          dataById();
        }}
      />

      <EditReviewModal
        isOpen={showEditReview}
        onClose={() => setShowEditReview(false)}
        review={selectedReview}
        userId={userId}
        onSuccess={() => {
          setShowEditReview(false);
          dataById();
        }}
      />
    </>
  );
}

export default OrderDetails;
