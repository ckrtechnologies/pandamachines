import axios from "axios";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";
import SkeletonText from "../common/SkeletonText";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import ProductCardOptimized, { ProductCardSkeleton } from "../Products/ProductCardOptimized";

const SearchContents = () => {
  const { searchItems } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchItems || "");
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const {
    isWishlisted,
    toggleWishlist,
    updatingWishlist,
  } = useWishlist({
    onAuthRequired: () => setShowLoginModal(true),
  });

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/get-all-products`
        );
        const filteredProducts = response.data.filter((product) =>
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
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="w-[200px] sm:w-[220px] flex-shrink-0">
                <ProductCardSkeleton fullWidth />
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
                <span className="mx-1.5 px-2 font-bold text-white bg-[#1b6292] py-1 flex items-center justify-center rounded-lg text-xs">
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
                  <IoSearchSharp className="size-4 sm:size-5" />
                </button>
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
              {products.map((product) => {
                return (
                  <div className="w-[200px] sm:w-[220px] flex-shrink-0">
                    <ProductCardOptimized
                      key={product._id}
                      product={product}
                      fullWidth
                      isWishlisted={isWishlisted(product._id)}
                      isUpdating={updatingWishlist.has(product._id)}
                      toggleWishlist={toggleWishlist}
                    />
                  </div>
                )
              })}
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
      {showLoginModal && (
        <UserLoginModal
          onClose={closeAllModals}
          onRegisterClick={openRegisterModal}
          onLoginSuccess={() => showLoginModal(false)}
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

export default SearchContents;
