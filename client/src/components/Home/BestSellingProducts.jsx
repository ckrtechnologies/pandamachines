import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import ProductCardOptimized, { ProductCardSkeleton } from "../Products/ProductCardOptimized";
import { useWishlist } from "../../hooks/useWishlist";

const BestSellingProducts = () => {
  const navigate = useNavigate();

  const {
    isWishlisted,
    toggleWishlist,
    updatingWishlist
  } = useWishlist({
    onAuthRequired: () => setShowLoginModal(true)
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/featured`,
        {
          params: {
            page: 1,
            limit: 12,
          },
        }
      );

      setProducts(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="px-3 xl:px-6 pt-6 pb-10 bg-gradient-to-br from-[#E0F2EA] via-[#F9F0DC] to-[#FFF8F8]">
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl lg:text-3xl">
          Our Best Products
        </h2>

        <button
          onClick={() => navigate("categories")}
          className="text-sm sm:text-base font-semibold text-[#FF6B00] hover:underline"
        >
          Explore More→
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} fullWidth />
          ))
          : products.map((product) => {

            return (
              <ProductCardOptimized
                key={product._id}
                product={product}
                fullWidth
                isWishlisted={isWishlisted(product._id)}
                isUpdating={updatingWishlist.has(product._id)}
                toggleWishlist={toggleWishlist}
              />
            )
          })}
      </div>

      {/* MODALS */}
      {showLoginModal && (
        <UserLoginModal
          onClose={() => setShowLoginModal(false)}
          onRegisterClick={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <UserRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onLoginClick={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
};

export default BestSellingProducts;
