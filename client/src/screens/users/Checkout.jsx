import React, { useState, useEffect } from "react";
import { Home, ChevronRight } from "lucide-react";
import SelectAddressModal from "../../components/UserSideComponents/Order/SelectAddressModal";
import CheckoutSkeleton from "../../components/UserSideComponents/Order/CheckOutSkeleton";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import BedsCarousel from "../../components/common/BedsCarousel";

const Checkout = () => {
  const [formData, setFormData] = useState({
    paymentMethod: "cash",
  });
  const navigate = useNavigate();

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  const fetchUserCart = async () => {
    try {
      const userData = getUserData();
      if (!userData || !userData._id) {
        throw new Error("User not found. Please login first.");
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cart/get-users-cart/${userData._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }

      const data = await response.json();
      setCartData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const clearUserCart = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cart/clear-cart?userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      const result = await response.json();
      console.log("Cart cleared successfully:", result);
      return result;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const placeOrder = async () => {
    try {
      setIsPlacingOrder(true);
      const userData = getUserData();

      if (!userData || !userData._id) {
        throw new Error("User not found. Please login first.");
      }

      if (!selectedAddressId) {
        throw new Error("Please select a shipping address.");
      }

      if (!cartData || !cartData.items || cartData.items.length === 0) {
        throw new Error("Your cart is empty.");
      }

      const products = cartData.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const orderData = {
        userId: userData._id,
        products: products,
        shippingAddress: selectedAddressId,
        paymentMethod: formData.paymentMethod,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/place-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }
      const result = await response.json();
      console.log("Order placed successfully:", result);
      try {
        await clearUserCart(userData._id);
        setCartData({ items: [] });
      } catch (cartError) {
        console.error("Failed to clear cart after order placement:", cartError);
      }

      Swal.fire({
        title: "Order placed successfully!",
        text: "Your cart has been cleared.",
        icon: "success",
        confirmButtonText: "OK",
        draggable: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/user-orders");
        }
      });
    } catch (err) {
      console.error("Error placing order:", err);
      Swal.fire({
        title: "Error!",
        text: `Error placing order: ${err.message}`,
        icon: "error",
        draggable: true,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder();
  };

  const calculateSubtotal = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const calculateShipping = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => {
      const shippingCharge = item.product.shippingCharge || 0;
      return total + shippingCharge * item.quantity;
    }, 0);
  };

  const calculateGST = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => {
      const gstPercentage = item.product.gstPercentage || 0;
      return total + (item.product.price * item.quantity * gstPercentage) / 100;
    }, 0);
  };

  const calculateExtraTax = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => {
      const extraTaxPercentage = item.product.extraTaxPercentage || 0;
      return (
        total + (item.product.price * item.quantity * extraTaxPercentage) / 100
      );
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const gst = calculateGST();
    const extraTax = calculateExtraTax();
    return subtotal + shipping + gst + extraTax;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const isOrderValid = () => {
    return (
      cartData &&
      cartData.items &&
      cartData.items.length > 0 &&
      selectedAddressId &&
      !isPlacingOrder
    );
  };

  if (loading) {
    return (
      <div>
        <CheckoutSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
          <button
            onClick={fetchUserCart}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <BedsCarousel />
      {/* <header className="bg-slate-700 text-white">
        <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-orange-400">Checkout</span>
          </nav>
        </div>
      </header> */}

      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SelectAddressModal onAddressSelect={handleAddressSelect} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartData && cartData.items && cartData.items.length > 0 ? (
                  cartData.items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          className="h-full w-full object-cover"
                          src={item.product.images[0]}
                          alt={item.product.name}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          x{item.quantity}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.product.measurement}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Your cart is empty
                  </div>
                )}
              </div>

              {cartData && cartData.items && cartData.items.length > 0 && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>{formatPrice(calculateShipping())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST:</span>
                    <span>{formatPrice(calculateGST())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Extra Tax:</span>
                    <span>{formatPrice(calculateExtraTax())}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === "cash"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm">Cash on Delivery</span>
                  </label>

                  <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Rzrpay"
                      checked={formData.paymentMethod === "Rzrpay"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm">Pay now</span>
                  </label>
                </div>
              </div>

              {!selectedAddressId && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Please select a shipping address to continue
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!isOrderValid()}
                className={`w-full font-semibold py-3 px-4 rounded-lg mt-6 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  isOrderValid()
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } ${isPlacingOrder ? "opacity-70" : ""}`}
              >
                {isPlacingOrder ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Placing Order...
                  </div>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
