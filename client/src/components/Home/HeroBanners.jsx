// components/BannerSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse ${className}`} />
);

const HeroBanners = () => {
  const [mainBanners, setMainBanners] = useState([]);
  const [smallBanners, setSmallBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/banners/all-banners`
      );

      console.log("res.datares.data", res.data);

      const data = res.data;

      const main = data.filter((item) => item.bannerType === "main-banner");
      const small = data.filter((item) => item.bannerType === "small-banner");

      setMainBanners(main);
      setSmallBanners(small);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const startAutoRotate = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % mainBanners.length);
      setCurrent((prev) => (prev + 1) % mainBanners.length);
    }, 5000);
  };

  useEffect(() => {
    if (!loading && mainBanners.length > 0) {
      startAutoRotate();
    }
    return () => clearInterval(intervalRef.current);
  }, [loading, mainBanners]);

  const handleHover = (index) => {
    if (index !== activeBanner) {
      setActiveBanner(index);
      startAutoRotate();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 hidden md:flex flex-col justify-between h-full rounded-md">
        <SkeletonBox className="h-64 md:h-80 w-full rounded-t-md mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[...Array(4)].map((_, idx) => (
            <SkeletonBox key={idx} className="h-10 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {[...Array(3)].map((_, idx) => (
            <SkeletonBox key={idx} className="h-32 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="flex-1 hidden md:flex flex-col justify-between h-full rounded-md">
        <div className={`overflow-hidden h-64 md:h-80 rounded-t-md shadow-md`}>
          <img
            key={mainBanners[activeBanner]?._id}
            src={mainBanners[activeBanner]?.imgUrl}
            alt={mainBanners[activeBanner]?.name}
            className="w-full h-full object-cover rounded-t-md opacity-0 animate-fadeSlide"
          />
        </div>

        {/* Banner Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 rounded-b-md overflow-hidden shadow-md">
          {/* {mainBanners.map((banner, index) => (
            <div
              key={banner._id}
              onMouseEnter={() => handleHover(index)}
              className={`py-3 px-6 sm:px-12 text-sm sm:text-md text-center cursor-pointer transition tracking-wide border-gray-400 font-medium ${
                index !== 0 ? "border-l" : ""
              } ${
                activeBanner === index
                  ? "bg-[#FFF8F8] text-[#FF8717]"
                  : "bg-[#FFF8F8] text-gray-800"
              }`}
            >
              {banner.name}
            </div>
          ))} */}

          {mainBanners.map((banner, index) => {
            const words = banner.name.split(" ");
            const formattedName = [];

            for (let i = 0; i < words.length; i += 4) {
              formattedName.push(words.slice(i, i + 4).join(" "));
            }

            return (
              <div
                key={banner._id}
                onMouseEnter={() => handleHover(index)}
                className={`py-3 px-6 sm:px-12 text-sm sm:text-md text-center cursor-pointer transition tracking-wide border-gray-400 font-medium ${
                  index !== 0 ? "border-l" : ""
                } ${
                  activeBanner === index
                    ? "bg-[#FFF8F8] text-[#FF8717]"
                    : "bg-[#FFF8F8] text-gray-800"
                }`}
              >
                {formattedName.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Small Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {smallBanners.map((img, idx) => (
            <img
              key={img._id}
              src={img.imgUrl}
              alt={img.name}
              className="w-full h-32 object-cover rounded-md shadow-md"
            />
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden w-full">
        <div className="relative overflow-hidden rounded-md transition-all duration-500">
          <img
            key={mainBanners[current]?._id}
            src={mainBanners[current]?.imgUrl}
            alt={mainBanners[current]?.name}
            className="w-full h-28 object-contain rounded-md opacity-0 animate-fadeSlide"
          />
        </div>
      </div>
    </>
  );
};

export default HeroBanners;
