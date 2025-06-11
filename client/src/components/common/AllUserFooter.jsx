import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import logo from "../../Assets/Logos/PMHorrLogo.png";
import TermsCondition from "./TermsCondition";

const AllUserFooter = () => {
  return (
    <React.Fragment>
      <TermsCondition />
      
      <div className="hidden sm:block bg-[#00395F] text-white py-6 px-4 sm:px-8 rounded-t-2xl mx-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left - Text Section */}
          <div className="text-center lg:text-left tracking-wide">
            <h2 className="text-xl sm:text-2xl font-bold">
              We Are Ready To <span className="text-[#FF8617]">Help</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-200 mt-1">
              For information consult with our expert members
            </p>
          </div>

          {/* Middle - Quote Button */}
          <div className="flex items-center gap-4">
            <button className="bg-[#FFB400] hover:bg-[#ffa000] text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-md flex items-center gap-2 transition">
              Get Free Quote <FaArrowRight />
            </button>

            {/* Hotline */}
            <div className="flex items-center gap-3 text-left">
              <div className="bg-white text-[#00395F] p-3 rounded-full">
                <FaPhone />
              </div>
              <div>
                <p className="text-xs text-gray-300">Hotline</p>
                <p className="text-base font-semibold">+91 6372 833 928</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gradient-to-r from-[#352D41] via-[#203A50] to-[#0D0D18] text-white py-10 px-4 xl:px-6">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* First Column - Logo, Address, Contact, Social */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="">
                  <img className="h-20 w-auto" src={logo} alt="logo" />
                </div>
              </div>

              <div className="text-gray-300 mb-4 tracking-wider">
                Panda Machines Private Limited (OPC) <br /> was founded in 2015
                in Bhubaneswar, Odisha
              </div>

              <div className="space-y-2 font-light tracking-wider">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-[#ff5c02] mr-3" />
                  <span>
                    784/2647, 3rd Floor, Jagamara, Bhubaneswar - 751030
                  </span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-[#ff5c02] mr-3" />
                  <span>+91 80717 93049</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-[#ff5c02] mr-3" />
                  <span>info@pandamachines.com</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                >
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                >
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                >
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                >
                  <FaLinkedin className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Second Column - Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-blue-600 pb-2 inline-block tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-2 tracking-wide">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    Orders
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    Blogs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    Categories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Third Column - More Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-blue-600 pb-2 inline-block tracking-wide">
                Resources
              </h3>
              <ul className="space-y-2 tracking-wide">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    Return & Cancellation Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    Support Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#ff5c02] transition-colors"
                  >
                    FAQ's
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default AllUserFooter;
