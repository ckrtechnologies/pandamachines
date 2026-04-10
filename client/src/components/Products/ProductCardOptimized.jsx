import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getCloudinaryImageUrl } from "../../utils/getCloudinaryImageUrl";

const ProductCardOptimized = ({ product, onAddToCart, onBuyNow }) => {
    const navigate = useNavigate();

    const img = getCloudinaryImageUrl(product?.images?.[0], {
        width: 400,
    });

    const handleNavigate = () => {
        navigate(`/user-product-details/${product._id}`)
    }
    return (
        <div
            onClick={handleNavigate}
            className="w-40 flex-shrink-0 bg-white rounded-xl shadow-md border p-2">

            {/* IMAGE */}
            <div
                onClick={handleNavigate}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
            >
                {img ? (
                    <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                        No Image
                    </div>
                )}
            </div>

            {/* NAME */}
            <p
                className="text-xs cursor-pointer mt-2 line-clamp-2 min-h-[32px]">
                {product.name}
            </p>

            {/* PRICE */}
            <div className="mt-1">
                <p className="text-sm font-semibold">₹{product.price}</p>

                {product.previous_price && (
                    <p className="text-[10px] text-gray-400 line-through">
                        ₹{product.previous_price}
                    </p>
                )}
            </div>

            {/* DISCOUNT */}
            {product.discount > 0 && (
                <span className="text-[10px] text-green-600 font-medium">
                    {product.discount}% OFF
                </span>
            )}

            {/* ACTIONS */}
            <div className="mt-2 flex gap-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart?.(product);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 rounded-md border border-orangeAccent text-orangeAccent active:scale-95"
                >
                    <FiShoppingCart size={12} />
                    Add
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onBuyNow?.(product);
                    }}
                    className="flex-1 text-xs px-2 py-1 rounded-md bg-orangeAccent text-white active:scale-95"
                >
                    Buy
                </button>
            </div>
        </div>
    );
};

export default ProductCardOptimized;