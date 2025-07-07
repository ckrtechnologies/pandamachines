import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import soldOut from "../../../Assets/img/common/soldout.gif";
import Cross from "../../../Assets/img/common/cross.gif";
import prodAvail from "../../../Assets/img/common/ProdAvail.gif";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import axios from "axios";

const StockChangeModal = ({
  isOpen,
  onClose,
  cHngModalData,
  getAllProducts,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (isOpen && cHngModalData?.prod_status) {
      const currentStatus = cHngModalData.prod_status;

      if (currentStatus === "active") {
        setSelectedStatus("out of stock");
      } else if (currentStatus === "inactive") {
        setSelectedStatus("active");
      } else if (currentStatus === "out of stock") {
        setSelectedStatus("active");
      }
    }
  }, [isOpen, cHngModalData?.prod_status]);

  const getCurrentStatusDisplay = (status) => {
    switch (status) {
      case "active":
        return { text: "Available in Stock", color: "text-green-700" };
      case "inactive":
        return { text: "Inactive", color: "text-yellow-600" };
      case "out of stock":
        return { text: "Out Of Stock", color: "text-red-700" };
      default:
        return { text: "Unknown", color: "text-gray-700" };
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    const allStatuses = [
      { value: "active", label: "In Stock", color: "text-green-700" },
      { value: "inactive", label: "Inactive", color: "text-yellow-600" },
      { value: "out of stock", label: "Out Of Stock", color: "text-red-700" },
    ];

    return allStatuses.filter((status) => status.value !== currentStatus);
  };

  const handleChange = () => {
    if (!selectedStatus) return;

    let data = JSON.stringify({
      stock_status: selectedStatus,
    });

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/products/change-stock-status/${cHngModalData?.prod_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    setIsLoading(true);
    axios
      .request(config)
      .then((response) => {
        getAllProducts();
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

  const currentStatus = getCurrentStatusDisplay(cHngModalData?.prod_status);
  const availableStatuses = getAvailableStatuses(cHngModalData?.prod_status);

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
        >
          <MdClose size={22} />
        </button>

        <div className="mb-2 flex justify-center text-red-800">
          {cHngModalData?.prod_status === "inactive" ? (
            <img src={Cross} alt="icon" className="h-20 w-auto" />
          ) : cHngModalData?.prod_status === "active" ? (
            <img src={prodAvail} alt="icon" className="h-20 w-auto" />
          ) : (
            <img src={soldOut} alt="icon" className="h-20 w-auto" />
          )}
        </div>

        <p className="text-md text-center tracking-wide">
          Current Status -{" "}
          <span className={`font-semibold ${currentStatus.color}`}>
            {currentStatus.text}
          </span>
        </p>

        <h2 className="mt-4 text-center text-2xl font-semibold tracking-wide text-gray-900">
          Change the stock status
        </h2>

        <div className="mt-4">
          <p className="text-md mb-3 text-center tracking-wide text-gray-700">
            Select new status:
          </p>

          <div className="flex justify-evenly items-center">
            {availableStatuses.map((status) => (
              <label
                key={status.value}
                className={`flex cursor-pointer items-center rounded-lg ${
                  selectedStatus === status.value
                }`}
              >
                <input
                  type="radio"
                  name="stockStatus"
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
              Ok, Change
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockChangeModal;
