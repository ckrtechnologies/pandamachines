import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useWishlist } from "../../hooks/useWishlist";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import ProductCardOptimized, { ProductCardSkeleton } from "../Products/ProductCardOptimized";

const groupProducts = (products) => {
  const categoriesMap = new Map();

  products.forEach((product) => {
    if (!product.category || !product.subCategory) return;

    let displayPrice = product.price;
    let displayPreviousPrice = product.previous_price;

    if (
      product.size_type === "multiple" &&
      product.price_by_measurement?.[0]?.allPrice?.length > 0
    ) {
      const allPrices = product.price_by_measurement[0].allPrice;
      const maxPriceItem = allPrices.reduce(
        (max, item) => (Number(item.price) > Number(max.price) ? item : max),
        allPrices[0],
      );
      displayPrice = maxPriceItem.price;
      displayPreviousPrice = maxPriceItem.previous_price;
    }

    const categoryId = product.category._id;
    const subcategoryId = product.subCategory._id;
    const subSubcategoryId = product.subSubCategory?._id;

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
        subSubcategories: new Map(),
      });
    }

    const subcategory = category.subcategories.get(subcategoryId);

    if (subSubcategoryId) {
      if (!subcategory.subSubcategories.has(subSubcategoryId)) {
        subcategory.subSubcategories.set(subSubcategoryId, {
          id: subSubcategoryId,
          name: product.subSubCategory.name,
          products: [],
        });
      }

      const subSubcategory =
        subcategory.subSubcategories.get(subSubcategoryId);
      subSubcategory.products.push({
        id: product._id,
        name: product.name,
        price: displayPrice,
        previous_price: displayPreviousPrice,
        rating: product.ratings,
        image: product.images?.[0] || "",
        description: product.description,
        brand: product.brand,
        gstPercentage: product.gstPercentage || 0,
      });
    } else {
      const defaultSubSubId = `${subcategoryId}_default`;
      if (!subcategory.subSubcategories.has(defaultSubSubId)) {
        subcategory.subSubcategories.set(defaultSubSubId, {
          id: defaultSubSubId,
          name: "All Products",
          products: [],
        });
      }

      const defaultSubSub = subcategory.subSubcategories.get(defaultSubSubId);
      defaultSubSub.products.push({
        id: product._id,
        name: product.name,
        price: displayPrice,
        previous_price: displayPreviousPrice,
        rating: product.ratings,
        image: product.images?.[0] || "",
        description: product.description,
        brand: product.brand,
        gstPercentage: product.gstPercentage || 0,
      });
    }
  });

  return Array.from(categoriesMap.values()).map((category) => ({
    ...category,
    subcategories: Array.from(category.subcategories.values()).map((sub) => ({
      ...sub,
      subSubcategories: Array.from(sub.subSubcategories.values()),
    })),
  }));
};


const CategorySlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const {
    isWishlisted,
    toggleWishlist,
    updatingWishlist,
  } = useWishlist({
    onAuthRequired: () => setShowLoginModal(true),
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/get-all-products`,
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

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };
  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const categories = useMemo(() => groupProducts(products), [products]);


  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading products: {error}
      </div>
    );
  }



  return (
    <div className="bg-gray-100 mb-10 py-6 px-4 xl:px-6">
      <Toaster position="top-center" />
      <div className="text-center mb-6">
        <h2 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2">
          Shop by Categories
        </h2>
        <p className="text-xs md:text-sm text-gray-600">
          Discover our wide range of products organized by categories
        </p>
      </div>

      {loading ? (
        // show skeleton categories
        Array.from({ length: 2 }).map((_, i) => (
          <CategorySectionSkeleton key={i} />
        ))
      ) : categories.length > 0 ? (
        categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            isWishlisted={isWishlisted}
            updatingWishlist={updatingWishlist}
            toggleWishlist={toggleWishlist}
          />
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">
          No products found
        </div>
      )}

      {showLoginModal && (
        <UserLoginModal
          onClose={closeAllModals}
          onRegisterClick={openRegisterModal}
          onLoginSuccess={() => {
            setShowLoginModal(false);
          }}
        />
      )}

      {showRegisterModal && (
        <UserRegisterModal
          onClose={closeAllModals}
          onLoginClick={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
};

const CategorySection = ({ category, isWishlisted, updatingWishlist, toggleWishlist }) => {
  const scrollContainerRef = useRef(null);
  const [activeSubcategory, setActiveSubcategory] = useState(
    category.subcategories[0]?.id || null,
  );
  const [activeSubSubcategory, setActiveSubSubcategory] = useState(
    category.subcategories?.[0]?.subSubcategories?.[0]?.id || null
  );

  useEffect(() => {
    const subcategory = category.subcategories.find(
      (sub) => sub.id === activeSubcategory,
    );
    if (subcategory && subcategory.subSubcategories.length > 0) {
      setActiveSubSubcategory(subcategory.subSubcategories[0].id);
    }
  }, [activeSubcategory, category.subcategories]);

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

  const currentSubcategory = category.subcategories.find(
    (sub) => sub.id === activeSubcategory,
  );

  const activeProducts =
    currentSubcategory?.subSubcategories.find(
      (subSub) => subSub.id === activeSubSubcategory,
    )?.products || [];

  if (!activeSubcategory || category.subcategories.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            {category?.name}
          </h3>
        </div>

        <div className="flex space-x-2 overflow-x-auto scrollbar-hide mt-4 md:mt-0">
          {category.subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => setActiveSubcategory(subcategory.id)}
              className={`px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm rounded-full whitespace-nowrap transition-colors duration-200 ${activeSubcategory === subcategory.id
                ? "bg-[#00395F] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      </div>

      {currentSubcategory &&
        currentSubcategory.subSubcategories.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide mb-4">
            {currentSubcategory.subSubcategories.map((subSubcategory) => (
              <button
                key={subSubcategory.id}
                onClick={() => setActiveSubSubcategory(subSubcategory.id)}
                className={`px-2 md:px-3 py-1.5 md:py-2 text-xs  whitespace-nowrap transition-colors duration-200 ${activeSubSubcategory === subSubcategory.id
                  ? "bg-[#FF8617] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
              >
                {subSubcategory.name}
              </button>
            ))}
          </div>
        )}

      <div className="relative group">
        <button
          onClick={scrollLeft}
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
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

        <div
          ref={scrollContainerRef}
          className="flex space-x-2 sm:space-x-3 overflow-x-auto scrollbar-hide py-3"
          style={{ scrollbarWidth: "none" }}
        >
          {activeProducts.length > 0 ? (
            activeProducts.map((product) => {
              const formattedProduct = {
                _id: product.id,
                name: product.name,
                price: product.price,
                previous_price: product.previous_price,
                ratings: product.rating,
                images: [product.image],
                discount:
                  product.previous_price > product.price
                    ? Math.round(
                      ((product.previous_price - product.price) /
                        product.previous_price) *
                      100
                    )
                    : 0,
              };

              return (
                <div className="w-[200px] sm:w-[237px] flex-shrink-0">
                  <ProductCardOptimized
                    fullWidth
                    key={product.id}
                    product={formattedProduct}
                    isWishlisted={isWishlisted(product.id)}
                    isUpdating={updatingWishlist.has(product.id)}
                    toggleWishlist={toggleWishlist}
                  />
                </div>

              )
            })
          ) : (
            <div className="w-full text-center py-8 text-gray-500">
              No products available
            </div>
          )}
        </div>

        <button
          onClick={scrollRight}
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
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
const CategorySectionSkeleton = () => {
  return (
    <div className="mb-10">
      {/* header */}
      <div className="flex justify-between mb-4">
        <div className="h-5 w-20 sm:w-40 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 w-12 sm:w-20 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* product skeleton row */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto py-3 no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[200px] sm:w-[237px] flex-shrink-0">
            <ProductCardSkeleton fullWidth />
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategorySlider;
