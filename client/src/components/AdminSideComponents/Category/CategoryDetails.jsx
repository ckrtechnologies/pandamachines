import axios from "axios";
import CategoryModal from "Components/Admin-Components/Categories/CategoryModal";
import SubCategoriesList from "Components/Admin-Components/Categories/SubCategoriesList";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdArrowBackIos, MdOutlineCategory } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

const CategoryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categoryDetails, setCategoryDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex items-center justify-start gap-2">
          <div
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150 hover:bg-[#cfbebe]"
          >
            <MdArrowBackIos size={26} />
          </div>
          <h1 className="text-xl font-extrabold text-primaryText">
            Category Details
          </h1>
        </div>

        <button
          className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 font-semibold tracking-wide text-white shadow hover:bg-hoverPrimary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <MdOutlineCategory size={20} />
          New Sub Category
        </button>
      </div>

      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="mb-4 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
          <div className="mb-4 flex w-full items-center justify-between">
            <h2 className="mb-4 text-xl font-extrabold text-primaryText">
              Basic Information
            </h2>

            <button
              className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-1 text-primary transition-colors hover:text-hoverPrimary focus:outline-none"
              onClick={() => setIsModalOpen(true)}
              aria-label="Edit Category"
            >
              <AiFillEdit size={24} />
              <span className="text-md font-semibold">Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <div className="tracking-wide">
              <div className="mb-4">
                <p className="text-lg font-semibold text-primary">
                  Category Name:
                </p>
                <p className="text-gray-600">{categoryDetails?.name}</p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold text-primary">
                  Category ID:
                </p>
                <p className="text-gray-600">{categoryDetails?._id}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-primary">
                  Description:
                </p>
                <p className="text-gray-600">{categoryDetails?.description}</p>
              </div>
            </div>

            <div className="flex flex-col items-center tracking-wide md:items-end">
              <img
                src={categoryDetails?.imgUrl}
                alt={
                  categoryDetails?.name
                    ? `Icon representing ${categoryDetails?.name}`
                    : "Category Icon"
                }
                className="mb-4 h-48 w-auto rounded-lg border border-gray-200 object-cover shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      <h2 className="mb-4 text-xl font-extrabold text-primaryText">
        Sub - Categories List
      </h2>

      <SubCategoriesList
        catId={id}
        catName={categoryDetails?.name}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
      />

      {isModalOpen && (
        <CategoryModal
          setIsModalOpen={setIsModalOpen}
          refreshFun={categoryById}
          modalType="editModal"
          categoryDetails={categoryDetails}
        />
      )}
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
