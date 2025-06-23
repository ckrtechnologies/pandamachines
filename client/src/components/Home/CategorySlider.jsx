import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const CategorySlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://panda-machine.onrender.com/panda-machines-api/products/get-all-products"
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
        image: product.images[0],
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

// Component for each category section
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

// Component for individual product card
const ProductCard = ({ product }) => {
  const hasDiscount = product.previous_price > product.price;

  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/256?text=No+Image";
          }}
        />
        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs font-semibold flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1 text-gray-800">{product.rating}</span>
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
            ₹{product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ₹{product.previous_price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySlider;

// import React, { useRef, useState } from "react";

// const CategorySlider = () => {
//   // Products organized by category and subcategory
//   const categories = [
//     {
//       id: 1,
//       name: "Audio Devices",
//       subcategories: [
//         {
//           id: 1,
//           name: "Headphones",
//           products: [
//             {
//               id: 1,
//               name: "Wireless Bluetooth",
//               price: 89.99,
//               rating: 4.5,
//               image: "https://gesrepair.com/wp-content/uploads/bigstock-140745698.jpg",
//             },
//             {
//               id: 2,
//               name: "Noise Cancelling Earbuds",
//               price: 129.99,
//               rating: 4.7,
//               image: "https://img.freepik.com/premium-photo/control-panel-equipment_692498-4452.jpg",
//             },
//             {
//               id: 3,
//               name: "Premium Headphones",
//               price: 199.99,
//               rating: 4.8,
//               image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
//             },
//             {
//               id: 4,
//               name: "Gaming Headset",
//               price: 149.99,
//               rating: 4.4,
//               image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
//             },
//           ],
//         },
//         {
//           id: 2,
//           name: "Speakers",
//           products: [
//             {
//               id: 5,
//               name: "Portable Speaker",
//               price: 79.99,
//               rating: 4.3,
//               image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D",
//             },
//             {
//               id: 6,
//               name: "Smart Speaker",
//               price: 129.99,
//               rating: 4.6,
//               image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D",
//             },
//             {
//               id: 7,
//               name: "Soundbar",
//               price: 249.99,
//               rating: 4.7,
//               image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c291bmRiYXJ8ZW58MHx8MHx8fDA%3D",
//             },
//           ],
//         },
//         {
//           id: 3,
//           name: "Accessories",
//           products: [
//             {
//               id: 8,
//               name: "Audio Cable",
//               price: 19.99,
//               rating: 4.0,
//               image: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXVkaW8lMjBjYWJsZXxlbnwwfHwwfHx8MA%3D%3D",
//             },
//             {
//               id: 9,
//               name: "Headphone Stand",
//               price: 39.99,
//               rating: 4.2,
//               image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd61e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lJTIwc3RhbmR8ZW58MHx8MHx8fDA%3D",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: "Wearables",
//       subcategories: [
//         {
//           id: 4,
//           name: "Smart Watches",
//           products: [
//             {
//               id: 10,
//               name: "Smart Watch Pro",
//               price: 199.99,
//               rating: 4.2,
//               image: "https://plus.unsplash.com/premium_photo-1682144572574-2305752c0f63?fm=jpg&q=60&w=3000",
//             },
//             {
//               id: 11,
//               name: "Fitness Tracker",
//               price: 89.99,
//               rating: 4.4,
//               image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
//             },
//           ],
//         },
//         {
//           id: 5,
//           name: "Fitness Trackers",
//           products: [
//             {
//               id: 12,
//               name: "Advanced Tracker",
//               price: 129.99,
//               rating: 4.5,
//               image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zml0bmVzcyUyMHRyYWNrZXJ8ZW58MHx8MHx8fDA%3D",
//             },
//             {
//               id: 13,
//               name: "Sleep Monitor",
//               price: 59.99,
//               rating: 3.9,
//               image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdlYXJhYmxlfGVufDB8fDB8fHww",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: 3,
//       name: "Computer Accessories",
//       subcategories: [
//         {
//           id: 6,
//           name: "Keyboards",
//           products: [
//             {
//               id: 14,
//               name: "Ergonomic Keyboard",
//               price: 59.99,
//               rating: 4.3,
//               image: "https://img.freepik.com/premium-photo/printing-house_692498-5564.jpg",
//             },
//             {
//               id: 15,
//               name: "Gaming Keyboard",
//               price: 99.99,
//               rating: 4.6,
//               image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FtaW5nJTIwa2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D",
//             },
//           ],
//         },
//         {
//           id: 7,
//           name: "Mice",
//           products: [
//             {
//               id: 16,
//               name: "Wireless Mouse",
//               price: 29.99,
//               rating: 4.1,
//               image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdXNlfGVufDB8fDB8fHww",
//             },
//             {
//               id: 17,
//               name: "Gaming Mouse",
//               price: 79.99,
//               rating: 4.7,
//               image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNiJTIwaHVifGVufDB8fDB8fHww",
//             },
//           ],
//         },
//         {
//           id: 8,
//           name: "Docks & Hubs",
//           products: [
//             {
//               id: 18,
//               name: "USB-C Hub",
//               price: 39.99,
//               rating: 4.0,
//               image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNiJTIwaHVifGVufDB8fDB8fHww",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: 4,
//       name: "Cameras",
//       subcategories: [
//         {
//           id: 9,
//           name: "DSLR",
//           products: [
//             {
//               id: 19,
//               name: "Professional DSLR",
//               price: 899.99,
//               rating: 4.9,
//               image: "https://cf-images.eu-west-1.prod.boltdns.net/v1/static/1813624294001/2c89c066-8491-4680-8040-3be63b2d44e6/f956c882-92b6-43ec-9404-b40d6bafa6ff/1280x720/match/image.jpg",
//             },
//           ],
//         },
//         {
//           id: 10,
//           name: "Action Cameras",
//           products: [
//             {
//               id: 20,
//               name: "Action Camera",
//               price: 129.99,
//               rating: 4.5,
//               image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWN0aW9uJTIwY2FtZXJhfGVufDB8fDB8fHww",
//             },
//           ],
//         },
//         {
//           id: 11,
//           name: "Vlogging",
//           products: [
//             {
//               id: 21,
//               name: "Vlogging Camera",
//               price: 249.99,
//               rating: 4.7,
//               image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhfGVufDB8fDB8fHww",
//             },
//           ],
//         },
//       ],
//     },
//   ];

//   return (
//     <div className="bg-white py-6 px-2 sm:px-4 md:px-6 xl:px-8">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//           Shop by Categories
//         </h2>
//         <p className="text-gray-600">
//           Discover our wide range of products organized by categories
//         </p>
//       </div>

//       {categories.map((category) => (
//         <CategorySection key={category.id} category={category} />
//       ))}
//     </div>
//   );
// };

// // Component for each category section
// const CategorySection = ({ category }) => {
//   const scrollContainerRef = useRef(null);
//   const [activeSubcategory, setActiveSubcategory] = useState(category.subcategories[0].id);

//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: -300,
//         behavior: "smooth",
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: 300,
//         behavior: "smooth",
//       });
//     }
//   };

//   // Get products for the active subcategory
//   const activeProducts = category.subcategories.find(
//     sub => sub.id === activeSubcategory
//   )?.products || [];

//   return (
//     <div className="mb-10">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>

//         {/* Subcategory tabs */}
//         <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
//           {category.subcategories.map((subcategory) => (
//             <button
//               key={subcategory.id}
//               onClick={() => setActiveSubcategory(subcategory.id)}
//               className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors duration-200 ${
//                 activeSubcategory === subcategory.id
//                   ? "bg-[#00395F] text-white"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               {subcategory.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="relative group">
//         {/* Left arrow */}
//         <button
//           onClick={scrollLeft}
//           className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
//           aria-label={`Scroll ${category.name} left`}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-gray-600"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//         </button>

//         {/* Product cards container */}
//         <div
//           ref={scrollContainerRef}
//           className="flex space-x-6 overflow-x-auto scrollbar-hide py-4"
//           style={{ scrollbarWidth: "none" }}
//         >
//           {activeProducts.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>

//         {/* Right arrow */}
//         <button
//           onClick={scrollRight}
//           className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
//           aria-label={`Scroll ${category.name} right`}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-gray-600"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 5l7 7-7 7"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// // Component for individual product card
// const ProductCard = ({ product }) => {
//   return (
//     <div className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
//       <div className="relative h-48 overflow-hidden">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//         />
//         <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs font-semibold flex items-center">
//           <span className="text-yellow-500">★</span>
//           <span className="ml-1 text-gray-800">{product.rating}</span>
//         </div>
//       </div>
//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-gray-800 truncate">
//           {product.name}
//         </h3>
//       </div>
//     </div>
//   );
// };

// export default CategorySlider;
