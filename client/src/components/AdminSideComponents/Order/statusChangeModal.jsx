import React, { useState, useEffect } from "react";
import {
  MdClose,
  MdPending,
  MdLocalShipping,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import axios from "axios";

const StatusChangeModal = ({
  isOpen,
  onClose,
  cHngModalData,
  getAllOrders,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen && cHngModalData?.prod_status) {
      setSelectedStatus("Cancelled");
    }
  }, [isOpen, cHngModalData?.prod_status]);

  const getCurrentStatusDisplay = (status) => {
    switch (status) {
      case "Delivered":
        return { text: "Delivered", color: "text-green-700" };
      case "Pending":
        return { text: "Pending", color: "text-yellow-600" };
      case "Cancelled":
        return { text: "Cancelled", color: "text-red-700" };
      case "Shipped":
        return { text: "Shipped", color: "text-blue-700" };
      default:
        return { text: "Unknown", color: "text-gray-700" };
    }
  };

  const getStatusIcon = (status) => {
    const iconSize = 80;
    switch (status) {
      case "Pending":
        return <MdPending size={iconSize} className="text-yellow-500" />;
      case "Shipped":
        return <MdLocalShipping size={iconSize} className="text-blue-500" />;
      case "Delivered":
        return <MdCheckCircle size={iconSize} className="text-green-500" />;
      case "Cancelled":
        return <MdCancel size={iconSize} className="text-red-500" />;
      default:
        return <MdPending size={iconSize} className="text-gray-500" />;
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    const allStatuses = [
      { value: "Delivered", label: "Delivered", color: "text-green-700" },
      { value: "Pending", label: "Pending", color: "text-yellow-600" },
      { value: "Cancelled", label: "Cancelled", color: "text-red-700" },
      { value: "Shipped", label: "Shipped", color: "text-blue-700" },
    ];

    switch (currentStatus) {
      case "Pending":
        return allStatuses.filter(
          (status) => status.value === "Shipped" || status.value === "Cancelled"
        );
      case "Shipped":
        return allStatuses.filter(
          (status) =>
            status.value === "Delivered" || status.value === "Cancelled"
        );
      case "Delivered":
        return [];
      case "Cancelled":
        return [];
      default:
        return allStatuses.filter((status) => status.value !== currentStatus);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileError("");
    setImagePreview(null);

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setFileError(
          "Please select a valid image file (JPEG, JPG, PNG, or GIF)"
        );
        setSelectedFile(null);
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setFileError("File size must be less than 5MB");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleChange = async () => {
    if (!selectedStatus) return;

    if (
      selectedStatus === "Delivered" &&
      cHngModalData?.prod_status === "Shipped" &&
      !selectedFile
    ) {
      setFileError("Please upload an image to confirm delivery");
      return;
    }

    setIsLoading(true);
    try {
      let pod_img_url = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

        try {
          const imageUploadResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          pod_img_url = imageUploadResponse.data.secure_url;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setFileError("Failed to upload image. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      const data = {
        status: selectedStatus,
        ...(pod_img_url && { deliveryImage: pod_img_url }),
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/orders/update-order-status/${cHngModalData?.prod_id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Status update successful:", response.data);

      await getAllOrders();
      setSelectedStatus("");
      setSelectedFile(null);
      setFileError("");
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error("Error updating order status:", error);
      console.error("Error response:", error.response?.data);
      setFileError("Failed to update order status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    setSelectedFile(null);
    setFileError("");
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    onClose();
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  const currentStatus = getCurrentStatusDisplay(cHngModalData?.prod_status);
  const availableStatuses = getAvailableStatuses(cHngModalData?.prod_status);
  const showImageUpload =
    selectedStatus === "Delivered" && cHngModalData?.prod_status === "Shipped";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
        >
          <MdClose size={22} />
        </button>

        <div className="mb-2 flex justify-center">
          {getStatusIcon(cHngModalData?.prod_status)}
        </div>

        <p className="text-md text-center tracking-wide">
          Current Status -{" "}
          <span className={`font-semibold ${currentStatus.color}`}>
            {currentStatus.text}
          </span>
        </p>

        <h2 className="mt-4 text-center text-2xl font-semibold tracking-wide text-gray-900">
          Change the order status
        </h2>

        {availableStatuses.length > 0 ? (
          <>
            <div className="mt-4">
              <p className="text-md mb-3 text-center tracking-wide text-gray-700">
                Select new status:
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {availableStatuses.map((status) => (
                  <label
                    key={status.value}
                    className={`flex cursor-pointer items-center p-2 transition-colors ${
                      selectedStatus === status.value
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={selectedStatus === status.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {showImageUpload && (
              <div className="mt-4">
                <p className="text-md mb-3 text-center tracking-wide text-gray-700">
                  Upload delivery confirmation image:
                </p>
                <div className="flex justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 border-2 border-blue-200 rounded-lg p-1 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {selectedFile && (
                  <div className="mt-3 text-center">
                    <div className="flex justify-center mb-2">
                      <img
                        src={imagePreview}
                        alt="Selected delivery image"
                        className="w-auto h-20 rounded border"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {fileError && (
              <p className="text-sm text-center mt-2 text-red-600">
                {fileError}
              </p>
            )}

            {selectedStatus && (
              <p className="text-md mt-4 text-center tracking-wide text-gray-700">
                Are you sure you want to change the status to{" "}
                <span
                  className={`font-semibold ${
                    availableStatuses.find((s) => s.value === selectedStatus)
                      ?.color
                  }`}
                >
                  {
                    availableStatuses.find((s) => s.value === selectedStatus)
                      ?.label
                  }
                </span>
                ?
              </p>
            )}

            <div className="mt-7 flex justify-center space-x-4 font-medium tracking-wide">
              <button
                onClick={handleClose}
                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition duration-150 hover:bg-gray-400"
              >
                Cancel
              </button>

              {isLoading ? (
                <button className="rounded-lg bg-blue-600 px-4 text-white">
                  <ModalButtonLoader />
                </button>
              ) : (
                <button
                  onClick={handleChange}
                  disabled={!selectedStatus}
                  className={`rounded-lg px-4 text-white transition duration-150 ${
                    selectedStatus
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Ok, Change
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="mt-4 text-center">
            <p className="text-gray-600 mb-4">
              This order status cannot be changed.
            </p>
            <button
              onClick={handleClose}
              className="rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition duration-150 hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusChangeModal;
