import React, { useState, useEffect } from "react";
import pmLogo from "../../Assets/img/Logos/newPMLogo.png";
import { RiLuggageCartFill } from "react-icons/ri";
import { RiMapPinUserFill } from "react-icons/ri";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { BiSearchAlt2, BiSolidUserCircle } from "react-icons/bi";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import {
  FiUser,
  FiShoppingBag,
  FiLogOut
} from "react-icons/fi";
import { LuHeartCrack } from "react-icons/lu";
import { useCart } from "../../utils/CartContext";
import { LiaAddressCardSolid, LiaTimesCircleSolid } from "react-icons/lia";
import { TbTruckDelivery, TbUserPentagon } from "react-icons/tb";
import { CgMenuRight } from "react-icons/cg";
import { FaTruckFast } from "react-icons/fa6";
import { IoLogIn } from "react-icons/io5";
import { PiPoliceCarThin } from "react-icons/pi";
import NavSearchBar from "../UserSideNavbar/NavSearchBar";
import UserSidebar from "../UserSideNavbar/UserSidebar";
// import AnimatedLogo from "./AnimatedLogo";

const UserNavbar = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cartCount, fetchCartCount, resetCartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("pm-user-data");
    if (userDataFromStorage) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(userDataFromStorage));
      fetchCartCount();
    } else {
      setIsLoggedIn(false);
      setUserData(null);
      resetCartCount();
    }
  }, [showLoginModal, showRegisterModal, fetchCartCount, resetCartCount]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("pm-user-data");
    setIsLoggedIn(false);
    setUserData(null);
    resetCartCount();
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

  const handleLoginSuccess = () => {
    fetchCartCount();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(
        `/products-search-results/${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {showLoginModal && (
        <UserLoginModal
          onClose={closeAllModals}
          onRegisterClick={openRegisterModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showRegisterModal && (
        <UserRegisterModal
          onClose={closeAllModals}
          onLoginClick={openLoginModal}
        />
      )}

      <nav className="w-full bg-[#FFFFFF] shadow-md px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center w-full justify-between sm:w-auto">
            {/* <AnimatedLogo /> */}
            <img
              onClick={() => navigate("/")}
              className="h-12 sm:h-16 w-auto object-contain cursor-pointer"
              src={pmLogo}
              alt="pm-Logo"
            />

            <button
              className="sm:hidden text-[#00395F]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <LiaTimesCircleSolid size={22} />
              ) : (
                <CiMenuKebab size={22} />
              )}
            </button>
          </div>

          <NavSearchBar />

          <div className="hidden sm:flex items-center gap-6">
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-[#00395F] hover:text-[#FF8617] transition">
                  <BiSolidUserCircle size={22} />
                  {userData?.firstName?.split(" ")[0] || "Profile"}
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <MenuItem
                    icon={<FiUser />}
                    label="My Profile"
                    to="/user-profile"
                  />
                  <MenuItem
                    icon={<FiShoppingBag />}
                    label="My Orders"
                    to="/user-orders"
                  />
                  <MenuItem
                    icon={<LiaAddressCardSolid />}
                    label="Saved Addresses"
                    to="/saved-addresses"
                  />
                  <MenuItem
                    icon={<PiPoliceCarThin />}
                    label="Bulk Orders"
                    // to="/bulk-orders"
                  />
                  <MenuItem
                    icon={<LuHeartCrack />}
                    label="Wishlist"
                    to="/wishlist"
                  />
                  <MenuItem
                    icon={<FiLogOut />}
                    label="Logout"
                    onClick={handleLogout}
                    red
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] transition text-[15px]"
              >
                <IoLogIn size={22} />
                Login
              </button>
            )}

            <CartButton
              cartCount={cartCount}
              onClick={() => navigate("/my-carts")}
            />
            <NavButton label="Track Order" icon={<FaTruckFast size={22} />} />
            <NavButton
              label="Become a Suplier"
              icon={<RiMapPinUserFill size={22} />}
              onClick={() => navigate("/become-seller")}
            />
          </div>

          <button onClick={toggleSidebar} className="text-2xl text-gray-700">
            <CgMenuRight />
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden flex flex-col gap-4 mt-2 pb-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Products by names or brands..."
                className="flex-1 pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
              />
              <button onClick={handleSearch} className="text-gray-600">
                <BiSearchAlt2 size={22} />
              </button>
            </div>

            {isLoggedIn ? (
              <>
                <MenuItem
                  icon={<FiUser />}
                  label="My Profile"
                  to="/my-profile"
                />
                <MenuItem
                  icon={<FiShoppingBag />}
                  label="My Orders"
                  to="/user-orders"
                />
                <MenuItem
                  icon={<LiaAddressCardSolid />}
                  label="Saved Addresses"
                  to="/saved-addresses"
                />

                <MenuItem
                  icon={<PiPoliceCarThin />}
                  label="Bulk Orders"
                  // to="/bulk-orders"
                />
                <MenuItem
                  icon={<LuHeartCrack />}
                  label="Wishlist"
                  to="/wishlist"
                />
                <MenuItem
                  icon={<FiLogOut />}
                  label="Logout"
                  onClick={handleLogout}
                  red
                />
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 text-[#00395F]"
              >
                <IoLogIn size={22} />
                Login
              </button>
            )}

            <CartButton
              cartCount={cartCount}
              onClick={() => navigate("/my-carts")}
            />
            <NavButton
              label="Track Order"
              icon={<TbTruckDelivery size={22} />}
            />
            <NavButton
              label="Become Seller"
              icon={<TbUserPentagon size={22} />}
              onClick={() => navigate("/become-seller")}
            />
          </div>
        )}
      </nav>

      <UserSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
      />
    </>
  );
};

const MenuItem = ({ icon, label, to, onClick, badge, red }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={onClick || (() => navigate(to))}
      className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
        red ? "text-red-600 hover:bg-red-100" : "text-gray-700"
      }`}
    >
      {icon}
      {label}
      {badge > 0 && (
        <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
};

const CartButton = ({ cartCount, onClick }) => (
  <button
    onClick={onClick}
    className="relative flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] transition text-[15px]"
  >
    <RiLuggageCartFill size={22} />
    <span>Cart</span>
    {cartCount > 0 && (
      <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
        {cartCount}
      </span>
    )}
  </button>
);

const NavButton = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 py-3 text-[#00395F] hover:text-[#FF8617] text-[15px]"
  >
    {icon}
    {label}
  </button>
);

export default UserNavbar;