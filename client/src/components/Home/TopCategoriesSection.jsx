import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MdKeyboardArrowDown, MdChevronRight } from "react-icons/md";
import "./TopCategoriesSection.css";
import { useNavigate } from "react-router-dom";

const TopCategoriesSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const categoryRefs = useRef({});
  const [categoriesData, setCategoriesData] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [allSubSubCategories, setAllSubSubCategories] = useState({});
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0, width: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSubSub, setLoadingSubSub] = useState(false);

  useEffect(() => {
    const getAllCats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/categories/get-all-categories`,
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

  const fetchAllSubSubCategories = async (category) => {
    if (!category) return;
    
    const allSubIds = category.subcategories.map(sub => sub.id);
    const hasAllSubSubs = allSubIds.every(id => allSubSubCategories[id]);
    
    if (hasAllSubSubs) return;

    setLoadingSubSub(true);

    const fetchPromises = category.subcategories.map(async (subcat) => {
      if (!allSubSubCategories[subcat.id]) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${subcat.id}`,
          );
          return { subcatId: subcat.id, data: response.data };
        } catch (error) {
          console.error(`Failed to fetch sub-sub-categories for ${subcat.id}:`, error);
          return { subcatId: subcat.id, data: [] };
        }
      }
      return null;
    });

    const results = await Promise.all(fetchPromises);
    
    const newSubSubCategories = results.reduce((acc, result) => {
      if (result) {
        acc[result.subcatId] = result.data;
      }
      return acc;
    }, {});

    setAllSubSubCategories((prev) => ({
      ...prev,
      ...newSubSubCategories,
    }));

    setLoadingSubSub(false);
  };

  const handleCategoryHover = async (category, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    const viewportWidth = window.innerWidth;
    const dropdownWidth = Math.min(1200, viewportWidth - 40);
    
    let left = rect.left + window.scrollX - (dropdownWidth / 2) + (rect.width / 2);
    left = Math.max(20, Math.min(left, viewportWidth - dropdownWidth - 20));
    
    setDropdownPosition({
      left: left,
      top: rect.bottom + window.scrollY + 5,
      width: dropdownWidth,
    });
    
    setHoveredCategory(category);
    await fetchAllSubSubCategories(category);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  const handleSubcategoryClick = (subcatId) => {
    navigate(`/products-list/${subcatId}`);
  };

  const handleSubSubcategoryClick = (subcatId) => {
    navigate(`/products-list/${subcatId}`);
  };

  // Redesigned Dropdown Skeleton
  const DropdownSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <div key={item} className="bg-gray-50 rounded-lg p-3 space-y-3">
          {/* Subcategory skeleton with image */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
          </div>
          
          {/* Sub-subcategories skeletons */}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 pl-2">
                <div className="w-1 h-1 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#f9f7f7] shadow-sm pt-6 border-t border-gray-100">
      <div className="px-4 xl:px-6">
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100"
          >
            <MdKeyboardArrowDown className="rotate-90 text-gray-600" />
          </button>
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
                  <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gray-200 animate-pulse mx-auto mb-2" />
                  <div className="w-12 h-3 mx-auto bg-gray-200 animate-pulse rounded" />
                </div>
              ))
            ) : error ? (
              <div className="text-red-500 py-4 px-6 bg-red-50 rounded-lg">
                {error}
              </div>
            ) : (
              categoriesData.map((cat) => (
                <div
                  key={cat._id}
                  ref={el => categoryRefs.current[cat._id] = el}
                  className="flex flex-col items-center text-center min-w-[70px] md:min-w-[90px] flex-shrink-0 cursor-pointer group relative"
                  onMouseEnter={(e) => handleCategoryHover(cat, e)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <div className="rounded-xl bg-white group-hover:bg-blue-50 transition duration-200 mb-2">
                    <img
                      src={cat.imgUrl}
                      alt={cat.name}
                      className="h-14 w-14 md:h-16 md:w-16 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  <div className="text-sm tracking-wide text-gray-700 group-hover:text-[#FF6B00] flex items-center font-normal">
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
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100"
          >
            <MdKeyboardArrowDown className="-rotate-90 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Redesigned Dropdown */}
      {hoveredCategory && hoveredCategory?.subcategories?.length > 0 && (
        <div
          className="absolute z-50 bg-white shadow-xl rounded-xl p-6"
          style={{
            left: `${dropdownPosition.left}px`,
            top: `${dropdownPosition.top}px`,
            width: `${dropdownPosition.width}px`,
            maxHeight: '600px',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
          }}
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={handleCategoryLeave}
        >
          {/* Category Header with gradient */}
          <div className="mb-6 pb-3 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="bg-[#FF6B00] w-1 h-6 rounded-full mr-2"></span>
              {hoveredCategory.name}
            </h3>
          </div>
          
          {loadingSubSub ? (
            <DropdownSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {hoveredCategory.subcategories.map((subcat) => (
                <div 
                  key={subcat.id} 
                  className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:bg-white group/sub"
                >
                  {/* Subcategory - Redesigned */}
                  <div
                    className="flex items-center gap-2 cursor-pointer border-b border-gray-200 pb-2 mb-2 group-hover/sub:border-[#FF6B00]/30 transition-colors"
                    onClick={() => handleSubcategoryClick(subcat.id)}
                  >
                    <div className="relative">
                      <img
                        src={subcat.imgUrl}
                        alt={subcat.name}
                        className="w-8 h-8 rounded-lg object-cover border border-gray-200 group-hover/sub:border-[#FF6B00] transition-all"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                    <span className="font-semibold text-gray-800 group-hover/sub:text-[#FF6B00] transition-colors text-sm">
                      {subcat.name.length > 18
                        ? subcat.name.substring(0, 18) + "..."
                        : subcat.name}
                    </span>
                  </div>
                  
                  {/* Sub-subcategories - Redesigned with better spacing */}
                  {allSubSubCategories[subcat.id] && allSubSubCategories[subcat.id].length > 0 && (
                    <ul className="space-y-1.5">
                      {allSubSubCategories[subcat.id].slice(0, 5).map((subSubCat) => (
                        <li
                          key={subSubCat._id}
                          className="text-xs text-gray-600 hover:text-[#FF6B00] cursor-pointer flex items-center gap-1.5 pl-1 py-0.5 rounded hover:bg-white/50 transition-all"
                          onClick={() => handleSubSubcategoryClick(subcat.id)}
                        >
                          <MdChevronRight className="text-gray-400 text-xs" />
                          <img
                            src={subSubCat.imgUrl || "https://via.placeholder.com/150"}
                            alt={subSubCat.name}
                            className="w-3.5 h-3.5 object-cover rounded"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                          <span className="truncate">
                            {subSubCat.name.length > 20
                              ? subSubCat.name.substring(0, 20) + "..."
                              : subSubCat.name}
                          </span>
                        </li>
                      ))}
                      {allSubSubCategories[subcat.id].length > 5 && (
                        <li 
                          className="text-xs text-[#FF6B00] hover:underline cursor-pointer pl-1 mt-1 font-medium"
                          onClick={() => handleSubcategoryClick(subcat.id)}
                        >
                          +{allSubSubCategories[subcat.id].length - 5} more
                        </li>
                      )}
                    </ul>
                  )}
                  
                  {/* Show message if no sub-subcategories */}
                  {allSubSubCategories[subcat.id] && allSubSubCategories[subcat.id].length === 0 && (
                    <p className="text-xs text-gray-400 italic pl-1">No subcategories</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* View All link */}
          {!loadingSubSub && hoveredCategory.subcategories.length > 0 && (
            <div className="mt-6 pt-3 border-t border-gray-200 text-center">
              <button 
                className="text-sm font-medium text-[#FF6B00] hover:underline flex items-center justify-center gap-1 mx-auto"
                onClick={() => handleSubcategoryClick(hoveredCategory.subcategories[0].id)}
              >
                View All {hoveredCategory.name} Categories
                <MdChevronRight className="text-lg" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopCategoriesSection;






// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { MdKeyboardArrowDown } from "react-icons/md";
// import "./TopCategoriesSection.css";
// import { useNavigate } from "react-router-dom";

// const TopCategoriesSection = () => {
//   const navigate = useNavigate();
//   const scrollRef = useRef(null);
//   const [categoriesData, setCategoriesData] = useState([]);
//   const [hoveredCategory, setHoveredCategory] = useState(null);
//   const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
//   const [subSubCategories, setSubSubCategories] = useState({});
//   const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getAllCats = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/categories/get-all-categories`,
//         );
//         const formatted = response.data.map((cat) => ({
//           _id: cat._id,
//           name: cat.name,
//           imgUrl: cat.imgUrl || "https://via.placeholder.com/150",
//           subcategories: (cat.subcategories || []).map((sub) => ({
//             id: sub._id,
//             name: sub.name,
//             imgUrl: sub.imgUrl || "https://via.placeholder.com/150",
//           })),
//         }));
//         setCategoriesData(formatted);
//       } catch (err) {
//         setError("Failed to load categories. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     getAllCats();
//   }, []);

//   const scroll = (direction) => {
//     const scrollAmount = 300;
//     if (scrollRef.current) {
//       scrollRef.current.scrollLeft +=
//         direction === "left" ? -scrollAmount : scrollAmount;
//     }
//   };

//   const fetchSubSubCategories = async (subcategoryId) => {
//     if (subSubCategories[subcategoryId]) return;

//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${subcategoryId}`,
//       );

//       setSubSubCategories((prev) => ({
//         ...prev,
//         [subcategoryId]: response.data,
//       }));
//     } catch (error) {
//       console.error("Failed to fetch sub-sub-categories:", error);
//       setSubSubCategories((prev) => ({
//         ...prev,
//         [subcategoryId]: [],
//       }));
//     }
//   };

//   const handleSubcategoryHover = (subcategoryId) => {
//     setHoveredSubcategory(subcategoryId);
//     fetchSubSubCategories(subcategoryId);
//   };

//   const handleCategoryHover = (category, event) => {
//     const rect = event.currentTarget.getBoundingClientRect();
//     setDropdownPosition({
//       left: rect.left + window.scrollX,
//       top: rect.bottom + window.scrollY,
//     });
//     setHoveredCategory(category);
//   };

//   const handleCategoryLeave = () => {
//     setHoveredCategory(null);
//     setHoveredSubcategory(null);
//   };

//   return (
//     // <div className="bg-[#f9f7f7] shadow-sm pt-6 border-t border-gray-100 relative">
//     <div className="bg-[#f9f7f7] shadow-sm pt-6 border-t border-gray-100">
//       <div className="px-4 xl:px-6">
//         <div className="relative">
//           <button
//             onClick={() => scroll("left")}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100"
//           >
//             <MdKeyboardArrowDown className="rotate-90 text-gray-600" />
//           </button>
//           <div
//             ref={scrollRef}
//             className="flex space-x-2 md:space-x-4 overflow-x-auto pl-8 pr-8 scroll-smooth no-scrollbar"
//           >
//             {loading ? (
//               Array.from({ length: 20 }).map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="min-w-[70px] md:min-w-[90px] flex-shrink-0"
//                 >
//                   <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gray-300 animate-pulse mx-auto mb-2" />
//                   <div className="w-12 h-3 mx-auto bg-gray-300 animate-pulse rounded" />
//                 </div>
//               ))
//             ) : error ? (
//               <div className="text-red-500">{error}</div>
//             ) : (
//               categoriesData.map((cat) => (
//                 <div
//                   key={cat._id}
//                   className="flex flex-col items-center text-center min-w-[70px] md:min-w-[90px] flex-shrink-0 cursor-pointer group relative"
//                   onMouseEnter={(e) => handleCategoryHover(cat, e)}
//                   onMouseLeave={handleCategoryLeave}
//                 >
//                   <div className="rounded-xl bg-white group-hover:bg-blue-50 transition duration-200 mb-2  ">
//                     <img
//                       src={cat.imgUrl}
//                       alt={cat.name}
//                       className="h-5 w-5 md:h-16 md:w-16 object-cover rounded-xl"
//                     />
//                   </div>
//                   <div className="text-sm tracking-wide text-gray-700 group-hover:text-[#FF6B00] flex items-center font-normal">
//                     {cat.name.length > 15
//                       ? cat.name.substring(0, 15) + "..."
//                       : cat.name}
//                     {cat.subcategories.length > 0 && (
//                       <MdKeyboardArrowDown
//                         size={16}
//                         className="ml-1 text-[#FF6B00]"
//                       />
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//           <button
//             onClick={() => scroll("right")}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100"
//           >
//             <MdKeyboardArrowDown className="-rotate-90 text-gray-600" />
//           </button>
//         </div>
//       </div>
//       {hoveredCategory && hoveredCategory?.subcategories?.length > 0 && (
//         <div
//           className="absolute z-50 bg-white shadow-lg rounded-md p-4 min-w-[200px]"
//           style={{
//             left: `${dropdownPosition.left}px`,
//           }}
//           onMouseEnter={() => setHoveredCategory(hoveredCategory)}
//           onMouseLeave={handleCategoryLeave}
//         >
//           <h3 className="font-semibold text-sm text-gray-800 mb-2 border-b pb-2">
//             {hoveredCategory.name}
//           </h3>
//           <ul className="space-y-2">
//             {hoveredCategory.subcategories.map((subcat) => (
//               <li key={subcat.id} className="relative">
//                 <div
//                   className="flex items-center text-gray-600 text-sm cursor-pointer hover:text-[#FF6B00] py-1 px-2 hover:bg-[#FFF8F8] rounded"
//                   onMouseEnter={() => {
//                     if (window.innerWidth >= 768) {
//                       handleSubcategoryHover(subcat.id);
//                     }
//                   }}
//                   onClick={() => {
//                     if (window.innerWidth < 768) {
//                       setHoveredSubcategory(
//                         hoveredSubcategory === subcat.id ? null : subcat.id,
//                       );
//                       fetchSubSubCategories(subcat.id);
//                     } else {
//                       navigate(`/products-list/${subcat.id}`);
//                     }
//                   }}
//                 >
//                   <img
//                     src={subcat.imgUrl}
//                     alt={subcat.name}
//                     className="w-4 h-4 mr-2 rounded object-cover"
//                   />
//                   <span className="text-gray-800">
//                     {subcat.name.length > 20
//                       ? subcat.name.substring(0, 20) + "..."
//                       : subcat.name}
//                   </span>
//                 </div>
//                 {hoveredSubcategory === subcat.id &&
//                   subSubCategories[subcat.id] &&
//                   subSubCategories[subcat.id].length > 0 && (
//                     <div
//                       className="
//     relative top-full left-0 mt-1 w-full 
//     md:absolute md:left-full md:top-0 md:ml-1 md:w-60
//     bg-white shadow-xl rounded-md py-2 border border-gray-100
//   "
//                     >
//                       <ul className="space-y-2">
//                         {subSubCategories[subcat.id].map((subSubCat) => (
//                           <li
//                             key={subSubCat._id}
//                             className="px-4 py-2 text-sm font-normal hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF6B00] flex items-center gap-2 cursor-pointer"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               navigate(`/products-list/${subcat.id}`);
//                             }}
//                           >
//                             <img
//                               src={subSubCat.imgUrl}
//                               alt={subSubCat.name}
//                               className="w-5 h-5 object-cover rounded"
//                             />
//                             <span className="text-gray-800">
//                               {subSubCat.name}
//                             </span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TopCategoriesSection;
