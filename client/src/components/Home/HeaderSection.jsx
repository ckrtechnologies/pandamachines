import React, { useEffect, useRef, useState } from "react";
import banner1 from "../../Assets/Images/Home/Background.png";
import smallBanner1 from "../../Assets/Images/Home/smallBanner1.png";
import smallBanner2 from "../../Assets/Images/Home/smallBanner2.png";
import smallBanner3 from "../../Assets/Images/Home/smallBanner3.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const HeaderSection = () => {
  const navigate = useNavigate();
  const [activeBanner, setActiveBanner] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(null);
  const intervalRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in ms
      once: true, // Whether animation should happen only once
    });
  }, []);

  // Animation variants
  const bannerVariants = {
    enter: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 1000 : -1000,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction < 0 ? 1000 : -1000,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  useEffect(() => {
    const getAllCats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/sub-categories/get-all-sub-categories`
        );

        const categoriesMap = new Map();
        response.data.forEach((product) => {
          if (!categoriesMap.has(product.category._id)) {
            categoriesMap.set(product.category._id, {
              ...product.category,
              subcategories: [],
            });
          }
          categoriesMap.get(product.category._id).subcategories.push({
            id: product._id,
            name: product.name,
            imgUrl: product.imgUrl || "https://via.placeholder.com/150",
            description: product.description,
          });
        });

        setCategoriesData(Array.from(categoriesMap.values()));
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getAllCats();
  }, []);

  const banners = [
    {
      id: 0,
      title: "All types of Plants & Machines",
      image: banner1,
      bgColor: "bg-orange-100",
    },
    {
      id: 1,
      title: "New all types of manufacture machines",
      image:
        "https://static.vecteezy.com/system/resources/previews/004/707/493/non_2x/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
      bgColor: "bg-purple-100",
    },
    {
      id: 2,
      title: "All types of processing machines",
      image:
        "https://static.vecteezy.com/system/resources/previews/006/828/785/non_2x/paper-art-shopping-online-on-smartphone-and-new-buy-sale-promotion-pink-backgroud-for-banner-market-ecommerce-women-concept-free-vector.jpg",
      bgColor: "bg-teal-100",
    },
    {
      id: 3,
      title: "All types of packing machines",
      image:
        "https://cdn.vectorstock.com/i/500p/57/56/shopping-cart-banner-online-store-vector-42935756.jpg",
      bgColor: "bg-red-100",
    },
  ];

  const bannerNames = banners.map((banner) => banner.title);

  // Banner auto-rotation with direction tracking
  const [direction, setDirection] = useState(1);

  const startAutoRotate = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActiveBanner((prev) => (prev + 1) % banners.length);
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoRotate();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleHover = (index) => {
    if (index !== activeBanner) {
      setDirection(index > activeBanner ? 1 : -1);
      setActiveBanner(index);
      startAutoRotate();
    }
  };

  return (
    <header className="relative bg-gray-50">
      <div className="px-4 xl:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Categories Section */}
          <div className="w-full lg:w-[280px] min-w-[280px] relative">
            {/* Desktop View */}
            <div
              className="hidden md:block bg-white shadow-lg text-[#424D58] rounded-lg h-full"
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <ul className="py-4 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-lg">
                {loading ? (
                  [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5].map((i) => {
                    return (
                      <li className="flex items-center gap-2 cursor-pointer bg-white text-sm font-semibold hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-2.5 tracking-wide transition-colors relative">
                        <img
                          data-aos="fade-right"
                          className="h-6 w-6 object-cover rounded-md animate-pulse"
                          src="https://adexusa.com/wp-content/uploads/2022/11/Floor-Square-en-rWt2QxfUBxF2UvRz.jpg"
                          alt="all-cat-img"
                        />
                        <div className="flex items-center gap-2">
                          <span
                            data-aos="fade-right"
                            className="w-12 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
                          >
                            &nbsp;
                          </span>
                          <span
                            data-aos="fade-right"
                            className="w-8 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
                          >
                            &nbsp;
                          </span>
                          <span
                            data-aos="fade-right"
                            className="w-12 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
                          >
                            &nbsp;
                          </span>
                          <span
                            data-aos="fade-right"
                            className="w-10 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
                          >
                            &nbsp;
                          </span>
                        </div>
                      </li>
                    );
                  })
                ) : error ? (
                  <li className="px-4 py-3 text-center text-red-100">
                    {error}
                  </li>
                ) : (
                  <>
                    {categoriesData.map((category, index) => (
                      <li
                        key={category._id}
                        className="flex items-center gap-2 cursor-pointer text-sm font-semibold bg-white hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 tracking-wide transition-colors relative"
                        onMouseEnter={() => setHoveredCategory(index)}
                      >
                        <img
                          data-aos="fade-right"
                          className="h-6 w-6 object-cover rounded-md"
                          src={category.imgUrl}
                          alt={category.name}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                        <span data-aos="fade-right">
                          {category.name.length > 30
                            ? category.name.substring(0, 30) + "..."
                            : category.name}
                        </span>

                        {hoveredCategory === index && (
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
                                  className="px-4 py-2 text-sm hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717] flex items-center gap-2"
                                  onClick={() =>
                                    navigate(`/products/${subcategory.id}`)
                                  }
                                >
                                  <img
                                    src={subcategory.imgUrl}
                                    alt={subcategory.name}
                                    className="w-5 h-5 object-cover rounded"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/150";
                                    }}
                                  />
                                  {subcategory.name}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </li>
                    ))}

                    <li
                      onClick={() => navigate("/categories")}
                      className="flex items-center gap-2 cursor-pointer bg-white text-sm font-semibold hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-3 tracking-wide transition-colors relative"
                    >
                      <img
                        className="h-6 w-6 object-cover rounded-md"
                        src="https://cdn-icons-png.flaticon.com/512/8058/8058572.png"
                        alt="all-cat-img"
                      />
                      <span>Explore All Categories</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Mobile / Tablet View */}
            <div className="md:hidden bg-white shadow-lg text-[#424D58] rounded-lg">
              <ul className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-lg">
                {loading ? (
                  [1, 2, 3, 4, 5, 6, 1, 2, 3, 4].map((i) => {
                    return (
                      <li className="flex items-center gap-2 px-4 py-2.5 relative rounded-lg bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91]">
                        <img
                          data-aos="fade-right"
                          className="h-6 w-6 object-cover rounded-md animate-pulse"
                          src="https://adexusa.com/wp-content/uploads/2022/11/Floor-Square-en-rWt2QxfUBxF2UvRz.jpg"
                          alt="all-cat-img"
                        />
                        <div className="flex items-center gap-2">
                          <span
                            data-aos="fade-right"
                            className="w-12 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
                          >
                            &nbsp;
                          </span>
                          <span
                            data-aos="fade-right"
                            className="w-8 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
                          >
                            &nbsp;
                          </span>
                          <span
                            data-aos="fade-right"
                            className="w-12 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
                          >
                            &nbsp;
                          </span>
                          <span
                            data-aos="fade-right"
                            className="w-10 h-4 bg-[#c4c4c4] animate-pulse rounded-sm"
                          >
                            &nbsp;
                          </span>
                        </div>
                      </li>
                    );
                  })
                ) : error ? (
                  <li className="px-4 py-3 text-center text-red-100">
                    {error}
                  </li>
                ) : (
                  <>
                    {categoriesData.map((category, index) => (
                      <li
                        key={category._id}
                        className="border-b border-white/20"
                      >
                        <button
                          className="w-full text-left text-sm font-semibold text-white px-4 py-3 flex justify-between items-center"
                          onClick={() =>
                            setActiveMobileIndex(
                              index === activeMobileIndex ? null : index
                            )
                          }
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={category.imgUrl}
                              alt={category.name}
                              className="w-5 h-5 object-cover rounded"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/150";
                              }}
                            />
                            {category.name}
                          </div>
                          <span>{activeMobileIndex === index ? "−" : "+"}</span>
                        </button>
                        {activeMobileIndex === index && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white overflow-hidden"
                          >
                            {category.subcategories.map((subcategory) => (
                              <motion.li
                                key={subcategory.id}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2 text-sm text-[#424D58] hover:text-[#FF8717] hover:bg-[#FFF8F8] flex items-center gap-2"
                                onClick={() =>
                                  navigate(`/products/${subcategory.id}`)
                                }
                              >
                                <img
                                  src={subcategory.imgUrl}
                                  alt={subcategory.name}
                                  className="w-4 h-4 object-cover rounded"
                                />
                                {subcategory.name}
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </li>
                    ))}

                    <li
                      onClick={() => navigate("/categories")}
                      className="cursor-pointer text-sm font-semibold text-white px-4 py-3 hover:text-[#FF8717] flex items-center gap-2"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/8058/8058572.png"
                        alt="all-categories"
                        className="w-5 h-5"
                      />
                      Explore All Categories
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 hidden md:flex flex-col justify-between h-full rounded-md">
            <div
              className={`${banners[activeBanner].bgColor} overflow-hidden h-64 shadow-md md:h-80 rounded-t-md`}
            >
              <img
                key={banners[activeBanner].id}
                src={banners[activeBanner].image}
                alt={banners[activeBanner].title}
                className="w-full h-full object-cover rounded-t-md opacity-0 animate-fadeSlide"
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
              {[smallBanner1, smallBanner2, smallBanner3].map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`img ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-md shadow-md"
                />
              ))}
            </div>
          </div>

          {/* Mobile Banner View */}
          <div className="block md:hidden w-full">
            <div className="relative overflow-hidden rounded-md transition-all duration-500">
              <img
                key={banners[current].id}
                src={banners[current].image}
                alt={banners[current].title}
                className="w-full h-28 object-contain rounded-md opacity-0 animate-fadeSlide"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;

