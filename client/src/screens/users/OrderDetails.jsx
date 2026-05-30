import axios from "axios";
import {
  ArrowLeft,
  Box,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Edit2,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  RotateCcw,
  Star,
  Truck,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import UserNavbar from "../../components/common/UserNavbar";
import { useAuth } from "../../context/AuthContext";
import { AddReviewModal, EditReviewModal } from "./Product/AddReviewModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : null;

const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : null;

// ─── Status meta ──────────────────────────────────────────────────────────────

const STATUS_META = {
  pending: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50  border-amber-200", icon: Clock, label: "Pending" },
  confirmed: { dot: "bg-blue-400", text: "text-blue-700", bg: "bg-blue-50   border-blue-200", icon: CheckCircle, label: "Confirmed" },
  processing: { dot: "bg-orange-400", text: "text-orange-700", bg: "bg-orange-50 border-orange-200", icon: RefreshCw, label: "Processing" },
  shipped: { dot: "bg-violet-400", text: "text-violet-700", bg: "bg-violet-50 border-violet-200", icon: Truck, label: "Shipped" },
  delivered: { dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2, label: "Delivered" },
  cancelled: { dot: "bg-red-400", text: "text-red-600", bg: "bg-red-50    border-red-200", icon: XCircle, label: "Cancelled" },
  returned: { dot: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-100 border-slate-200", icon: RotateCcw, label: "Returned" },
  "exchange requested": { dot: "bg-teal-400", text: "text-teal-700", bg: "bg-teal-50   border-teal-200", icon: RotateCcw, label: "Exchange Requested" },
};

const getStatusMeta = (s = "") =>
  STATUS_META[s.toLowerCase()] || {
    dot: "bg-slate-400", text: "text-slate-600",
    bg: "bg-slate-50 border-slate-200", icon: Clock, label: s,
  };

const StatusBadge = ({ status }) => {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold tracking-wide uppercase ${meta.bg} ${meta.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${meta.dot}`} />
      {meta.label}
    </span>
  );
};

// ─── Price row helper ─────────────────────────────────────────────────────────

const PriceRow = ({ label, value, bold = false, muted = false, freeText = null }) => (
  <div className="flex items-center justify-between">
    <span className={`text-sm ${muted ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
    {freeText ? (
      <span className="text-sm font-medium text-emerald-600">{freeText}</span>
    ) : (
      <span className={bold ? "text-base font-bold text-gray-900" : "text-sm font-medium text-gray-800"}>
        {value}
      </span>
    )}
  </div>
);

// ─── Delivery timeline ────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { key: "Pending", label: "Order Placed", icon: Package },
  { key: "Confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "Processing", label: "Processing", icon: RefreshCw },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
];
const ORDER_FLOW = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

const DeliveryTimeline = ({ order }) => {
  const currentIdx = ORDER_FLOW.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "Cancelled" || order.orderStatus === "Returned";
  const isExchange = order.orderStatus === "Exchange Requested";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
        Order Timeline
      </p>

      {isCancelled || isExchange ? (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${isCancelled ? "bg-red-50 border-red-100" : "bg-teal-50 border-teal-100"}`}>
          {isCancelled
            ? <XCircle className="w-4 h-4 text-red-400  flex-shrink-0 mt-0.5" />
            : <RotateCcw className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />}
          <div>
            <p className={`text-sm font-semibold ${isCancelled ? "text-red-700" : "text-teal-700"}`}>
              {order.orderStatus}
            </p>
            {isExchange && order.exchangeRequest?.requestedAt && (
              <p className="text-xs text-teal-600 mt-0.5">
                Requested on {fmtDateTime(order.exchangeRequest.requestedAt)}
              </p>
            )}
            {isExchange && order.exchangeRequest?.reason && (
              <p className="text-xs text-gray-500 mt-1 italic">"{order.exchangeRequest.reason}"</p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[10px] top-3 bottom-3 w-px bg-gray-100" />
          <div className="space-y-5">
            {TIMELINE_STEPS.map((step, idx) => {
              const done = currentIdx >= idx;
              const active = currentIdx === idx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex items-start gap-4 relative">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-all mt-0.5 ${done ? "bg-[#00395F] border-[#00395F]" : "bg-white border-gray-200"}`}>
                    <Icon className={`w-2 h-2 ${done ? "text-white" : "text-gray-300"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${done ? "font-medium text-gray-800" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                    {step.key === "Pending" && order.createdAt && done && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{fmtDateTime(order.createdAt)}</p>
                    )}
                    {step.key === "Delivered" && order.updatedAt && done && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{fmtDateTime(order.updatedAt)}</p>
                    )}
                    {active && step.key !== "Pending" && step.key !== "Delivered" && (
                      <p className="text-[11px] text-[#00395F] mt-0.5 font-medium">In progress</p>
                    )}
                  </div>
                  {active && (
                    <span className="text-[9px] bg-[#00395F] text-white px-1.5 py-0.5 rounded font-bold tracking-widest mt-1">
                      NOW
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Exchange Modal ───────────────────────────────────────────────────────────

const ExchangeModal = ({ isOpen, onClose, orderId, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) { toast.error("Please provide a reason"); return; }
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/orders/order-exchange-request/${orderId}`,
        { reason: reason.trim() }
      );
      toast.success("Exchange request submitted!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Request Exchange</h3>
          <button onClick={onClose} disabled={loading} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the reason for exchange (damaged, wrong item, etc.)"
              disabled={loading}
              className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00395F]/10 focus:border-[#00395F] resize-none transition-all placeholder:text-gray-300"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !reason.trim()}
              className="flex-1 py-2.5 bg-[#00395F] hover:bg-[#FF8617] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupOrders, setGroupOrders] = useState([]);
  const [showExchange, setShowExchange] = useState(false);

  const [reviews, setReviews] = useState({});
  const [showAddReview, setShowAddReview] = useState(false);
  const [showEditReview, setShowEditReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);

  // ── Fetch order ───────────────────────────────────────────────────────────

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/get-order-by-id/${orderId}`
      );
      setOrder(data);
      if (data.groupOrderId) {
        try {
          const { data: grp } = await axios.get(
            `${process.env.REACT_APP_API_URL}/orders/get-group/${data.groupOrderId}`
          );
          setGroupOrders(grp.orders || []);
        } catch {
          setGroupOrders([data]);
        }
      }
      if (data.products) fetchReviews(data.products, data._id);
    } catch {
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  // "Write a Review" vs the submitted review card (visible only after delivery).
  const fetchReviews = async (products, oid) => {
    if (!user?._id) return;
    const reviewData = {};
    for (const item of products) {
      const pid = item?.product?._id;
      if (!pid) { reviewData[pid] = null; continue; }
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/review/my-product-review/${user._id}/${pid}?orderId=${oid}`
        );
        reviewData[pid] =
          data?.hasReviewed && data?.data?.order?._id === oid ? data.data : null;
      } catch {
        reviewData[pid] = null;
      }
    }
    setReviews(reviewData);
  };

  useEffect(() => { if (orderId) fetchOrder(); }, [orderId]); // eslint-disable-line

  const totals = useMemo(() => {
    if (!order) return null;
    if (order.pricing?.grandTotal != null) {
      return {
        subtotal: order.pricing.subtotal || 0,
        gst: order.pricing.gstTotal || 0,
        extraTax: order.pricing.extraTaxTotal || 0,
        shipping: order.pricing.shippingTotal || 0,
        grandTotal: order.pricing.grandTotal,
      };
    }
    const items = order.products || [];
    const subtotal = items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
    const gst = items.reduce((s, i) => s + (i.gst || 0) * (i.quantity || 1), 0);
    const extraTax = items.reduce((s, i) => s + (i.extraTax || 0) * (i.quantity || 1), 0);
    const shipping = items.reduce((s, i) => s + (i.shippingCharge || 0) * (i.quantity || 1), 0);
    return {
      subtotal, gst, extraTax, shipping,
      grandTotal: order.totalAmount || (subtotal + gst + extraTax + shipping),
    };
  }, [order]);

  const groupTotal = useMemo(() => groupOrders.reduce((s, o) => s + (o.pricing?.grandTotal || 0), 0), [groupOrders]);
  const isGroupCheckout = groupOrders.length > 1;
  const orderStatus = order?.orderStatus || order?.status || "Pending";
  const isDelivered = orderStatus === "Delivered";
  const exchangeStatus = order?.exchangeRequest?.status;

  // Exchange button only appears after delivery and before any request is made
  const canRequestExchange = isDelivered && !order?.exchangeRequest?.isRequested;


  if (loading) {
    return <OrderDetailsSkeleton />;
  }


  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f4f4f2]">
        <UserNavbar />
        <div className="flex justify-center items-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800 mb-1">{error || "Order not found"}</h2>
            <p className="text-xs text-gray-400 mb-5">We couldn't load the details for this order.</p>
            <button onClick={() => navigate("/orders")} className="px-5 py-2.5 rounded-xl bg-[#00395F] text-white text-sm font-semibold hover:bg-[#FF8617] transition-colors">
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f2]">
      <UserNavbar />

      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-5 pb-24">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-4 text-xs">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] transition-colors font-medium"
          >
            <ArrowLeft className="w-3 h-3" />
            My Orders
          </button>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="font-mono text-[11px] text-gray-400">
            {order.orderId || order._id?.slice(-8)}
          </span>
        </div>

        {/* ── Header card ── */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            {/* Left: order ID + status badge + date (quiet, no icon) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[13px] font-bold text-gray-800 tracking-tight">
                  {order.orderId || `#${order._id?.slice(-8)}`}
                </span>
                <StatusBadge status={orderStatus} />
              </div>
              <span className="text-[11px] text-gray-400">{fmtDate(order.createdAt)}</span>
            </div>

            {/* Right: total only, no payment info here */}
            <div className="sm:text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                Order Total
              </p>
              <p className="text-xl font-bold text-gray-900">{fmt(totals?.grandTotal)}</p>
              {isGroupCheckout && groupTotal > 0 && (
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Full checkout:{" "}
                  <span className="font-semibold text-gray-600">{fmt(groupTotal)}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Two-column body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Products */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  {order.products.length} Item{order.products.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="divide-y divide-gray-50">
                {order.products.map((item, idx) => {
                  const pid = item?.product?._id;
                  const img = item?.product?.images?.[0] || item.productImage;
                  const name = item?.product?.name || item.productName || "Product";
                  const review = reviews[pid];
                  const qty = item.quantity || 1;
                  const unitBase = item.price || 0;
                  const unitGst = item.gst || 0;
                  const unitExtra = item.extraTax || 0;
                  const unitShip = item.shippingCharge || 0;
                  const lineTotal = (unitBase + unitGst + unitExtra + unitShip) * qty;

                  return (
                    <div key={idx} className="p-5">
                      <div className="flex gap-4">

                        {/* Thumbnail */}
                        <div className="w-[76px] h-[76px] sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          {img
                            ? <img src={img} alt={name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-200" /></div>
                          }
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                            {name}
                          </p>
                          {item.brand && (
                            <p className="text-[11px] text-gray-400 mt-0.5">{item.brand}</p>
                          )}

                          {/* Attribute tags */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.size && (
                              <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                {item.size}
                              </span>
                            )}
                            {item.variantModel && (
                              <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                {item.variantModel}
                              </span>
                            )}
                            <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                              Qty {qty}
                            </span>
                          </div>

                          {/* Pricing — single clean inline row + bold total */}
                          <div className="mt-3 space-y-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
                              <span className="text-gray-600 font-medium">{fmt(unitBase)}/unit</span>
                              {unitGst > 0 && <span>+ GST {fmt(unitGst)}</span>}
                              {unitExtra > 0 && <span>+ Tax {fmt(unitExtra)}</span>}
                              {unitShip > 0 && <span>+ Ship {fmt(unitShip)}</span>}
                            </div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[11px] text-gray-400">Total</span>
                              <span className="text-sm font-bold text-gray-900">{fmt(lineTotal)}</span>
                              {qty > 1 && (
                                <span className="text-[11px] text-gray-400">for {qty} units</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review — only shown after delivery */}
                      {isDelivered && pid && (
                        <div className="mt-4 pt-4 border-t border-gray-50">
                          {review ? (
                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-100">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                                    ))}
                                  </div>
                                  <span className="text-[11px] text-gray-500">{review.rating}/5</span>
                                </div>
                                <button
                                  onClick={() => { setSelectedReview(review); setShowEditReview(true); }}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">{review.reviewText}</p>
                              {review.images?.length > 0 && (
                                <div className="flex gap-1.5 mt-2">
                                  {review.images.map((src, i) => (
                                    <img key={i} src={src} alt="" className="w-11 h-11 rounded-md object-cover border border-gray-100" />
                                  ))}
                                </div>
                              )}
                              <p className="text-[10px] text-gray-400 mt-2">
                                Reviewed {fmtDate(review.createdAt)}
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setSelectedProductForReview(pid); setShowAddReview(true); }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-200 text-gray-400 hover:text-[#00395F] hover:border-[#00395F]/30 hover:bg-[#00395F]/[0.03] rounded-lg text-xs font-medium transition-all"
                            >
                              <Star className="w-3.5 h-3.5" />
                              Write a Review
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <DeliveryTimeline order={order} />

            {/* Delivery address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Delivery Address
                </p>
                <div className="space-y-0.5 text-sm">
                  <p className="font-semibold text-gray-800">{order.shippingAddress.fullName}</p>
                  <p className="text-gray-500">{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-gray-500">{order.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-gray-500">
                    {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-500">{order.shippingAddress.country}</p>
                  <p className="text-xs text-gray-500 pt-1">📞 {order.shippingAddress.phone}</p>
                </div>
              </div>
            )}

            {/* Other orders from same checkout */}
            {isGroupCheckout && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Other orders from this checkout
                </p>
                <div className="space-y-2">
                  {groupOrders
                    .filter((o) => o._id !== order._id)
                    .map((sibling) => (
                      <button
                        key={sibling._id}
                        onClick={() => navigate(`/orders/${sibling._id}`)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left group"
                      >
                        <div>
                          <p className="font-mono text-[11px] font-semibold text-gray-700">{sibling.orderId}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={sibling.orderStatus} />
                            <span className="text-[11px] text-gray-400">
                              {sibling.products?.length} item{sibling.products?.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-800">{fmt(sibling.pricing?.grandTotal)}</p>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-4">

            {/* Price breakdown */}
            {totals && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Price Breakdown
                  </p>
                </div>

                {/* Line items */}
                <div className="px-5 py-4 space-y-3">
                  <PriceRow label="Subtotal" value={fmt(totals.subtotal)} />
                  {totals.gst > 0 && (
                    <PriceRow label="GST" value={fmt(totals.gst)} />
                  )}
                  {totals.extraTax > 0 && (
                    <PriceRow label="Extra Tax" value={fmt(totals.extraTax)} />
                  )}
                  <PriceRow
                    label="Shipping"
                    value={fmt(totals.shipping)}
                    freeText={totals.shipping === 0 ? "Free" : null}
                  />
                </div>

                {/* Divider + total */}
                <div className="mx-4 border-t border-gray-100" />
                <div className="px-5 py-4">
                  <PriceRow label="Order Total" value={fmt(totals.grandTotal)} bold />
                </div>

                {/* Full checkout total (multi-seller) */}
                {isGroupCheckout && groupTotal > 0 && (
                  <>
                    <div className="mx-4 border-t border-dashed border-gray-100" />
                    <div className="px-5 py-3">
                      <PriceRow label="Full checkout" value={fmt(groupTotal)} muted />
                    </div>
                  </>
                )}

                {/* Payment details */}
                <div className="mx-4 border-t border-gray-100" />
                <div className="px-5 py-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Method</span>
                    <span className="text-xs font-semibold text-gray-700">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Status</span>
                    <span className={`text-xs font-bold ${order.paymentStatus === "Paid" ? "text-emerald-600" :
                      order.paymentStatus === "Refunded" ? "text-blue-600" :
                        order.paymentStatus === "Failed" ? "text-red-500" : "text-amber-500"
                      }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  {order.razorpayId && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Razorpay ID</span>
                      <span className="font-mono text-[10px] text-gray-500">{order.razorpayId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order info */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Order Info
                </p>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Order ID</span>
                  <span className="font-mono text-[11px] font-bold text-gray-700">{order.orderId || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Placed</span>
                  <span className="text-xs text-gray-700">{fmtDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Last updated</span>
                  <span className="text-xs text-gray-700">{fmtDate(order.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">

              {/* Exchange request — appears only after delivery, before any request */}
              {canRequestExchange && (
                <button
                  onClick={() => setShowExchange(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00395F] hover:bg-[#FF8617] text-white text-sm font-semibold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Request Exchange
                </button>
              )}

              {/* Exchange status pill — shows once request is submitted */}
              {order?.exchangeRequest?.isRequested && (
                <div className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium ${exchangeStatus === "Approved" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                  exchangeStatus === "Rejected" ? "bg-red-50    border-red-200    text-red-700" :
                    exchangeStatus === "Completed" ? "bg-blue-50   border-blue-200   text-blue-700" :
                      "bg-amber-50  border-amber-200  text-amber-700"
                  }`}>
                  <RotateCcw className="w-3.5 h-3.5" />
                  Exchange: {exchangeStatus || "Requested"}
                </div>
              )}

              {/* Proof of delivery */}
              {order.pod_img_url && (
                <a
                  href={order.pod_img_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-emerald-200 text-emerald-700 text-sm font-medium hover:bg-emerald-50 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  View Delivery Proof
                </a>
              )}

              <button
                onClick={() => navigate("/orders")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to My Orders
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExchangeModal
        isOpen={showExchange}
        onClose={() => setShowExchange(false)}
        orderId={order._id}
        onSuccess={fetchOrder}
      />
      <AddReviewModal
        isOpen={showAddReview}
        onClose={() => { setShowAddReview(false); setSelectedProductForReview(null); }}
        orderId={order._id}
        productId={selectedProductForReview}
        userId={user?._id}
        onSuccess={() => { setShowAddReview(false); setSelectedProductForReview(null); fetchOrder(); }}
      />
      <EditReviewModal
        isOpen={showEditReview}
        onClose={() => setShowEditReview(false)}
        review={selectedReview}
        userId={user?._id}
        onSuccess={() => { setShowEditReview(false); fetchOrder(); }}
      />
    </div>
  );
};

export default OrderDetails;

const OrderDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#f4f4f2]">
    <UserNavbar />

    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-5 pb-24 animate-pulse">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-3 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>

          <div className="space-y-2 sm:text-right">
            <div className="h-3 w-20 bg-gray-200 rounded sm:ml-auto" />
            <div className="h-7 w-28 bg-gray-200 rounded sm:ml-auto" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">

          {/* Products */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>

            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-5 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex gap-4">
                  <div className="w-[76px] h-[76px] sm:w-20 sm:h-20 rounded-lg bg-gray-200 flex-shrink-0" />

                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-[85%]" />
                    <div className="h-4 bg-gray-200 rounded w-[60%] mt-2" />

                    <div className="flex gap-2 mt-3">
                      <div className="h-5 w-14 bg-gray-200 rounded" />
                      <div className="h-5 w-16 bg-gray-200 rounded" />
                      <div className="h-5 w-12 bg-gray-200 rounded" />
                    </div>

                    <div className="h-3 bg-gray-200 rounded w-48 mt-4" />
                    <div className="h-4 bg-gray-200 rounded w-24 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="h-3 w-28 bg-gray-200 rounded mb-6" />

            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="h-3 w-32 bg-gray-200 rounded mb-4" />

            <div className="space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-[85%] bg-gray-200 rounded" />
              <div className="h-3 w-[60%] bg-gray-200 rounded" />
              <div className="h-3 w-[40%] bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          {/* Price Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>

            <div className="p-5 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center"
                >
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 p-5">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>

            <div className="p-5 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center"
                >
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);