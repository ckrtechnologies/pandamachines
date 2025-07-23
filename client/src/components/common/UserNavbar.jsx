import React, { useState, useEffect } from "react";
import pmLogo from "../../Assets/img/Logos/newPMLogo.png";
import { FaOpencart } from "react-icons/fa";
import { FaFileSignature, FaTools, FaShippingFast, FaTags, FaUserTie } from "react-icons/fa";
import { RiGuideFill } from "react-icons/ri";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { BiLogIn, BiSearchAlt2, BiUserCircle } from "react-icons/bi";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import { FiUser, FiShoppingBag, FiLogOut, FiChevronRight, FiX, FiMenu } from "react-icons/fi";
import { LuHeartCrack } from "react-icons/lu";
import { useCart } from "../../utils/CartContext";
import { LiaAddressCardSolid, LiaTimesCircleSolid } from "react-icons/lia";
import langImg from "../../Assets/img/common/language.png";
import { TbTruckDelivery, TbUserPentagon } from "react-icons/tb";
import { CgMenuRight } from "react-icons/cg";

const UserNavbar = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { cartCount, fetchCartCount, resetCartCount } = useCart();

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
            <img
              onClick={() => navigate("/")}
              className="h-10 sm:h-14 w-auto object-contain cursor-pointer"
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

          <div className="hidden sm:flex flex-1 max-w-2xl mx-6 relative">
            <input
              type="text"
              placeholder="Search Your Products..."
              className="w-full pl-4 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b6292] transition-all shadow-sm"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1b6292] transition-colors p-2">
              <BiSearchAlt2 size={20} />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-[#00395F] hover:text-[#FF8617] transition">
                  <BiUserCircle size={22} />
                  {userData?.firstName?.split(" ")[0] || "Profile"}
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <MenuItem icon={<FiUser />} label="My Profile" to="/user-profile" />
                  <MenuItem icon={<FiShoppingBag />} label="My Orders" to="/user-orders" />
                  <MenuItem icon={<LiaAddressCardSolid />} label="Saved Addresses" to="/saved-addresses" />
                  <MenuItem icon={<LuHeartCrack />} label="Wishlist" to="/wishlist" />
                  <MenuItem icon={<FiLogOut />} label="Logout" onClick={handleLogout} red />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] transition text-[15px]"
              >
                <BiLogIn size={22} />
                Login
              </button>
            )}

            <CartButton cartCount={cartCount} onClick={() => navigate("/my-carts")} />
            <NavButton label="Track Order" icon={<TbTruckDelivery size={22} />} />
            <NavButton label="Become Seller" icon={<TbUserPentagon size={22} />} onClick={() => navigate("/become-seller")} />
            <img src={langImg} alt="Language" className="h-6 w-auto cursor-pointer" />
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
                placeholder="Search Your Products..."
                className="flex-1 pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
              />
              <button className="text-gray-600">
                <BiSearchAlt2 size={22} />
              </button>
            </div>

            {isLoggedIn ? (
              <>
                <MenuItem icon={<FiUser />} label="My Profile" to="/my-profile" />
                <MenuItem icon={<FiShoppingBag />} label="My Orders" to="/user-orders" />
                <MenuItem icon={<LiaAddressCardSolid />} label="Saved Addresses" to="/saved-addresses" />
                <MenuItem icon={<LuHeartCrack />} label="Wishlist" to="/wishlist" />
                <MenuItem icon={<FiLogOut />} label="Logout" onClick={handleLogout} red />
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 text-[#00395F]"
              >
                <BiLogIn size={22} />
                Login
              </button>
            )}

            <CartButton cartCount={cartCount} onClick={() => navigate("/my-carts")} />
            <NavButton label="Track Order" icon={<TbTruckDelivery size={22} />} />
            <NavButton label="Become Seller" icon={<TbUserPentagon size={22} />} onClick={() => navigate("/become-seller")} />
            <img src={langImg} alt="Language" className="h-6 w-auto cursor-pointer self-start" />
          </div>
        )}
      </nav>

      {/* Sidebar Overlay & Content */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-4 py-2 flex justify-between items-center border-b border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-gray-900 tracking-wide flex items-center gap-2">
            <span className="bg-primaryColor text-white p-1 text-sm rounded-lg">
              <FiMenu />
            </span>
            Menu
          </h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
            aria-label="Close sidebar"
          >
            <FiX className="text-gray-600 hover:text-red-500 text-lg transition-colors" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)]">
          <nav className="px-4 py-2 flex flex-col gap-1">
            {[
              { name: "Home", path: "/" },
              { name: "About", path: "/about-us" },
              { name: "Blog", path: "/blogs" },
              { name: "Contact", path: "/contact-us" },
              { name: "Categories", path: "/categories" },
            ].map((item, index) => (
              <div
                key={index}
                className="px-4 py-1.5 cursor-pointer rounded-lg hover:bg-primaryColor/10 hover:text-primaryColor transition-all flex items-center gap-3 group"
                onClick={() => {
                  toggleSidebar();
                  navigate(item.path);
                }}
              >
                <span className="text-primaryColor opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiChevronRight size={14} />
                </span>
                <span className="text-md font-medium text-gray-700 group-hover:font-semibold">
                  {item.name}
                </span>
              </div>
            ))}
          </nav>

          <div className="relative my-2 h-px mx-5 bg-gray-200"></div>

          <div className="px-5 py-3">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 tracking-wider uppercase flex items-center gap-2">
              <FiUser className="text-gray-400" />
              <span>User Options</span>
            </div>

            <div className="mt-2 space-y-1">
              {[
                { icon: <RiGuideFill className="text-blue-500" />, text: "Consult A Guidance", path: "/consult-guidance" },
                { icon: <FaFileSignature className="text-green-500" />, text: "Request For Quotation" },
                { icon: <FaTools className="text-orange-500" />, text: "Technical Operator", path: "/technical-operator" },
                { icon: <FaUserTie className="text-teal-500" />, text: "Become a Seller", path: "/become-seller" },
                { icon: <FaShippingFast className="text-purple-500" />, text: "Track Order" },
                { icon: <FaTags className="text-yellow-500" />, text: "Offers" },
              ].map((option, index) => (
                <div
                  key={index}
                  onClick={() => option.path && navigate(option.path)}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span className="p-2 bg-white rounded-lg shadow-sm">
                    {option.icon}
                  </span>
                  <span className="font-medium text-gray-700">{option.text}</span>
                  <span className="ml-auto text-gray-400">
                    <FiChevronRight />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
    <FaOpencart size={22} />
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