import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FilterSidebar() {
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [subCategoryExpanded, setSubCategoryExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    "Food Processing Plant"
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    {
      name: "Juice & Beverage Plant",
      subcategories: [
        "Juice Processing",
        "Carbonated Drink Machines",
        "Water Treatment",
        "Bottling Equipment",
      ],
    },
    {
      name: "Food Processing Plant",
      subcategories: [
        "Vegetable Processing",
        "Meat Processing",
        "Dairy Equipment",
        "Canning Machinery",
      ],
    },
    {
      name: "Filling & Packing Machines",
      subcategories: [
        "Liquid Filling",
        "Powder Filling",
        "Vacuum Packaging",
        "Labeling Machines",
      ],
    },
    {
      name: "Bakery Plant",
      subcategories: [
        "Dough Mixers",
        "Ovens",
        "Bread Slicers",
        "Packaging for Bakery",
      ],
    },
    {
      name: "Dairy Plant",
      subcategories: [
        "Milk Processing",
        "Cheese Production",
        "Yogurt Fermentation",
        "Packaging Lines",
      ],
    },
    {
      name: "Plastic Product Plant",
      subcategories: [
        "Injection Molding",
        "Blow Molding",
        "Extrusion Machines",
        "Plastic Recycling",
      ],
    },
    {
      name: "Pharmaceutical Plant",
      subcategories: [
        "Tablet Presses",
        "Capsule Fillers",
        "Sterilization",
        "Laboratory Equipment",
      ],
    },
    {
      name: "Paper Products Plant",
      subcategories: [
        "Paper Making",
        "Printing Machines",
        "Converting Equipment",
        "Packaging",
      ],
    },
    {
      name: "Other Industrial Plants",
      subcategories: [
        "Textile Machinery",
        "Chemical Processing",
        "Metal Working",
        "General Industrial",
      ],
    },
    {
      name: "Testing Equipments",
      subcategories: ["Lab Testing", "Quality Control", "Inspection Systems"],
    },
    {
      name: "Cosmetics Manufacturing",
      subcategories: ["Mixing Tanks", "Filling Lines", "Packaging Machines"],
    },
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory("");
  };

  const getSubCategories = () => {
    const category = categories.find((cat) => cat.name === selectedCategory);
    return category ? category.subcategories : [];
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

      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } lg:block px-4 md:px-6 py-4`}
      >
        <div className="w-full lg:w-64 bg-white shadow-md rounded-lg lg:rounded-none space-y-1">
          {/* Filter by Category */}
          <div
            className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white px-4 py-3 rounded-t-lg lg:rounded-t-none cursor-pointer"
            onClick={() => setCategoryExpanded(!categoryExpanded)}
          >
            <div className="flex items-center justify-between w-full text-left">
              <span className="font-semibold">Filter by Category</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  categoryExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {categoryExpanded && (
            <div className="border-b border-gray-200">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 ${
                    selectedCategory === category.name
                      ? "bg-[#FFF8F8] text-[#FF8717] font-medium"
                      : "text-[#424D58] hover:bg-[#FFF8F8] hover:text-[#FF8717]"
                  }`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}

          {/* Filter by Sub-Category */}
          <div
            className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white px-4 py-3 cursor-pointer"
            onClick={() => setSubCategoryExpanded(!subCategoryExpanded)}
          >
            <div className="flex items-center justify-between w-full text-left">
              <span className="font-semibold">Filter by Sub-Category</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  subCategoryExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {subCategoryExpanded && (
            <div className="border-b border-gray-200">
              {getSubCategories().map((subCategory, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 ${
                    selectedSubCategory === subCategory
                      ? "bg-[#FFF8F8] text-[#FF8717] font-medium"
                      : "text-[#424D58] hover:bg-[#FFF8F8] hover:text-[#FF8717]"
                  }`}
                  onClick={() => setSelectedSubCategory(subCategory)}
                >
                  {subCategory}
                </div>
              ))}
            </div>
          )}

          {/* Filter by Price */}
          <div className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white px-4 py-3 rounded-b-lg lg:rounded-b-none cursor-pointer">
            <div className="flex items-center justify-between w-full text-left">
              <span className="font-semibold">Filter by Price</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
