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
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);

        // Fetch all sub-categories
        const subCatResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/sub-categories/get-all-sub-categories`
        );
        const categories = Array.isArray(subCatResponse.data)
          ? subCatResponse.data
          : [];
        setSubCategories(categories);

        if (id) {
          // Find selected sub-category
          const foundSubCategory = categories.find((subCat) => subCat?._id === id);
          setSelectedSubCategory(foundSubCategory || null);

          // Fetch sub-sub-categories
          try {
            const subSubCatResponse = await axios.get(
              `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${id}`
            );
            const subSubCats = Array.isArray(subSubCatResponse.data)
              ? subSubCatResponse.data
              : [];
            setSubSubCategories(subSubCats);
          } catch (err) {
            console.warn("Error fetching sub-sub-categories:", err.message);
            setSubSubCategories([]);
          }

          // Fetch products
          try {
            const productsResponse = await axios.get(
              `${process.env.REACT_APP_API_URL}/products/products-by-sub-category/${id}`
            );
            const prods = Array.isArray(productsResponse.data)
              ? productsResponse.data
              : [];
            setProducts(prods);
          } catch (err) {
            console.warn("Error fetching products:", err.message);
            setProducts([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setProducts([]);
        setSubCategories([]);
        setSubSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchProductsBySubSubCategory = async (subSubCategoryId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/products-by-sub-sub-category/${subSubCategoryId}`
      );
      const prods = Array.isArray(response.data) ? response.data : [];
      setProducts(prods);

      // Find and set the sub-sub-category object
      const foundSubSubCategory = subSubCategories.find(
        (subSubCat) => subSubCat?._id === subSubCategoryId
      );
      setSelectedSubSubCategory(foundSubSubCategory || null);
    } catch (error) {
      console.error("Error fetching products by sub-sub-category:", error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProductsBySubCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/products-by-sub-category/${id}`
      );
      const prods = Array.isArray(response.data) ? response.data : [];
      setProducts(prods);
      setSelectedSubSubCategory(null);
    } catch (error) {
      console.error("Error fetching products by sub-category:", error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <UserNavbar />

      {loading ? (
        <FilterSidebarSkeleton />
      ) : error ? (
        <div className="flex flex-col md:flex-row bg-[#F2F7FF] px-4 xl:px-6 py-4 md:py-6 gap-4 md:gap-6 min-h-screen">
          <div className="w-full text-center py-12">
            <p className="text-red-600 font-semibold text-lg">
              Error loading products
            </p>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row bg-[#F2F7FF] px-4 xl:px-6 py-4 md:py-6 gap-4 md:gap-6">
          <FilterSection
            subCategories={subCategories}
            subSubCategories={subSubCategories}
            selectedSubCategoryId={id}
            selectedSubSubCategoryId={selectedSubSubCategory?._id || null}
            onSubSubCategorySelect={fetchProductsBySubSubCategory}
            onViewAll={fetchAllProductsBySubCategory}
          />
          <ProductCards
            products={products}
            subCategory={selectedSubCategory}
            subSubCategory={selectedSubSubCategory}
          />
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

      <div className="relative text-end animate-pulse w-full">
        <div className="text-left mb-6">
          <div className="h-4 w-72 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 w-48 bg-gray-300 rounded"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-square bg-gray-200 overflow-hidden"></div>

              <div className="p-3 flex flex-col flex-grow text-start">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>

                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-16 bg-gray-300 rounded"></div>
                    <div className="h-3 w-6 bg-gray-300 rounded"></div>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="p-1.5 bg-gray-200 rounded-full h-8 w-8"></div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="h-9 bg-gray-300 rounded w-full"></div>
                  <div className="h-9 bg-gray-300 rounded w-10"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
