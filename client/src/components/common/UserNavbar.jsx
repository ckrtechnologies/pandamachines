import React from "react";
import pmLogo from "../../Assets/Logos/newPMLogo.png";
import { FaFileAlt, FaShoppingCart, FaSignInAlt } from "react-icons/fa";
import UsersBottomNav from "./UsersBottomNav";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

const UserNavbar = () => {
  const navigate = useNavigate();
  const cartCount = 3;

  return (
    <React.Fragment>
      <nav className="w-full bg-[#00395F] shadow-md px-4 xl:px-6">
        <div className="py-1.5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center w-full sm:w-auto gap-4 flex-1 ">
            <div className="lg:w-[280px]">
              <img
                onClick={() => navigate("/")}
                className="h-12 sm:h-14 w-auto object-contain cursor-pointer"
                src={pmLogo}
                alt="pm-Logo"
              />
            </div>

            <div className="flex-1 max-w-lg w-full relative">
              <BiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Your Products..."
                className="w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b6292]"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-1 px-4 py-2.5 bg-[#FFF8F8] text-[#00395F] rounded-md hover:bg-blue-100 hover:text-blue-700 transition text-sm">
              <FaFileAlt size={16} />
              Quotation
            </button>

            <button
              onClick={() => navigate("/my-carts")}
              className="relative flex items-center gap-1 px-4 py-2.5 bg-[#FFF8F8] text-[#00395F] rounded-md hover:bg-green-100 hover:text-green-700 transition text-sm"
            >
              <FaShoppingCart size={16} />
              <span>Cart</span>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="flex items-center gap-1 px-4 py-2.5 bg-[#FF8617] text-white rounded-md hover:bg-[#e14f00] transition text-sm">
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