// import React, { useEffect, useRef, useState } from "react";
// import banner1 from "../../Assets/Images/Home/Background.png";
// import smallBanner1 from "../../Assets/Images/Home/smallBanner1.png";
// import smallBanner2 from "../../Assets/Images/Home/smallBanner2.png";
// import smallBanner3 from "../../Assets/Images/Home/smallBanner3.png";
// import { useNavigate } from "react-router-dom";

// const HeaderSection = () => {
//   const navigate = useNavigate();
//   const [activeBanner, setActiveBanner] = useState(0);
//   const [hoveredCategory, setHoveredCategory] = useState(null);

//   const categories = [
//     {
//       catImg:
//         "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
//       name: "Juice & Beverage Plant",
//       subcategories: [
//         "Juice Processing",
//         "Carbonated Drink Machines",
//         "Water Treatment",
//         "Bottling Equipment",
//       ],
//     },
//     {
//       catImg:
//         "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
//       name: "Food Processing Plant",
//       subcategories: [
//         "Vegetable Processing",
//         "Meat Processing",
//         "Dairy Equipment",
//         "Canning Machinery",
//       ],
//     },
//     {
//       catImg:
//         "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
//       name: "Filling & Packing Machines",
//       subcategories: [
//         "Liquid Filling",
//         "Powder Filling",
//         "Vacuum Packaging",
//         "Labeling Machines",
//       ],
//     },
//     {
//       catImg:
//         "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
//       name: "Bakery Plant",
//       subcategories: [
//         "Dough Mixers",
//         "Ovens",
//         "Bread Slicers",
//         "Packaging for Bakery",
//       ],
//     },
//     {
//       catImg:
//         "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
//       name: "Dairy Plant",
//       subcategories: [
//         "Dough Mixers",
//         "Ovens",
//         "Bread Slicers",
//         "Packaging for Bakery",
//       ],
//     },
//     {
//       catImg:
//         "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
//       name: "Plastic Product Plant",
//       subcategories: [
//         "Injection Molding",
//         "Blow Molding",
//         "Extrusion Machines",
//         "Plastic Recycling",
//       ],
//     },
//     {
//       catImg:
//         "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
//       name: "Pharmaceutical Plant",
//       subcategories: [
//         "Tablet Presses",
//         "Capsule Fillers",
//         "Sterilization",
//         "Laboratory Equipment",
//       ],
//     },
//     {
//       catImg:
//         "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
//       name: "Paper Products Plant",
//       subcategories: [
//         "Paper Making",
//         "Printing Machines",
//         "Converting Equipment",
//         "Packaging",
//       ],
//     },
//     {
//       catImg:
//         "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
//       name: "Other Industrial Plants",
//       subcategories: [
//         "Textile Machinery",
//         "Chemical Processing",
//         "Metal Working",
//         "General Industrial",
//       ],
//     },
//     {
//       catImg:
//         "https://as1.ftcdn.net/jpg/02/72/41/02/1000_F_272410213_9Kz6X48WuF6ndlPA6TBHgfOmVgPFWBAV.jpg",
//       name: "Testing Equipments",
//       subcategories: [
//         "Textile Machinery",
//         "Chemical Processing",
//         "Metal Working",
//         "General Industrial",
//       ],
//     },
//     {
//       catImg:
//         "https://www.aguapuro.co/images/juice-and-soft-drink-turnkey-projects5.jpg",
//       name: "Cosmetics Manufacturing",
//       subcategories: [
//         "Textile Machinery",
//         "Chemical Processing",
//         "Metal Working",
//         "General Industrial",
//       ],
//     },
//   ];

