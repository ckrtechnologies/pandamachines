import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  MdArrowBackIos,
} from "react-icons/md";
import {
  FiPackage, FiUser, FiMapPin, FiTruck,
  FiCreditCard, FiRefreshCcw, FiBox, FiImage, FiChevronDown,
} from "react-icons/fi";
import {
  StatusChangeModal,
  ExchangeStatusModal,
  STATUS_FLOW,
  EXCHANGE_NEXT,
} from "./OrderStatusModals.jsx";

// ─── Status configs (display only — not in shared modal file) ─────────────────

const STATUS_CFG_BADGE = {
  Pending: { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Confirmed: { dot: "bg-sky-400", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  Processing: { dot: "bg-violet-400", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  Shipped: { dot: "bg-blue-400", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Delivered: { dot: "bg-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Cancelled: { dot: "bg-rose-400", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  Returned: { dot: "bg-orange-400", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "Exchange Requested": { dot: "bg-fuchsia-400", bg: "bg-fuchsia-50", text: "text-fuchsia-700", border: "border-fuchsia-200" },
};

const PAYMENT_STATUS_CFG = {
  Pending: { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Paid: { dot: "bg-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Failed: { dot: "bg-rose-400", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  Refunded: { dot: "bg-blue-400", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Partially Refunded": { dot: "bg-orange-400", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
};

const EXCHANGE_BADGE_CFG = {
  Requested: { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Approved: { dot: "bg-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Completed: { dot: "bg-sky-400", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  Rejected: { dot: "bg-rose-400", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) =>
  n != null ? Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0, minimumFractionDigits: 0 }) : null;

const fmtDateTime = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  return (
    dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
    ", " +
    dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

const StatusBadge = ({ status, config = STATUS_CFG_BADGE, clickable = false, onClick }) => {
  const cfg = config[status] || { dot: "bg-gray-400", bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
  return (
    <span
      onClick={clickable ? onClick : undefined}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border
        ${cfg.bg} ${cfg.text} ${cfg.border}
        ${clickable ? "cursor-pointer hover:opacity-75 transition-opacity" : "cursor-default"}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {status}
    </span>
  );
};

const SectionHeader = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon size={12} className="text-gray-400" />
    <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
  </div>
);

const InfoRow = ({ label, value, mono = false }) => {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between items-start gap-6 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className={`text-xs text-gray-700 text-right leading-relaxed ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Sk = ({ className }) => <div className={`bg-gray-100 rounded animate-pulse ${className}`} />;

const SkeletonLoader = () => (
  <div className="min-h-screen bg-gray-50 p-4 md:p-6">
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Sk className="w-9 h-9 rounded-xl" />
        <div className="flex-1 space-y-1.5"><Sk className="h-6 w-48" /><Sk className="h-3.5 w-32" /></div>
        <div className="flex gap-2"><Sk className="h-6 w-20 rounded-full" /><Sk className="h-6 w-20 rounded-full" /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <Sk className="h-3.5 w-24 mb-5" />
              {[1, 2].map((j) => (
                <div key={j} className="flex gap-3 py-4 border-b border-gray-50 last:border-0">
                  <Sk className="w-14 h-14 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2"><Sk className="h-4 w-2/3" /><Sk className="h-3 w-1/3" /></div>
                  <Sk className="h-4 w-14" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <Sk className="h-3.5 w-28 mb-4" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between py-2.5 border-b border-gray-50">
                  <Sk className="h-3 w-20" /><Sk className="h-3 w-24" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminOrderDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [statusModalOpen, setStatusModal] = useState(false);
  const [exchangeModalOpen, setExchangeModal] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/get-order-by-id/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load order details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]); // eslint-disable-line

  if (isLoading) return <SkeletonLoader />;

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-gray-400 text-sm">{error || "Order not found."}</p>
          <button onClick={() => navigate(-1)} className="text-xs text-orange-500 hover:underline">Go back</button>
        </div>
      </div>
    );
  }

  const addr = order.shippingAddress;
  const user = order.user;
  const pricing = order.pricing;
  const exchange = order.exchangeRequest;
  const hasExchange = exchange?.isRequested;

  const canChangeStatus = (STATUS_FLOW[order.orderStatus] || []).length > 0;
  const canChangeExchange = hasExchange && (EXCHANGE_NEXT[exchange?.status || "Requested"] || []).length > 0;

  // Seller label for right panel
  const sellerLabel = order.sellerType === "supplier" && order.sellerId
    ? (order.sellerId.businessName || order.sellerId.fullName || "Supplier")
    : "Panda Machines (Admin)";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start gap-3">
          <button onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors shadow-sm flex-shrink-0 mt-0.5">
            <MdArrowBackIos size={15} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-gray-800 tracking-tight">Order Details</h1>
              {order.orderId && (
                <span className="text-xs font-mono text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-sm">
                  {order.orderId}
                </span>
              )}
            </div>
            {order.createdAt && (
              <p className="text-xs text-gray-400 mt-0.5">{fmtDateTime(order.createdAt)}</p>
            )}
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap items-end gap-3 ml-auto">
            {order.paymentStatus && (
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Payment</span>
                <StatusBadge status={order.paymentStatus} config={PAYMENT_STATUS_CFG} />
              </div>
            )}
            {order.orderStatus && (
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Order</span>
                <StatusBadge
                  status={order.orderStatus}
                  clickable={canChangeStatus}
                  onClick={() => setStatusModal(true)}
                />
              </div>
            )}
            {hasExchange && (
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Exchange</span>
                <StatusBadge
                  status={exchange.status || "Requested"}
                  config={EXCHANGE_BADGE_CFG}
                  clickable={canChangeExchange}
                  onClick={() => setExchangeModal(true)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Body grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ═══ LEFT ═══ */}
          <div className="lg:col-span-2 space-y-5">

            {/* Products */}
            <Card>
              <SectionHeader icon={FiPackage} label="Products" />
              <div className="-mx-1">
                {order.products?.map((item, idx) => {
                  const name = item.productName || item.product?.name;
                  const brand = item.brand || item.product?.brand;
                  const image = item.productImage || item.product?.images?.[0];
                  const price = item.price ?? item.product?.price;
                  const qty = item.quantity;
                  const lineTotal = price != null && qty != null ? price * qty : null;

                  return (
                    <div key={idx} className="flex items-start gap-3 px-1 py-4 border-b border-gray-50 last:border-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                        {image ? (
                          <img src={image} alt={name || "Product"} className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiBox size={20} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {name && <p className="text-sm font-semibold text-gray-800 leading-snug">{name}</p>}
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                          {brand && <span className="text-xs text-gray-400">{brand}</span>}
                          {item.variantModel && <span className="text-xs text-gray-400">Variant: {item.variantModel}</span>}
                          {item.size && <span className="text-xs text-gray-400">Size: {item.size}</span>}
                          {qty != null && <span className="text-xs text-gray-400">Qty: {qty}</span>}
                        </div>
                        {(item.gst > 0 || item.extraTax > 0 || item.shippingCharge > 0) && (
                          <div className="flex flex-wrap gap-x-3 mt-1.5">
                            {item.gst > 0 && <span className="text-[11px] text-gray-400">GST ₹{fmt(item.gst)}</span>}
                            {item.extraTax > 0 && <span className="text-[11px] text-gray-400">Tax ₹{fmt(item.extraTax)}</span>}
                            {item.shippingCharge > 0 && <span className="text-[11px] text-gray-400">Shipping ₹{fmt(item.shippingCharge)}</span>}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        {price != null && <p className="text-sm font-semibold text-gray-800">₹{fmt(price)}</p>}
                        {lineTotal != null && qty > 1 && <p className="text-xs text-gray-400">₹{fmt(lineTotal)}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Price Breakdown */}
            {pricing && (
              <Card>
                <SectionHeader icon={FiCreditCard} label="Price Breakdown" />
                <div className="-mx-1">
                  {pricing.subtotal != null && (
                    <div className="flex justify-between items-center px-1 py-2.5 border-b border-gray-50">
                      <span className="text-xs text-gray-500">Subtotal</span>
                      <span className="text-xs font-medium text-gray-700">₹{fmt(pricing.subtotal)}</span>
                    </div>
                  )}
                  {pricing.gstTotal > 0 && (
                    <div className="flex justify-between items-center px-1 py-2.5 border-b border-gray-50">
                      <span className="text-xs text-gray-500">GST</span>
                      <span className="text-xs font-medium text-gray-700">₹{fmt(pricing.gstTotal)}</span>
                    </div>
                  )}
                  {pricing.extraTaxTotal > 0 && (
                    <div className="flex justify-between items-center px-1 py-2.5 border-b border-gray-50">
                      <span className="text-xs text-gray-500">Extra Tax</span>
                      <span className="text-xs font-medium text-gray-700">₹{fmt(pricing.extraTaxTotal)}</span>
                    </div>
                  )}
                  {pricing.shippingTotal > 0 && (
                    <div className="flex justify-between items-center px-1 py-2.5 border-b border-gray-50">
                      <span className="text-xs text-gray-500">Shipping</span>
                      <span className="text-xs font-medium text-gray-700">₹{fmt(pricing.shippingTotal)}</span>
                    </div>
                  )}
                  {pricing.grandTotal != null && (
                    <div className="flex justify-between items-center px-1 pt-3.5">
                      <span className="text-sm font-semibold text-gray-800">Grand Total</span>
                      <span className="text-base font-bold text-orange-600">₹{fmt(pricing.grandTotal)}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Customer */}
            {user && (
              <Card>
                <SectionHeader icon={FiUser} label="Customer" />
                <div className="-mx-1">
                  <InfoRow label="Name" value={[user.firstName, user.lastName].filter(Boolean).join(" ") || null} />
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Phone" value={user.phone} mono />
                </div>
              </Card>
            )}

            {/* Shipping Address */}
            {addr && (
              <Card>
                <SectionHeader icon={FiMapPin} label="Shipping Address" />
                <div className="-mx-1">
                  <InfoRow label="To" value={addr.fullName} />
                  <InfoRow label="Phone" value={addr.phone} mono />
                  <InfoRow label="Line 1" value={addr.addressLine1} />
                  <InfoRow label="Line 2" value={addr.addressLine2} />
                  <InfoRow label="Landmark" value={addr.landmark} />
                  <InfoRow label="City / State" value={[addr.city, addr.state].filter(Boolean).join(", ") || null} />
                  <InfoRow label="PIN" value={addr.postalCode} mono />
                  <InfoRow label="Country" value={addr.country} />
                </div>
              </Card>
            )}
          </div>

          {/* ═══ RIGHT ═══ */}
          <div className="space-y-5">

            {/* Order Info */}
            <Card>
              <SectionHeader icon={FiTruck} label="Order Info" />
              <div className="-mx-1">
                <InfoRow label="Order ID" value={order.orderId} mono />
                {order.createdAt && <InfoRow label="Placed" value={fmtDateTime(order.createdAt)} />}
                {order.updatedAt && order.updatedAt !== order.createdAt &&
                  <InfoRow label="Updated" value={fmtDateTime(order.updatedAt)} />}
                <InfoRow label="Fulfilled by" value={sellerLabel} />
                {canChangeStatus && (
                  <div className="pt-3">
                    <button onClick={() => setStatusModal(true)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-orange-300 transition-colors group">
                      <span className="text-xs font-medium text-gray-600 group-hover:text-gray-800">Change Order Status</span>
                      <FiChevronDown size={13} className="text-gray-400 group-hover:text-orange-500 -rotate-90 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* Payment */}
            <Card>
              <SectionHeader icon={FiCreditCard} label="Payment" />
              <div className="-mx-1">
                <InfoRow label="Method"
                  value={order.paymentMethod === "Rzrpay" ? "Razorpay" : order.paymentMethod} />
                {order.paymentStatus && (
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-400">Status</span>
                    <StatusBadge status={order.paymentStatus} config={PAYMENT_STATUS_CFG} />
                  </div>
                )}
                <InfoRow label="Transaction ID" value={order.razorpayId} mono />
              </div>
            </Card>

            {/* Proof of Delivery */}
            {order.pod_img_url && (
              <Card>
                <SectionHeader icon={FiImage} label="Proof of Delivery" />
                <img src={order.pod_img_url} alt="Proof of Delivery"
                  className="w-full rounded-xl border border-gray-100 object-cover" />
              </Card>
            )}

            {/* Exchange Request */}
            {hasExchange && (
              <Card>
                <SectionHeader icon={FiRefreshCcw} label="Exchange Request" />
                <div className="-mx-1">
                  {exchange.status && (
                    <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                      <span className="text-xs text-gray-400">Status</span>
                      <StatusBadge status={exchange.status} config={EXCHANGE_BADGE_CFG} />
                    </div>
                  )}
                  {exchange.reason && (
                    <div className="py-2.5 border-b border-gray-50">
                      <span className="text-xs text-gray-400 block mb-1">Reason</span>
                      <p className="text-xs text-gray-700 font-medium leading-relaxed">{exchange.reason}</p>
                    </div>
                  )}
                  <InfoRow label="Requested" value={fmtDateTime(exchange.requestedAt)} />
                  <InfoRow label="Completed" value={fmtDateTime(exchange.completedAt)} />
                  {canChangeExchange && (
                    <div className="pt-3">
                      <button onClick={() => setExchangeModal(true)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-fuchsia-300 transition-colors group">
                        <span className="text-xs font-medium text-gray-600 group-hover:text-gray-800">Update Exchange Status</span>
                        <FiChevronDown size={13} className="text-gray-400 group-hover:text-fuchsia-500 -rotate-90 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            )}

          </div>
        </div>
      </div>

      {/* ── Modals (shared reusable components) ── */}
      <StatusChangeModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModal(false)}
        orderId={order._id}
        currentStatus={order.orderStatus}
        onSuccess={fetchOrder}
      />
      <ExchangeStatusModal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModal(false)}
        order={order}
        onSuccess={fetchOrder}
      />
    </div>
  );
};

export default AdminOrderDetails;