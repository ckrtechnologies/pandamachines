// components/BannerSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import smallBanner1 from "../../Assets/Images/Home/smallBanner1.png";
import smallBanner2 from "../../Assets/Images/Home/smallBanner2.png";
import smallBanner3 from "../../Assets/Images/Home/smallBanner3.png";

const banners = [
  {
    id: 0,
    title: "All types of Plants & Machines",
    image: require("../../Assets/Images/Home/Background.png"),
    bgColor: "bg-orange-100",
  },
  {
    id: 1,
    title: "Latest Manufacturing Machines",
    image:
      "https://static.vecteezy.com/system/resources/previews/004/707/493/non_2x/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    bgColor: "bg-purple-100",
  },
  {
    id: 2,
    title: "All kinds of Processing Machines",
    image:
      "https://static.vecteezy.com/system/resources/previews/006/828/785/non_2x/paper-art-shopping-online-on-smartphone-and-new-buy-sale-promotion-pink-backgroud-for-banner-market-ecommerce-women-concept-free-vector.jpg",
    bgColor: "bg-teal-100",
  },
  {
    id: 3,
    title: "Full range of Packaging Machines",
    image:
      "https://cdn.vectorstock.com/i/500p/57/56/shopping-cart-banner-online-store-vector-42935756.jpg",
    bgColor: "bg-red-100",
  },
];

const HeroBanners = () => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const bannerNames = banners.map((b) => b.title);

  const startAutoRotate = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
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
      setActiveBanner(index);
      startAutoRotate();
    }
  };

  return (
    <>
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
    </>
  );
};

export default HeroBanners;
