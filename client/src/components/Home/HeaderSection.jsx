import React from "react";
import HeroBanners from "./HeroBanners";
// import HeroCategories from "./HeroCategories";

const HeaderSection = () => {
  return (
    <header className="relative bg-[#f9f7f7]">
      <div className="px-4 xl:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* <HeroCategories /> */}
          <HeroBanners />
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
