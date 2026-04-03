import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { useCart } from "../../utils/CartContext";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";

const ProductCards = ({ products, subCategory, subSubCategory }) => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(new Set());
  // const [loadingCart, setLoadingCart] = useState(new Set());
  const [loadingProducts, setLoadingProducts] = useState(new Set());
  // const { updateCartCount } = useCart();

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
        `${process.env.REACT_APP_API_URL}/wishlist/wishlist-by-user/${user._id}`,
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
          },
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
          },
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
    const productData = products.find((p) => p._id === productId);
    if (productData) {
      const totalPrice =
        Number(productData.price) +
        (Number(productData.price) * (Number(productData.gstPercentage) || 0)) /
        100;
      if (totalPrice < 2000) {
        toast.error("Minimum purchase value must be ₹2,000.");
        return;
      }
    }

    if (!isUserLoggedIn()) {
      openLoginModal();
      return;
    }
    setLoadingProducts((prev) => new Set(prev).add(productId));

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${productId}`,
      );

      if (response.status === 200) {
        const product = response.data;
        localStorage.setItem(
          "buy-now-product",
          JSON.stringify({ product, quantity: 1 }),
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

  // const handleAddToCart = async (productId, quantity = 1) => {
  //   const productData = products.find((p) => p._id === productId);
  //   if (productData) {
  //     const totalPrice =
  //       Number(productData.price) +
  //       (Number(productData.price) * (Number(productData.gstPercentage) || 0)) /
  //         100;
  //     if (totalPrice < 2000) {
  //       toast.error("Minimum purchase value must be ₹2,000.");
  //       return;
  //     }
  //   }

  //   if (!isUserLoggedIn()) {
  //     openLoginModal();
  //     return;
  //   }

  //   setLoadingCart((prev) => new Set([...prev, productId]));

  //   try {
  //     const result = await addToCart(productId, quantity);

  //     if (result.success) {
  //       toast.success("Product added to cart successfully!");
  //     } else {
  //       toast.error(
  //         result.error?.response?.data?.message ||
  //           "Failed to add product to cart",
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error adding to cart:", error);
  //     toast.error("Failed to add product to cart. Please try again.");
  //   } finally {
  //     setLoadingCart((prev) => {
  //       const newSet = new Set(prev);
  //       newSet.delete(productId);
  //       return newSet;
  //     });
  //   }
  // };

  // const { addToCart } = useCart();

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

      <div className="relative sm:mx-auto">
        {subCategory && (
          <div className="mb-4">
            <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide text-xs sm:text-sm mb-4">

              <span className="text-gray-500 font-medium">
                {subCategory?.category?.name}
              </span>

              <span className="text-gray-800">›</span>

              <span className="text-gray-400 font-medium">
                {subCategory.name}
              </span>

              {subSubCategory && (
                <>
                  <span className="text-gray-800">›</span>
                  <span className="text-gray-400 font-semibold">
                    {subSubCategory.name}
                  </span>
                </>
              )}

            </div>

            <h1 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
              {subSubCategory ? subSubCategory.name : subCategory.name}
            </h1>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div
                  onClick={() =>
                    window.open(
                      `/user-product-details/${product?._id}`,
                      "_blank",
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
                        "_blank",
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
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <p className="text-base font-bold text-gray-900">
                          ₹
                          {(
                            Number(product.price) +
                            (Number(product.price) *
                              (Number(product.gstPercentage) || 0)) /
                            100
                          ).toLocaleString()}
                          {product.previous_price && (
                            <span className="ml-1 text-xs text-gray-500 line-through">
                              ₹
                              {(
                                Number(product.previous_price) +
                                (Number(product.previous_price) *
                                  (Number(product.gstPercentage) || 0)) /
                                100
                              ).toLocaleString()}
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="text-[10px] text-green-600 font-semibold">
                        Included GST {product.gstPercentage || 0}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2">
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

                    {/* <button
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
                    </button> */}
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
