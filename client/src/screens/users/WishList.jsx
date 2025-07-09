import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { PiNotepadFill } from "react-icons/pi";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import UserLoginModal from "../../components/Login/UserLoginModal";
import UserRegisterModal from "../../components/Login/UserRegisterModal";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const WishlistSkeleton = () => {
  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-md overflow-hidden shadow-lg border border-gray-100 flex flex-col relative"
          >
            <div className="absolute top-2 right-2 z-10 w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="relative aspect-square overflow-hidden">
              <div className="w-full h-full bg-gray-300 animate-pulse"></div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <div className="h-5 bg-gray-300 rounded-md w-full mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-300 rounded-md w-3/4 mb-3 animate-pulse"></div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"
                      ></div>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-300 rounded-md w-8 animate-pulse"></div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 bg-gray-300 rounded-md w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded-md w-16 animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="w-full h-10 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
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
    } catch (error) {
      console.error("Error removing from wishlist:", error);
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

      console.log("Added to cart:", response.data);

      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
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

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-red-500"></div>
  );

  if (!isUserLoggedIn()) {
    return (
      <React.Fragment>
        <UserNavbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to view your wishlist
            </h2>
            <p className="text-gray-600 mb-6">
              Save items you love and never lose track of them
            </p>
            <button
              onClick={openLoginModal}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md transition duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
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
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Toaster />
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

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            {loading ? (
              <>
                <div className="w-48 h-8 bg-gray-300 rounded animate-pulse mb-2"></div>
                <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  My Wishlist
                </h1>
                <p className="text-gray-600">
                  {`${products.length} item${
                    products.length !== 1 ? "s" : ""
                  } in your wishlist`}
                </p>
              </>
            )}
          </div>

          {loading ? (
            <WishlistSkeleton />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchWishlist}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md transition duration-200"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col relative"
                >
                  <div
                    onClick={() =>
                      window.open(
                        `/user-product-details/${product?._id}`,
                        "_blank"
                      )
                    }
                    className="relative aspect-square overflow-hidden"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full cursor-pointer h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-grow text-start">
                    <h3
                      onClick={() =>
                        window.open(
                          `/user-product-details/${product?._id}`,
                          "_blank"
                        )
                      }
                      className="font-semibold cursor-pointer text-md text-gray-900 line-clamp-2 mb-1"
                    >
                      {product.name}
                    </h3>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-600">
                        {renderStars(product.ratings)}
                        <span className="ml-2">
                          {product.ratings.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          disabled={loadingRemove.has(product._id)}
                          className="p-2 bg-[#dbe5ec] backdrop-blur-sm text-red-500 rounded-full shadow-xl transition-all duration-300 hover:bg-gray-200 hover:scale-110 disabled:opacity-50"
                          aria-label="Remove from wishlist"
                        >
                          {loadingRemove.has(product._id) ? (
                            <LoadingSpinner />
                          ) : (
                            <FaHeart />
                          )}
                        </button>

                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={loadingCart.has(product._id)}
                          className="bg-[#dbe5ec] backdrop-blur-sm p-2 rounded-full shadow-xl transition-all duration-300 hover:bg-gray-200 hover:scale-110 cursor-pointer disabled:opacity-50"
                          aria-label="Add to cart"
                        >
                          {loadingCart.has(product._id) ? (
                            <LoadingSpinner />
                          ) : (
                            <FaShoppingCart className="text-gray-700 text-sm group-hover:text-black transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                        {product.previous_price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{product.previous_price.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-4 py-2 rounded-md transition duration-200">
                        <BiSolidPurchaseTag />
                        <span className="text-sm tracking-wide font-medium">
                          Buy Now
                        </span>
                      </button>

                      <button
                        className="flex-shrink-0 p-2 rounded-md bg-[#FF8717] hover:bg-[#ffa65e] text-white hover:text-gray-900 transition duration-200"
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
      </div>

      <AllUserFooter />
    </React.Fragment>
  );
};

export default WishList;
