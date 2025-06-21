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
  // const categories = [
  //   { name: "Soft Drink / Cold Drink", count: "03 items includes" },
  //   { name: "Soya / Soya Chunks Plant", count: "01 items includes" },
  //   { name: "Food Processing Machine", count: "77 items includes" },
  //   { name: "Filling Machine", count: "04 items includes" },
  //   {
  //     name: "Mineral Water Bottle Filling Machine",
  //     count: "34 items includes",
  //   },
  //   { name: "Fully Automatic Labeling Machine", count: "07 items includes" },
  //   { name: "Industrial Machines", count: "07 items includes" },
  //   { name: "Liquid Filling Machine", count: "08 items includes" },
  //   { name: "Multibead Weight Filter", count: "04 items includes" },
  //   { name: "Shrink Wrapping Machine", count: "03 items includes" },
  //   { name: "120 BPM BOPP Labeling Machine", count: "03 items includes" },
  //   { name: "Hope Bottle Filling", count: "02 items includes" },
  //   { name: "Soft Drink Plant", count: "02 items includes" },
  //   { name: "Reverse Osmosis Plant", count: "03 items includes" },
  //   { name: "Capping Machine", count: "03 items includes" },
  //   { name: "Mineral Water Turnkey Project", count: "03 items includes" },
  //   { name: "Pouch Packing & Sealing Machines", count: "01 items includes" },
  //   { name: "Cup Filling Machine", count: "01 items includes" },
  //   { name: "Mineral Water Pet Bottle Blowing", count: "2 items includes" },
  //   { name: "Pouch Filling Machine", count: "01 items includes" },
  //   { name: "Chapati Making Machine", count: "01 items includes" },
  //   { name: "Pasteurizer Unit", count: "01 items includes" },
  //   { name: "Pet Blow Moulding Machine", count: "01 items includes" },
  //   { name: "Cup Sealing Machine", count: "01 items includes" },
  //   { name: "Mineral Water Laboratory Set Up", count: "01 items includes" },
  //   { name: "Water Software", count: "01 items includes" },
  //   { name: "Automatic Packaging Machines", count: "01 items includes" },
  //   { name: "Juice Filling Machine", count: "2 items includes" },
  //   { name: "Certification", count: "05 items includes" },
  // ];

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
  console.log("Data Is --------------->", data);

  return (
    <div className="bg-gray-50">
      <UserNavbar />
      <header className="bg-slate-700 text-white">
        <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-orange-400">Categories</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto px-4 md:px-6 xl:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {data.map((category, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-2 sm:p-3 bg-white hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex gap-2 sm:gap-3">
                {/* Image Section */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden">
                  <img
                    src={category.imgUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text and Icon Section */}
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
      </main>
      <AllUserFooter />
    </div>
  );
};

export default Categories;
