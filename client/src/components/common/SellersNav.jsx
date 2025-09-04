import React, { useState, useEffect } from "react";
import pmLogo from "../../Assets/img/Logos/newPMLogo.png";
import {
  FaFileSignature,
  FaTools,
  FaShippingFast,
  FaTags,
  FaUserTie,
} from "react-icons/fa";
import { RiGuideFill, RiMapPinUserFill } from "react-icons/ri";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { FiUser, FiChevronRight, FiX, FiMenu } from "react-icons/fi";
import { LiaTimesCircleSolid } from "react-icons/lia";
import { TbUserPentagon } from "react-icons/tb";
import { CgMenuRight } from "react-icons/cg";
import { IoLogIn } from "react-icons/io5";
import SupplierRegister from "../../screens/nonAuth/Supplier/SupplierRegister";

const SellersNav = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleRegisterClick = () => {
    setIsModalOpen(true);
    setMenuOpen(false); // Close mobile menu if open
  };

  return (
    <>
      <nav className="w-full bg-[#FFFFFF] shadow-md px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center w-full justify-between sm:w-auto">
            <img
              onClick={() => navigate("/")}
              className="h-12 sm:h-16 w-auto object-contain cursor-pointer"
              src={pmLogo}
              alt="pm-Logo"
            />

            <div className="flex items-center gap-4">
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

              <button
                onClick={toggleSidebar}
                className="block sm:hidden text-2xl text-gray-700"
              >
                <CgMenuRight />
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <NavButton
              label="Register"
              icon={<RiMapPinUserFill size={22} />}
              onClick={handleRegisterClick}
            />

            <NavButton label="Seller's Login" icon={<IoLogIn size={22} />} />

            <button onClick={toggleSidebar} className="text-2xl text-gray-700">
              <CgMenuRight />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden flex flex-col gap-4 mt-2 pb-4 border-t pt-4">
            <NavButton
              label="Register"
              icon={<TbUserPentagon size={22} />}
              onClick={handleRegisterClick}
            />

            <NavButton label="Seller's Login" icon={<IoLogIn size={22} />} />
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
                {
                  icon: <RiGuideFill className="text-blue-500" />,
                  text: "Consult A Guidance",
                  path: "/consult-guidance",
                },
                {
                  icon: <FaFileSignature className="text-green-500" />,
                  text: "Request For Quotation",
                },
                {
                  icon: <FaTools className="text-orange-500" />,
                  text: "Technical Operator",
                  path: "/technical-operator",
                },
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
              ].map((option, index) => (
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

      {/* Modal placed outside sidebar - MOVED HERE */}
      <SupplierRegister
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

const NavButton = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 py-3 text-[#00395F] hover:text-[#FF8617] text-[15px]"
  >
    {icon}
    {label}
  </button>
);

export default SellersNav;
