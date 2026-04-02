import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FilterSidebar({
  subCategories = [],
  subSubCategories = [],
  selectedSubCategoryId,
  selectedSubSubCategoryId,
  onSubSubCategorySelect,
  onViewAll,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [expandedSubCategoryId, setExpandedSubCategoryId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedSubCategoryId && Array.isArray(subCategories)) {
      const selectedSubCategory = subCategories.find(
        (subCat) => subCat?._id === selectedSubCategoryId
      );
      if (selectedSubCategory && selectedSubCategory.category) {
        setExpandedCategoryId(selectedSubCategory.category._id);
        setExpandedSubCategoryId(selectedSubCategoryId);
      }
    }
  }, [selectedSubCategoryId, subCategories]);

  const categoriesMap = (Array.isArray(subCategories) ? subCategories : [])
    .filter((subCategory) => {
      return subCategory && subCategory.category && subCategory.category._id;
    })
    .reduce((acc, subCategory) => {
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

  const getSubSubCategoriesForSubCategory = (subCategoryId) => {
    if (!Array.isArray(subSubCategories)) return [];

    return subSubCategories.filter((subSubCat) => {
      return (
        subSubCat &&
        subSubCat.subCategory &&
        subSubCat.subCategory._id === subCategoryId
      );
    });
  };

  const handleSubCategoryClick = (subCategoryId) => {
    if (expandedSubCategoryId === subCategoryId) {
      setExpandedSubCategoryId(null);
    } else {
      setExpandedSubCategoryId(subCategoryId);
      navigate(`/products-list/${subCategoryId}`);
    }
  };

  const toggleCategory = (categoryId) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
      setExpandedSubCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
    }
  };

  const toggleSubCategory = (subCategoryId, event) => {
    event.stopPropagation();

    if (expandedSubCategoryId === subCategoryId) {
      setExpandedSubCategoryId(null);
    } else {
      setExpandedSubCategoryId(subCategoryId);
      if (selectedSubCategoryId !== subCategoryId) {
        navigate(`/products-list/${subCategoryId}`);
      }
    }
  };

  return (
    <div className="relative">
      <div className="lg:hidden py-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white rounded-md font-semibold transition-all duration-300 hover:shadow-lg"
        >
          <span>Filters</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              mobileMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className={`${mobileMenuOpen ? "block" : "hidden"} lg:block`}>
        <div className="w-full lg:w-64 bg-white hover:shadow-md rounded-lg lg:rounded-none transition-shadow duration-300">
          <div className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white px-4 py-3 rounded-t-lg lg:rounded-t-none">
            <div className="flex items-center justify-between w-full text-left">
              <span className="font-semibold tracking-wider">
                Filter by Category
              </span>
            </div>
          </div>
          <div className="border-b border-gray-200 w-full flexw overflow-hidden">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <div
                    className="px-4 py-3 text-gray-800 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleCategory(category._id)}
                  >
                    <span className="text-sm font-semibold tracking-wide">
                      {category.name}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expandedCategoryId === category._id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      expandedCategoryId === category._id
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="bg-[#f7e0e0]">
                      {category.subcategories.map((subCategory) => {
                        const currentSubSubCategories =
                          getSubSubCategoriesForSubCategory(subCategory._id);

                        return (
                          <div key={subCategory._id}>
                            <div
                              className={`px-6 py-2 cursor-pointer text-sm tracking-wide flex justify-between items-center transition-colors duration-200 ${
                                selectedSubCategoryId === subCategory._id
                                  ? "bg-[#c9f6cf] text-[#166c21] font-medium"
                                  : "text-[#424D58] hover:bg-[#f0f0f0] hover:text-[#166c21]"
                              }`}
                              onClick={() =>
                                handleSubCategoryClick(subCategory._id)
                              }
                            >
                              <span>{subCategory.name}</span>
                              <ChevronRight
                                size={16}
                                className={`transition-transform duration-300 ${
                                  expandedSubCategoryId === subCategory._id
                                    ? "rotate-90"
                                    : ""
                                }`}
                                onClick={(e) =>
                                  toggleSubCategory(subCategory._id, e)
                                }
                              />
                            </div>
                            {selectedSubCategoryId === subCategory._id && (
                              <div
                                className={`transition-all duration-400 ease-in-out overflow-hidden ${
                                  expandedSubCategoryId === subCategory._id
                                    ? "max-h-96 opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                              >
                                <div className="pl-8 bg-[#e8f4ff]">
                                  {currentSubSubCategories.length > 0 ? (
                                    <>
                                      <div
                                        className={`px-4 py-2 cursor-pointer text-xs transition-colors duration-200 ${
                                          !selectedSubSubCategoryId
                                            ? "bg-[#a0d7ff] text-[#0056b3] font-medium"
                                            : "text-[#424D58] hover:bg-[#d0e8ff] hover:text-[#0056b3]"
                                        }`}
                                        onClick={onViewAll}
                                      >
                                        View All
                                      </div>
                                      {currentSubSubCategories.map(
                                        (subSubCategory) => (
                                          <div
                                            key={subSubCategory._id}
                                            className={`px-4 py-2 cursor-pointer text-xs transition-colors duration-200 ${
                                              selectedSubSubCategoryId ===
                                              subSubCategory._id
                                                ? "bg-[#a0d7ff] text-[#0056b3] font-medium"
                                                : "text-[#424D58] hover:bg-[#d0e8ff] hover:text-[#0056b3]"
                                            }`}
                                            onClick={() =>
                                              onSubSubCategorySelect(
                                                subSubCategory._id
                                              )
                                            }
                                          >
                                            {subSubCategory.name}
                                          </div>
                                        )
                                      )}
                                    </>
                                  ) : (
                                    <div className="px-4 py-3 text-xs text-gray-500 italic">
                                      No sub-sub-categories found
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No categories available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
