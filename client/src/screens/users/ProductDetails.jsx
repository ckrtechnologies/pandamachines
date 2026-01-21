import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  FileText,
  Share2,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
import HowToBuySteps from "./HowToBuySteps";

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
  const [selectedSize, setSelectedSize] = useState(null);

  // State for expandable sections
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showAllTradeInfo, setShowAllTradeInfo] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [isAtTop, setIsAtTop] = useState(false);
  const mainContainerRef = useRef(null);
  const quoteFormRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (mainContainerRef.current) {
        const rect = mainContainerRef.current.getBoundingClientRect();
        // 96px corresponds to the sticky top-24 threshold (24 * 4px)
        // Only consider at top if we are on larger screens where sticky is active
        const isLargeScreen = window.innerWidth >= 1024;
        setIsAtTop(isLargeScreen && rect.top <= 96);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${params?.id}`,
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

    // Set default size for multiple size type
    if (
      product?.size_type === "multiple" &&
      product?.price_by_measurement?.[0]?.allPrice?.length > 0
    ) {
      setSelectedSize(product.price_by_measurement[0].allPrice[0].measurement);
    }
  }, [product]);

  const getCurrentPrice = () => {
    if (product?.hasVariants && selectedVariant) {
      return {
        price: selectedVariant.price,
        previous_price: selectedVariant.previous_price,
      };
    }

    if (product?.size_type === "multiple" && selectedSize) {
      const measuredPrice = product?.price_by_measurement?.[0]?.allPrice?.find(
        (p) => p.measurement === selectedSize,
      );
      if (measuredPrice) {
        return {
          price: measuredPrice.price,
          previous_price: measuredPrice.previous_price,
        };
      }
    }

    return {
      price: product?.price,
      previous_price: product?.previous_price,
      gstPercentage: product?.gstPercentage || 0,
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
          productUrl,
        )}`;
        break;

      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          shareMessage + " " + productUrl,
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

    const { price } = getCurrentPrice();
    const totalPrice =
      Number(price) +
      (Number(price) * (Number(product?.gstPercentage) || 0)) / 100;

    if (totalPrice < 2000) {
      toast.error("Minimum purchase value must be ₹2,000.");
      return;
    }

    setLoadingProducts((prev) => new Set(prev).add(productId));

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${productId}`,
      );

      if (response.status === 200) {
        const prod = response.data;
        const buyData = {
          product: prod,
          quantity: quantity,
        };

        if (prod.size_type === "multiple" && selectedSize) {
          buyData.measurement = selectedSize;
        }

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

    const { price } = getCurrentPrice();
    const totalPrice =
      Number(price) +
      (Number(price) * (Number(product?.gstPercentage) || 0)) / 100;

    if (totalPrice < 2000) {
      toast.error("Minimum purchase value must be ₹2,000.");
      return;
    }

    setLoadingCart(true);

    try {
      const cartData = {
        productId: params?.id,
        quantity: quantity,
      };

      if (product?.size_type === "multiple" && selectedSize) {
        cartData.measurement = selectedSize;
      }

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
                    ₹
                    {Number(variant.price) +
                      (Number(variant.price) *
                        (Number(product?.gstPercentage) || 0)) /
                        100}
                  </span>
                  {variant.previous_price && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹
                      {Number(variant.previous_price) +
                        (Number(variant.previous_price) *
                          (Number(product?.gstPercentage) || 0)) /
                          100}
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
      <div
        ref={mainContainerRef}
        className="bg-[#FFF9F9] min-h-screen px-4 md:px-6 xl:px-6 py-4"
      >
        <div className="mx-auto">
          {/* <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            {loading ? (
              skeletonLoader()
            ) : (
              <div className="lg:col-span-7">
                <div className=" rounded border">
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
                        <VideoThumbnail
                          videoUrl={product?.production_video}
                          isActive={isVideoPlaying}
                          onClick={() => handleMediaSelect(0, true)}
                          title="Production video"
                        />
                      </div>
                    </div>

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
                                    <span className="text-gray-600 font-bold w-32 md:w-48 shrink-0">
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
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {loading ? (
              skeletonLoader()
            ) : (
              <>
                {/* LEFT SECTION - IMAGE (STICKY ON DESKTOP) */}
                <div className="lg:col-span-3">
                  <div className="lg:sticky lg:top-24 space-y-4">
                    <div className="bg-white rounded border p-4 shadow-sm">
                      <div className="bg-gray-100 rounded-lg mb-4 shadow-xs flex items-center justify-center relative overflow-hidden group/image">
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

                        {/* ACTION BUTTONS */}
                        <div className="absolute top-4 right-4 flex flex-col gap-3 items-end z-10">
                          {/* Share Button Group */}
                          <div className="relative group/share">
                            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300">
                              <Share2 size={20} className="text-gray-600" />
                            </button>

                            {/* Share Options (appears on hover) */}
                            <div className="absolute right-full top-0 mr-3 flex gap-3 bg-white p-2 rounded-full shadow-xl opacity-0 invisible group-hover/share:opacity-100 group-hover/share:visible transition-all duration-300 transform translate-x-2 group-hover/share:translate-x-0 border">
                              <FaWhatsapp
                                size={20}
                                className="text-[#25D366] cursor-pointer hover:scale-125 transition-transform"
                                onClick={() => handleShareProduct("whatsapp")}
                              />
                              <IoLogoInstagram
                                size={20}
                                className="text-[#E4405F] cursor-pointer hover:scale-125 transition-transform"
                                onClick={() => handleShareProduct("instagram")}
                              />
                              <FaFacebookSquare
                                size={20}
                                className="text-[#1877F2] cursor-pointer hover:scale-125 transition-transform"
                                onClick={() => handleShareProduct("facebook")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          {product.images.slice(0, 3).map((image, index) => (
                            <div
                              key={index}
                              className={`w-16 h-16 bg-gray-200 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer ${
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
                        <VideoThumbnail
                          videoUrl={product?.production_video}
                          isActive={isVideoPlaying}
                          onClick={() => handleMediaSelect(0, true)}
                          title="Production video"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* MID SECTION - INFO + TABS (SCROLLABLE ON DESKTOP) */}
                <div
                  className={`lg:col-span-4 ${
                    isAtTop
                      ? "lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto"
                      : "lg:overflow-hidden"
                  } scrollbar-hide pr-2`}
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div className="rounded border bg-white p-6 shadow-sm mb-4">
                    {/* PRODUCT INFO */}
                    <div>
                      <h1 className="text-xl font-bold mb-2">{product.name}</h1>

                      {/* Ratings */}
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

                      {/* Price */}
                      <div className="flex flex-col mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">
                            ₹
                            {Number(price) +
                              (Number(price) *
                                (Number(product?.gstPercentage) || 0)) /
                                100}
                          </span>
                          {previous_price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹
                              {Number(previous_price) +
                                (Number(previous_price) *
                                  (Number(product?.gstPercentage) || 0)) /
                                  100}
                            </span>
                          )}
                          {previous_price && <div></div>}
                        </div>
                        <p className="text-[10px] text-green-600 font-semibold mt-0.5">
                          Included GST {product?.gstPercentage || 0}%
                        </p>
                      </div>

                      {/* select sizes - Only for multiple size type */}
                      {product?.size_type === "multiple" &&
                        product?.price_by_measurement?.[0]?.allPrice?.length >
                          0 && (
                          <div className="w-full pb-4">
                            {/* Title */}
                            <h4 className="text-[16px] font-bold text-gray-900 mb-3">
                              {product?.price_by_measurement?.[0]
                                ?.measurementLabel || "Size"}{" "}
                              :
                            </h4>

                            {/* Size Buttons */}
                            <div className="flex flex-wrap gap-3 sm:gap-4">
                              {product.price_by_measurement[0].allPrice.map(
                                (item) => (
                                  <button
                                    key={item.measurement}
                                    onClick={() =>
                                      setSelectedSize(item.measurement)
                                    }
                                    className={`w-auto px-4 h-10 rounded-xl border font-semibold text-sm transition-all duration-200
              ${
                selectedSize === item.measurement
                  ? "border-orange-500 bg-orange-50 border-2 text-gray-900"
                  : "border-gray-300 text-gray-900 hover:border-gray-900"
              }
            `}
                                  >
                                    {item.measurement}
                                  </button>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      {/* Quantity + Buttons */}
                      <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-3 mb-4 w-full">
                        {/* First line on mobile: Quantity selector */}
                        <div className="flex md:hidden items-center border border-gray-300 rounded-full overflow-hidden shadow-sm h-10 shrink-0 w-full justify-center">
                          <button
                            className="px-3 h-full hover:bg-gray-200 transition flex-1"
                            onClick={() => handleQuantityChange("decrement")}
                          >
                            -
                          </button>
                          <span className="px-4">{quantity}</span>
                          <button
                            className="px-3 h-full hover:bg-gray-200 transition flex-1"
                            onClick={() => handleQuantityChange("increment")}
                          >
                            +
                          </button>
                        </div>

                        {/* Desktop quantity selector */}
                        <div className="hidden md:flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm h-10 shrink-0">
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

                        {/* Second line on mobile: Add to Cart & Buy Now buttons */}
                        <div className="flex md:hidden w-full gap-2">
                          <button
                            onClick={handleAddToCart}
                            disabled={loadingCart}
                            className="flex-1 min-w-[120px] bg-orange-500 h-10 text-white px-4 rounded-full text-sm flex items-center justify-center gap-2 shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
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
                            className="flex-1 min-w-[100px] border h-10 px-4 text-sm rounded-full hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
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
                        </div>

                        {/* Desktop Add to Cart button */}
                        <button
                          onClick={handleAddToCart}
                          disabled={loadingCart}
                          className="hidden md:flex flex-1 min-w-[120px] bg-orange-500 h-10 text-white px-4 rounded-full text-sm items-center justify-center gap-2 shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
                        >
                          {loadingCart ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          ) : (
                            "Add to Cart"
                          )}
                        </button>

                        {/* Desktop Buy Now button */}
                        <button
                          onClick={() => handleBuyNowClick(product._id)}
                          disabled={loadingProducts.has(product._id)}
                          className="hidden md:flex flex-1 min-w-[100px] border h-10 px-4 text-sm rounded-full items-center justify-center hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
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

                        {/* Third line on mobile: Instant Quotation */}
                        <div className="flex md:hidden w-full">
                          <div
                            className="flex-1 p-2 flex justify-center gap-1 items-center bg-[#00395f] rounded-full text-white hover:scale-110 transition-transform duration-300 cursor-pointer h-10"
                            onClick={scrollToQuoteForm}
                          >
                            <FileText size={16} />
                            <p className="text-sm">Instant Quotation</p>
                          </div>
                        </div>

                        {/* Desktop Instant Quotation */}
                        <div
                          className="hidden md:flex flex-none p-2 justify-start gap-1 items-center bg-[#00395f] rounded-full text-white hover:scale-110 transition-transform duration-300 cursor-pointer"
                          onClick={scrollToQuoteForm}
                        >
                          <FileText size={16} />
                          <p className="text-sm">Instant Quotation</p>
                        </div>
                      </div>

                      {/* Variant Selector */}
                      {renderVariantSelector()}

                      {/* Categories */}
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

                  {/* PRODUCT SPECIFICATIONS */}
                  <div className="rounded border bg-white shadow-sm mb-4">
                    <div className="p-4 md:p-6">
                      <h3 className="font-bold text-md mb-4 tracking-wide">
                        Product Specifications
                      </h3>
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
                        ]
                          .slice(0, showAllSpecs ? undefined : 3)
                          .map((spec, index) => (
                            <div
                              key={index}
                              className="flex flex-col md:flex-row md:justify-between py-3 md:py-2 border-b border-gray-100 last:border-b-0"
                            >
                              <span className="text-gray-600 font-bold mb-1 md:mb-0">
                                {spec.label}
                              </span>
                              <span className="text-gray-900 break-words md:text-right">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                      </div>
                      <button
                        onClick={() => setShowAllSpecs(!showAllSpecs)}
                        className="mt-4 text-orange-600 font-medium text-sm flex items-center justify-center md:justify-start gap-1 hover:underline w-full md:w-auto"
                      >
                        {showAllSpecs ? "Show Less" : "Show All Specifications"}
                        {showAllSpecs ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* DESCRIPTIONS */}
                  <div className="rounded border bg-white shadow-sm mb-4">
                    <div className="p-6">
                      <h3 className="font-bold text-md mb-4 tracking-wide">
                        Descriptions
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed text-justify">
                        {descExpanded
                          ? product.description
                          : product.description.slice(0, 200) +
                            (product.description.length > 200 ? "..." : "")}
                        {product.description.length > 200 && (
                          <button
                            onClick={() => setDescExpanded(!descExpanded)}
                            className="ml-1 text-orange-600 font-medium hover:underline"
                          >
                            {descExpanded ? "Show Less" : "Read More"}
                          </button>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Additional features */}
                  <div className="rounded-md border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50 shadow-xs mb-6 transition-all duration-300">
                    <div className="p-6">
                      {/* Header with Icon */}
                      <div className="flex items-center gap-3 mb-6">
                        {/* <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div> */}
                        <h3 className="font-bold text-lg text-gray-800 tracking-wide">
                          Additional Features
                        </h3>
                      </div>

                      {/* Features Grid */}
                      <div className="text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            {
                              label: "Payment Terms",
                              value: product.tradeInfo.paymentTerms,
                              icon: "💳",
                            },
                            {
                              label: "Delivery Time",
                              value: product.tradeInfo.deliveryTime,
                              icon: "🚚",
                            },
                            {
                              label: "Supply Ability",
                              value: product.tradeInfo.supplyAbility,
                              icon: "📦",
                            },
                            {
                              label: "Main Domestic Market",
                              value: product.tradeInfo.mainDomesticMarket,
                              icon: "📍",
                            },
                            {
                              label: "Return Policy",
                              value: product.return_policy,
                              icon: "↩️",
                            },
                          ]
                            .slice(0, showAllTradeInfo ? undefined : 3)
                            .map((info, index) => (
                              <div
                                key={index}
                                className="bg-white rounded-lg border border-orange-100 p-4 hover:border-orange-200 transition-all duration-200 group"
                              >
                                <div className="flex items-start gap-3">
                                  {/* Icon */}
                                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center text-lg">
                                    {info.icon}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-700 mb-1 text-sm">
                                      {info.label}
                                    </h4>
                                    <p className="text-gray-900 font-medium text-sm leading-relaxed break-words">
                                      {info.value}
                                    </p>
                                  </div>
                                </div>

                                {/* Hover Effect Line */}
                                <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-orange-400 to-orange-300 transition-all duration-300"></div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Show More/Less Button */}
                      <div className="mt-6 pt-4 border-t border-orange-100">
                        <button
                          onClick={() => setShowAllTradeInfo(!showAllTradeInfo)}
                          className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 w-full md:w-auto text-sm font-semibold text-orange-600 hover:text-orange-700 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg border border-orange-200 hover:border-orange-300 shadow-sm hover:shadow transition-all duration-300"
                        >
                          <span>
                            {showAllTradeInfo
                              ? "Show Less Information"
                              : "Show All Information"}
                          </span>
                          <div
                            className={`transform transition-transform duration-300 ${
                              showAllTradeInfo ? "rotate-180" : ""
                            }`}
                          >
                            {showAllTradeInfo ? (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <HowToBuySteps product={product} />
                  {/* REVIEWS SECTION */}
                  <div className="rounded border bg-white shadow-sm">
                    <ProductReviews
                      productId={product?._id}
                      showAll={showAllReviews}
                      onToggle={() => setShowAllReviews(!showAllReviews)}
                    />
                  </div>
                </div>

                {/* RIGHT SECTION (SCROLLABLE ON DESKTOP) */}
                <div
                  className={`lg:col-span-3 ${
                    isAtTop
                      ? "lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto"
                      : "lg:overflow-hidden"
                  } scrollbar-hide`}
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <DetailsRightSection
                    product={product}
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    selectedVariant={selectedVariant}
                    ref={quoteFormRef}
                  />
                </div>
              </>
            )}
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
    <div className="lg:col-span-10 grid grid-cols-1 lg:grid-cols-10 gap-6 w-full animate-pulse">
      {/* Left Column Skeleton */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded border p-4 shadow-sm">
          <div className="bg-gray-200 rounded-lg mb-4 h-80 shadow-md"></div>
          <div className="flex gap-2">
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-lg border"></div>
          </div>
        </div>
      </div>

      {/* Middle Column Skeleton */}
      <div className="lg:col-span-4 space-y-4">
        {/* Product Info Box */}
        <div className="bg-white rounded border p-6 shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex gap-3 mb-6">
            <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-10 flex-1 bg-gray-200 rounded-full"></div>
            <div className="h-10 flex-1 bg-gray-200 rounded-full"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-2 pt-4 border-t">
            <div className="h-4 bg-gray-200 w-48 rounded"></div>
            <div className="h-4 bg-gray-200 w-48 rounded"></div>
          </div>
        </div>

        {/* Specs Box */}
        <div className="bg-white rounded border p-6 shadow-sm">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex py-1 border-b border-gray-100">
                <div className="h-4 bg-gray-200 w-32 rounded"></div>
                <div className="h-4 bg-gray-200 w-24 rounded ml-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Descriptions Box */}
        <div className="bg-white rounded border p-6 shadow-sm">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>

        {/* Trade Information Box */}
        <div className="bg-white rounded border p-6 shadow-sm">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex py-1 border-b border-gray-100">
                <div className="h-4 bg-gray-200 w-32 rounded"></div>
                <div className="h-4 bg-gray-200 w-24 rounded ml-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Box */}
        <div className="bg-white rounded border p-6 shadow-sm">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 w-24 rounded"></div>
                <div className="h-2 bg-gray-200 w-16 rounded"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 w-full rounded"></div>
          </div>
        </div>
      </div>

      {/* Right Column Skeleton */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded border p-6 shadow-sm h-full min-h-[400px]">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 w-full rounded text-sm"></div>
              <div className="h-4 bg-gray-200 w-5/6 rounded text-sm"></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-full w-full"></div>
            <div className="h-12 bg-gray-200 rounded-full w-full border"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Star,
//   FileText,
//   Share2,
//   Heart,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";
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

//   // State for expandable sections
//   const [showAllSpecs, setShowAllSpecs] = useState(false);
//   const [descExpanded, setDescExpanded] = useState(false);
//   const [showAllTradeInfo, setShowAllTradeInfo] = useState(false);
//   const [showAllReviews, setShowAllReviews] = useState(false);

//   const [isAtTop, setIsAtTop] = useState(false);
//   const mainContainerRef = useRef(null);
//   const quoteFormRef = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (mainContainerRef.current) {
//         const rect = mainContainerRef.current.getBoundingClientRect();
//         // 96px corresponds to the sticky top-24 threshold (24 * 4px)
//         setIsAtTop(rect.top <= 96);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     handleScroll(); // Check once on mount
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

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
//       <div
//         ref={mainContainerRef}
//         className="bg-[#FFF9F9] min-h-screen px-4 md:px-6 xl:px-6 py-4"
//       >
//         <div className="mx-auto">
//           {/* <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
//             {loading ? (
//               skeletonLoader()
//             ) : (
//               <div className="lg:col-span-7">
//                 <div className=" rounded border">
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
//                         <VideoThumbnail
//                           videoUrl={product?.production_video}
//                           isActive={isVideoPlaying}
//                           onClick={() => handleMediaSelect(0, true)}
//                           title="Production video"
//                         />
//                       </div>
//                     </div>

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

//                   <div className="border-t">
//                     <ProductReviews productId={product?._id} />
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
//           </div> */}

//           <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
//             {loading ? (
//               skeletonLoader()
//             ) : (
//               <>
//                 {/* LEFT SECTION - IMAGE (STICKY) */}
//                 <div className="lg:col-span-3">
//                   <div className="sticky top-24 space-y-4">
//                     <div className="bg-white rounded border p-4 shadow-sm">
//                       <div className="bg-gray-100 rounded-lg mb-4 h-80 shadow-md flex items-center justify-center relative overflow-hidden group/image">
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

//                         {/* ACTION BUTTONS */}
//                         <div className="absolute top-4 right-4 flex flex-col gap-3 items-end z-10">
//                           {/* Share Button Group */}
//                           <div className="relative group/share">
//                             <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300">
//                               <Share2 size={20} className="text-gray-600" />
//                             </button>

//                             {/* Share Options (appears on hover) */}
//                             <div className="absolute right-full top-0 mr-3 flex gap-3 bg-white p-2 rounded-full shadow-xl opacity-0 invisible group-hover/share:opacity-100 group-hover/share:visible transition-all duration-300 transform translate-x-2 group-hover/share:translate-x-0 border">
//                               <FaWhatsapp
//                                 size={20}
//                                 className="text-[#25D366] cursor-pointer hover:scale-125 transition-transform"
//                                 onClick={() => handleShareProduct("whatsapp")}
//                               />
//                               <IoLogoInstagram
//                                 size={20}
//                                 className="text-[#E4405F] cursor-pointer hover:scale-125 transition-transform"
//                                 onClick={() => handleShareProduct("instagram")}
//                               />
//                               <FaFacebookSquare
//                                 size={20}
//                                 className="text-[#1877F2] cursor-pointer hover:scale-125 transition-transform"
//                                 onClick={() => handleShareProduct("facebook")}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-4">
//                         <div className="flex gap-2">
//                           {product.images.slice(0, 3).map((image, index) => (
//                             <div
//                               key={index}
//                               className={`w-16 h-16 bg-gray-200 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer ${
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
//                         <VideoThumbnail
//                           videoUrl={product?.production_video}
//                           isActive={isVideoPlaying}
//                           onClick={() => handleMediaSelect(0, true)}
//                           title="Production video"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MID SECTION - INFO + TABS (SCROLLABLE) */}
//                 <div
//                   className={`lg:col-span-4 max-h-[calc(100vh-120px)] ${
//                     isAtTop ? "overflow-y-auto" : "overflow-hidden"
//                   } scrollbar-hide pr-2`}
//                   style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//                 >
//                   <div className="rounded border bg-white p-6 shadow-sm mb-4">
//                     {/* PRODUCT INFO */}
//                     <div>
//                       <h1 className="text-xl font-bold mb-2">{product.name}</h1>

//                       {/* Ratings */}
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

//                       {/* Price */}
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

//                       {/* Quantity + Buttons */}
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

//                       {/* Variant Selector */}
//                       {renderVariantSelector()}

//                       {/* Categories */}
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

//                   {/* PRODUCT SPECIFICATIONS */}
//                   <div className="rounded border bg-white shadow-sm mb-4">
//                     <div className="p-6">
//                       <h3 className="font-bold text-md mb-4 tracking-wide">
//                         Product Specifications
//                       </h3>
//                       <div className="text-sm">
//                         {[
//                           {
//                             label: "Warranty",
//                             value: product.warranty.hasWarranty
//                               ? product.warranty.warrantyDays
//                               : "No warranty",
//                           },
//                           {
//                             label: "Automatic Grade",
//                             value: product.automaticGrade,
//                           },
//                           {
//                             label: "Control System",
//                             value: product.controlSystem,
//                           },
//                           {
//                             label: "Product Type",
//                             value: product.productType,
//                           },
//                           {
//                             label: "Material",
//                             value: product.material,
//                           },
//                           {
//                             label: "Energy Consumption",
//                             value: product.energyConsumption,
//                           },
//                         ]
//                           .slice(0, showAllSpecs ? undefined : 3)
//                           .map((spec, index) => (
//                             <div
//                               key={index}
//                               className="flex py-1 border-b border-gray-100"
//                             >
//                               <span className="text-gray-600 font-bold w-48">
//                                 {spec.label}
//                               </span>
//                               <span className="text-gray-900">
//                                 {spec.value}
//                               </span>
//                             </div>
//                           ))}
//                       </div>
//                       <button
//                         onClick={() => setShowAllSpecs(!showAllSpecs)}
//                         className="mt-4 text-orange-600 font-medium text-sm flex items-center gap-1 hover:underline"
//                       >
//                         {showAllSpecs ? "Show Less" : "Show All Specifications"}
//                         {showAllSpecs ? (
//                           <ChevronUp size={16} />
//                         ) : (
//                           <ChevronDown size={16} />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* DESCRIPTIONS */}
//                   <div className="rounded border bg-white shadow-sm mb-4">
//                     <div className="p-6">
//                       <h3 className="font-bold text-md mb-4 tracking-wide">
//                         Descriptions
//                       </h3>
//                       <p className="text-gray-700 text-sm leading-relaxed text-justify">
//                         {descExpanded
//                           ? product.description
//                           : product.description.slice(0, 200) +
//                             (product.description.length > 200 ? "..." : "")}
//                         {product.description.length > 200 && (
//                           <button
//                             onClick={() => setDescExpanded(!descExpanded)}
//                             className="ml-1 text-orange-600 font-medium hover:underline"
//                           >
//                             {descExpanded ? "Show Less" : "Read More"}
//                           </button>
//                         )}
//                       </p>
//                     </div>
//                   </div>

//                   {/* TRADE INFORMATION */}
//                   <div className="rounded border bg-white shadow-sm mb-4">
//                     <div className="p-6">
//                       <h3 className="font-bold text-md mb-4 tracking-wide">
//                         Trade Information
//                       </h3>
//                       <div className="text-sm">
//                         {[
//                           {
//                             label: "Payment Terms",
//                             value: product.tradeInfo.paymentTerms,
//                           },
//                           {
//                             label: "Delivery Time",
//                             value: product.tradeInfo.deliveryTime,
//                           },
//                           {
//                             label: "Supply Ability",
//                             value: product.tradeInfo.supplyAbility,
//                           },
//                           {
//                             label: "Main Domestic Market",
//                             value: product.tradeInfo.mainDomesticMarket,
//                           },
//                           {
//                             label: "Return Policy",
//                             value: product.return_policy,
//                           },
//                         ]
//                           .slice(0, showAllTradeInfo ? undefined : 3)
//                           .map((info, index) => (
//                             <div
//                               key={index}
//                               className="flex py-1 border-b border-gray-100"
//                             >
//                               <span className="text-gray-600 font-bold w-48">
//                                 {info.label}
//                               </span>
//                               <span className="text-gray-900">
//                                 {info.value}
//                               </span>
//                             </div>
//                           ))}
//                       </div>
//                       <button
//                         onClick={() => setShowAllTradeInfo(!showAllTradeInfo)}
//                         className="mt-4 text-orange-600 font-medium text-sm flex items-center gap-1 hover:underline"
//                       >
//                         {showAllTradeInfo
//                           ? "Show Less"
//                           : "Show All Information"}
//                         {showAllTradeInfo ? (
//                           <ChevronUp size={16} />
//                         ) : (
//                           <ChevronDown size={16} />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* REVIEWS SECTION */}
//                   <div className="rounded border bg-white shadow-sm">
//                     <ProductReviews
//                       productId={product?._id}
//                       showAll={showAllReviews}
//                       onToggle={() => setShowAllReviews(!showAllReviews)}
//                     />
//                   </div>
//                 </div>

//                 {/* RIGHT SECTION (SCROLLABLE) */}
//                 <div
//                   className={`lg:col-span-3 max-h-[calc(100vh-120px)] ${
//                     isAtTop ? "overflow-y-auto" : "overflow-hidden"
//                   } scrollbar-hide`}
//                   style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//                 >
//                   <DetailsRightSection
//                     product={product}
//                     quantity={quantity}
//                     onQuantityChange={handleQuantityChange}
//                     selectedVariant={selectedVariant}
//                     ref={quoteFormRef}
//                   />
//                 </div>
//               </>
//             )}
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
//     <div className="lg:col-span-10 grid grid-cols-1 lg:grid-cols-10 gap-6 w-full animate-pulse">
//       {/* Left Column Skeleton */}
//       <div className="lg:col-span-3">
//         <div className="bg-white rounded border p-4 shadow-sm">
//           <div className="bg-gray-200 rounded-lg mb-4 h-80 shadow-md"></div>
//           <div className="flex gap-2">
//             <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
//             <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
//             <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
//             <div className="w-16 h-16 bg-gray-200 rounded-lg border"></div>
//           </div>
//         </div>
//       </div>

//       {/* Middle Column Skeleton */}
//       <div className="lg:col-span-4 space-y-4">
//         {/* Product Info Box */}
//         <div className="bg-white rounded border p-6 shadow-sm">
//           <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
//           <div className="flex gap-1 mb-4">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//           <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
//           <div className="flex gap-3 mb-6">
//             <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
//             <div className="h-10 flex-1 bg-gray-200 rounded-full"></div>
//             <div className="h-10 flex-1 bg-gray-200 rounded-full"></div>
//             <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
//           </div>
//           <div className="space-y-2 pt-4 border-t">
//             <div className="h-4 bg-gray-200 w-48 rounded"></div>
//             <div className="h-4 bg-gray-200 w-48 rounded"></div>
//           </div>
//         </div>

//         {/* Specs Box */}
//         <div className="bg-white rounded border p-6 shadow-sm">
//           <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
//           <div className="space-y-3">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex py-1 border-b border-gray-100">
//                 <div className="h-4 bg-gray-200 w-32 rounded"></div>
//                 <div className="h-4 bg-gray-200 w-24 rounded ml-auto"></div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Descriptions Box */}
//         <div className="bg-white rounded border p-6 shadow-sm">
//           <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
//           <div className="space-y-2">
//             <div className="h-3 bg-gray-200 rounded w-full"></div>
//             <div className="h-3 bg-gray-200 rounded w-full"></div>
//             <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//           </div>
//         </div>

//         {/* Trade Information Box */}
//         <div className="bg-white rounded border p-6 shadow-sm">
//           <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
//           <div className="space-y-3">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex py-1 border-b border-gray-100">
//                 <div className="h-4 bg-gray-200 w-32 rounded"></div>
//                 <div className="h-4 bg-gray-200 w-24 rounded ml-auto"></div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Reviews Box */}
//         <div className="bg-white rounded border p-6 shadow-sm">
//           <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
//           <div className="space-y-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//               <div className="space-y-2">
//                 <div className="h-3 bg-gray-200 w-24 rounded"></div>
//                 <div className="h-2 bg-gray-200 w-16 rounded"></div>
//               </div>
//             </div>
//             <div className="h-3 bg-gray-200 w-full rounded"></div>
//           </div>
//         </div>
//       </div>

//       {/* Right Column Skeleton */}
//       <div className="lg:col-span-3">
//         <div className="bg-white rounded border p-6 shadow-sm h-full min-h-[400px]">
//           <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <div className="h-4 bg-gray-200 w-full rounded text-sm"></div>
//               <div className="h-4 bg-gray-200 w-5/6 rounded text-sm"></div>
//             </div>
//             <div className="grid grid-cols-3 gap-2">
//               <div className="h-10 bg-gray-200 rounded"></div>
//               <div className="h-10 bg-gray-200 rounded"></div>
//               <div className="h-10 bg-gray-200 rounded"></div>
//             </div>
//             <div className="h-12 bg-gray-200 rounded-full w-full"></div>
//             <div className="h-12 bg-gray-200 rounded-full w-full border"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
