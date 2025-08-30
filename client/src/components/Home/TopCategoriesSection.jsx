import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./TopCategoriesSection.css";
import { useNavigate } from "react-router-dom";

const TopCategoriesSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAllCats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
        );
        const formatted = response.data.map((cat) => ({
          _id: cat._id,
          name: cat.name,
          imgUrl: cat.imgUrl || "https://via.placeholder.com/150",
          subcategories: (cat.subcategories || []).map((sub) => ({
            id: sub._id,
            name: sub.name,
            imgUrl: sub.imgUrl || "https://via.placeholder.com/150",
          })),
        }));
        setCategoriesData(formatted);
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getAllCats();
  }, []);

  const scroll = (direction) => {
    const scrollAmount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const handleCategoryHover = (category, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      left: rect.left + window.scrollX,
      top: rect.bottom + window.scrollY,
    });
    setHoveredCategory(category);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  return (
    <div className="bg-[#f9f7f7] shadow-sm pt-6 border-t border-gray-100 relative">
      <div className="px-4 xl:px-6">
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100"
          >
            <MdKeyboardArrowDown className="rotate-90 text-gray-600" />
          </button>

          {/* Categories Scroll List */}
          <div
            ref={scrollRef}
            className="flex space-x-2 md:space-x-4 overflow-x-auto pl-8 pr-8 scroll-smooth no-scrollbar"
          >
            {loading ? (
              Array.from({ length: 20 }).map((_, idx) => (
                <div
                  key={idx}
                  className="min-w-[70px] md:min-w-[90px] flex-shrink-0"
                >
                  <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gray-300 animate-pulse mx-auto mb-2" />
                  <div className="w-12 h-3 mx-auto bg-gray-300 animate-pulse rounded" />
                </div>
              ))
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              categoriesData.map((cat) => (
                <div
                  key={cat._id}
                  className="flex flex-col items-center text-center min-w-[70px] md:min-w-[90px] flex-shrink-0 cursor-pointer group relative"
                  onMouseEnter={(e) => handleCategoryHover(cat, e)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <div className="rounded-full bg-white group-hover:bg-blue-50 transition duration-200 mb-2  ">
                    <img
                      src={cat.imgUrl}
                      alt={cat.name}
                      className="h-5 w-5 md:h-16 md:w-16 object-cover rounded-full"
                    />
                  </div>
                  <div className="text-sm font-medium tracking-wide text-gray-700 group-hover:text-[#FF6B00] flex items-center">
                    {cat.name.length > 15
                      ? cat.name.substring(0, 15) + "..."
                      : cat.name}
                    {cat.subcategories.length > 0 && (
                      <MdKeyboardArrowDown
                        size={16}
                        className="ml-1 text-[#FF6B00]"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100"
          >
            <MdKeyboardArrowDown className="-rotate-90 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Subcategory Dropdown */}
      {hoveredCategory && hoveredCategory.subcategories.length > 0 && (
        <div
          className="absolute z-50 bg-white shadow-lg rounded-md p-4 min-w-[200px]"
          style={{
            left: `${dropdownPosition.left}px`,
            // top: `${dropdownPosition.top + 5}px`,
          }}
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={handleCategoryLeave}
        >
          <h3 className="font-semibold text-sm text-gray-800 mb-2 border-b pb-2">
            {hoveredCategory.name}
          </h3>
          <ul className="space-y-2">
            {hoveredCategory.subcategories.map((subcat) => (
              <li key={subcat.id}>
                <div
                  onClick={() => navigate(`/products-list/${subcat.id}`)}
                  className="flex items-center text-gray-600 text-sm cursor-pointer hover:text-[#FF6B00] py-1 px-2 hover:bg-gray-50 rounded"
                >
                  <img
                    src={subcat.imgUrl}
                    alt={subcat.name}
                    className="w-4 h-4 mr-2 rounded object-cover"
                  />
                  <span className="text-gray-800">
                    {subcat.name.length > 20
                      ? subcat.name.substring(0, 20) + "..."
                      : subcat.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopCategoriesSection;

// import React, { useRef, useState } from "react";
// import "./TopCategoriesSection.css";
// import { MdKeyboardArrowDown } from "react-icons/md";

// const TopCategoriesSection = () => {
//   const demoImg1 =
//     "https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100";

//   const demoImg2 =
//     "https://rukminim1.flixcart.com/fk-p-flap/128/128/image/0139228b2f7eb413.jpg?q=100";

//   // Mock subcategories data - in a real app, this would come from an API
//   const getSubcategories = (categoryName) => {
//     const subcategoriesMap = {
//       Grocery: ["Staples", "Snacks", "Beverages", "Dairy", "Breakfast"],
//       Mobiles: [
//         "Smartphones",
//         "Accessories",
//         "Cases",
//         "Smartwatches",
//         "Tablets",
//       ],
//       Fashion: ["Men", "Women", "Kids", "Footwear", "Accessories"],
//       Electronics: ["Laptops", "TVs", "Audio", "Cameras", "Gaming"],
//       Home: ["Furniture", "Decor", "Kitchen", "Bath", "Bedding"],
//       Appliances: ["ACs", "Fridges", "Washing Machines", "Microwaves", "Fans"],
//       Flight: ["Domestic", "International", "Hotels", "Holidays", "Packages"],
//       Beauty: ["Makeup", "Skincare", "Haircare", "Fragrances", "Tools"],
//       "Two Wheelers": ["Bikes", "Scooters", "Accessories", "Helmets", "Tyres"],
//     };
//     return subcategoriesMap[categoryName] || [];
//   };

//   const categories = [
//     { name: "Grocery", image: demoImg1 },
//     { name: "Mobiles", image: demoImg2 },
//     { name: "Fashion", image: demoImg1 },
//     { name: "Electronics", image: demoImg2 },
//     { name: "Home", image: demoImg1 },
//     { name: "Appliances", image: demoImg1 },
//     { name: "Flight", image: demoImg2 },
//     { name: "Beauty", image: demoImg1 },
//     { name: "Two Wheelers", image: demoImg2 },
//     { name: "Grocery", image: demoImg1 },
//     { name: "Mobiles", image: demoImg2 },
//     { name: "Fashion", image: demoImg1 },
//     { name: "Electronics", image: demoImg2 },
//     { name: "Home", image: demoImg1 },
//     { name: "Appliances", image: demoImg2 },
//     { name: "Flight", image: demoImg1 },
//     { name: "Beauty", image: demoImg2 },
//     { name: "Two Wheelers", image: demoImg1 },
//   ];

//   const scrollRef = useRef(null);
//   const [hoveredCategory, setHoveredCategory] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });

//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       const scrollAmount = 300;
//       if (direction === "left") {
//         scrollRef.current.scrollLeft -= scrollAmount;
//       } else {
//         scrollRef.current.scrollLeft += scrollAmount;
//       }
//     }
//   };

//   const handleCategoryHover = (category, event) => {
//     const subcategories = getSubcategories(category.name);
//     if (subcategories.length > 0) {
//       const rect = event.currentTarget.getBoundingClientRect();
//       setDropdownPosition({
//         left: rect.left + window.scrollX,
//         top: rect.bottom + window.scrollY,
//       });
//       setHoveredCategory({
//         ...category,
//         subcategories,
//       });
//     }
//   };

//   const handleCategoryLeave = () => {
//     setHoveredCategory(null);
//   };

//   return (
//     <div className="bg-gray-50 shadow-sm pt-6 border-t border-gray-100 relative">
//       <div className="px-4 xl:px-6">
//         <div className="relative">
//           {/* Left arrow button */}
//           <button
//             onClick={() => scroll("left")}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors duration-200"
//             aria-label="Scroll left"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 text-gray-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>

//           {/* Categories list */}
//           <div
//             ref={scrollRef}
//             className="flex space-x-1 md:space-x-4 overflow-x-auto pb-2 pl-8 pr-8 scroll-smooth no-scrollbar"
//           >
//             {categories.map((cat) => (
//               <div
//                 key={cat.name}
//                 className="flex flex-col items-center text-center min-w-[70px] md:min-w-[90px] flex-shrink-0 cursor-pointer group relative"
//                 onMouseEnter={(e) => handleCategoryHover(cat, e)}
//                 onMouseLeave={handleCategoryLeave}
//               >
//                 <div className="p-2 md:p-3 rounded-full bg-white group-hover:bg-blue-50 transition-colors duration-200 mb-2">
//                   <img
//                     src={cat.image}
//                     alt={cat.name}
//                     className="h-12 w-12 md:h-14 md:w-14 object-contain"
//                   />
//                 </div>
//                 <div className="flex justify-center items-center text-xs md:text-sm font-medium text-gray-700 group-hover:text-[#FF6B00] transition-colors duration-200">
//                   <span>{cat.name}</span>
//                   <span className="ml-0.5 text-[10px] opacity-70">
//                     <MdKeyboardArrowDown size={20} />
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Right arrow button */}
//           <button
//             onClick={() => scroll("right")}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors duration-200"
//             aria-label="Scroll right"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 text-gray-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Subcategory dropdown */}
//       {hoveredCategory && (
//         <div
//           className="absolute z-50 bg-white shadow-lg rounded-md p-4 min-w-[200px]"
//           style={{
//             left: `${dropdownPosition.left}px`,
//             // top: `${dropdownPosition.top}px`
//           }}
//           onMouseEnter={() => setHoveredCategory(hoveredCategory)}
//           onMouseLeave={handleCategoryLeave}
//         >
//           <h3 className="font-semibold text-sm text-gray-800 mb-2 border-b pb-2">
//             {hoveredCategory.name}
//           </h3>
//           <ul className="space-y-2">
//             {hoveredCategory.subcategories.map((subcat) => (
//               <li key={subcat}>
//                 <div className="flex items-center text-gray-600 text-sm cursor-pointer hover:text-[#FF6B00] py-1 px-2 hover:bg-gray-50 rounded">
//                   <img
//                     src='https://rukminim1.flixcart.com/image/240/240/xif0q/instant-camera/l/g/q/print-barcode-labels-mini-portable-printer-with-usb-cable-original-imahd7ac8s3znfqe.jpeg?q=60'
//                     alt={`${subcat.name} icon`}
//                     className="w-4 h-4 mr-2"
//                   />
//                   {subcat}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TopCategoriesSection;
