// // components/CategoryMenu.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import AOS from "aos";
// import "aos/dist/aos.css";

// const HeroCategories = () => {
//   const [categoriesData, setCategoriesData] = useState([]);
//   const [hoveredCategory, setHoveredCategory] = useState(null);
//   const [activeMobileIndex, setActiveMobileIndex] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     AOS.init({ duration: 800, once: true });
//   }, []);

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

//   return (
//     <div className="w-full lg:w-[280px] min-w-[280px] relative">
//       {/* Desktop View */}
//       <div
//         className="hidden md:block bg-white shadow-lg text-[#424D58] rounded-lg h-full"
//         onMouseLeave={() => setHoveredCategory(null)}
//       >
//         <ul className="py-4 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-lg">
//           {loading ? (
//             [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5].map((i) => {
//               return (
//                 <li className="flex items-center gap-2 cursor-pointer bg-white text-sm font-semibold hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-2.5 tracking-wide transition-colors relative">
//                   <img
//                     data-aos="fade-right"
//                     className="h-6 w-6 object-cover rounded-md animate-pulse"
//                     src="https://adexusa.com/wp-content/uploads/2022/11/Floor-Square-en-rWt2QxfUBxF2UvRz.jpg"
//                     alt="all-cat-img"
//                   />
//                   <div className="flex items-center gap-2">
//                     <span
//                       data-aos="fade-right"
//                       className="w-12 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
//                     >
//                       &nbsp;
//                     </span>
//                     <span
//                       data-aos="fade-right"
//                       className="w-8 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
//                     >
//                       &nbsp;
//                     </span>
//                     <span
//                       data-aos="fade-right"
//                       className="w-12 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
//                     >
//                       &nbsp;
//                     </span>
//                     <span
//                       data-aos="fade-right"
//                       className="w-10 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
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
//                     className="text-gray-800 font-medium"
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
//                         className="absolute left-full top-0 ml-1 z-20 w-60 bg-white shadow-xl rounded-md py-2 border border-gray-100"
//                       >
//                         <ul className="space-y-2">
//                           {category.subcategories.map((subcategory) => (
//                             <motion.li
//                               data-aos="fade-right"
//                               key={subcategory.id}
//                               whileHover={{ x: 5 }}
//                               className="px-4 py-2 text-sm font-normal hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717] flex items-center gap-2"
//                               onClick={() =>
//                                 navigate(`/products-list/${subcategory?.id}`)
//                               }
//                             >
//                               <img
//                                 src={subcategory.imgUrl}
//                                 alt={subcategory.name}
//                                 className="w-5 h-5 object-cover rounded"
//                               />
//                               <span className="text-gray-800">
//                                 {subcategory.name}
//                               </span>
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
//                 <span className="text-gray-800 font-medium">
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
//                       {cat.subcategories.map((sub) => (
//                         <li
//                           key={sub.id}
//                           className="px-6 py-2 text-sm text-[#424D58] hover:text-[#FF8717] hover:bg-[#FFF8F8] flex items-center gap-2"
//                           onClick={() => navigate(`/products-list/${sub.id}`)}
//                         >
//                           <img
//                             src={sub.imgUrl}
//                             className="w-4 h-4 object-cover rounded"
//                             alt={sub.name}
//                           />
//                           {sub.name}
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

