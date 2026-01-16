import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { FcApproval, FcCancel } from "react-icons/fc";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import axios from "axios";

const ProductStatusModal = ({ isOpen, onClose, modalData, onStatusUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus("");
      setRejectionReason("");
      setShowReasonInput(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setShowReasonInput(selectedStatus === "cancel");
    if (selectedStatus !== "cancel") {
      setRejectionReason("");
    }
  }, [selectedStatus]);

  const getCurrentStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return { text: "Pending Review", color: "text-yellow-600" };
      case "approved":
        return { text: "Approved", color: "text-green-700" };
      case "cancel":
        return { text: "Rejected", color: "text-red-700" };
      default:
        return { text: "Unknown", color: "text-gray-700" };
    }
  };

  const getAvailableStatuses = () => {
    const currentTab = modalData?.current_tab;
    const currentStatus = modalData?.prod_status;
    if (currentTab === "pending") {
      return [
        { value: "approved", label: "Approve", color: "text-green-700" },
        { value: "cancel", label: "Reject", color: "text-red-700" },
      ];
    } else if (currentTab === "approved") {
      return [
        { value: "cancel", label: "Reject", color: "text-red-700" },
        { value: "pending", label: "Pending", color: "text-yellow-600" },
      ];
    } else if (currentTab === "cancel") {
      return [
        { value: "approved", label: "Approve", color: "text-green-700" },
        { value: "pending", label: "Pending", color: "text-yellow-600" },
      ];
    }

    return [];
  };

  const handleChange = () => {
    if (!selectedStatus) return;

    let data = {
      status: selectedStatus,
      ...(selectedStatus === "cancel" && {
        rejectionReason: rejectionReason,
      }),
    };

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/products/${modalData?.prod_id}/status`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    setIsLoading(true);
    axios
      .request(config)
      .then((response) => {
        onStatusUpdate();
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
    setShowReasonInput(false);
    onClose();
  };

  if (!isOpen) return null;

  const currentStatus = getCurrentStatusDisplay(modalData?.prod_status);
  const availableStatuses = getAvailableStatuses();

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
        >
          <MdClose size={22} />
        </button>

        <div className="mb-2 flex justify-center">
          {selectedStatus === "approved" ? (
            <FcApproval className="h-20 w-auto" />
          ) : selectedStatus === "cancel" ? (
            <FcCancel className="h-20 w-auto" />
          ) : selectedStatus === "pending" ? (
            <div className="h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">📋</span>
            </div>
          ) : (
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🔄</span>
            </div>
          )}
        </div>

        <p className="text-md text-center tracking-wide mb-2">
          Product: <span className="font-semibold">{modalData?.prod_name}</span>
        </p>

        <p className="text-md text-center tracking-wide">
          Current Status -{" "}
          <span className={`font-semibold ${currentStatus.color}`}>
            {currentStatus.text}
          </span>
        </p>

        <h2 className="mt-4 text-center text-2xl font-semibold tracking-wide text-gray-900">
          Change Product Status
        </h2>

        <div className="mt-4">
          <p className="text-md mb-3 text-center tracking-wide text-gray-700">
            Select action:
          </p>

          <div className="flex justify-center items-center gap-8">
            {availableStatuses.map((status) => (
              <label
                key={status.value}
                className={`flex cursor-pointer items-center rounded-lg transition-all ${
                  selectedStatus === status.value
                    ? "bg-blue-50 ring-2 ring-blue-300"
                    : ""
                } p-3`}
              >
                <input
                  type="radio"
                  name="productStatus"
                  value={status.value}
                  checked={selectedStatus === status.value}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mr-3 h-4 w-4 text-primaryBtnColor focus:ring-primaryBtnColor"
                />
                <span className={`font-medium ${status.color}`}>
                  {status.label}
                </span>
              </label>
            ))}
          </div>
        </div>
        {showReasonInput && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason
              <span className="text-gray-400 text-xs ml-1">- Optional</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              rows="3"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will help the supplier understand why the product was
              rejected.
            </p>
          </div>
        )}

        {selectedStatus && (
          <p className="text-md mt-4 text-center tracking-wide text-gray-700">
            Are you sure you want to{" "}
            <span
              className={`font-semibold ${
                availableStatuses.find((s) => s.value === selectedStatus)?.color
              }`}
            >
              {availableStatuses.find((s) => s.value === selectedStatus)?.label}
            </span>{" "}
            this product?
            {selectedStatus === "cancel" && rejectionReason && (
              <span className="block mt-1 text-sm">
                <strong>Reason:</strong> {rejectionReason}
              </span>
            )}
          </p>
        )}

        <div className="mt-7 flex justify-center space-x-4 font-medium tracking-wide">
          <button
            onClick={handleClose}
            className="rounded-lg bg-gray-300 px-4 py-2 text-primaryColor transition duration-150 hover:bg-gray-400"
          >
            Cancel
          </button>

          {isLoading ? (
            <button className="rounded-lg bg-primaryBtnColor px-4 text-white">
              <ModalButtonLoader />
            </button>
          ) : (
            <button
              onClick={handleChange}
              disabled={!selectedStatus}
              className={`rounded-lg px-4 py-2 text-white transition duration-150 ${
                selectedStatus
                  ? "bg-primaryBtnColor hover:bg-primaryBtnHoverColor"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductStatusModal;
