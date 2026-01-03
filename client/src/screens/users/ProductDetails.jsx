// import React, { useState, useEffect, useRef } from "react";
// import { Star, FileText } from "lucide-react";
// import UserNavbar from "../../components/common/UserNavbar";
// import AllUserFooter from "../../components/common/AllUserFooter";
// import { FaWhatsapp } from "react-icons/fa";
// import { FaFacebookSquare } from "react-icons/fa";
// import { IoLogoInstagram } from "react-icons/io5";
// import RelatedProducts from "../../components/Products/RelatedProducts";
// import DetailsRightSection from "../../components/Products/DetailsRightSection";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// import UserLoginModal from "../../components/Login/UserLoginModal";
// import UserRegisterModal from "../../components/Login/UserRegisterModal";
// import BedsCarousel from "../../components/common/BedsCarousel";
// import { useCart } from "../../utils/CartContext";
// import { PiVideoDuotone } from "react-icons/pi";
// import { useNavigate } from "react-router-dom";
// import ImageMagnifier from "./Product/ImageMagnifier";
// import VideoPlayer from "../../components/Products/VideoPlayer";
// import VideoThumbnail from "../../components/Products/VideoThumbnail";
// import ProductReviews from "./Product/ProductReviews";

// const ProductDetails = () => {
//   const params = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState("description");
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [loadingCart, setLoadingCart] = useState(false);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const { addToCart, fetchCartCount } = useCart();
//   const navigate = useNavigate();
//   const [loadingProducts, setLoadingProducts] = useState(new Set());

//   const quoteFormRef = useRef(null);

//   const scrollToQuoteForm = () => {
//     if (quoteFormRef.current) {
//       quoteFormRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//     }
//   };

//   const isUserLoggedIn = () => {
//     return !!localStorage.getItem("pm-user-data");
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${params?.id}`
//         );
//         setProduct(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [params?.id]);

//   // Set default variant when product loads
//   useEffect(() => {
//     if (product?.hasVariants && product?.variants?.length > 0) {
//       const defaultVariant = product.variants.find((v) => v.isDefault);
//       setSelectedVariant(defaultVariant || product.variants[0]);
//     }
//   }, [product]);

//   const getCurrentPrice = () => {
//     if (product?.hasVariants && selectedVariant) {
//       return {
//         price: selectedVariant.price,
//         previous_price: selectedVariant.previous_price,
//       };
//     }
//     return {
//       price: product?.price,
//       previous_price: product?.previous_price,
//     };
//   };

//   const handleShareProduct = (platform) => {
//     const productUrl = window.location.href;
//     const productTitle = product?.name || "Check out this product";
//     const shareMessage = `Check out this product: ${productTitle}`;

//     let shareUrl;

//     switch (platform) {
//       case "facebook":
//         shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//           productUrl
//         )}`;
//         break;

//       case "whatsapp":
//         shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
//           shareMessage + " " + productUrl
//         )}`;
//         break;

//       case "instagram":
//         handleCopyLink();
//         return;

//       default:
//         return;
//     }

//     window.open(shareUrl, "_blank", "width=600,height=400");
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(window.location.href);
//     toast.success("Link copied! Now share it via Instagram DM.");
//   };

//   const handleBuyNowClick = async (productId) => {
//     if (!isUserLoggedIn()) {
//       openLoginModal();
//       return;
//     }

//     setLoadingProducts((prev) => new Set(prev).add(productId));

//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${productId}`
//       );

//       if (response.status === 200) {
//         const prod = response.data;
//         const buyData = {
//           product: prod,
//           quantity: quantity,
//         };

//         // Add variant info if product has variants
//         if (prod.hasVariants && selectedVariant) {
//           buyData.selectedVariant = selectedVariant;
//         }

//         localStorage.setItem("buy-now-product", JSON.stringify(buyData));
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

//   const handleQuantityChange = (type) => {
//     if (type === "increment") {
//       setQuantity(quantity + 1);
//     } else if (type === "decrement" && quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };

//   const extractYoutubeId = (url) => {
//     if (!url) return "fnfkV_MaLr0";
//     const regExp =
//       /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? match[2] : "fnfkV_MaLr0";
//   };

//   const handleMediaSelect = (index, isVideo = false) => {
//     setCurrentMediaIndex(index);
//     setIsVideoPlaying(isVideo);
//   };

//   const handleAddToCart = async () => {
//     if (!isUserLoggedIn()) {
//       openLoginModal();
//       return;
//     }

