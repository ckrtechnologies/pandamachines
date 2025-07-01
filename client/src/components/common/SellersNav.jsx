import React from "react";
import { FaSignInAlt } from "react-icons/fa";
import UsersBottomNav from "./UsersBottomNav";
import { useNavigate } from "react-router-dom";
import pmLogo from "../../Assets/img/Logos/newPMLogo.png";

const SellersNav = () => {
  const navigate = useNavigate();

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
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-1 px-4 py-2.5 bg-[#FFF8F8] text-[#00395F] rounded-md hover:bg-blue-100 hover:text-blue-700 transition text-sm">
              Register
            </button>

            <button className="flex items-center gap-1 px-4 py-2.5 bg-[#FF8617] text-white rounded-md hover:bg-[#e14f00] transition text-sm">
              <FaSignInAlt size={16} />
              Sellers Login
            </button>
          </div>
        </div>
      </nav>

      <UsersBottomNav />
    </React.Fragment>
  );
};

export default SellersNav;
