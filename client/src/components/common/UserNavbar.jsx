import { useEffect, useState } from "react";
import { BiSolidUserCircle } from "react-icons/bi";
import { FaAddressCard, FaGooglePlay, FaRegBell, FaUserEdit } from "react-icons/fa";
import { FaHeartCrack } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { GiNotebook } from "react-icons/gi";
import { RiLuggageCartFill, RiMapPinUserFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import pmLogo from "../../Assets/img/Logos/logoImg.svg";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";

import { CgMenuLeft } from "react-icons/cg";
import { FaFileDownload } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { IoLogIn } from "react-icons/io5";
import Quotation from "../../screens/users/Quotation";
import { useCart } from "../../utils/CartContext";
import NavSearchBar from "../UserSideNavbar/NavSearchBar";
import UserSidebar from "../UserSideNavbar/UserSidebar";
import LocationBar from "../Location/LocationBar";
import LocationChip from "../Location/LocationChip";
import ComingSoonModal from "../Modals/ComingSoonModal";

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cartCount, fetchCartCount, resetCartCount } = useCart();
  const [isQuotationModalUpon, setIsQuotationModalUpon] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

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

  const isHomePage = location?.pathname === "/";

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

      <nav className="sticky top-0 w-full bg-[#FFFFFF] sm:shadow-md px-3 sm:px-4 lg:px-6 z-50">

        <div className="flex items-center justify-between py-2 gap-2 sm:gap-3">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            {/* HAMBURGER — mobile only */}
            <button
              onClick={toggleSidebar}
              className="md:hidden text-2xl text-gray-700"
            >
              <CgMenuLeft />
            </button>

            {/* LOGO */}
            <img
              onClick={() => navigate("/")}
              className="h-10 sm:h-12 lg:h-[4rem] w-auto object-contain cursor-pointer"
              src={pmLogo}
              alt="pm-Logo"
            />
            <div className="ml-2">
              <PlayStoreButton onClick={() => setShowComingSoon(true)} />
            </div>

          </div>

          {/* SEARCH BAR — visible on md+ screens, grows to fill available space */}
          <div className="hidden md:flex flex-1 items-center min-w-0 gap-2 px-2 lg:px-0">

            {/* LOCATION CHIP */}

            {/* SEARCH BAR */}
            <div className="flex-1 min-w-0">
              <NavSearchBar />
            </div>

            <LocationChip />
          </div>

          <div className="flex items-center gap-4">
            {/* DESKTOP / TABLET RIGHT ACTIONS */}
            <div className="hidden md:flex flex-shrink-0 items-center gap-1 lg:gap-4">
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center gap-1 lg:gap-2 text-[#00395F] hover:text-[#FF8617] hover:bg-[#f7f7f5] px-2 py-2 lg:py-3 rounded-md transition text-sm lg:text-[15px] whitespace-nowrap">
                    <BiSolidUserCircle size={20} />
                    <span className="hidden lg:inline">
                      {userData?.firstName?.split(" ")[0] || "Profile"}
                    </span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <MenuItem
                      icon={<FaUserEdit />}
                      label="My Profile"
                      to="/user-profile-details"
                    />
                    <MenuItem
                      icon={<GiNotebook />}
                      label="My Orders"
                      to="/user-orders"
                    />
                    <MenuItem
                      icon={<FaAddressCard />}
                      label="Saved Addresses"
                      to="/saved-addresses"
                    />
                    <MenuItem
                      icon={<FaTruckFast />}
                      label="Track Order"
                      to="/user-orders"
                    />
                    {/* <MenuItem
                      icon={<PiPoliceCarFill />}
                      label="Bulk Orders"
                      to="/bulk-orders"
                    /> */}
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
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] transition text-sm lg:text-[15px] whitespace-nowrap"
                >
                  <IoLogIn size={20} />
                  <span>Login</span>
                </button>
              )}

              {isLoggedIn && (
                <CartButton
                  cartCount={cartCount}
                  onClick={() => navigate("/my-carts")}
                />
              )}

              {/* "Become a Seller" — icon only on tablet, icon+label on desktop */}
              <button
                onClick={() => navigate("/become-seller")}
                className="flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] hover:bg-[#f7f7f5] px-2 py-2 lg:py-3 rounded-md text-sm lg:text-[15px] whitespace-nowrap"
                title="Become a Seller"
              >
                <RiMapPinUserFill size={20} />
                <span className="hidden lg:inline">Become a Seller</span>
              </button>

              {/* "Download Quotation" — icon only on tablet, icon+label on desktop */}
              <button
                onClick={() => setIsQuotationModalUpon(true)}
                className="flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] hover:bg-[#f7f7f5] px-2 py-2 lg:py-3 rounded-md text-sm lg:text-[15px] whitespace-nowrap"
                title="Download Instant Quotation"
              >
                <FaFileDownload size={18} />
                <span className="hidden lg:inline">Download Instant Quotation</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* MOBILE RIGHT ACTIONS */}

              {
                isLoggedIn ? (
                  <button
                    onClick={() => navigate("/user-profile")}
                    className="md:hidden w-8 h-8 rounded-full 
      bg-[#00395F] text-white 
      flex items-center justify-center 
      text-sm font-semibold 
      uppercase 
      active:scale-95 transition-all duration-200"
                  >
                    {userData?.firstName?.charAt(0) || "U"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="md:hidden px-4 py-1.5 
      bg-[#E8DDD7] hover:bg-[#e2d5cf]
      text-red-600 text-xs font-semibold 
      rounded-md tracking-wide 
      active:scale-95 transition-all duration-200"
                  >
                    LOGIN
                  </button>
                )
              }
              <div className="md:hidden flex items-center gap-3">
                {/* Notification */}
                <button className="text-2xl text-gray-700">
                  <FaRegBell />
                </button>
              </div>
            </div>
          </div>

        </div>
      </nav>

      {/* MOBILE SEARCH BAR — only on small screens */}
      {isHomePage && (
        <div className="md:hidden sticky top-[56px] z-40 bg-white shadow-sm">
          <LocationBar />
          <div className="px-4 py-2">
            <NavSearchBar />
          </div>
        </div>
      )}

      {isQuotationModalUpon && (
        <Quotation onClose={() => setIsQuotationModalUpon(false)} />
      )}
      {showComingSoon && (
        <ComingSoonModal
          isOpen={showComingSoon}
          onClose={() => setShowComingSoon(false)}
        />
      )}
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
      className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${red ? "text-red-600 hover:bg-red-100" : "text-gray-700"
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
    className="relative flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] hover:bg-[#f7f7f5] px-2 py-2 lg:py-3 rounded-md transition text-sm lg:text-[15px] whitespace-nowrap"
  >
    <RiLuggageCartFill size={20} />
    <span>Cart</span>
    {cartCount > 0 && (
      <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
        {cartCount}
      </span>
    )}
  </button>
);


const PlayStoreButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 bg-primaryTextColor text-white px-3 py-2 rounded-md text-xs font-medium active:scale-95 transition"
    >
      <FaGooglePlay size={16} />
      <span className="leading-tight">
        Get App
      </span>
    </button>
  );
};

export default UserNavbar;
