import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Trash2
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import AllUserFooter from "../../components/common/AllUserFooter";
import UserNavbar from "../../components/common/UserNavbar";

import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const formatPrice = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const Cart = () => {
  const navigate = useNavigate();



  const {
    cartItems,
    cartCount,
    cartTotals,
    loading,

    updateCartItemQuantity,
    removeFromCart,
  } = useCart();

  const { isLoggedIn } = useAuth();
  const { openAuthModal } = useApp();

  const [updatingItems, setUpdatingItems] = useState(new Set());

  // update qty

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const updateQuantity = useCallback(
    async (item, newQty) => {
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

      setUpdatingItems((prev) =>
        new Set(prev).add(item._id)
      );

      const res = await updateCartItemQuantity({
        productId: item.productId,
        quantity: newQty,
        selectedSize: item.selectedSize,
      });

      if (!res.success) {
        toast.error("Failed to update quantity");
      }

      setUpdatingItems((prev) => {
        const updated = new Set(prev);
        updated.delete(item._id);
        return updated;
      });
    },
    [updateCartItemQuantity]
  );

  // remove item

  const removeItem = useCallback(
    async (item) => {
      const res = await removeFromCart({
        productId: item.productId,
        selectedSize: item.selectedSize,
      });

      if (res.success) {
        toast.success(`"${item.name}" removed`);
      } else {
        toast.error("Failed to remove item");
      }
    },
    [removeFromCart]
  );

  // not logged in

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserNavbar />

        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-9 h-9 text-orange-500" />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Sign in to view your cart
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              Login to access your saved items and checkout.
            </p>

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

  // loading

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserNavbar />

        <CartSkeletonLoader />

        <AllUserFooter />
      </div>
    );
  }

  // empty

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserNavbar />

        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingCart className="w-11 h-11 text-orange-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h2>

            <p className="text-gray-500 text-sm mb-7">
              Looks like you haven't added anything yet.
            </p>

            <button
              onClick={() => navigate("/categories")}
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-5 sm:py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Shopping Cart
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {cartCount} item
              {cartCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          <button
            onClick={() => navigate("/categories")}
            className="hidden sm:flex items-center gap-2 text-sm text-gray-500 hover:text-[#00395F]"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-5">
          {/* left */}

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {cartItems.map((item) => (
                <CartRow
                  key={item._id}
                  item={item}
                  isUpdating={updatingItems.has(item._id)}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>

          {/* right */}
          <CartSummaryCard
            cartTotals={cartTotals}
            cartCount={cartCount}
            navigate={navigate}
          />
        </div>
      </main>

      <AllUserFooter />
    </div>
  );
};
const CartSummaryCard = ({ cartTotals, cartCount, navigate }) => {
  return (
    <div className="w-full xl:w-[360px] flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 xl:sticky xl:top-24">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 capitalize">Order summary</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {cartCount} item{cartCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
            <Package className="w-3 h-3" />
            Secure checkout
          </div>
        </div>

        <div className="border-t border-gray-100 my-4" />

        {/* Line items */}
        <div className="space-y-2.5">
          <SummaryRow label="Subtotal" value={formatPrice(cartTotals.subtotal)} />
          {cartTotals.discount > 0 && (
            <SummaryRow label="Discount" value={`− ${formatPrice(cartTotals.discount)}`} positive />
          )}
          <SummaryRow label="GST" value={formatPrice(cartTotals.gst)} />
          {cartTotals.extraTax > 0 && (
            <SummaryRow label="Extra charges" value={formatPrice(cartTotals.extraTax)} />
          )}
          <SummaryRow
            label="Shipping"
            value={cartTotals.shipping === 0 ? "Free" : formatPrice(cartTotals.shipping)}
            positive={cartTotals.shipping === 0}
          />
        </div>

        <div className="border-t border-gray-100 my-4" />

        {/* Total */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total</p>

          </div>
          <div className="text-right">
            {cartTotals.discount > 0 && (
              <p className="text-xs text-gray-400 italic line-through mb-1">
                {formatPrice(cartTotals.total + cartTotals.discount)}
              </p>
            )}
            <p className="text-lg font-medium text-gray-900 leading-none">
              {formatPrice(cartTotals.total)}
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/checkout/cart")}
          className="w-full mt-5 h-11 rounded-lg active:scale-[0.98] bg-primaryBtnColor hover:bg-[#FF8617] text-white text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Proceed to checkout
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
// row
const SummaryRow = ({
  label,
  value,
  positive = false,
}) => (
  <div className="flex items-center justify-between text-[13px]">
    <span className="text-gray-500">
      {label}
    </span>

    <span
      className={`font-medium ${positive
        ? "text-green-600"
        : "text-gray-800"
        }`}
    >
      {value}
    </span>
  </div>
);
const CartRow = React.memo(
  ({
    item,
    isUpdating,
    onUpdateQuantity,
    onRemove,
    navigate
  }) => {
    return (
      <div className="p-3 sm:p-4 border-b border-gray-100 last:border-b-0">
        <div
          onClick={() => navigate(`/user-product-details/${item?.productId}`)}
          className="flex gap-3 cursor-pointer">
          {/* image */}

          <div className="w-[90px]  sm:w-[110px] flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full aspect-square object-cover rounded-lg border border-gray-100"
            />
          </div>

          {/* content */}

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* top */}

            <div className="flex justify-between gap-3">
              {/* left */}

              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px]  sm:text-sm font-medium text-gray-800 leading-snug line-clamp-2">
                  {item.name}
                </p>

                {item.selectedSize && (
                  <p className="text-xs text-gray-400 mt-1">
                    Size: {item.selectedSize}
                  </p>
                )}

                <p className="text-sm sm:text-base font-semibold text-[#00395F] mt-2">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* right */}

              <div className="text-right flex-shrink-0">
                <p className="text-sm sm:text-base font-bold text-gray-900">
                  {formatPrice(
                    item.price * item.quantity
                  )}
                </p>
              </div>
            </div>

            {/* bottom */}

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between mt-4 gap-3">
              <QuantityControl
                item={item}
                isUpdating={isUpdating}
                onUpdate={onUpdateQuantity}
              />

              <button
                onClick={() => onRemove(item)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
);

// qty

const QuantityControl = React.memo(
  ({
    item,
    isUpdating,
    onUpdate,
  }) => (
    <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() =>
          onUpdate(item, item.quantity - 1)
        }
        disabled={isUpdating}
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-gray-200">
        {item.quantity}
      </span>

      <button
        onClick={() =>
          onUpdate(item, item.quantity + 1)
        }
        disabled={isUpdating}
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
);


export default Cart;
const CartSkeletonLoader = () => {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-5 sm:py-8 animate-pulse">

      {/* heading */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="h-7 w-44 bg-gray-200 rounded-md" />
          <div className="h-4 w-28 bg-gray-100 rounded mt-2" />
        </div>

        <div className="hidden sm:block h-4 w-36 bg-gray-100 rounded" />
      </div>

      <div className="flex flex-col xl:flex-row gap-5">

        {/* LEFT */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            {[1, 2].map((_, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex gap-3">

                  {/* image */}
                  <div className="w-[90px] sm:w-[110px] flex-shrink-0">
                    <div className="w-full aspect-square rounded-lg bg-gray-200" />
                  </div>

                  {/* content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">

                    {/* top */}
                    <div className="flex justify-between gap-3">

                      {/* left */}
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded w-[85%]" />

                        <div className="h-4 bg-gray-100 rounded w-[60%] mt-2" />

                        <div className="h-5 bg-gray-200 rounded w-24 mt-4" />
                      </div>

                      {/* total */}
                      <div className="flex-shrink-0">
                        <div className="h-5 w-20 bg-gray-200 rounded" />
                      </div>
                    </div>

                    {/* bottom */}
                    <div className="flex items-center justify-between mt-5">

                      {/* qty */}
                      <div className="h-9 w-28 bg-gray-100 rounded-lg" />

                      {/* delete */}
                      <div className="h-5 w-5 rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full xl:w-[360px] flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 xl:sticky xl:top-24">

            {/* header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-100 rounded mt-2" />
              </div>

              <div className="h-7 w-28 bg-gray-100 rounded-full" />
            </div>

            <div className="border-t border-gray-100 my-4" />

            {/* rows */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 my-4" />

            {/* total */}
            <div className="flex items-end justify-between">
              <div>
                <div className="h-3 w-12 bg-gray-100 rounded" />
              </div>

              <div>
                <div className="h-6 w-28 bg-gray-200 rounded" />
              </div>
            </div>

            {/* button */}
            <div className="h-11 w-full bg-gray-200 rounded-lg mt-5" />
          </div>
        </div>
      </div>
    </main>
  );
};