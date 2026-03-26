import { useEffect, useState } from "react";
import { BiSolidUserCircle } from "react-icons/bi";
import { FaAddressCard, FaUserEdit } from "react-icons/fa";
import { FaHeartCrack } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { GiNotebook } from "react-icons/gi";
import { PiPoliceCarFill } from "react-icons/pi";
import { RiLuggageCartFill, RiMapPinUserFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import pmLogo from "../../Assets/img/Logos/logoImg.svg";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";

import { CgMenuRight } from "react-icons/cg";
import { FaFileDownload } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { IoLogIn } from "react-icons/io5";
import Quotation from "../../screens/users/Quotation";
import { useCart } from "../../utils/CartContext";
import NavSearchBar from "../UserSideNavbar/NavSearchBar";
import UserSidebar from "../UserSideNavbar/UserSidebar";

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
          <div className="flex-shrink-0">
            <img
              onClick={() => navigate("/")}
              className="h-10 sm:h-12 lg:h-[4.5rem] w-auto object-contain cursor-pointer"
              src={pmLogo}
              alt="pm-Logo"
            />
          </div>

          {/* SEARCH BAR — visible on md+ screens, grows to fill available space */}
          <div className="hidden md:flex flex-1 min-w-0 px-2 lg:px-0">
            <NavSearchBar isLoggedIn={isLoggedIn} />
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
                    <MenuItem
                      icon={<PiPoliceCarFill />}
                      label="Bulk Orders"
                      to="/bulk-orders"
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
              <button
                onClick={() => setShowLoginModal(true)}
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 
             rounded-full bg-gradient-to-r from-[#00395F] to-[#FF8617] 
             text-white text-xs font-medium shadow-sm
             active:scale-95 transition-all duration-200"
              >
                <IoLogIn size={14} />
                <span>Login</span>
              </button>
              {/* HAMBURGER — always visible */}
              <button onClick={toggleSidebar} className="flex-shrink-0 text-2xl text-gray-700 ml-1">
                <CgMenuRight />
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* MOBILE SEARCH BAR — only on small screens */}
      {isHomePage && (
        <div className="md:hidden sticky top-[56px] z-40 px-4 py-2 bg-white shadow-sm">
          <NavSearchBar isLoggedIn={isLoggedIn} />
        </div>
      )}

      {isQuotationModalUpon && (
        <Quotation onClose={() => setIsQuotationModalUpon(false)} />
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


export default UserNavbar;

// import React, { useState, useEffect } from "react";
// import pmLogo from "../../Assets/img/Logos/logoImg.svg";
// import { RiLuggageCartFill } from "react-icons/ri";
// import { RiMapPinUserFill } from "react-icons/ri";
// import { CiMenuKebab } from "react-icons/ci";
// import { useNavigate } from "react-router-dom";
// import { BiSearchAlt2, BiSolidUserCircle } from "react-icons/bi";
// import UserLoginModal from "../Login/UserLoginModal";
// import UserRegisterModal from "../Login/UserRegisterModal";
// import { FiLogOut } from "react-icons/fi";
// import { GiNotebook } from "react-icons/gi";
// import { FaUserEdit } from "react-icons/fa";
// import { FaAddressCard } from "react-icons/fa";
// import { PiPoliceCarFill } from "react-icons/pi";
// import { FaHeartCrack } from "react-icons/fa6";

// import { useCart } from "../../utils/CartContext";
// import { LiaTimesCircleSolid } from "react-icons/lia";
// import { TbUserPentagon } from "react-icons/tb";
// import { CgMenuRight } from "react-icons/cg";
// import { FaTruckFast } from "react-icons/fa6";
// import { IoLogIn } from "react-icons/io5";
// import NavSearchBar from "../UserSideNavbar/NavSearchBar";
// import UserSidebar from "../UserSideNavbar/UserSidebar";
// import Quotation from "../../screens/users/Quotation";
// import { FaFileDownload } from "react-icons/fa";

// const UserNavbar = () => {
//   const navigate = useNavigate();
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const { cartCount, fetchCartCount, resetCartCount } = useCart();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isQuotationModalUpon, setIsQuotationModalUpon] = useState(false);

//   useEffect(() => {
//     const userDataFromStorage = localStorage.getItem("pm-user-data");
//     if (userDataFromStorage) {
//       setIsLoggedIn(true);
//       setUserData(JSON.parse(userDataFromStorage));
//       fetchCartCount();
//     } else {
//       setIsLoggedIn(false);
//       setUserData(null);
//       resetCartCount();
//     }
//   }, [showLoginModal, showRegisterModal, fetchCartCount, resetCartCount]);

//   useEffect(() => {
//     if (isSidebarOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isSidebarOpen]);

//   const handleLogout = () => {
//     localStorage.removeItem("pm-user-data");
//     setIsLoggedIn(false);
//     setUserData(null);
//     resetCartCount();
//     navigate("/");
//   };

//   const openRegisterModal = () => {
//     setShowLoginModal(false);
//     setShowRegisterModal(true);
//   };

//   const openLoginModal = () => {
//     setShowRegisterModal(false);
//     setShowLoginModal(true);
//   };

//   const closeAllModals = () => {
//     setShowLoginModal(false);
//     setShowRegisterModal(false);
//   };

//   const handleLoginSuccess = () => {
//     fetchCartCount();
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(
//         `/products-search-results/${encodeURIComponent(searchQuery.trim())}`,
//       );
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   return (
//     <>
//       {showLoginModal && (
//         <UserLoginModal
//           onClose={closeAllModals}
//           onRegisterClick={openRegisterModal}
//           onLoginSuccess={handleLoginSuccess}
//         />
//       )}
//       {showRegisterModal && (
//         <UserRegisterModal
//           onClose={closeAllModals}
//           onLoginClick={openLoginModal}
//         />
//       )}

//       <nav className="sticky top-0 w-full bg-[#FFFFFF] shadow-md px-4 sm:px-6 z-50">
//         <div className="flex items-center justify-between py-2">
//           <div className="flex items-center w-full justify-between sm:w-auto">
//             {/* <AnimatedLogo /> */}
//             <img
//               onClick={() => navigate("/")}
//               className="h-12 sm:h-[4.5rem] w-auto object-contain cursor-pointer"
//               src={pmLogo}
//               alt="pm-Logo"
//             />

//             <button
//               className="sm:hidden text-[#00395F]"
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               {menuOpen ? (
//                 <LiaTimesCircleSolid size={22} />
//               ) : (
//                 <CiMenuKebab size={22} />
//               )}
//             </button>
//           </div>

//           <NavSearchBar isLoggedIn={isLoggedIn} />

//           <div
//             className={`hidden sm:flex items-center gap-6 ${isLoggedIn ? "" : "ml-auto mr-7"
//               }`}
//           >
//             {isLoggedIn ? (
//               <div className="relative group">
//                 <button className="flex items-center gap-2 text-[#00395F] hover:text-[#FF8617] hover:bg-[#f7f7f5] px-2 py-3 rounded-md transition">
//                   <BiSolidUserCircle size={22} />
//                   {userData?.firstName?.split(" ")[0] || "Profile"}
//                 </button>

//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
//                   <MenuItem
//                     icon={<FaUserEdit />}
//                     label="My Profile"
//                     to="/user-profile"
//                   />
//                   <MenuItem
//                     icon={<GiNotebook />}
//                     label="My Orders"
//                     to="/user-orders"
//                   />
//                   <MenuItem
//                     icon={<FaAddressCard />}
//                     label="Saved Addresses"
//                     to="/saved-addresses"
//                   />
//                   <MenuItem
//                     icon={<FaTruckFast />}
//                     label="Track Order"
//                     to="/user-orders"
//                   />
//                   <MenuItem
//                     icon={<PiPoliceCarFill />}
//                     label="Bulk Orders"
//                     to="/bulk-orders"
//                   />
//                   <MenuItem
//                     icon={<FaHeartCrack />}
//                     label="Wishlist"
//                     to="/wishlist"
//                   />
//                   <MenuItem
//                     icon={<FiLogOut />}
//                     label="Logout"
//                     onClick={handleLogout}
//                     red
//                   />
//                 </div>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setShowLoginModal(true)}
//                 className="flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] transition text-[15px]"
//               >
//                 <IoLogIn size={22} />
//                 Login
//               </button>
//             )}

//             {isLoggedIn && (
//               <>
//                 <CartButton
//                   cartCount={cartCount}
//                   onClick={() => navigate("/my-carts")}
//                 />
//               </>
//             )}
//             {/* <NavButton label="Track Order" icon={<FaTruckFast size={22} />} /> */}
//             <NavButton
//               label="Become a Seller"
//               icon={<RiMapPinUserFill size={22} />}
//               onClick={() => navigate("/become-seller")}
//             />

//             <NavButton
//               label="Download Instant Quotation"
//               icon={<FaFileDownload size={18} />}
//               onClick={() => setIsQuotationModalUpon(true)}
//             />
//           </div>

//           <button onClick={toggleSidebar} className="text-2xl text-gray-700">
//             <CgMenuRight />
//           </button>
//         </div>

//         {menuOpen && (
//           <div className="sm:hidden flex flex-col gap-4 mt-2 pb-4 border-t pt-4">
//             <div className="flex items-center gap-2">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Products by names or brands..."
//                 className="flex-1 pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
//               />
//               <button onClick={handleSearch} className="text-gray-600">
//                 <BiSearchAlt2 size={22} />
//               </button>
//             </div>

//             {isLoggedIn ? (
//               <>
//                 <MenuItem
//                   icon={<FaUserEdit />}
//                   label="My Profile"
//                   to="/my-profile"
//                 />
//                 <MenuItem
//                   icon={<GiNotebook />}
//                   label="My Orders"
//                   to="/user-orders"
//                 />
//                 <MenuItem
//                   icon={<FaAddressCard />}
//                   label="Saved Addresses"
//                   to="/saved-addresses"
//                 />

//                 <MenuItem
//                   icon={<FaTruckFast />}
//                   label="Track Order"
//                   to="/user-orders"
//                 />

//                 <MenuItem
//                   icon={<PiPoliceCarFill />}
//                   label="Bulk Orders"
//                   to="/bulk-orders"
//                 />
//                 <MenuItem
//                   icon={<FaHeartCrack />}
//                   label="Wishlist"
//                   to="/wishlist"
//                 />
//                 <MenuItem
//                   icon={<FiLogOut />}
//                   label="Logout"
//                   onClick={handleLogout}
//                   red
//                 />
//               </>
//             ) : (
//               <button
//                 onClick={() => setShowLoginModal(true)}
//                 className="flex items-center gap-2 text-[#00395F]"
//               >
//                 <IoLogIn size={22} />
//                 Login
//               </button>
//             )}

//             {isLoggedIn && (
//               <>
//                 <CartButton
//                   cartCount={cartCount}
//                   onClick={() => navigate("/my-carts")}
//                 />
//                 {/* <NavButton
//                   label="Track Order"
//                   icon={<FaTruckFast size={22} />}
//                   onClick={() => navigate("/user-orders")}
//                 /> */}
//               </>
//             )}
//             <NavButton
//               label="Become A Seller"
//               icon={<TbUserPentagon size={22} />}
//               onClick={() => navigate("/become-seller")}
//             />

//             <NavButton
//               label="Download Instant Quotation"
//               icon={<FaFileDownload size={18} />}
//               onClick={() => setIsQuotationModalUpon(true)}
//             />
//           </div>
//         )}
//       </nav>
//       {isQuotationModalUpon && (
//         <Quotation onClose={() => setIsQuotationModalUpon(false)} />
//       )}

//       <UserSidebar
//         isSidebarOpen={isSidebarOpen}
//         toggleSidebar={toggleSidebar}
//         navigate={navigate}
//       />
//     </>
//   );
// };

// const MenuItem = ({ icon, label, to, onClick, badge, red }) => {
//   const navigate = useNavigate();
//   return (
//     <div
//       onClick={onClick || (() => navigate(to))}
//       className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${red ? "text-red-600 hover:bg-red-100" : "text-gray-700"
//         }`}
//     >
//       {icon}
//       {label}
//       {badge > 0 && (
//         <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//           {badge}
//         </span>
//       )}
//     </div>
//   );
// };

// const CartButton = ({ cartCount, onClick }) => (
//   <button
//     onClick={onClick}
//     className="relative flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] hover:bg-[#f7f7f5] px-2 py-3 rounded-md transition text-[15px]"
//   >
//     <RiLuggageCartFill size={22} />
//     <span>Cart</span>
//     {cartCount > 0 && (
//       <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//         {cartCount}
//       </span>
//     )}
//   </button>
// );

// const NavButton = ({ label, icon, onClick }) => (
//   <button
//     onClick={onClick}
//     className="flex items-center gap-1 text-[#00395F] hover:text-[#FF8617] hover:bg-[#f7f7f5] px-2 py-3 rounded-md text-[15px]"
//   >
//     {icon}
//     {label}
//   </button>
// );

// export default UserNavbar;
