import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategorySlider = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/get-all-products`
        );
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Group products by category and subcategory
  const groupProducts = () => {
    const categoriesMap = new Map();

    products.forEach((product) => {
      // Skip if product doesn't have required category/subcategory data
      if (!product.category || !product.subCategory) return;

      const categoryId = product.category._id;
      const subcategoryId = product.subCategory._id;

      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: product.category.name,
          imgUrl: product.category.imgUrl,
          cat_desc: product.category.description,
          subcategories: new Map(),
        });
      }

      const category = categoriesMap.get(categoryId);

      if (!category.subcategories.has(subcategoryId)) {
        category.subcategories.set(subcategoryId, {
          id: subcategoryId,
          name: product.subCategory.name,
          products: [],
        });
      }

      const subcategory = category.subcategories.get(subcategoryId);
      subcategory.products.push({
        id: product._id,
        name: product.name,
        price: product.price,
        previous_price: product.previous_price,
        rating: product.ratings,
        image: product.images?.[0] || "",
        description: product.description,
        brand: product.brand,
      });
    });

    // Convert Maps to arrays for easier rendering
    return Array.from(categoriesMap.values()).map((category) => ({
      ...category,
      subcategories: Array.from(category.subcategories.values()),
    }));
  };

  const categories = groupProducts();

  if (loading) {
    return (
      <div className="bg-gray-100 mb-10 py-6 px-4 xl:px-6">
        <div className="text-center mb-6">
          <div className="h-6 w-48 mx-auto bg-gray-300 animate-pulse rounded mb-2"></div>
          <div className="h-4 w-64 mx-auto bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Skeleton for categories */}
        {[1, 2].map((_, index) => (
          <div key={index} className="mb-8">
            {/* Category Title */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <div className="h-5 w-48 bg-gray-300 animate-pulse rounded mb-2"></div>
                <div className="h-4 w-72 bg-gray-200 animate-pulse rounded"></div>
              </div>

              {/* Subcategory Tabs Skeleton */}
              <div className="flex space-x-2 mt-4 md:mt-0">
                {[1, 2, 3].map((tab) => (
                  <div
                    key={tab}
                    className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            {/* Product Card Skeletons */}
            <div className="flex space-x-6 overflow-x-auto py-4">
              {[1, 2, 3, 4, 5].map((card) => (
                <div
                  key={card}
                  className="flex-shrink-0 w-64 bg-white rounded-lg shadow animate-pulse overflow-hidden"
                >
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-5 w-48 bg-gray-300 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-5 w-24 bg-gray-300 rounded mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading products: {error}
      </div>
    );
  }

  const CategorySection = ({ category }) => {
    const scrollContainerRef = useRef(null);
    const [activeSubcategory, setActiveSubcategory] = useState(
      category.subcategories[0]?.id || null
    );

    const scrollLeft = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          left: -300,
          behavior: "smooth",
        });
      }
    };

    const scrollRight = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          left: 300,
          behavior: "smooth",
        });
      }
    };

    // Get products for the active subcategory
    const activeProducts =
      category.subcategories.find((sub) => sub.id === activeSubcategory)
        ?.products || [];

    if (!activeSubcategory || category.subcategories.length === 0) {
      return null;
    }

    return (
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {category?.name}
            </h3>
            <h4 className="text-sm font-medium text-gray-600 mt-2 tracking-wide">
              {category?.cat_desc}
            </h4>
          </div>

          {/* Subcategory tabs */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide mt-4 md:mt-0">
            {category.subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => setActiveSubcategory(subcategory.id)}
                className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors duration-200 ${
                  activeSubcategory === subcategory.id
                    ? "bg-[#00395F] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          {/* Left arrow */}
          <button
            onClick={scrollLeft}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label={`Scroll ${category.name} left`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Product cards container */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide py-4"
            style={{ scrollbarWidth: "none" }}
          >
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={scrollRight}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label={`Scroll ${category.name} right`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const ProductCard = ({ product }) => {
    const [imgSrc, setImgSrc] = useState(
      product.image || "https://via.placeholder.com/256?text=No+Image"
    );
    const hasDiscount = product.previous_price > product.price;

    const handleImageError = () => {
      setImgSrc("https://via.placeholder.com/256?text=No+Image");
    };

    return (
      <div
        onClick={() =>
          window.open(`/user-product-details/${product?.id}`, "_blank")
        }
        className="cursor-pointer flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
          />
          <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs font-semibold flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-gray-800">{product.rating || 0}</span>
          </div>
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-[#FF8617] text-white text-xs font-medium tracking-wide px-2 py-1 rounded">
              Sale
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{product.brand}</p>
          <div className="mt-2 flex items-center">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price?.toLocaleString() || "0"}
            </span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{product.previous_price?.toLocaleString() || "0"}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 mb-10 py-6 px-4 xl:px-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Shop by Categories
        </h2>
        <p className="text-gray-600">
          Discover our wide range of products organized by categories
        </p>
      </div>

      {categories.length > 0 ? (
        categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">No products found</div>
      )}
    </div>
  );
};

export default CategorySlider;
