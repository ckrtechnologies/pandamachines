import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import axios from "axios";
import SkeletonText from "../common/SkeletonText";
import toast, { Toaster } from "react-hot-toast";
import UserRegisterModal from "../Login/UserRegisterModal";
import UserLoginModal from "../Login/UserLoginModal";

const SearchContents = () => {
  const [loadingProducts, setLoadingProducts] = useState(new Set());
  const { searchItems } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchItems || "");
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(new Set());
  const openLoginModal = () => setShowLoginModal(true);

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products-search-results/${encodeURIComponent(searchQuery)}`);
    }
  };
  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  const isUserLoggedIn = () => {
    return !!localStorage.getItem("pm-user-data");
  };


  const renderStars = (rating) => {
    const stars = Math.floor(rating);
    return (
      <span className="text-yellow-400">
        {"★".repeat(stars)}
        {"☆".repeat(5 - stars)}
      </span>
    );
  };
  useEffect(() => {
    if (isUserLoggedIn()) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/get-all-products`);
        const filteredProducts = response.data.filter(product =>
          product.name.toLowerCase().includes(searchItems?.toLowerCase() || "")
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchItems]);
  const user = getUserData();
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

  const handleBuyNowClick = async (productId) => {
    if (!isUserLoggedIn()) {
      openLoginModal();
      return;
    }
    setLoadingProducts((prev) => new Set(prev).add(productId));

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${productId}`
      );

      if (response.status === 200) {
        const product = response.data;
        localStorage.setItem(
          "buy-now-product",
          JSON.stringify({ product, quantity: 1 })
        );
        navigate("/checkout");
      } else {
        toast.error("Failed to fetch product details.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error fetching product details.");
    } finally {
      setLoadingProducts((prev) => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
  );

  if (!isUserLoggedIn()) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">

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
  if (loading) {
    return (
      <>
        <div className="flex justify-between items-start mx-auto py-4 px-4 md:px-6">
          <div className="flex flex-col space-y-4">
            <SkeletonText width="w-48" height="h-5" />
            <SkeletonText width="w-48" height="h-5" />
          </div>
          <SkeletonText width="w-48" height="h-10" className="rounded-md" />
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-6 overflow-x-auto mx-auto py-4 px-4 md:px-6">
            {[1, 2, 3, 4, 5, 6, 7].map((card) => (
              <div
                key={card}
                className="flex-shrink-0 w-[12rem] bg-white rounded-lg shadow animate-pulse overflow-hidden"
              >
                <div className="h-[11rem] bg-gray-300"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 w-48 bg-gray-300 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-5 w-24 bg-gray-300 rounded mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="px-4 sm:px-8 py-6 bg-gray-50">
      <Toaster position="top-center" />
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left Section - Results Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-xl font-medium text-gray-500 whitespace-nowrap">
                  Results for:
                </h2>
                <div className="relative max-w-full">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate bg-gradient-to-r from-[#1b6292] to-[#4facfe] bg-clip-text text-transparent">
                    {decodeURIComponent(searchItems || "your search")}
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#1b6292]/30 to-[#4facfe]/30 rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-500">Found</span>
                <span className="mx-1.5 font-bold text-white bg-[#1b6292] h-5 w-5 flex items-center justify-center rounded-full text-xs">
                  {products.length}
                </span>
                <span className="text-sm text-gray-500">
                  {products.length === 1 ? "item" : "items"}
                </span>
                <span className="hidden sm:inline-flex ml-3 text-xs text-gray-400 items-center">
                  <svg
                    className="w-3 h-3 mr-1 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Live results
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Search Bar */}
          <div className="w-full md:w-auto transition-all duration-300 hover:scale-[1.02]">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-transparent hover:ring-[#1b6292]/20">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Refine your search..."
                  className="flex-grow px-3 py-1 focus:outline-none text-gray-700 min-w-[220px] bg-transparent placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="ml-2 bg-gradient-to-r from-[#1b6292] to-[#4facfe] text-white rounded-full p-2 hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  aria-label="Search"
                >
                  <FaSearch
                    size={16}
                    className="transform transition-transform duration-300 hover:scale-110"
                  />
                </button>
              </div>
              <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
                <div className="h-1 bg-gradient-to-r from-transparent via-[#1b6292]/30 to-transparent w-3/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </form>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="hidden lg:block">
          <div className="absolute left-1/4 -mt-8 w-16 h-16 bg-[#1b6292]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute right-1/4 -mt-16 w-24 h-24 bg-[#4facfe]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="relative">
          <div className="overflow-x-auto pb-4">
            <div className="inline-flex space-x-4 min-w-full">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group w-48 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-32 overflow-hidden">

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
                        src={product?.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="p-3 flex flex-col flex-grow">

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

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-600">
                        {renderStars(product.ratings ?? 0)}
                        <span className="ml-1">
                          {(product.ratings ?? 0).toFixed(1)}
                        </span>
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
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={loadingCart.has(product._id)}
                          className="p-1.5 bg-gray-100 rounded-full transition-all duration-300 hover:bg-gray-200"
                        >
                          {loadingCart.has(product._id) ? (
                            <LoadingSpinner size={18} />
                          ) : (<FaShoppingCart />)}
                        </button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <button
                        onClick={() => handleBuyNowClick(product._id)}
                        disabled={loadingProducts.has(product._id)} 
                        className="w-full flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-xs px-2 py-1.5 rounded transition duration-200"
                      >
                        {loadingProducts.has(product._id) ? (
                          <div className="flex items-center justify-center gap-1">
                          <div className="w-3 h-3 border-[2px] border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <>
                            <BiSolidPurchaseTag size={12} />
                            <span>Buy Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            We couldn't find any matches for "{searchQuery}"
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-[#1b6292] text-white rounded hover:bg-[#134a6e] transition duration-200"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchContents;
