import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BedsCarousel from "../../components/common/BedsCarousel";
import UserNavbar from "../../components/common/UserNavbar";
import CheckoutSkeleton from "../../components/UserSideComponents/Order/CheckOutSkeleton";
import SelectAddressModal from "../../components/UserSideComponents/Order/SelectAddressModal";
import RazorpayForOrder from "../../utils/RazorpayForOrder";

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
  const [productData, setProductData] = useState(null);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    const buyNowProduct = localStorage.getItem("buy-now-product");
    if (buyNowProduct) {
      setProductData(JSON.parse(buyNowProduct));
      setIsBuyNow(true);
      setLoading(false);
    } else {
      fetchUserCart();
    }
  }, []);

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

      let orderData;

      if (isBuyNow) {
        // Handle Buy Now order
        if (!productData) {
          throw new Error("No product data found.");
        }

        orderData = {
          userId: userData._id,
          products: [
            {
              product: productData.product._id,
              quantity: productData.quantity,
              measurement: productData.measurement,
              variantModel: productData.selectedVariant?.model,
            },
          ],
          shippingAddress: selectedAddressId,
          paymentMethod: formData.paymentMethod,
        };
      } else {
        // Handle regular cart order
        if (!cartData || !cartData.items || cartData.items.length === 0) {
          throw new Error("Your cart is empty.");
        }

        const products = cartData.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          measurement: item.measurement,
          variantModel: item.variantModel,
        }));

        orderData = {
          userId: userData._id,
          products: products,
          shippingAddress: selectedAddressId,
          paymentMethod: formData.paymentMethod,
        };
      }

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

      // Clear buy-now-product from localStorage if it exists
      if (isBuyNow) {
        localStorage.removeItem("buy-now-product");
      } else {
        // Clear cart only for regular orders
        try {
          await clearUserCart(userData._id);
          setCartData({ items: [] });
        } catch (cartError) {
          console.error(
            "Failed to clear cart after order placement:",
            cartError
          );
        }
      }

      Swal.fire({
        title: "Order placed successfully!",
        text: isBuyNow
          ? "Your product has been ordered."
          : "Your cart has been cleared.",
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

    // Check if Razorpay payment is selected
    if (formData.paymentMethod === "Rzrpay") {
      setShowRazorpay(true);
    } else {
      // For cash on delivery, proceed with normal order placement
      placeOrder();
    }
  };

  // Razorpay success handler
  const handleRazorpaySuccess = (response) => {
    console.log("Razorpay payment successful:", response);
    // After successful payment, place the order
    placeOrder();
    setShowRazorpay(false);
  };

  // Razorpay failure handler
  const handleRazorpayFailure = (error) => {
    console.error("Razorpay payment failed:", error);
    setShowRazorpay(false);
    setIsPlacingOrder(false);

    Swal.fire({
      title: "Payment Failed!",
      text: error.message || "Payment was unsuccessful. Please try again.",
      icon: "error",
      draggable: true,
    });
  };

  // Razorpay close handler
  const handleRazorpayClose = () => {
    setShowRazorpay(false);
    setIsPlacingOrder(false);
  };

  // Helper to get effective price for Buy Now
  const getBuyNowPrice = () => {
    const prod = productData?.product;
    if (!prod) return 0;

    if (productData.selectedVariant) {
      return Number(productData.selectedVariant.price) || 0;
    }

    if (prod.size_type === "multiple" && productData.measurement) {
      // Find price by measurement label
      const measuredPrice = prod.price_by_measurement?.[0]?.allPrice?.find(
        (p) => p.measurement === productData.measurement
      );
      if (measuredPrice) return Number(measuredPrice.price) || 0;
    }

    return Number(prod.price) || 0;
  };

  // Helper to get effective price for cart items
  const getCartItemPrice = (item) => {
    const prod = item?.product;
    if (!prod) return 0;

    if (item.variantModel) {
      const variant = prod.variants?.find((v) => v.model === item.variantModel);
      if (variant) return Number(variant.price) || 0;
    }

    if (prod.size_type === "multiple" && item.measurement) {
      const measuredPrice = prod.price_by_measurement?.[0]?.allPrice?.find(
        (p) => p.measurement === item.measurement
      );
      if (measuredPrice) return Number(measuredPrice.price) || 0;
    }

    return Number(prod.price) || 0;
  };

  // Calculate functions for Buy Now product
  const calculateBuyNowSubtotal = () => {
    if (!productData) return 0;
    const price = Number(getBuyNowPrice()) || 0;
    const quantity = Number(productData.quantity) || 0;
    return price * quantity;
  };

  const calculateBuyNowShipping = () => {
    if (!productData || !productData.product) return 0;
    const shippingCharge = Number(productData.product.shippingCharge) || 0;
    const quantity = Number(productData.quantity) || 0;
    return shippingCharge * quantity;
  };

  const calculateBuyNowGST = () => {
    if (!productData || !productData.product) return 0;
    const price = Number(getBuyNowPrice()) || 0;
    const quantity = Number(productData.quantity) || 0;
    const gstPercentage = Number(productData.product.gstPercentage) || 0;
    return (price * quantity * gstPercentage) / 100;
  };

  const calculateBuyNowExtraTax = () => {
    if (!productData || !productData.product) return 0;
    const price = Number(getBuyNowPrice()) || 0;
    const quantity = Number(productData.quantity) || 0;
    const extraTaxPercentage = Number(productData.product.extraTaxPercentage) || 0;
    return (price * quantity * extraTaxPercentage) / 100;
  };

  const calculateBuyNowTotal = () => {
    const subtotal = Number(calculateBuyNowSubtotal()) || 0;
    const shipping = Number(calculateBuyNowShipping()) || 0;
    const gst = Number(calculateBuyNowGST()) || 0;
    const extraTax = Number(calculateBuyNowExtraTax()) || 0;
    return Number((subtotal + shipping + gst + extraTax).toFixed(2));
  };

  // Calculate functions for Cart products
  const calculateSubtotal = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => {
      const price = Number(getCartItemPrice(item)) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const calculateShipping = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => {
      const shippingCharge = Number(item.product?.shippingCharge) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (shippingCharge * quantity);
    }, 0);
  };

  const calculateGST = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => {
      const price = Number(getCartItemPrice(item)) || 0;
      const quantity = Number(item.quantity) || 0;
      const gstPercentage = Number(item.product?.gstPercentage) || 0;
      return total + (price * quantity * gstPercentage) / 100;
    }, 0);
  };

  const calculateExtraTax = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => {
      const price = Number(getCartItemPrice(item)) || 0;
      const quantity = Number(item.quantity) || 0;
      const extraTaxPercentage = Number(item.product?.extraTaxPercentage) || 0;
      return total + (price * quantity * extraTaxPercentage) / 100;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = Number(calculateSubtotal()) || 0;
    const shipping = Number(calculateShipping()) || 0;
    const gst = Number(calculateGST()) || 0;
    const extraTax = Number(calculateExtraTax()) || 0;
    return Number((subtotal + shipping + gst + extraTax).toFixed(2));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const isOrderValid = () => {
    if (isBuyNow) {
      return productData && selectedAddressId && !isPlacingOrder;
    } else {
      return (
        cartData &&
        cartData.items &&
        cartData.items.length > 0 &&
        selectedAddressId &&
        !isPlacingOrder
      );
    }
  };

  // Prepare customer data for Razorpay
  const getCustomerData = () => {
    const userData = getUserData();
    return {
      fullName: userData?.name || "Customer",
      email: userData?.email || "customer@example.com",
      mobileNumber: userData?.phone || "9999999999",
      address: selectedAddressId || "Address not selected",
      product: isBuyNow ? productData?.product?.name : "Cart Items",
    };
  };

  // Prepare booking data for Razorpay (simplified for order context)
  const getBookingData = () => {
    return {
      discussionTime: "Product Order",
      category: "E-commerce Order",
      orderType: isBuyNow ? "buy_now" : "cart_order",
      // Add any other fields your order system needs
    };
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
            onClick={isBuyNow ? () => navigate("/") : fetchUserCart}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            {isBuyNow ? "Go to Home" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <UserNavbar />
      <BedsCarousel />

      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SelectAddressModal onAddressSelect={handleAddressSelect} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {isBuyNow ? (
                  productData ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          className="h-full w-full object-cover"
                          src={productData.product.images[0]}
                          alt={productData.product.name}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {productData.product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          x{productData.quantity}
                        </p>
                        <p className="text-xs text-gray-400">
                          {productData.measurement || productData.product.measurement}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {(() => {
                          const basePrice = Number(getBuyNowPrice()) || 0;
                          const quantity = Number(productData.quantity) || 0;
                          const gstP = Number(productData.product?.gstPercentage) || 0;
                          const gst = (basePrice * gstP) / 100;
                          return formatPrice((basePrice + gst) * quantity);
                        })()}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No product found
                    </div>
                  )
                ) : cartData && cartData.items && cartData.items.length > 0 ? (
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
                          {item.measurement || item.product.measurement}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {(() => {
                           const basePrice = Number(getCartItemPrice(item)) || 0;
                           const quantity = Number(item.quantity) || 0;
                           const gstP = Number(item.product?.gstPercentage) || 0;
                           const gst = (basePrice * gstP) / 100;
                           return formatPrice((basePrice + gst) * quantity);
                        })()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Your cart is empty
                  </div>
                )}
              </div>

              {(isBuyNow && productData) ||
              (cartData && cartData.items && cartData.items.length > 0) ? (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>
                      {formatPrice(
                        isBuyNow
                          ? calculateBuyNowSubtotal()
                          : calculateSubtotal()
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>
                      {formatPrice(
                        isBuyNow
                          ? calculateBuyNowShipping()
                          : calculateShipping()
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST:</span>
                    <span>
                      {formatPrice(
                        isBuyNow ? calculateBuyNowGST() : calculateGST()
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Extra Tax:</span>
                    <span>
                      {formatPrice(
                        isBuyNow
                          ? calculateBuyNowExtraTax()
                          : calculateExtraTax()
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>
                      {formatPrice(
                        isBuyNow ? calculateBuyNowTotal() : calculateTotal()
                      )}
                    </span>
                  </div>
                </div>
              ) : null}

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

              {/* Show Razorpay Payment Component or Place Order Button */}
              {showRazorpay && formData.paymentMethod === "Rzrpay" ? (
                <div className="mt-6">
                  <RazorpayForOrder
                    amount={
                      isBuyNow ? calculateBuyNowTotal() : calculateTotal()
                    }
                    customerData={getCustomerData()}
                    bookingData={getBookingData()}
                    onSuccess={handleRazorpaySuccess}
                    onFailure={handleRazorpayFailure}
                    onClose={handleRazorpayClose}
                  />
                </div>
              ) : (
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
                  ) : formData.paymentMethod === "Rzrpay" ? (
                    "Proceed to Payment"
                  ) : (
                    "Place Order"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
