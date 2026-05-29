
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShoppingBag,
  Truck,
  CreditCard,
  Loader2,
  AlertCircle,
  Package,
  Tag,
} from "lucide-react";

import UserNavbar from "../../components/common/UserNavbar";
import CheckoutAddressSection from "../../components/UserSideComponents/Order/CheckoutAddressSection";
import RazorpayPayment from "../../utils/payments/RazorpayPayment.js";

import { useCheckout } from "../../context/CheckoutContext";
import { useAuth } from "../../context/AuthContext";
import { COD_THRESHOLD } from "../../utils/constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// ─────────────────────────────────────────────────────────────────────────────

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const { user, isLoggedIn } = useAuth();

  const {
    checkoutItems,
    selectedAddress,
    paymentMethod,
    pricing,
    loading,
    error,
    notes,
    setSelectedAddress,
    setPaymentMethod,
    setNotes,
    rehydrate,
    resetCheckout,
    groupBySeller,
  } = useCheckout();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const mode = productId ? "buy_now" : "cart";

  // ── COD availability ──────────────────────────────────────────
  const showCOD = pricing.grandTotal <= COD_THRESHOLD;

  // Auto-switch to Razorpay when order exceeds threshold
  useEffect(() => {
    if (!showCOD && paymentMethod === "COD") {
      setPaymentMethod("Rzrpay");
    }
  }, [showCOD, paymentMethod, setPaymentMethod]);

  // ── Rehydrate ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || !user?._id) return;
    rehydrate({ mode, productId: productId || null, userId: user._id });
  }, [isLoggedIn, user?._id, mode, productId]); // eslint-disable-line

  // ── Build order payload ───────────────────────────────────────
  const buildOrderPayload = useCallback(
    (razorpayId = null) => {
      const products = checkoutItems.map((item) => ({
        product: item.productId || item.product?._id,
        quantity: item.quantity,
        measurement: item.selectedSize || undefined,
      }));

      return {
        userId: user._id,
        products,
        shippingAddress: selectedAddress,
        paymentMethod,
        ...(razorpayId ? { razorpayId } : {}),
      };
    },
    [checkoutItems, selectedAddress, paymentMethod, user]
  );

  // ── Place order (COD) ─────────────────────────────────────────
  const placeCODOrder = useCallback(async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    const confirm = await Swal.fire({
      title: "Confirm Order",
      text: `Place order for ${fmt(pricing.grandTotal)} (Cash on Delivery)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00395F",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, place order",
    });

    if (!confirm.isConfirmed) return;

    setPlacingOrder(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders/place-order`,
        buildOrderPayload()
      );
      setOrderSuccess(data);
      resetCheckout();
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  }, [selectedAddress, pricing, buildOrderPayload, resetCheckout]);

  // ── Razorpay success ──────────────────────────────────────────
  const handlePaymentSuccess = useCallback(
    async ({ razorpayPaymentId }) => {
      setPlacingOrder(true);
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/orders/place-order`,
          buildOrderPayload(razorpayPaymentId)
        );
        setOrderSuccess(data);
        resetCheckout();
        toast.success("Payment successful! Order placed.");
      } catch (err) {
        toast.error(err.response?.data?.message || "Order creation failed after payment");
      } finally {
        setPlacingOrder(false);
      }
    },
    [buildOrderPayload, resetCheckout]
  );

  const handlePaymentFailure = useCallback(({ message }) => {
    toast.error(message || "Payment failed. Please try again.");
  }, []);

  // ── Guards ────────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="flex items-center justify-center py-24 px-4">
          <div className="bg-white max-w-sm w-full rounded-2xl border p-8 text-center shadow-sm">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Login Required</h2>
            <p className="mt-2 text-sm text-gray-500">Please login to continue checkout.</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full bg-[#00395F] hover:bg-[#FF8617] text-white py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <OrderSuccessScreen data={orderSuccess} onContinue={() => navigate("/orders")} />
    );
  }

  if (loading && checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <CheckoutSkeleton />
      </div>
    );
  }

  if (error || (!loading && checkoutItems.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="flex items-center justify-center py-24 px-4">
          <div className="bg-white max-w-sm w-full rounded-2xl border p-8 text-center shadow-sm">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-800">
              {error || "Nothing to checkout"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {error
                ? "Please go back and try again."
                : "Your cart is empty or the product is no longer available."}
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="mt-5 w-full bg-[#00395F] hover:bg-[#FF8617] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canCheckout = !!selectedAddress && !placingOrder;
  const sellerGroups = groupBySeller(checkoutItems);
  const groupCount = Object.keys(sellerGroups).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white border border-transparent hover:border-gray-200 transition-all text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {mode === "buy_now"
                ? "Direct purchase"
                : `${checkoutItems.length} item${checkoutItems.length !== 1 ? "s" : ""} from cart`}
              {groupCount > 1 && ` · ${groupCount} seller groups`}
            </p>
          </div>
        </div>

        {/* Steps indicator — compact, left-aligned */}
        <div className="flex items-center gap-1.5 mb-6">
          <StepPill
            icon={<MapPin className="w-3 h-3" />}
            label="Address"
            active={!selectedAddress}
            done={!!selectedAddress}
          />
          <div className="w-6 h-px bg-gray-300" />
          <StepPill
            icon={<CreditCard className="w-3 h-3" />}
            label="Payment"
            active={!!selectedAddress}
            done={false}
          />
          <div className="w-6 h-px bg-gray-300" />
          <StepPill
            icon={<CheckCircle2 className="w-3 h-3" />}
            label="Confirm"
            active={false}
            done={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT: Address + Items + Notes */}
          <div className="lg:col-span-2 space-y-5">

            {/* Address Section — no outside label, section owns its own header */}
            <CheckoutAddressSection onAddressSelect={setSelectedAddress} />

            {/* Items grouped by seller */}
            {Object.entries(sellerGroups).map(([sellerId, items]) => (
              <SellerItemGroup
                key={sellerId}
                sellerId={sellerId}
                items={items}
                groupCount={groupCount}
              />
            ))}

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order Notes{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special instructions, preferred delivery time, etc."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#00395F]/20 focus:border-[#00395F] transition-all"
              />
            </div>
          </div>

          {/* RIGHT: Summary + Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
                <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {checkoutItems.length} item{checkoutItems.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-[13px]">
                <PriceLine label="Subtotal" value={fmt(pricing.subtotal)} />
                {pricing.discount > 0 && (
                  <PriceLine label="Discount" value={`− ${fmt(pricing.discount)}`} green />
                )}
                <PriceLine label="GST" value={fmt(pricing.gst)} />
                {pricing.extraTax > 0 && (
                  <PriceLine label="Extra Tax" value={fmt(pricing.extraTax)} />
                )}
                <PriceLine
                  label="Shipping"
                  value={pricing.shipping === 0 ? "Free" : fmt(pricing.shipping)}
                  green={pricing.shipping === 0}
                />
              </div>

              <div className="border-t border-gray-100 my-4" />

              <div className="flex items-end justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Total
                </span>
                <div className="text-right">
                  {pricing.discount > 0 && (
                    <p className="text-xs text-gray-400 line-through italic mb-0.5">
                      {fmt(pricing.grandTotal + pricing.discount)}
                    </p>
                  )}
                  <p className="text-xl font-bold text-gray-900">
                    {fmt(pricing.grandTotal)}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Payment Method
                </p>

                {/* COD threshold notice */}
                {!showCOD && (
                  <p className="mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Orders above {fmt(COD_THRESHOLD)} require online payment.
                  </p>
                )}

                <div className="space-y-2">
                  {showCOD && (
                    <PaymentOption
                      id="cod"
                      label="Cash on Delivery"
                      sublabel="Pay when your order arrives"
                      icon={<Truck className="w-4 h-4" />}
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                  )}
                  <PaymentOption
                    id="rzrpay"
                    label="Pay Online"
                    sublabel="UPI, Cards, Net Banking"
                    icon={<CreditCard className="w-4 h-4" />}
                    checked={paymentMethod === "Rzrpay"}
                    onChange={() => setPaymentMethod("Rzrpay")}
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5">
                {paymentMethod === "COD" ? (
                  <button
                    onClick={placeCODOrder}
                    disabled={!canCheckout}
                    className="w-full h-11 rounded-xl bg-[#00395F] hover:bg-[#FF8617] text-white text-sm font-semibold
                      transition-colors duration-200 flex items-center justify-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {placingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Placing Order…
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Place Order · {fmt(pricing.grandTotal)}
                      </>
                    )}
                  </button>
                ) : (
                  <RazorpayPayment
                    amount={pricing.grandTotal}
                    customerData={{
                      fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
                      email: user?.email || "",
                      phone: user?.phone || "",
                    }}
                    orderMeta={{
                      description: mode === "buy_now" ? "Buy Now Order" : "Cart Order",
                      userId: user?._id,
                    }}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                    disabled={!canCheckout || placingOrder}
                    className="w-full h-11 rounded-xl text-sm font-semibold"
                    label={`Pay ${fmt(pricing.grandTotal)}`}
                  />
                )}

                {!selectedAddress && (
                  <p className="mt-2 text-center text-xs text-amber-600 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Select a delivery address to continue
                  </p>
                )}
              </div>

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Best Price
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * StepPill — compact, left-aligned (no flex-1 stretching)
 */
const StepPill = ({ icon, label, active, done }) => (
  <div
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors whitespace-nowrap
      ${done
        ? "bg-green-50 border-green-200 text-green-700"
        : active
          ? "bg-[#00395F]/10 border-[#00395F]/20 text-[#00395F]"
          : "bg-gray-50 border-gray-200 text-gray-400"
      }`}
  >
    {icon}
    {label}
  </div>
);

