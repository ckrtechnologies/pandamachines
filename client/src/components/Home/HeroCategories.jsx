// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import AOS from "aos";
// import "aos/dist/aos.css";

// const HeroCategories = () => {
//   const [categoriesData, setCategoriesData] = useState([]);
//   const [hoveredCategory, setHoveredCategory] = useState(null);
//   const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
//   const [subSubCategories, setSubSubCategories] = useState({});
//   const [activeMobileIndex, setActiveMobileIndex] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [activeMobileSubIndex, setActiveMobileSubIndex] = useState(null);

//   useEffect(() => {
//     AOS.init({
//       duration: 600,
//       once: true,
//       offset: 50,
//       delay: 0,
//       easing: "ease-out",
//       disable: "mobile",
//     });

//     setTimeout(() => {
//       AOS.refresh();
//     }, 100);
//   }, []);

//   useEffect(() => {
//     if (!loading && categoriesData.length > 0) {
//       setTimeout(() => {
//         AOS.refresh();
//       }, 100);
//     }
//   }, [loading, categoriesData]);

//   useEffect(() => {
//     const getAllCats = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
//         );
//         const formatted = response.data.map((cat) => ({
//           _id: cat._id,
//           name: cat.name,
//           imgUrl: cat.imgUrl || "https://via.placeholder.com/150",
//           description: cat.description,
//           subcategories: (cat.subcategories || []).map((sub) => ({
//             id: sub._id,
//             name: sub.name,
//             imgUrl: sub.imgUrl || "https://via.placeholder.com/150",
//             description: sub.description,
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

//   const fetchSubSubCategories = async (subcategoryId) => {
//     if (subSubCategories[subcategoryId]) return;

//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${subcategoryId}`
//       );

//       setSubSubCategories((prev) => ({
//         ...prev,
//         [subcategoryId]: response.data,
//       }));
//     } catch (error) {
//       console.error("Failed to fetch sub-sub-categories:", error);
//       // Set empty array to prevent repeated API calls on errors
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

//   return (
//     <div className="w-full lg:w-[280px] min-w-[280px] relative ">
//       {/* Desktop View */}
//       <div
//         className="hidden md:block bg-white shadow-lg text-[#424D58] rounded-lg h-full"
//         onMouseLeave={() => {
//           setHoveredCategory(null);
//           setHoveredSubcategory(null);
//         }}
//       >
//         <ul className="py-4 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-lg">
//           {loading ? (
//             [1, 2, 3, 4, 5, 6, 1, 2, 3, 4].map((i) => {
//               return (
//                 <li className="flex items-center gap-2 cursor-pointer bg-white text-sm font-semibold hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-2.5 tracking-wide transition-colors relative overflow-hidden">
//                   <img
//                     data-aos="fade-right"
//                     className="h-6 w-6 object-cover rounded-md animate-pulse"
//                     src="https://adexusa.com/wp-content/uploads/2022/11/Floor-Square-en-rWt2QxfUBxF2UvRz.jpg"
//                     alt="all-cat-img"
//                   />
//                   <div className="flex items-center gap-2">
//                     <span
//                       data-aos="fade-right"
//                       className="w-12 h-5 bg-[#c4c4c4] animate-pulse rounded-sm"
//                     >
//                       &nbsp;
//                     </span>
//                     <span
//                       data-aos="fade-right"
//                       className="w-8 h-5 bg-[#c4c4c4] animate-pulse rounded-sm"
//                     >
//                       &nbsp;
//                     </span>
//                     <span
//                       data-aos="fade-right"
//                       className="w-12 h-5 bg-[#c4c4c4] animate-pulse rounded-sm"
//                     >
//                       &nbsp;
//                     </span>
//                     <span
//                       data-aos="fade-right"
//                       className="w-10 h-5 bg-[#c4c4c4] animate-pulse rounded-sm"
//                     >
//                       &nbsp;
//                     </span>
//                   </div>
//                 </li>
//               );
//             })
//           ) : error ? (
//             <li className="px-4 py-3 text-center text-red-100">{error}</li>
//           ) : (
//             <>
//               {categoriesData?.slice(0, 9)?.map((category, index) => (
//                 <li
//                   key={category._id}
//                   className="flex items-center gap-2 cursor-pointer text-sm font-normal bg-white hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 tracking-wide transition-colors relative"
//                   onMouseEnter={() => setHoveredCategory(index)}
//                 >
//                   <img
//                     data-aos="fade-right"
//                     className="h-6 w-6 object-cover rounded-md"
//                     src={category.imgUrl}
//                     alt={category.name}
//                   />
//                   <span
//                     data-aos="fade-right"
//                     className="text-gray-800 font-normal"
//                   >
//                     {category.name.length > 30
//                       ? category.name.substring(0, 30) + "..."
//                       : category.name}
//                   </span>

