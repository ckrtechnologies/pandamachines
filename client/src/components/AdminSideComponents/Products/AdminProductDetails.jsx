import React, { useEffect, useState } from "react";
import { MdArrowBackIos, MdOutlineStarPurple500 } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa6";
import DeleteAlertModal from "../Common/DeleteAlertModal";
import StockChangeModal from "./StockChangeModal";

const AdminProductDetails = () => {
  const [ProductDetails, setProductDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dltContent, setDltContent] = useState({ dltId: "", dltName: "" });
  const [dltLoading, setDltLoading] = useState(false);
  const [stockChangeModalOpen, setStockChangeModalOpen] = useState(false);
  const [cHngModalData, setCHngModalData] = useState({
    prod_id: "",
    prod_status: "",
  });

  useEffect(() => {
    dataById();
  }, []);

  const handleDeleteItems = (sid, sname) => {
    setDltContent({ dltId: sid, dltName: sname });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = () => {
    let data = "";

    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/products/delete-product/${id}`,
      headers: {},
      data: data,
    };
    setDltLoading(true);

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response?.data));
        navigate(-1);
        dataById();
        setDltLoading(false);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setIsModalOpen(false);
        setDltLoading(false);
      });
  };

  const dataById = () => {
    setIsLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response?.data));
        setProductDetails(response?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleGetStatus = (pid, curent_status) => {
    setCHngModalData({
      prod_id: pid,
      prod_status: curent_status,
    });
    setStockChangeModalOpen(true);
  };

  const renderPriceSection = () => {
    return (
      <div className="my-2">
        <p className="text-md text-green-700">Special Price</p>
        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold">₹ {ProductDetails?.price}</p>
          <p className="text-gray-700 line-through">
            ₹{ProductDetails?.previous_price}
          </p>
        </div>
      </div>
    );
  };

  const renderWarrantyInfo = () => {
    if (ProductDetails?.warranty?.hasWarranty) {
      return (
        <div className="my-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-md font-semibold text-blue-800">
            Warranty Information
          </h3>
          <p className="text-blue-700">
            ✓ {ProductDetails?.warranty?.warrantyDays} warranty included
          </p>
        </div>
      );
    }
    return null;
  };

  const renderTradeInfo = () => {
    const tradeInfo = ProductDetails?.tradeInfo;
    if (!tradeInfo) return null;

    return (
      <div className="mt-4rounded-xl bg-white pb-6 shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
          Trade Information
        </h2>
        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
          {tradeInfo.paymentTerms && (
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <FaArrowRight className="text-lg text-primaryColor" />
              <div>
                <p className="font-medium text-gray-800">Payment Terms</p>
                <p className="text-gray-600">{tradeInfo.paymentTerms}</p>
              </div>
            </div>
          )}
          {tradeInfo.deliveryTime && (
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <FaArrowRight className="text-lg text-primaryColor" />
              <div>
                <p className="font-medium text-gray-800">Delivery Time</p>
                <p className="text-gray-600">{tradeInfo.deliveryTime}</p>
              </div>
            </div>
          )}
          {tradeInfo.supplyAbility && (
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <FaArrowRight className="text-lg text-primaryColor" />
              <div>
                <p className="font-medium text-gray-800">Supply Ability</p>
                <p className="text-gray-600">{tradeInfo.supplyAbility}</p>
              </div>
            </div>
          )}
          {tradeInfo.mainDomesticMarket && (
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <FaArrowRight className="text-lg text-primaryColor" />
              <div>
                <p className="font-medium text-gray-800">
                  Main Domestic Market
                </p>
                <p className="text-gray-600">{tradeInfo.mainDomesticMarket}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProductSpecs = () => {
    const specs = [
      { label: "Automatic Grade", value: ProductDetails?.automaticGrade },
      { label: "Control System", value: ProductDetails?.controlSystem },
      { label: "Product Type", value: ProductDetails?.productType },
      { label: "Material", value: ProductDetails?.material },
      { label: "Energy Consumption", value: ProductDetails?.energyConsumption },
    ].filter((spec) => spec.value);

    if (specs.length === 0) return null;

    return (
      <div className="mt-4 rounded-xl bg-white shadow-md pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
          Product Specifications
        </h2>
        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
          {specs.map((spec, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:shadow-md"
            >
              <FaArrowRight className="text-lg text-primaryColor" />
              <div>
                <p className="font-medium text-gray-800">{spec.label}</p>
                <p className="text-gray-600">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-4 flex items-center justify-start ">
          <div
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150"
          >
            <MdArrowBackIos size={26} />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-primaryColor">
            Product Details
          </h1>
        </div>
        <ProductSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-2 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <div className="mb-4 flex items-center justify-start">
          <div
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150"
          >
            <MdArrowBackIos size={26} />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-primaryColor">
            Product Details
          </h1>
        </div>

        <div className="flex  items-center gap-4 ">
          <button
            className="flex items-center gap-2 rounded-md bg-primaryBtnColor px-5 py-2 font-semibold text-white shadow hover:bg-primaryBtnHoverColor"
            onClick={() => navigate(`/edit-products/${ProductDetails?._id}`)}
          >
            <CiEdit size={20} />
            Edit
          </button>

          <button
            className="flex items-center gap-2 rounded-md bg-gray-300 px-5 py-2 font-semibold text-primaryColorColor shadow transition duration-150 hover:bg-gray-400"
            onClick={() =>
              handleDeleteItems(ProductDetails?._id, ProductDetails?.name)
            }
          >
            <RiDeleteBin6Line size={20} />
            Delete
          </button>
        </div>
      </div>

      <div className="lg:flex lg:gap-6">
        <div className="top-6 z-10 mb-4 md:sticky lg:w-1/3">
          <div className="h-auto w-full rounded-xl bg-white p-3 shadow-md">
            {Array.isArray(ProductDetails?.images) &&
            ProductDetails.images.length > 0 ? (
              <img
                src={ProductDetails?.images[0]}
                alt="Product"
                className="h-auto w-full object-cover"
              />
            ) : (
              <p className="text-center text-gray-500">No image available</p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {Array.isArray(ProductDetails?.images) &&
              ProductDetails?.images.map((imgSrc, index) => (
                <img
                  key={index}
                  src={imgSrc}
                  alt={`Small Product ${index + 1}`}
                  className="h-24 w-full rounded-xl bg-white object-contain px-3 shadow-md"
                />
              ))}
          </div>

          <div className="trac mt-4 flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
            <span className="text-lg font-semibold text-primaryColorColor">
              Stock Availability
            </span>
            <button
              className={`rounded-lg px-4 py-2 font-medium text-white ${
                ProductDetails?.stock_status === "active"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={() =>
                handleGetStatus(
                  ProductDetails?._id,
                  ProductDetails?.stock_status
                )
              }
            >
              {ProductDetails?.stock_status === "active"
                ? "In Stock"
                : "Out of Stock"}
            </button>
          </div>
        </div>

        <div className="overflow-y-hidden pl-4 pt-1 tracking-wide lg:w-2/3 lg:pl-0">
          <h1 className="text-sm capitalize text-gray-500">
            {ProductDetails?.pm_id}
          </h1>

          <button className="my-2 flex items-center justify-center gap-1 rounded-lg bg-green-700 px-2 py-0.5 text-white">
            <p className="text-sm">{ProductDetails?.ratings}</p>
            <MdOutlineStarPurple500 className="text-xs" />
          </button>

          <h1 className="text-xl font-semibold capitalize">
            {ProductDetails?.name} ({ProductDetails?.brand})
            {ProductDetails?.measurement && ` (${ProductDetails?.measurement})`}
          </h1>

          <div className="text-md flex items-center gap-1 capitalize text-gray-700 ">
            <span className="mt-2 text-2xl">↩</span>
            {ProductDetails?.return_policy}
          </div>

          <h1 className="text-md mb-2 capitalize">
            <span>{ProductDetails?.category?.name}</span>{" "}
            <span className="text-primaryColor">➤</span>{" "}
            <span>{ProductDetails?.subCategory?.name}</span>
          </h1>

          {renderPriceSection()}

          <h1 className="text-md mb-2">
            + {ProductDetails?.gstPercentage}% GST,{" "}
            {ProductDetails?.extraTaxPercentage}% Extra Tax and ₹
            {ProductDetails?.shippingCharge} Shipping Fee.
          </h1>

          {renderWarrantyInfo()}

          <div className="rounded-xl bg-white tracking-wide shadow-md">
            <div className="border-b pb-4 mt-4">
              <h2 className="text-2xl font-semibold text-gray-800">Features</h2>
              <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(ProductDetails?.features) &&
                  ProductDetails.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:shadow-md"
                    >
                      <FaArrowRight className="text-lg text-primaryColor" />
                      <p className="text-gray-700">{feature}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-3 pb-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                Description
              </h2>
              <div className="flex justify-start items-center gap-2">
                <FaArrowRight className="text-lg text-primaryColor" />
                <p className="mt-2 leading-relaxed text-gray-600 px-2">
                  {ProductDetails?.description}
                </p>
              </div>
            </div>
          </div>

          {renderProductSpecs()}
          {renderTradeInfo()}
        </div>
      </div>

      <DeleteAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dltName={dltContent?.dltName}
        dltType="Product"
        onConfirm={handleDeleteProduct}
        dltLoading={dltLoading}
      />

      <StockChangeModal
        isOpen={stockChangeModalOpen}
        onClose={() => setStockChangeModalOpen(false)}
        cHngModalData={cHngModalData}
        getAllProducts={dataById}
      />
    </div>
  );
};

export default AdminProductDetails;

const ProductSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="lg:flex lg:gap-6">
        <div className="top-6 z-10 mb-4 md:sticky lg:w-1/3">
          <div className="aspect-square w-full rounded-xl bg-white p-6 shadow-md">
            <div className="h-full w-full rounded-lg bg-gray-300"></div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="aspect-square w-full rounded-xl bg-gray-300"
              ></div>
            ))}
          </div>
        </div>

        <div className="max-h-screen overflow-y-auto pl-4 lg:w-2/3 lg:pl-0">
          <div className="mb-4 h-8 w-3/4 rounded bg-gray-300"></div>

          <div className="mb-4 flex items-center gap-4">
            <div className="h-6 w-16 rounded bg-gray-300"></div>
            <div className="h-6 w-40 rounded bg-gray-300"></div>
          </div>

          <div className="mb-4">
            <div className="mb-2 h-6 w-32 rounded bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-32 rounded bg-gray-300"></div>
              <div className="h-6 w-24 rounded bg-gray-300"></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-6 w-32 rounded bg-gray-300"></div>
              <div className="h-6 w-16 rounded bg-gray-300"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-6 w-28 rounded bg-gray-300"></div>
              <div className="h-6 w-16 rounded bg-gray-300"></div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-white">
            <div className="rounded-t-xl border bg-white px-6 py-4">
              <div className="h-8 w-48 rounded bg-gray-300"></div>
            </div>

            <div className="mt-6 px-6">
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex h-16 items-center rounded-xl bg-white p-4 shadow-md"
                  >
                    <div className="h-4 w-full rounded bg-gray-300"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-6 rounded-b-xl border p-4">
              <div className="h-4 w-full rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
