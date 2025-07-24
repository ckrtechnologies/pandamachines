import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import axios from "axios";

const ExchangeStatusModal = ({
  isOpen,
  onClose,
  onConfirm,
  statusLoading,
  order,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentStatus = order?.exchangeRequest?.status;

  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (currentStatus === "Requested") {
      setSelectedStatus("Approved") || setSelectedStatus("Rejected");
    } else if (currentStatus === "Approved") {
      setSelectedStatus("Completed") || setSelectedStatus("Rejected");
    } else {
      setSelectedStatus("");
    }
  }, [currentStatus]);

  if (!isOpen) return null;

  const handleChange = async () => {
    if (!selectedStatus) {
      setError("Please select a status");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = {
        status: selectedStatus,
      };
      console.log("Order =====>", order);

      const orderId = order?._id;

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/orders/update-exchange-status/${orderId}`,
        data
      );

      console.log("Status updated successfully", response.data);

      if (onConfirm) {
        await onConfirm(selectedStatus);
      }
      onClose();
    } catch (error) {
      console.error("Error updating exchange status:", error);
      setError(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusOptions = () => {
    if (currentStatus === "Requested") {
      return (
        <>
          <label className="flex items-center justify-center gap-1 text-green-700">
            <input
              type="radio"
              name="status"
              value="Approved"
              checked={selectedStatus === "Approved"}
              onChange={(e) => setSelectedStatus(e.target.value)}
            />
            Approve
          </label>
          <label className="flex items-center justify-center gap-1 text-red-700">
            <input
              type="radio"
              name="status"
              value="Rejected"
              checked={selectedStatus === "Rejected"}
              onChange={(e) => setSelectedStatus(e.target.value)}
            />
            Reject
          </label>
        </>
      );
    } else if (currentStatus === "Approved") {
      return (
        <>
          <label className="flex items-center justify-center gap-1 text-blue-700">
            <input
              type="radio"
              name="status"
              value="Completed"
              checked={selectedStatus === "Completed"}
              onChange={(e) => setSelectedStatus(e.target.value)}
            />
            Complete
          </label>
          <label className="flex items-center justify-center gap-1 text-red-700">
            <input
              type="radio"
              name="status"
              value="Rejected"
              checked={selectedStatus === "Rejected"}
              onChange={(e) => setSelectedStatus(e.target.value)}
            />
            Reject
          </label>
        </>
      );
    } else if (currentStatus === "Completed") {
      return (
        <div className="text-gray-700">This exchange is already completed.</div>
      );
    } else if (currentStatus === "Rejected") {
      return (
        <div className="text-gray-700">This exchange is already rejected.</div>
      );
    } else {
      return <div className="text-gray-700">No exchange request found.</div>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Requested":
        return "text-yellow-700";
      case "Approved":
        return "text-green-700";
      case "Completed":
        return "text-blue-700";
      case "Rejected":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  const showConfirmButtons =
    currentStatus === "Requested" || currentStatus === "Approved";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
        >
          <MdClose size={22} />
        </button>

        <h2 className="text-center text-2xl font-semibold tracking-wide text-gray-900">
          Exchange Status
        </h2>

        <p className="text-md mt-4 text-center tracking-wide text-gray-700">
          {currentStatus !== "Completed" && currentStatus !== "Rejected" ? (
            <>
              This exchange has been <br />
              <span className={getStatusColor(currentStatus)}>
                {currentStatus}
              </span>
              . What would you like to do?
            </>
          ) : (
            <>
              This exchange has been <br />
              <span className={getStatusColor(currentStatus)}>
                {currentStatus}
              </span>
            </>
          )}
        </p>

        {error && (
          <div className="mt-3 text-center text-red-600 text-sm">{error}</div>
        )}

        <div className="text-md mt-4 flex items-center justify-center gap-4 text-gray-700">
          {renderStatusOptions()}
        </div>

        {showConfirmButtons && (
          <div className="mt-7 flex justify-center space-x-4 font-medium tracking-wide">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-300 px-4 py-2 text-primaryText transition duration-150 hover:bg-gray-400"
            >
              Cancel
            </button>

            {statusLoading || isLoading ? (
              <button className="rounded-lg bg-primary px-4 text-white bg-blue-700">
                <ModalButtonLoader />
              </button>
            ) : (
              <button
                onClick={handleChange}
                className="rounded-lg bg-primary px-4 py-2 bg-blue-700 text-white transition duration-150 hover:bg-hoverPrimary"
                disabled={!selectedStatus}
              >
                Yes, Change
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeStatusModal;