//                   {category?.subcategories.length > 0 &&
//                     hoveredCategory === index && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="absolute left-full top-0 z-20 w-60 bg-white shadow-xl rounded-md py-2 border border-gray-100"
//                       >
//                         <ul className="space-y-2">
//                           {category.subcategories.map((subcategory) => (
//                             <motion.li
//                               data-aos="fade-right"
//                               key={subcategory.id}
//                               // whileHover={{ x: 5 }}
//                               className="px-4 py-2 text-sm font-normal hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717] flex items-center gap-2 relative"
//                               onMouseEnter={() =>
//                                 handleSubcategoryHover(subcategory.id)
//                               }
//                               onClick={() =>
//                                 navigate(`/products-list/${subcategory?.id}`)
//                               }
//                             >
//                               <img
//                                 src={subcategory.imgUrl}
//                                 alt={subcategory.name}
//                                 className="w-5 h-5 object-cover rounded"
//                               />
//                               <span className="text-gray-800 font-normal">
//                                 {subcategory.name}
//                               </span>

//                               {/* Sub-sub-categories panel */}
//                               {hoveredSubcategory === subcategory.id &&
//                                 subSubCategories[subcategory.id] &&
//                                 subSubCategories[subcategory.id].length > 0 && (
//                                   <motion.div
//                                     initial={{ opacity: 0, x: 10 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     className="absolute left-full top-0 z-30 w-60 bg-white shadow-xl rounded-md py-2 border border-gray-100"
//                                   >
//                                     <ul className="space-y-2">
//                                       {subSubCategories[subcategory.id].map(
//                                         (subSubCat) => (
//                                           <motion.li
//                                             key={subSubCat._id}
//                                             // whileHover={{ x: 5 }}
//                                             className="px-4 py-2 text-sm font-normal hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717] flex items-center gap-2"
//                                             onClick={(e) => {
//                                               e.stopPropagation();
//                                               // navigate(
//                                               //   `/products-list/${subSubCat._id}`
//                                               // );
//                                               navigate(
//                                                 `/products-list/${subcategory?.id}`
//                                               );
//                                             }}
//                                           >
//                                             <img
//                                               src={subSubCat.imgUrl}
//                                               alt={subSubCat.name}
//                                               className="w-5 h-5 object-cover rounded"
//                                             />
//                                             <span className="text-gray-800 font-normal">
//                                               {subSubCat.name}
//                                             </span>
//                                           </motion.li>
//                                         )
//                                       )}
//                                     </ul>
//                                   </motion.div>
//                                 )}
//                             </motion.li>
//                           ))}
//                         </ul>
//                       </motion.div>
//                     )}
//                 </li>
//               ))}

//               <li
//                 onClick={() => navigate("/categories")}
//                 className="flex items-center gap-2 cursor-pointer bg-white text-sm font-normal hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 tracking-wide transition-colors relative"
//               >
//                 <img
//                   className="h-6 w-6 object-cover rounded-md"
//                   src="https://cdn-icons-png.flaticon.com/512/8058/8058572.png"
//                   alt="all-cat-img"
//                 />
//                 <span className="text-gray-800 font-normal">
//                   Explore All Categories
//                 </span>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>

