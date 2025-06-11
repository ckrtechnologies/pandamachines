import React from "react";
import socialIcon1 from "../../Assets/Images/footer/Link.png";
import socialIcon2 from "../../Assets/Images/footer/Link-1.png";
import socialIcon3 from "../../Assets/Images/footer/Link-2.png";
import socialIcon4 from "../../Assets/Images/footer/Link-3.png";
import socialIcon5 from "../../Assets/Images/footer/Link-4.png";

const SellersFooter = () => {
  return (
    <div className="tracking-wider text-white text-center bg-gradient-to-r from-[#352D41] via-[#203A50] to-[#0D0D18] px-4 xl:px-6 py-10">
      <div>
        <span
          className="text-4xl md:text-7xl mr-6"
          style={{ fontFamily: "cursive" }}
        >
          Let’s Sell
        </span>
        <span className="text-4xl md:text-7xl font-extrabold">Together</span>
      </div>

      <button className="mt-6 font-bold text-lg rounded-lg px-4 py-3 bg-[#F8B003] hover:bg-[#FFBCA0] transition duration-200">
        Get In Touch
      </button>

      <div className="flex gap-2 justify-center items-center mt-6">
        <img
          className="h-14 md:h-20 w-auto cursor-pointer hover:scale-110 transition duration-200"
          src={socialIcon1}
          alt="socialIcon"
        />
        <img
          className="h-14 md:h-20 w-auto cursor-pointer hover:scale-110 transition duration-200"
          src={socialIcon2}
          alt="socialIcon"
        />
        <img
          className="h-14 md:h-20 w-auto cursor-pointer hover:scale-110 transition duration-200"
          src={socialIcon3}
          alt="socialIcon"
        />
        <img
          className="h-14 md:h-20 w-auto cursor-pointer hover:scale-110 transition duration-200"
          src={socialIcon4}
          alt="socialIcon"
        />
        <img
          className="h-14 md:h-20 w-auto cursor-pointer hover:scale-110 transition duration-200"
          src={socialIcon5}
          alt="socialIcon"
        />
      </div>
    </div>
  );
};

export default SellersFooter;
