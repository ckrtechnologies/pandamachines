import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdArrowBackIos, MdOutlineCategory } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import CategoryModal from "./CategoryModal";
import { MdClose } from "react-icons/md";
import AddSubCategoryModal from "../Sub-category/AddSubCategoryModal";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const CategoryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categoryDetails, setCategoryDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [subCategoriesByCategory, setSubCategoriesByCategory] = useState([]);

  useEffect(() => {
    categoryById();
  }, [id]);

  const categoryById = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/categories/get-category-by-id/${id}`,
      headers: {},
    };

    setLoading(true);
    axios
      .request(config)
      .then((response) => {
        setCategoryDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const visibleDescription = categoryDetails?.description?.slice(0, 350) || "";

  const handleDescriptionModal = (details) => {
    setSelectedCategory(details);
    setIsDescriptionModalOpen(true);
  };

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sub-categories/get-all-sub-categories`
      );
      setAllSubCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchSubCategoriesByCategory = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${id}`
      );
      setSubCategoriesByCategory(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching subcategories:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSubCategories();
      fetchSubCategoriesByCategory();
    }
  }, [id]);

  const refreshSubCategories = () => {
    fetchSubCategories();
    fetchSubCategoriesByCategory();
  };

  const handleAddSubCategory = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 bg-orange-50">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex items-center justify-start gap-2">
          <div
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150 hover:bg-[#cfbebe]"
          >
            <MdArrowBackIos size={26} />
          </div>
          <h1 className="text-xl font-extrabold text-orange-900">
            Category Details
          </h1>
        </div>

        <button
          className="flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-400 to-orange-800 px-5 py-2 font-semibold tracking-wide text-white shadow hover:bg-hoverPrimary"
          onClick={handleAddSubCategory}
        >
          <MdOutlineCategory size={20} />
          New Sub Category
        </button>
      </div>

      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="mb-4 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
          <div className="grid grid-cols-1">
            <div className="flex justify-between">
              <div className="space-y-6">
                <span className="text-xl font-extrabold text-orange-900">
                  Basic Information
                </span>
                <div className="">
                  <p className="text-lg font-semibold text-orange-700">
                    Category Name:
                  </p>
                  <p className="text-gray-600">{categoryDetails?.name}</p>
                </div>
                <div className="">
                  <p className="text-lg font-semibold text-orange-700">
                    Category ID:
                  </p>
                  <p className="text-gray-600">{categoryDetails?._id}</p>
                </div>
              </div>
              <div className="pt-1">
                <img
                  src={categoryDetails?.imgUrl}
                  alt={
                    categoryDetails?.name
                      ? `Icon representing ${categoryDetails?.name}`
                      : "Category Icon"
                  }
                  className="h-48 w-auto rounded-lg border border-gray-200 object-cover shadow-md"
                />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-orange-700">
                Description:
              </p>
              <p className="text-gray-600">
                {visibleDescription}...
                <button
                  className="text-blue-800 font-semibold"
                  onClick={() => handleDescriptionModal(categoryDetails)}
                >
                  Read More
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <h2 className="mb-4 text-xl font-extrabold text-orange-700">
        Sub - Categories List
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {subCategoriesByCategory.map((relatedSubCategory) => (
          <div
            key={relatedSubCategory._id}
            className="relative overflow-x-hidden h-32"
          >
            <img
              src={relatedSubCategory?.imgUrl}
              alt={relatedSubCategory?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 right-0">
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                <FiEdit2 className="text-blue-600" size={16} />
              </button>
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                <FiTrash2 className="text-red-600" size={16} />
              </button>
            </div>
            <div className="absolute bottom-0 ">
              <p>{relatedSubCategory?.name}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CategoryModal
          setIsModalOpen={setIsModalOpen}
          refreshFun={categoryById}
          modalType="editModal"
          categoryDetails={categoryDetails}
        />
      )}
      {isDescriptionModalOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
          <div className="w-auto rounded-lg bg-white shadow-lg p-4 md:p-6 m-4 md:m-6">
            <div className="mb-4 flex w-full items-center justify-between ">
              <h1 className="text-lg font-semibold tracking-normal text-orange-700">
                Description of Category {categoryDetails?.name}
              </h1>
              <button
                onClick={() => setIsDescriptionModalOpen(false)}
                className="text-gray-600 hover:text-gray-800 duration-150 transition"
              >
                <MdClose size={22} />
              </button>
            </div>
            <p>{categoryDetails?.description}</p>
          </div>
        </div>
      )}
      <AddSubCategoryModal
        isOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        subCatsByCat={refreshSubCategories}
      />
    </div>
  );
};

export default CategoryDetails;

const SkeletonLoader = () => (
  <div className="mb-4 animate-pulse rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
    <div className="mb-4 flex w-full items-center justify-between">
      <div className="h-6 w-1/4 rounded-md bg-gray-200"></div>
      <div className="h-6 w-16 rounded-md bg-gray-200"></div>
    </div>

    <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
      <div className="tracking-wide">
        <div className="mb-4">
          <div className="h-6 w-3/4 rounded-md bg-gray-200"></div>
        </div>
        <div className="mb-4">
          <div className="h-6 w-1/2 rounded-md bg-gray-200"></div>
        </div>
        <div>
          <div className="h-6 w-3/4 rounded-md bg-gray-200"></div>
        </div>
      </div>

      <div className="flex flex-col items-center tracking-wide md:items-end">
        <div className="h-48 w-48 rounded-lg bg-gray-200"></div>
      </div>
    </div>
  </div>
);
