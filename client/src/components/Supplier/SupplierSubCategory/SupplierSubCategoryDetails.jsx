import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdArrowBackIos, MdOutlineCategory } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";

const SupplierSubCategoryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoryDetails, setCategoryDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    categoryById();
  }, [id]);

  const categoryById = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-category-by-id/${id}`,
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

  const handleDescriptionModal = (details) => {
    setIsDescriptionModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 bg-orange-50 h-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex items-center justify-start gap-2">
          <div
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150"
          >
            <MdArrowBackIos size={26} />
          </div>
          <h1 className="text-xl font-extrabold text-orange-900">
            Sub-Category Details
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
                    Sub-Category Name:
                  </p>
                  <p className="text-gray-600 tracking-wide">
                    {categoryDetails?.name}
                  </p>
                </div>
                <div className="">
                  <p className="text-lg font-semibold text-orange-700">
                    Sub-Category ID:
                  </p>
                  <p className="text-gray-600 tracking-wide">
                    {categoryDetails?._id}
                  </p>
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
                {categoryDetails?.description
                  ? categoryDetails.description.length >= 350
                    ? `${categoryDetails.description.slice(0, 350)}...`
                    : categoryDetails.description
                  : "No description available."}

                {categoryDetails?.description &&
                  categoryDetails.description.length >= 350 && (
                    <button
                      className="text-blue-800 font-semibold ml-1"
                      onClick={() => handleDescriptionModal(categoryDetails)}
                    >
                      Read More
                    </button>
                  )}
              </p>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default SupplierSubCategoryDetails;
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
