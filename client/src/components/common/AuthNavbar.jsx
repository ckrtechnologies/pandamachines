import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Assets/Logos/PMHorrLogo.png";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "./AuthNavbar.css";

const AuthNavbar = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown area

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleLogoClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen((prevState) => !prevState);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <React.Fragment>
      <nav className="bg-gradient-to-r from-[#1b5881] to-[#00395F] shadow-lg fixed top-0 w-full px-3 py-1.5 text-[black] z-50">
        <div className="px-3 mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-4">
              <img
                src={logo}
                alt="No Images"
                className="h-12 md:h-14 w-auto cursor-pointer"
                onClick={handleLogoClick}
              />
            </div>
          </div>

          <div className="flex items-center relative" ref={dropdownRef}>
            <button
              id="dropdownDefaultButton"
              onClick={toggleDropdown}
              className="flex items-center"
              type="button"
            >
              <div className="">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdMvFM1wG22ZDfXTNICScHu4jfA5_qhKZYcQBXfh-sZ9vdqw_JCwL_MF__dK2a1ZrDPFI&usqp=CAU"
                  alt="Profile"
                  className="w-12 h-12 object-cover rounded-full mr-2 border"
                />
              </div>

              <svg
                className={`w-3 h-3 ms-1 transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="white"
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







// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../../Assets/Logos/PMHorrLogo.png";
// import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
// import "./AuthNavbar.css";

// const AuthNavbar = ({ setIsSidebarOpen }) => {
//   const navigate = useNavigate();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleLogoClick = () => {
//     if (window.innerWidth < 1024) {
//       // Only toggle sidebar on mobile screens
//       setIsSidebarOpen((prevState) => !prevState);
//     }
//   };

//   return (
//     <React.Fragment>
//       <nav className="bg-gradient-to-r from-[#1b5881] to-[#00395F] shadow-lg fixed top-0 w-full px-3 py-1.5 text-[black] z-50">
//         <div className="px-3 mx-auto flex justify-between items-center">
//           <div className="flex items-center">
//             <div className="mr-4">
//               <img
//                 src={logo}
//                 alt="No Images"
//                 className="h-12 md:h-14 w-auto cursor-pointer"
//                 onClick={handleLogoClick}
//               />
//             </div>
//           </div>

//           <div className="flex items-center">
//             <button
//               id="dropdownDefaultButton"
//               onClick={toggleDropdown}
//               className="flex items-center"
//               type="button"
//             >
//               <div className="">
//                 <img
//                   src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdMvFM1wG22ZDfXTNICScHu4jfA5_qhKZYcQBXfh-sZ9vdqw_JCwL_MF__dK2a1ZrDPFI&usqp=CAU"
//                   alt="Profile"
//                   className="w-12 h-12 object-cover rounded-full mr-2 border"
//                 />
//               </div>

//               <svg
//                 className={`w-3 h-3 ms-1 transform ${
//                   isDropdownOpen ? "rotate-180" : ""
//                 }`}
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 10 6"
//               >
//                 <path
//                   stroke="white"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m1 1 4 4 4-4"
//                 />
//               </svg>
//             </button>

//             {/* Dropdown menu */}
//             {isDropdownOpen && (
//               <div className="z-10 absolute mt-[150px] ml-[-100px] bg-white divide-y divide-primaryColor rounded-lg shadow w-44">
//                 <ul className="py-2 text-sm text-primaryTextColor">
//                   <li>
//                     <Link
//                       to="/profile"
//                       onClick={toggleDropdown}
//                       className="cursor-pointer flex items-center px-4 py-2 hover:bg-primaryFadedColor hover:text-white hover:font-semibold tracking-wider text-center"
//                     >
//                       <FaUserCircle className="mr-2" size={16} />
//                       Profile
//                     </Link>
//                   </li>
//                   <li>
//                     <div
//                       onClick={() => {
//                         handleLogout();
//                         toggleDropdown();
//                       }}
//                       className="cursor-pointer flex items-center px-4 py-2 hover:bg-primaryFadedColor hover:text-white hover:font-semibold tracking-wider text-center"
//                     >
//                       <FaSignOutAlt className="mr-2" size={16} />
//                       Sign out
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>
//     </React.Fragment>
//   );
// };

// export default AuthNavbar;
