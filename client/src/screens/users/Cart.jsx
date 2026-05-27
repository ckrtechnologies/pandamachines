import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

const API = process.env.REACT_APP_API_URL;

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, loading, setCartItems } = useCart();
  const { isLoggedIn } = useAuth();
  const { openAuthModal } = useApp();

  const [updatingItems, setUpdatingItems] = useState(new Set());

  // ── Totals ──────────────────────────────────────────
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = cartItems.reduce((s, i) => s + (i.shippingCharge || 0) * i.quantity, 0);
    const gst = cartItems.reduce((s, i) => s + (i.price * i.quantity * (i.gstPercentage || 0)) / 100, 0);
    const extraTax = cartItems.reduce((s, i) => s + (i.price * i.quantity * (i.extraTaxPercentage || 0)) / 100, 0);
    return { subtotal, shipping, gst, extraTax, total: subtotal + shipping + gst + extraTax };
  }, [cartItems]);

  // ── Update quantity (optimistic, uses cart item `id`) ──
  const updateQuantity = useCallback(async (item, newQty) => {
    // If decrementing from 1 → confirm remove
    if (newQty < 1) {
      const result = await Swal.fire({
        title: "Remove item?",
        text: `Remove "${item.name}" from your cart?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF8617",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Remove",
        cancelButtonText: "Keep",
      });
      if (!result.isConfirmed) return;
      return removeItem(item);
    }

    const prevItems = [...cartItems];
    setCartItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
    );
    setUpdatingItems((prev) => new Set(prev).add(item.id));

    try {
      await axios.patch(`${API}/cart/items/${item.id}`, { quantity: newQty });
    } catch {
      setCartItems(prevItems);
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => { const s = new Set(prev); s.delete(item.id); return s; });
    }
  }, [cartItems]);

  // ── Remove item (optimistic) ──────────────────────
  const removeItem = useCallback(async (item) => {
    const prevItems = [...cartItems];
    setCartItems((prev) => prev.filter((i) => i.id !== item.id));
    toast.success(`"${item.name}" removed`);

    try {
      await axios.delete(`${API}/cart/items/${item.id}`);
    } catch {
      setCartItems(prevItems);
      toast.error("Failed to remove item");
    }
  }, [cartItems]);

  // ── Not logged in ──────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-9 h-9 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to view your cart</h2>
            <p className="text-gray-500 text-sm mb-6">Login to access your saved items and checkout.</p>
            <button
              onClick={() => openAuthModal("login")}
              className="bg-[#00395F] hover:bg-[#FF8617] text-white font-semibold py-2.5 px-8 rounded-lg transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </div>
        <AllUserFooter />
      </div>
    );
  }

  // ── Loading skeleton ───────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserNavbar />
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
          <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-[3] space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 flex gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-8 bg-gray-200 rounded w-28 mt-2" />
                  </div>
                  <div className="h-5 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
            <div className="flex-[2] h-64 bg-white rounded-xl animate-pulse" />
          </div>
        </div>
        <AllUserFooter />
      </div>
    );
  }

  // ── Empty cart ─────────────────────────────────────
  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingCart className="w-11 h-11 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-7">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-[#00395F] hover:bg-[#FF8617] text-white font-semibold py-2.5 px-8 rounded-lg transition-colors duration-200"
            >
              Browse Products
            </button>
          </div>
        </div>
        <AllUserFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#00395F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Left: Cart Items (3/5) ── */}
          <div className="flex-[3] min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Table header — desktop only */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
                <span className="col-span-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</span>
                <span className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Price</span>
                <span className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Quantity</span>
                <span className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total</span>
              </div>

              <div className="divide-y divide-gray-50">
                {cartItems.map((item) => (
                  <CartRow
                    key={item.id}
                    item={item}
                    isUpdating={updatingItems.has(item.id)}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* Mobile continue shopping */}
            <button
              onClick={() => navigate("/products")}
              className="sm:hidden mt-4 flex items-center gap-1.5 text-sm text-gray-500"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>

          {/* ── Right: Order Summary (2/5) ── */}
          <div className="flex-[2] min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FF8617]" />
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-medium text-gray-900">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${totals.shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {totals.shipping === 0 ? "Free" : `₹${totals.shipping.toFixed(2)}`}
                  </span>
                </div>
                {totals.gst > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>GST</span>
                    <span className="font-medium text-gray-900">₹{totals.gst.toFixed(2)}</span>
                  </div>
                )}
                {totals.extraTax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Extra Tax</span>
                    <span className="font-medium text-gray-900">₹{totals.extraTax.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-[#00395F]">₹{totals.total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => {
                  if (localStorage.getItem("buy-now-product")) {
                    localStorage.removeItem("buy-now-product");
                  }
                  navigate("/checkout");
                }}
                className="w-full mt-5 bg-[#00395F] hover:bg-[#FF8617] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Proceed to Checkout
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                Secure checkout · No hidden fees
              </p>
            </div>
          </div>
        </div>
      </main>

      <AllUserFooter />
    </div>
  );
};

// ── Cart Row ──────────────────────────────────────────
const CartRow = React.memo(({ item, isUpdating, onUpdateQuantity, onRemove }) => (
  <div className="px-4 sm:px-5 py-4">
    {/* Mobile layout */}
    <div className="flex gap-3 sm:hidden">
      <img
        src={item.image}
        alt={item.name}
        className="w-18 h-18 w-[72px] h-[72px] object-cover rounded-lg border border-gray-100 flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 mb-1">{item.name}</p>
        <p className="text-sm font-bold text-[#00395F] mb-2">₹{item.price.toFixed(2)}</p>
        <div className="flex items-center justify-between">
          <QuantityControl item={item} isUpdating={isUpdating} onUpdate={onUpdateQuantity} />
          <button
            onClick={() => onRemove(item)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    {/* Desktop layout */}
    <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
      <div className="col-span-6 flex items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{item.name}</p>
          {item.measurement && (
            <p className="text-xs text-gray-400 mt-0.5">{item.measurement}</p>
          )}
        </div>
      </div>
      <div className="col-span-2 text-center">
        <span className="text-sm text-gray-700">₹{item.price.toFixed(2)}</span>
      </div>
      <div className="col-span-3 flex justify-center">
        <QuantityControl item={item} isUpdating={isUpdating} onUpdate={onUpdateQuantity} />
      </div>
      <div className="col-span-1 flex items-center justify-end gap-2">
        <span className="text-sm font-semibold text-gray-900">
          ₹{(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => onRemove(item)}
          className="text-gray-300 hover:text-red-500 transition-colors ml-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

// ── Quantity Control ──────────────────────────────────
const QuantityControl = React.memo(({ item, isUpdating, onUpdate }) => (
  <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
    <button
      onClick={() => onUpdate(item, item.quantity - 1)}
      disabled={isUpdating}
      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#00395F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      <Minus className="w-3.5 h-3.5" />
    </button>
    <span className="w-9 text-center text-sm font-semibold text-gray-800 border-x border-gray-200 h-8 flex items-center justify-center">
      {isUpdating ? (
        <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
      ) : (
        item.quantity
      )}
    </span>
    <button
      onClick={() => onUpdate(item, item.quantity + 1)}
      disabled={isUpdating}
      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#00395F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      <Plus className="w-3.5 h-3.5" />
    </button>
  </div>
));

export default Cart;