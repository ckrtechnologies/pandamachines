// import React, { useState } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function FilterSidebar({
//   subCategories,
//   selectedSubCategoryId,
// }) {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [expandedCategoryId, setExpandedCategoryId] = useState(null);
//   const navigate = useNavigate();

//   // Group sub-categories by category
//   const categoriesMap = subCategories.reduce((acc, subCategory) => {
//     const category = subCategory.category;
//     if (!acc[category._id]) {
//       acc[category._id] = {
//         ...category,
//         subcategories: [],
//       };
//     }
//     acc[category._id].subcategories.push(subCategory);
//     return acc;
//   }, {});

//   const categories = Object.values(categoriesMap);

//   const handleSubCategorySelect = (subCategoryId) => {
//     navigate(`/products-list/${subCategoryId}`);
//   };

//   const toggleCategory = (categoryId) => {
//     setExpandedCategoryId((prevId) =>
//       prevId === categoryId ? null : categoryId
//     );
//   };

//   return (
//     <div className="relative">
//       {/* Mobile filter button */}
//       <div className="lg:hidden p-4">
//         <button
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white rounded-md font-semibold"
//         >
//           <span>Filters</span>
//           <ChevronDown
//             className={`w-4 h-4 transition-transform ${
//               mobileMenuOpen ? "rotate-180" : ""
//             }`}
//           />
//         </button>
//       </div>

//       <div className={`${mobileMenuOpen ? "block" : "hidden"} lg:block`}>
//         <div className="w-full lg:w-64 bg-white hover:shadow-md rounded-lg lg:rounded-none">
//           {/* Filter header */}
//           <div className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white px-4 py-3 rounded-t-lg lg:rounded-t-none">
//             <div className="flex items-center justify-between w-full text-left">
//               <span className="font-semibold tracking-wider">
//                 Filter by Category
//               </span>
//             </div>
//           </div>

//           {/* Categories list */}
//           <div className="border-b border-gray-200">
//             {categories.map((category) => (
//               <div
//                 key={category._id}
//                 className="border-b border-gray-100 last:border-b-0"
//               >
//                 {/* Category item */}
//                 <div
//                   className="px-4 py-3 text-gray-800 cursor-pointer flex justify-between items-center hover:bg-gray-50"
//                   onClick={() => toggleCategory(category._id)}
//                 >
//                   <span className="text-sm font-semibold tracking-wide">
//                     {category.name}
//                   </span>
//                   {expandedCategoryId === category._id ? (
//                     <ChevronDown className="w-4 h-4" />
//                   ) : (
//                     <ChevronRight className="w-4 h-4" />
//                   )}
//                 </div>

//                 {/* Subcategories dropdown with animation */}
//                 <div
//                   className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                     expandedCategoryId === category._id ? "max-h-96" : "max-h-0"
//                   }`}
//                 >
//                   <div className="bg-[#f7e0e0]">
//                     {category.subcategories.map((subCategory) => (
//                       <div
//                         key={subCategory._id}
//                         className={`px-6 py-2 cursor-pointer text-sm tracking-wide ${
//                           selectedSubCategoryId === subCategory._id
//                             ? "bg-[#c9f6cf] text-[#166c21] font-medium"
//                             : "text-[#424D58] hover:text-[#166c21]"
//                         }`}
//                         onClick={() => handleSubCategorySelect(subCategory._id)}
//                       >
//                         {subCategory.name}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FilterSidebar({
  subCategories,
  subSubCategories,
  selectedSubCategoryId,
  selectedSubSubCategoryId,
  onSubSubCategorySelect,
  onViewAll,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const navigate = useNavigate();

  // Group sub-categories by category
  const categoriesMap = subCategories.reduce((acc, subCategory) => {
    const category = subCategory.category;
    if (!acc[category._id]) {
      acc[category._id] = {
        ...category,
        subcategories: [],
      };
    }
    acc[category._id].subcategories.push(subCategory);
    return acc;
  }, {});

  const categories = Object.values(categoriesMap);

  const handleSubCategorySelect = (subCategoryId) => {
    navigate(`/products-list/${subCategoryId}`);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategoryId((prevId) =>
      prevId === categoryId ? null : categoryId
    );
  };

  return (
    <div className="relative">
      {/* Mobile filter button */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white rounded-md font-semibold"
        >
          <span>Filters</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              mobileMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className={`${mobileMenuOpen ? "block" : "hidden"} lg:block`}>
        <div className="w-full lg:w-64 bg-white hover:shadow-md rounded-lg lg:rounded-none">
          {/* Filter header */}
          <div className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white px-4 py-3 rounded-t-lg lg:rounded-t-none">
            <div className="flex items-center justify-between w-full text-left">
              <span className="font-semibold tracking-wider">
                Filter by Category
              </span>
            </div>
          </div>

          {/* Categories list */}
          <div className="border-b border-gray-200">
            {categories.map((category) => (
              <div
                key={category._id}
                className="border-b border-gray-100 last:border-b-0"
              >
                {/* Category item */}
                <div
                  className="px-4 py-3 text-gray-800 cursor-pointer flex justify-between items-center hover:bg-gray-50"
                  onClick={() => toggleCategory(category._id)}
                >
                  <span className="text-sm font-semibold tracking-wide">
                    {category.name}
                  </span>
                  {expandedCategoryId === category._id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>

                {/* Subcategories dropdown with animation */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    expandedCategoryId === category._id ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="bg-[#f7e0e0]">
                    {category.subcategories.map((subCategory) => (
                      <div key={subCategory._id}>
                        {/* Sub-category item */}
                        <div
                          className={`px-6 py-2 cursor-pointer text-sm tracking-wide ${
                            selectedSubCategoryId === subCategory._id
                              ? "bg-[#c9f6cf] text-[#166c21] font-medium"
                              : "text-[#424D58] hover:text-[#166c21]"
                          }`}
                          onClick={() =>
                            handleSubCategorySelect(subCategory._id)
                          }
                        >
                          {subCategory.name}
                        </div>

                        {/* Show sub-sub-categories if this is the selected sub-category */}
                        {selectedSubCategoryId === subCategory._id &&
                          subSubCategories.length > 0 && (
                            <div className="pl-8 bg-[#e8f4ff]">
                              {/* "View All" option */}
                              <div
                                className={`px-4 py-2 cursor-pointer text-xs ${
                                  !selectedSubSubCategoryId
                                    ? "bg-[#a0d7ff] text-[#0056b3] font-medium"
                                    : "text-[#424D58] hover:text-[#0056b3]"
                                }`}
                                onClick={onViewAll}
                              >
                                View All
                              </div>

                              {/* Sub-sub-categories */}
                              {subSubCategories.map((subSubCategory) => (
                                <div
                                  key={subSubCategory._id}
                                  className={`px-4 py-2 cursor-pointer text-xs ${
                                    selectedSubSubCategoryId ===
                                    subSubCategory._id
                                      ? "bg-[#a0d7ff] text-[#0056b3] font-medium"
                                      : "text-[#424D58] hover:text-[#0056b3]"
                                  }`}
                                  onClick={() =>
                                    onSubSubCategorySelect(subSubCategory._id)
                                  }
                                >
                                  {subSubCategory.name}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
