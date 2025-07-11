import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { PiNotepadFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BestSellingProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBestProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/all-best-products`
      );
      setProducts(res.data.slice(0, 10)); // Show only first 10
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestProducts();
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

  return (
    <div className="px-4 xl:px-6 mb-6 pt-6 pb-10 bg-gradient-to-br from-[#E0F2EA] via-[#F9F0DC] to-[#FFF8F8]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 px-1">
        <div className="text-left mb-4 md:mb-0">
          <h2 className="text-xl tracking-wide md:text-2xl font-bold text-gray-900 mb-2">
            Our Best Featured Products
          </h2>
          <p className="text-gray-600 text-sm md:text-base tracking-wide">
            High-quality gadgets tailored for your everyday needs.
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate("categories")}
            className="text-md md:text-lg font-semibold text-[#FF6B00] hover:underline transition"
          >
            Explore More →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading
          ? Array(10)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-white rounded-md overflow-hidden shadow-lg border border-gray-100 flex flex-col"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                      <div className="h-8 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                </div>
              ))
          : products.map((product) => (
              <div
                onClick={() =>
                  window.open(`/user-product-details/${product?._id}`, "_blank")
                }
                key={product._id}
                className="cursor-pointer group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-md text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      {renderStars(product.ratings)}
                      <span className="ml-2">{product.ratings.toFixed(1)}</span>
                    </div>

                    {/* <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className="p-2 bg-[#dbe5ec] backdrop-blur-sm text-gray-600 hover:text-red-500 rounded-full shadow-xl transition-all duration-300 hover:bg-gray-200 hover:scale-110"
                        aria-label="Add to wishlist"
                      >
                        {wishlist.includes(product._id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>

                      <div className="bg-[#dbe5ec] backdrop-blur-sm p-2 rounded-full shadow-xl transition-all duration-300 hover:bg-gray-200 hover:scale-110 cursor-pointer">
                        <FaShoppingCart className="text-gray-700 text-sm group-hover:text-black transition-colors" />
                      </div>
                    </div> */}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-4 py-2 rounded-md transition duration-200">
                      <BiSolidPurchaseTag />
                      <span className="text-sm tracking-wide font-medium">
                        More Details
                      </span>
                    </button>

                    {/* <button
                      className="flex-shrink-0 p-2 rounded-md bg-[#FF8717] hover:bg-[#ffa65e] text-white hover:text-gray-900 transition duration-200"
                      title="Get Quotation"
                    >
                      <PiNotepadFill size={20} />
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default BestSellingProducts;
