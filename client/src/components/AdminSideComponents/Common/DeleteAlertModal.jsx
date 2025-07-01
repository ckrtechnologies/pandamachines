import React from "react";
import { MdClose } from "react-icons/md";
import dltIcon from "../../../Assets/img/common/deleteIcon.gif";
import ModalButtonLoader from "./ModalButtonLoader";

const DeleteAlertModal = ({
  isOpen,
  onClose,
  dltType,
  dltName,
  onConfirm,
  dltLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
        >
          <MdClose size={22} />
        </button>

        <div className="mb-2 flex justify-center text-blue-800">
          <img src={dltIcon} className="h-20 w-auto" alt="dlt-icon" />
        </div>

        <h2 className="text-center text-2xl font-semibold tracking-wide text-gray-900">
          Confirm Deletion
        </h2>

        <p className="text-md mt-4 text-center tracking-wide text-gray-700">
          Are you sure you want to delete this {dltType} -{" "}
          <span className="font-semibold capitalize text-primary">
            {dltName}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-7 flex justify-center space-x-4 font-medium tracking-wide">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2 text-primaryColor transition duration-150 hover:bg-gray-400"
          >
            Cancel
          </button>

          {dltLoading ? (
            <button className="rounded-lg bg-primaryBtnColor px-4 text-white">
              <ModalButtonLoader />
            </button>
          ) : (
            <button
              onClick={onConfirm}
              className="rounded-lg bg-primaryBtnColor px-4 py-2 text-white transition duration-150 hover:bg-primaryBtnHoverColor"
            >
              Ok, Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAlertModal;
