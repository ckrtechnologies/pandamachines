import React from "react";
import callCenter from "../../Assets/img/common/callCenter.png";
import { useNavigate } from "react-router-dom";

const DetailsRightSection = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4 lg:col-span-3">
      {/* Video Section */}
      <div className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="bg-gray-100 h-72 flex items-center justify-center relative">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/fnfkV_MaLr0?si=YaajTwkMA7Z0R68y"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        </div>
      </div>

      {/* Quote Form */}
      <div className="bg-white rounded-lg border shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="bg-rose-50 p-6 rounded-lg">
          <h3 className="text-center font-semibold text-sm md:text-lg mb-3">
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
            <div className="flex justify-center items-center w-full">
              <button className="bg-orange-500 tracking-wide font-bold text-white px-4 py-2 rounded text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform">
                Download Quotation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Call Section */}
      <div className="bg-white rounded-lg border p-4 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="rounded-full mx-auto mb-3 flex justify-center">
          <img
            src={callCenter}
            alt="callCenter"
            className="h-16 md:h-20 w-auto object-contain"
          />
        </div>
        <h3 className="font-semibold text-sm md:text-lg mb-3">
          Talk To Our Expert On <br /> Video Call...!
        </h3>
        <button
          className="bg-orange-500 tracking-wide font-bold text-white px-4 py-2 rounded text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
          onClick={() => {
            navigate("/consult-guidance");
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          Book Consultation
        </button>
      </div>
    </div>
  );
};

export default DetailsRightSection;
