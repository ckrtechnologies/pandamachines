import React, { useState } from "react";
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
import logo from "../../Assets/img/Logos/newPMLogo.png";
import TermsCondition from "./TermsCondition";
import { Link } from "react-router-dom";
import SiteGrievanceModal from "../Modals/SiteGrievanceModal";

const AllUserFooter = () => {
  const [openGrievance, setOpenGrievance] = useState(false);
  const userDataFromStorage = localStorage.getItem("pm-user-data");
  // console.log("userDataFromStorage", userDataFromStorage);

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
                <p className="text-base font-semibold">+91 80717 93049</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gradient-to-r from-[#352D41] via-[#203A50] to-[#0D0D18] text-white py-6 px-4 xl:px-6">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* First Column - Logo, Address, Contact, Social */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="">
                  <img className="h-24 w-auto" src={logo} alt="logo" />
                </div>
              </div>

              <div className="text-gray-300 mb-4 tracking-wider">
                Panda Machines Private Limited (OPC) <br /> was founded in 2015
                in Bhubaneswar, Odisha
              </div>

              <div className="space-y-3 font-light tracking-wider">
                <div className="flex items-center capitalize">
                  <FaMapMarkerAlt className="text-[#ff5c02] mr-3" />
                  <span>
                    Labour Tenament,Industrial Estate, Rourkela, Sundargarh, Odisha, 769004
                  </span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-[#ff5c02] mr-3" />
                  <div className="flex flex-col gap-1">

                    <span>+91 9090979740</span>
                    <span>+91 9583146761</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-[#ff5c02] mr-3" />
                  <span>sales.pandamachines@gmail.com</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-orangeAccent transition-colors"
                >
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orangeAccent transition-colors"
                >
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orangeAccent transition-colors"
                >
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orangeAccent transition-colors"
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
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about-us"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    About Us
                  </Link>
                </li>
                {
                  userDataFromStorage && (
                    <li>
                      <Link
                        to="/orders"
                        className="text-gray-300 hover:text-orangeAccent transition-colors"
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      >
                        Orders
                      </Link>
                    </li>
                  )
                }
                <li>
                  <Link
                    to="/blogs"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact-us"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Contact
                  </Link>
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
                  <Link
                    to="/terms-conditions"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Terms & Conditions
                  </Link>
                </li>

                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link
                    to="/return-cancellation"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Return & Cancellation Policy
                  </Link>
                </li>

                <li>
                  <Link
                    to="/shipping-policy"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Shipping Policy
                  </Link>
                </li>

                {/* <li>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Support Center
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    FAQ's
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-300 hover:text-orangeAccent transition-colors"
                    onClick={() => setOpenGrievance(true)}
                  >
                    Site Grievance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <SiteGrievanceModal
        open={openGrievance}
        onClose={() => setOpenGrievance(false)}
      />
    </React.Fragment>
  );
};

export default AllUserFooter;
