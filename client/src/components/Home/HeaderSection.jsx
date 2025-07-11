import React from "react";
import HeroCategories from "./HeroCategories";
import HeroBanners from "./HeroBanners";

const HeaderSection = () => {
  return (
    <header className="relative bg-gray-50">
      <div className="px-4 xl:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <HeroCategories />
          <HeroBanners />
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;