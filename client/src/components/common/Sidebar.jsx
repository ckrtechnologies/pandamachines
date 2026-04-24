import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";
import { CgProductHunt } from "react-icons/cg";
import { FaRegFileLines, FaRobot } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LiaSellcast } from "react-icons/lia";
import { MdOutlineCategory, MdOutlineLocalOffer } from "react-icons/md";
import { PiFlagBannerFold, PiNotepad, PiUsersThree } from "react-icons/pi";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiDashboardLine,
  RiGuideFill
} from "react-icons/ri";
import { SiHackthebox } from "react-icons/si";
import { TbCategory2, TbCategoryMinus } from "react-icons/tb";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const getCurrentUserData = () => {
    const adminData = localStorage.getItem("pm-admin-data");
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        if (parsed?.userType && ["admin", "staff"].includes(parsed.userType)) {
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
      userTypes: ["admin", "staff"],
    },
    {
      label: "Orders",
      icon: <PiNotepad size={20} />,
      path: "/admin-orders",
      type: "single",
      permission: "orders",
      userTypes: ["admin", "staff"],
    },
    {
      label: "Customers",
      icon: <PiUsersThree size={20} />,
      path: "/admin-customers",
      type: "single",
      permission: "customers",
      userTypes: ["admin", "staff"],
    },
    {
      path: "/admin-sellers",
      icon: <LiaSellcast size={18} />,
      label: "Sellers",
      type: "single",
      permission: "suppliers",
      userTypes: ["admin", "staff"],
    },
    {
      path: "/admin-technician",
      icon: <LiaSellcast size={18} />,
      label: "Technician",
      type: "single",
      permission: "suppliers",
      userTypes: ["admin", "staff"],
    },
    {
      path: "/product-approve",
      icon: <CgProductHunt size={18} />,
      label: "P-Approve",
      type: "single",
      permission: "p_approve",
      userTypes: ["admin", "staff"],
    },
    {
      path: "/bulk-products",
      icon: <CgProductHunt size={18} />,
      label: "Bulk Products",
      type: "single",
      permission: "bulk_products",
      userTypes: ["admin", "staff"],
    },
    {
      label: "Collection",
      icon: <TbCategory2 size={20} />,
      type: "section",
      key: "categories",
      userTypes: ["admin", "staff"],
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
      userTypes: ["admin", "staff"],
      children: [
        {
          path: "/admin-inquiry",
          icon: <BsQuestionCircle size={18} />,
          label: "Inquiry",
          permission: "inquiries",
        },
        {
          // path: "/all-chatbot-inquiries",
          path: "/admin-chatbot-chat",
          icon: <FaRobot size={18} />,
          label: "Chatbot Inquiries",
          permission: "inquiries",
        },
        {
          path: "/admin-grievances",
          icon: <HiOutlineExclamationCircle size={18} />,
          label: "Grievances",
          permission: "inquiries",
        },
      ],
    },

    {
      label: "Contents",
      icon: <BiMessageAltDetail size={20} />,
      type: "section",
      key: "content",
      userTypes: ["admin", "staff"],
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
        {
          path: "/admin-crousels",
          icon: <MdOutlineLocalOffer size={18} />,
          label: "All Crousels",
          permission: "allOffers",
        },
      ],
    },
    {
      label: "Others",
      icon: <RiGuideFill size={20} />,
      type: "section",
      key: "services",
      userTypes: ["admin", "staff"],
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
    // {
    //   label: "Chatbot Chat",
    //   icon: <FaRobot size={20} />,
    //   path: "/admin-chatbot-chat",
    //   type: "single",
    //   permission: "inquiries",
    //   userTypes: ["admin", "staff"],
    // },
    {
      label: "Staffing",
      icon: <PiUsersThree size={20} />,
      path: "/admin-staff-management",
      type: "single",
      permission: "staffManagement",
      userTypes: ["admin", "staff"],
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
            className={`${location.pathname === item.path
                ? "bg-gradient-to-r from-[#FF8617] to-[#FF6B00] text-white font-medium shadow-lg"
                : "text-white font-normal hover:bg-gray-300 hover:text-gray-800"
              } flex items-center cursor-pointer p-3 text-sm rounded-xl transition-all duration-300 group`}
          >
            <span
              className={`${location.pathname === item.path
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
            className={`${hasActiveChild
                ? "bg-gradient-to-r from-[#FF8617]/10 to-[#FF6B00]/10 text-[#FF8617] font-medium"
                : "text-white font-normal hover:bg-gray-300 hover:text-gray-800"
              } flex items-center cursor-pointer p-3 text-sm rounded-xl transition-all duration-300 group`}
          >
            <span
              className={`${hasActiveChild ? "text-[#FF8617]" : "text-[#FF8617]"
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
                      className={`${location.pathname === child.path
                          ? "bg-gradient-to-r from-[#FF8617] to-[#FF6B00] text-white font-medium shadow-md"
                          : "text-white font-normal hover:bg-gray-300 hover:text-gray-800"
                        } flex items-center cursor-pointer p-2.5 pl-2 text-sm rounded-lg transition-all duration-300 group`}
                    >
                      <span
                        className={`${location.pathname === child.path
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
                onClick={() => navigate("/dashboard")}
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
              className="h-full w-[70%] sm:w-[40%]  bg-gradient-to-b from-[#133a53] to-[#17222a] absolute z-40 shadow-2xl"
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