//     setLoadingCart(true);

//     try {
//       const cartData = {
//         productId: params?.id,
//         quantity: quantity,
//       };

//       // Add variant info if product has variants
//       if (product?.hasVariants && selectedVariant) {
//         cartData.variantModel = selectedVariant.model;
//       }

//       const result = await addToCart(params?.id, quantity);

//       if (result.success) {
//         toast.success("Product added to cart successfully!");
//       } else {
//         toast.error("Failed to add product to cart. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast.error("Failed to add product to cart. Please try again.");
//     } finally {
//       setLoadingCart(false);
//     }
//   };

//   const openLoginModal = () => setShowLoginModal(true);
//   const closeAllModals = () => {
//     setShowLoginModal(false);
//     setShowRegisterModal(false);
//   };

//   const openRegisterModal = () => {
//     setShowLoginModal(false);
//     setShowRegisterModal(true);
//   };

//   const renderVariantSelector = () => {
//     if (!product?.hasVariants || !product?.variants?.length) {
//       return null;
//     }

//     return (
//       <div className="mb-4 pb-4 border-b">
//         <h3 className="font-semibold text-sm mb-3">Select Variant</h3>
//         <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
//           {product.variants.map((variant, index) => (
//             <button
//               key={index}
//               onClick={() => setSelectedVariant(variant)}
//               className={`p-2 rounded-lg border-2 transition text-sm ${
//                 selectedVariant?.model === variant.model
//                   ? "border-orange-500 bg-orange-50"
//                   : "border-gray-200 bg-white hover:border-gray-300"
//               }`}
//             >
//               <div className="text-left">
//                 <p className="font-semibold text-xs">{variant.model}</p>
//                 <div className="flex items-center gap-1 mt-1">
//                   <span className="text-sm font-bold text-green-700">
//                     ₹{variant.price}
//                   </span>
//                   {variant.previous_price && (
//                     <span className="text-xs text-gray-500 line-through">
//                       ₹{variant.previous_price}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500">
//         Error: {error}
//       </div>
//     );
//   }

//   const { price, previous_price } = getCurrentPrice();

//   return (
//     <React.Fragment>
//       <Toaster />

//       {showLoginModal && (
//         <UserLoginModal
//           onClose={closeAllModals}
//           onRegisterClick={openRegisterModal}
//         />
//       )}

//       {showRegisterModal && (
//         <UserRegisterModal
//           onClose={closeAllModals}
//           onLoginClick={openLoginModal}
//         />
//       )}

//       <UserNavbar />
//       <BedsCarousel />
//       <div className="bg-[#FFF9F9] min-h-screen px-4 md:px-6 xl:px-6 py-4">
//         <div className="mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
//             {loading ? (
//               skeletonLoader()
//             ) : (
//               <div className="lg:col-span-7">
//                 <div className=" rounded border">
//                   {/* Product Section */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
//                     <div>
//                       <div className="bg-gray-100 rounded-lg mb-4 h-80 overflow-visible shadow-md">
//                         {isVideoPlaying ? (
//                           <VideoPlayer
//                             videoUrl={product?.production_video}
//                             videoTitle="Demo video player"
//                           />
//                         ) : (
//                           <ImageMagnifier
//                             imageUrl={product.images[currentMediaIndex]}
//                             altText={product.name}
//                           />
//                         )}
//                       </div>

//                       <div className="flex items-center gap-4">
//                         <div className="flex gap-4">
//                           {/* Display only first 3 images */}
//                           {product.images.slice(0, 3).map((image, index) => (
//                             <div
//                               key={index}
//                               className={`w-16 md:w-28 h-16 bg-gray-200 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer ${
//                                 index === currentMediaIndex && !isVideoPlaying
//                                   ? "ring-2 ring-orange-500"
//                                   : ""
//                               }`}
//                               onClick={() => handleMediaSelect(index, false)}
//                             >
//                               <img
//                                 src={image}
//                                 alt={`Product thumbnail ${index + 1}`}
//                                 className="w-full h-full object-cover rounded-lg"
//                               />
//                             </div>
//                           ))}
//                         </div>
//                         {/* Video thumbnail - always displayed */}
//                         <VideoThumbnail
//                           videoUrl={product?.production_video}
//                           isActive={isVideoPlaying}
//                           onClick={() => handleMediaSelect(0, true)}
//                           title="Production video"
//                         />
//                       </div>
//                     </div>

