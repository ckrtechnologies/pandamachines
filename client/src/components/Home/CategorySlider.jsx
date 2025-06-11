import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const CategorySlider = () => {
  const products = [
    {
      id: 1,
      name: "Wireless Bluetooth",
      price: 89.99,
      rating: 4.5,
      image: "https://gesrepair.com/wp-content/uploads/bigstock-140745698.jpg",
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 199.99,
      rating: 4.2,
      image:
        "https://plus.unsplash.com/premium_photo-1682144572574-2305752c0f63?fm=jpg&q=60&w=3000",
    },
    {
      id: 3,
      name: "Ultra HD 4K Camera",
      price: 349.99,
      rating: 4.8,
      image:
        "https://cf-images.eu-west-1.prod.boltdns.net/v1/static/1813624294001/2c89c066-8491-4680-8040-3be63b2d44e6/f956c882-92b6-43ec-9404-b40d6bafa6ff/1280x720/match/image.jpg",
    },
    {
      id: 4,
      name: "Ergonomic Keyboard",
      price: 59.99,
      rating: 4.3,
      image:
        "https://img.freepik.com/premium-photo/printing-house_692498-5564.jpg",
    },
    {
      id: 5,
      name: "Noise Cancelling Earbuds",
      price: 129.99,
      rating: 4.7,
      image:
        "https://img.freepik.com/premium-photo/control-panel-equipment_692498-4452.jpg",
    },
    {
      id: 6,
      name: "Noise Cancelling Earbuds",
      price: 129.99,
      rating: 4.7,
      image:
        "https://img.freepik.com/premium-photo/control-panel-equipment_692498-4452.jpg",
    },
    {
      id: 7,
      name: "Ergonomic Keyboard",
      price: 59.99,
      rating: 4.3,
      image:
        "https://img.freepik.com/premium-photo/printing-house_692498-5564.jpg",
    },
    {
      id: 8,
      name: "Ultra HD 4K Camera",
      price: 349.99,
      rating: 4.8,
      image:
        "https://cf-images.eu-west-1.prod.boltdns.net/v1/static/1813624294001/2c89c066-8491-4680-8040-3be63b2d44e6/f956c882-92b6-43ec-9404-b40d6bafa6ff/1280x720/match/image.jpg",
    },
    {
      id: 9,
      name: "Smart Watch Pro",
      price: 199.99,
      rating: 4.2,
      image:
        "https://plus.unsplash.com/premium_photo-1682144572574-2305752c0f63?fm=jpg&q=60&w=3000",
    },
    {
      id: 10,
      name: "Wireless Bluetooth",
      price: 89.99,
      rating: 4.5,
      image: "https://gesrepair.com/wp-content/uploads/bigstock-140745698.jpg",
    },
  ];

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  const [wishlist, setWishlist] = useState([]);
  const [currentIndex1, setCurrentIndex1] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const [currentIndex3, setCurrentIndex3] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animateRow, setAnimateRow] = useState(null); // Track which row to animate

  // Responsive items per slide
  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 768) return 2;
      if (window.innerWidth < 1024) return 3;
      return 4;
    }
    return 4;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
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

  const handleSlide = (direction, setCurrentIndex, currentIndex, rowNumber) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setAnimateRow(rowNumber); // Set which row to animate

    let newIndex;
    if (direction === "prev") {
      newIndex = Math.max(currentIndex - itemsPerSlide, 0);
    } else {
      newIndex =
        currentIndex + itemsPerSlide < products.length
          ? currentIndex + itemsPerSlide
          : currentIndex;
    }

    setCurrentIndex(newIndex);

    setTimeout(() => {
      setIsTransitioning(false);
      setAnimateRow(null); // Reset animation after transition
    }, 500);
  };

  const handlePrev1 = () =>
    handleSlide("prev", setCurrentIndex1, currentIndex1, 1);
  const handleNext1 = () =>
    handleSlide("next", setCurrentIndex1, currentIndex1, 1);
  const handlePrev2 = () =>
    handleSlide("prev", setCurrentIndex2, currentIndex2, 2);
  const handleNext2 = () =>
    handleSlide("next", setCurrentIndex2, currentIndex2, 2);
  const handlePrev3 = () =>
    handleSlide("prev", setCurrentIndex3, currentIndex3, 3);
  const handleNext3 = () =>
    handleSlide("next", setCurrentIndex3, currentIndex3, 3);

  const visibleProducts1 = products.slice(
    currentIndex1,
    currentIndex1 + itemsPerSlide
  );

  const visibleProducts2 = products.slice(
    currentIndex2,
    currentIndex2 + itemsPerSlide
  );

  const visibleProducts3 = products.slice(
    currentIndex3,
    currentIndex3 + itemsPerSlide
  );

  return (
    <div className="relative px-2 sm:px-4 md:px-6 xl:px-6 mb-6 pt-6 pb-10 bg-gradient-to-br from-[#E0F2EA] via-[#F9F0DC] to-[#FFF8F8]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="text-center w-full mb-4 md:mb-0">
          <h2 className="text-xl tracking-wide md:text-2xl font-bold text-gray-900 mb-2">
            Explore Categories Products
          </h2>
          <p className="text-gray-600 text-sm md:text-base tracking-wide">
            Discover the top-rated picks our customers love most.
          </p>
        </div>
      </div>

      {/* First Row */}
      <div className="relative mb-6">
        {/* Arrows */}
        <button
          onClick={handlePrev1}
          disabled={currentIndex1 === 0 || isTransitioning}
          className="absolute left-2 lg:left-[26%] top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white rounded-full shadow hover:bg-gray-100 text-gray-700 disabled:opacity-30 transition-all duration-300 hover:scale-110"
        >
          <FaChevronLeft className="text-sm sm:text-base" />
        </button>
        <button
          onClick={handleNext1}
          disabled={
            currentIndex1 + itemsPerSlide >= products.length || isTransitioning
          }
          className="absolute right-2 lg:right-[0%] top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white rounded-full shadow hover:bg-gray-100 text-gray-700 disabled:opacity-30 transition-all duration-300 hover:scale-110"
        >
          <FaChevronRight className="text-sm sm:text-base" />
        </button>

        <div className="flex flex-col lg:flex-row justify-between transition-all duration-500 ease-in-out">
          <div className="w-full lg:w-[24%] flex flex-col justify-center items-center bg-gray-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mb-4 lg:mb-0 p-4 lg:p-0 min-h-[200px] lg:min-h-0 rounded-md">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8 lg:mb-20 text-center">
              Filling Machine
            </h1>
            <div className="flex items-center">
              <div className="bg-gray-700 text-white px-2 sm:px-4 py-2 rounded-l-full flex items-center">
                <span className="text-sm sm:text-lg md:text-xl font-medium tracking-wide">
                  08071793049
                </span>
              </div>
              <button className="bg-red-600 hover:bg-red-700 transition-colors text-white px-2 sm:px-4 py-2 rounded-r-full">
                <span className="text-sm sm:text-lg md:text-xl font-medium tracking-wide">
                  Call Us
                </span>
              </button>
            </div>
          </div>
          <div
            className={`w-full lg:w-[74%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 transition-opacity duration-500 ${
              isTransitioning && animateRow === 1 ? "opacity-70" : "opacity-100"
            }`}
          >
            {visibleProducts1.map((product, index) => (
              <div
                key={product.id}
                data-aos={
                  animateRow === 1
                    ? currentIndex1 > 0
                      ? "fade-left"
                      : "fade-right"
                    : ""
                }
                data-aos-delay={animateRow === 1 ? index * 100 : 0}
                className="group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition"
                    aria-label="Add to wishlist"
                  >
                    {wishlist.includes(product.id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-600 hover:text-red-500 transition-colors" />
                    )}
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-md text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      {renderStars(product.rating)}
                      <span className="ml-2">{product.rating.toFixed(1)}</span>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md transition-all duration-300 hover:bg-gray-200 hover:scale-110 cursor-pointer">
                      <FaShoppingCart className="text-gray-700 text-sm group-hover:text-black transition-colors" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-4 py-2 rounded-md duration-200">
                      <FaFileInvoiceDollar />
                      <span className="text-sm font-medium">
                        Get a Price Quote
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="relative mb-8">
        {/* Arrows */}
        <button
          onClick={handlePrev2}
          disabled={currentIndex2 === 0 || isTransitioning}
          className="absolute left-2 lg:left-[0%] top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white rounded-full shadow hover:bg-gray-100 text-gray-700 disabled:opacity-30 transition-all duration-300 hover:scale-110"
        >
          <FaChevronLeft className="text-sm sm:text-base" />
        </button>
        <button
          onClick={handleNext2}
          disabled={
            currentIndex2 + itemsPerSlide >= products.length || isTransitioning
          }
          className="absolute right-2 lg:right-[26%] top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white rounded-full shadow hover:bg-gray-100 text-gray-700 disabled:opacity-30 transition-all duration-300 hover:scale-110"
        >
          <FaChevronRight className="text-sm sm:text-base" />
        </button>

        <div className="flex flex-col lg:flex-row justify-between transition-all duration-500 ease-in-out">
          <div
            className={`w-full lg:w-[74%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 order-2 lg:order-1 transition-opacity duration-500 ${
              isTransitioning && animateRow === 2 ? "opacity-70" : "opacity-100"
            }`}
          >
            {visibleProducts2.map((product, index) => (
              <div
                key={product.id}
                data-aos={
                  animateRow === 2
                    ? currentIndex2 > 0
                      ? "fade-right"
                      : "fade-left"
                    : ""
                }
                data-aos-delay={animateRow === 2 ? index * 100 : 0}
                className="group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition"
                    aria-label="Add to wishlist"
                  >
                    {wishlist.includes(product.id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-600 hover:text-red-500 transition-colors" />
                    )}
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-md text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      {renderStars(product.rating)}
                      <span className="ml-2">{product.rating.toFixed(1)}</span>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md transition-all duration-300 hover:bg-gray-200 hover:scale-110 cursor-pointer">
                      <FaShoppingCart className="text-gray-700 text-sm group-hover:text-black transition-colors" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-4 py-2 rounded-md duration-200">
                      <FaFileInvoiceDollar />
                      <span className="text-sm font-medium">
                        Get a Price Quote
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-[24%] flex flex-col justify-center items-center bg-gray-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mb-4 lg:mb-0 p-4 lg:p-0 min-h-[200px] lg:min-h-0 order-1 lg:order-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8 lg:mb-20 text-center">
              Bottle Filling Machine
            </h1>
            <div className="flex items-center">
              <div className="bg-gray-700 text-white px-2 sm:px-4 py-2 rounded-l-full flex items-center">
                <span className="text-sm sm:text-lg md:text-xl font-medium tracking-wide">
                  08071793049
                </span>
              </div>
              <button className="bg-red-600 hover:bg-red-700 transition-colors text-white px-2 sm:px-4 py-2 rounded-r-full">
                <span className="text-sm sm:text-lg md:text-xl font-medium tracking-wide">
                  Call Us
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="relative">
        {/* Arrows */}
        <button
          onClick={handlePrev3}
          disabled={currentIndex3 === 0 || isTransitioning}
          className="absolute left-2 lg:left-[26%] top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white rounded-full shadow hover:bg-gray-100 text-gray-700 disabled:opacity-30 transition-all duration-300 hover:scale-110"
        >
          <FaChevronLeft className="text-sm sm:text-base" />
        </button>
        <button
          onClick={handleNext3}
          disabled={
            currentIndex3 + itemsPerSlide >= products.length || isTransitioning
          }
          className="absolute right-2 lg:right-[0%] top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white rounded-full shadow hover:bg-gray-100 text-gray-700 disabled:opacity-30 transition-all duration-300 hover:scale-110"
        >
          <FaChevronRight className="text-sm sm:text-base" />
        </button>

        <div className="flex flex-col lg:flex-row justify-between transition-all duration-500 ease-in-out">
          <div className="w-full lg:w-[24%] flex flex-col justify-center items-center bg-gray-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mb-4 lg:mb-0 p-4 lg:p-0 min-h-[200px] lg:min-h-0 rounded-md">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8 lg:mb-20 text-center">
              Packing Machine
            </h1>
            <div className="flex items-center">
              <div className="bg-gray-700 text-white px-2 sm:px-4 py-2 rounded-l-full flex items-center">
                <span className="text-sm sm:text-lg md:text-xl font-medium tracking-wide">
                  08071793049
                </span>
              </div>
              <button className="bg-red-600 hover:bg-red-700 transition-colors text-white px-2 sm:px-4 py-2 rounded-r-full">
                <span className="text-sm sm:text-lg md:text-xl font-medium tracking-wide">
                  Call Us
                </span>
              </button>
            </div>
          </div>
          <div
            className={`w-full lg:w-[74%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 transition-opacity duration-500 ${
              isTransitioning && animateRow === 3 ? "opacity-70" : "opacity-100"
            }`}
          >
            {visibleProducts3.map((product, index) => (
              <div
                key={product.id}
                data-aos={
                  animateRow === 3
                    ? currentIndex3 > 0
                      ? "fade-left"
                      : "fade-right"
                    : ""
                }
                data-aos-delay={animateRow === 3 ? index * 100 : 0}
                className="group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition"
                    aria-label="Add to wishlist"
                  >
                    {wishlist.includes(product.id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-600 hover:text-red-500 transition-colors" />
                    )}
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-md text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      {renderStars(product.rating)}
                      <span className="ml-2">{product.rating.toFixed(1)}</span>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md transition-all duration-300 hover:bg-gray-200 hover:scale-110 cursor-pointer">
                      <FaShoppingCart className="text-gray-700 text-sm group-hover:text-black transition-colors" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-4 py-2 rounded-md duration-200">
                      <FaFileInvoiceDollar />
                      <span className="text-sm font-medium">
                        Get a Price Quote
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySlider;