//       {/* Mobile View */}
//       <div className="md:hidden bg-white shadow-lg text-[#424D58] rounded-lg">
//         <ul className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-lg">
//           {loading ? (
//             Array.from({ length: 10 }).map((_, i) => (
//               <li key={i} className="px-4 py-2.5 flex gap-2 animate-pulse">
//                 <div className="w-6 h-6 bg-gray-300 rounded-md" />
//                 <div className="w-32 h-4 bg-gray-300 rounded" />
//               </li>
//             ))
//           ) : (
//             <>
//               {categoriesData.map((cat, index) => (
//                 <li key={cat._id} className="border-b border-white/20">
//                   <button
//                     className="w-full px-4 py-3 text-left text-white flex justify-between items-center"
//                     onClick={() =>
//                       setActiveMobileIndex(
//                         index === activeMobileIndex ? null : index
//                       )
//                     }
//                   >
//                     <div className="flex gap-2 items-center">
//                       <img
//                         src={cat.imgUrl}
//                         className="w-5 h-5 object-cover rounded"
//                         alt={cat.name}
//                       />
//                       {cat.name}
//                     </div>
//                     <span>{activeMobileIndex === index ? "−" : "+"}</span>
//                   </button>
//                   {activeMobileIndex === index && (
//                     <ul className="bg-white">
//                       {cat.subcategories.map((sub, subIndex) => (
//                         <li key={sub.id} className="border-b border-gray-100">
//                           <button
//                             className="w-full px-6 py-2 text-sm text-[#424D58] hover:text-[#FF8717] hover:bg-[#FFF8F8] flex justify-between items-center"
//                             onClick={() => {
//                               setActiveMobileSubIndex(
//                                 activeMobileSubIndex === sub.id ? null : sub.id
//                               );
//                               fetchSubSubCategories(sub.id);
//                             }}
//                           >
//                             <div className="flex gap-2 items-center">
//                               <img
//                                 src={sub.imgUrl}
//                                 className="w-4 h-4 object-cover rounded"
//                                 alt={sub.name}
//                               />
//                               {sub.name}
//                             </div>
//                             <span>
//                               {activeMobileSubIndex === sub.id ? "−" : "+"}
//                             </span>
//                           </button>

