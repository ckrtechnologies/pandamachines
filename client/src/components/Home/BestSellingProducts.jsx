import React, { useState } from "react";

const FilterSection = () => {
  const navigate = (path) => {
    console.log(`Navigate to: ${path}`);
    // Replace with your navigation logic
  };
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  const categories = [
    {
      catImg: "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Juice & Beverage Plant",
      subcategories: [
        "Juice Processing",
        "Carbonated Drink Machines",
        "Water Treatment",
        "Bottling Equipment",
      ],
    },
    {
      catImg: "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
      name: "Food Processing Plant",
      subcategories: [
        "Vegetable Processing",
        "Meat Processing",
        "Dairy Equipment",
        "Canning Machinery",
      ],
    },
    {
      catImg: "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Filling & Packing Machines",
      subcategories: [
        "Liquid Filling",
        "Powder Filling",
        "Vacuum Packaging",
        "Labeling Machines",
      ],
    },
    {
      catImg: "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
      name: "Bakery Plant",
      subcategories: [
        "Dough Mixers",
        "Ovens",
        "Bread Slicers",
        "Packaging for Bakery",
      ],
    },
    {
      catImg: "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Dairy Plant",
      subcategories: [
        "Milk Processing",
        "Cheese Making",
        "Yogurt Production",
        "Butter Making",
      ],
    },
    {
      catImg: "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
      name: "Plastic Product Plant",
      subcategories: [
        "Injection Molding",
        "Blow Molding",
        "Extrusion Machines",
        "Plastic Recycling",
      ],
    },
    {
      catImg: "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Pharmaceutical Plant",
      subcategories: [
        "Tablet Presses",
        "Capsule Fillers",
        "Sterilization",
        "Laboratory Equipment",
      ],
    },
    {
      catImg: "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
      name: "Paper Products Plant",
      subcategories: [
        "Paper Making",
        "Printing Machines",
        "Converting Equipment",
        "Packaging",
      ],
    },
    {
      catImg: "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Other Industrial Plants",
      subcategories: [
        "Textile Machinery",
        "Chemical Processing",
        "Metal Working",
        "General Industrial",
      ],
    },
    {
      catImg: "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
      name: "Testing Equipments",
      subcategories: [
        "Quality Control",
        "Material Testing",
        "Calibration Tools",
        "Measurement Devices",
      ],
    },
    {
      catImg: "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Cosmetics Manufacturing",
      subcategories: [
        "Skincare Production",
        "Makeup Manufacturing",
        "Fragrance Production",
        "Packaging Equipment",
      ],
    },
  ];

  const handleCategoryClick = (categoryIndex) => {
    setSelectedCategory(categoryIndex);
    setShowSubcategories(true);
  };

  const handleBackToCategories = () => {
    setShowSubcategories(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="lg:w-[280px] min-w-[280px] relative px-4 xl:px-6 py-4">
        {/* Desktop View */}
        <div className="space-y-6">
          <div
            className="hidden md:block shadow-md text-[#424D58] rounded-lg h-full"
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* Main Categories View */}
            <div>
              <div className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-t-md px-4 py-3">
                <h3 className="text-white font-semibold text-sm">Filter by Category</h3>
              </div>
              <ul className="bg-white rounded-b-md">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-2 cursor-pointer text-sm font-medium hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors relative ${
                      selectedCategory === index ? 'bg-[#FFF8F8] text-[#FF8717]' : ''
                    }`}
                    onClick={() => handleCategoryClick(index)}
                    onMouseEnter={() => setHoveredCategory(index)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <img
                      className="h-6 w-6 object-cover rounded-md"
                      src={category.catImg}
                      alt="catImg"
                    />
                    <span>{category.name}</span>
                  </li>
                ))}

                <li
                  onClick={() => navigate("/categories")}
                  className="flex items-center gap-2 cursor-pointer text-sm font-medium hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 transition-colors relative"
                >
                  <img
                    className="h-6 w-6 object-cover rounded-md"
                    src="https://cdn-icons-png.flaticon.com/512/8058/8058572.png"
                    alt="all-cat-img"
                  />
                  <span>Explore All Categories</span>
                </li>
              </ul>
            </div>

            {/* Subcategories View - Shows below main categories */}
            {showSubcategories && selectedCategory !== null && (
              <div className="mt-4">
                <div className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-t-md px-4 py-3">
                  <h3 className="text-white font-semibold text-sm">Filter by Sub-Category</h3>
                </div>
                <ul className="bg-white rounded-b-md">
                  {/* Selected Category Name */}
                  <li className="px-4 py-2 bg-[#F8F9FA] border-b border-gray-100">
                    <span className="text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                      {categories[selectedCategory]?.name}
                    </span>
                  </li>

                  {/* Subcategories */}
                  {categories[selectedCategory]?.subcategories.map((subcategory, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 cursor-pointer text-sm font-medium hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors relative"
                      onClick={() => console.log(`Selected: ${subcategory}`)}
                    >
                      <img
                        className="h-6 w-6 object-cover rounded-md"
                        src={categories[selectedCategory]?.catImg}
                        alt="subcatImg"
                      />
                      <span>{subcategory}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile / Tablet View: Accordion */}
        <div className="md:hidden bg-white shadow-md text-[#424D58] rounded-lg">
          <ul className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-md">
            {categories.map((category, index) => (
              <li key={index} className="border-b border-white last:border-b-0">
                <button
                  className="w-full text-left text-sm font-semibold text-white px-4 py-3 flex justify-between items-center"
                  onClick={() =>
                    setActiveMobileIndex(
                      index === activeMobileIndex ? null : index
                    )
                  }
                >
                  {category.name}
                  <span>{activeMobileIndex === index ? "−" : "+"}</span>
                </button>
                {activeMobileIndex === index && (
                  <ul className="bg-white space-y-1 py-2">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <li
                        key={subIndex}
                        className="px-6 py-2 text-sm text-[#424D58] hover:text-[#FF8717] hover:bg-[#FFF8F8] cursor-pointer"
                        onClick={() => console.log(`Selected: ${subcategory}`)}
                      >
                        {subcategory}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            <li
              onClick={() => navigate("/categories")}
              className="cursor-pointer text-sm font-semibold text-white px-4 py-3 hover:text-[#FF8717]"
            >
              Explore All Categories
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default FilterSection;