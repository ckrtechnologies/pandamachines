import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import axios from "axios";

const SupplierStatusChangeModal = ({
  isOpen,
  onClose,
  modalData,
  refreshSuppliers,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (isOpen && modalData?.status) {
      const currentStatus = modalData.status;

      if (currentStatus === "Pending") {
        setSelectedStatus("Approved");
      } else if (currentStatus === "Rejected") {
        setSelectedStatus("Pending");
      } else if (currentStatus === "Approved") {
        setSelectedStatus("Pending");
      }
      setRejectionReason("");
    }
  }, [isOpen, modalData?.status]);

  const getCurrentStatusDisplay = (status) => {
    switch (status) {
      case "Pending":
        return { text: "Pending", color: "text-yellow-600" };
      case "Approved":
        return { text: "Approved", color: "text-green-600" };
      case "Rejected":
        return { text: "Rejected", color: "text-red-700" };
      default:
        return { text: "Unknown", color: "text-gray-700" };
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    const allStatuses = [
      { value: "Pending", label: "Pending", color: "text-yellow-600" },
      { value: "Approved", label: "Approved", color: "text-green-600" },
      { value: "Rejected", label: "Rejected", color: "text-red-700" },
    ];

    switch (currentStatus) {
      case "Pending":
        return allStatuses.filter(
          (status) => status.value === "Approved" || status.value === "Rejected"
        );
      case "Rejected":
        return allStatuses.filter(
          (status) => status.value === "Pending" || status.value === "Approved"
        );
      case "Approved":
        return allStatuses.filter(
          (status) => status.value === "Pending" || status.value === "Rejected"
        );
      default:
        return [];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Approved":
        return "✅";
      case "Rejected":
        return "❌";
      default:
        return "❓";
    }
  };

  const handleChange = () => {
    if (!selectedStatus) return;

    let data = JSON.stringify({
      status: selectedStatus,
      ...(selectedStatus === "Rejected" &&
        rejectionReason.trim() && { rejectionReason }),
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/supplier/change-suppliers-status/${modalData?._id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    setIsLoading(true);
    axios
      .request(config)
      .then((response) => {
        refreshSuppliers();
        setIsLoading(false);
        setSelectedStatus("");
        setRejectionReason("");
        onClose();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleClose = () => {
    setSelectedStatus("");
    setRejectionReason("");
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
          Change Seller Status
        </h2>

        <div className="mt-2 text-center">
          <p className="text-gray-600 text-sm">
            Seller: <span className="font-medium">{modalData?.fullName}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Business:{" "}
            <span className="font-medium">{modalData?.businessName}</span>
          </p>
        </div>

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
                  name="supplierStatus"
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

        {selectedStatus === "Rejected" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection (optional)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows="3"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can provide a reason, but it's not required
            </p>
          </div>
        )}

        {selectedStatus && (
          <p className="text-md mt-4 text-center tracking-wide text-gray-700">
            Are you sure you want to change the status to{" "}
            <span
              className={`font-semibold ${
                availableStatuses.find((s) => s.value === selectedStatus)?.color
              }`}
            >
              {availableStatuses.find((s) => s.value === selectedStatus)?.label}
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
      </div>
    </div>
  );
};

export default SupplierStatusChangeModal;
