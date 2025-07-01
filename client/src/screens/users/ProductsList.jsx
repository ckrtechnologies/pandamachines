import React, { useEffect, useState } from "react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import FilterSection from "../../components/Products/FilterSection";
import ProductCards from "../../components/Products/ProductCards";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronDown } from "lucide-react";

const ProductsList = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subCatResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/sub-categories/get-all-sub-categories`
        );
        setSubCategories(subCatResponse.data);

        if (id) {
          const foundSubCategory = subCatResponse.data.find(
            (subCat) => subCat._id === id
          );
          setSelectedSubCategory(foundSubCategory);

          const productsResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/products/products-by-sub-category/${id}`
          );
          setProducts(productsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <React.Fragment>
      <UserNavbar />

      {loading ? (
        FilterSidebarSkeleton()
      ) : (
        <div className="flex flex-col md:flex-row bg-[#F2F7FF] px-4 xl:px-6 py-4 md:py-6 gap-4 md:gap-6">
          <FilterSection
            subCategories={subCategories}
            selectedSubCategoryId={id}
          />
          <ProductCards products={products} subCategory={selectedSubCategory} />
        </div>
      )}

      <AllUserFooter />
    </React.Fragment>
  );
};

export default ProductsList;

const FilterSidebarSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row bg-[#F2F7FF] px-4 xl:px-6 py-4 md:py-6 gap-4 md:gap-6">
      <div className="relative animate-pulse">
        {/* Mobile filter button skeleton */}
        <div className="lg:hidden p-4">
          <div className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white rounded-md font-semibold">
            <span className="h-4 bg-gray-300 rounded w-16"></span>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="block lg:block">
          <div className="w-full lg:w-64 bg-white hover:shadow-md rounded-lg lg:rounded-none">
            {/* Filter header skeleton */}
            <div className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white px-4 py-3 rounded-t-lg lg:rounded-t-none">
              <div className="flex items-center justify-between w-full text-left">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            </div>

            {/* Categories skeleton list */}
            <div className="border-b border-gray-200">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {/* Category item skeleton */}
                  <div className="px-4 py-3 text-gray-800 flex justify-between items-center">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-3 w-3 bg-gray-300 rounded"></div>
                  </div>

                  {/* Subcategories skeleton dropdown */}
                  <div className="overflow-hidden max-h-96 bg-[#f7e0e0]">
                    {[1, 2, 3].map((_, subIndex) => (
                      <div
                        key={subIndex}
                        className="px-6 py-2 text-sm tracking-wide"
                      >
                        <div className="h-3 bg-gray-300 rounded w-20 mb-2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative text-end animate-pulse">
        <div className="text-left mb-6">
          <div className="h-4 w-72 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 w-48 bg-gray-300 rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-square bg-gray-200"></div>

              <div className="p-4 flex flex-col flex-grow text-start">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    <div className="h-4 w-6 bg-gray-300 rounded"></div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-200 rounded-full h-8 w-8"></div>
                    <div className="p-2 bg-gray-200 rounded-full h-8 w-8"></div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-4 bg-gray-300 w-24 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 w-16 rounded"></div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="h-10 bg-gray-300 rounded w-full"></div>
                  <div className="h-10 bg-gray-300 rounded w-10"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
