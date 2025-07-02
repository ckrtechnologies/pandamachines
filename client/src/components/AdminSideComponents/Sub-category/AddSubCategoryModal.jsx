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

const AddSubCategoryModal = ({ isOpen, setIsAddModalOpen, subCatsByCat }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: "",
    imgUrl: "",
    description: "",
    categoryId: "",
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

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCategoryData({
        name: "",
        imgUrl: "",
        description: "",
        categoryId: "",
      });
    }
  }, [isOpen]);

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
      setCategoryData({ ...categoryData, imgUrl: response.data.secure_url });
    } catch (error) {
      console.error("Image upload failed:", error);
    }
    setImageUploading(false);
  };

  const handleSaveCategory = async () => {
    if (!categoryData.name.trim()) {
      alert("Please enter a sub-category name");
      return;
    }
    if (!categoryData.categoryId) {
      alert("Please select a category");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/sub-categories/create-sub-category`,
        categoryData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      subCatsByCat();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding sub-category:", error);
      alert("Failed to add sub-category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedCategoryName = () => {
    const selectedCategory = categories.find(
      (cat) => cat._id === categoryData.categoryId
    );
    return selectedCategory ? selectedCategory.name : "";
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
      <div className="w-96 rounded-lg bg-white shadow-lg">
        <div className="mb-4 flex w-full items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-semibold tracking-normal text-primaryColor">
            Add Sub Category
          </h2>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="text-gray-600 transition duration-150 hover:text-gray-800"
          >
            <MdClose size={22} />
          </button>
        </div>

        <hr className="border-t-1 my-2 border-gray-300" />

        {/* Category Selection Dropdown */}
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
              value={categoryData.categoryId}
              onChange={(e) =>
                setCategoryData({ ...categoryData, categoryId: e.target.value })
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

        {/* Display selected category */}
        {categoryData.categoryId && (
          <div className="mx-6 rounded border-2 border-dotted border-primary py-2 text-center text-sm font-semibold tracking-normal text-primaryColor">
            Category - {getSelectedCategoryName()}
          </div>
        )}

        <InputField
          label="Sub Category Name"
          value={categoryData.name}
          onChange={(e) =>
            setCategoryData({ ...categoryData, name: e.target.value })
          }
          placeholder="Enter sub-category name"
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
          {categoryData.imgUrl && (
            <img
              src={categoryData.imgUrl}
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
            value={categoryData.description}
            onChange={(e) =>
              setCategoryData({ ...categoryData, description: e.target.value })
            }
            placeholder="Sub-category description"
          />
        </div>

        <hr className="border-t-1 my-4 border-gray-300" />

        <div className="flex justify-end gap-2 px-6 pb-6 font-medium tracking-wide">
          <button
            className="rounded bg-gray-300 px-4 py-2 text-primaryColor duration-150 hover:bg-gray-400"
            onClick={() => setIsAddModalOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="rounded bg-primaryBtnColor px-4 text-white duration-150 hover:bg-primaryBtnHoverColor"
            onClick={handleSaveCategory}
            disabled={
              isLoading || !categoryData.categoryId || !categoryData.name.trim()
            }
          >
            {isLoading ? <ModalButtonLoader /> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryModal;