//                           {activeMobileSubIndex === sub.id &&
//                             subSubCategories[sub.id] &&
//                             subSubCategories[sub.id].length > 0 && (
//                               <ul className="bg-gray-50">
//                                 {subSubCategories[sub.id].map((subSubCat) => (
//                                   <li
//                                     key={subSubCat._id}
//                                     className="px-8 py-2 text-sm text-[#424D58] hover:text-[#FF8717] hover:bg-[#FFF8F8] flex items-center gap-2"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       navigate(`/products-list/${sub.id}`);
//                                     }}
//                                   >
//                                     <img
//                                       src={subSubCat.imgUrl}
//                                       alt={subSubCat.name}
//                                       className="w-4 h-4 object-cover rounded"
//                                     />
//                                     {subSubCat.name}
//                                   </li>
//                                 ))}
//                               </ul>
//                             )}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//               <li
//                 onClick={() => navigate("/categories")}
//                 className="px-4 py-3 text-white hover:text-[#FF8717] flex gap-2 items-center"
//               >
//                 <img
//                   src="https://cdn-icons-png.flaticon.com/512/8058/8058572.png"
//                   className="w-5 h-5"
//                   alt="explore"
//                 />
//                 Explore All Categories
//               </li>
//             </>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default HeroCategories;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const HeroCategories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [subSubCategories, setSubSubCategories] = useState({});
  const [activeMobileIndex, setActiveMobileIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [activeMobileSubIndex, setActiveMobileSubIndex] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [subDropdownPosition, setSubDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const categoryRefs = useRef({});
  const subcategoryRefs = useRef({});
  const scrollContainerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 50,
      delay: 0,
      easing: "ease-out",
      disable: "mobile",
    });

    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, []);

  useEffect(() => {
    if (categoriesData.length > 0) {
      AOS.refresh();
    }
  }, [categoriesData]);

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
          description: cat.description,
          subcategories: (cat.subcategories || []).map((sub) => ({
            id: sub._id,
            name: sub.name,
            imgUrl: sub.imgUrl || "https://via.placeholder.com/150",
            description: sub.description,
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

  const fetchSubSubCategories = async (subcategoryId) => {
    if (subSubCategories[subcategoryId]) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${subcategoryId}`
      );

      setSubSubCategories((prev) => ({
        ...prev,
        [subcategoryId]: response.data,
      }));
    } catch (error) {
      console.error("Failed to fetch sub-sub-categories:", error);
      setSubSubCategories((prev) => ({
        ...prev,
        [subcategoryId]: [],
      }));
    }
  };

  const handleCategoryHover = (categoryId) => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setHoveredCategory(categoryId);
    const element = categoryRefs.current[categoryId];
    const scrollContainer = scrollContainerRef.current;

    if (element && scrollContainer) {
      const rect = element.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      // Calculate position relative to viewport
      // Ensure dropdown appears next to the hovered item
      setDropdownPosition({
        top: rect.top,
        left: containerRect.right + 0, // 4px gap from container edge
      });
    }
  };

  const handleSubcategoryHover = (subcategoryId) => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setHoveredSubcategory(subcategoryId);
    fetchSubSubCategories(subcategoryId);

    const element = subcategoryRefs.current[subcategoryId];
    if (element) {
      const rect = element.getBoundingClientRect();
      const subcategoryDropdown = document.querySelector(
        ".subcategory-dropdown"
      );
      const dropdownRect = subcategoryDropdown?.getBoundingClientRect();

      setSubDropdownPosition({
        top: rect.top,
        left: dropdownRect ? dropdownRect.right + 4 : rect.right + 4,
      });
    }
  };

  return (
    <div className="w-full lg:w-[280px] min-w-[280px] relative">
      {/* Desktop View */}
      <div
        className="hidden md:block bg-white shadow-lg text-[#424D58] rounded-lg h-full"
        onMouseLeave={() => {
          setHoveredCategory(null);
          setHoveredSubcategory(null);
        }}
      >
        <div className="relative h-[500px] rounded-lg flex flex-col">
          <div className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] h-5 rounded-t-xl"></div>

          <ul
            ref={scrollContainerRef}
            className="overflow-y-auto flex-1 pb-16"
          >
            {loading ? (
              <>
                {[...Array(10)].map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 bg-white text-sm font-semibold px-4 py-2.5 tracking-wide transition-colors border-b border-gray-100"
                  >
                    <div className="h-6 w-6 rounded-md bg-gray-300 animate-pulse"></div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 h-4 bg-gray-300 animate-pulse rounded-sm"></span>
                      <span className="w-8 h-4 bg-gray-300 animate-pulse rounded-sm"></span>
                      <span className="w-10 h-4 bg-gray-300 animate-pulse rounded-sm"></span>
                      <span className="w-14 h-4 bg-gray-300 animate-pulse rounded-sm"></span>
                    </div>
                  </li>
                ))}
              </>
            ) : error ? (
              <li className="px-4 py-3 text-center text-red-500">{error}</li>
            ) : (
              <>
                {categoriesData?.map((category) => (
                  <li
                    key={category._id}
                    ref={(el) => (categoryRefs.current[category._id] = el)}
                    className="flex items-center gap-2 cursor-pointer text-sm font-normal bg-white hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 tracking-wide transition-colors"
                    onMouseEnter={() => handleCategoryHover(category._id)}
                    onMouseLeave={() => {
                      // Clear any existing timeout
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                      }
                      // Don't clear immediately to allow transition to dropdown
                      hoverTimeoutRef.current = setTimeout(() => {
                        if (hoveredCategory === category._id) {
                          setHoveredCategory(null);
                          setHoveredSubcategory(null);
                        }
                      }, 100);
                    }}
                  >
                    <img
                      data-aos="fade-right"
                      className="h-6 w-6 object-cover rounded-md"
                      src={category.imgUrl}
                      alt={category.name}
                    />
                    <span className="text-gray-800 font-normal">
                      {category.name.length > 30
                        ? category.name.substring(0, 30) + "..."
                        : category.name}
                    </span>
                  </li>
                ))}
              </>
            )}
          </ul>

          {!loading && !error && (
            <div
              onClick={() => navigate("/categories")}
              className="absolute bottom-0 left-0 right-0 flex items-center gap-2 cursor-pointer bg-white text-sm font-normal hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 border-t border-gray-200"
            >
              <img
                className="h-6 w-6 object-cover rounded-md"
                src="https://cdn-icons-png.flaticon.com/512/8058/8058572.png"
                alt="all-cat-img"
              />
              <span className="text-gray-800 font-normal">
                Explore All Categories
              </span>
            </div>
          )}
        </div>
        <div className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] h-5 rounded-b-xl"></div>
      </div>

      {/* Subcategories Dropdown - OUTSIDE main container using fixed positioning */}
      {hoveredCategory &&
        categoriesData.find((cat) => cat._id === hoveredCategory)?.subcategories
          .length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[9999] w-60 bg-white shadow-xl rounded-md py-2 border border-gray-100 max-h-[400px] overflow-y-auto subcategory-dropdown"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
            onMouseEnter={() => {
              // Clear any pending timeout
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
              setHoveredCategory(hoveredCategory);
            }}
            onMouseLeave={() => {
              // Clear any existing timeout
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
              // Delay to allow moving to sub-sub-category dropdown
              hoverTimeoutRef.current = setTimeout(() => {
                setHoveredCategory(null);
                setHoveredSubcategory(null);
              }, 150);
            }}
          >
            <ul className="space-y-2">
              {categoriesData
                .find((cat) => cat._id === hoveredCategory)
                ?.subcategories.map((subcategory) => (
                  <li
                    key={subcategory.id}
                    ref={(el) => (subcategoryRefs.current[subcategory.id] = el)}
                    className="px-4 py-2 text-sm font-normal hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717] flex items-center gap-2 cursor-pointer"
                    onMouseEnter={() => handleSubcategoryHover(subcategory.id)}
                    onMouseLeave={() => {
                      // Clear any existing timeout
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                      }
                      // Delay to allow moving to sub-sub dropdown
                      hoverTimeoutRef.current = setTimeout(() => {
                        if (hoveredSubcategory === subcategory.id) {
                          setHoveredSubcategory(null);
                        }
                      }, 150);
                    }}
                    onClick={() => navigate(`/products-list/${subcategory.id}`)}
                  >
                    <img
                      src={subcategory.imgUrl}
                      alt={subcategory.name}
                      className="w-5 h-5 object-cover rounded"
                    />
                    <span>{subcategory.name}</span>
                  </li>
                ))}
            </ul>
          </motion.div>
        )}

      {/* Sub-sub-categories Dropdown - OUTSIDE using fixed positioning */}
      {hoveredSubcategory &&
        subSubCategories[hoveredSubcategory] &&
        subSubCategories[hoveredSubcategory].length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[10000] w-60 bg-white shadow-xl rounded-md py-2 border border-gray-100 max-h-[400px] overflow-y-auto"
            style={{
              top: `${subDropdownPosition.top}px`,
              left: `${subDropdownPosition.left}px`,
            }}
            onMouseEnter={() => {
              // Clear any pending timeout and keep both dropdowns open
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
              setHoveredSubcategory(hoveredSubcategory);
            }}
            onMouseLeave={() => {
              // Clear any existing timeout
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
              hoverTimeoutRef.current = setTimeout(() => {
                setHoveredSubcategory(null);
              }, 150);
            }}
          >
            <ul className="space-y-2">
              {subSubCategories[hoveredSubcategory].map((subSubCat) => (
                <li
                  key={subSubCat._id}
                  className="px-4 py-2 text-sm font-normal hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717] flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    const subcategoryId = hoveredSubcategory;
                    navigate(`/products-list/${subcategoryId}`);
                  }}
                >
                  <img
                    src={subSubCat.imgUrl}
                    alt={subSubCat.name}
                    className="w-5 h-5 object-cover rounded"
                  />
                  <span>{subSubCat.name}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

      {/* Mobile View */}
      <div className="md:hidden bg-white shadow-lg text-[#424D58] rounded-lg">
        <ul className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-lg">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <li key={i} className="px-4 py-2.5 flex gap-2 animate-pulse">
                <div className="w-6 h-6 bg-gray-300 rounded-md" />
                <div className="w-32 h-4 bg-gray-300 rounded" />
              </li>
            ))
          ) : (
            <>
              {categoriesData.map((cat, index) => (
                <li key={cat._id} className="border-b border-white/20">
                  <button
                    className="w-full px-4 py-3 text-left text-white flex justify-between items-center"
                    onClick={() =>
                      setActiveMobileIndex(
                        index === activeMobileIndex ? null : index
                      )
                    }
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={cat.imgUrl}
                        className="w-5 h-5 object-cover rounded"
                        alt={cat.name}
                      />
                      {cat.name}
                    </div>
                    <span>{activeMobileIndex === index ? "−" : "+"}</span>
                  </button>
                  {activeMobileIndex === index && (
                    <ul className="bg-white">
                      {cat.subcategories.map((sub, subIndex) => (
                        <li key={sub.id} className="border-b border-gray-100">
                          <button
                            className="w-full px-6 py-2 text-sm text-[#424D58] hover:text-[#FF8717] hover:bg-[#FFF8F8] flex justify-between items-center"
                            onClick={() => {
                              setActiveMobileSubIndex(
                                activeMobileSubIndex === sub.id ? null : sub.id
                              );
                              fetchSubSubCategories(sub.id);
                            }}
                          >
                            <div className="flex gap-2 items-center">
                              <img
                                src={sub.imgUrl}
                                className="w-4 h-4 object-cover rounded"
                                alt={sub.name}
                              />
                              {sub.name}
                            </div>
                            <span>
                              {activeMobileSubIndex === sub.id ? "−" : "+"}
                            </span>
                          </button>

                          {activeMobileSubIndex === sub.id &&
                            subSubCategories[sub.id] &&
                            subSubCategories[sub.id].length > 0 && (
                              <ul className="bg-gray-50">
                                {subSubCategories[sub.id].map((subSubCat) => (
                                  <li
                                    key={subSubCat._id}
                                    className="px-8 py-2 text-sm text-[#424D58] hover:text-[#FF8717] hover:bg-[#FFF8F8] flex items-center gap-2 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/products-list/${sub.id}`);
                                    }}
                                  >
                                    <img
                                      src={subSubCat.imgUrl}
                                      alt={subSubCat.name}
                                      className="w-4 h-4 object-cover rounded"
                                    />
                                    {subSubCat.name}
                                  </li>
                                ))}
                              </ul>
                            )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li
                onClick={() => navigate("/categories")}
                className="px-4 py-3 text-white hover:text-[#FF8717] flex gap-2 items-center cursor-pointer"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/8058/8058572.png"
                  className="w-5 h-5"
                  alt="explore"
                />
                Explore All Categories
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeroCategories;
