import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Home, ChevronRight, X, User, ShoppingCart } from "lucide-react";
import AllUserFooter from "../../components/common/AllUserFooter";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/common/UserNavbar";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from "../../utils/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const { cartCount, fetchCartCount } = useCart();

  const user = useMemo(() => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  }, []);

  const userId = user?._id;

  const fetchCartData = useCallback(async () => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart/get-users-cart/${userId}`,
        {
          timeout: 10000,
        }
      );

      if (response.data && response.data.items) {
        const transformedItems = response.data.items.map((item) => ({
          id: item._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          productId: item.product._id,
          gstPercentage: item.product.gstPercentage || 0,
          extraTaxPercentage: item.product.extraTaxPercentage || 0,
          shippingCharge: item.product.shippingCharge || 0,
        }));
        setCartItems(transformedItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);

      if (err.response && err.response.status === 404) {
        setCartItems([]);
        setError(null);
      } else if (err.code === "ECONNABORTED") {
        setError(
          "Request timed out. Please check your connection and try again."
        );
      } else {
        setError("Failed to fetch cart data");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateQuantity = useCallback(
    async (itemId, newQuantity) => {
      if (newQuantity < 1) return;

      const item = cartItems.find((item) => item.id === itemId);
      if (!item) return;

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      setUpdatingItems((prev) => new Set(prev).add(itemId));

      try {
        const requestData = {
          userId: userId,
          items: [
            {
              productId: item.productId,
              quantity: newQuantity,
            },
          ],
        };

        await axios.put(
          `${process.env.REACT_APP_API_URL}/cart/update-items`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 8000,
          }
        );
      } catch (err) {
        console.error("Error updating quantity:", err);

        setCartItems((prevItems) =>
          prevItems.map((cartItem) =>
            cartItem.id === itemId
              ? { ...cartItem, quantity: item.quantity }
              : cartItem
          )
        );

        Swal.fire({
          title: "Error!",
          text: "Failed to update quantity. Please try again.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      } finally {
        setUpdatingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    },
    [cartItems, userId]
  );

  const removeItem = useCallback(
    async (productId) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const originalItems = cartItems;
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );

        Swal.fire({
          title: "Removing item...",
          text: "Please wait while we remove the item from your cart.",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          await axios.delete(
            `${process.env.REACT_APP_API_URL}/cart/remove-cart-item`,
            {
              params: {
                userId: userId,
                productId: productId,
              },
              timeout: 8000,
            }
          );

          fetchCartCount();

          Swal.fire({
            title: "Deleted!",
            text: "Item has been removed from cart.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Error removing item:", err);
          setCartItems(originalItems);

          Swal.fire({
            title: "Error!",
            text: "Failed to remove item from cart.",
            icon: "error",
          });
        }
      }
    },
    [cartItems, userId, fetchCartCount]
  );

  const calculatedTotals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping = cartItems.reduce(
      (sum, item) => sum + item.shippingCharge * item.quantity,
      0
    );

    const gst = cartItems.reduce(
      (sum, item) =>
        sum + (item.price * item.quantity * item.gstPercentage) / 100,
      0
    );

    const extraTax = cartItems.reduce(
      (sum, item) =>
        sum + (item.price * item.quantity * item.extraTaxPercentage) / 100,
      0
    );

    const total = subtotal + shipping + gst + extraTax;

    return { subtotal, shipping, gst, extraTax, total };
  }, [cartItems]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-orange-50">
        <UserNavbar />
        <header className="bg-slate-700 text-white">
          <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span className="text-orange-400">Cart</span>
            </nav>
          </div>
        </header>
        <OptimizedCartSkeleton />
        <AllUserFooter />
      </div>
    );
  }

  // Only show error state for actual errors, not empty cart
  if (error && error !== "User not logged in") {
    return (
      <div className="min-h-screen flex flex-col bg-orange-50">
        <UserNavbar />
        <header className="bg-slate-700 text-white">
          <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span className="text-orange-400">Cart</span>
            </nav>
          </div>
        </header>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCartData}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded mr-4"
            >
              Retry
            </button>
          </div>
        </div>
        <AllUserFooter />
      </div>
    );
  }

  // Handle user not logged in
  if (error === "User not logged in") {
    return (
      <div className="min-h-screen flex flex-col bg-orange-50">
        <UserNavbar />
        <header className="bg-slate-700 text-white">
          <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span className="text-orange-400">Cart</span>
            </nav>
          </div>
        </header>
        <div className="flex-grow flex items-center justify-center py-8">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Please log in to view your cart
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded transition-colors"
            >
              Login
            </button>
          </div>
        </div>
        <AllUserFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-orange-50">
      <UserNavbar />
      <header className="bg-slate-700 text-white">
        <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-orange-400">Cart</span>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full mx-auto px-4 md:px-6 lg:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Shopping Cart</h1>
          {cartItems.length > 0 && (
            <span className="text-gray-600">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No Products Found in Cart
            </h2>
            <p className="text-gray-500 mb-6">
              Your cart is empty. Add some products to get started!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              {/* Mobile view */}
              <div className="lg:hidden space-y-4">
                {cartItems.map((item) => (
                  <CartItemMobile
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    isUpdating={updatingItems.has(item.id)}
                  />
                ))}
              </div>

              <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PRODUCT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PRICE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        QUANTITY
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SUBTOTAL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <CartItemDesktop
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeItem}
                        isUpdating={updatingItems.has(item.id)}
                      />
                    ))}
                  </tbody>
                </table>
                <div className="w-full h-px bg-gray-200"></div>
                <div className="flex justify-center p-4">
                  <button
                    onClick={() => navigate("/products")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
                  >
                    Return to shop
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:w-1/4">
              <CartSummary
                totals={calculatedTotals}
                onCheckout={() => navigate("/checkout")}
              />
            </div>
          </div>
        )}
      </main>
      <AllUserFooter />
    </div>
  );
};

const CartItemMobile = React.memo(
  ({ item, onUpdateQuantity, onRemoveItem, isUpdating }) => (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 object-cover rounded"
            loading="lazy"
          />
          <h3 className="font-semibold text-gray-900 tracking-wide">
            {item.name}
          </h3>
        </div>
        <button
          onClick={() => onRemoveItem(item.productId)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <span className="font-bold">₹{item.price.toFixed(2)}</span>
        <QuantityControl
          quantity={item.quantity}
          onUpdateQuantity={(newQuantity) =>
            onUpdateQuantity(item.id, newQuantity)
          }
          isUpdating={isUpdating}
        />
        <span className="font-bold text-right">
          ₹{(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  )
);

const CartItemDesktop = React.memo(
  ({ item, onUpdateQuantity, onRemoveItem, isUpdating }) => (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-20 object-cover rounded"
            loading="lazy"
          />
          <div className="text-sm font-medium text-gray-900">{item.name}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">₹{item.price.toFixed(2)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <QuantityControl
          quantity={item.quantity}
          onUpdateQuantity={(newQuantity) =>
            onUpdateQuantity(item.id, newQuantity)
          }
          isUpdating={isUpdating}
          desktop
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-gray-900">
          ₹{(item.price * item.quantity).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onRemoveItem(item.productId)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </td>
    </tr>
  )
);

const QuantityControl = React.memo(
  ({ quantity, onUpdateQuantity, isUpdating, desktop }) => {
    const baseClasses = desktop
      ? "flex items-center p-1 border rounded-full w-24"
      : "flex items-center border rounded-full justify-center p-1";

    return (
      <div className={baseClasses}>
        <button
          onClick={() => onUpdateQuantity(quantity - 1)}
          disabled={isUpdating}
          className={`px-2 py-1 rounded-full ${desktop ? "flex-grow" : ""} ${
            isUpdating
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 transition-colors"
          }`}
        >
          -
        </button>
        <span className="px-2 py-1 text-center">
          {isUpdating ? "..." : quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(quantity + 1)}
          disabled={isUpdating}
          className={`px-2 py-1 rounded-full ${desktop ? "flex-grow" : ""} ${
            isUpdating
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 transition-colors"
          }`}
        >
          +
        </button>
      </div>
    );
  }
);

const CartSummary = React.memo(({ totals, onCheckout }) => (
  <div className="bg-white px-6 py-6 rounded-lg shadow">
    <h2 className="text-xl font-bold mb-6">Cart Total</h2>
    <div className="space-y-4">
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold">Subtotal:</span>
        <span>₹{totals.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold">Shipping:</span>
        <span>₹{totals.shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold">GST:</span>
        <span>₹{totals.gst.toFixed(2)}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold">Extra Tax:</span>
        <span>₹{totals.extraTax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between pt-2">
        <span className="font-bold">Total:</span>
        <span className="font-bold">₹{totals.total.toFixed(2)}</span>
      </div>
    </div>
    <button
      onClick={onCheckout}
      className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors"
    >
      Proceed to checkout
    </button>
  </div>
));

const OptimizedCartSkeleton = () => {
  return (
    <div className="p-6 animate-pulse bg-orange-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-64 bg-gray-300 rounded"></div>
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
      </div>

      <div className="flex justify-between items-start gap-3">
        <div className="bg-white rounded-lg shadow p-4 mb-8 w-3/4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-16 bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
              </div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 max-w-md ml-auto w-1/4">
          <div className="h-6 w-24 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, idx) => (
              <div key={idx} className="flex justify-between">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
              </div>
            ))}
            <div className="h-12 bg-gray-300 rounded mt-4 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