//                     {/* Product Info */}
//                     <div>
//                       <h1 className="text-xl font-bold mb-2">{product.name}</h1>

//                       <div className="flex items-center gap-2 mb-2">
//                         <div className="flex text-yellow-400">
//                           {[...Array(5)].map((_, i) => (
//                             <Star
//                               key={i}
//                               size={12}
//                               fill={
//                                 i < Math.floor(product.ratings)
//                                   ? "currentColor"
//                                   : "none"
//                               }
//                             />
//                           ))}
//                         </div>
//                         <span className="text-sm text-gray-500">
//                           {product.ratings} Ratings
//                         </span>
//                       </div>

//                       <div className="flex items-center gap-2 mb-4">
//                         <span className="text-xl font-bold">₹{price}</span>
//                         {previous_price && (
//                           <span className="text-sm text-gray-500 line-through">
//                             ₹{previous_price}
//                           </span>
//                         )}
//                         {previous_price && (
//                           <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
//                             Discount
//                           </span>
//                         )}
//                       </div>

//                       <div className="flex items-center justify-between mb-4 pt-4 border-t">
//                         {product.brandStatus && (
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm">Brand:</span>
//                             <span className="text-sm font-medium">
//                               {product.brand}
//                             </span>
//                           </div>
//                         )}
//                         <div className="flex items-center gap-2">
//                           <span className="text-sm">Share:</span>
//                           <div className="flex gap-2">
//                             <FaWhatsapp
//                               size={20}
//                               color="green"
//                               className="cursor-pointer hover:scale-110 transition"
//                               onClick={() => handleShareProduct("whatsapp")}
//                             />
//                             <FaFacebookSquare
//                               size={20}
//                               color="blue"
//                               className="cursor-pointer hover:scale-110 transition"
//                               onClick={() => handleShareProduct("facebook")}
//                             />
//                             <IoLogoInstagram
//                               size={20}
//                               color="pink"
//                               className="cursor-pointer hover:scale-110 transition"
//                               onClick={() => handleShareProduct("instagram")}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
//                         {product.description.length > 200
//                           ? product.description.substring(0, 200) + "..."
//                           : product.description}
//                       </p>

//                       {renderVariantSelector()}

//                       <div className="flex flex-wrap md:flex-nowrap items-center gap-1 mb-4 w-full">
//                         <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm h-10">
//                           <button
//                             className="px-3 h-full hover:bg-gray-200 transition"
//                             onClick={() => handleQuantityChange("decrement")}
//                           >
//                             -
//                           </button>
//                           <span className="px-4">{quantity}</span>
//                           <button
//                             className="px-3 h-full hover:bg-gray-200 transition"
//                             onClick={() => handleQuantityChange("increment")}
//                           >
//                             +
//                           </button>
//                         </div>
//                         <button
//                           onClick={handleAddToCart}
//                           disabled={loadingCart}
//                           className="flex-1 bg-orange-500 h-10 text-white px-4 rounded-full text-sm flex items-center justify-center gap-2 shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
//                         >
//                           {loadingCart ? (
//                             <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                           ) : (
//                             "Add to Cart"
//                           )}
//                         </button>
//                         <button
//                           onClick={() => handleBuyNowClick(product._id)}
//                           disabled={loadingProducts.has(product._id)}
//                           className="flex-1 border h-10 px-2 text-sm rounded-full hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
//                         >
//                           {loadingProducts.has(product._id) ? (
//                             <div className="flex items-center justify-center gap-1">
//                               <div className="w-3 h-3 border-[2px] border-gray-600 border-t-transparent rounded-full animate-spin" />
//                               <span>Processing...</span>
//                             </div>
//                           ) : (
//                             <>Buy Now</>
//                           )}
//                         </button>
//                         <div
//                           className="p-2 flex justify-start gap-1 items-center bg-[#00395f] rounded-full text-white hover:scale-110 transition-transform duration-300 cursor-pointer"
//                           onClick={scrollToQuoteForm}
//                         >
//                           <FileText size={16} />
//                           <p className="text-sm">Instant Quotation</p>
//                         </div>
//                       </div>

