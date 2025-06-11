import React from "react";
import pmLogo from "../../Assets/Logos/PMHorrLogo.png";
import { FaSignInAlt } from "react-icons/fa";
import UsersBottomNav from "./UsersBottomNav";
import { useNavigate } from "react-router-dom";

const SellersNav = () => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <nav className="w-full bg-[#00395F] shadow-md px-4 xl:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center w-full sm:w-auto gap-4 flex-1">
            <div>
              <img
                onClick={() => navigate("/")}
                className="h-12 sm:h-14 w-auto object-contain pt-1.5 cursor-pointer"
                src={pmLogo}
                alt="pm-Logo"
              />
            </div>
          </div>

          <div className="block md:flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FFF8F8] text-[#00395F] rounded-md hover:bg-green-100 hover:text-green-700 transition text-sm w-full xs:w-auto">
              Register
            </button>

            <button className="mt-2 md:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-[#FF8617] text-white rounded-md hover:bg-[#e14f00] transition text-sm w-full xs:w-auto">
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

export default SellersNav;
