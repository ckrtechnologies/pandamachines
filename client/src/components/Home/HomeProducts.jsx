import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";

const HomeProducts = () => {
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
        "https://plus.unsplash.com/premium_photo-1682144572574-2305752c0f63?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFjaGluZXxlbnwwfHwwfHx8MA%3D%3D",
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
      image: "https://img.freepik.com/premium-photo/printing-house_692498-5564.jpg",
    },
    {
      id: 5,
      name: "Noise Cancelling Earbuds",
      price: 129.99,
      rating: 4.7,
      image: "https://img.freepik.com/premium-photo/control-panel-equipment_692498-4452.jpg",
    },
  ];

  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <FaStar
            size={14}
              key={i}
              className={
                ratingValue <= rating
                  ? "text-yellow-400"
                  : ratingValue - 0.5 <= rating
                  ? "text-yellow-400 opacity-70"
                  : "text-gray-300"
              }
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="px-4 xl:px-6 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
          >
            <div className="relative pt-[100%]">
              <img
                src={product.image}
                alt={product.name}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors duration-200"
                aria-label="Add to wishlist"
              >
                {wishlist.includes(product.id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-600 hover:text-red-500 transition-colors" />
                )}
              </button>
            </div>

            <div className="p-3 flex flex-col flex-grow">
              <h3 className="font-semibold text-md mb-1 text-gray-800 line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center">
                {renderStars(product.rating)}
                <span className="text-gray-600 text-sm ml-2">
                  {product.rating.toFixed(1)}
                </span>
              </div>

              <button className="mt-2 w-full flex items-center justify-center gap-2 bg-[#FFBCA0] hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                <FaShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeProducts;
