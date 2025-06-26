import React, { useEffect, useState } from "react";
import { Home, ChevronRight } from "lucide-react";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import AllUserFooter from "../../components/common/AllUserFooter";
import UserNavbar from "../../components/common/UserNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Categories = ({}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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
  // console.log("Data Is --------------->", data);

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
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {data.map((category, index) => (
              <div
                key={index}
                onClick={() => navigate(`/products-list/${category._id}`)}
                className="cursor-pointer border p-3 bg-white rounded-lg hover:shadow-lg hover:scale-[1.01] transition-all"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded overflow-hidden group">
                    <img
                      src={category.imgUrl || "/placeholder.jpg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-base font-semibold text-blue-900 mb-1">
                        {category.name}
                      </h2>
                      <p className="text-sm text-orange-500 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                    <IoIosArrowDroprightCircle
                      size={24}
                      className="text-gray-600 hover:text-orange-500 transition-colors"
                    />
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
