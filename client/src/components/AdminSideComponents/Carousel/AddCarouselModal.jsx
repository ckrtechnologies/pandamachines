import React, { useState } from "react";
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

const AddCarouselModal = ({ isOpen, setIsAddModalOpen, refetchCarousels }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [carouselData, setCarouselData] = useState({
    title: "",
    image: "",
  });

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
      setCarouselData({ ...carouselData, image: response.data.secure_url });
    } catch (error) {
      console.error("Image upload failed:", error);
    }
    setImageUploading(false);
  };

  const handleSaveCarousel = async () => {
    if (!carouselData.title.trim()) {
      alert("Please enter a carousel title");
      return;
    }
    if (!carouselData.image.trim()) {
      alert("Please upload an image");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/carousel/create-carousel`,
        carouselData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      refetchCarousels();
      setIsAddModalOpen(false);
      setCarouselData({ title: "", image: "" });
    } catch (error) {
      console.error("Error adding carousel:", error);
      alert("Failed to add carousel. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
      <div className="w-96 rounded-lg bg-white shadow-lg">
        <div className="mb-4 flex w-full items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-semibold tracking-normal text-primaryColor">
            Add Carousel
          </h2>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="text-gray-600 transition duration-150 hover:text-gray-800"
          >
            <MdClose size={22} />
          </button>
        </div>
        <hr className="border-t-1 my-2 border-gray-300" />

        <InputField
          label="Carousel Title"
          value={carouselData.title}
          onChange={(e) =>
            setCarouselData({ ...carouselData, title: e.target.value })
          }
          placeholder="Enter carousel title"
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
          {carouselData.image && (
            <img
              src={carouselData.image}
              alt="Uploaded"
              className="mt-2 h-20 w-full rounded object-contain"
            />
          )}
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
            onClick={handleSaveCarousel}
            disabled={
              isLoading ||
              !carouselData.title.trim() ||
              !carouselData.image.trim()
            }
          >
            {isLoading ? <ModalButtonLoader /> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCarouselModal;
