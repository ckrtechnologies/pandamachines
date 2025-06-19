import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCards from "./ProductCards";

const FilterSection = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(null);
  const categories = [
    {
      catImg:
        "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Juice & Beverage Plant",
      subcategories: [
        "Juice Processing",
        "Carbonated Drink Machines",
        "Water Treatment",
        "Bottling Equipment",
      ],
    },
    {
      catImg:
        "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
      name: "Food Processing Plant",
      subcategories: [
        "Vegetable Processing",
        "Meat Processing",
        "Dairy Equipment",
        "Canning Machinery",
      ],
    },
    {
      catImg:
        "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Filling & Packing Machines",
      subcategories: [
        "Liquid Filling",
        "Powder Filling",
        "Vacuum Packaging",
        "Labeling Machines",
      ],
    },
    {
      catImg:
        "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
      name: "Bakery Plant",
      subcategories: [
        "Dough Mixers",
        "Ovens",
        "Bread Slicers",
        "Packaging for Bakery",
      ],
    },
    {
      catImg:
        "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Dairy Plant",
      subcategories: [
        "Dough Mixers",
        "Ovens",
        "Bread Slicers",
        "Packaging for Bakery",
      ],
    },
    {
      catImg:
        "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
      name: "Plastic Product Plant",
      subcategories: [
        "Injection Molding",
        "Blow Molding",
        "Extrusion Machines",
        "Plastic Recycling",
      ],
    },
    {
      catImg:
        "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Pharmaceutical Plant",
      subcategories: [
        "Tablet Presses",
        "Capsule Fillers",
        "Sterilization",
        "Laboratory Equipment",
      ],
    },
    {
      catImg:
        "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
      name: "Paper Products Plant",
      subcategories: [
        "Paper Making",
        "Printing Machines",
        "Converting Equipment",
        "Packaging",
      ],
    },
    {
      catImg:
        "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Other Industrial Plants",
      subcategories: [
        "Textile Machinery",
        "Chemical Processing",
        "Metal Working",
        "General Industrial",
      ],
    },
    {
      catImg:
        "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
      name: "Testing Equipments",
      subcategories: [
        "Textile Machinery",
        "Chemical Processing",
        "Metal Working",
        "General Industrial",
      ],
    },
    {
      catImg:
        "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
      name: "Cosmetics Manufacturing",
      subcategories: [
        "Textile Machinery",
        "Chemical Processing",
        "Metal Working",
        "General Industrial",
      ],
    },
  ];
  
  return (
    <>
      <div className="w-full lg:w-[280px] min-w-[280px] relative  px-4 xl:px-6 py-4">
        {/* <div className="w-full lg:w-[220px] min-w-[220px] relative"> */}
        {/* Desktop View */}
        <div className="space-y-6">
          <div
            className="hidden md:block bg-white shadow-md text-[#424D58] rounded-lg h-full"
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <ul className="py-6 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-md">
            
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 cursor-pointer text-sm font-semibold bg-white hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-2 tracking-wide transition-colors relative"
                  onMouseEnter={() => setHoveredCategory(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <img
                    className="h-6 w-6 object-cover rounded-md"
                    src={category.catImg}
                    alt="catImg"
                  />
                  <span>{category.name}</span>

                  {hoveredCategory === index && (
                    <div className="absolute left-full top-0 ml-1 z-10 w-60 bg-white shadow-lg rounded-md py-2">
                      {/* <div className="absolute left-full top-0 ml-1 z-10 w-48 bg-white shadow-lg rounded-md py-2"> */}
                      <ul className="space-y-2">
                        {category.subcategories.map((subcategory, subIndex) => (
                          <li
                            key={subIndex}
                            className="px-4 py-1 text-sm hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717]"
                          >
                            {subcategory}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}

              <li
                onClick={() => navigate("/categories")}
                className="flex items-center gap-2 cursor-pointer bg-white text-sm font-semibold hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-2 tracking-wide transition-colors relative"
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
        </div>

        {/* Mobile / Tablet View: Accordion */}
        <div className="md:hidden bg-white shadow-md text-[#424D58] rounded-lg">
          <ul className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-md">
            {categories.map((category, index) => (
              <li key={index} className="border-b border-white">
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
                        className="px-6 py-1 text-sm text-[#424D58] hover:text-[#FF8717] hover:bg-[#FFF8F8]"
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
      <ProductCards />
    </>
  );
};

export default FilterSection;
