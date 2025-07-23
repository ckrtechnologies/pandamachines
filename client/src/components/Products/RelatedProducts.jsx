import React, { useState } from "react";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from "react-icons/fa";

const RelatedProducts = () => {
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
      name: "Ergonomic Keyboard",
      price: 59.99,
      rating: 4.3,
      image:
        "https://img.freepik.com/premium-photo/printing-house_692498-5564.jpg",
    },
    {
      id: 7,
      name: "Noise Cancelling Earbuds",
      price: 129.99,
      rating: 4.7,
      image:
        "https://img.freepik.com/premium-photo/control-panel-equipment_692498-4452.jpg",
    },
  ];

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
            size={10}
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
    <div>
      <div className="text-gray-900 text-lg md:text-xl tracking-wide font-bold my-6">
        Related Products
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex space-x-4 min-w-full">
            {products.map((product) => (
              <div
                key={product.id}
                className="group w-48 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-600">
                      {renderStars(product.rating)}
                      <span className="ml-1">{product.rating.toFixed(1)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-1.5 bg-gray-100 text-gray-600 hover:text-red-500 rounded-full transition-all duration-300 hover:bg-gray-200"
                        aria-label="Add to wishlist"
                      >
                        {wishlist.includes(product.id) ? (
                          <FaHeart className="text-red-500" size={12} />
                        ) : (
                          <FaRegHeart size={12} />
                        )}
                      </button>

                      <button className="p-1.5 bg-gray-100 rounded-full transition-all duration-300 hover:bg-gray-200">
                        <FaShoppingCart className="text-gray-700 text-xs" size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <button className="w-full flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-xs px-2 py-1.5 rounded transition duration-200">
                      <BiSolidPurchaseTag size={12} />
                      <span>Buy Now</span>
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

export default RelatedProducts;