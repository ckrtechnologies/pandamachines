import React, { useEffect, useRef, useState } from "react";
import banner1 from "../../Assets/Images/Home/Background.png";
import smallBanner1 from "../../Assets/Images/Home/smallBanner1.png";
import smallBanner2 from "../../Assets/Images/Home/smallBanner2.png";
import smallBanner3 from "../../Assets/Images/Home/smallBanner3.png";

const HeaderSection = () => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);

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
        "Dough Mixers",
        "Ovens",
        "Bread Slicers",
        "Packaging for Bakery",
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
      subcategories: [
        "Textile Machinery",
        "Chemical Processing",
        "Metal Working",
        "General Industrial",
      ],
    },
    {
      name: "Cosmetics Manufacturing",
      subcategories: [
        "Textile Machinery",
        "Chemical Processing",
        "Metal Working",
        "General Industrial",
      ],
    },
  ];

  const banners = [
    {
      id: 0,
      title: "All types of Plats & Machines",
      image: banner1,
      bgColor: "bg-orange-100",
    },
    {
      id: 1,
      title: "New all types of manufacture machines",
      image:
        "https://cdn.vectorstock.com/i/500p/65/41/dark-blue-geometric-banner-vector-54386541.jpg",
      bgColor: "bg-purple-100",
    },
    {
      id: 2,
      title: "All types of processing machines",
      image:
        "https://www.shutterstock.com/image-vector/ecommerce-website-banner-template-presents-260nw-2252124451.jpg",
      bgColor: "bg-teal-100",
    },
    {
      id: 3,
      title: "All types of packing machines",
      image:
        "https://t4.ftcdn.net/jpg/05/06/47/83/360_F_506478399_l0jgZ5ZWj80o8XYdEJtYfQhVYMU56qDJ.jpg",
      bgColor: "bg-red-100",
    },
  ];

  const bannerNames = banners.map((banner) => banner.title);
  const [activeMobileIndex, setActiveMobileIndex] = useState(null);
  const intervalRef = useRef(null);

  const startAutoRotate = () => {
    // Clear any existing interval
    clearInterval(intervalRef.current);
    // Start a new interval
    intervalRef.current = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Change every 5 seconds
  };

  useEffect(() => {
    startAutoRotate();

    // Cleanup on unmount
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle manual change (hover) and restart auto-rotation
  const handleHover = (index) => {
    setActiveBanner(index);
    startAutoRotate(); // Reset timer after interaction
  };

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000); // change every 3s

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="relative">
      <div className="px-4 xl:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-[220px] min-w-[220px] relative">
            {/* Desktop View */}
            <div
              className="hidden md:block bg-white shadow-md text-[#424D58] rounded-lg h-full"
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <ul className="py-6 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-md">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className="cursor-pointer text-sm font-semibold bg-white hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-2.5 tracking-wide transition-colors relative"
                    onMouseEnter={() => setHoveredCategory(index)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {category.name}

                    {hoveredCategory === index && (
                      <div className="absolute left-full top-0 ml-1 z-10 w-48 bg-white shadow-lg rounded-md py-2">
                        <ul className="space-y-2">
                          {category.subcategories.map(
                            (subcategory, subIndex) => (
                              <li
                                key={subIndex}
                                className="px-4 py-1 text-sm hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717]"
                              >
                                {subcategory}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}

                <li className="cursor-pointer bg-white text-sm font-semibold hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-2.5 tracking-wide transition-colors relative">
                  Explore All Categories
                </li>
              </ul>
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

                <li className="cursor-pointer text-sm font-semibold text-white px-4 py-3 hover:text-[#FF8717]">
                  Explore All Categories
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 hidden md:flex flex-col justify-between h-full rounded-md">
            {/* Main Banner */}
            <div
              className={`${banners[activeBanner].bgColor} overflow-hidden h-64 shadow-md md:h-80 rounded-t-md`}
            >
              <img
                src={banners[activeBanner].image}
                alt={banners[activeBanner].title}
                className="w-full h-full object-cover rounded-t-md"
              />
            </div>

            {/* Banner Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 rounded-b-md overflow-hidden shadow-md">
              {bannerNames.map((name, index) => (
                <div
                  key={index}
                  onMouseEnter={() => handleHover(index)}
                  className={`py-3 px-6 sm:px-12 text-sm sm:text-md text-center cursor-pointer transition tracking-wide border-gray-400 ${
                    index !== 0 ? "border-l" : ""
                  } ${
                    activeBanner === index
                      ? "bg-[#FFF8F8] text-[#FF8717]"
                      : "bg-[#FFF8F8] text-[#424D58]"
                  }`}
                >
                  {name}
                </div>
              ))}
            </div>

            {/* Small Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <img
                src={smallBanner1}
                alt="img 1"
                className="w-full h-32 object-cover rounded-md shadow-md"
              />
              <img
                src={smallBanner2}
                alt="img 2"
                className="w-full h-32 object-cover rounded-md shadow-md"
              />
              <img
                src={smallBanner3}
                alt="img 3"
                className="w-full h-32 object-cover rounded-md shadow-md"
              />
            </div>
          </div>

          <div className="block md:hidden w-full">
            <div className="relative overflow-hidden rounded-md transition-all duration-500">
              <img
                src={banners[current].image}
                alt={banners[current].title}
                className="w-full h-28 object-contain rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
