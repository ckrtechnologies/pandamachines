import React, { useState, useEffect } from "react";
import { Home, ChevronRight, X, User } from "lucide-react";
import AllUserFooter from "../../components/common/AllUserFooter";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/common/UserNavbar";
import axios from "axios";
import Swal from "sweetalert2";
import SelectAddressModal from "../../components/UserSideComponents/Order/SelectAddressModal";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  const user = getUserData();
  const userId = user?._id;

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart/get-users-cart/${userId}`
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
      }
    } catch (err) {
      setError("Failed to fetch cart data");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      fetchCartData();
    }
  };

  const removeItem = async (productId) => {
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
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/cart/remove-cart-item`,
          {
            params: {
              userId: userId,
              productId: productId,
            },
          }
        );
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
        Swal.fire({
          title: "Deleted!",
          text: "Item has been removed from cart.",
          icon: "success",
        });
      } catch (err) {
        console.error("Error removing item:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to remove item from cart.",
          icon: "error",
        });
        fetchCartData();
      }
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = cartItems.reduce(
    (sum, item) => sum + item.shippingCharge,
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-orange-50">
        <UserNavbar />
        <header className="bg-slate-700 text-white">
          <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span className="text-orange-400">Categories</span>
            </nav>
          </div>
        </header>
        <CartSkeleton />
        <AllUserFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-orange-50">
        <UserNavbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            {error !== "User not logged in" && (
              <button
                onClick={fetchCartData}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
              >
                Retry
              </button>
            )}
            {error === "User not logged in" && (
              <button
                onClick={() => navigate("/login")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
              >
                Login
              </button>
            )}
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
            <span className="text-orange-400">Categories</span>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full mx-auto px-4 md:px-6 lg:px-6 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">
          My Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              <div className="lg:hidden space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <h3 className="font-semibold text-gray-900 tracking-wide">
                          {item.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-5 h-5 " />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <span className="font-bold">
                        ₹{item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center border rounded-full justify-center p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 rounded-full bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 rounded-full bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
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
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-20 object-cover rounded"
                            />
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₹{item.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center p-1 border rounded-full w-24">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-2 py-1 rounded-full bg-gray-100 flex-grow"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-2 py-1 rounded-full bg-gray-100 flex-grow"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="w-full h-px bg-gray-200"></div>
                <div className="flex justify-center p-4">
                  <button
                    onClick={() => navigate("/products")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                  >
                    Return to shop
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:w-1/4">
              <div className="bg-white px-6 py-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-6">Cart Total</h2>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Shipping:</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">GST:</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Extra Tax:</span>
                    <span>₹{extraTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded"
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <AllUserFooter />
    </div>
  );
};

export default Cart;

const CartSkeleton = () => {
  return (
    <div className="p-6 animate-pulse bg-orange-50 min-h-screen ">
      <div className="mb-8 text-2xl font-bold text-center">
        My Shopping Cart
      </div>
      <div className="flex justify-between items-start gap-3">
        <div className="bg-white rounded-lg shadow p-4 mb-8 w-3/4">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-16 bg-gray-300 rounded"></div>
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
          <div className="space-y-4">
            {["Subtotal", "Shipping", "GST", "Extra Tax", "Total"].map(
              (label, idx) => (
                <div key={idx} className="flex justify-between">
                  <div className="h-8 w-20 bg-gray-300 rounded"></div>
                  <div className="h-8 w-24 bg-gray-300 rounded"></div>
                </div>
              )
            )}
            <div className="h-10 bg-gray-300 rounded mt-4 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
