import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BestSellingProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBestProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/all-best-products`
      );
      setProducts(res.data.slice(0, 10));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestProducts();
  }, []);

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <FaStar
            key={i}
            size={12}
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
    <div className="px-3 xl:px-5 mb-6 pt-6 pb-10 bg-gradient-to-br from-[#E0F2EA] via-[#F9F0DC] to-[#FFF8F8]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 px-1">
        <div className="text-left mb-4 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Our Best Featured Products
          </h2>
          {/* <p className="text-gray-600">
            High-quality gadgets tailored for your everyday needs.
          </p> */}
        </div>

        <div>
          <button
            onClick={() => navigate("categories")}
            className="text-sm md:text-base font-semibold text-[#FF6B00] hover:underline transition"
          >
            Explore More →
          </button>
        </div>
      </div>

      {/* GRID: Responsive with 7 columns at xl */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading
          ? Array(7)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-white rounded-md overflow-hidden shadow-md border border-gray-100 flex flex-col"
                >
                  <div className="h-36 bg-gray-200"></div>
                  <div className="p-3 flex flex-col gap-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2.5 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-6 bg-gray-200 rounded w-full"></div>
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
                className="cursor-pointer group bg-white rounded-md overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col text-sm"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="font-medium text-md text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-600">
                      {renderStars(product.ratings)}
                      <span className="ml-1">{product.ratings.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button className="w-full flex items-center justify-center gap-1 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-3 py-1.5 rounded-md transition duration-200 text-xs">
                      <BiSolidPurchaseTag />
                      <span className="font-medium">More Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default BestSellingProducts;
