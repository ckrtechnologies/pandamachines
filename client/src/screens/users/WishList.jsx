import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaStar,
  FaShoppingCart,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { PiNotepadFill } from "react-icons/pi";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import UserLoginModal from "../../components/Login/UserLoginModal";
import UserRegisterModal from "../../components/Login/UserRegisterModal";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import BedsCarousel from "../../components/common/BedsCarousel";

const WishlistSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-2xl shadow-sm animate-pulse"
        >
          <div className="w-full sm:w-48 h-48 bg-gray-200 rounded-xl"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded-full w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
            <div className="flex gap-3 pt-4">
              <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-12"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const WishList = () => {
  const [wishlistData, setWishlistData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(new Set());
  const [loadingCart, setLoadingCart] = useState(new Set());

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  const isUserLoggedIn = () => {
    return !!localStorage.getItem("pm-user-data");
  };

  useEffect(() => {
    if (isUserLoggedIn()) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const user = getUserData();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/wishlist/wishlist-by-user/${user._id}`
      );
      setWishlistData(response.data);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Failed to load wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isUserLoggedIn()) {
      openLoginModal();
      return;
    }

    setLoadingRemove((prev) => new Set([...prev, productId]));

    const user = getUserData();

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/wishlist/remove-from-wishlist`,
        {
          userId: user._id,
          productId: productId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    } finally {
      setLoadingRemove((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    if (!isUserLoggedIn()) {
      openLoginModal();
      return;
    }

    setLoadingCart((prev) => new Set([...prev, productId]));

    const user = getUserData();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add-product-to-cart`,
        {
          userId: user._id,
          productId: productId,
          quantity: quantity,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setLoadingCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const openLoginModal = () => setShowLoginModal(true);
  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <FaStar
            key={i}
            size={14}
            className={
              ratingValue <= rating
                ? "text-yellow-400"
                : ratingValue - 0.5 <= rating
                ? "text-yellow-400 opacity-60"
                : "text-gray-300"
            }
          />
        );
      })}
    </div>
  );

  const LoadingSpinner = ({ size = 16 }) => (
    <div
      className="animate-spin rounded-full border-2 border-gray-300 border-t-red-500"
      style={{ width: size, height: size }}
    ></div>
  );

  if (!isUserLoggedIn()) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
              <FaHeart className="text-3xl text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Your Wishlist Awaits
            </h1>
            <p className="text-gray-600 mb-6">
              Sign in to view and manage your saved items
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openLoginModal}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition duration-200 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={openRegisterModal}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg transition duration-200 font-medium"
              >
                Create Account
              </button>
            </div>
          </div>
        </main>
        <AllUserFooter />

        {showLoginModal && (
          <UserLoginModal
            onClose={closeAllModals}
            onRegisterClick={openRegisterModal}
            onLoginSuccess={fetchWishlist}
          />
        )}

        {showRegisterModal && (
          <UserRegisterModal
            onClose={closeAllModals}
            onLoginClick={openLoginModal}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-center" />
      <UserNavbar />

      {showLoginModal && (
        <UserLoginModal
          onClose={closeAllModals}
          onRegisterClick={openRegisterModal}
          onLoginSuccess={fetchWishlist}
        />
      )}

      {showRegisterModal && (
        <UserRegisterModal
          onClose={closeAllModals}
          onLoginClick={openLoginModal}
        />
      )}

      <BedsCarousel />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
                <div className="flex items-center text-gray-500 mt-1 text-sm">
                  <span>Home</span>
                  <FaChevronRight className="mx-2 text-xs" />
                  <span className="text-gray-900 font-medium">Wishlist</span>
                </div>
              </div>
              {!loading && (
                <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                  {products.length} {products.length === 1 ? "Item" : "Items"}
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <WishlistSkeleton />
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <FaTimes className="text-xl text-red-500" />
              </div>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchWishlist}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                <FaHeart className="text-3xl text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start adding products you love by clicking the heart icon on
                product pages
              </p>
              <a
                href="/"
                className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition duration-200 font-medium"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group"
                >
                  <div className="w-full sm:w-48 h-48 flex-shrink-0 relative group">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      onClick={() =>
                        window.open(
                          `/user-product-details/${product?._id}`,
                          "_blank"
                        )
                      }
                    />
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      disabled={loadingRemove.has(product._id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                      aria-label="Remove from wishlist"
                    >
                      {loadingRemove.has(product._id) ? (
                        <LoadingSpinner size={16} />
                      ) : (
                        <FaHeart className="text-red-500" />
                      )}
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3
                          className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-gray-700 transition-colors"
                          onClick={() =>
                            window.open(
                              `/user-product-details/${product?._id}`,
                              "_blank"
                            )
                          }
                        >
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(product.ratings)}
                        <span className="text-sm text-gray-500">
                          {product.ratings.toFixed(1)} (
                          {Math.floor(product.ratings * 10)} reviews)
                        </span>
                      </div>

                      <p className="text-gray-600 mb-2 line-clamp-2">
                        {product.shortDescription ||
                          "Premium quality product with excellent features"}
                      </p>

                      <div className="mb-2">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.previous_price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{product.previous_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={loadingCart.has(product._id)}
                        className="flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py- rounded-lg transition duration-200 font-medium disabled:opacity-70"
                      >
                        {loadingCart.has(product._id) ? (
                          <LoadingSpinner size={18} />
                        ) : (
                          <>
                            <FaShoppingCart />
                            Add to Cart
                          </>
                        )}
                      </button>

                      <button className="flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-6 py- rounded-lg transition duration-200 font-medium">
                        <BiSolidPurchaseTag />
                        Buy Now
                      </button>

                      <button
                        className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-lg transition duration-200"
                        title="Get Quotation"
                      >
                        <PiNotepadFill size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AllUserFooter />
    </div>
  );
};

export default WishList;
