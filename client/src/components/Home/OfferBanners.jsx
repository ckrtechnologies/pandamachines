import React from "react";
import bg1 from "../../Assets/Images/Background-1.png";
import bg2 from "../../Assets/Images/Background.png";
import link1 from "../../Assets/Images/Home/Link-0.png";
import link6 from "../../Assets/Images/Home/Link.png";
import link2 from "../../Assets/Images/Home/Link-1.png";
import link3 from "../../Assets/Images/Home/Link-2.png";
import link4 from "../../Assets/Images/Home/Link-3.png";
import link5 from "../../Assets/Images/Home/Link-4.png";

const OfferBanners = () => {
  return (
    <React.Fragment>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6">
        {/* LEFT BANNER */}
        <div
          style={{ backgroundImage: `url(${bg1})` }}
          className="relative rounded-xl p-8 flex flex-col justify-between bg-no-repeat bg-right bg-cover h-64 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-transparent z-0"></div>

          <div className="relative z-10">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3 font-medium">
              LIMITED TIME
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Tech Upgrade <span className="text-blue-600">Deals</span>
            </h3>
            <p className="text-gray-600 max-w-xs">
              Premium gadgets at unbeatable prices. Don't miss out!
            </p>
          </div>

          <div className="relative z-10 mt-4 flex justify-end">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
              SHOP NOW
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-blue-400/20 group-hover:scale-110 transition-transform duration-500"></div>
        </div>

        {/* RIGHT BANNER */}
        <div
          style={{ backgroundImage: `url(${bg2})` }}
          className="relative rounded-xl p-8 flex flex-col justify-between bg-no-repeat bg-right bg-cover h-64 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/80 to-transparent z-0"></div>

          <div className="relative z-10">
            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-3 font-medium">
              NEW ARRIVAL
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="text-orange-600">Widescreen</span> 4K Ultra
            </h3>
            <p className="text-orange-600 font-medium max-w-xs">
              Experience stunning visuals like never before
            </p>
          </div>

          <div className="relative z-10 mt-4 flex justify-end">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
              EXPLORE OFFER
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-orange-400/20 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-orange-400/10 group-hover:opacity-0 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6">
        <div
          style={{ backgroundImage: `url(${bg1})` }}
          className="relative rounded-xl p-8 flex flex-col justify-between bg-no-repeat bg-right bg-cover h-64 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-transparent z-0"></div>

          <div className="relative z-10">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3 font-medium">
              LIMITED TIME
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Tech Upgrade <span className="text-blue-600">Deals</span>
            </h3>
            <p className="text-gray-600 max-w-xs">
              Premium gadgets at unbeatable prices. Don't miss out!
            </p>
          </div>

          <div className="relative z-10 mt-4">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
              SHOP NOW
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-blue-400/20 group-hover:scale-110 transition-transform duration-500"></div>
        </div>

        <div
          style={{ backgroundImage: `url(${bg2})` }}
          className="relative rounded-xl p-8 flex flex-col justify-between bg-no-repeat bg-right bg-cover h-64 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/80 to-transparent z-0"></div>

          <div className="relative z-10">
            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-3 font-medium">
              NEW ARRIVAL
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="text-orange-600">Widescreen</span> 4K Ultra
            </h3>
            <p className="text-orange-600 font-medium max-w-xs">
              Experience stunning visuals like never before
            </p>
          </div>

          <div className="relative z-10 mt-4">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
              EXPLORE OFFER
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-orange-400/20 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-orange-400/10 group-hover:opacity-0 transition-opacity duration-500"></div>
        </div>
      </div> */}

      <div className="pt-16 pb-8 px-4 sm:px-6">
        <div className="flex justify-center items-center gap-12 flex-wrap">
          {/* Logo with hover effects */}
          <div className="group relative">
            <img
              className="h-8 w-auto object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 grayscale group-hover:grayscale-0"
              src={link1}
              alt="Partner logo 1"
            />
            <div className="absolute inset-0 border-b-2 border-transparent group-hover:border-blue-500 transition-all duration-300"></div>
          </div>

          {/* Logo with hover zoom */}
          <div className="group">
            <img
              className="h-8 w-auto object-contain opacity-80 group-hover:opacity-100 transition-transform duration-300 group-hover:scale-110"
              src={link6}
              alt="Partner logo 6"
            />
          </div>

          {/* Logo with subtle shadow */}
          <div className="group">
            <img
              className="h-8 w-auto object-contain opacity-75 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-md"
              src={link2}
              alt="Partner logo 2"
            />
          </div>

          {/* Logo with color pop */}
          <div className="group relative">
            <img
              className="h-8 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
              src={link3}
              alt="Partner logo 3"
            />
            <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/30 rounded-lg transition-all duration-500 -z-10"></div>
          </div>

          {/* Logo with bounce effect */}
          <div className="group">
            <img
              className="h-8 w-auto object-contain opacity-80 group-hover:opacity-100 transition-transform duration-300 group-hover:-translate-y-1"
              src={link4}
              alt="Partner logo 4"
            />
          </div>

          {/* Logo with subtle rotation */}
          <div className="group">
            <img
              className="h-8 w-auto object-contain opacity-75 group-hover:opacity-100 transition-transform duration-500 group-hover:rotate-3"
              src={link5}
              alt="Partner logo 5"
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OfferBanners;
