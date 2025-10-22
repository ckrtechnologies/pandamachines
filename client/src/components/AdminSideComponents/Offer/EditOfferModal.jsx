import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import ModalButtonLoader from "../Common/ModalButtonLoader";

const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="mb-2 px-6 pt-2">
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

const EditOfferModal = ({
  isOpen,
  setIsEditModalOpen,
  offerId,
  refetchOffers,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [offerData, setOfferData] = useState({
    name: "",
    description: "",
    image: "",
    startDate: "",
    endDate: "",
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const fetchOfferById = async () => {
    if (!offerId) return;
    setLoadingOffer(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/offer/get-offer-by-id/${offerId}`
      );
      const offer = response.data;
      setOfferData({
        name: offer.name || "",
        description: offer.description || "",
        image: offer.image || "",
        startDate: formatDateForInput(offer.startDate) || "",
        endDate: formatDateForInput(offer.endDate) || "",
      });
    } catch (error) {
      console.error("Error fetching offer:", error);
      alert("Failed to fetch offer details. Please try again.");
    } finally {
      setLoadingOffer(false);
    }
  };

  useEffect(() => {
    if (isOpen && offerId) {
      fetchOfferById();
    }
  }, [isOpen, offerId]);

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

  const handleSaveOffer = async () => {
    if (!offerData.name.trim()) {
      alert("Please enter an offer name");
      return;
    }
    if (!offerData.description.trim()) {
      alert("Please enter offer description");
      return;
    }
    if (!offerData.startDate) {
      alert("Please select a start date");
      return;
    }
    if (!offerData.endDate) {
      alert("Please select an end date");
      return;
    }

    const startDate = new Date(offerData.startDate);
    const endDate = new Date(offerData.endDate);
    if (endDate <= startDate) {
      alert("End date must be after start date");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: offerData.name,
        description: offerData.description,
        image: offerData.image,
        startDate: formatDateForAPI(offerData.startDate),
        endDate: formatDateForAPI(offerData.endDate),
      };

      await axios.put(
        `${process.env.REACT_APP_API_URL}/offer/edit-offer/${offerId}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      refetchOffers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error editing offer:", error);
      alert("Failed to edit offer. Please try again.");
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
            Edit Offer
          </h2>
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="text-gray-600 transition duration-150 hover:text-gray-800"
          >
            <MdClose size={22} />
          </button>
        </div>
        <hr className="border-t-1 my-2 border-gray-300" />

        {loadingOffer ? (
          <div className="px-6 py-4 space-y-4">
            <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="animate-pulse h-20 bg-gray-200 rounded w-full"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="animate-pulse h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ) : (
          <>
            <InputField
              label="Offer Name"
              value={offerData.name}
              onChange={(e) =>
                setOfferData({ ...offerData, name: e.target.value })
              }
              placeholder="Enter offer name"
            />

            <div className="mb-2 px-6">
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

            <div className="mb-2 px-6">
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
                  className="mt-2 h-14 w-full rounded object-contain"
                />
              )}
            </div>
          </>
        )}

        <hr className="border-t-1 my-4 border-gray-300" />
        <div className="flex justify-end gap-2 px-6 pb-6 font-medium tracking-wide">
          <button
            className="rounded bg-gray-300 px-4 py-2 text-primaryColor duration-150 hover:bg-gray-400"
            onClick={() => setIsEditModalOpen(false)}
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
              !offerData.startDate ||
              !offerData.endDate
            }
          >
            {isLoading ? <ModalButtonLoader /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOfferModal;
