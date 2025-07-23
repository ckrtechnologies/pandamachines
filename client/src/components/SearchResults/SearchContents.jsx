import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";

const SearchContents = () => {
  const { searchItems } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchItems || "");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products-search-results/${encodeURIComponent(searchQuery)}`);
    }
  };

  const renderStars = (rating) => {
    const stars = Math.floor(rating);
    return (
      <span className="text-yellow-400">
        {"★".repeat(stars)}
        {"☆".repeat(5 - stars)}
      </span>
    );
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    // Simulate fetch with mock data
    const mockResults = [
      {
        id: 1,
        name: "Luxury King Bed",
        price: "$799",
        rating: 4.5,
        image:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/mobile/o/v/c/g35-5g-pb3h0001in-motorola-original-imah7c6xqfsptyzx.jpeg?q=70",
      },
      {
        id: 2,
        name: "Modern Queen Bed",
        price: "$599",
        rating: 4.2,
        image:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/mobile/o/v/c/g35-5g-pb3h0001in-motorola-original-imah7c6xqfsptyzx.jpeg?q=70",
      },
      {
        id: 3,
        name: "Classic Wooden Frame",
        price: "$399",
        rating: 3.9,
        image:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/mobile/o/v/c/g35-5g-pb3h0001in-motorola-original-imah7c6xqfsptyzx.jpeg?q=70",
      },
      {
        id: 4,
        name: "Adjustable Smart Bed",
        price: "$999",
        rating: 4.8,
        image:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/mobile/o/v/c/g35-5g-pb3h0001in-motorola-original-imah7c6xqfsptyzx.jpeg?q=70",
      },
      {
        id: 5,
        name: "Minimalist Platform Bed",
        price: "$699",
        rating: 4.3,
        image:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/mobile/o/v/c/g35-5g-pb3h0001in-motorola-original-imah7c6xqfsptyzx.jpeg?q=70",
      },
      {
        id: 6,
        name: "Canopy Bed with Curtains",
        price: "$899",
        rating: 4.6,
        image:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/mobile/o/v/c/g35-5g-pb3h0001in-motorola-original-imah7c6xqfsptyzx.jpeg?q=70",
      },
      {
        id: 7,
        name: "Bunk Bed for Kids",
        price: "$499",
        rating: 4.1,
        image:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/mobile/o/v/c/g35-5g-pb3h0001in-motorola-original-imah7c6xqfsptyzx.jpeg?q=70",
      },
      {
        id: 8,
        name: "Vintage Metal Bed Frame",
        price: "$599",
        rating: 4.0,
        image:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/mobile/o/v/c/g35-5g-pb3h0001in-motorola-original-imah7c6xqfsptyzx.jpeg?q=70",
      },
    ].filter((product) =>
      product.name.toLowerCase().includes(searchItems?.toLowerCase() || "")
    );

    setProducts(mockResults);
    setSearchQuery(searchItems || "");
  }, [searchItems]);

  return (
    <div className="px-4 sm:px-8 py-6 bg-gray-50">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left Section - Results Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-xl font-medium text-gray-500 whitespace-nowrap">
                  Results for:
                </h2>
                <div className="relative max-w-full">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate bg-gradient-to-r from-[#1b6292] to-[#4facfe] bg-clip-text text-transparent">
                    {decodeURIComponent(searchItems || "your search")}
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#1b6292]/30 to-[#4facfe]/30 rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-500">Found</span>
                <span className="mx-1.5 font-bold text-white bg-[#1b6292] h-5 w-5 flex items-center justify-center rounded-full text-xs">
                  {products.length}
                </span>
                <span className="text-sm text-gray-500">
                  {products.length === 1 ? "item" : "items"}
                </span>
                <span className="hidden sm:inline-flex ml-3 text-xs text-gray-400 items-center">
                  <svg
                    className="w-3 h-3 mr-1 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Live results
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Search Bar */}
          <div className="w-full md:w-auto transition-all duration-300 hover:scale-[1.02]">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-transparent hover:ring-[#1b6292]/20">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Refine your search..."
                  className="flex-grow px-3 py-1 focus:outline-none text-gray-700 min-w-[220px] bg-transparent placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="ml-2 bg-gradient-to-r from-[#1b6292] to-[#4facfe] text-white rounded-full p-2 hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  aria-label="Search"
                >
                  <FaSearch
                    size={16}
                    className="transform transition-transform duration-300 hover:scale-110"
                  />
                </button>
              </div>
              <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
                <div className="h-1 bg-gradient-to-r from-transparent via-[#1b6292]/30 to-transparent w-3/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </form>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="hidden lg:block">
          <div className="absolute left-1/4 -mt-8 w-16 h-16 bg-[#1b6292]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute right-1/4 -mt-16 w-24 h-24 bg-[#4facfe]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
      </div>

      {products.length > 0 ? (
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
                        <span className="ml-1">
                          {product.rating.toFixed(1)}
                        </span>
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
                          <FaShoppingCart
                            className="text-gray-700 text-xs"
                            size={12}
                          />
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
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            We couldn't find any matches for "{searchQuery}"
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-[#1b6292] text-white rounded hover:bg-[#134a6e] transition duration-200"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchContents;
