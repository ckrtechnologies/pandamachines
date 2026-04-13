import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import ProductCardOptimized, { ProductCardSkeleton } from "../Products/ProductCardOptimized";

const BestSellingProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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
          : products.map((product) => (
            <ProductCardOptimized
              key={product._id}
              product={product}
              fullWidth
            />
          ))}
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

// import { useState, useEffect } from "react";
// import { FaStar, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
// import { BiSolidPurchaseTag } from "react-icons/bi";
// import { MdDescription } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import UserRegisterModal from "../Login/UserRegisterModal";
// import UserLoginModal from "../Login/UserLoginModal";
// import { useCart } from "../../utils/CartContext";
// import useIsMobile from "../../hooks/useIsMobile";

// const BestSellingProducts = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [wishlist, setWishlist] = useState([]);
//   const [loadingCart, setLoadingCart] = useState(new Set());
//   const [loadingProducts, setLoadingProducts] = useState(new Set());
//   const [loadingWishlist, setLoadingWishlist] = useState(new Set());
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const { addToCart } = useCart();
//   const isMobile = useIsMobile();
  
//   const fetchBestProducts = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_URL}/products/all-best-products`,
//       );
//       setProducts(res.data.slice(0, 12));
//       setLoading(false);
//       // if (isUserLoggedIn()) {
//       //   fetchWishlist();
//       // }
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBestProducts();
//   }, []);

//   const getUserData = () => {
//     const userData = localStorage.getItem("pm-user-data");
//     return userData ? JSON.parse(userData) : null;
//   };

//   const isUserLoggedIn = () => {
//     return !!localStorage.getItem("pm-user-data");
//   };

//   const handleNavigation = (productId) => {
//     const url = `/user-product-details/${productId}`;

//     if (window.innerWidth < 768) {
//       navigate(url);
//     } else {
//       window.open(url, "_blank", "noopener,noreferrer");
//     }
//   };
  
//   const openLoginModal = () => setShowLoginModal(true);
//   const openRegisterModal = () => {
//     setShowLoginModal(false);
//     setShowRegisterModal(true);
//   };
//   const closeAllModals = () => {
//     setShowLoginModal(false);
//     setShowRegisterModal(false);
//   };

//   const fetchWishlist = async () => {
//     try {
//       const user = getUserData();
//       if (!user) return;
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/wishlist/wishlist-by-user/${user._id}`,
//       );
//       setWishlist(response.data.products.map((product) => product._id));
//     } catch (error) {
//       console.error("Error fetching wishlist:", error);
//     }
//   };

//   const addToWishlist = async (productId) => {
//     const user = getUserData();
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/wishlist/add-to-wishlist`,
//         {
//           userId: user._id,
//           productId: productId,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         },
//       );
//       setWishlist((prev) => [...prev, productId]);
//       toast.success("Product added to wishlist!");
//     } catch (error) {
//       console.error("Error adding to wishlist:", error);
//       toast.error("Failed to add to wishlist. Please try again.");
//     }
//   };

//   const removeFromWishlist = async (productId) => {
//     const user = getUserData();
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/wishlist/remove-from-wishlist`,
//         {
//           userId: user._id,
//           productId: productId,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         },
//       );
//       setWishlist((prev) => prev.filter((id) => id !== productId));
//       toast.success("Product removed from wishlist!");
//     } catch (error) {
//       console.error("Error removing from wishlist:", error);
//       toast.error("Failed to remove from wishlist. Please try again.");
//     }
//   };

//   const toggleWishlist = async (e, productId) => {
//     e.stopPropagation();
//     if (!isUserLoggedIn()) {
//       openLoginModal();
//       return;
//     }

//     setLoadingWishlist((prev) => new Set([...prev, productId]));

//     try {
//       if (wishlist.includes(productId)) {
//         await removeFromWishlist(productId);
//       } else {
//         await addToWishlist(productId);
//       }
//     } catch (error) {
//       console.error("Error toggling wishlist:", error);
//     } finally {
//       setLoadingWishlist((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(productId);
//         return newSet;
//       });
//     }
//   };

//   const handleAddToCart = async (e, productId, quantity = 1) => {
//     e.stopPropagation();
//     if (!isUserLoggedIn()) {
//       openLoginModal();
//       return;
//     }

//     setLoadingCart((prev) => new Set([...prev, productId]));

//     try {
//       const result = await addToCart(productId, quantity);

//       if (result.success) {
//         toast.success("Added to cart!");
//       } else {
//         toast.error("Failed to add to cart");
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast.error("Failed to add to cart");
//     } finally {
//       setLoadingCart((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(productId);
//         return newSet;
//       });
//     }
//   };

//   const handleBuyNow = async (e, productId) => {
//     e.stopPropagation();

//     const product = products.find((p) => p._id === productId);
//     if (product) {
//       const totalPrice =
//         Number(product.price) +
//         (Number(product.price) * (Number(product.gstPercentage) || 0)) / 100;
//       if (totalPrice < 2000) {
//         toast.error("Minimum purchase value must be ₹2,000.");
//         return;
//       }
//     }

//     if (!isUserLoggedIn()) {
//       openLoginModal();
//       return;
//     }

//     setLoadingProducts((prev) => new Set(prev).add(productId));

//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${productId}`,
//       );

//       if (response.status === 200) {
//         const product = response.data;
//         localStorage.setItem(
//           "buy-now-product",
//           JSON.stringify({ product, quantity: 1 }),
//         );
//         navigate("/checkout");
//       } else {
//         toast.error("Failed to fetch product details.");
//       }
//     } catch (error) {
//       console.error("Error fetching product:", error);
//       toast.error("Error fetching product details.");
//     } finally {
//       setLoadingProducts((prev) => {
//         const updated = new Set(prev);
//         updated.delete(productId);
//         return updated;
//       });
//     }
//   };

//   const LoadingSpinner = () => (
//     <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
//   );

//   const renderStars = (rating) => (
//     <div className="flex gap-0.5">
//       {[...Array(5)].map((_, i) => {
//         const ratingValue = i + 1;
//         return (
//           <FaStar
//             key={i}
//             size={12}
//             className={
//               ratingValue <= rating
//                 ? "text-yellow-400"
//                 : ratingValue - 0.5 <= rating
//                   ? "text-yellow-400 opacity-60"
//                   : "text-gray-300"
//             }
//           />
//         );
//       })}
//     </div>
//   );

//   return (
//     <div className="px-3 xl:px-5 mb-6 pt-6 pb-10 bg-gradient-to-br from-[#E0F2EA] via-[#F9F0DC] to-[#FFF8F8]">
//       <Toaster position="top-center" />
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 px-1">
//         <div className="text-left mb-4 md:mb-0">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
//             Our Best Products
//           </h2>
//         </div>

//         <div>
//           <button
//             onClick={() => navigate("categories")}
//             className="text-sm md:text-base font-semibold text-[#FF6B00] hover:underline transition"
//           >
//             Explore More →
//           </button>
//         </div>
//       </div>

//       {/* GRID: Responsive with 6 columns at xl */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
//         {loading
//           ? Array(7)
//             .fill(0)
//             .map((_, index) => (
//               <div
//                 key={index}
//                 className="animate-pulse bg-white rounded-md overflow-hidden shadow-md border border-gray-100 flex flex-col"
//               >
//                 <div className="h-36 bg-gray-200"></div>
//                 <div className="p-3 flex flex-col gap-2">
//                   <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-2.5 bg-gray-200 rounded w-1/2"></div>
//                   <div className="flex gap-2 mt-3">
//                     <div className="h-6 bg-gray-200 rounded w-full"></div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           : products.map((product) => (
//             <div
//               onClick={() => handleNavigation(product._id)}
//               key={product._id}
//               className="cursor-pointer group bg-white rounded-md overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col text-sm"
//             >
//               <div className="relative aspect-square overflow-hidden">
//                 <img
//                   src={product.images[0]}
//                   alt={product.name}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 />
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleNavigation(product._id) 
//                   }}
//                   className="absolute top-2 right-2 p-2 bg-white/90 text-gray-600 rounded transition-all duration-300 shadow-md"
//                   aria-label="View details"
//                 >
//                   <MdDescription size={16} />
//                 </button>
//               </div>

//               <div className="p-3 flex flex-col flex-grow">
//                 <h3 className="font-medium text-md text-gray-900 line-clamp-2 leading-[1.25rem] min-h-[2.5rem] mb-1">
//                   {product.name}
//                 </h3>

//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center text-xs text-gray-600">
//                     {renderStars(product.ratings)}
//                     <span className="ml-1">{product.ratings.toFixed(1)}</span>
//                   </div>
//                 </div>

//                 <div className="mt-3 flex items-center gap-1.5 sm:gap-2">
//                   <button
//                     onClick={(e) => handleBuyNow(e, product._id)}
//                     disabled={loadingProducts.has(product._id)}
//                     className="flex-1 flex items-center justify-center gap-1 bg-gray-900 hover:bg-gray-800 text-white px1.5
//                        sm:px-3 py-1.5 rounded-md transition duration-200 text-[0.65rem] sm:text-xs disabled:opacity-50"
//                   >
//                     {loadingProducts.has(product._id) ? (
//                       <>
//                         <div className="w-3 h-3 border-[2px] border-white border-t-transparent rounded-full animate-spin" />
//                         <span className="font-medium">Processing...</span>
//                       </>
//                     ) : (
//                       <>
//                         <BiSolidPurchaseTag className="size-3 sm:size-4" />
//                         <span className="font-medium ">Buy Now</span>
//                       </>
//                     )}
//                   </button>

//                   <button
//                     onClick={(e) => handleAddToCart(e, product._id)}
//                     disabled={loadingCart.has(product._id)}
//                     className="p-2 bg-gray-100 text-gray-600 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                     aria-label="Add to cart"
//                   >
//                     {loadingCart.has(product._id) ? (
//                       <LoadingSpinner />
//                     ) : (
//                       <FaShoppingCart className="size-4 sm:size-5" />
//                     )}
//                   </button>

//                   <button
//                     onClick={(e) => toggleWishlist(e, product._id)}
//                     disabled={loadingWishlist.has(product._id)}
//                     className="p-2 bg-gray-100 text-gray-600 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                     aria-label="Add to wishlist"
//                   >
//                     {loadingWishlist.has(product._id) ? (
//                       <LoadingSpinner />
//                     ) : wishlist.includes(product._id) ? (
//                       <FaHeart className="text-red-500" size={16} />
//                     ) : (
//                       <FaRegHeart className="size-4 sm:size-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//       </div>
//       {
//         showLoginModal && (
//           <UserLoginModal
//             onClose={closeAllModals}
//             onRegisterClick={openRegisterModal}
//             onLoginSuccess={fetchWishlist}
//           />
//         )
//       }

//       {
//         showRegisterModal && (
//           <UserRegisterModal
//             onClose={closeAllModals}
//             onLoginClick={() => {
//               setShowRegisterModal(false);
//               setShowLoginModal(true);
//             }}
//           />
//         )
//       }
//     </div >
//   );
// };

// export default BestSellingProducts;
