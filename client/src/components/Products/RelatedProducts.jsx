import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import { useNavigate, useParams } from "react-router-dom";
import SubCategoryProductCard from "./SubCategoryProductCard";
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

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  const isUserLoggedIn = () => {
    return !!localStorage.getItem("pm-user-data");
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
  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <FaStar
            key={i}
            size={10}
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
          onLoginSuccess={() => {}}
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
                <SubCategoryProductCard
                  key={product._id}
                  product={product}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  loadingWishlist={loadingWishlist}
                  renderStars={renderStars}
                  addToCartClick={handleAddToCart}
                  buyNowClick={handleBuyNowClick}
                  loadingCart={loadingCart}
                  loadingProducts={loadingProducts}
                />
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
