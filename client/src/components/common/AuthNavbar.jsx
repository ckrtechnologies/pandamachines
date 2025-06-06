import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Assets/Logos/d-logo.png";
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { PiUserCircleDuotone } from "react-icons/pi";
import './AuthNavbar.css';

const AuthNavbar = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoClick = () => {
    if (window.innerWidth < 1024) {
      // Only toggle sidebar on mobile screens
      setIsSidebarOpen(prevState => !prevState);
    }
  };

  return (
    <React.Fragment>
      <nav className="bg-[#FFFFFF] shadow-lg fixed top-0 w-full p-3 text-[black] z-50">
        <div className="px-3 mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-4">
              <img
                src={logo}
                alt="No Images"
                className="h-10 w-auto cursor-pointer"
                onClick={handleLogoClick}
              />
            </div>
          </div>

          <div className="flex items-center">
            <button
              id="dropdownDefaultButton"
              onClick={toggleDropdown}
              className="flex items-center"
              type="button"
            >
              <div className="relative">
                <svg width="0" height="0">
                  <linearGradient id="icon-gradient" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop stopColor="currentColor" className="text-primaryColor" offset="0%" />
                    <stop stopColor="currentColor" className="text-primaryTextColor" offset="100%" />
                  </linearGradient>
                </svg>
                <PiUserCircleDuotone
                  size={48}
                  style={{
                    fill: "url(#icon-gradient)",
                  }}
                />
              </div>

              <svg
                className={`w-3 h-3 ms-1 transform ${isDropdownOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="z-10 absolute mt-[150px] ml-[-100px] bg-white divide-y divide-primaryColor rounded-lg shadow w-44">
                <ul className="py-2 text-sm text-primaryTextColor">
                  <li>
                    <Link
                      to="/profile"
                      onClick={toggleDropdown}
                      className="cursor-pointer flex items-center px-4 py-2 hover:bg-primaryFadedColor hover:text-white hover:font-semibold tracking-wider text-center"
                    >
                      <FaUserCircle className="mr-2" size={16} />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleLogout();
                        toggleDropdown();
                      }}
                      className="cursor-pointer flex items-center px-4 py-2 hover:bg-primaryFadedColor hover:text-white hover:font-semibold tracking-wider text-center"
                    >
                      <FaSignOutAlt className="mr-2" size={16} />
                      Sign out
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default AuthNavbar;