import React from "react";
import pmLogo from "../../Assets/Logos/PMLogo.png";
import { FaSignInAlt } from "react-icons/fa";

const SellersNav = () => {
  return (
    <React.Fragment>
      <nav className="w-full bg-[#00395F] shadow-md px-4 xl:px-10 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Logo + Search */}
          <div className="flex items-center w-full sm:w-auto gap-4 flex-1">
            {/* Logo */}
            <div>
              <img
                className="h-12 sm:h-16 w-auto object-contain"
                src={pmLogo}
                alt="pm-Logo"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#FFF8F8] text-[#00395F] rounded-md hover:bg-green-100 hover:text-green-700 transition text-sm">
              Register
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#FF8617] text-white rounded-md hover:bg-[#e14f00] transition text-sm">
              <FaSignInAlt size={16} />
              Login
            </button>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default SellersNav;
