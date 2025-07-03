import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { PiNotepadFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const ProductCards = ({ products, subCategory }) => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

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
    <>
      <div className="relative mx-auto">
        {console.log("subCategory", subCategory)}

        {subCategory && (
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {subCategory?.category?.name}
              </span>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">
                {subCategory.name}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {subCategory.name}
            </h1>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div
                  onClick={() => navigate(`/user-product-details/${product?._id}`)}
                  className="relative aspect-square overflow-hidden"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full cursor-pointer h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow text-start">
                  <h3
                    onClick={() => navigate(`/user-product-details/${product?._id}`)}
                    className="font-semibold cursor-pointer text-md text-gray-900 line-clamp-2 mb-1"
                  >
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      {renderStars(product.ratings)}
                      <span className="ml-2">{product.ratings.toFixed(1)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className="p-2 bg-[#dbe5ec] backdrop-blur-sm text-gray-600 hover:text-red-500 rounded-full shadow-xl transition-all duration-300 hover:bg-gray-200 hover:scale-110"
                        aria-label="Add to wishlist"
                      >
                        {wishlist.includes(product._id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="" />
                        )}
                      </button>

                      <div className="bg-[#dbe5ec] backdrop-blur-sm p-2 rounded-full shadow-xl transition-all duration-300 hover:bg-gray-200 hover:scale-110 cursor-pointer">
                        <FaShoppingCart className="text-gray-700 text-sm group-hover:text-black transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                      {product.previous_price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ₹{product.previous_price.toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-4 py-2 rounded-md transition duration-200">
                      <BiSolidPurchaseTag />
                      <span className="text-sm tracking-wide font-medium">
                        Buy Now
                      </span>
                    </button>

                    <button
                      className="flex-shrink-0 p-2 rounded-md bg-[#FF8717] hover:bg-[#ffa65e] text-white hover:text-gray-900 transition duration-200"
                      title="Get Quotation"
                    >
                      <PiNotepadFill size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCards;
