// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { RiDashboardLine } from "react-icons/ri";
// import { IoClose } from "react-icons/io5";
// import { SiHackthebox } from "react-icons/si";
// import { TbCategory2, TbCategoryMinus } from "react-icons/tb";
// import { MdOutlineCategory } from "react-icons/md";
// import { PiNotepad } from "react-icons/pi";
// import { PiUsersThree } from "react-icons/pi";
// import { LiaSellcast } from "react-icons/lia";
// import { PiFlagBannerFold } from "react-icons/pi";
// import { BiMessageAltDetail } from "react-icons/bi";
// import { RiGuideFill } from "react-icons/ri";
// import { FiHome } from "react-icons/fi";

// const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   // Menu items configuration
//   const menuItems = [
//     {
//       label: "Dashboard",
//       icon: <RiDashboardLine size={20} />,
//       path: "/dashboard",
//     },
//     {
//       label: "Categories",
//       icon: <TbCategory2 size={20} />,
//       path: "/admin-categories",
//     },
//     {
//       label: "Sub Categories",
//       icon: <MdOutlineCategory size={20} />,
//       path: "/admin-sub-categories",
//     },
//     {
//       label: "Tier 3 Categories",
//       icon: <TbCategoryMinus size={20} />,
//       path: "/admin-sub-sub-categories",
//     },
//     {
//       label: "Products",
//       icon: <SiHackthebox size={20} />,
//       path: "/admin-products",
//     },
//     {
//       label: "Orders",
//       icon: <PiNotepad size={20} />,
//       path: "/admin-orders",
//     },
//     {
//       label: "Customers",
//       icon: <PiUsersThree size={20} />,
//       path: "/admin-customers",
//     },
//     {
//       label: "Suppliers",
//       icon: <LiaSellcast size={20} />,
//       path: "/admin-sellers",
//     },
//     {
//       label: "Guide Bookings",
//       icon: <RiGuideFill size={20} />,
//       path: "/admin-guidance-booking",
//     },
//     {
//       label: "App Banners",
//       icon: <PiFlagBannerFold size={20} />,
//       path: "/app-banners",
//     },
//     {
//       label: "All Blogs",
//       icon: <BiMessageAltDetail size={20} />,
//       path: "/admin-blogs",
//     },
//   ];

//   const renderMenuItems = () => (
//     <ul className="space-y-2 mt-3">
//       {menuItems.map((item) => (
//         <motion.li
//           key={item.path}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           <button
//             onClick={() => {
//               navigate(item.path);
//               if (window.innerWidth < 1024) {
//                 setIsSidebarOpen(false);
//               }
//             }}
//             className={`flex items-center w-full p-2 text-sm tracking-wider rounded-lg transition-all duration-200 ${
//               pathname === item.path
//                 ? "bg-[#FF8617] text-white shadow-md"
//                 : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
//             }`}
//           >
//             <span
//               className={`${
//                 pathname === item.path ? "text-white" : "text-[#FF8617]"
//               }`}
//             >
//               {item.icon}
//             </span>
//             <span className="ml-3 font-semibold">{item.label}</span>
//             {pathname === item.path && (
//               <motion.span
//                 className="ml-auto h-2 w-2 bg-white rounded-full"
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//               />
//             )}
//           </button>
//         </motion.li>
//       ))}
//     </ul>
//   );

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <div className="hidden lg:flex lg:flex-shrink-0">
//         <div className="flex flex-col w-64 h-screen overflow-y-auto bg-white border-r dark:bg-gray-800">
//           <div className="bg-gradient-to-b from-[#00395F] to-gray-800 pt-5 pb-4 px-6">
//             <div className="flex items-center gap-3">
//               <div
//                 onClick={() => navigate("/")}
//                 className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 cursor-pointer transition"
//               >
//                 <FiHome size={20} className="text-white" />
//               </div>
//               <h2 className="text-lg md:text-xl font-semibold text-white tracking-wide">
//                 All Menus
//               </h2>
//             </div>
//           </div>

//           <div className="px-2">{renderMenuItems()}</div>
//         </div>
//       </div>

//       {/* Mobile Sidebar */}
//       <div className="block lg:hidden">
//         {/* Overlay */}
//         <AnimatePresence>
//           {isSidebarOpen && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-40 bg-black bg-opacity-50"
//               onClick={toggleSidebar}
//             />
//           )}
//         </AnimatePresence>

