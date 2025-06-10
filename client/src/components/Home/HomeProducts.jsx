import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";

const HomeProducts = () => {
  const products = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      rating: 4.5,
      image: "https://gesrepair.com/wp-content/uploads/bigstock-140745698.jpg",
      colors: ["#FFBCA0", "#6B7280", "#1F2937"],
    },
    {
      id: 2,
      name: "Smart Watch Pro Series",
      price: 199.99,
      rating: 4.2,
      image:
        "https://plus.unsplash.com/premium_photo-1682144572574-2305752c0f63?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFjaGluZXxlbnwwfHwwfHx8MA%3D%3D",
      colors: ["#3B82F6", "#10B981", "#EF4444"],
    },
    {
      id: 3,
      name: "Ultra HD 4K Camera Pro",
      price: 349.99,
      rating: 4.8,
      image:
        "https://cf-images.eu-west-1.prod.boltdns.net/v1/static/1813624294001/2c89c066-8491-4680-8040-3be63b2d44e6/f956c882-92b6-43ec-9404-b40d6bafa6ff/1280x720/match/image.jpg",
      colors: ["#000000", "#F59E0B", "#6B7280"],
    },
    {
      id: 4,
      name: "Ergonomic Mechanical Keyboard",
      price: 59.99,
      rating: 4.3,
      image: "https://img.freepik.com/premium-photo/printing-house_692498-5564.jpg",
      colors: ["#8B5CF6", "#EC4899", "#14B8A6"],
    },
    {
      id: 5,
      name: "Noise Cancelling Pro Earbuds",
      price: 129.99,
      rating: 4.7,
      image: "https://img.freepik.com/premium-photo/control-panel-equipment_692498-4452.jpg",
      colors: ["#F97316", "#6366F1", "#06B6D4"],
    },
  ];

  const [wishlist, setWishlist] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <FaStar
              size={12}
              key={i}
              className={
                ratingValue <= rating
                  ? "text-yellow-400"
                  : ratingValue - 0.5 <= rating
                  ? "text-yellow-400 opacity-70"
                  : "text-gray-200"
              }
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="px-4 xl:px-12 mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="relative bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Product image with hover effect */}
            <div className="relative pt-[100%] overflow-hidden">
              <motion.img
                src={product.image}
                alt={product.name}
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                initial={{ scale: 1 }}
                animate={{ scale: hoveredProduct === product.id ? 1.05 : 1 }}
              />
              
              {/* Color variants (appears on hover) */}
              <motion.div 
                className="absolute bottom-3 left-3 flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
              >
                {product.colors.map((color, index) => (
                  <div 
                    key={index} 
                    className="w-4 h-4 rounded-full border border-white shadow-sm cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </motion.div>
              
              {/* Wishlist button */}
              <motion.button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Add to wishlist"
              >
                {wishlist.includes(product.id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-600 hover:text-red-500 transition-colors" />
                )}
              </motion.button>
              
              {/* Discount badge */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -20%
              </div>
            </div>

            {/* Product info */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-semibold text-lg mb-1 text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                  <span className="text-gray-600 text-xs ml-2">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  <span className="text-gray-400 line-through mr-1">${(product.price * 1.2).toFixed(2)}</span>
                  <span className="text-gray-900 font-bold">${product.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Add to cart button with animation */}
              <motion.button 
                className="relative overflow-hidden w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-4 py-3 rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FaShoppingCart />
                  Add to Cart
                </span>
                <motion.span 
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                />
              </motion.button>
            </div>
            
            {/* Quick view overlay (appears on hover) */}
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
            >
              <button className="bg-white text-gray-900 font-medium px-6 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                Quick View
              </button>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomeProducts;