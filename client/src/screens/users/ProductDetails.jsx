import axios from "axios";
import { ChevronDown, ChevronRight, ChevronUp, FileText, Home, Share2, Star } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaFacebookSquare, FaWhatsapp } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import AllUserFooter from "../../components/common/AllUserFooter";
import UserNavbar from "../../components/common/UserNavbar";
import TopCategoriesSection from "../../components/Home/TopCategoriesSection";
import DetailsRightSection from "../../components/Products/DetailsRightSection";
import RelatedProducts from "../../components/Products/RelatedProducts";
import VideoPlayer from "../../components/Products/VideoPlayer";
import VideoThumbnail from "../../components/Products/VideoThumbnail";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";
import useIsMobile from "../../hooks/useIsMobile";
import HowToBuySteps from "./HowToBuySteps";
import ImageMagnifier from "./Product/ImageMagnifier";
import ProductReviews from "./Product/ProductReviews";

const ProductDetails = () => {
  const params = useParams();
  const isMobile = useIsMobile(); // default 768
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart, cartItems } = useCart();
  const { setBuyNow } = useCheckout();

  const { user, isLoggedIn } = useAuth();

  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);

  // State for expandable sections
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showAllTradeInfo, setShowAllTradeInfo] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { openAuthModal } = useApp();

  const mainContainerRef = useRef(null);
  const quoteFormRef = useRef(null);

  const isAlreadyInCart = cartItems.some(
    (item) => item.productId === product?._id
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const scrollToQuoteForm = () => {
    if (quoteFormRef.current) {
      // Initial attempt
      quoteFormRef.current?.scrollToForm();

      // Retry after a short delay to handle potential layout shifts (e.g. sticky mode activation)
      setTimeout(() => {
        if (quoteFormRef.current) {
          quoteFormRef.current?.scrollToForm();
        }
      }, 300);
    }
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
        (p) => p.measurement === selectedSize
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

    requireLogin(() => {
      setBuyNow(product, { quantity: 1 });
      navigate(`/checkout/${product._id}`);
    });

  };

  const requireLogin = (callback) => {
    if (!user || !user._id) {
      openAuthModal("login");
      return;
    }
    callback();
  };


  const handleMediaSelect = (index, isVideo = false) => {
    setCurrentMediaIndex(index);
    setIsVideoPlaying(isVideo);
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    if (totalPrice < 2000) {
      toast.error(
        `Minimum purchase value must be ₹2,000. Current total: ₹${totalPrice.toLocaleString(
          "en-IN"
        )}`
      );
      return;
    }


    try {
      requireLogin(async () => {
        if (loadingCart) return;
        setLoadingCart(true);

        const res = await addToCart({
          product,
          quantity: 1,
        });

        if (res?.success) {
          toast.success("Item added to cart");
        }

        setLoadingCart(false);
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    } finally {
      setLoadingCart(false);
    }
  };

  const openLoginModal = () => openAuthModal(true);

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
              className={`p-2 rounded-lg border-2 transition text-sm ${selectedVariant?.model === variant.model
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

  const totalPrice = price;

  const perUnitPreviousPriceWithGst = previous_price
    ? Number(previous_price) +
    (Number(previous_price) * (Number(product?.gstPercentage) || 0)) / 100
    : 0;

  return (
    <React.Fragment>
      <UserNavbar />
      {
        !isMobile && <TopCategoriesSection />
      }

      {/* Top Full Width Banner */}
      {!loading && product?.product_banner && (
        <div className="w-full px-3 sm:px-0">
          <img
            src={product?.product_banner}
            alt="Product Details Banner"
            className="w-full h-[180px] md:h-[250px] lg:h-[320px] object-cover"
          />
        </div>
      )}
      <div
        ref={mainContainerRef}
        className="bg-[#FFF9F9] min-h-screen px-3 md:px-6 xl:px-6 py-3 sm:py-4"
      >
        {/* Breadcrumb */}
        {!loading && product && (
          <div className="mb-4">
            <div className=" overflow-hidden">

              <div className="flex items-center text-[11px] md:text-xs text-gray-500 overflow-x-auto no-scrollbar whitespace-nowrap">

                {/* Home */}
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-[#002B45] transition-colors flex-shrink-0"
                >
                  <Home
                    size={14}
                  />
                </button>

                <div className="hidden sm:flex items-center">
                  <ChevronRight
                    size={12}
                    className="mx-1 text-gray-400 flex-shrink-0"
                  />
                  {/* Categories */}
                  <button
                    onClick={() => navigate("/categories")}
                    className="hover:text-[#002B45] transition-colors flex-shrink-0"
                  >
                    Categories
                  </button>
                </div>

                {/* Category */}
                {product?.category && (
                  <>
                    <ChevronRight
                      size={12}
                      className="mx-1 text-gray-400 flex-shrink-0"
                    />

                    <button
                      onClick={() =>
                        navigate(`/categories?category=${product?.category?._id}`)
                      }
                      className="hover:text-[#002B45] transition-colors truncate max-w-[80px] md:max-w-none flex-shrink-0"
                    >
                      {product?.category?.name}
                    </button>
                  </>
                )}

                {/* SubCategory */}
                {product?.subCategory && (
                  <>
                    <ChevronRight
                      size={12}
                      className="mx-1 text-gray-400 flex-shrink-0"
                    />

                    <button
                      onClick={() =>
                        navigate(
                          `/categories?category=${product?.category?._id}&subcategory=${product?.subCategory?._id}`
                        )
                      }
                      className="hover:text-[#002B45] transition-colors truncate max-w-[90px] md:max-w-none flex-shrink-0"
                    >
                      {product?.subCategory?.name}
                    </button>
                  </>
                )}

                {/* Product */}
                <ChevronRight
                  size={12}
                  className="mx-1 text-gray-400 flex-shrink-0"
                />

                <span className="text-[#002B45] font-medium truncate min-w-0">
                  {product?.name}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            {loading ? (
              skeletonLoader()
            ) : (
              <>
                {/* LEFT SECTION - IMAGE (STICKY ON DESKTOP) */}
                <div className="lg:col-span-3">
                  <div className="lg:sticky lg:top-24 space-y-2 sm:space-y-4">
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
                                className="text-[#f3123b] cursor-pointer hover:scale-125 transition-transform"
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
                              className={`w-16 h-16 bg-gray-200 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer ${index === currentMediaIndex && !isVideoPlaying
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

                    <div className="flex flex-col gap-2 sm:gap-4">
                      <VideoPlayer
                        videoUrl={product?.production_video}
                        videoTitle="Production video"
                      />
                      <VideoPlayer videoUrl={product?.demo_video} videoTitle="Demo video" />
                    </div>

                  </div>
                </div>

                {/* MID SECTION - INFO + TABS (SCROLLABLE ON DESKTOP) */}
                <div
                  // className={`lg:col-span-4 ${isAtTop
                  //   ? "lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto"
                  //   : "lg:overflow-hidden"
                  //   } scrollbar-hide`}
                  className={`lg:col-span-4  scrollbar-hide`}
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div className="rounded border bg-white p-4 sm:p-6 shadow-sm mb-4">
                    {/* PRODUCT INFO */}
                    <div>
                      <div className="flex justify-start items-center gap-1">
                        <p className="text-sm mb-2">PRODUCT :</p>
                        <p className="text-sm mb-2">{product.pm_id}</p>
                      </div>
                      <h1 className="text-xl font-bold mb-2">{product.name}</h1>

                      {/* Ratings */}
                      <div className="flex items-center gap-2 mb-4">
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
                            ₹{totalPrice.toLocaleString("en-IN")}
                          </span>
                          {previous_price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹
                              {perUnitPreviousPriceWithGst.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                          {previous_price && <div></div>}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                          <p className="text-[10px] text-green-600 font-semibold">
                            Included GST {product?.gstPercentage || 0}%
                          </p>
                          {product?.extraTaxPercentage > 0 && (
                            <p className="text-[10px] text-gray-600 font-semibold">
                              + {product?.extraTaxPercentage}% Extra Tax
                            </p>
                          )}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-gray-600 font-semibold">
                              + Shipping:
                            </span>
                            {product?.shippingType === "free" ? (
                              <span className="text-[10px] text-green-700 font-bold uppercase">
                                Free Shipping
                              </span>
                            ) : product?.shippingType === "extra" ? (
                              <span className="text-[10px] text-blue-700 font-bold uppercase">
                                Extra Charges (₹{product.shippingCharge})
                              </span>
                            ) : (
                              <span className="text-[10px] text-orange-700 font-bold uppercase">
                                As per Actual
                              </span>
                            )}
                          </div>
                        </div>
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
              ${selectedSize === item.measurement
                                        ? "border-orange-500 bg-orange-50 border-2 text-gray-900"
                                        : "border-gray-300 text-gray-900 hover:border-gray-900"
                                      }
            `}
                                  >
                                    {item.measurement}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Quantity + Buttons */}
                      <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-3 mb-4 w-full">
                        {/* Second line on mobile: Add to Cart & Buy Now buttons */}
                        <div className="flex md:hidden w-full gap-2">
                          {isAlreadyInCart ? (
                            <button
                              onClick={() => navigate("/cart")}
                              className="flex-1 min-w-[120px] bg-green-600 h-10 text-white px-4 rounded-full text-sm flex items-center justify-center shadow-md hover:bg-green-700 transition-all duration-300"
                            >
                              Go to Cart
                            </button>
                          ) : (
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
                          )}
                          <button
                            onClick={() => handleBuyNowClick(product._id)}
                            className="flex-1 min-w-[100px] border h-10 px-4 text-sm rounded-full hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
                          >
                            <>Buy Now</>
                          </button>
                        </div>

                        {/* Desktop Add to Cart button */}
                        {isAlreadyInCart ? (
                          <button
                            onClick={() => navigate("/cart")}
                            className="hidden md:flex flex-1 min-w-[120px] bg-green-600 h-10 text-white px-4 rounded-full items-center justify-center shadow-md hover:bg-green-700 transition-all duration-300"
                          >
                            Go to Cart
                          </button>
                        ) : (
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
                        )}

                        {/* Desktop Buy Now button */}
                        <button
                          onClick={() => handleBuyNowClick(product)}
                          className="hidden md:flex flex-1 min-w-[100px] border border-orange-500 text-orange-500 h-10 px-4 text-sm rounded-full items-center justify-center hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                          <>Buy Now</>
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
                    <div className="p-4 sm:p-6">
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
                    <div className="p-4 sm:p-6">
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
                              value: product.tradeInfo?.paymentTerms,
                              icon: "💳",
                            },
                            {
                              label: "Delivery Time",
                              value: product.tradeInfo?.deliveryTime,
                              icon: "🚚",
                            },
                            {
                              label: "Supply Ability",
                              value: product.tradeInfo?.supplyAbility,
                              icon: "📦",
                            },
                            {
                              label: "Main Domestic Market",
                              value: product.tradeInfo?.mainDomesticMarket,
                              icon: "📍",
                            },
                            {
                              label: "Return Policy",
                              value: product?.return_policy,
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
                            className={`transform transition-transform duration-300 ${showAllTradeInfo ? "rotate-180" : ""
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
                  // className={`lg:col-span-3 ${isAtTop
                  //   ? "lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto"
                  //   : ""
                  //     } 
                  //   scrollbar-hide`}
                  className={`lg:col-span-3  scrollbar-hide`}
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <DetailsRightSection
                    product={product}
                    quantity={1}
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

const SkeletonBlock = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded ${className}`}
  />
);

const skeletonLoader = () => {
  return (
    <div className="lg:col-span-10 grid grid-cols-1 lg:grid-cols-10 gap-4">
      {/* LEFT SECTION */}
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="bg-white rounded border p-4 shadow-sm">
            {/* Main Image */}
            <SkeletonBlock className="w-full aspect-square rounded-xl mb-4" />

            {/* Thumbnails */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBlock
                  key={i}
                  className="w-16 h-16 rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Video Sections */}
          <SkeletonBlock className="h-48 rounded-xl" />
          <SkeletonBlock className="h-48 rounded-xl" />
        </div>
      </div>

      {/* CENTER SECTION */}
      <div className="lg:col-span-4 space-y-4">
        {/* Product Info Card */}
        <div className="bg-white rounded border p-5 shadow-sm">
          {/* Product Id */}
          <SkeletonBlock className="h-4 w-28 mb-3" />

          {/* Product Name */}
          <SkeletonBlock className="h-8 w-[90%] mb-2" />
          <SkeletonBlock className="h-8 w-[65%] mb-4" />

          {/* Rating */}
          <div className="flex gap-1 mb-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonBlock key={i} className="w-4 h-4 rounded" />
            ))}
          </div>

          {/* Price */}
          <div className="flex gap-3 items-center mb-3">
            <SkeletonBlock className="h-8 w-32" />
            <SkeletonBlock className="h-5 w-20" />
          </div>

          {/* GST + Shipping */}
          <div className="flex flex-wrap gap-2 mb-5">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-4 w-28" />
          </div>

          {/* Size Buttons */}
          <div className="mb-5">
            <SkeletonBlock className="h-5 w-20 mb-3" />

            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBlock
                  key={i}
                  className="h-10 w-20 rounded-xl"
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            <SkeletonBlock className="h-10 rounded-full" />
            <SkeletonBlock className="h-10 rounded-full" />
            <SkeletonBlock className="h-10 rounded-full col-span-2 md:col-span-1" />
          </div>

          {/* Categories */}
          <div className="border-t pt-4 space-y-3">
            <SkeletonBlock className="h-4 w-52" />
            <SkeletonBlock className="h-4 w-48" />
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded border p-5 shadow-sm">
          <SkeletonBlock className="h-6 w-44 mb-5" />

          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex justify-between py-3 border-b border-gray-100"
            >
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-white rounded border p-5 shadow-sm">
          <SkeletonBlock className="h-6 w-32 mb-5" />

          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-[85%]" />
            <SkeletonBlock className="h-4 w-[70%]" />
          </div>
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded border p-5 shadow-sm">
          <SkeletonBlock className="h-6 w-44 mb-5" />

          <div className="grid md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border rounded-lg p-4 flex gap-3"
              >
                <SkeletonBlock className="w-10 h-10 rounded-lg" />

                <div className="flex-1">
                  <SkeletonBlock className="h-4 w-28 mb-2" />
                  <SkeletonBlock className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How To Buy */}
        <div className="bg-white rounded border p-5 shadow-sm">
          <SkeletonBlock className="h-6 w-40 mb-5" />

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <SkeletonBlock className="w-10 h-10 rounded-full" />

                <div className="flex-1">
                  <SkeletonBlock className="h-4 w-32 mb-2" />
                  <SkeletonBlock className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded border p-5 shadow-sm">
          <SkeletonBlock className="h-6 w-32 mb-5" />

          {[1, 2].map((i) => (
            <div key={i} className="mb-5">
              <div className="flex gap-3 mb-3">
                <SkeletonBlock className="w-10 h-10 rounded-full" />

                <div>
                  <SkeletonBlock className="h-4 w-24 mb-2" />
                  <SkeletonBlock className="h-3 w-20" />
                </div>
              </div>

              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-[80%]" />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded border p-5 shadow-sm lg:sticky lg:top-24">
          <SkeletonBlock className="h-7 w-44 mb-6" />

          <div className="space-y-4">
            <SkeletonBlock className="h-12 rounded-lg" />
            <SkeletonBlock className="h-12 rounded-lg" />
            <SkeletonBlock className="h-12 rounded-lg" />
            <SkeletonBlock className="h-12 rounded-lg" />
            <SkeletonBlock className="h-32 rounded-lg" />
            <SkeletonBlock className="h-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