//                       <div className="text-sm pt-4 border-t">
//                         <div className="mb-1">
//                           <span className="font-medium">Categories: </span>
//                           <span className="text-gray-600">
//                             {product?.category?.name}
//                           </span>
//                         </div>
//                         <div>
//                           <span className="font-medium">Sub-Category: </span>
//                           <span className="text-gray-600">
//                             {product?.subCategory?.name}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="border-t">
//                     <div className="flex justify-center md:pt-2 border-b">
//                       <button
//                         className={`px-6 py-3 text-sm font-medium transition-colors ${
//                           activeTab === "description"
//                             ? "text-orange-600 border-b-2 border-orange-600"
//                             : "text-gray-600 hover:text-orange-600"
//                         }`}
//                         onClick={() => setActiveTab("description")}
//                       >
//                         Descriptions
//                       </button>
//                       <button
//                         className={`px-6 py-3 text-sm font-medium transition-colors ${
//                           activeTab === "additional"
//                             ? "text-orange-600 border-b-2 border-orange-600"
//                             : "text-gray-600 hover:text-orange-600"
//                         }`}
//                         onClick={() => setActiveTab("additional")}
//                       >
//                         Additional Information
//                       </button>
//                       <button
//                         className={`px-6 py-3 text-sm font-medium transition-colors ${
//                           activeTab === "reviews"
//                             ? "text-orange-600 border-b-2 border-orange-600"
//                             : "text-gray-600 hover:text-orange-600"
//                         }`}
//                         onClick={() => setActiveTab("reviews")}
//                       >
//                         Reviews
//                       </button>
//                     </div>

//                     <div className="p-6">
//                       {activeTab === "description" ? (
//                         <>
//                           <p className="text-gray-700 mb-6 tracking-wide">
//                             {product.description}
//                           </p>

//                           <h3 className="font-bold text-xl mb-4 tracking-wide">
//                             Product Details
//                           </h3>

//                           <div className="grid gap-6">
//                             <div>
//                               <h4 className="font-semibold text-medium mb-3 tracking-wide">
//                                 Product Specifications
//                               </h4>
//                               <div className="text-sm">
//                                 {[
//                                   {
//                                     label: "Warranty",
//                                     value: product.warranty.hasWarranty
//                                       ? product.warranty.warrantyDays
//                                       : "No warranty",
//                                   },
//                                   {
//                                     label: "Automatic Grade",
//                                     value: product.automaticGrade,
//                                   },
//                                   {
//                                     label: "Control System",
//                                     value: product.controlSystem,
//                                   },
//                                   {
//                                     label: "Product Type",
//                                     value: product.productType,
//                                   },
//                                   {
//                                     label: "Material",
//                                     value: product.material,
//                                   },
//                                   {
//                                     label: "Energy Consumption",
//                                     value: product.energyConsumption,
//                                   },
//                                 ].map((spec, index) => (
//                                   <div
//                                     key={index}
//                                     className="flex py-1 border-b border-gray-100"
//                                   >
//                                     <span className="text-gray-600 font-bold w-48">
//                                       {spec.label}
//                                     </span>
//                                     <span className="text-gray-900">
//                                       {spec.value}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         </>
//                       ) : (
//                         <div>
//                           <h4 className="font-semibold text-medium mb-3 tracking-wide">
//                             Trade Information
//                           </h4>
//                           <div className="text-sm">
//                             {[
//                               {
//                                 label: "Payment Terms",
//                                 value: product.tradeInfo.paymentTerms,
//                               },
//                               {
//                                 label: "Delivery Time",
//                                 value: product.tradeInfo.deliveryTime,
//                               },
//                               {
//                                 label: "Supply Ability",
//                                 value: product.tradeInfo.supplyAbility,
//                               },
//                               {
//                                 label: "Main Domestic Market",
//                                 value: product.tradeInfo.mainDomesticMarket,
//                               },
//                               {
//                                 label: "Return Policy",
//                                 value: product.return_policy,
//                               },
//                             ].map((info, index) => (
//                               <div
//                                 key={index}
//                                 className="flex py-1 border-b border-gray-100"
//                               >
//                                 <span className="text-gray-600 font-bold w-48">
//                                   {info.label}
//                                 </span>
//                                 <span className="text-gray-900">
//                                   {info.value}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <DetailsRightSection
//               product={product}
//               quantity={quantity}
//               onQuantityChange={handleQuantityChange}
//               selectedVariant={selectedVariant}
//               ref={quoteFormRef}
//             />
//           </div>

//           <RelatedProducts subCategoryId={product?.subCategory?._id} />
//         </div>
//       </div>
//       <AllUserFooter />
//     </React.Fragment>
//   );
// };

