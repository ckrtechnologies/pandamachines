import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import axios from "axios";

const StatusChangingModal = ({
  isOpen,
  onClose,
  modalData,
  refreshBookings,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (isOpen && modalData?.status) {
      const currentStatus = modalData.status;

      if (currentStatus === "pending") {
        setSelectedStatus("completed");
      } else if (currentStatus === "rejected") {
        setSelectedStatus("pending");
      }
    }
  }, [isOpen, modalData?.status]);

  const getCurrentStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return { text: "Pending", color: "text-yellow-600" };
      case "completed":
        return { text: "Completed", color: "text-blue-600" };
      case "rejected":
        return { text: "Rejected", color: "text-red-700" };
      default:
        return { text: "Unknown", color: "text-gray-700" };
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    const allStatuses = [
      { value: "pending", label: "Pending", color: "text-yellow-600" },
      { value: "completed", label: "Completed", color: "text-blue-600" },
      { value: "rejected", label: "Rejected", color: "text-red-700" },
    ];

    switch (currentStatus) {
      case "pending":
        return allStatuses.filter(
          (status) =>
            status.value === "completed" || status.value === "rejected"
        );
      case "rejected":
        return allStatuses.filter((status) => status.value === "pending");
      case "completed":
        return [];
      default:
        return [];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "completed":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "❓";
    }
  };

  const handleChange = () => {
    if (!selectedStatus) return;

    let data = JSON.stringify({
      status: selectedStatus,
    });

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/guidance-booking/change-status/${modalData?.guide_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    setIsLoading(true);
    axios
      .request(config)
      .then((response) => {
        refreshBookings();
        setIsLoading(false);
        setSelectedStatus("");
        onClose();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleClose = () => {
    setSelectedStatus("");
    onClose();
  };

  if (!isOpen) return null;

  const currentStatus = getCurrentStatusDisplay(modalData?.status);
  const availableStatuses = getAvailableStatuses(modalData?.status);

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
        >
          <MdClose size={22} />
        </button>

        <div className="mb-4 flex justify-center text-4xl">
          {getStatusIcon(modalData?.status)}
        </div>

        <p className="text-md text-center tracking-wide">
          Current Status -{" "}
          <span className={`font-semibold ${currentStatus.color}`}>
            {currentStatus.text}
          </span>
        </p>

        <h2 className="mt-4 text-center text-2xl font-semibold tracking-wide text-gray-900">
          Change Booking Status
        </h2>

        {modalData?.status === "completed" ? (
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-lg">
              ✅ This booking is completed and cannot be changed.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <p className="text-md mb-3 text-center tracking-wide text-gray-700">
                Select new status:
              </p>

              <div className="flex items-center justify-around">
                {availableStatuses.map((status) => (
                  <label
                    key={status.value}
                    className={`flex cursor-pointer items-center rounded-lg p-1 transition-all `}
                  >
                    <input
                      type="radio"
                      name="bookingStatus"
                      value={status.value}
                      checked={selectedStatus === status.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="mr-3 h-4 w-4 text-blue-500 focus:ring-blue-500"
                    />
                    <span className={`font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

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
                <button className="rounded-lg bg-blue-500 px-4 text-white">
                  <ModalButtonLoader />
                </button>
              ) : (
                <button
                  onClick={handleChange}
                  disabled={!selectedStatus}
                  className={`rounded-lg px-4 py-2 text-white transition duration-150 ${
                    selectedStatus
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Yes, Change Status
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusChangingModal;
