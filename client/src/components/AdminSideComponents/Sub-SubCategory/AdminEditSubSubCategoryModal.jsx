import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import ModalButtonLoader from "../Common/ModalButtonLoader";

const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="mb-4 px-6 pt-2">
    <label className="block text-sm font-medium tracking-wide text-primaryColor">
      {label}
    </label>
    <input
      className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const AdminEditSubSubCategoryModal = ({
  setIsModalOpen,
  refreshFun,
  subSubCatId,
  catId,
  subCatId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [loadingSubSubCategory, setLoadingSubSubCategory] = useState(true);
  const [subSubCategoryData, setSubSubCategoryData] = useState({
    name: "",
    imgUrl: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
  });

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubCategories = async () => {
    setLoadingSubCategories(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sub-categories/get-all-sub-categories`
      );
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const fetchSubSubCategory = async () => {
    if (!subSubCatId) return;

    setLoadingSubSubCategory(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sub-sub-categories/get-sub-sub-category/${subSubCatId}`
      );
      const subSubCat = response.data;

      setSubSubCategoryData({
        name: subSubCat.name || "",
        imgUrl: subSubCat.imgUrl || "",
        description: subSubCat.description || "",
        categoryId: subSubCat.category?._id || catId || "",
        subCategoryId: subSubCat.subCategory?._id || subCatId || "",
      });
    } catch (error) {
      console.error("Error fetching sub-sub-category:", error);
      setSubSubCategoryData({
        name: "",
        imgUrl: "",
        description: "",
        categoryId: catId || "",
        subCategoryId: subCatId || "",
      });
    } finally {
      setLoadingSubSubCategory(false);
    }
  };

  useEffect(() => {
    if (subSubCatId) {
      fetchCategories();
      fetchSubCategories();
      fetchSubSubCategory();
    }
  }, [subSubCatId, catId, subCatId]);

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        formData
      );
      setSubSubCategoryData({
        ...subSubCategoryData,
        imgUrl: response.data.secure_url,
      });
    } catch (error) {
      console.error("Image upload failed:", error);
    }
    setImageUploading(false);
  };

  const handleUpdateSubSubCategory = async () => {
    if (!subSubCategoryData.name.trim()) {
      alert("Please enter a sub-sub-category name");
      return;
    }
    if (!subSubCategoryData.categoryId) {
      alert("Please select a category");
      return;
    }
    if (!subSubCategoryData.subCategoryId) {
      alert("Please select a sub-category");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/sub-sub-categories/update-sub-sub-category/${subSubCatId}`,
        subSubCategoryData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      refreshFun();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating sub-sub-category:", error);
      alert("Failed to update sub-sub-category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedCategoryName = () => {
    const selectedCategory = categories.find(
      (cat) => cat._id === subSubCategoryData.categoryId
    );
    return selectedCategory ? selectedCategory.name : "";
  };

  const getSelectedSubCategoryName = () => {
    const selectedSubCategory = subCategories.find(
      (subCat) => subCat._id === subSubCategoryData.subCategoryId
    );
    return selectedSubCategory ? selectedSubCategory.name : "";
  };

  const filteredSubCategories = subCategories.filter((subCat) => {
    if (!subSubCategoryData.categoryId) return false;
    return (
      subCat.category && subCat.category._id === subSubCategoryData.categoryId
    );
  });

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
      <div className="w-96 rounded-lg bg-white shadow-lg">
        <div className="mb-4 flex w-full items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-semibold tracking-normal text-primaryColor">
            Edit Sub-Sub Category
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-600 transition duration-150 hover:text-gray-800"
          >
            <MdClose size={22} />
          </button>
        </div>

        <hr className="border-t-1 my-2 border-gray-300" />

        {loadingSubSubCategory ? (
          <div className="px-6 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 px-6 pt-2">
              <label className="block text-sm font-medium tracking-wide text-primaryColor">
                Select Category
              </label>
              {loadingCategories ? (
                <div className="mt-2 text-sm text-gray-500">
                  <div className="animate-pulse h-10 bg-gray-200 w-full"></div>
                </div>
              ) : (
                <select
                  className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  value={subSubCategoryData.categoryId}
                  onChange={(e) =>
                    setSubSubCategoryData({
                      ...subSubCategoryData,
                      categoryId: e.target.value,
                      subCategoryId: "",
                    })
                  }
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {subSubCategoryData.categoryId && (
              <div className="mx-6 rounded border-2 border-dotted border-primary py-2 text-center text-sm font-semibold tracking-normal text-primaryColor">
                Category - {getSelectedCategoryName()}
              </div>
            )}

            <div className="mb-4 px-6 pt-2">
              <label className="block text-sm font-medium tracking-wide text-primaryColor">
                Select Sub-Category
              </label>
              {loadingSubCategories ? (
                <div className="mt-2 text-sm text-gray-500">
                  <div className="animate-pulse h-10 bg-gray-200 w-full"></div>
                </div>
              ) : (
                <select
                  className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  value={subSubCategoryData.subCategoryId}
                  onChange={(e) =>
                    setSubSubCategoryData({
                      ...subSubCategoryData,
                      subCategoryId: e.target.value,
                    })
                  }
                  disabled={!subSubCategoryData.categoryId}
                >
                  <option value="">Choose a sub-category</option>
                  {filteredSubCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              )}
              {!subSubCategoryData.categoryId && (
                <p className="mt-1 text-xs text-gray-500">
                  Please select a category first
                </p>
              )}
            </div>

            {subSubCategoryData.subCategoryId && (
              <div className="mx-6 rounded border-2 border-dotted border-primary py-2 text-center text-sm font-semibold tracking-normal text-primaryColor">
                Sub-Category - {getSelectedSubCategoryName()}
              </div>
            )}

            <InputField
              label="Sub-Sub Category Name"
              value={subSubCategoryData.name}
              onChange={(e) =>
                setSubSubCategoryData({
                  ...subSubCategoryData,
                  name: e.target.value,
                })
              }
              placeholder="Enter sub-sub-category name"
            />

            <div className="mb-4 px-6">
              <label className="block text-sm font-medium tracking-wide text-primaryColor">
                Upload Image
              </label>
              <input
                className="mt-2 w-full rounded border p-2"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {imageUploading && (
                <p className="mt-2 text-sm text-gray-500">Uploading...</p>
              )}
              {subSubCategoryData.imgUrl && (
                <img
                  src={subSubCategoryData.imgUrl}
                  alt="Uploaded"
                  className="mt-2 h-10 w-10 rounded object-contain"
                />
              )}
            </div>

            <div className="mb-4 px-6">
              <label className="block text-sm font-medium tracking-wide text-primaryColor">
                Description
              </label>
              <textarea
                className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                value={subSubCategoryData.description}
                onChange={(e) =>
                  setSubSubCategoryData({
                    ...subSubCategoryData,
                    description: e.target.value,
                  })
                }
                placeholder="Sub-sub-category description"
              />
            </div>

            <hr className="border-t-1 my-4 border-gray-300" />

            <div className="flex justify-end gap-2 px-6 pb-6 font-medium tracking-wide">
              <button
                className="rounded bg-gray-300 px-4 py-2 text-primaryColor duration-150 hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="rounded bg-primaryBtnColor px-4 text-white duration-150 hover:bg-primaryBtnHoverColor"
                onClick={handleUpdateSubSubCategory}
                disabled={
                  isLoading ||
                  !subSubCategoryData.categoryId ||
                  !subSubCategoryData.subCategoryId ||
                  !subSubCategoryData.name.trim()
                }
              >
                {isLoading ? <ModalButtonLoader /> : "Update"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminEditSubSubCategoryModal;
