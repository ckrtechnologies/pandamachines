import React from "react";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useCart } from "../../utils/CartContext";

const SubCategoryProductCard = ({
  product,
  wishlist,
  toggleWishlist,
  loadingWishlist,
  renderStars,
  addToCartClick,
  buyNowClick,
  loadingCart,
  loadingProducts,
}) => {
  const { cartItems } = useCart();
  console.log("cartItems", cartItems);
  return (
    <div
      onClick={() =>
        window.open(`/user-product-details/${product?._id}`, "_blank")
      }
      className="group w-48 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col cursor-auto"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-1 cursor-pointer mb-1 md:mb-2">
          {product.name}
        </h3>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-600">
            {renderStars(product?.ratings)}
            <span className="ml-1">{product.ratings?.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product._id);
              }}
              className="p-1.5 bg-gray-100 text-gray-600 hover:text-red-500 rounded-full transition-all duration-300 hover:bg-gray-200"
              aria-label={
                wishlist.includes(product._id)
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              {loadingWishlist.has(product._id) ? (
                <LoadingSpinner size="small" />
              ) : wishlist.includes(product._id) ? (
                <FaHeart className="text-red-500" size={12} />
              ) : (
                <FaRegHeart size={12} />
              )}
            </button>

            <button
              onClick={(e) => {
                addToCartClick(product._id);
                e.stopPropagation();
              }}
              className="p-1.5 bg-gray-100 rounded-full transition-all duration-300 hover:bg-gray-200"
            >
              {loadingCart?.has(product._id) ? (
                <LoadingSpinner size={12} />
              ) : (
                <FaShoppingCart className="text-gray-700 text-xs" size={12} />
              )}
            </button>
          </div>
        </div>

        <div className="mt-2">
          <button
            onClick={(e) => {
              buyNowClick(product._id);
              e.stopPropagation();
            }}
            disabled={loadingProducts.has(product._id)}
            className="w-full flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-xs px-2 py-1.5 rounded transition duration-200"
          >
            {loadingProducts.has(product._id) ? (
              <div className="flex items-center justify-center gap-1">
                <div className="w-3 h-3 border-[2px] border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <>
                <BiSolidPurchaseTag size={12} />
                <span>Buy Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryProductCard;

export const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
);
