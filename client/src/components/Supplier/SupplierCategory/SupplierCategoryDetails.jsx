import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdArrowBackIos, MdOutlineCategory } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
// import CategoryModal from "./CategoryModal";
import { MdClose } from "react-icons/md";
// import AddSubCategoryModal from "../Sub-category/AddSubCategoryModal";
// import EditSubCatModal from "../Sub-category/EditSubCatModal";
// import DeleteAlertModal from "../Common/DeleteAlertModal";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const SupplierCategoryDetails = () => {
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
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleEditSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSubCategory(null);
  };

  const handleDeleteSubCategory = (subCategory) => {
    setSubCategoryToDelete(subCategory);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSubCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!subCategoryToDelete) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/sub-categories/delete-sub-category/${subCategoryToDelete._id}`
      );

      refreshSubCategories();

      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting sub-category:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-orange-50">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex items-center justify-start gap-2">
          <div
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150"
          >
            <MdArrowBackIos size={26} />
          </div>
          <h1 className="text-xl font-extrabold text-orange-900">
            Category Details
          </h1>
        </div>
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

      <h2 className="mb-6 text-2xl font-bold text-orange-800">
        Sub - Categories List
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {subCategoriesByCategory.map((relatedSubCategory) => (
          <div
            key={relatedSubCategory._id}
            className="relative group rounded-2xl overflow-hidden h-64 bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0">
              <img
                src={relatedSubCategory?.imgUrl}
                alt={relatedSubCategory?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-2">
                  {relatedSubCategory?.name}
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {relatedSubCategory?.description.slice(0, 25) + "..." ||
                    "High-quality products for your electrical needs and efficient solutions."}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 group-hover:opacity-80 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default SupplierCategoryDetails;

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
