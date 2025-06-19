import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
const ProductCards = () => {
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
      <div className="realtive  mx-auto text-end px-4 xl:px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow text-start">
                <h3 className="font-semibold text-md text-gray-900 line-clamp-2 mb-1">
                  {product.name}
                </h3>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600">
                    {renderStars(product.rating)}
                    <span className="ml-2">{product.rating.toFixed(1)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2 bg-[#dbe5ec] backdrop-blur-sm text-gray-600 hover:text-red-500 rounded-full shadow-xl transition-all duration-300 hover:bg-gray-200 hover:scale-110"
                      aria-label="Add to wishlist"
                    >
                      {wishlist.includes(product.id) ? (
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

                <div className="mt-4">
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-4 py-2 rounded-md transition duration-200">
                    <BiSolidPurchaseTag />
                    <span className="text-sm tracking-wide font-medium">
                      Buy Now
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductCards;
