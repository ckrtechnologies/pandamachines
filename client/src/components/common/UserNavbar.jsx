import { BiSolidUserCircle } from "react-icons/bi";
import {
  FaAddressCard,
  FaGooglePlay,
  FaRegBell,
  FaUserEdit,
} from "react-icons/fa";
import { FaHeartCrack } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { GiNotebook } from "react-icons/gi";
import { RiLuggageCartFill, RiMapPinUserFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

import pmLogo from "../../Assets/img/Logos/logoImg.svg";

import { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { FaFileDownload } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { IoLogIn } from "react-icons/io5";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Quotation from "../../screens/users/Quotation";
import LocationBar from "../Location/LocationBar";
import LocationChip from "../Location/LocationChip";
import ComingSoonModal from "../Modals/ComingSoonModal";
import NavSearchBar from "../UserSideNavbar/NavSearchBar";
import UserSidebar from "../UserSideNavbar/UserSidebar";

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoggedIn, logout } = useAuth();
  const { openAuthModal } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuotationModalUpon, setIsQuotationModalUpon] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const { cartCount } = useCart();

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

  const isHomePage = location?.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <>
      <nav className="sticky top-0 w-full bg-[#FFFFFF] sm:shadow-md px-3 sm:px-4 lg:px-6 z-50">

        <div className="flex items-center justify-between py-2 gap-2 sm:gap-3">

          {/* =========================
              LOGO SECTION
          ========================== */}
          <div className="flex items-center gap-2 flex-shrink-0">

            <button
              onClick={toggleSidebar}
              className="text-2xl text-gray-700"
            >
              <CgMenuLeft />
            </button>

            <img
              onClick={() => navigate("/")}
              className="h-10 sm:h-12 lg:h-[4rem] w-auto object-contain cursor-pointer"
              src={pmLogo}
              alt="pm-Logo"
            />

          </div>

          {/* =========================
              SEARCH BAR — DESKTOP
          ========================== */}
          <div className="hidden md:flex flex-1 items-center min-w-0 gap-2 px-2 lg:px-0">

            <div className="flex-1 min-w-0 overflow-hidden">
              <NavSearchBar />
            </div>

            <LocationChip />

          </div>

          {/* =========================
              RIGHT SIDE
          ========================== */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

            {/* =========================
                DESKTOP / TABLET
            ========================== */}
            <div className="hidden md:flex flex-shrink-0 items-center gap-1 lg:gap-3">

              {/* LOGIN / PROFILE */}
              {isLoggedIn ? (
                <div className="relative group">

                  <button
                    className="
                      flex items-center gap-1 lg:gap-2
                      text-[#00395F]
                      hover:text-[#FF8617]
                      hover:bg-[#f7f7f5]
                      px-2 py-2 lg:py-3
                      rounded-md
                      transition
                      text-sm lg:text-[15px]
                      whitespace-nowrap
                    "
                  >
                    <BiSolidUserCircle size={20} />

                    <span className="hidden lg:inline">
                      {user?.firstName?.split(" ")[0] || "Profile"}
                    </span>
                  </button>

                  <div
                    className="
                      absolute right-0 mt-2
                      w-48 bg-white
                      rounded-md shadow-lg
                      py-1 z-50
                      invisible
                      group-hover:visible
                      opacity-0
                      group-hover:opacity-100
                      transition-all duration-200
                    "
                  >

                    <MenuItem
                      icon={<FaUserEdit />}
                      label="My Profile"
                      to="/user-profile-details"
                    />

                    <MenuItem
                      icon={<GiNotebook />}
                      label="My Orders"
                      to="/orders"
                    />

                    <MenuItem
                      icon={<FaAddressCard />}
                      label="Saved Addresses"
                      to="/saved-addresses"
                    />

                    <MenuItem
                      icon={<FaTruckFast />}
                      label="Track Order"
                      to="/orders"
                    />

                    <MenuItem
                      icon={<FaHeartCrack />}
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
                  onClick={() => openAuthModal("login")}
                  className="
                    flex items-center gap-1
                    text-[#00395F]
                    hover:text-[#FF8617]
                    transition
                    text-sm lg:text-[15px]
                    whitespace-nowrap
                  "
                >
                  <IoLogIn size={20} />
                  <span>Login</span>
                </button>
              )}

              {/* CART */}
              {isLoggedIn && (
                <CartButton
                  cartCount={cartCount}
                  onClick={() => navigate("/cart")}
                />
              )}

              {/* =========================
                  BECOME SELLER
              ========================== */}
              <button
                onClick={() => navigate("/become-seller")}
                className="
                  flex items-center gap-1
                  text-[#00395F]
                  hover:text-[#FF8617]
                  hover:bg-[#f7f7f5]
                  px-2 py-2
                  lg:px-3 lg:py-3
                  rounded-md
                  text-sm lg:text-[15px]
                  whitespace-nowrap
                "
                title="Become a Seller"
              >
                <RiMapPinUserFill size={20} />

                <span className="hidden lg:inline">
                  Become a Seller
                </span>
              </button>

              {/* =========================
                  GET QUOTATION
              ========================== */}
              <button
                onClick={() => setIsQuotationModalUpon(true)}
                className="
                  flex items-center gap-1
                  bg-[#FF8617]
                  text-white
                  hover:bg-[#e87508]
                  px-2.5 py-2
                  lg:px-3 lg:py-2.5
                  rounded-md
                  text-xs lg:text-sm
                  font-medium
                  whitespace-nowrap
                  transition
                "
                title="Get Quotation"
              >
                <FaFileDownload size={17} />

                <span>
                  Get Quotation
                </span>
              </button>

              {/* =========================
                  DOWNLOAD APP
                  MOVED TO RIGHT OF SELLER
                  ========================= */}
              <PlayStoreButton
                onClick={() => setShowComingSoon(true)}
              />

            </div>

            {/* =========================
                MOBILE RIGHT ACTIONS
            ========================== */}
            <div className="flex items-center gap-2 md:hidden">

              {/* =========================
                  GET QUOTATION
              ========================== */}
              <button
                onClick={() => setIsQuotationModalUpon(true)}
                className="
                  flex items-center gap-1
                  bg-[#FF8617]
                  text-white
                  hover:bg-[#e87508]
                  px-2 py-1.5
                  rounded-md
                  text-[10px]
                  sm:text-xs
                  font-medium
                  whitespace-nowrap
                  transition
                "
                title="Get Quotation"
              >
                <FaFileDownload size={14} />

                <span>
                  Get Quotation
                </span>
              </button>

              {/* =========================
                  DOWNLOAD APP - MOBILE
              ========================== */}
              <PlayStoreButton
                onClick={() => setShowComingSoon(true)}
              />

              {/* =========================
                  LOGIN / PROFILE
              ========================== */}
              {isLoggedIn ? (
                <button
                  onClick={() => navigate("/user-profile")}
                  className="
                    w-8 h-8
                    rounded-full
                    bg-[#00395F]
                    text-white
                    flex items-center justify-center
                    text-sm
                    font-semibold
                    uppercase
                    active:scale-95
                    transition-all
                    duration-200
                    flex-shrink-0
                  "
                >
                  {user?.firstName?.charAt(0) || "U"}
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal("login")}
                  className="
                    px-3
                    py-1.5
                    bg-[#E8DDD7]
                    hover:bg-[#e2d5cf]
                    text-red-600
                    text-xs
                    font-semibold
                    rounded-md
                    tracking-wide
                    active:scale-95
                    transition-all
                    duration-200
                  "
                >
                  LOGIN
                </button>
              )}

              {/* =========================
                  NOTIFICATION
              ========================== */}
              <button
                className="text-xl text-gray-700"
                aria-label="Notifications"
              >
                <FaRegBell />
              </button>

            </div>

          </div>
        </div>
      </nav>

      {/* =========================
          MOBILE SEARCH BAR
      ========================== */}
      {isHomePage && (
        <div className="md:hidden sticky top-[56px] z-40 bg-white shadow-sm">

          <LocationBar />

          <div className="px-4 py-2">
            <NavSearchBar />
          </div>

        </div>
      )}

      {/* =========================
          QUOTATION MODAL
      ========================== */}
      {isQuotationModalUpon && (
        <Quotation
          onClose={() => setIsQuotationModalUpon(false)}
        />
      )}

      {/* =========================
          COMING SOON MODAL
      ========================== */}
      {showComingSoon && (
        <ComingSoonModal
          isOpen={showComingSoon}
          onClose={() => setShowComingSoon(false)}
        />
      )}

      {/* =========================
          USER SIDEBAR
      ========================== */}
      <UserSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
      />
    </>
  );
};

/* =====================================================
   MENU ITEM
===================================================== */

const MenuItem = ({
  icon,
  label,
  to,
  onClick,
  badge,
  red,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={onClick || (() => navigate(to))}
      className={`
        flex items-center gap-2
        px-4 py-2
        text-sm
        cursor-pointer
        hover:bg-gray-100
        ${
          red
            ? "text-red-600 hover:bg-red-100"
            : "text-gray-700"
        }
      `}
    >
      {icon}

      {label}

      {badge > 0 && (
        <span
          className="
            ml-auto
            bg-red-600
            text-white
            text-xs
            font-bold
            px-2
            py-0.5
            rounded-full
          "
        >
          {badge}
        </span>
      )}
    </div>
  );
};

/* =====================================================
   CART BUTTON
===================================================== */

const CartButton = ({
  cartCount,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="
      relative
      flex items-center gap-1
      text-[#00395F]
      hover:text-[#FF8617]
      hover:bg-[#f7f7f5]
      px-2
      py-2
      lg:py-3
      rounded-md
      transition
      text-sm
      lg:text-[15px]
      whitespace-nowrap
    "
  >
    <RiLuggageCartFill size={20} />

    <span>Cart</span>

    {cartCount > 0 && (
      <span
        className="
          absolute
          -top-1
          -right-2
          bg-red-600
          text-white
          text-xs
          font-bold
          px-1.5
          py-0.5
          rounded-full
        "
      >
        {cartCount}
      </span>
    )}
  </button>
);

/* =====================================================
   DOWNLOAD APP BUTTON
===================================================== */

const PlayStoreButton = ({
  onClick,
}) => (
  <button
    onClick={onClick}
    className="
      flex items-center justify-center
      gap-1
      sm:gap-1.5
      bg-primaryTextColor
      text-white
      px-2
      py-1.5
      sm:px-3
      sm:py-2
      rounded-md
      text-[10px]
      sm:text-xs
      font-medium
      whitespace-nowrap
      active:scale-95
      transition
    "
    title="Download App"
  >
    <FaGooglePlay
      size={14}
      className="sm:hidden"
    />

    <FaGooglePlay
      size={16}
      className="hidden sm:block"
    />

    <span>
      Download App
    </span>
  </button>
);

export default UserNavbar;