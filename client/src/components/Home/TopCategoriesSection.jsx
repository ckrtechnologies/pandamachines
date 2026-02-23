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
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [subSubCategories, setSubSubCategories] = useState({});
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchSubSubCategories = async (subcategoryId) => {
    if (subSubCategories[subcategoryId]) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${subcategoryId}`,
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

  const handleSubcategoryHover = (subcategoryId) => {
    setHoveredSubcategory(subcategoryId);
    fetchSubSubCategories(subcategoryId);
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
    setHoveredSubcategory(null);
  };

  return (
    <div className="bg-[#f9f7f7] shadow-sm pt-6 border-t border-gray-100 relative">
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
                  <div className="rounded-xl bg-white group-hover:bg-blue-50 transition duration-200 mb-2  ">
                    <img
                      src={cat.imgUrl}
                      alt={cat.name}
                      className="h-5 w-5 md:h-16 md:w-16 object-cover rounded-xl"
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
      {hoveredCategory && hoveredCategory?.subcategories?.length > 0 && (
        <div
          className="absolute z-50 bg-white shadow-lg rounded-md p-4 min-w-[200px]"
          style={{
            left: `${dropdownPosition.left}px`,
          }}
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={handleCategoryLeave}
        >
          <h3 className="font-semibold text-sm text-gray-800 mb-2 border-b pb-2">
            {hoveredCategory.name}
          </h3>
          <ul className="space-y-2">
            {hoveredCategory.subcategories.map((subcat) => (
              <li key={subcat.id} className="relative">
                <div
                  className="flex items-center text-gray-600 text-sm cursor-pointer hover:text-[#FF6B00] py-1 px-2 hover:bg-[#FFF8F8] rounded"
                  onMouseEnter={() => {
                    if (window.innerWidth >= 768) {
                      handleSubcategoryHover(subcat.id);
                    }
                  }}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setHoveredSubcategory(
                        hoveredSubcategory === subcat.id ? null : subcat.id,
                      );
                      fetchSubSubCategories(subcat.id);
                    } else {
                      navigate(`/products-list/${subcat.id}`);
                    }
                  }}
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
                {hoveredSubcategory === subcat.id &&
                  subSubCategories[subcat.id] &&
                  subSubCategories[subcat.id].length > 0 && (
                    <div
                      className="
    relative top-full left-0 mt-1 w-full 
    md:absolute md:left-full md:top-0 md:ml-1 md:w-60
    bg-white shadow-xl rounded-md py-2 border border-gray-100
  "
                    >
                      <ul className="space-y-2">
                        {subSubCategories[subcat.id].map((subSubCat) => (
                          <li
                            key={subSubCat._id}
                            className="px-4 py-2 text-sm font-normal hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF6B00] flex items-center gap-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products-list/${subcat.id}`);
                            }}
                          >
                            <img
                              src={subSubCat.imgUrl}
                              alt={subSubCat.name}
                              className="w-5 h-5 object-cover rounded"
                            />
                            <span className="text-gray-800">
                              {subSubCat.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopCategoriesSection;
