import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu4Line, RiDashboardLine } from "react-icons/ri";
import { IoClose, IoGridOutline } from "react-icons/io5";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const path = useLocation();

  // const userData = JSON.parse(localStorage.getItem("carRental-userData"));
  // const permissions = userData?.permissions || {};

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Define menu items with corresponding permissions
  const menuItems = [
    { label: "Dashboard", icon: <RiDashboardLine size={18} />, path: "/dashboard", permission: "dashboard" },
    { label: "Bookings", icon: <IoGridOutline size={18} />, path: "/bookings", permission: "bookings" },
  ];

  // Filter menu items based on permissions
  // const filteredMenuItems = menuItems.filter((item) => permissions[item.permission]);

  const renderMenuItems = () => (
    <ul className="space-y-1 tracking-wide">
      {menuItems.map((item) => (
        <li key={item.path}>
          <div
            onClick={() => navigate(item.path)}
            className={`${path.pathname === item.path
                ? "bg-primaryColor text-white font-medium"
                : "text-primaryTextColor font-normal hover:bg-secondaryTextColor"
              } flex items-center cursor-pointer p-2 text-base rounded-lg mt-3`}
          >
            {item.icon}
            <span className="ml-3 tracking-wide">{item.label}</span>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <React.Fragment>
      {/* Large sidebar */}
      <div className="lg:contents hidden flex-shrink-0" aria-label="Sidebar">
        <div className="overflow-y-auto pb-2 px-3 pt-6 bg-[#FFFFFF] shadow-2xl h-screen">
          {renderMenuItems()}
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="block lg:hidden">
        <button
          onClick={toggleSidebar}
          className="absolute ml-6 mt-[-50px] text-white"
        >
          {isSidebarOpen ? <IoClose size={30} /> : <RiMenu4Line size={30} />}
        </button>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              className="h-full w-[50%] absolute z-50 shadow-2xl"
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.3 }}
            >
              <div className="overflow-y-auto py-4 px-3 bg-[#FFFFFF] h-screen relative">
                {renderMenuItems()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;