//   const banners = [
//     {
//       id: 0,
//       title: "All types of Plats & Machines",
//       image: banner1,
//       bgColor: "bg-orange-100",
//     },
//     {
//       id: 1,
//       title: "New all types of manufacture machines",
//       image:
//         "https://cdn.vectorstock.com/i/500p/65/41/dark-blue-geometric-banner-vector-54386541.jpg",
//       bgColor: "bg-purple-100",
//     },
//     {
//       id: 2,
//       title: "All types of processing machines",
//       image:
//         "https://www.shutterstock.com/image-vector/ecommerce-website-banner-template-presents-260nw-2252124451.jpg",
//       bgColor: "bg-teal-100",
//     },
//     {
//       id: 3,
//       title: "All types of packing machines",
//       image:
//         "https://t4.ftcdn.net/jpg/05/06/47/83/360_F_506478399_l0jgZ5ZWj80o8XYdEJtYfQhVYMU56qDJ.jpg",
//       bgColor: "bg-red-100",
//     },
//   ];

//   const bannerNames = banners.map((banner) => banner.title);
//   const [activeMobileIndex, setActiveMobileIndex] = useState(null);
//   const intervalRef = useRef(null);

//   const startAutoRotate = () => {
//     clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(() => {
//       setActiveBanner((prev) => (prev + 1) % banners.length);
//     }, 5000);
//   };

