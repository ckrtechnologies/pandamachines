import React from "react";
import pmLogo from "../../Assets/Logos/PMHorrLogo.png";
import { FaFileAlt, FaShoppingCart, FaSignInAlt } from "react-icons/fa";
import UsersBottomNav from "./UsersBottomNav";

const UserNavbar = () => {
  return (
    <React.Fragment>
      <nav className="w-full bg-[#00395F] shadow-md px-4 xl:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center w-full sm:w-auto gap-4 flex-1">
            <div>
              <img
                className="h-12 sm:h-14 w-auto object-contain pt-1.5"
                src={pmLogo}
                alt="pm-Logo"
              />
            </div>

            <div className="flex-1 max-w-md w-full py-1.5">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b6292]"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full sm:w-auto py-1.5">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#FFF8F8] text-[#00395F] rounded-md hover:bg-blue-100 hover:text-blue-700 transition text-sm">
              <FaFileAlt size={16} />
              Quotation
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#FFF8F8] text-[#00395F] rounded-md hover:bg-green-100 hover:text-green-700 transition text-sm">
              <FaShoppingCart size={16} />
              My Cart
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#FF8617] text-white rounded-md hover:bg-[#e14f00] transition text-sm">
              <FaSignInAlt size={16} />
              Login
            </button>
          </div>
        </div>
      </nav>

      <UsersBottomNav />
    </React.Fragment>
  );
};

export default UserNavbar;
