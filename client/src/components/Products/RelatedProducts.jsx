import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { MdDescription } from "react-icons/md";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../utils/CartContext";

const RelatedProducts = ({ subCategoryId }) => {
  const { id: currentProductId } = useParams();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(new Set());
  const [loadingProducts, setLoadingProducts] = useState(new Set());
  const [loadingCart, setLoadingCart] = useState(new Set());
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  const isUserLoggedIn = () => {
    return !!localStorage.getItem("pm-user-data");
  };

  useEffect(() => {
    if (!subCategoryId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/products-by-sub-category/${subCategoryId}`
        );
        setProducts(
          response.data?.filter(
            (p) => String(p._id) !== String(currentProductId)
          )
        );
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [subCategoryId, currentProductId]);

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

  const addToWishlist = async (productId) => {
    const user = getUserData();
    try {
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
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist. Please try again.");
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
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
      setWishlist((prev) => prev.filter((id) => id !== productId));
      toast.success("Product removed from wishlist!");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist. Please try again.");
      throw error;
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isUserLoggedIn()) {
      openLoginModal();
      return;
    }

    setLoadingWishlist((prev) => new Set([...prev, productId]));

    try {
      if (wishlist.includes(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
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

  const renderStars = (rating) => {
    const stars = Math.floor(rating);
    return (
      <span className="text-yellow-400">
        {"★".repeat(stars)}
        {"☆".repeat(5 - stars)}
      </span>
    );
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
  );

  const openLoginModal = () => setShowLoginModal(true);
  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
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
      <div className="text-gray-900 text-lg md:text-xl tracking-wide font-bold my-6">
        Related Products
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex space-x-4 min-w-full">
            {loading &&
              Array(7)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)}
            {!loading &&
              products.map((product) => (
                <div
                  key={product._id}
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
                        src={product?.images?.[0]}
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

                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-xs text-gray-600">
                        {renderStars(product.ratings ?? 0)}
                        <span className="ml-1">
                          {(product.ratings ?? 0).toFixed(1)}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleWishlist(product._id)}
                        disabled={loadingWishlist.has(product._id)}
                        className="p-1.5 bg-gray-100 text-gray-600 rounded-full transition-all duration-300 hover:bg-gray-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={
                          wishlist.includes(product._id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        {loadingWishlist.has(product._id) ? (
                          <LoadingSpinner />
                        ) : wishlist.includes(product._id) ? (
                          <FaHeart className="text-red-500 text-sm" />
                        ) : (
                          <FaRegHeart className="text-sm" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleBuyNowClick(product._id)}
                        disabled={loadingProducts.has(product._id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-xs px-2 py-1.5 rounded transition duration-200 disabled:opacity-50"
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

                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={loadingCart.has(product._id)}
                        className="p-1.5 bg-gray-100 text-gray-600 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Add to cart"
                      >
                        {loadingCart.has(product._id) ? (
                          <LoadingSpinner />
                        ) : (
                          <FaShoppingCart size={16} />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          window.open(
                            `/user-product-details/${product?._id}`,
                            "_blank"
                          )
                        }
                        className="p-1.5 bg-gray-100 text-gray-600 rounded transition-all duration-300"
                        aria-label="View details"
                      >
                        <MdDescription size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;

export const SkeletonCard = () => {
  return (
    <div className="group w-48 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
      <div className="h-32 bg-gray-200" />

      <div className="p-3 flex flex-col flex-grow">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <div className="h-3 w-10 bg-gray-300 rounded" />
            <div className="h-3 w-6 bg-gray-300 rounded" />
          </div>

          <div className="flex gap-2">
            <div className="h-6 w-6 bg-gray-300 rounded-full" />
            <div className="h-6 w-6 bg-gray-300 rounded-full" />
          </div>
        </div>

        <div className="mt-2 h-7 bg-gray-300 rounded w-full" />
      </div>
    </div>
  );
};
