import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import axios from "axios";

const BlockSupplierModal = ({
  isOpen,
  onClose,
  modalData,
  refreshSuppliers,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (isOpen && modalData) {
      setIsBlocked(modalData?.isBlocked || false);
      setReason("");
    }
  }, [isOpen, modalData]);

  const handleBlockChange = () => {
    if (isBlocked) {
      // Unblock supplier
      unblockSupplier();
    } else {
      // Block supplier
      blockSupplier();
    }
  };

  const blockSupplier = async () => {
    try {
      setIsLoading(true);
      const data = {
        ...(reason && { reason }), // Include reason only if provided
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/supplier/block-supplier/${modalData?._id}`,
        data
      );

      if (response.data.success) {
        refreshSuppliers();
        onClose();
        setReason("");
      }
    } catch (error) {
      console.error("Error blocking supplier:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unblockSupplier = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/supplier/unblock-supplier/${modalData?._id}`
      );

      if (response.data.success) {
        refreshSuppliers();
        onClose();
        setReason("");
      }
    } catch (error) {
      console.error("Error unblocking supplier:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

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
          {isBlocked ? "🚫" : "✅"}
        </div>

        <p className="text-md text-center tracking-wide">
          Current Status -{" "}
          <span
            className={`font-semibold ${
              isBlocked ? "text-red-600" : "text-green-600"
            }`}
          >
            {isBlocked ? "Blocked" : "Unblocked"}
          </span>
        </p>

        <h2 className="mt-4 text-center text-2xl font-semibold tracking-wide text-gray-900">
          {isBlocked ? "Unblock Seller" : "Block Seller"}
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

        <div className="mt-6">
          {!isBlocked && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for blocking..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows="4"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can provide a reason, but it's not required
              </p>
            </div>
          )}

          <p
            className={`text-md text-center tracking-wide ${
              isBlocked ? "text-green-700" : "text-red-700"
            }`}
          >
            Are you sure you want to{" "}
            <span className="font-semibold">
              {isBlocked ? "unblock" : "block"}
            </span>{" "}
            this supplier?
          </p>
        </div>

        <div className="mt-7 flex justify-center space-x-4 font-medium tracking-wide">
          <button
            onClick={handleClose}
            className="rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition duration-150 hover:bg-gray-400"
          >
            Cancel
          </button>

          {isLoading ? (
            <button
              className={`rounded-lg px-4 py-2 text-white ${
                isBlocked ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <ModalButtonLoader />
            </button>
          ) : (
            <button
              onClick={handleBlockChange}
              className={`rounded-lg px-4 py-2 text-white transition duration-150 ${
                isBlocked
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Yes, {isBlocked ? "Unblock" : "Block"} Seller
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockSupplierModal;
