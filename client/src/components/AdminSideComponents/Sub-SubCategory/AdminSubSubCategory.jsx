import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight, FaRegEye } from "react-icons/fa";
import AdminAddSubSubCategorymodal from "./AdminAddSubSubCategorymodal";
import AdminEditSubSubCategoryModal from "./AdminEditSubSubCategoryModal";
import DeleteAlertModal from "../Common/DeleteAlertModal";
import { useNavigate } from "react-router-dom";

const AdminSubSubCategory = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [allSubSubCategories, setAllSubSubCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeSubCategory, setActiveSubCategory] =
    useState("All Sub-Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subSubCategoryToDelete, setSubSubCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const categoryScrollRef = useRef(null);
  const subCategoryScrollRef = useRef(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        categoriesResponse,
        subCategoriesResponse,
        subSubCategoriesResponse,
      ] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL}/sub-categories/get-all-sub-categories`
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL}/sub-sub-categories/get-all`
        ),
      ]);

      setAllCategories(categoriesResponse.data);
      setAllSubCategories(subCategoriesResponse.data);
      setAllSubSubCategories(subSubCategoriesResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshData = () => {
    fetchAllData();
  };

  const uniqueCategories = [
    "All Categories",
    ...Array.from(new Set(allCategories.map((cat) => cat.name))),
  ];

  const filteredSubCategories = allSubCategories.filter((subCat) => {
    if (activeCategory === "All Categories") return true;
    return subCat.category && subCat.category.name === activeCategory;
  });

  const uniqueSubCategories = [
    "All Sub-Categories",
    ...Array.from(new Set(filteredSubCategories.map((subCat) => subCat.name))),
  ];

  useEffect(() => {
    if (
      activeCategory !== "All Categories" &&
      activeSubCategory !== "All Sub-Categories"
    ) {
      const isSubCategoryAvailable = filteredSubCategories.some(
        (subCat) => subCat.name === activeSubCategory
      );
      if (!isSubCategoryAvailable) {
        setActiveSubCategory("All Sub-Categories");
      }
    }
  }, [activeCategory, filteredSubCategories, activeSubCategory]);

  const filteredSubSubCategories = allSubSubCategories.filter((subSubCat) => {
    const matchesSearch =
      subSubCat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subSubCat.subCategory &&
        subSubCat.subCategory.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (subSubCat.category &&
        subSubCat.category.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesCategory =
      activeCategory === "All Categories" ||
      (subSubCat.category && subSubCat.category.name === activeCategory);

    const matchesSubCategory =
      activeSubCategory === "All Sub-Categories" ||
      (subSubCat.subCategory &&
        subSubCat.subCategory.name === activeSubCategory);

    return matchesSearch && matchesCategory && matchesSubCategory;
  });
  const scroll = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = 150;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setActiveSubCategory("All Sub-Categories");
  };

  const handleSubCategoryChange = (subCategory) => {
    setActiveSubCategory(subCategory);
  };

  const handleAddSubSubCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleEditSubSubCategory = (subSubCategory) => {
    setSelectedSubSubCategory(subSubCategory);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSubSubCategory(null);
  };

  const handleDeleteSubSubCategory = (subSubCategory) => {
    setSubSubCategoryToDelete(subSubCategory);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSubSubCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!subSubCategoryToDelete) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/sub-sub-categories/delete-sub-sub-category/${subSubCategoryToDelete._id}`
      );

      refreshData();
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting sub-sub-category:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md animate-pulse"
        >
          <div className="relative h-40 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mt-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading sub-sub-categories: {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Tier-3-Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product sub-sub-categories
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sub-sub-categories..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddSubSubCategory}
            className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <FiPlus className="mr-2" />
            Add Sub-Sub-Category
          </button>
        </div>
      </div>
      <div className="mb-4">
        <div className="relative flex items-center">
          <button
            onClick={() => scroll("left", categoryScrollRef)}
            className="absolute left-0 z-10 p-2 bg-[#FF8617] hover:bg-[#CC5F0F] text-white shadow-md rounded-full transition duration-200"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={categoryScrollRef}
            className="flex gap-3 overflow-x-auto hide-scrollbar py-2 px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              <>
                {[...Array(10)].map((_, index) => (
                  <button
                    key={index}
                    className="px-4 min-w-32 bg-gradient-to-r from-gray-200 via-gray-50 to-gray-200 animate-pulse border-gray-300 py-2 shadow-md whitespace-nowrap rounded-full border text-sm font-medium transition-all"
                  >
                    &nbsp;
                  </button>
                ))}
              </>
            ) : (
              uniqueCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 shadow-md whitespace-nowrap rounded-full border text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-[#00395F] text-white border-[#00395F]"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))
            )}
          </div>

          <button
            onClick={() => scroll("right", categoryScrollRef)}
            className="absolute right-0 z-10 p-2 bg-[#FF8617] hover:bg-[#CC5F0F] text-white shadow-md rounded-full transition duration-200"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="mb-6">
        <div className="relative flex items-center">
          <button
            onClick={() => scroll("left", subCategoryScrollRef)}
            className="absolute left-0 z-10 p-2 bg-[#FF8617] hover:bg-[#CC5F0F] text-white shadow-md rounded-full transition duration-200"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={subCategoryScrollRef}
            className="flex gap-3 overflow-x-auto hide-scrollbar py-2 px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              <>
                {[...Array(10)].map((_, index) => (
                  <button
                    key={index}
                    className="px-4 min-w-32 bg-gradient-to-r from-gray-200 via-gray-50 to-gray-200 animate-pulse border-gray-300 py-2 shadow-md whitespace-nowrap rounded-full border text-sm font-medium transition-all"
                  >
                    &nbsp;
                  </button>
                ))}
              </>
            ) : (
              uniqueSubCategories.map((subCategory) => (
                <button
                  key={subCategory}
                  onClick={() => handleSubCategoryChange(subCategory)}
                  className={`px-4 py-2 shadow-md whitespace-nowrap rounded-full border text-sm font-medium transition-all ${
                    activeSubCategory === subCategory
                      ? "bg-[#FF8617] text-white border-[#FF8617]"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {subCategory}
                </button>
              ))
            )}
          </div>

          <button
            onClick={() => scroll("right", subCategoryScrollRef)}
            className="absolute right-0 z-10 p-2 bg-[#FF8617] hover:bg-[#CC5F0F] text-white shadow-md rounded-full transition duration-200"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {loading ? (
        <SkeletonLoader />
      ) : filteredSubSubCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubSubCategories.map((subSubCat) => (
            <div
              key={subSubCat._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md transition-all hover:shadow-lg"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={subSubCat.imgUrl}
                  alt={subSubCat.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
                <div className="absolute top-0 left-0 flex flex-col gap-1">
                  <div className="bg-gradient-to-r from-[#00395F] to-[#FF8617] tracking-wide text-white text-xs font-medium px-2 py-1 rounded-br">
                    {subSubCat.category
                      ? subSubCat.category.name
                      : "No Category"}
                  </div>
                  <div className="bg-gradient-to-r from-[#FF8617] to-[#00395F] tracking-wide text-white text-xs font-medium px-2 py-1 rounded-br">
                    {subSubCat.subCategory
                      ? subSubCat.subCategory.name
                      : "No Sub-Category"}
                  </div>
                </div>

                <div className="absolute top-0 right-0 flex space-x-1 p-2">
                  <button
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
                    onClick={() => {
                      navigate(
                        `/admin-sub-subcategory-details/${subSubCat._id}`
                      );
                    }}
                  >
                    <FaRegEye className="text-[#FF8617]" size={16} />
                  </button>
                  <button
                    onClick={() => handleEditSubSubCategory(subSubCat)}
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
                  >
                    <FiEdit2 className="text-blue-600" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSubSubCategory(subSubCat)}
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
                  >
                    <FiTrash2 className="text-red-600" size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {subSubCat.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {subSubCat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <div className="mx-auto max-w-md">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No sub-sub-categories found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              activeCategory !== "All Categories" ||
              activeSubCategory !== "All Sub-Categories"
                ? "Try adjusting your filters or search term"
                : "Create your first sub-sub-category to get started"}
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddSubSubCategory}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#FF8617] hover:bg-[#CC5F0F] shadow-md"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Add Sub-Sub-Category
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminAddSubSubCategorymodal
        isOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        refreshData={refreshData}
      />

      {selectedSubSubCategory && isEditModalOpen && (
        <AdminEditSubSubCategoryModal
          subCatId={selectedSubSubCategory.subCategory?._id}
          catId={selectedSubSubCategory.category?._id}
          setIsModalOpen={handleCloseEditModal}
          refreshFun={refreshData}
          subSubCatId={selectedSubSubCategory._id}
        />
      )}

      <DeleteAlertModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        dltType="sub-sub-category"
        dltName={subSubCategoryToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        dltLoading={deleteLoading}
      />
    </div>
  );
};

export default AdminSubSubCategory;
