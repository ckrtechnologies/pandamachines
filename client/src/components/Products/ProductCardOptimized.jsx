import { FiImage, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getCloudinaryImageUrl } from "../../utils/getCloudinaryImageUrl";
import { useCart } from "../../utils/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";

const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => {
                const full = i + 1 <= Math.floor(rating);
                const half = i < rating && i + 1 > rating;

                return (
                    <div key={i} className="relative w-3 h-3">
                        {/* Empty Star */}
                        <svg
                            viewBox="0 0 24 24"
                            className="absolute inset-0 w-full h-full"
                            fill="none"
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                        >
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>

                        {/* Full Star */}
                        {full && (
                            <svg
                                viewBox="0 0 24 24"
                                className="absolute inset-0 w-full h-full"
                                fill="#f59e0b"
                                stroke="#f59e0b"
                                strokeWidth="1.5"
                            >
                                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                            </svg>
                        )}

                        {/* Half Star */}
                        {half && (
                            <div className="absolute inset-0 overflow-hidden w-1/2">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-full h-full"
                                    fill="#f59e0b"
                                    stroke="#f59e0b"
                                    strokeWidth="1.5"
                                >
                                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                                </svg>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Rating Number */}
            <span className="text-[11px] text-gray-500 ml-1">
                ({rating.toFixed(1)})
            </span>
        </div>
    );
};

const ProductCardOptimized = ({
    product,
    fullWidth = false,
}) => {
    const navigate = useNavigate();
    const { addToCart, setBuyNow } = useCart();

    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const img = getCloudinaryImageUrl(product?.images?.[0], { width: 400 });

    const handleNavigate = () => {
        navigate(`/user-product-details/${product._id}`);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();

        if (adding) return;

        setAdding(true);

        const res = await addToCart(product._id, 1);

        if (res?.success) {
            setAdded(true);
            toast.success("Item added to cart")
            // reset after 2 sec
            setTimeout(() => setAdded(false), 3000);
        }

        setAdding(false);
    };

    return (
        <div
            onClick={handleNavigate}
            className={`
                ${fullWidth ? "w-full" : "w-48 flex-shrink-0"}
                bg-white rounded-xl shadow-sm border border-gray-100
                p-2.5 cursor-pointer
                transition-transform duration-150 active:scale-[0.98]
            `}
        >
            {/* IMAGE */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
                {img ? (
                    <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300">
                        <FiImage size={28} />
                    </div>
                )}
            </div>

            {/* NAME */}
            <p className="text-[13px] font-medium leading-snug mt-2.5 line-clamp-2 min-h-[36px] text-gray-800">
                {product.name}
            </p>

            {/* RATING */}
            {product.ratings != null && (
                <div className="mt-1.5">
                    <StarRating rating={product.ratings} />
                </div>
            )}

            {/* PRICE ROW */}
            <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-gray-900">
                    ₹{product.price}
                </span>
                {product.previous_price && (
                    <span className="text-[11px] text-gray-400 line-through">
                        ₹{product.previous_price}
                    </span>
                )}
            </div>

            {/* DISCOUNT BADGE */}
            {product.discount > 0 && (
                <span className="inline-block mt-1 text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">
                    {product.discount}% OFF
                </span>
            )}

            {/* ACTIONS */}
            <div className="mt-3 flex items-center gap-2">
                {/* Cart icon-only button */}
                <button
                    onClick={handleAddToCart}
                    className={` flex items-center justify-center w-9 h-9 flex-shrink-0 rounded-lg border transition-all duration-200 ${added ? "bg-green-500 border-green-500 text-white" : "border-primaryBtnColor text-primaryBtnColor"} `} >
                    {adding ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : added ? (
                        "✔"
                    ) : (
                        <FiShoppingCart size={15} />
                    )}
                </button>

                {/* Buy Now - takes remaining width */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();

                        setBuyNow(product);
                        navigate(`/checkout?buyNow=${product._id}`);
                    }}
                    className="
                        flex-1 h-9
                        rounded-lg bg-primaryBtnColor hover:to-primaryBtnHoverColor text-white
                        text-[13px] font-semibold
                        active:scale-95 transition-transform duration-100
                    "
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export const ProductCardSkeleton = ({ fullWidth = false }) => {
    return (
        <div
            className={`
                ${fullWidth ? "w-full" : "w-48 flex-shrink-0"}
                bg-white rounded-xl shadow-sm border border-gray-100
                p-2.5 animate-pulse
            `}
        >
            {/* IMAGE */}
            <div className="aspect-square rounded-lg bg-gray-200" />

            {/* NAME (2 lines exact height match) */}
            <div className="mt-2.5 space-y-1">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>

            {/* RATING */}
            <div className="mt-1.5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-gray-200 rounded" />
                ))}
                <div className="h-2 w-6 bg-gray-200 rounded ml-1" />
            </div>

            {/* PRICE ROW */}
            <div className="mt-1.5 flex items-center gap-2">
                <div className="h-3 w-12 bg-gray-200 rounded" />
                <div className="h-2 w-8 bg-gray-200 rounded" />
            </div>

            {/* DISCOUNT BADGE */}
            <div className="mt-1">
                <div className="h-3 w-14 bg-gray-200 rounded-md" />
            </div>

            {/* ACTIONS */}
            <div className="mt-3 flex items-center gap-2">
                {/* cart */}
                <div className="w-9 h-9 bg-gray-200 rounded-lg" />

                {/* buy now */}
                <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
            </div>
        </div>
    );
};

export default ProductCardOptimized;
