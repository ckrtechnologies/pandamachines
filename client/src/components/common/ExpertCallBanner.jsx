import React from "react";
import bgImg from "../../Assets/Images/subpageheaderImg.png";

const ExpertCallBanner = () => {
  return (
    <div
      className="relative bg-cover bg-center min-h-[200px] md:min-h-[300px] flex items-center text-white"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      <div className="relative px-4 xl:px-6">
        <p className="italic text-sm md:text-lg mb-4 tracking-wider text-[#D8D8D8]">
          Talk to our expert on video call about your project.
        </p>
        <h2 className="text-2xl md:text-3xl font-medium text-white">
          Our expert will{" "}
          <span className="text-orange-500 font-bold">guide &amp; explain</span>{" "}
          you in
          <br /> choosing the right machinery for your project.
        </h2>
      </div>
    </div>
  );
};

export default ExpertCallBanner;