const PriceLine = ({ label, value, green = false }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500">{label}</span>
    <span className={green ? "text-green-600 font-medium" : "text-gray-800 font-medium"}>
      {value}
    </span>
  </div>
);

const PaymentOption = ({ id, label, sublabel, icon, checked, onChange }) => (
  <label
    htmlFor={id}
    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
      ${checked ? "border-[#00395F] bg-[#00395F]/5" : "border-gray-200 hover:border-gray-300"}`}
  >
    <input
      id={id}
      type="radio"
      checked={checked}
      onChange={onChange}
      className="accent-[#00395F]"
    />
    <span className={checked ? "text-[#00395F]" : "text-gray-400"}>{icon}</span>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium ${checked ? "text-[#00395F]" : "text-gray-700"}`}>
        {label}
      </p>
      <p className="text-[11px] text-gray-400 mt-0.5">{sublabel}</p>
    </div>
  </label>
);

const SellerItemGroup = ({ sellerId, items, groupCount }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/60">
      <ShoppingBag className="w-3.5 h-3.5 text-gray-500" />
      <span className="text-xs font-semibold text-gray-600">
        {groupCount > 1
          ? sellerId === "admin"
            ? "Sold by Panda Machines"
            : `Seller · ${sellerId.slice(-6).toUpperCase()}`
          : "Items in this order"}
      </span>
    </div>
    <div className="divide-y divide-gray-50">
      {items.map((item) => (
        <CheckoutItemRow key={item._id} item={item} />
      ))}
    </div>
  </div>
);

const CheckoutItemRow = ({ item }) => {
  const product = item.product || item;
  return (
    <div className="flex gap-3 px-5 py-4">
      <img
        src={item.image || product?.images?.[0]}
        alt={item.name}
        className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {item.name}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
          <span>Qty: {item.quantity}</span>
          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
        </div>
        <p className="text-sm font-semibold text-[#00395F] mt-1.5">
          {`₹${Number(item.price * item.quantity || 0).toLocaleString("en-IN")}`}
        </p>
      </div>
    </div>
  );
};

// ─── Success Screen ───────────────────────────────────────────────────────────

const OrderSuccessScreen = ({ data, onContinue }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <UserNavbar />
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Order Placed!</h2>
        <p className="text-sm text-gray-500 mt-2">
          Your order has been received and is being processed.
        </p>
        <div className="mt-5 bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Group Order ID</span>
            <span className="font-mono font-semibold text-gray-800">{data.groupOrderId}</span>
          </div>
          {data.totalOrders > 1 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Seller Groups</span>
              <span className="font-semibold text-gray-800">{data.totalOrders}</span>
            </div>
          )}
        </div>
        <button
          onClick={onContinue}
          className="mt-6 w-full bg-[#00395F] hover:bg-[#FF8617] text-white py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          View My Orders
        </button>
      </div>
    </div>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CheckoutSkeleton = () => (
  <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 animate-pulse">
    <div className="h-7 w-36 bg-gray-200 rounded-lg mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-white rounded-2xl border h-40" />
        <div className="bg-white rounded-2xl border h-52" />
      </div>
      <div className="bg-white rounded-2xl border h-80" />
    </div>
  </main>
);

export default CheckoutPage;