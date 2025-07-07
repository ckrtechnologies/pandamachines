import axios from "axios";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="mb-4 px-6 pt-2">
    <label className="block text-sm font-medium tracking-wide text-primaryText">
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

const CategoryModal = ({
  setIsModalOpen,
  refreshFun,
  modalType,
  categoryDetails,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: "",
    imgUrl: "",
    description: "",
    sequence: "",
  });

  useEffect(() => {
    if (modalType === "editModal" && categoryDetails) {
      setCategoryData({
        name: categoryDetails.name || "",
        imgUrl: categoryDetails.imgUrl || "",
        description: categoryDetails.description || "",
        sequence: categoryDetails.sequence || "",
      });
    }
  }, [modalType, categoryDetails]);

  // 🌩️ Cloudinary Image Upload Function
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
    setIsLoading(true);
    try {
      if (modalType === "addModal") {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/categories/create-category`,
          categoryData,
          { headers: { "Content-Type": "application/json" } }
        );
      } else if (modalType === "editModal" && categoryDetails?._id) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/categories/update-category/${categoryDetails._id}`,
          categoryData,
          { headers: { "Content-Type": "application/json" } }
        );
      }
      refreshFun();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
      <div className="w-96 rounded-lg bg-white shadow-lg">
        <div className="mb-4 flex w-full items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-semibold tracking-normal text-primaryColor">
            {modalType === "addModal" ? "Add New Category" : "Edit Category"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-600 hover:text-gray-800 duration-150 transition"
          >
            <MdClose size={22} />
          </button>
        </div>

        <hr className="border-t-1 my-2 border-gray-300" />
        <InputField
          label="Category Name"
          value={categoryData.name}
          onChange={(e) =>
            setCategoryData({ ...categoryData, name: e.target.value })
          }
        />

        {/* 🌩️ Cloudinary File Upload Input */}
        <div className="mb-4 px-6">
          <label className="block text-sm font-medium tracking-wide text-primaryText">
            Upload Image
          </label>
          <input
            className="mt-2 w-full rounded border p-2"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {imageUploading && (
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          )}
          {categoryData.imgUrl && (
            <img
              src={categoryData.imgUrl}
              alt="Uploaded"
              className="mt-2 h-14 w-14 rounded object-contain"
            />
          )}
        </div>

        <div className="mb-4 px-6">
          <label className="block text-sm font-medium tracking-wide text-primaryText">
            Description
          </label>
          <textarea
            className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={categoryData.description}
            onChange={(e) =>
              setCategoryData({ ...categoryData, description: e.target.value })
            }
            placeholder="Category description"
          />
        </div>
        <div>
          <InputField
            label="Sequence"
            type="number"
            value={categoryData.sequence}
            onChange={(e) =>
              setCategoryData({ ...categoryData, sequence: e.target.value })
            }
          />
        </div>
        <hr className="border-t-1 my-4 border-gray-300" />
        <div className="flex justify-end gap-2 px-6 pb-6 font-medium tracking-wide">
          <button
            className="rounded bg-gray-300 px-4 py-2 text-primaryColor duration-150 hover:bg-gray-400"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>

          {isLoading ? (
            <button className="rounded bg-primaryBtnColor px-4 text-white">
              <ModalButtonLoader />
            </button>
          ) : (
            <button
              className="rounded bg-primaryBtnColor px-4 py-2 text-white duration-150 hover:bg-primaryBtnHoverColor"
              onClick={handleSaveCategory}
            >
              {modalType === "addModal" ? "Add" : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
