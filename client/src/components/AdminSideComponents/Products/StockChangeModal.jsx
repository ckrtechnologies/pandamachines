import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import soldOut from "../../../Assets/img/common/soldout.gif";
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

  const handleChange = () => {
    let data = JSON.stringify({
      stock_status:
        cHngModalData?.prod_status === "active" ? "out of stock" : "active",
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
        // console.log(JSON.stringify(response.data));
        getAllProducts();
        setIsLoading(false);
        onClose();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

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

        <div className="mb-2 flex justify-center text-red-800">
          {cHngModalData?.prod_status === "active" ? (
            <img src={prodAvail} className="h-20 w-auto" alt="icon" />
          ) : (
            <img src={soldOut} className="h-20 w-auto" alt="icon" />
          )}
        </div>

        <p className="text-md text-center tracking-wide">
          Current Status -{" "}
          {cHngModalData?.prod_status === "active" ? (
            <span className="font-semibold text-green-700">
              Available in Stock
            </span>
          ) : (
            <span className="font-semibold text-red-700">Out Of Stock</span>
          )}
        </p>

        <h2 className="mt-4 text-center text-2xl font-semibold tracking-wide text-gray-900">
          Change the stock status
        </h2>

        <p className="text-md mt-4 text-center tracking-wide text-gray-700">
          Are you sure you want to change the product status to{" "}
          <span className="capitalize ">
            {cHngModalData?.prod_status === "active" ? (
              <span className="font-semibold text-red-700">Out Of Stock</span>
            ) : (
              <span className="font-semibold text-green-700">
                Available in Stock
              </span>
            )}
            ?
          </span>
        </p>

        <div className="mt-7 flex justify-center space-x-4 font-medium tracking-wide">
          <button
            onClick={onClose}
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
              className="rounded-lg bg-primaryBtnColor px-4 py-2 text-white transition duration-150 hover:bg-primaryBtnHoverColor"
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
