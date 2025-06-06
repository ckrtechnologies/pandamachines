import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import {
  FaUserTie,
  FaFileSignature,
  FaTools,
  FaShippingFast,
  FaHeadset,
  FaTags,
} from "react-icons/fa";
import { RiGuideFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const UsersBottomNav = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const UserOption = ({ icon, text }) => (
    <button
      type="button"
      className="flex items-center gap-3 text-gray-700 hover:text-primaryColor transition text-sm font-semibold tracking-wide focus:outline-none"
    >
      <span className="text-primaryColor">{icon}</span>
      <span>{text}</span>
    </button>
  );

  return (
    <>
      {/* Bottom Nav */}
      <div className="flex w-full bottom-0 left-0 bg-white border-t shadow-md px-4 xl:px-10 py-1 items-center md:justify-between justify-end z-50">
        {/* Left side: 7 options */}
        <div className="hidden md:flex flex-wrap gap-3 text-sm font-medium text-gray-700">
          <button className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-blue-100 hover:text-blue-600 rounded transition">
            <RiGuideFill size={14} />
            Consult A Guidance
          </button>

          <button className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-green-100 hover:text-green-600 rounded transition">
            <FaFileSignature si4e={16} />
            Request For Quotation
          </button>

          <button
            onClick={() => navigate("become-seller")}
            className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-teal-100 hover:text-teal-600 rounded transition"
          >
            <FaUserTie size={16} />
            Become a Seller
          </button>

          <button className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-yellow-100 hover:text-yellow-600 rounded transition">
            <FaTools size={14} />
            Technician Operator
          </button>

          <button className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-purple-100 hover:text-purple-600 rounded transition">
            <FaShippingFast siz4={16} />
            Track Your Order
          </button>

          <button className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-red-100 hover:text-red-600 rounded transition">
            <FaHeadset size={14} />
            Customer Support
          </button>

          <button className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-pink-100 hover:text-pink-600 rounded transition">
            <FaTags size={14} />
            Offers
          </button>
        </div>

        {/* Right side: Menu Icon */}
        <button onClick={toggleSidebar} className="text-2xl text-gray-700">
          <FiMenu />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
      `}
        style={{ maxWidth: "16rem" }} // 64 = 16rem
      >
        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 tracking-wide">
            Menu
          </h2>
          <button
            onClick={toggleSidebar}
            className="text-2xl text-gray-700 hover:text-red-600 transition"
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        {/* Main Links */}
        <nav className="p-6 flex flex-col gap-6 text-gray-700 font-medium text-base">
          {["Home", "Shodiv", "Blog", "Contacts"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-primaryColor transition-colors cursor-pointer"
              onClick={toggleSidebar}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <hr className="mx-6 border-gray-200" />

        {/* User Options Heading */}
        <div className="px-6 py-2 text-sm font-semibold text-gray-600 tracking-wide uppercase">
          User Options
        </div>

        {/* User Options List */}
        <div className="px-6 flex flex-col gap-5 text-gray-700">
          <UserOption icon={<RiGuideFill />} text="Consult A Guidance" />
          <UserOption icon={<FaFileSignature />} text="Request For Quotation" />
          <UserOption icon={<FaTools />} text="Technician Operator" />
          <UserOption icon={<FaShippingFast />} text="Track Your Order" />
          <UserOption icon={<FaHeadset />} text="Customer Support" />
          <UserOption icon={<FaTags />} text="Offers" />
        </div>
      </div>
    </>
  );
};

export default UsersBottomNav;
