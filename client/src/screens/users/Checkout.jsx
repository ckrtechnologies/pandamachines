import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UserNavbar from "../../components/common/UserNavbar";

import CheckoutAddressSection from "../../components/UserSideComponents/Order/CheckoutAddressSection";

import RazorpayForOrder from "../../utils/RazorpayForOrder";
import { useCart } from "../../context/CartContext";


const CheckoutPage = () => {
  const navigate = useNavigate();

  const { productId } = useParams();

  const { buyNowItem, fetchCartData } = useCart();

  const [loading, setLoading] = useState(true);

  const [checkoutItems, setCheckoutItems] =
    useState([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [showRazorpay, setShowRazorpay] =
    useState(false);

  // =====================================
  // USER
  // =====================================

  const getUser = () => {
    const data = localStorage.getItem(
      "pm-user-data"
    );

    return data ? JSON.parse(data) : null;
  };

  const user = getUser();

  // =====================================
  // FETCH CHECKOUT DATA
  // =====================================

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setLoading(true);

        // BUY NOW FLOW
        if (productId) {
          if (buyNowItem) {
            setCheckoutItems([buyNowItem]);
          }
        }

        // CART FLOW
        else {
          const cart = await fetchCartData(true);

          setCheckoutItems(cart.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [productId]);

  // =====================================
  // TOTALS
  // =====================================

  const pricing = useMemo(() => {
    let subtotal = 0;
    let gst = 0;
    let extraTax = 0;
    let shipping = 0;

    checkoutItems.forEach((item) => {
      const product =
        item.product || item;

      const qty = item.quantity || 1;

      const price =
        Number(product.price) || 0;

      subtotal += price * qty;

      gst +=
        ((price *
          (product.gstPercentage || 0)) /
          100) *
        qty;

      extraTax +=
        ((price *
          (product.extraTaxPercentage ||
            0)) /
          100) *
        qty;

      shipping +=
        (product.shippingCharge || 0) *
        qty;
    });

    return {
      subtotal,
      gst,
      extraTax,
      shipping,
      grandTotal:
        subtotal +
        gst +
        extraTax +
        shipping,
    };
  }, [checkoutItems]);

  // =====================================
  // LOGIN PREVENTION
  // =====================================

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />

        <div className="flex items-center justify-center py-24 px-4">
          <div className="bg-white max-w-md w-full rounded-2xl border p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Login Required
            </h2>

            <p className="mt-3 text-sm text-gray-600">
              Please login first to continue
              checkout.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full bg-black text-white py-3 rounded-xl"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />

        <div className="p-10 text-center">
          Loading checkout...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2">
            <CheckoutAddressSection
              onAddressSelect={
                setSelectedAddressId
              }
            />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-2xl p-5 sticky top-24">

              <h2 className="text-xl font-bold mb-5">
                Order Summary
              </h2>

              {/* ITEMS */}
              <div className="space-y-4 max-h-[420px] overflow-y-auto">
                {checkoutItems.map((item, idx) => {
                  const product =
                    item.product || item;

                  return (
                    <div
                      key={idx}
                      className="flex gap-3"
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TOTALS */}
              <div className="border-t mt-6 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ₹{pricing.subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST</span>
                  <span>
                    ₹{pricing.gst.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Extra Tax</span>
                  <span>
                    ₹{pricing.extraTax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    ₹{pricing.shipping.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>

                  <span>
                    ₹
                    {pricing.grandTotal.toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">
                  Payment Method
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={
                        paymentMethod === "COD"
                      }
                      onChange={() =>
                        setPaymentMethod("COD")
                      }
                    />

                    <span>
                      Cash on Delivery
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={
                        paymentMethod ===
                        "Rzrpay"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          "Rzrpay"
                        )
                      }
                    />

                    <span>Pay Online</span>
                  </label>
                </div>
              </div>

              {/* CTA */}
              <button
                disabled={
                  !selectedAddressId ||
                  placingOrder
                }
                className="w-full mt-6 bg-black text-white py-3 rounded-xl disabled:opacity-50"
              >
                {paymentMethod === "Rzrpay"
                  ? "Proceed to Payment"
                  : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;