// export default ProductDetails;

// const skeletonLoader = () => {
//   return (
//     <div className="lg:col-span-7 animate-pulse">
//       <div className="rounded border">
//         {/* Product Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
//           {/* Image Section */}
//           <div>
//             <div className="bg-gray-200 rounded-lg mb-4 h-80 overflow-hidden shadow-md"></div>

//             <div className="flex gap-4">
//               {/* Updated skeleton to show only 3 images + video */}
//               {[...Array(4)].map((_, index) => (
//                 <div
//                   key={index}
//                   className="w-16 md:w-28 h-16 bg-gray-200 rounded-lg"
//                 ></div>
//               ))}
//             </div>
//           </div>

//           {/* Product Info */}
//           <div>
//             <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>

//             <div className="flex items-center gap-2 mb-4">
//               <div className="flex gap-1">
//                 {[...Array(5)].map((_, i) => (
//                   <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
//                 ))}
//               </div>
//               <div className="h-4 bg-gray-200 w-20 rounded"></div>
//             </div>

//             <div className="flex items-center gap-2 mb-4">
//               <div className="h-6 bg-gray-200 w-24 rounded"></div>
//               <div className="h-4 bg-gray-200 w-16 rounded"></div>
//               <div className="h-4 bg-gray-200 w-16 rounded"></div>
//             </div>

//             <div className="flex items-center justify-between mb-4 pt-4 border-t">
//               <div className="h-4 bg-gray-200 w-32 rounded"></div>
//               <div className="h-4 bg-gray-200 w-24 rounded"></div>
//             </div>

//             <div className="space-y-2 mb-4">
//               <div className="h-4 bg-gray-200 rounded"></div>
//               <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
//             </div>

//             <div className="flex flex-wrap items-center gap-3 mb-4">
//               <div className="h-10 w-28 bg-gray-200 rounded-full"></div>
//               <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
//               <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
//               <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
//             </div>

//             <div className="space-y-2 pt-4 border-t">
//               <div className="h-4 bg-gray-200 w-48 rounded"></div>
//               <div className="h-4 bg-gray-200 w-48 rounded"></div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs Section */}
//         <div className="border-t">
//           <div className="flex justify-center md:pt-2 border-b">
//             <div className="h-10 w-32 bg-gray-200 rounded mx-2"></div>
//             <div className="h-10 w-40 bg-gray-200 rounded mx-2"></div>
//           </div>

//           <div className="p-6 space-y-4">
//             <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
//             <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
//             <div className="h-4 bg-gray-200 w-full rounded"></div>
//             <div className="h-4 bg-gray-200 w-2/3 rounded"></div>

//             <div className="h-6 bg-gray-200 w-1/3 rounded mt-6"></div>

