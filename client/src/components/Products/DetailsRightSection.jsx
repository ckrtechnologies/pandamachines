import React from "react";
import { Play, User } from "lucide-react";

const DetailsRightSection = () => {
  return (
    <div className="space-y-4">
      {/* Video Section */}
      <div className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gray-100 h-32 flex items-center justify-center relative">
          <button className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-xl hover:bg-orange-600">
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </button>
        </div>
      </div>

      {/* Expert Call Section */}
      <div className="bg-white rounded-lg border p-4 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="font-bold text-sm mb-3">
          Talk To Our Expert On Video Call!
        </h3>
        <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform">
          Book Consultation
        </button>
      </div>

      {/* Quote Form */}
      <div className="bg-white rounded-lg border shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="bg-rose-50 p-6 rounded-t-lg">
          <h3 className="text-center font-bold text-base mb-6 text-gray-800">
            Enter Your Details &<br />
            Download Free <span className="text-orange-500">Quotation</span>
          </h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="email"
              placeholder="Email ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <textarea
              placeholder="Address"
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button className="w-full bg-orange-500 text-white py-2 rounded-md text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 transform">
              Download Quotation
            </button>
          </div>
        </div>
      </div>

      {/* Technical Support */}
      <div className="bg-white rounded-lg border p-4 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="font-bold text-sm mb-4 text-gray-800">
          Technical Operators Are Provided
        </h3>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform">
          Book Consultation
        </button>
      </div>
    </div>
  );
};

export default DetailsRightSection;
