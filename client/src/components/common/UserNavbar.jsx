import React, { useState, useEffect } from "react";
import pmLogo from "../../Assets/img/Logos/newPMLogo.png";
import { FaOpencart, FaTimes } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiMenuKebab } from "react-icons/ci";
import UsersBottomNav from "./UsersBottomNav";
import { useNavigate } from "react-router-dom";
import { BiLogIn, BiSearchAlt2 } from "react-icons/bi";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import { FiUser, FiShoppingBag, FiLogOut } from "react-icons/fi";
import { LuHeartCrack, LuShoppingCart } from "react-icons/lu";
import { useCart } from "../../utils/CartContext";
import { LiaAddressCardSolid, LiaTimesCircleSolid } from "react-icons/lia";
import langImg from "../../Assets/img/common/language.png";
import { TbTruckDelivery, TbUserPentagon } from "react-icons/tb";

const UserNavbar = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

      <nav className="w-full bg-[#FFFFFF] shadow-md px-4 sm:px-6">
        <div className="flex items-center justify-between py-2">
          {/* Logo and mobile toggle */}
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

          {/* Search bar */}
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

          {/* Desktop nav actions */}
          <div className="hidden sm:flex items-center gap-6">
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-[#00395F] hover:text-[#FF8617] transition">
                  <FaRegCircleUser size={22} />
                  {userData?.firstName?.split(" ")[0] || "Profile"}
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <MenuItem
                    icon={<FiUser />}
                    label="My Profile"
                    to="/my-profile"
                  />
                  <MenuItem
                    icon={<FiShoppingBag />}
                    label="My Orders"
                    to="/my-orders"
                  />
                  {/* <MenuItem
                    icon={<FaOpencart />}
                    label="Cart"
                    to="/my-carts"
                    badge={cartCount}
                  /> */}
                  <MenuItem
                    icon={<LiaAddressCardSolid />}
                    label="Saved Addresses"
                    to="/saved-addresses"
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
                <BiLogIn size={22} />
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
            <img
              src={langImg}
              alt="Language"
              className="h-8 w-auto cursor-pointer"
            />
          </div>
        </div>

        {/* Mobile Menu */}
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
                <MenuItem
                  icon={<FiUser />}
                  label="My Profile"
                  to="/my-profile"
                />
                <MenuItem
                  icon={<FiShoppingBag />}
                  label="My Orders"
                  to="/my-orders"
                />
                {/* <MenuItem icon={<FaOpencart />} label="Cart" to="/my-carts" badge={cartCount} /> */}
                <MenuItem
                  icon={<LiaAddressCardSolid />}
                  label="Saved Addresses"
                  to="/saved-addresses"
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
                <BiLogIn size={22} />
                Login
              </button>
            )}

            <CartButton
              cartCount={cartCount}
              onClick={() => navigate("/my-carts")}
            />
            <NavButton label="Track Order" icon={<TbTruckDelivery size={22} />} />
            <NavButton
              label="Become Seller"
              icon={<TbUserPentagon size={22} />}
              onClick={() => navigate("/become-seller")}
            />
            <img
              src={langImg}
              alt="Language"
              className="h-8 w-auto cursor-pointer self-start"
            />
          </div>
        )}
      </nav>

      <UsersBottomNav />
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