//   useEffect(() => {
//     startAutoRotate();
//     return () => clearInterval(intervalRef.current);
//   }, []);

//   const handleHover = (index) => {
//     setActiveBanner(index);
//     startAutoRotate();
//   };

//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % banners.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <header className="relative">
//       <div className="px-4 xl:px-6 py-4">
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* Sidebar with categories */}
//           <div className="w-full lg:w-[280px] min-w-[280px] relative">
//             {/* Desktop View */}
//             <div
//               className="hidden md:block bg-white shadow-md text-[#424D58] rounded-lg h-full"
//               onMouseLeave={() => setHoveredCategory(null)}
//             >
//               <ul className="py-6 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-md">
//                 {categories.map((category, index) => (
//                   <li
//                     key={index}
//                     className="flex items-center gap-2 cursor-pointer text-sm font-semibold bg-white hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-2 tracking-wide transition-colors relative"
//                     onMouseEnter={() => setHoveredCategory(index)}
//                     onMouseLeave={() => setHoveredCategory(null)}
//                   >
//                     <img
//                       className="h-6 w-6 object-cover rounded-md"
//                       src={category.catImg}
//                       alt="catImg"
//                     />
//                     <span>{category.name}</span>

//                     {hoveredCategory === index && (
//                       <div className="absolute left-full top-0 ml-1 z-10 w-60 bg-white shadow-lg rounded-md py-2">
//                         <ul className="space-y-2">
//                           {category.subcategories.map(
//                             (subcategory, subIndex) => (
//                               <li
//                                 key={subIndex}
//                                 className="px-4 py-1 text-sm hover:bg-[#FFF8F8] text-[#424D58] hover:text-[#FF8717]"
//                               >
//                                 {subcategory}
//                               </li>
//                             )
//                           )}
//                         </ul>
//                       </div>
//                     )}
//                   </li>
//                 ))}
//                 <li
//                   onClick={() => navigate("/categories")}
//                   className="flex items-center gap-2 cursor-pointer bg-white text-sm font-semibold hover:text-[#FF8717] hover:bg-[#FFF8F8] px-4 py-2 tracking-wide transition-colors relative"
//                 >
//                   <img
//                     className="h-6 w-6 object-cover rounded-md"
//                     src="https://cdn-icons-png.flaticon.com/512/8058/8058572.png"
//                     alt="all-cat-img"
//                   />
//                   <span>Explore All Categories</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Mobile / Tablet View */}
//             <div className="md:hidden bg-white shadow-md text-[#424D58] rounded-lg">
//               <ul className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] rounded-md">
//                 {categories.map((category, index) => (
//                   <li key={index} className="border-b border-white">
//                     <button
//                       className="w-full text-left text-sm font-semibold text-white px-4 py-3 flex justify-between items-center"
//                       onClick={() =>
//                         setActiveMobileIndex(
//                           index === activeMobileIndex ? null : index
//                         )
//                       }
//                     >
//                       {category.name}
//                       <span>{activeMobileIndex === index ? "−" : "+"}</span>
//                     </button>
//                     {activeMobileIndex === index && (
//                       <ul className="bg-white space-y-1 py-2">
//                         {category.subcategories.map((subcategory, subIndex) => (
//                           <li
//                             key={subIndex}
//                             className="px-6 py-1 text-sm text-[#424D58] hover:text-[#FF8717] hover:bg-[#FFF8F8]"
//                           >
//                             {subcategory}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </li>
//                 ))}
//                 <li
//                   onClick={() => navigate("/categories")}
//                   className="cursor-pointer text-sm font-semibold text-white px-4 py-3 hover:text-[#FF8717]"
//                 >
//                   Explore All Categories
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Main Banner */}
//           <div className="flex-1 hidden md:flex flex-col justify-between h-full rounded-md">
//             <div
//               className={`${banners[activeBanner].bgColor} overflow-hidden h-64 shadow-md md:h-80 rounded-t-md`}
//             >
//               <img
//                 key={banners[activeBanner].id}
//                 src={banners[activeBanner].image}
//                 alt={banners[activeBanner].title}
//                 className="w-full h-full object-cover rounded-t-md opacity-0 animate-fadeSlide"
//               />
//             </div>

