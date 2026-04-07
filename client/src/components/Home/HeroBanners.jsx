import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../../components/Home/Herobanners.css";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 ${className}`} />
);

const HeroBanners = () => {
  const [mainBanners, setMainBanners] = useState([]);
  const [smallBanners, setSmallBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  // Touch refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/banners/all-banners`
      );

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

  // Touch Handlers (Swipe)
  const handleTouchStart = (e) => {
    clearInterval(intervalRef.current);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) < 50) {
      startAutoRotate();
      return;
    }

    if (diff > 0) {
      // swipe left → next
      setCurrent((prev) => (prev + 1) % mainBanners.length);
    } else {
      // swipe right → prev
      setCurrent((prev) => (prev === 0 ? mainBanners.length - 1 : prev - 1));
    }

    startAutoRotate();
  };

  if (loading) {
    return (
      <div className="flex-1 hidden md:flex flex-col justify-between h-full rounded-md">
        <SkeletonBox className="h-64 md:h-80 w-full rounded-t-md mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {[...Array(4)].map((_, idx) => (
            <SkeletonBox key={idx} className="h-10 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
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
      <div className="flex-1 hidden lg:flex flex-col justify-between h-full rounded-md">
        <div className="overflow-hidden h-64 md:h-80 rounded-t-md shadow-md">
          <img
            key={mainBanners[activeBanner]?._id}
            src={mainBanners[activeBanner]?.imgUrl}
            alt={mainBanners[activeBanner]?.name}
            className="w-full h-full object-cover rounded-t-md opacity-0 animate-fadeSlide"
          />
        </div>

        {/* Banner Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-6 rounded-b-md overflow-hidden shadow-md">
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
                className={`py-4 px-8 sm:px-6 text-sm sm:text-[15px] text-center cursor-pointer transition tracking-wide border-gray-400 font-medium ${index !== 0 ? "border-l" : ""
                  } ${activeBanner === index
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          {smallBanners.map((img) => (
            <div key={img._id} className="overflow-hidden rounded-md">
              <img
                src={img.imgUrl}
                alt={img.name}
                className="w-full h-32 object-cover rounded-md shadow-md animate-auto-zoom"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden w-full">
        <div
          className="relative overflow-hidden rounded-md"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {mainBanners.map((banner) => (
              <img
                key={banner._id}
                src={banner.imgUrl}
                alt={banner.name}
                className="w-full h-32 sm:h-40 md:h-44 flex-shrink-0 rounded-md"
              />
            ))}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {mainBanners.map((_, index) => (
              <div
                key={index}
                className={`h-[3px] rounded-full transition-all duration-300 ${current === index
                  ? "w-5 bg-white"
                  : "w-2 bg-white/40"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroBanners;