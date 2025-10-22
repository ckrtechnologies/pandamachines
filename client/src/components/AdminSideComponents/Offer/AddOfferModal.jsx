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

const AddOfferModal = ({ isOpen, setIsAddModalOpen, refetchOffers }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [offerData, setOfferData] = useState({
    name: "",
    description: "",
    image: "",
    startDate: "",
    endDate: "",
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
      setOfferData({ ...offerData, image: response.data.secure_url });
    } catch (error) {
      console.error("Image upload failed:", error);
    }
    setImageUploading(false);
  };

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSaveOffer = async () => {
    if (!offerData.name.trim()) {
      alert("Please enter an offer name");
      return;
    }
    if (!offerData.description.trim()) {
      alert("Please enter offer description");
      return;
    }
    if (!offerData.startDate.trim()) {
      alert("Please enter the start date");
      return;
    }
    if (!offerData.endDate.trim()) {
      alert("Please enter the end date");
      return;
    }
    setIsLoading(true);
    try {
      const formattedOfferData = {
        ...offerData,
        startDate: formatDateToDDMMYYYY(offerData.startDate),
        endDate: formatDateToDDMMYYYY(offerData.endDate),
      };
      await axios.post(
        `${process.env.REACT_APP_API_URL}/offer/create-offer`,
        formattedOfferData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      refetchOffers();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding offer:", error);
      alert("Failed to add offer. Please try again.");
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
            Add Offer
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
          label="Offer Name"
          value={offerData.name}
          onChange={(e) => setOfferData({ ...offerData, name: e.target.value })}
          placeholder="Enter offer name"
        />

        <div className="mb-4 px-6">
          <label className="block text-sm font-medium tracking-wide text-primaryColor">
            Offer Description
          </label>
          <textarea
            className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={offerData.description}
            onChange={(e) =>
              setOfferData({ ...offerData, description: e.target.value })
            }
            placeholder="Enter offer description"
            rows={4}
          />
        </div>

        <InputField
          label="Start Date"
          value={offerData.startDate}
          onChange={(e) =>
            setOfferData({ ...offerData, startDate: e.target.value })
          }
          type="date"
          placeholder="Select start date"
        />

        <InputField
          label="End Date"
          value={offerData.endDate}
          onChange={(e) =>
            setOfferData({ ...offerData, endDate: e.target.value })
          }
          type="date"
          placeholder="Select end date"
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
          {offerData.image && (
            <img
              src={offerData.image}
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
            onClick={handleSaveOffer}
            disabled={
              isLoading ||
              !offerData.name.trim() ||
              !offerData.description.trim() ||
              !offerData.startDate.trim() ||
              !offerData.endDate.trim()
            }
          >
            {isLoading ? <ModalButtonLoader /> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOfferModal;
