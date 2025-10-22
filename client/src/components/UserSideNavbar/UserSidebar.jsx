import React, { useState } from "react";
import { FiMenu, FiX, FiChevronRight, FiUser } from "react-icons/fi";
import { RiGuideFill } from "react-icons/ri";
import {
  FaFileSignature,
  FaTools,
  FaUserTie,
  FaShippingFast,
  FaTags,
} from "react-icons/fa";
import Quotation from "../../screens/users/Quotation";

const UserSidebar = ({ isSidebarOpen, toggleSidebar, navigate }) => {
  const [QuotationUpon, setQuotationUpon] = useState(false);
  const isLoggedIn = !!localStorage.getItem("pm-user-data");
  const mainMenuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about-us" },
    { name: "Blog", path: "/blogs" },
    { name: "Contact", path: "/contact-us" },
    { name: "Categories", path: "/categories" },
  ];

  const userOptions = [
    {
      icon: <RiGuideFill className="text-blue-500" />,
      text: "Online Consultation",
      path: "/consult-guidance",
    },
    {
      icon: <FaFileSignature className="text-green-500" />,
      text: "Request For Quotation",
      onClick: () => setQuotationUpon(true),
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
    ...(isLoggedIn
      ? [
          {
            icon: <FaShippingFast className="text-purple-500" />,
            text: "Track Order",
            path: "/user-orders",
          },
        ]
      : []),
    {
      icon: <FaTags className="text-yellow-500" />,
      text: "Offers",
      path: "/offers",
    },
  ];

  return (
    <>
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
            {mainMenuItems.map((item, index) => (
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
              {userOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (option.onClick) {
                      option.onClick();
                      toggleSidebar();
                    } else if (option.path) {
                      navigate(option.path);
                      toggleSidebar();
                    }
                  }}
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
      {QuotationUpon && <Quotation onClose={() => setQuotationUpon(false)} />}
    </>
  );
};

export default UserSidebar;
