import React, { useRef, useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { MdDescription } from "react-icons/md";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UserRegisterModal from "../Login/UserRegisterModal";
import UserLoginModal from "../Login/UserLoginModal";
import { useCart } from "../../utils/CartContext";
import { useNavigate } from "react-router-dom";

const CategorySlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loadingCart, setLoadingCart] = useState(new Set());
  const [loadingProducts, setLoadingProducts] = useState(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/get-all-products`
        );
        setProducts(response.data);
        setLoading(false);
        if (isUserLoggedIn()) {
          fetchWishlist();
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  const isUserLoggedIn = () => {
    return !!localStorage.getItem("pm-user-data");
  };

  const openLoginModal = () => setShowLoginModal(true);
  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };
  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const fetchWishlist = async () => {
    try {
      const user = getUserData();
      if (!user) return;
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
      console.error("Error toggling wishlist:", error);
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
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add to cart");
      }
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

  const handleBuyNow = async (productId) => {
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

  const groupProducts = () => {
    const categoriesMap = new Map();

    products.forEach((product) => {
      if (!product.category || !product.subCategory) return;

      const categoryId = product.category._id;
      const subcategoryId = product.subCategory._id;
      const subSubcategoryId = product.subSubCategory?._id;

      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: product.category.name,
          imgUrl: product.category.imgUrl,
          cat_desc: product.category.description,
          subcategories: new Map(),
        });
      }

      const category = categoriesMap.get(categoryId);

      if (!category.subcategories.has(subcategoryId)) {
        category.subcategories.set(subcategoryId, {
          id: subcategoryId,
          name: product.subCategory.name,
          subSubcategories: new Map(),
        });
      }

      const subcategory = category.subcategories.get(subcategoryId);

      if (subSubcategoryId) {
        if (!subcategory.subSubcategories.has(subSubcategoryId)) {
          subcategory.subSubcategories.set(subSubcategoryId, {
            id: subSubcategoryId,
            name: product.subSubCategory.name,
            products: [],
          });
        }

        const subSubcategory =
          subcategory.subSubcategories.get(subSubcategoryId);
        subSubcategory.products.push({
          id: product._id,
          name: product.name,
          price: product.price,
          previous_price: product.previous_price,
          rating: product.ratings,
          image: product.images?.[0] || "",
          description: product.description,
          brand: product.brand,
        });
      } else {
        const defaultSubSubId = `${subcategoryId}_default`;
        if (!subcategory.subSubcategories.has(defaultSubSubId)) {
          subcategory.subSubcategories.set(defaultSubSubId, {
            id: defaultSubSubId,
            name: "All Products",
            products: [],
          });
        }

        const defaultSubSub = subcategory.subSubcategories.get(defaultSubSubId);
        defaultSubSub.products.push({
          id: product._id,
          name: product.name,
          price: product.price,
          previous_price: product.previous_price,
          rating: product.ratings,
          image: product.images?.[0] || "",
          description: product.description,
          brand: product.brand,
        });
      }
    });

    return Array.from(categoriesMap.values()).map((category) => ({
      ...category,
      subcategories: Array.from(category.subcategories.values()).map((sub) => ({
        ...sub,
        subSubcategories: Array.from(sub.subSubcategories.values()),
      })),
    }));
  };

  const categories = groupProducts();

  if (loading) {
    return (
      <div className="bg-gray-100 mb-10 py-6 px-4 xl:px-6">
        <div className="text-center mb-6">
          <div className="h-6 w-48 mx-auto bg-gray-300 animate-pulse rounded mb-2"></div>
          <div className="h-4 w-64 mx-auto bg-gray-200 animate-pulse rounded"></div>
        </div>

        {[1, 2].map((_, index) => (
          <div key={index} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <div className="h-5 w-48 bg-gray-300 animate-pulse rounded mb-2"></div>
                <div className="h-4 w-72 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                {[1, 2, 3].map((tab) => (
                  <div
                    key={tab}
                    className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            <div className="flex space-x-6 overflow-x-auto py-4">
              {[1, 2, 3, 4, 5].map((card) => (
                <div
                  key={card}
                  className="flex-shrink-0 w-64 bg-white rounded-lg shadow animate-pulse overflow-hidden"
                >
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-5 w-48 bg-gray-300 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-5 w-24 bg-gray-300 rounded mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading products: {error}
      </div>
    );
  }

  const CategorySection = ({ category }) => {
    const scrollContainerRef = useRef(null);
    const [activeSubcategory, setActiveSubcategory] = useState(
      category.subcategories[0]?.id || null
    );
    const [activeSubSubcategory, setActiveSubSubcategory] = useState(null);

    useEffect(() => {
      const subcategory = category.subcategories.find(
        (sub) => sub.id === activeSubcategory
      );
      if (subcategory && subcategory.subSubcategories.length > 0) {
        setActiveSubSubcategory(subcategory.subSubcategories[0].id);
      }
    }, [activeSubcategory, category.subcategories]);

    const scrollLeft = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          left: -300,
          behavior: "smooth",
        });
      }
    };

    const scrollRight = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          left: 300,
          behavior: "smooth",
        });
      }
    };

    const currentSubcategory = category.subcategories.find(
      (sub) => sub.id === activeSubcategory
    );

    const activeProducts =
      currentSubcategory?.subSubcategories.find(
        (subSub) => subSub.id === activeSubSubcategory
      )?.products || [];

    if (!activeSubcategory || category.subcategories.length === 0) {
      return null;
    }

    return (
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="sm:text-2xl text-xl font-semibold text-gray-900">
              {category?.name}
            </h3>
          </div>

          <div className="flex space-x-2 overflow-x-auto scrollbar-hide mt-4 md:mt-0">
            {category.subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => setActiveSubcategory(subcategory.id)}
                className={`px-3 py-2 text-sm rounded-full whitespace-nowrap transition-colors duration-200 ${
                  activeSubcategory === subcategory.id
                    ? "bg-[#00395F] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>

        {currentSubcategory &&
          currentSubcategory.subSubcategories.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide mb-4">
              {currentSubcategory.subSubcategories.map((subSubcategory) => (
                <button
                  key={subSubcategory.id}
                  onClick={() => setActiveSubSubcategory(subSubcategory.id)}
                  className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors duration-200 ${
                    activeSubSubcategory === subSubcategory.id
                      ? "bg-[#FF8617] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {subSubcategory.name}
                </button>
              ))}
            </div>
          )}

        <div className="relative group">
          <button
            onClick={scrollLeft}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label={`Scroll ${category.name} left`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide py-4"
            style={{ scrollbarWidth: "none" }}
          >
            {activeProducts.length > 0 ? (
              activeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="w-full text-center py-8 text-gray-500">
                No products available in this category
              </div>
            )}
          </div>

          <button
            onClick={scrollRight}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label={`Scroll ${category.name} right`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const ProductCard = ({ product }) => {
    const [imgSrc, setImgSrc] = useState(
      product.image || "https://via.placeholder.com/256?text=No+Image"
    );
    const hasDiscount = product.previous_price > product.price;

    const handleImageError = () => {
      setImgSrc("https://via.placeholder.com/256?text=No+Image");
    };

    return (
      <div className="group flex-shrink-0 w-[200px] h-auto bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-3 flex flex-col">
        <div
          onClick={() =>
            window.open(`/user-product-details/${product?.id}`, "_blank")
          }
          className="relative h-[150px] overflow-hidden cursor-pointer"
        >
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={handleImageError}
          />
          <div className="absolute top-1 right-1 bg-white/90 rounded-full px-1 py-0.5 text-xs font-semibold flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-0.5 text-gray-800 text-[10px]">
              {(product.rating || 0).toFixed(1)}
            </span>
          </div>
          {hasDiscount && (
            <div className="absolute top-1 left-1 bg-[#FF8617] text-white text-[10px] font-medium tracking-wide px-1.5 py-0.5 rounded">
              Sale
            </div>
          )}
        </div>

        <div className="p-2 space-y-2 flex-grow flex flex-col">
          <div>
            <h3
              onClick={() =>
                window.open(`/user-product-details/${product?.id}`, "_blank")
              }
              className="text-md font-medium text-gray-800 truncate cursor-pointer hover:text-primary-600 transition-colors"
            >
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{product.brand}</p>
          </div>

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <span className="text-md font-bold text-gray-900">
                ₹{product.price?.toLocaleString() || "0"}
              </span>
              {hasDiscount && (
                <span className="ml-1 text-xs text-[#f19e50] line-through">
                  ₹{product.previous_price?.toLocaleString() || "0"}
                </span>
              )}
            </div>
            <button
              onClick={() => toggleWishlist(product.id)}
              disabled={loadingWishlist.has(product.id)}
              className="p-1.5 bg-gray-100 text-gray-600 hover:text-red-500 rounded-full transition-all duration-300 hover:bg-gray-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add to wishlist"
            >
              {loadingWishlist.has(product.id) ? (
                <LoadingSpinner />
              ) : wishlist.includes(product.id) ? (
                <FaHeart className="text-red-500 text-sm" />
              ) : (
                <FaRegHeart className="text-sm" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBuyNow(product.id)}
              disabled={loadingProducts.has(product.id)}
              className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-xs px-2 py-1.5 rounded transition duration-200 disabled:opacity-50"
            >
              {loadingProducts.has(product.id) ? (
                <>
                  <div className="w-3 h-3 border-[2px] border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <BiSolidPurchaseTag size={12} />
                  <span>Buy Now</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleAddToCart(product.id)}
              disabled={loadingCart.has(product.id)}
              className="p-1.5 bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add to cart"
            >
              {loadingCart.has(product.id) ? (
                <LoadingSpinner />
              ) : (
                <FaShoppingCart size={16} />
              )}
            </button>

            <button
              onClick={() =>
                window.open(`/user-product-details/${product?.id}`, "_blank")
              }
              className="p-1.5 bg-gray-100 text-gray-600 hover:text-purple-600 hover:bg-purple-100 rounded transition-all duration-300"
              aria-label="View details"
            >
              <MdDescription size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 mb-10 py-6 px-4 xl:px-6">
      <Toaster position="top-center" />
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Shop by Categories
        </h2>
        <p className="text-gray-600">
          Discover our wide range of products organized by categories
        </p>
      </div>

      {categories.length > 0 ? (
        categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">No products found</div>
      )}

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
          onLoginClick={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
};

export default CategorySlider;