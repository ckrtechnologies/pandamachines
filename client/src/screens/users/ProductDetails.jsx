import React, { useState, useEffect } from "react";
import { Star, ShoppingBag, FileText } from "lucide-react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { Home, ChevronRight } from "lucide-react";
import RelatedProducts from "../../components/Products/RelatedProducts";
import DetailsRightSection from "../../components/Products/DetailsRightSection";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaOpencart } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import UserLoginModal from "../../components/Login/UserLoginModal";
import UserRegisterModal from "../../components/Login/UserRegisterModal";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
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
  }, []);

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isUserLoggedIn()) {
      openLoginModal();
      return;
    }

    setLoadingCart(true);

    const user = getUserData();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add-product-to-cart`,
        {
          userId: user._id,
          productId: params?.id,
          quantity: quantity,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Added to cart:", response.data);
      toast.success("Product added to cart successfully!");
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

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
      <header className="bg-slate-700 text-white">
        <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-orange-400">Product Details</span>
          </nav>
        </div>
      </header>
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
                      <div className="bg-gray-100 rounded-lg mb-4 h-80 overflow-hidden shadow-md">
                        <img
                          src={product.images[currentImageIndex]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                        />
                      </div>

                      <div className="flex gap-4">
                        {product.images.map((image, index) => (
                          <div
                            key={index}
                            className={`w-16 md:w-28 h-16 bg-gray-200 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer ${
                              index === currentImageIndex
                                ? "ring-2 ring-orange-500"
                                : ""
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            <img
                              src={image}
                              alt={`Product thumbnail ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ))}
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
                        <span className="text-xl font-bold">
                          ₹{product.price}
                        </span>
                        {product.previous_price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.previous_price}
                          </span>
                        )}
                        {product.previous_price && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            Discount
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Brand:</span>
                          <span className="text-sm font-medium">
                            {product.brand}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Share:</span>
                          <div className="flex gap-2">
                            <FaWhatsapp
                              size={20}
                              color="green"
                              className="cursor-pointer hover:scale-110 transition"
                            />
                            <FaFacebookSquare
                              size={20}
                              color="blue"
                              className="cursor-pointer hover:scale-110 transition"
                            />
                            <IoLogoInstagram
                              size={20}
                              color="pink"
                              className="cursor-pointer hover:scale-110 transition"
                            />
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 mb-4 w-full">
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
                        <button className="flex-1 border h-10 px-4 text-sm rounded-full hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                          Buy Now
                        </button>
                        <div className="h-10 w-10 flex justify-center items-center bg-[#00395f] rounded-md text-white hover:scale-110 transition-transform duration-300 cursor-pointer">
                          <FileText size={20} />
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
                </div>
              </div>
            )}

            <DetailsRightSection
              product={product}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
            />
          </div>

          <RelatedProducts />
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
      </div>
    </div>
  );
};
