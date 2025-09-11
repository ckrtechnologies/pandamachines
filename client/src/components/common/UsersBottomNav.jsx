import React, { useState, useEffect } from "react";
import { FiChevronRight, FiMenu, FiUser, FiX } from "react-icons/fi";
import {
  FaUserTie,
  FaFileSignature,
  FaTools,
  FaShippingFast,
  FaTags,
} from "react-icons/fa";
import { RiGuideFill } from "react-icons/ri";
import { CgMenuRight } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const UsersBottomNav = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Prevent body scrolling when sidebar is open
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about-us" },
    { name: "Blog", path: "/blogs" },
    { name: "Contact", path: "/contact-us" },
    { name: "Categories", path: "/categories" },
  ];

  const sidebarLinks = [
    {
      icon: <RiGuideFill className="text-blue-500" />,
      text: "Consult A Guidance",
      path: "/consult-guidance",
    },
    {
      icon: <FaFileSignature className="text-green-500" />,
      text: "Request For Quotation",
    },
    // {
    //   icon: <FaTools className="text-orange-500" />,
    //   text: "Technical Operator",
    //   path: "/technical-operator",
    // },
    {
      icon: <FaUserTie className="text-teal-500" />,
      text: "Become a Seller",
      path: "/become-seller",
    },
    {
      icon: <FaShippingFast className="text-purple-500" />,
      text: "Track Order",
    },
    {
      icon: <FaTags className="text-yellow-500" />,
      text: "Offers",
    },
  ];

  return (
    <div className="w-full shadow-md border-b bg-[#F3F3F3] relative z-10">
      <div className="flex w-full bottom-0 left-0 bg-[#F3F3F3] border-t px-4 xl:px-6 py-1 items-center md:justify-between justify-end">
        <div className="hidden md:flex flex-wrap gap-1 text-sm font-medium text-gray-700">
          <button
            onClick={() => navigate("/consult-guidance")}
            className="text-sm flex items-center gap-1 px-2 py-1 hover:bg-blue-100 hover:text-blue-600 rounded transition"
          >
            <RiGuideFill size={14} />
            Consult A Guidance
          </button>

          <button className="text-sm flex items-center gap-1 px-2 py-1 hover:bg-green-100 hover:text-green-600 rounded transition">
            <FaFileSignature size={14} />
            Request For Quotation
          </button>

          {/* <button
            onClick={() => navigate("/become-seller")}
            className="text-sm flex items-center gap-1 px-2 py-1 hover:bg-teal-100 hover:text-teal-600 rounded transition"
          >
            <FaUserTie size={14} />
            Become a Seller
          </button> */}

          {/* <button
            onClick={() => navigate("/technical-operator")}
            className="text-sm flex items-center gap-1 px-2 py-1 hover:bg-yellow-100 hover:text-yellow-600 rounded transition"
          >
            <FaTools size={12} />
            Technical Operator
          </button> */}

          <button
            className="text-sm flex items-center gap-1 px-2 py-1 hover:bg-purple-100 hover:text-purple-600 rounded transition"
            onClick={() => navigate("/user-orders")}
          >
            <FaShippingFast siz4={16} />
            Track Order
          </button>

          <button className="text-sm flex items-center gap-1 px-2 py-1 hover:bg-pink-100 hover:text-pink-600 rounded transition">
            <FaTags size={12} />
            Offers
          </button>
        </div>

        <button onClick={toggleSidebar} className="text-2xl text-gray-700">
          <CgMenuRight />
        </button>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header with close button */}
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

        {/* Main Navigation */}
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          <nav className="px-4 py-2 flex flex-col gap-1">
            {navLinks?.map((item, index) => (
              <div
                key={index}
                className="px-4 py-1.5 cursor-pointer rounded-lg hover:bg-primaryColor/10 hover:text-primaryColor transition-all flex items-center gap-3 group"
                onClick={() => {
                  toggleSidebar();
                  navigate(item?.path);
                }}
              >
                <span className="text-primaryColor opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiChevronRight size={14} />
                </span>
                <span className="text-md font-medium text-gray-700 group-hover:font-semibold">
                  {item?.name}
                </span>
              </div>
            ))}
          </nav>

          {/* Divider */}
          <div className="relative my-2 h-px mx-5 bg-gray-200"></div>

          {/* User Options Section */}
          <div className="px-5 py-3">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 tracking-wider uppercase flex items-center gap-2">
              <FiUser className="text-gray-400" />
              <span>User Options</span>
            </div>

            {/* User Options List */}
            <div className="mt-2 space-y-1">
              {sidebarLinks?.map((option, index) => (
                <div
                  key={index}
                  onClick={() => option.path && navigate(option.path)}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span className="p-2 bg-white rounded-lg shadow-sm">
                    {option.icon}
                  </span>
                  <span className="font-medium text-gray-700">
                    {option.text}
                  </span>
                  <span className="ml-auto text-gray-400">
                    <FiChevronRight />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersBottomNav;
