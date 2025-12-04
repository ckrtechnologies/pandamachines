import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiDashboardLine,
  RiArrowRightSLine,
  RiArrowDownSLine,
  RiMenu4Line,
  RiChat1Line,
} from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { SiHackthebox } from "react-icons/si";
import { TbCategory2, TbCategoryMinus } from "react-icons/tb";
import { MdOutlineCategory, MdOutlineLocalOffer } from "react-icons/md";
import { PiNotepad, PiUsersThree, PiFlagBannerFold } from "react-icons/pi";
import { LiaSellcast } from "react-icons/lia";
import { BiMessageAltDetail } from "react-icons/bi";
import { RiGuideFill } from "react-icons/ri";
import { FaRegFileLines, FaRobot } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";
import { CgProductHunt } from "react-icons/cg";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

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

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => {
      if (prev[sectionKey]) {
        return {};
      }
      return { [sectionKey]: true };
    });
  };

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: <RiDashboardLine size={20} />,
      path: "/dashboard",
      type: "single",
      permission: "dashboard",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Orders",
      icon: <PiNotepad size={20} />,
      path: "/admin-orders",
      type: "single",
      permission: "orders",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Customers",
      icon: <PiUsersThree size={20} />,
      path: "/admin-customers",
      type: "single",
      permission: "customers",
      userTypes: ["admin", "sub-admin"],
    },
    {
      path: "/admin-sellers",
      icon: <LiaSellcast size={18} />,
      label: "Sellers",
      type: "single",
      permission: "suppliers",
      userTypes: ["admin", "sub-admin"],
    },
    {
      path: "/product-approve",
      icon: <CgProductHunt size={18} />,
      label: "P-Approve",
      type: "single",
      permission: "suppliers",
      userTypes: ["admin", "sub-admin"],
    },
    {
      label: "Collection",
      icon: <TbCategory2 size={20} />,
      type: "section",
      key: "categories",
      userTypes: ["admin", "sub-admin"],
      children: [
        {
          path: "/admin-categories",
          icon: <TbCategory2 size={18} />,
          label: "Categories",
          permission: "categories",
        },
        {
          path: "/admin-sub-categories",
          icon: <MdOutlineCategory size={18} />,
          label: "Sub Categories",
          permission: "subCategories",
        },
        {
          path: "/admin-sub-sub-categories",
          icon: <TbCategoryMinus size={18} />,
          label: "T-3 Categories",
          permission: "tier3Categories",
        },
        {
          path: "/admin-products",
          icon: <SiHackthebox size={18} />,
          label: "Products",
          permission: "products",
        },
      ],
    },
    {
      label: "Inquiries",
      icon: <BsQuestionCircle size={20} />,
      type: "section",
      key: "inquiries",
      userTypes: ["admin", "sub-admin"],
      children: [
        {
          path: "/admin-inquiry",
          icon: <BsQuestionCircle size={18} />,
          label: "Inquiry",
          permission: "inquiries",
        },
        {
          path: "/all-chatbot-inquiries",
          icon: <FaRobot size={18} />,
          label: "Chatbot Inquiries",
          permission: "inquiries",
        },
      ],
    },

    {
      label: "Contents",
      icon: <BiMessageAltDetail size={20} />,
      type: "section",
      key: "content",
      userTypes: ["admin", "sub-admin"],
      children: [
        {
          path: "/admin-blogs",
          icon: <BiMessageAltDetail size={18} />,
          label: "All Blogs",
          permission: "allBlogs",
        },
        {
          path: "/app-banners",
          icon: <PiFlagBannerFold size={18} />,
          label: "App Banners",
          permission: "appBanners",
        },
        {
          path: "/admin-offers",
          icon: <MdOutlineLocalOffer size={18} />,
          label: "All Offers",
          permission: "allOffers",
        },
      ],
    },
    {
      label: "Other Services",
      icon: <RiGuideFill size={20} />,
      type: "section",
      key: "services",
      userTypes: ["admin", "sub-admin"],
      children: [
        {
          path: "/admin-guidance-booking",
          icon: <RiGuideFill size={18} />,
          label: "E-Consult",
          permission: "guideBookings",
        },
        {
          path: "/admin-quotations",
          icon: <FaRegFileLines size={18} />,
          label: "All Quotations",
          permission: "allQuotations",
        },
      ],
    },
  ];

  const supplierMenuItems = [
    {
      label: "Dashboard",
      icon: <RiDashboardLine size={20} />,
      path: "/supplier-dashboard",
      type: "single",
      permission: "supplier-dashboard",
      userTypes: ["supplier"],
    },
    {
      label: "Collection",
      icon: <TbCategory2 size={20} />,
      type: "section",
      key: "supplier-categories",
      userTypes: ["supplier"],
      children: [
        {
          path: "/supplier-categories",
          icon: <TbCategory2 size={18} />,
          label: "Categories",
          permission: "supplier-categories",
        },
        {
          path: "/supplier-sub-categories",
          icon: <MdOutlineCategory size={18} />,
          label: "Sub Categories",
          permission: "supplier-subCategories",
        },
        {
          path: "/supplier-tier3-categories",
          icon: <TbCategoryMinus size={18} />,
          label: "Tier 3 Categories",
          permission: "supplier-tier3Categories",
        },
      ],
    },
    {
      label: "Products",
      icon: <SiHackthebox size={20} />,
      path: "/supplier-products",
      type: "single",
      permission: "supplier-products",
      userTypes: ["supplier"],
    },
  ];

  const menuItems =
    userType === "supplier" ? supplierMenuItems : adminMenuItems;

  const filterChildren = (children) => {
    return children.filter((child) => {
      if (isAdmin) return true;
      if (child.permission === null) return true;
      return permissions[child.permission] === true;
    });
  };

  const filteredMenuItems = menuItems
    .map((item) => {
      if (item.userTypes && !item.userTypes.includes(userType)) {
        return null;
      }

      if (item.type === "section") {
        const filteredChildren = filterChildren(item.children);
        if (filteredChildren.length === 0) return null;
        return { ...item, children: filteredChildren };
      }

      if (isAdmin && item.userTypes?.includes("admin")) {
        return item;
      }

      if (item.permission === null) return item;

      return permissions[item.permission] === true ? item : null;
    })
    .filter(Boolean);

  const isChildActive = (children) => {
    return children.some((child) => location.pathname === child.path);
  };

  const renderMenuItem = (item) => {
    if (item.type === "single") {
      return (
        <motion.li
          key={item.path}
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div
            onClick={() => navigate(item.path)}
            className={`${
              location.pathname === item.path
                ? "bg-gradient-to-r from-[#FF8617] to-[#FF6B00] text-white font-medium shadow-lg"
                : "text-white font-normal hover:bg-gray-300 hover:text-gray-800"
            } flex items-center cursor-pointer p-3 text-sm rounded-xl transition-all duration-300 group`}
          >
            <span
              className={`${
                location.pathname === item.path
                  ? "text-white"
                  : "text-[#FF8617]"
              } transition-colors duration-300`}
            >
              {item.icon}
            </span>
            <span className="ml-4 tracking-wide font-medium">{item.label}</span>
            <motion.span
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: location.pathname === item.path ? 1 : 0,
                x: location.pathname === item.path ? 0 : -10,
              }}
            >
              <RiArrowRightSLine size={18} />
            </motion.span>
          </div>
        </motion.li>
      );
    }

    if (item.type === "section") {
      const isExpanded = expandedSections[item.key];
      const hasActiveChild = isChildActive(item.children);

      return (
        <li key={item.key}>
          <div
            onClick={() => toggleSection(item.key)}
            className={`${
              hasActiveChild
                ? "bg-gradient-to-r from-[#FF8617]/10 to-[#FF6B00]/10 text-[#FF8617] font-medium"
                : "text-white font-normal hover:bg-gray-300 hover:text-gray-800"
            } flex items-center cursor-pointer p-3 text-sm rounded-xl transition-all duration-300 group`}
          >
            <span
              className={`${
                hasActiveChild ? "text-[#FF8617]" : "text-[#FF8617]"
              } transition-colors duration-300`}
            >
              {item.icon}
            </span>
            <span className="ml-4 tracking-wide font-medium">{item.label}</span>
            <motion.span
              className="ml-auto"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <RiArrowDownSLine size={20} />
            </motion.span>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 ml-1 space-y-0.5 overflow-hidden"
              >
                {item.children.map((child) => (
                  <motion.li
                    key={child.path}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div
                      onClick={() => navigate(child.path)}
                      className={`${
                        location.pathname === child.path
                          ? "bg-gradient-to-r from-[#FF8617] to-[#FF6B00] text-white font-medium shadow-md"
                          : "text-white font-normal hover:bg-gray-300 hover:text-gray-800"
                      } flex items-center cursor-pointer p-2.5 pl-2 text-sm rounded-lg transition-all duration-300 group`}
                    >
                      <span
                        className={`${
                          location.pathname === child.path
                            ? "text-white"
                            : "text-[#FF8617]"
                        } transition-colors duration-300`}
                      >
                        {child.icon}
                      </span>
                      <span className="ml-3 tracking-wide font-medium text-sm">
                        {child.label}
                      </span>
                      <motion.span
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: location.pathname === child.path ? 1 : 0,
                          x: location.pathname === child.path ? 0 : -10,
                        }}
                      >
                        <RiArrowRightSLine size={16} />
                      </motion.span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>
      );
    }
  };

  return (
    <React.Fragment>
      {/* Desktop Sidebar */}
      <div
        className="lg:contents hidden flex-shrink-0 tracking-wide"
        aria-label="Sidebar"
      >
        {/* Entire sidebar with gradient background */}
        <div className="bg-gradient-to-b from-[#133a53] to-[#17222a] h-screen">
          {/* Header */}
          <div className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-3">
              <div
                onClick={() => navigate("/")}
                className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 cursor-pointer transition"
              >
                <FiHome size={20} className="text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-white tracking-wide">
                All Menus
              </h2>
            </div>
          </div>

          {/* Menu Items */}
          <div className="overflow-y-auto pb-2 px-4 bg-transparent">
            <div className="px-1">
              <ul className="space-y-1 tracking-wide">
                {filteredMenuItems.map((item) => renderMenuItem(item))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="block lg:hidden">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              className="h-full w-[70%] sm:w-[60%] absolute z-40 shadow-2xl"
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Entire mobile sidebar with gradient background */}
              <div className="overflow-y-auto bg-gradient-to-b from-[#2C5F7F ] to-[#1A3A4F] h-screen">
                {/* Mobile Header */}
                <div className="py-5 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={toggleSidebar}
                      className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 cursor-pointer transition"
                    >
                      <IoClose size={24} className="text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-white tracking-wide">
                      All Menus
                    </h2>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="px-4">
                  <ul className="space-y-1 tracking-wide">
                    {filteredMenuItems.map((item) => renderMenuItem(item))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;

// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { RiDashboardLine } from "react-icons/ri";
// import { IoClose } from "react-icons/io5";
// import { SiHackthebox } from "react-icons/si";
// import { TbCategory2, TbCategoryMinus } from "react-icons/tb";
// import { MdOutlineCategory, MdOutlineLocalOffer } from "react-icons/md";
// import { PiNotepad } from "react-icons/pi";
// import { PiUsersThree } from "react-icons/pi";
// import { LiaSellcast } from "react-icons/lia";
// import { PiFlagBannerFold } from "react-icons/pi";
// import { BiMessageAltDetail } from "react-icons/bi";
// import { RiGuideFill } from "react-icons/ri";
// import { FiHome } from "react-icons/fi";
// import { FaFileDownload } from "react-icons/fa";
// import { FaRegFileLines } from "react-icons/fa6";

// const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();

//   const getCurrentUserData = () => {
//     const adminData = localStorage.getItem("pm-admin-data");
//     if (adminData) {
//       try {
//         const parsed = JSON.parse(adminData);
//         if (
//           parsed?.userType &&
//           ["admin", "sub-admin"].includes(parsed.userType)
//         ) {
//           return parsed;
//         }
//       } catch (error) {
//         console.error("Error parsing admin data:", error);
//       }
//     }

//     const supplierData = localStorage.getItem("pm-supplier-data");
//     if (supplierData) {
//       try {
//         const parsed = JSON.parse(supplierData);
//         if (parsed?.userType === "supplier") {
//           return parsed;
//         }
//       } catch (error) {
//         console.error("Error parsing supplier data:", error);
//       }
//     }

//     return null;
//   };

//   const userData = getCurrentUserData();

//   if (!userData) {
//     return null;
//   }

//   const { userType, permissions = {} } = userData;
//   const isAdmin = userType === "admin";

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const adminMenuItems = [
//     {
//       label: "Dashboard",
//       icon: <RiDashboardLine size={20} />,
//       path: "/dashboard",
//       permission: "dashboard",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "Categories",
//       icon: <TbCategory2 size={20} />,
//       path: "/admin-categories",
//       permission: "categories",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "Sub Categories",
//       icon: <MdOutlineCategory size={20} />,
//       path: "/admin-sub-categories",
//       permission: "subCategories",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "Tier 3 Categories",
//       icon: <TbCategoryMinus size={20} />,
//       path: "/admin-sub-sub-categories",
//       permission: "tier3Categories",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "Products",
//       icon: <SiHackthebox size={20} />,
//       path: "/admin-products",
//       permission: "products",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "Orders",
//       icon: <PiNotepad size={20} />,
//       path: "/admin-orders",
//       permission: "orders",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "Customers",
//       icon: <PiUsersThree size={20} />,
//       path: "/admin-customers",
//       permission: "customers",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "Sellers",
//       icon: <LiaSellcast size={20} />,
//       path: "/admin-sellers",
//       permission: "suppliers",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "Guide Bookings",
//       icon: <RiGuideFill size={20} />,
//       path: "/admin-guidance-booking",
//       permission: "guideBookings",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "App Banners",
//       icon: <PiFlagBannerFold size={20} />,
//       path: "/app-banners",
//       permission: "appBanners",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "All Blogs",
//       icon: <BiMessageAltDetail size={20} />,
//       path: "/admin-blogs",
//       permission: "allBlogs",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "All Offers",
//       icon: <MdOutlineLocalOffer size={20} />,
//       path: "/admin-offers",
//       permission: "allOffers",
//       userTypes: ["admin", "sub-admin"],
//     },
//     {
//       label: "All Quotations",
//       icon: <FaRegFileLines size={18} />,
//       path: "/admin-quotations",
//       permission: "allQuotations",
//       userTypes: ["admin", "sub-admin"],
//     },
//   ];

//   const supplierMenuItems = [
//     {
//       label: "Dashboard",
//       icon: <RiDashboardLine size={20} />,
//       path: "/supplier-dashboard",
//       permission: "supplier-dashboard",
//       userTypes: ["supplier"],
//     },
//     {
//       label: "Categories",
//       icon: <TbCategory2 size={20} />,
//       path: "/supplier-categories",
//       permission: "supplier-categories",
//       userTypes: ["supplier"],
//     },
//     {
//       label: "Sub Categories",
//       icon: <MdOutlineCategory size={20} />,
//       path: "/supplier-sub-categories",
//       permission: "supplier-subCategories",
//       userTypes: ["supplier"],
//     },
//     {
//       label: "Tier 3 Categories",
//       icon: <TbCategoryMinus size={20} />,
//       path: "/supplier-tier3-categories",
//       permission: "supplier-tier3Categories",
//       userTypes: ["supplier"],
//     },
//     {
//       label: "Products",
//       icon: <SiHackthebox size={20} />,
//       path: "/supplier-products",
//       permission: "supplier-products",
//       userTypes: ["supplier"],
//     },
//   ];

//   const menuItems =
//     userType === "supplier" ? supplierMenuItems : adminMenuItems;

//   const filteredMenuItems = menuItems.filter((item) => {
//     if (item.userTypes && !item.userTypes.includes(userType)) {
//       return false;
//     }

//     if (isAdmin && item.userTypes?.includes("admin")) {
//       return true;
//     }

//     if (item.permission === null) return true;

//     return permissions[item.permission] === true;
//   });

//   const renderMenuItems = () => (
//     <ul className="space-y-2 mt-3">
//       {filteredMenuItems.map((item) => (
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
//           <div className="bg-gradient-to-b from-[#00395F] to-gray-800 pt-5 pb-3 px-4">
//             <div className="flex items-center gap-3">
//               <div
//                 onClick={() => navigate("/")}
//                 className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 cursor-pointer transition"
//               >
//                 <FiHome size={20} className="text-white" />
//               </div>
//               <h2 className="text-lg md:text-xl font-semibold text-white tracking-wide">
//                 {userType === "supplier" ? "Supplier Menu" : "Admin Menu"}
//               </h2>
//             </div>
//           </div>

//           <div className="px-2">{renderMenuItems()}</div>
//         </div>
//       </div>

//       <div className="block lg:hidden">
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
//                   <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//                     {userType === "supplier" ? "Supplier Menu" : "Admin Menu"}
//                   </h2>
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