//             {/* Banner Controls */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 rounded-b-md overflow-hidden shadow-md">
//               {bannerNames.map((name, index) => (
//                 <div
//                   key={index}
//                   onMouseEnter={() => handleHover(index)}
//                   className={`py-3 px-6 sm:px-12 text-sm sm:text-md text-center cursor-pointer transition tracking-wide border-gray-400 ${
//                     index !== 0 ? "border-l" : ""
//                   } ${
//                     activeBanner === index
//                       ? "bg-[#FFF8F8] text-[#FF8717]"
//                       : "bg-[#FFF8F8] text-[#424D58]"
//                   }`}
//                 >
//                   {name}
//                 </div>
//               ))}
//             </div>

//             {/* Small Banners */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//               {[smallBanner1, smallBanner2, smallBanner3].map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt={`img ${idx + 1}`}
//                   className="w-full h-32 object-cover rounded-md shadow-md"
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Mobile Banner View */}
//           <div className="block md:hidden w-full">
//             <div className="relative overflow-hidden rounded-md transition-all duration-500">
//               <img
//                 key={banners[current].id}
//                 src={banners[current].image}
//                 alt={banners[current].title}
//                 className="w-full h-28 object-contain rounded-md opacity-0 animate-fadeSlide"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default HeaderSection;
