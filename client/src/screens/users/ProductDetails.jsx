import React from "react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import { FaStar, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { RiInstagramLine, RiHandbagFill } from "react-icons/ri";
import { IoDocumentText } from "react-icons/io5";

const ProductDetails = () => {
  return (
    <div className="bg-rose-50 min-h-screen flex flex-col">
      <UserNavbar />

      <div className="flex-1 py-6 px-4 md:px-6 max-w-4xl mx-auto w-full">
        {/* Product Card */}
        <div className=" rounded-xl shadow-lg overflow-hidden">
          {/* Top Section - Product Image and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6 p-4 border-b">
            {/* Left: Image */}
            <div className="md:w-2/5">
              <img
                src="https://plus.unsplash.com/premium_photo-1681426673022-db3d911ea11a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="RO Plant"
                className="w-full h-auto object-contain rounded-lg border"
              />
              <div className="flex gap-2 mt-4 flex-wrap">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-16 h-16 bg-gray-200 rounded-md"
                  ></div>
                ))}
              </div>
            </div>

            {/* Right: Basic Details */}
            <div className="md:w-3/5">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Industrial Soda Bottle Filling Machine
              </h2>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={16} />
                  ))}
                </div>
                <span className="ml-2">4 Reviews</span>
              </div>
              <div className="flex items-center pb-4 gap-4 mb-4 border-b border-gray-300">
                <p className="text-xl font-bold text-[#481400]">
                  80,000 INR/Unit
                </p>
                <span className="text-xs text-[#EA4B48] bg-[#EA4B481A] px-3 py-1 rounded-full font-medium">
                  64% off
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Brand:</span>
                  <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-500" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Share:</span>
                  <FaWhatsapp
                    className="text-green-500 cursor-pointer"
                    size={18}
                  />
                  <FaFacebookF
                    className="text-blue-600 cursor-pointer"
                    size={18}
                  />
                  <RiInstagramLine
                    className="text-pink-600 cursor-pointer"
                    size={18}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-6">
                The Industrial Soda Bottle Filling Machine is an automatic grade
                machine with a control system operated through a human machine
                interface. Made of durable metal, this machine is designed to
                provide lower energy consumption and high efficiency in filling
                soda bottles.
              </p>
              <div className="flex items-center gap-4 flex-wrap mb-4 border-b border-gray-300 pb-4">
                <div className="flex items-center border border-gray-300 rounded-full px-2 py-1">
                  <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                    -
                  </button>
                  <span className="px-3 py-1 text-gray-700">01</span>
                  <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                    +
                  </button>
                </div>

                <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full">
                  Add to Cart
                  <RiHandbagFill size={18} />
                </button>

                <button className="bg-white border border-gray-300 rounded-full text-gray-700 px-6 py-2">
                  Buy Now
                </button>

                <IoDocumentText size={28} className="text-blue-900" />
              </div>
              <div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">Catagories:&nbsp;</span>
                  <span className="text-sm text-gray-900">Ro Plant</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">Catagories:&nbsp;</span>
                  <span className="text-sm text-gray-900">Ro Plant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Detailed Information */}
          <div className="p-6">
            <div className="flex flex-col   items-start  mb-6">
              <div className="flex border justify-center border-gray-200 bg-white rounded-md w-full mt-6 mb-8">
                <button className="px-4 py-3 font-medium text-gray-600 hover:text-orange-600 relative group">
                  <span className="relative">
                    Specifications
                    <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </button>

                <button className="px-4 py-3 font-medium text-gray-600 hover:text-orange-600 relative group">
                  <span className="relative">
                    Additional Info
                    <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </button>

                <button className="px-4 py-3 font-medium text-gray-600 hover:text-orange-600 relative group">
                  <span className="relative">
                    Reviews
                    <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                    <span className="absolute -top-2 -right-5 bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded-full">
                      4
                    </span>
                  </span>
                </button>
              </div>
              <p className="text-medium text-gray-700 mb-6">
                The Industrial Soda Bottle Filling Machine is an automatic grade
                machine with a control system operated through a human machine
                interface. Made of durable metal, this machine is designed to
                provide lower energy consumption and high efficiency in filling
                soda bottles.
              </p>
              <h2 className="text-xl font-bold text-gray-800">
                Product Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* Product Specifications */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Technical Specifications
                </h3>
                <ul className="space-y-2">
                  <li className="flex gap-4 border-b pb-2">
                    <span className="text-gray-600">Warranty-</span>
                    <span className="text-gray-800">Yes</span>
                  </li>
                  <li className="flex gap-4 border-b pb-2">
                    <span className="text-gray-600">Automatic Grade-</span>
                    <span className="text-gray-800">Automatic</span>
                  </li>
                  <li className="flex gap-4 border-b pb-2">
                    <span className="text-gray-600">Control System-</span>
                    <span className="text-gray-800">
                      Human Machine Interface
                    </span>
                  </li>
                  <li className="flex gap-4 border-b pb-2">
                    <span className="text-gray-600">Material-</span>
                    <span className="text-gray-800">Metal</span>
                  </li>
                  <li className="flex gap-4 border-b pb-2">
                    <span className="text-gray-600">Energy Efficiency-</span>
                    <span className="text-gray-800">High</span>
                  </li>
                </ul>
              </div>

              {/* Trade Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Order Information
                </h3>
                <ul className="space-y-2">
                  <li className="flex gap-4 border-b pb-2">
                    <span className="text-gray-600">Payment Terms-</span>
                    <span className="text-gray-800">Cash Advance (CA)</span>
                  </li>
                  <li className="flex gap-4 border-b pb-2">
                    <span className="text-gray-600">Delivery Time-</span>
                    <span className="text-gray-800">20 Days</span>
                  </li>
                  <li className="flex gap-4 border-b pb-2">
                    <span className="text-gray-600">Supply Capacity-</span>
                    <span className="text-gray-800">10 Units/Month</span>
                  </li>
                  <li className="flex gap-4 border-b pb-2">
                    <span className="text-gray-600">Domestic Market-</span>
                    <span className="text-gray-800">All India</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AllUserFooter />
    </div>
  );
};

export default ProductDetails;