//         {/* Sidebar Content */}
//         <AnimatePresence>
//           {isSidebarOpen && (
//             <motion.div
//               className="fixed inset-y-0 left-0 z-50 w-64 h-full"
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             >
//               <div className="flex flex-col w-full h-full px-4 py-8 overflow-y-auto bg-white dark:bg-gray-800">
//                 <div className="flex items-center justify-between px-3 mb-4">
//                   <button
//                     onClick={toggleSidebar}
//                     className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//                   >
//                     <IoClose
//                       size={24}
//                       className="text-gray-500 dark:text-gray-300"
//                     />
//                   </button>
//                 </div>
//                 {renderMenuItems()}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiDashboardLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { SiHackthebox } from "react-icons/si";
import { TbCategory2, TbCategoryMinus } from "react-icons/tb";
import { MdOutlineCategory } from "react-icons/md";
import { PiNotepad } from "react-icons/pi";
import { PiUsersThree } from "react-icons/pi";
import { LiaSellcast } from "react-icons/lia";
import { PiFlagBannerFold } from "react-icons/pi";
import { BiMessageAltDetail } from "react-icons/bi";
import { RiGuideFill } from "react-icons/ri";
import { FiHome } from "react-icons/fi";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getCurrentUserData = () => {
    const adminData = localStorage.getItem("pm-admin-data");
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        if (
          parsed?.userType &&
          ["admin", "sub-admin"].includes(parsed.userType)
        ) {
          return parsed;
        }
      } catch (error) {
        console.error("Error parsing admin data:", error);
      }
    }

    const supplierData = localStorage.getItem("pm-supplier-data");
    if (supplierData) {
      try {
        const parsed = JSON.parse(supplierData);
        if (parsed?.userType === "supplier") {
          return parsed;
        }
      } catch (error) {
        console.error("Error parsing supplier data:", error);
      }
    }

    return null;
  };

  const userData = getCurrentUserData();

  if (!userData) {
    return null;
  }

  const { userType, permissions = {} } = userData;
  const isAdmin = userType === "admin";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: <RiDashboardLine size={20} />,
      path: "/dashboard",
      permission: "dashboard",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Categories",
      icon: <TbCategory2 size={20} />,
      path: "/admin-categories",
      permission: "categories",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Sub Categories",
      icon: <MdOutlineCategory size={20} />,
      path: "/admin-sub-categories",
      permission: "subCategories",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Tier 3 Categories",
      icon: <TbCategoryMinus size={20} />,
      path: "/admin-sub-sub-categories",
      permission: "tier3Categories",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Products",
      icon: <SiHackthebox size={20} />,
      path: "/admin-products",
      permission: "products",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Orders",
      icon: <PiNotepad size={20} />,
      path: "/admin-orders",
      permission: "orders",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Customers",
      icon: <PiUsersThree size={20} />,
      path: "/admin-customers",
      permission: "customers",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Suppliers",
      icon: <LiaSellcast size={20} />,
      path: "/admin-sellers",
      permission: "suppliers",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Guide Bookings",
      icon: <RiGuideFill size={20} />,
      path: "/admin-guidance-booking",
      permission: "guideBookings",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "App Banners",
      icon: <PiFlagBannerFold size={20} />,
      path: "/app-banners",
      permission: "appBanners",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "All Blogs",
      icon: <BiMessageAltDetail size={20} />,
      path: "/admin-blogs",
      permission: "allBlogs",
      userTypes: ["admin", "sub-admin"],
    },
  ];

  const supplierMenuItems = [
    {
      label: "Dashboard",
      icon: <RiDashboardLine size={20} />,
      path: "/supplier-dashboard",
      permission: "supplier-dashboard",
      userTypes: ["supplier"],
    },
    {
      label: "Categories",
      icon: <TbCategory2 size={20} />,
      path: "/supplier-categories",
      permission: "supplier-categories",
      userTypes: ["supplier"],
    },
    {
      label: "Sub Categories",
      icon: <MdOutlineCategory size={20} />,
      path: "/supplier-sub-categories",
      permission: "supplier-subCategories",
      userTypes: ["supplier"],
    },
    {
      label: "Tier 3 Categories",
      icon: <TbCategoryMinus size={20} />,
      path: "/supplier-tier3-categories",
      permission: "supplier-tier3Categories",
      userTypes: ["supplier"],
    },
    {
      label: "Products",
      icon: <SiHackthebox size={20} />,
      path: "/supplier-products",
      permission: "supplier-products",
      userTypes: ["supplier"],
    },
  ];

  const menuItems =
    userType === "supplier" ? supplierMenuItems : adminMenuItems;

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.userTypes && !item.userTypes.includes(userType)) {
      return false;
    }

    if (isAdmin && item.userTypes?.includes("admin")) {
      return true;
    }

    if (item.permission === null) return true;

    return permissions[item.permission] === true;
  });

  const renderMenuItems = () => (
    <ul className="space-y-2 mt-3">
      {filteredMenuItems.map((item) => (
        <motion.li
          key={item.path}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            onClick={() => {
              navigate(item.path);
              if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
              }
            }}
            className={`flex items-center w-full p-2 text-sm tracking-wider rounded-lg transition-all duration-200 ${
              pathname === item.path
                ? "bg-[#FF8617] text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span
              className={`${
                pathname === item.path ? "text-white" : "text-[#FF8617]"
              }`}
            >
              {item.icon}
            </span>
            <span className="ml-3 font-semibold">{item.label}</span>
            {pathname === item.path && (
              <motion.span
                className="ml-auto h-2 w-2 bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </button>
        </motion.li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 h-screen overflow-y-auto bg-white border-r dark:bg-gray-800">
          <div className="bg-gradient-to-b from-[#00395F] to-gray-800 pt-5 pb-3 px-4">
            <div className="flex items-center gap-3">
              <div
                onClick={() => navigate("/")}
                className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 cursor-pointer transition"
              >
                <FiHome size={20} className="text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-white tracking-wide">
                {userType === "supplier" ? "Supplier Menu" : "Admin Menu"}
              </h2>
            </div>
          </div>

          <div className="px-2">{renderMenuItems()}</div>
        </div>
      </div>

      <div className="block lg:hidden">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-64 h-full"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col w-full h-full px-4 py-8 overflow-y-auto bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between px-3 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {userType === "supplier" ? "Supplier Menu" : "Admin Menu"}
                  </h2>
                  <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <IoClose
                      size={24}
                      className="text-gray-500 dark:text-gray-300"
                    />
                  </button>
                </div>
                {renderMenuItems()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Sidebar;
