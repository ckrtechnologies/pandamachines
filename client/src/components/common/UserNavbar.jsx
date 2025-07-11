import React, { useState, useEffect } from "react";
import pmLogo from "../../Assets/img/Logos/newPMLogo.png";
import {
  FaFileAlt,
  FaOpencart,
  FaShoppingCart,
  FaSignInAlt,
  FaUserCircle,
} from "react-icons/fa";
import UsersBottomNav from "./UsersBottomNav";
import { useNavigate } from "react-router-dom";
import { BiSearchAlt2 } from "react-icons/bi";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import { FiUser, FiShoppingBag, FiLogOut } from "react-icons/fi";
import { LuHeartCrack } from "react-icons/lu";

const UserNavbar = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const cartCount = 3;

  // Check login status on component mount and when modals change
  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("pm-user-data");
    if (userDataFromStorage) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(userDataFromStorage));
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, [showLoginModal, showRegisterModal]);

  const handleLogout = () => {
    localStorage.removeItem("pm-user-data");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  };

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const openLoginModal = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <React.Fragment>
      {showLoginModal && (
        <UserLoginModal
          onClose={closeAllModals}
          onRegisterClick={openRegisterModal}
        />
      )}

      {showRegisterModal && (
        <UserRegisterModal
          onClose={closeAllModals}
          onLoginClick={openLoginModal}
        />
      )}

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

            <div className="flex-1 max-w-xl w-full relative">
              {/* Search input */}
              <input
                type="text"
                placeholder="Search Your Products..."
                className="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b6292] focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400"
              />

              {/* Right search icon (alternative) */}
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1b6292] transition-colors duration-200 bg-gradient-to-r from-[#f9aa80] via-[#fac9af] to-white hover:from-[#FF8617] hover:via-[#f9c08b] p-2 rounded-l-md" 
              >
                <BiSearchAlt2 size={20} />
              </button>
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

            {isLoggedIn ? (
              <div className="relative group">
                <button className="capitalize flex items-center gap-1 px-4 py-2.5 bg-[#FF8617] text-white rounded-md hover:bg-[#e14f00] transition text-sm">
                  <FaUserCircle size={16} />
                  {userData?.firstName?.split(" ")[0] || "Profile"}
                </button>

                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                  <div
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/my-profile")}
                  >
                    <FiUser size={16} />
                    My Profile
                  </div>

                  <div
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/my-orders")}
                  >
                    <FiShoppingBag size={16} />
                    My Orders
                  </div>

                  <div
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/my-carts")}
                  >
                    <FaOpencart size={16} />
                    Cart
                  </div>

                  <div
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/wishlist")}
                  >
                    <LuHeartCrack size={16} />
                    Wishlist
                  </div>

                  <div
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={16} />
                    Logout
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-1 px-4 py-2.5 bg-[#FF8617] text-white rounded-md hover:bg-[#e14f00] transition text-sm"
              >
                <FaSignInAlt size={16} />
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <UsersBottomNav />
    </React.Fragment>
  );
};

export default UserNavbar;
