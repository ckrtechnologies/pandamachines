import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const ProfileDropdown = ({ handleLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="p-2 bg-gray-200 rounded">
        Toggle Dropdown
      </button>

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
  );
};

export default ProfileDropdown;
