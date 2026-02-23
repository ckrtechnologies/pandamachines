import React from "react";
import { useNavigate } from "react-router-dom";
import { HiPhone, HiSparkles } from "react-icons/hi";
import expertimg from "../../Assets/expert/businessman.png";

const TalkToExpert = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/consult-guidance");
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-6 py-4 
                   bg-gradient-to-r from-primaryBtnColor to-primaryBtnHoverColor
                   rounded-full shadow-2xl hover:shadow-3xl
                   hover:scale-105 transition-all duration-300 ease-in-out 
                   focus:outline-none text-white font-semibold text-sm"
        title="Talk to our expert"
      >
        {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-pulse"></div> */}

        {/* <img
          src={expertimg}
          alt="Expert"
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
        /> */}

        <div className="relative flex items-center gap-2">
          <HiPhone
            size={28}
            className="group-hover:rotate-12 transition-transform duration-300"
          />
          <HiSparkles
            size={18}
            className="absolute -top-1 -right-1 text-yellow-300 animate-bounce"
          />
        </div>

        <span className="relative whitespace-nowrap">Talk to Expert</span>
      </button>
    </>
  );
};

export default TalkToExpert;
