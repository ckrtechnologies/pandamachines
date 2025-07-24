import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { PiNotepadFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../../utils/CartContext";

const ProductCards = ({ products, subCategory }) => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(new Set());
  const [loadingCart, setLoadingCart] = useState(new Set());

  const { updateCartCount } = useCart();

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
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      const user = getUserData();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/wishlist/wishlist-by-user/${user._id}`
      );
      setWishlist(response.data.products.map((product) => product._id));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isUserLoggedIn()) {
      openLoginModal();
      return;
    }

    setLoadingWishlist((prev) => new Set([...prev, productId]));

    const user = getUserData();

    try {
      if (wishlist.includes(productId)) {
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
        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast.success("Product removed from wishlist!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/wishlist/add-to-wishlist`,
          {
            userId: user._id,
            productId: productId,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setWishlist((prev) => [...prev, productId]);
        toast.success("Product added to wishlist!");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist. Please try again.");
    } finally {
      setLoadingWishlist((prev) => {
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

    try {
      const result = await addToCart(productId, quantity);

      if (result.success) {
        toast.success("Product added to cart successfully!");
      } else {
        toast.error(
          result.error?.response?.data?.message ||
            "Failed to add product to cart"
        );
      }
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

  const { addToCart, fetchCartCount } = useCart();

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
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
  );

  return (
    <React.Fragment>
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

      <div className="relative mx-auto">
        {subCategory && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {subCategory?.category?.name}
              </span>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">
                {subCategory.name}
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-wide text-gray-900 mb-3">
              {subCategory.name}
            </h1>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div
                  onClick={() =>
                    window.open(
                      `/user-product-details/${product?._id}`,
                      "_blank"
                    )
                  }
                  className="relative aspect-square overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-3 flex flex-col flex-grow text-start">
                  <h3
                    onClick={() =>
                      window.open(
                        `/user-product-details/${product?._id}`,
                        "_blank"
                      )
                    }
                    className="font-semibold cursor-pointer text-sm text-gray-900 line-clamp-2 mb-1 hover:text-primary-600 transition-colors"
                  >
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-xs text-gray-600">
                      {renderStars(product.ratings)}
                      <span className="ml-1">{product.ratings.toFixed(1)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        disabled={loadingWishlist.has(product._id)}
                        className="p-1.5 bg-gray-100 text-gray-600 hover:text-red-500 rounded-full transition-all duration-300 hover:bg-gray-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={
                          wishlist.includes(product._id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        {loadingWishlist.has(product._id) ? (
                          <LoadingSpinner size="small" />
                        ) : wishlist.includes(product._id) ? (
                          <FaHeart className="text-red-500 text-sm" />
                        ) : (
                          <FaRegHeart className="text-sm" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="text-base font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                      {product.previous_price && (
                        <span className="ml-1 text-xs text-gray-500 line-through">
                          ₹{product.previous_price.toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2">
                    <button
                      className="flex-1 flex items-center justify-center gap-1 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-2 py-1.5 rounded-md text-xs transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        console.log(
                          "Buy now clicked for product:",
                          product._id
                        );
                      }}
                    >
                      <BiSolidPurchaseTag className="text-xs" />
                      <span>Buy Now</span>
                    </button>

                    <button
                      className="p-1.5 rounded-md bg-[#FF8717] hover:bg-[#ffa65e] text-white hover:text-gray-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title="Get Quotation"
                      onClick={() => {
                        console.log(
                          "Get quotation clicked for product:",
                          product._id
                        );
                      }}
                    >
                      <PiNotepadFill size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default ProductCards;