//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="flex py-1 border-b border-gray-100">
//                 <div className="h-4 bg-gray-200 w-48 rounded"></div>
//                 <div className="h-4 bg-gray-200 w-32 rounded ml-4"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect, useRef } from "react";
import { Star, FileText } from "lucide-react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import RelatedProducts from "../../components/Products/RelatedProducts";
import DetailsRightSection from "../../components/Products/DetailsRightSection";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import UserLoginModal from "../../components/Login/UserLoginModal";
import UserRegisterModal from "../../components/Login/UserRegisterModal";
import BedsCarousel from "../../components/common/BedsCarousel";
import { useCart } from "../../utils/CartContext";
import { PiVideoDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import ImageMagnifier from "./Product/ImageMagnifier";
import VideoPlayer from "../../components/Products/VideoPlayer";
import VideoThumbnail from "../../components/Products/VideoThumbnail";
import ProductReviews from "./Product/ProductReviews";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart, fetchCartCount } = useCart();
  const navigate = useNavigate();
  const [loadingProducts, setLoadingProducts] = useState(new Set());

  const quoteFormRef = useRef(null);

  const scrollToQuoteForm = () => {
    if (quoteFormRef.current) {
      quoteFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const isUserLoggedIn = () => {
    return !!localStorage.getItem("pm-user-data");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${params?.id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  // Set default variant when product loads
  useEffect(() => {
    if (product?.hasVariants && product?.variants?.length > 0) {
      const defaultVariant = product.variants.find((v) => v.isDefault);
      setSelectedVariant(defaultVariant || product.variants[0]);
    }
  }, [product]);

  const getCurrentPrice = () => {
    if (product?.hasVariants && selectedVariant) {
      return {
        price: selectedVariant.price,
        previous_price: selectedVariant.previous_price,
      };
    }
    return {
      price: product?.price,
      previous_price: product?.previous_price,
    };
  };

  const handleShareProduct = (platform) => {
    const productUrl = window.location.href;
    const productTitle = product?.name || "Check out this product";
    const shareMessage = `Check out this product: ${productTitle}`;

    let shareUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          productUrl
        )}`;
        break;

      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          shareMessage + " " + productUrl
        )}`;
        break;

      case "instagram":
        handleCopyLink();
        return;

      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied! Now share it via Instagram DM.");
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
        const prod = response.data;
        const buyData = {
          product: prod,
          quantity: quantity,
        };

        // Add variant info if product has variants
        if (prod.hasVariants && selectedVariant) {
          buyData.selectedVariant = selectedVariant;
        }

        localStorage.setItem("buy-now-product", JSON.stringify(buyData));
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

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const extractYoutubeId = (url) => {
    if (!url) return "fnfkV_MaLr0";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "fnfkV_MaLr0";
  };

  const handleMediaSelect = (index, isVideo = false) => {
    setCurrentMediaIndex(index);
    setIsVideoPlaying(isVideo);
  };

  const handleAddToCart = async () => {
    if (!isUserLoggedIn()) {
      openLoginModal();
      return;
    }

    setLoadingCart(true);

    try {
      const cartData = {
        productId: params?.id,
        quantity: quantity,
      };

      // Add variant info if product has variants
      if (product?.hasVariants && selectedVariant) {
        cartData.variantModel = selectedVariant.model;
      }

      const result = await addToCart(params?.id, quantity);

      if (result.success) {
        toast.success("Product added to cart successfully!");
      } else {
        toast.error("Failed to add product to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    } finally {
      setLoadingCart(false);
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

  const renderVariantSelector = () => {
    if (!product?.hasVariants || !product?.variants?.length) {
      return null;
    }

    return (
      <div className="mb-4 pb-4 border-b">
        <h3 className="font-semibold text-sm mb-3">Select Variant</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {product.variants.map((variant, index) => (
            <button
              key={index}
              onClick={() => setSelectedVariant(variant)}
              className={`p-2 rounded-lg border-2 transition text-sm ${
                selectedVariant?.model === variant.model
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-left">
                <p className="font-semibold text-xs">{variant.model}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-bold text-green-700">
                    ₹{variant.price}
                  </span>
                  {variant.previous_price && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{variant.previous_price}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  const { price, previous_price } = getCurrentPrice();

  return (
    <React.Fragment>
      <Toaster />

      {showLoginModal && (
        <UserLoginModal
          onClose={closeAllModals}
          onRegisterClick={openRegisterModal}
        />
      )}

      {showRegisterModal && (
        <UserRegisterModal
          onClose={closeAllModals}
          onLoginClick={openLoginModal}
        />
      )}

      <UserNavbar />
      <BedsCarousel />
      <div className="bg-[#FFF9F9] min-h-screen px-4 md:px-6 xl:px-6 py-4">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            {loading ? (
              skeletonLoader()
            ) : (
              <div className="lg:col-span-7">
                <div className=" rounded border">
                  {/* Product Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div>
                      <div className="bg-gray-100 rounded-lg mb-4 h-80 overflow-visible shadow-md">
                        {isVideoPlaying ? (
                          <VideoPlayer
                            videoUrl={product?.production_video}
                            videoTitle="Demo video player"
                          />
                        ) : (
                          <ImageMagnifier
                            imageUrl={product.images[currentMediaIndex]}
                            altText={product.name}
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-4">
                          {/* Display only first 3 images */}
                          {product.images.slice(0, 3).map((image, index) => (
                            <div
                              key={index}
                              className={`w-16 md:w-28 h-16 bg-gray-200 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer ${
                                index === currentMediaIndex && !isVideoPlaying
                                  ? "ring-2 ring-orange-500"
                                  : ""
                              }`}
                              onClick={() => handleMediaSelect(index, false)}
                            >
                              <img
                                src={image}
                                alt={`Product thumbnail ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                        {/* Video thumbnail - always displayed */}
                        <VideoThumbnail
                          videoUrl={product?.production_video}
                          isActive={isVideoPlaying}
                          onClick={() => handleMediaSelect(0, true)}
                          title="Production video"
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div>
                      <h1 className="text-xl font-bold mb-2">{product.name}</h1>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={
                                i < Math.floor(product.ratings)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {product.ratings} Ratings
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold">₹{price}</span>
                        {previous_price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{previous_price}
                          </span>
                        )}
                        {previous_price && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            Discount
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-4 pt-4 border-t">
                        {product.brandStatus && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Brand:</span>
                            <span className="text-sm font-medium">
                              {product.brand}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Share:</span>
                          <div className="flex gap-2">
                            <FaWhatsapp
                              size={20}
                              color="green"
                              className="cursor-pointer hover:scale-110 transition"
                              onClick={() => handleShareProduct("whatsapp")}
                            />
                            <FaFacebookSquare
                              size={20}
                              color="blue"
                              className="cursor-pointer hover:scale-110 transition"
                              onClick={() => handleShareProduct("facebook")}
                            />
                            <IoLogoInstagram
                              size={20}
                              color="pink"
                              className="cursor-pointer hover:scale-110 transition"
                              onClick={() => handleShareProduct("instagram")}
                            />
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                        {product.description.length > 200
                          ? product.description.substring(0, 200) + "..."
                          : product.description}
                      </p>

                      {renderVariantSelector()}

                      <div className="flex flex-wrap md:flex-nowrap items-center gap-1 mb-4 w-full">
                        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm h-10">
                          <button
                            className="px-3 h-full hover:bg-gray-200 transition"
                            onClick={() => handleQuantityChange("decrement")}
                          >
                            -
                          </button>
                          <span className="px-4">{quantity}</span>
                          <button
                            className="px-3 h-full hover:bg-gray-200 transition"
                            onClick={() => handleQuantityChange("increment")}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={handleAddToCart}
                          disabled={loadingCart}
                          className="flex-1 bg-orange-500 h-10 text-white px-4 rounded-full text-sm flex items-center justify-center gap-2 shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
                        >
                          {loadingCart ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          ) : (
                            "Add to Cart"
                          )}
                        </button>
                        <button
                          onClick={() => handleBuyNowClick(product._id)}
                          disabled={loadingProducts.has(product._id)}
                          className="flex-1 border h-10 px-2 text-sm rounded-full hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                          {loadingProducts.has(product._id) ? (
                            <div className="flex items-center justify-center gap-1">
                              <div className="w-3 h-3 border-[2px] border-gray-600 border-t-transparent rounded-full animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <>Buy Now</>
                          )}
                        </button>
                        <div
                          className="p-2 flex justify-start gap-1 items-center bg-[#00395f] rounded-full text-white hover:scale-110 transition-transform duration-300 cursor-pointer"
                          onClick={scrollToQuoteForm}
                        >
                          <FileText size={16} />
                          <p className="text-sm">Instant Quotation</p>
                        </div>
                      </div>

                      <div className="text-sm pt-4 border-t">
                        <div className="mb-1">
                          <span className="font-medium">Categories: </span>
                          <span className="text-gray-600">
                            {product?.category?.name}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Sub-Category: </span>
                          <span className="text-gray-600">
                            {product?.subCategory?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs Section */}
                  <div className="border-t">
                    <div className="flex justify-center md:pt-2 border-b">
                      <button
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                          activeTab === "description"
                            ? "text-orange-600 border-b-2 border-orange-600"
                            : "text-gray-600 hover:text-orange-600"
                        }`}
                        onClick={() => setActiveTab("description")}
                      >
                        Descriptions
                      </button>
                      <button
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                          activeTab === "additional"
                            ? "text-orange-600 border-b-2 border-orange-600"
                            : "text-gray-600 hover:text-orange-600"
                        }`}
                        onClick={() => setActiveTab("additional")}
                      >
                        Additional Information
                      </button>
                    </div>

                    <div className="p-6">
                      {activeTab === "description" ? (
                        <>
                          <p className="text-gray-700 mb-6 tracking-wide">
                            {product.description}
                          </p>

                          <h3 className="font-bold text-xl mb-4 tracking-wide">
                            Product Details
                          </h3>

                          <div className="grid gap-6">
                            <div>
                              <h4 className="font-semibold text-medium mb-3 tracking-wide">
                                Product Specifications
                              </h4>
                              <div className="text-sm">
                                {[
                                  {
                                    label: "Warranty",
                                    value: product.warranty.hasWarranty
                                      ? product.warranty.warrantyDays
                                      : "No warranty",
                                  },
                                  {
                                    label: "Automatic Grade",
                                    value: product.automaticGrade,
                                  },
                                  {
                                    label: "Control System",
                                    value: product.controlSystem,
                                  },
                                  {
                                    label: "Product Type",
                                    value: product.productType,
                                  },
                                  {
                                    label: "Material",
                                    value: product.material,
                                  },
                                  {
                                    label: "Energy Consumption",
                                    value: product.energyConsumption,
                                  },
                                ].map((spec, index) => (
                                  <div
                                    key={index}
                                    className="flex py-1 border-b border-gray-100"
                                  >
                                    <span className="text-gray-600 font-bold w-48">
                                      {spec.label}
                                    </span>
                                    <span className="text-gray-900">
                                      {spec.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <h4 className="font-semibold text-medium mb-3 tracking-wide">
                            Trade Information
                          </h4>
                          <div className="text-sm">
                            {[
                              {
                                label: "Payment Terms",
                                value: product.tradeInfo.paymentTerms,
                              },
                              {
                                label: "Delivery Time",
                                value: product.tradeInfo.deliveryTime,
                              },
                              {
                                label: "Supply Ability",
                                value: product.tradeInfo.supplyAbility,
                              },
                              {
                                label: "Main Domestic Market",
                                value: product.tradeInfo.mainDomesticMarket,
                              },
                              {
                                label: "Return Policy",
                                value: product.return_policy,
                              },
                            ].map((info, index) => (
                              <div
                                key={index}
                                className="flex py-1 border-b border-gray-100"
                              >
                                <span className="text-gray-600 font-bold w-48">
                                  {info.label}
                                </span>
                                <span className="text-gray-900">
                                  {info.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reviews Section - Displayed Below Tabs */}
                  <div className="border-t">
                    <ProductReviews productId={product?._id} />
                  </div>
                </div>
              </div>
            )}

            <DetailsRightSection
              product={product}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              selectedVariant={selectedVariant}
              ref={quoteFormRef}
            />
          </div>

          <RelatedProducts subCategoryId={product?.subCategory?._id} />
        </div>
      </div>
      <AllUserFooter />
    </React.Fragment>
  );
};

export default ProductDetails;

const skeletonLoader = () => {
  return (
    <div className="lg:col-span-7 animate-pulse">
      <div className="rounded border">
        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div>
            <div className="bg-gray-200 rounded-lg mb-4 h-80 overflow-hidden shadow-md"></div>

            <div className="flex gap-4">
              {/* Updated skeleton to show only 3 images + video */}
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-16 md:w-28 h-16 bg-gray-200 rounded-lg"
                ></div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 w-20 rounded"></div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 bg-gray-200 w-24 rounded"></div>
              <div className="h-4 bg-gray-200 w-16 rounded"></div>
              <div className="h-4 bg-gray-200 w-16 rounded"></div>
            </div>

            <div className="flex items-center justify-between mb-4 pt-4 border-t">
              <div className="h-4 bg-gray-200 w-32 rounded"></div>
              <div className="h-4 bg-gray-200 w-24 rounded"></div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="h-10 w-28 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="h-4 bg-gray-200 w-48 rounded"></div>
              <div className="h-4 bg-gray-200 w-48 rounded"></div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t">
          <div className="flex justify-center md:pt-2 border-b">
            <div className="h-10 w-32 bg-gray-200 rounded mx-2"></div>
            <div className="h-10 w-40 bg-gray-200 rounded mx-2"></div>
          </div>

          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
            <div className="h-4 bg-gray-200 w-full rounded"></div>
            <div className="h-4 bg-gray-200 w-2/3 rounded"></div>

            <div className="h-6 bg-gray-200 w-1/3 rounded mt-6"></div>

            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex py-1 border-b border-gray-100">
                <div className="h-4 bg-gray-200 w-48 rounded"></div>
                <div className="h-4 bg-gray-200 w-32 rounded ml-4"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="border-t p-6 animate-pulse">
          <div className="h-6 bg-gray-200 w-48 rounded mb-6"></div>

          {/* Statistics Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-6 border-b">
            <div className="bg-gray-200 p-6 rounded-lg h-32"></div>
            <div className="md:col-span-2 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Skeleton */}
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border-b pb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 w-32 rounded mb-2"></div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <div
                          key={j}
                          className="w-4 h-4 bg-gray-200 rounded"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                </div>
                <div className="flex gap-3">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="w-24 h-24 bg-gray-200 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