import React, { useEffect, useState } from "react";
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
    if (!loading && categoriesData.length > 0) {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [loading, categoriesData]);

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
      // Set empty array to prevent repeated API calls on errors
      setSubSubCategories((prev) => ({
        ...prev,
        [subcategoryId]: [],
      }));
    }
  };

  const handleSubcategoryHover = (subcategoryId) => {
    setHoveredSubcategory(subcategoryId);
    fetchSubSubCategories(subcategoryId);
  };

  return (
    <div className="w-full lg:w-[280px] min-w-[280px] relative ">
      {/* Desktop View */}
      <div
        className="hidden md:block bg-white shadow-lg text-[#424D58] rounded-lg h-full"
        onMouseLeave={() => {
          setHoveredCategory(null);
          setHoveredSubcategory(null);
        }}
      >
        <ul className="py-4 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-lg">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 1, 2, 3, 4].map((i) => {
              return (
                <li className="flex items-center gap-2 cursor-pointer bg-white text-sm font-semibold hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-2.5 tracking-wide transition-colors relative overflow-hidden">
                  <img
                    data-aos="fade-right"
                    className="h-6 w-6 object-cover rounded-md animate-pulse"
                    src="https://adexusa.com/wp-content/uploads/2022/11/Floor-Square-en-rWt2QxfUBxF2UvRz.jpg"
                    alt="all-cat-img"
                  />
                  <div className="flex items-center gap-2">
                    <span
                      data-aos="fade-right"
                      className="w-12 h-5 bg-[#c4c4c4] animate-pulse rounded-sm"
                    >
                      &nbsp;
                    </span>
                    <span
                      data-aos="fade-right"
                      className="w-8 h-5 bg-[#c4c4c4] animate-pulse rounded-sm"
                    >
                      &nbsp;
                    </span>
                    <span
                      data-aos="fade-right"
                      className="w-12 h-5 bg-[#c4c4c4] animate-pulse rounded-sm"
                    >
                      &nbsp;
                    </span>
                    <span
                      data-aos="fade-right"
                      className="w-10 h-5 bg-[#c4c4c4] animate-pulse rounded-sm"
                    >
                      &nbsp;
                    </span>
                  </div>
                </li>
              );
            })
          ) : error ? (
            <li className="px-4 py-3 text-center text-red-100">{error}</li>
          ) : (
            <>
              {categoriesData?.slice(0, 9)?.map((category, index) => (
                <li
                  key={category._id}
                  className="flex items-center gap-2 cursor-pointer text-sm font-normal bg-white hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 tracking-wide transition-colors relative"
                  onMouseEnter={() => setHoveredCategory(index)}
                >
                  <img
                    data-aos="fade-right"
                    className="h-6 w-6 object-cover rounded-md"
                    src={category.imgUrl}
                    alt={category.name}
                  />
                  <span
                    data-aos="fade-right"
                    className="text-gray-800 font-bold"
                  >
                    {category.name.length > 30
                      ? category.name.substring(0, 30) + "..."
                      : category.name}
                  </span>

                  {category?.subcategories.length > 0 &&
                    hoveredCategory === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full top-0 ml-1 z-20 w-60 bg-white shadow-xl rounded-md py-2 border border-gray-100"
                      >
                        <ul className="space-y-2">
                          {category.subcategories.map((subcategory) => (
                            <motion.li
                              data-aos="fade-right"
                              key={subcategory.id}
                              whileHover={{ x: 5 }}
                              className="px-4 py-2 text-sm font-normal hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717] flex items-center gap-2 relative"
                              onMouseEnter={() =>
                                handleSubcategoryHover(subcategory.id)
                              }
                              onClick={() =>
                                navigate(`/products-list/${subcategory?.id}`)
                              }
                            >
                              <img
                                src={subcategory.imgUrl}
                                alt={subcategory.name}
                                className="w-5 h-5 object-cover rounded"
                              />
                              <span className="text-gray-800 hover:font-semibold">
                                {subcategory.name}
                              </span>

                              {/* Sub-sub-categories panel */}
                              {hoveredSubcategory === subcategory.id &&
                                subSubCategories[subcategory.id] &&
                                subSubCategories[subcategory.id].length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="absolute left-full top-0 ml-1 z-30 w-60 bg-white shadow-xl rounded-md py-2 border border-gray-100"
                                  >
                                    <ul className="space-y-2">
                                      {subSubCategories[subcategory.id].map(
                                        (subSubCat) => (
                                          <motion.li
                                            key={subSubCat._id}
                                            whileHover={{ x: 5 }}
                                            className="px-4 py-2 text-sm font-normal hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717] flex items-center gap-2"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // navigate(
                                              //   `/products-list/${subSubCat._id}`
                                              // );
                                              navigate(
                                                `/products-list/${subcategory?.id}`
                                              );
                                            }}
                                          >
                                            <img
                                              src={subSubCat.imgUrl}
                                              alt={subSubCat.name}
                                              className="w-5 h-5 object-cover rounded"
                                            />
                                            <span className="text-gray-800 hover:font-semibold">
                                              {subSubCat.name}
                                            </span>
                                          </motion.li>
                                        )
                                      )}
                                    </ul>
                                  </motion.div>
                                )}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                </li>
              ))}

              <li
                onClick={() => navigate("/categories")}
                className="flex items-center gap-2 cursor-pointer bg-white text-sm font-normal hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 tracking-wide transition-colors relative"
              >
                <img
                  className="h-6 w-6 object-cover rounded-md"
                  src="https://cdn-icons-png.flaticon.com/512/8058/8058572.png"
                  alt="all-cat-img"
                />
                <span className="text-gray-800 font-bold">
                  Explore All Categories
                </span>
              </li>
            </>
          )}
        </ul>
      </div>

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
                      {cat.subcategories.map((sub) => (
                        <li
                          key={sub.id}
                          className="px-6 py-2 text-sm text-[#424D58] hover:text-[#FF8717] hover:bg-[#FFF8F8] flex items-center gap-2"
                          onClick={() => navigate(`/products-list/${sub.id}`)}
                        >
                          <img
                            src={sub.imgUrl}
                            className="w-4 h-4 object-cover rounded"
                            alt={sub.name}
                          />
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li
                onClick={() => navigate("/categories")}
                className="px-4 py-3 text-white hover:text-[#FF8717] flex gap-2 items-center"
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
