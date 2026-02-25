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
  const [selectedVariant, setSelectedVariant] = useState(null);
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    dataById();
  }, []);

  useEffect(() => {
    if (ProductDetails?.hasVariants && ProductDetails?.variants?.length > 0) {
      const defaultVariant = ProductDetails.variants.find((v) => v.isDefault);
      setSelectedVariant(defaultVariant || ProductDetails.variants[0]);
    }
  }, [ProductDetails]);

  const handleDeleteItems = (sid, sname) => {
    setDltContent({ dltId: sid, dltName: sname });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = () => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/products/delete-product/${id}`,
      headers: {},
      data: "",
    };
    setDltLoading(true);

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response?.data));
        navigate(-1);
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
  const getCurrentPrice = () => {
    if (ProductDetails?.hasVariants && selectedVariant) {
      return {
        price: selectedVariant.price,
        previous_price: selectedVariant.previous_price,
      };
    }
    // Handle single size type
    if (ProductDetails?.size_type === "single" || !ProductDetails?.size_type) {
      return {
        price: ProductDetails?.price,
        previous_price: ProductDetails?.previous_price,
      };
    }
    // Handle multiple size type - find highest price or return null/range
    if (
      ProductDetails?.size_type === "multiple" &&
      ProductDetails?.price_by_measurement?.[0]?.allPrice?.length > 0
    ) {
      const allPrices = ProductDetails.price_by_measurement[0].allPrice;
      // You might want to show a range or "Starts from", but for now let's show the highest
      // or just return null and let renderPriceSection handle it differently
      const maxPriceItem = allPrices.reduce(
        (max, item) => (Number(item.price) > Number(max.price) ? item : max),
        allPrices[0]
      );
      return {
        price: maxPriceItem.price,
        previous_price: maxPriceItem.previous_price,
        isMultiple: true,
      };
    }

    return {
      price: ProductDetails?.price,
      previous_price: ProductDetails?.previous_price,
      gstPercentage: ProductDetails?.gstPercentage || 0,
    };
  };

  const renderPriceSection = () => {
    const { price, previous_price, isMultiple } = getCurrentPrice();

    if (
      ProductDetails?.size_type === "multiple" &&
      ProductDetails?.price_by_measurement?.[0]?.allPrice?.length > 0
    ) {
      const measurementLabel =
        ProductDetails.price_by_measurement[0].measurementLabel || "Size";
      const allPrices = ProductDetails.price_by_measurement[0].allPrice;

      return (
        <div className="my-4 rounded-xl bg-white p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Prices by {measurementLabel}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {measurementLabel}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allPrices.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {item.measurement}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      ₹{Number(item.price) + (Number(item.price) * (ProductDetails?.gstPercentage || 0) / 100)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 line-through">
                      {item.previous_price ? `₹${item.previous_price}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="my-2">
        <p className="text-md text-green-700">Special Price</p>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold">₹ {Number(price) + (Number(price) * (Number(ProductDetails?.gstPercentage) || 0) / 100)}</p>
              {previous_price && (
                <p className="text-gray-700 line-through">₹{Number(previous_price) + (Number(previous_price) * (Number(ProductDetails?.gstPercentage) || 0) / 100)}</p>
              )}
            </div>
            <p className="text-[10px] text-green-600 font-semibold mt-0.5">
              Included GST {ProductDetails?.gstPercentage || 0}%
            </p>
          </div>
      </div>
    );
  };

  const renderVariantSelector = () => {
    if (!ProductDetails?.hasVariants || !ProductDetails?.variants?.length) {
      return null;
    }

    return (
      <div className="my-4 rounded-xl bg-white p-4 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Select Variant
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {ProductDetails.variants.map((variant, index) => (
            <button
              key={index}
              onClick={() => setSelectedVariant(variant)}
              className={`p-3 rounded-lg border-2 transition ${
                selectedVariant?.model === variant.model
                  ? "border-primaryColor bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-left">
                <p className="font-semibold text-gray-800">{variant.model}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-green-700">
                    ₹{Number(variant.price) + (Number(variant.price) * (Number(ProductDetails?.gstPercentage) || 0) / 100)}
                  </span>
                  {variant.previous_price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{variant.previous_price}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
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
      <div className="mt-4 rounded-xl bg-white pb-6 shadow-md">
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

  const renderHowToBuySteps = () => {
    const howToBuy = ProductDetails?.howToBuy;
    // Check if howToBuy exists and is enabled
    if (!howToBuy || !howToBuy.enabled || !howToBuy.steps || howToBuy.steps.length === 0) {
      return null;
    }

    const activeSteps = howToBuy.steps
      .filter((step) => step.isActive)
      .sort((a, b) => a.stepNo - b.stepNo);

    if (activeSteps.length === 0) return null;

    return (
      <div className="mt-4 rounded-xl bg-white shadow-md pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 px-4 pt-4">
          How To Buy
        </h2>
        <div className="grid grid-cols-1 gap-4 pt-4 px-4">
          {activeSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primaryColor text-white font-bold text-sm">
                {step.stepNo}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{step.title}</p>
                <p className="text-gray-600 text-sm">{step.desc}</p>
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

        <div className="flex items-center gap-4 ">
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
          <div className="h-80 w-full rounded-xl bg-white p-3 shadow-md flex items-center justify-center">
            {Array.isArray(ProductDetails?.images) &&
            ProductDetails.images.length > 0 ? (
              <img
                src={ProductDetails?.images[selectedImageIndex]}
                alt="Product"
                className="h-full w-full object-contain"
              />
            ) : (
              <p className="text-center text-gray-500">No image available</p>
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {Array.isArray(ProductDetails?.images) &&
              ProductDetails?.images.map((imgSrc, index) => (
                <div
                  key={index}
                  className={`h-24 w-full rounded-xl bg-white px-3 shadow-md cursor-pointer overflow-hidden ${
                    index === selectedImageIndex ? "ring-1" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={imgSrc}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
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
                  : ProductDetails?.stock_status === "inactive"
                  ? "bg-yellow-500 hover:bg-yellow-600"
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
                : ProductDetails?.stock_status === "inactive"
                ? "Inactive"
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
            <span>{ProductDetails?.subCategory?.name}</span>{" "}
            <span className="text-primaryColor">➤</span>{" "}
            <span>{ProductDetails?.subSubCategory?.name}</span>
          </h1>

          <div className="text-gray-700 font-medium">
            <span>Uploaded By: </span>
            {ProductDetails?.uploadedBy === "supplier" ? (
              <span>{ProductDetails?.supplier?.businessName}</span>
            ) : (
              <span>Panda machines</span>
            )}
          </div>

          {renderPriceSection()}

          {renderVariantSelector()}

          <h1 className="text-md mb-2">
            + {ProductDetails?.gstPercentage}% GST,{" "}
            {ProductDetails?.extraTaxPercentage}% Extra Tax
            {ProductDetails?.shippingCharge > 0 ? (
              <> and ₹{ProductDetails.shippingCharge} Shipping Fee</>
            ) : (
              <> and Shipping Charge as per actual</>
            )}
            .
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
          {renderHowToBuySteps()}
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

// import React, { useEffect, useState } from "react";
// import { MdArrowBackIos, MdOutlineStarPurple500 } from "react-icons/md";
// import { CiEdit } from "react-icons/ci";
// import { useNavigate } from "react-router-dom";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { FaArrowRight } from "react-icons/fa6";
// import DeleteAlertModal from "../Common/DeleteAlertModal";
// import StockChangeModal from "./StockChangeModal";

// const AdminProductDetails = () => {
//   const [ProductDetails, setProductDetails] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [dltContent, setDltContent] = useState({ dltId: "", dltName: "" });
//   const [dltLoading, setDltLoading] = useState(false);
//   const [stockChangeModalOpen, setStockChangeModalOpen] = useState(false);
//   const [cHngModalData, setCHngModalData] = useState({
//     prod_id: "",
//     prod_status: "",
//   });
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   useEffect(() => {
//     dataById();
//   }, []);

//   const handleDeleteItems = (sid, sname) => {
//     setDltContent({ dltId: sid, dltName: sname });
//     setIsModalOpen(true);
//   };

//   const handleDeleteProduct = () => {
//     let data = "";

//     let config = {
//       method: "delete",
//       maxBodyLength: Infinity,
//       url: `${process.env.REACT_APP_API_URL}/products/delete-product/${id}`,
//       headers: {},
//       data: data,
//     };
//     setDltLoading(true);

//     axios
//       .request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response?.data));
//         navigate(-1);
//         dataById();
//         setDltLoading(false);
//         setIsModalOpen(false);
//       })
//       .catch((error) => {
//         console.log(error);
//         setIsModalOpen(false);
//         setDltLoading(false);
//       });
//   };

//   const dataById = () => {
//     setIsLoading(true);
//     let config = {
//       method: "get",
//       maxBodyLength: Infinity,
//       url: `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${id}`,
//       headers: {},
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response?.data));
//         setProductDetails(response?.data);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.log(error);
//         setIsLoading(false);
//       });
//   };

//   const handleGetStatus = (pid, curent_status) => {
//     setCHngModalData({
//       prod_id: pid,
//       prod_status: curent_status,
//     });
//     setStockChangeModalOpen(true);
//   };

//   const renderPriceSection = () => {
//     return (
//       <div className="my-2">
//         <p className="text-md text-green-700">Special Price</p>
//         <div className="flex items-center gap-3">
//           <p className="text-2xl font-bold">₹ {ProductDetails?.price}</p>
//           <p className="text-gray-700 line-through">
//             ₹{ProductDetails?.previous_price}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   const renderWarrantyInfo = () => {
//     if (ProductDetails?.warranty?.hasWarranty) {
//       return (
//         <div className="my-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
//           <h3 className="text-md font-semibold text-blue-800">
//             Warranty Information
//           </h3>
//           <p className="text-blue-700">
//             ✓ {ProductDetails?.warranty?.warrantyDays} warranty included
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   const renderTradeInfo = () => {
//     const tradeInfo = ProductDetails?.tradeInfo;
//     if (!tradeInfo) return null;

//     return (
//       <div className="mt-4rounded-xl bg-white pb-6 shadow-md">
//         <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
//           Trade Information
//         </h2>
//         <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
//           {tradeInfo.paymentTerms && (
//             <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
//               <FaArrowRight className="text-lg text-primaryColor" />
//               <div>
//                 <p className="font-medium text-gray-800">Payment Terms</p>
//                 <p className="text-gray-600">{tradeInfo.paymentTerms}</p>
//               </div>
//             </div>
//           )}
//           {tradeInfo.deliveryTime && (
//             <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
//               <FaArrowRight className="text-lg text-primaryColor" />
//               <div>
//                 <p className="font-medium text-gray-800">Delivery Time</p>
//                 <p className="text-gray-600">{tradeInfo.deliveryTime}</p>
//               </div>
//             </div>
//           )}
//           {tradeInfo.supplyAbility && (
//             <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
//               <FaArrowRight className="text-lg text-primaryColor" />
//               <div>
//                 <p className="font-medium text-gray-800">Supply Ability</p>
//                 <p className="text-gray-600">{tradeInfo.supplyAbility}</p>
//               </div>
//             </div>
//           )}
//           {tradeInfo.mainDomesticMarket && (
//             <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
//               <FaArrowRight className="text-lg text-primaryColor" />
//               <div>
//                 <p className="font-medium text-gray-800">
//                   Main Domestic Market
//                 </p>
//                 <p className="text-gray-600">{tradeInfo.mainDomesticMarket}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderProductSpecs = () => {
//     const specs = [
//       { label: "Automatic Grade", value: ProductDetails?.automaticGrade },
//       { label: "Control System", value: ProductDetails?.controlSystem },
//       { label: "Product Type", value: ProductDetails?.productType },
//       { label: "Material", value: ProductDetails?.material },
//       { label: "Energy Consumption", value: ProductDetails?.energyConsumption },
//     ].filter((spec) => spec.value);

//     if (specs.length === 0) return null;

//     return (
//       <div className="mt-4 rounded-xl bg-white shadow-md pb-4">
//         <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
//           Product Specifications
//         </h2>
//         <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
//           {specs.map((spec, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:shadow-md"
//             >
//               <FaArrowRight className="text-lg text-primaryColor" />
//               <div>
//                 <p className="font-medium text-gray-800">{spec.label}</p>
//                 <p className="text-gray-600">{spec.value}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="p-4 md:p-6">
//         <div className="mb-4 flex items-center justify-start ">
//           <div
//             onClick={() => navigate(-1)}
//             className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150"
//           >
//             <MdArrowBackIos size={26} />
//           </div>
//           <h1 className="text-xl md:text-2xl font-extrabold text-primaryColor">
//             Product Details
//           </h1>
//         </div>
//         <ProductSkeleton />
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">
//       <div className="mb-2 flex flex-col items-start justify-between sm:flex-row sm:items-center">
//         <div className="mb-4 flex items-center justify-start">
//           <div
//             onClick={() => navigate(-1)}
//             className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150"
//           >
//             <MdArrowBackIos size={26} />
//           </div>
//           <h1 className="text-xl md:text-2xl font-extrabold text-primaryColor">
//             Product Details
//           </h1>
//         </div>

//         <div className="flex  items-center gap-4 ">
//           <button
//             className="flex items-center gap-2 rounded-md bg-primaryBtnColor px-5 py-2 font-semibold text-white shadow hover:bg-primaryBtnHoverColor"
//             onClick={() => navigate(`/edit-products/${ProductDetails?._id}`)}
//           >
//             <CiEdit size={20} />
//             Edit
//           </button>

//           <button
//             className="flex items-center gap-2 rounded-md bg-gray-300 px-5 py-2 font-semibold text-primaryColorColor shadow transition duration-150 hover:bg-gray-400"
//             onClick={() =>
//               handleDeleteItems(ProductDetails?._id, ProductDetails?.name)
//             }
//           >
//             <RiDeleteBin6Line size={20} />
//             Delete
//           </button>
//         </div>
//       </div>

//       <div className="lg:flex lg:gap-6">
//         <div className="top-6 z-10 mb-4 md:sticky lg:w-1/3">
//           {/* <div className="h-auto w-full rounded-xl bg-white p-3 shadow-md">
//             {Array.isArray(ProductDetails?.images) &&
//             ProductDetails.images.length > 0 ? (
//               <img
//                 src={ProductDetails?.images[0]}
//                 alt="Product"
//                 className="h-auto w-full object-cover"
//               />
//             ) : (
//               <p className="text-center text-gray-500">No image available</p>
//             )}
//           </div>

//           <div className="mt-4 grid grid-cols-3 gap-4">
//             {Array.isArray(ProductDetails?.images) &&
//               ProductDetails?.images.map((imgSrc, index) => (
//                 <img
//                   key={index}
//                   src={imgSrc}
//                   alt={`Small Product ${index + 1}`}
//                   className="h-24 w-full rounded-xl bg-white object-contain px-3 shadow-md"
//                 />
//               ))}
//           </div>  */}
//           <div className="h-80 w-full rounded-xl bg-white p-3 shadow-md flex items-center justify-center">
//             {Array.isArray(ProductDetails?.images) &&
//             ProductDetails.images.length > 0 ? (
//               <img
//                 src={ProductDetails?.images[selectedImageIndex]}
//                 alt="Product"
//                 className="h-full w-full object-contain"
//               />
//             ) : (
//               <p className="text-center text-gray-500">No image available</p>
//             )}
//           </div>
//           <div className="mt-4 grid grid-cols-3 gap-4">
//             {Array.isArray(ProductDetails?.images) &&
//               ProductDetails?.images.map((imgSrc, index) => (
//                 <div
//                   key={index}
//                   className={`h-24 w-full rounded-xl bg-white px-3 shadow-md cursor-pointer overflow-hidden ${
//                     index === selectedImageIndex ? "ring-1" : ""
//                   }`}
//                   onClick={() => setSelectedImageIndex(index)}
//                 >
//                   <img
//                     src={imgSrc}
//                     alt={`Thumbnail ${index + 1}`}
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//               ))}
//           </div>

//           <div className="trac mt-4 flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
//             <span className="text-lg font-semibold text-primaryColorColor">
//               Stock Availability
//             </span>
//             <button
//               className={`rounded-lg px-4 py-2 font-medium text-white ${
//                 ProductDetails?.stock_status === "active"
//                   ? "bg-green-500 hover:bg-green-600"
//                   : ProductDetails?.stock_status === "inactive"
//                   ? "bg-yellow-500 hover:bg-yellow-600"
//                   : "bg-red-500 hover:bg-red-600"
//               }`}
//               onClick={() =>
//                 handleGetStatus(
//                   ProductDetails?._id,
//                   ProductDetails?.stock_status
//                 )
//               }
//             >
//               {ProductDetails?.stock_status === "active"
//                 ? "In Stock"
//                 : ProductDetails?.stock_status === "inactive"
//                 ? "Inactive"
//                 : "Out of Stock"}
//             </button>
//           </div>
//         </div>

//         <div className="overflow-y-hidden pl-4 pt-1 tracking-wide lg:w-2/3 lg:pl-0">
//           <h1 className="text-sm capitalize text-gray-500">
//             {ProductDetails?.pm_id}
//           </h1>

//           <button className="my-2 flex items-center justify-center gap-1 rounded-lg bg-green-700 px-2 py-0.5 text-white">
//             <p className="text-sm">{ProductDetails?.ratings}</p>
//             <MdOutlineStarPurple500 className="text-xs" />
//           </button>

//           <h1 className="text-xl font-semibold capitalize">
//             {ProductDetails?.name} ({ProductDetails?.brand})
//             {ProductDetails?.measurement && ` (${ProductDetails?.measurement})`}
//           </h1>

//           <div className="text-md flex items-center gap-1 capitalize text-gray-700 ">
//             <span className="mt-2 text-2xl">↩</span>
//             {ProductDetails?.return_policy}
//           </div>

//           <h1 className="text-md mb-2 capitalize">
//             <span>{ProductDetails?.category?.name}</span>{" "}
//             <span className="text-primaryColor">➤</span>{" "}
//             <span>{ProductDetails?.subCategory?.name}</span>{" "}
//             <span className="text-primaryColor">➤</span>{" "}
//             <span>{ProductDetails?.subSubCategory?.name}</span>
//           </h1>

//           <div className="text-gray-700 font-medium">
//             <span>Uploaded By: </span>
//             {ProductDetails?.uploadedBy === "supplier" ? (
//               <span>{ProductDetails?.supplier?.businessName}</span>
//             ) : (
//               <span>Panda machine</span>
//             )}
//           </div>

//           {renderPriceSection()}

//           <h1 className="text-md mb-2">
//             + {ProductDetails?.gstPercentage}% GST,{" "}
//             {ProductDetails?.extraTaxPercentage}% Extra Tax
//             {ProductDetails?.shippingCharge > 0 && (
//               <> and ₹{ProductDetails.shippingCharge} Shipping Fee</>
//             )}
//             .
//           </h1>

//           {renderWarrantyInfo()}

//           <div className="rounded-xl bg-white tracking-wide shadow-md">
//             <div className="border-b pb-4 mt-4">
//               <h2 className="text-2xl font-semibold text-gray-800">Features</h2>
//               <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
//                 {Array.isArray(ProductDetails?.features) &&
//                   ProductDetails.features.map((feature, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:shadow-md"
//                     >
//                       <FaArrowRight className="text-lg text-primaryColor" />
//                       <p className="text-gray-700">{feature}</p>
//                     </div>
//                   ))}
//               </div>
//             </div>

//             <div className="mt-3 pb-3">
//               <h2 className="text-2xl font-semibold text-gray-800">
//                 Description
//               </h2>
//               <div className="flex justify-start items-center gap-2">
//                 <FaArrowRight className="text-lg text-primaryColor" />
//                 <p className="mt-2 leading-relaxed text-gray-600 px-2">
//                   {ProductDetails?.description}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {renderProductSpecs()}
//           {renderTradeInfo()}
//         </div>
//       </div>

//       <DeleteAlertModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         dltName={dltContent?.dltName}
//         dltType="Product"
//         onConfirm={handleDeleteProduct}
//         dltLoading={dltLoading}
//       />

//       <StockChangeModal
//         isOpen={stockChangeModalOpen}
//         onClose={() => setStockChangeModalOpen(false)}
//         cHngModalData={cHngModalData}
//         getAllProducts={dataById}
//       />
//     </div>
//   );
// };

// export default AdminProductDetails;

// const ProductSkeleton = () => {
//   return (
//     <div className="w-full animate-pulse">
//       <div className="lg:flex lg:gap-6">
//         <div className="top-6 z-10 mb-4 md:sticky lg:w-1/3">
//           <div className="aspect-square w-full rounded-xl bg-white p-6 shadow-md">
//             <div className="h-full w-full rounded-lg bg-gray-300"></div>
//           </div>

//           <div className="mt-4 grid grid-cols-3 gap-4">
//             {[...Array(3)].map((_, index) => (
//               <div
//                 key={index}
//                 className="aspect-square w-full rounded-xl bg-gray-300"
//               ></div>
//             ))}
//           </div>
//         </div>

//         <div className="max-h-screen overflow-y-auto pl-4 lg:w-2/3 lg:pl-0">
//           <div className="mb-4 h-8 w-3/4 rounded bg-gray-300"></div>

//           <div className="mb-4 flex items-center gap-4">
//             <div className="h-6 w-16 rounded bg-gray-300"></div>
//             <div className="h-6 w-40 rounded bg-gray-300"></div>
//           </div>

//           <div className="mb-4">
//             <div className="mb-2 h-6 w-32 rounded bg-gray-300"></div>
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-32 rounded bg-gray-300"></div>
//               <div className="h-6 w-24 rounded bg-gray-300"></div>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <div className="flex items-center gap-4">
//               <div className="h-6 w-32 rounded bg-gray-300"></div>
//               <div className="h-6 w-16 rounded bg-gray-300"></div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="h-6 w-28 rounded bg-gray-300"></div>
//               <div className="h-6 w-16 rounded bg-gray-300"></div>
//             </div>
//           </div>

//           <div className="mt-6 rounded-xl bg-white">
//             <div className="rounded-t-xl border bg-white px-6 py-4">
//               <div className="h-8 w-48 rounded bg-gray-300"></div>
//             </div>

//             <div className="mt-6 px-6">
//               <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="flex h-16 items-center rounded-xl bg-white p-4 shadow-md"
//                   >
//                     <div className="h-4 w-full rounded bg-gray-300"></div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-6 flex flex-wrap justify-between gap-6 rounded-b-xl border p-4">
//               <div className="h-4 w-full rounded bg-gray-300"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
