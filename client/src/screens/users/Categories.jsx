import React, { useEffect, useState } from "react";
import { Home, ChevronRight } from "lucide-react";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import AllUserFooter from "../../components/common/AllUserFooter";
import UserNavbar from "../../components/common/UserNavbar";
import axios from "axios";

const Categories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${REACT_APP_API_URL}/categories/get-all-categories`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50">
      <UserNavbar />
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="py-6 px-4 xl:px-6">
          <nav className="flex items-center">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-1.5">
              <a href="/" className="flex items-center group" aria-label="Home">
                <span className="p-1.5 rounded-lg bg-slate-700 group-hover:bg-slate-600 transition-all duration-200">
                  <Home className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </span>
              </a>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="px-3 py-1.5 rounded-lg bg-slate-700 text-orange-400 font-medium">
                Categories
              </span>
            </div>

            {/* Right side elements */}
            <div className="ml-auto flex items-center space-x-4">
              <span className="hidden md:inline-flex items-center px-3 py-1 tracking-wide rounded-full text-sm font-medium bg-slate-700/50 text-orange-400">
                12 Categories
              </span>
            </div>
          </nav>

          {/* Title section */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-wide text-white sm:text-4xl">
              Explore Our Categories
            </h1>
            <div className="mt-3 max-w-3xl">
              <p className="text-md font-medium tracking-wide text-slate-300">
                Discover our carefully curated collection organized into
                intuitive categories
              </p>
            </div>
          </div>

          {/* Optional decorative element */}
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
        </div>
      </header>

      <main className="mx-auto px-4 md:px-6 xl:px-6 py-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {[1, 2, 3, 4, 5, 6, 4, 5, 6, 4, 5, 6].map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-2 sm:p-3 bg-white animate-pulse"
              >
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded"></div>

                  <div className="flex flex-col justify-between flex-1 space-y-2">
                    <div>
                      <div className="h-4 w-28 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 w-40 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {data.map((category, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-2 sm:p-3 bg-white hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden">
                    <img
                      src={category.imgUrl}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-sm sm:text-base font-semibold text-blue-900 leading-tight mb-1">
                        {category.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-orange-500 leading-snug line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex justify-start">
                      <IoIosArrowDroprightCircle
                        size={22}
                        className="text-gray-600 hover:text-orange-500 cursor-pointer transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AllUserFooter />
    </div>
  );
};

export default Categories;