const NavButton = ({ label, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 py-3 text-[#00395F] hover:text-[#FF8617] text-[15px]"
    >
      {icon}
      {label}
    </button>
  );
};

export default UserNavbar;

// import React, { useState, useEffect } from "react";
// import pmLogo from "../../Assets/img/Logos/newPMLogo.png";
// import {
//   FaFileAlt,
//   FaOpencart,
//   FaShoppingCart,
//   FaSignInAlt,
//   FaUserCircle,
// } from "react-icons/fa";
// import UsersBottomNav from "./UsersBottomNav";
// import { useNavigate } from "react-router-dom";
// import { BiSearchAlt2 } from "react-icons/bi";
// import UserLoginModal from "../Login/UserLoginModal";
// import UserRegisterModal from "../Login/UserRegisterModal";
// import { FiUser, FiShoppingBag, FiLogOut } from "react-icons/fi";
// import { LuHeartCrack } from "react-icons/lu";
// import { useCart } from "../../utils/CartContext";
// import { LiaAddressCardSolid } from "react-icons/lia";

// const UserNavbar = () => {
//   const navigate = useNavigate();
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(null);

//   const { cartCount, fetchCartCount, resetCartCount } = useCart();

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

//   return (
//     <React.Fragment>
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

//       <nav className="w-full bg-[#00395F] shadow-md px-4 xl:px-6">
//         <div className="py-1.5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
//           <div className="flex items-center w-full sm:w-auto gap-4 flex-1 ">
//             <div className="mr-14">
//               <img
//                 onClick={() => navigate("/")}
//                 className="h-12 sm:h-14 w-auto object-contain cursor-pointer"
//                 src={pmLogo}
//                 alt="pm-Logo"
//               />
//             </div>

//             <div className="flex-1 max-w-3xl w-full relative">
//               {/* Search input */}
//               <input
//                 type="text"
//                 placeholder="Search Your Products..."
//                 className="w-full pl-4 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b6292] focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400"
//               />

//               {/* Right search icon (alternative) */}
//               <button
//                 type="submit"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1b6292] transition-colors duration-200 bg-gradient-to-r from-[#f9aa80] via-[#fac9af] to-white hover:from-[#FF8617] hover:via-[#f9c08b] p-2 rounded-l-md"
//               >
//                 <BiSearchAlt2 size={20} />
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 w-full sm:w-auto">
//             {isLoggedIn ? (
//               <div className="relative group">
//                 <button className="capitalize flex items-center gap-1 px-4 py-3 bg-[#FF8617] text-white rounded-md hover:bg-[#e14f00] transition text-sm">
//                   <FaUserCircle size={16} />
//                   {userData?.firstName?.split(" ")[0] || "Profile"}
//                 </button>

//                 <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
//                   <div
//                     className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => navigate("/my-profile")}
//                   >
//                     <FiUser size={16} />
//                     My Profile
//                   </div>

//                   <div
//                     className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => navigate("/my-orders")}
//                   >
//                     <FiShoppingBag size={16} />
//                     My Orders
//                   </div>

//                   <div
//                     className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => navigate("/my-carts")}
//                   >
//                     <FaOpencart size={16} />
//                     Cart
//                     {cartCount > 0 && (
//                       <span className="ml-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//                         {cartCount}
//                       </span>
//                     )}
//                   </div>

//                   <div
//                     className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => navigate("/saved-addresses")}
//                   >
//                     <LiaAddressCardSolid size={16} />
//                     Saved Addresses
//                   </div>

//                   <div
//                     className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => navigate("/wishlist")}
//                   >
//                     <LuHeartCrack size={16} />
//                     Wishlist
//                   </div>

//                   <div
//                     className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer"
//                     onClick={handleLogout}
//                   >
//                     <FiLogOut size={16} />
//                     Logout
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setShowLoginModal(true)}
//                 className="flex items-center gap-1 px-4 py-3 bg-[#FF8617] text-white rounded-md hover:bg-[#e14f00] transition text-sm"
//               >
//                 <FaSignInAlt size={16} />
//                 Login
//               </button>
//             )}

//             <button
//               onClick={() => navigate("/my-carts")}
//               className="relative flex items-center gap-1 px-4 py-3 bg-[#FFF8F8] text-[#00395F] rounded-md hover:bg-green-100 hover:text-green-700 transition text-sm"
//             >
//               <FaShoppingCart size={16} />
//               <span>Cart</span>

//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </button>

//             <button className="flex items-center gap-1 px-4 py-3 bg-[#FFF8F8] text-[#00395F] rounded-md hover:bg-blue-100 hover:text-blue-700 transition text-sm">
//               <FaFileAlt size={16} />
//               Track Order
//             </button>

//             <button className="flex items-center gap-1 px-4 py-3 bg-[#FFF8F8] text-[#00395F] rounded-md hover:bg-blue-100 hover:text-blue-700 transition text-sm">
//               <FaFileAlt size={16} />
//               Become a Seller
//             </button>
//           </div>
//         </div>
//       </nav>

//       <UsersBottomNav />
//     </React.Fragment>
//   );
// };

// export default UserNavbar;
