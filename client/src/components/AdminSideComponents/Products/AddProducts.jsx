import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdArrowBackIos, MdDelete, MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import CategoryModal from "../Category/CategoryModal";
import AddSubCategoryModal from "../Sub-category/AddSubCategoryModal";
import AdminAddSubSubCategoryModal from "../Sub-SubCategory/AdminAddSubSubCategorymodal";

const AddProducts = () => {
  const navigate = useNavigate();

  const adminData = localStorage.getItem("pm-admin-data");
  const supplierData = localStorage.getItem("pm-supplier-data");
  const isAdmin = adminData !== null;

  const supplierInfo = supplierData ? JSON.parse(supplierData) : null;
  const supplierId = supplierInfo ? supplierInfo._id : null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    brand: "",
    images: [],
    ratings: 5,
    features: [],
    stock_status: "active",
    return_policy: "",
    gstPercentage: "",
    extraTaxPercentage: "",
    shippingType: "free",
    shippingCharge: 0,
    measurement: "",
    warranty: {
      hasWarranty: false,
      warrantyDays: "",
    },
    automaticGrade: "",
    controlSystem: "",
    demo_video: "",
    production_video: "",
    productType: "",
    material: "",
    energyConsumption: "",
    tradeInfo: {
      paymentTerms: "",
      deliveryTime: "",
      supplyAbility: "",
      mainDomesticMarket: "",
    },
    // Size Type
    size_type: "single",

    // Single Price Fields
    price: "",
    previous_price: "",

    // Multiple Prices by Measurement
    price_by_measurement: [
      {
        measurementLabel: "Size",
        allPrice: [],
      },
    ],
    uploadedBy: isAdmin ? "admin" : "supplier",
    supplier: isAdmin ? "" : supplierId || "",
    hasVariants: false,
    variants: [],
    // How To Buy Steps
    howToBuy: {
      enabled: true,
      showLimit: 4,
      steps: [
        { stepNo: 1, title: "", desc: "", isActive: true },
        { stepNo: 2, title: "", desc: "", isActive: true },
        { stepNo: 3, title: "", desc: "", isActive: true },
        { stepNo: 4, title: "", desc: "", isActive: true },
      ],
    },
  });
  const [videoType, setVideoType] = useState({
    demo: "link",
    production: "link",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isSubSubCategoryModalOpen, setIsSubSubCategoryModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/categories/get-all-categories`,
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    if (!formData.category) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${formData.category}`,
      );
      setSubCategories(response.data.subCategories || response.data);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    }
  };

  const fetchSubSubCategories = async () => {
    if (!formData.subCategory) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${formData.subCategory}`,
      );
      setSubSubCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch sub-sub-categories:", error);
      setSubSubCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);

  useEffect(() => {
    if (formData.subCategory) {
      fetchSubSubCategories();
    } else {
      setSubSubCategories([]);
    }
  }, [formData.subCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData({
        ...formData,
        [name]: value,
        subCategory: "",
        subSubCategory: "",
      });
    } else if (name === "subCategory") {
      setFormData({
        ...formData,
        [name]: value,
        subSubCategory: "",
      });
    } else if (name === "size_type") {
      setFormData({
        ...formData,
        size_type: value,
        price: "", // Reset single price
        previous_price: "", // Reset single previous price
        // Reset multiple price if needed, or keep it
      });
    } else if (name === "shippingType") {
      setFormData({
        ...formData,
        [name]: value,
        shippingCharge: value === "extra" ? formData.shippingCharge : 0,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePriceByMeasurementChange = (index, field, value) => {
    const updatedPriceByMeasurement = [...formData.price_by_measurement];
    updatedPriceByMeasurement[0].allPrice[index][field] = value;
    setFormData({
      ...formData,
      price_by_measurement: updatedPriceByMeasurement,
    });
  };

  const addPriceByMeasurement = () => {
    const updatedPriceByMeasurement = [...formData.price_by_measurement];
    updatedPriceByMeasurement[0].allPrice.push({
      measurement: "",
      price: "",
      previous_price: "",
    });
    setFormData({
      ...formData,
      price_by_measurement: updatedPriceByMeasurement,
    });
  };

  const removePriceByMeasurement = (index) => {
    const updatedPriceByMeasurement = [...formData.price_by_measurement];
    updatedPriceByMeasurement[0].allPrice.splice(index, 1);
    setFormData({
      ...formData,
      price_by_measurement: updatedPriceByMeasurement,
    });
  };

  const handleMeasurementLabelChange = (e) => {
    const updatedPriceByMeasurement = [...formData.price_by_measurement];
    updatedPriceByMeasurement[0].measurementLabel = e.target.value;
    setFormData({
      ...formData,
      price_by_measurement: updatedPriceByMeasurement,
    });
  };

  const handleWarrantyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      warranty: {
        ...formData.warranty,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  const handleTradeInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      tradeInfo: {
        ...formData.tradeInfo,
        [name]: value,
      },
    });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === "isDefault" ? value : value,
    };

    if (field === "isDefault" && value) {
      updatedVariants.forEach((variant, i) => {
        if (i !== index) {
          variant.isDefault = false;
        }
      });
    }

    setFormData({ ...formData, variants: updatedVariants });
  };

  // How To Buy Handlers
  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...formData.howToBuy.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setFormData({
      ...formData,
      howToBuy: { ...formData.howToBuy, steps: updatedSteps },
    });
  };

  const addStep = () => {
    const newStep = {
      stepNo: formData.howToBuy.steps.length + 1,
      title: "",
      desc: "",
      isActive: true,
    };
    setFormData({
      ...formData,
      howToBuy: {
        ...formData.howToBuy,
        steps: [...formData.howToBuy.steps, newStep],
      },
    });
  };

  const removeStep = (index) => {
    const updatedSteps = formData.howToBuy.steps.filter((_, i) => i !== index);
    // Re-index steps
    const reindexedSteps = updatedSteps.map((step, i) => ({
      ...step,
      stepNo: i + 1,
    }));
    setFormData({
      ...formData,
      howToBuy: { ...formData.howToBuy, steps: reindexedSteps },
    });
  };

  const toggleHowToBuy = () => {
    setFormData({
      ...formData,
      howToBuy: {
        ...formData.howToBuy,
        enabled: !formData.howToBuy.enabled,
      },
    });
  };

  const handleVideoUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError("Video file size should be less than 25MB");
      return;
    }

    setLoading(true);

    try {
      const formDataVideo = new FormData();
      formDataVideo.append("file", file);
      formDataVideo.append(
        "upload_preset",
        process.env.REACT_APP_UPLOAD_PRESET,
      );
      formDataVideo.append("resource_type", "video");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/video/upload`,
        formDataVideo,
      );

      setFormData({
        ...formData,
        [field]: response.data.secure_url,
      });
    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
      setError(`Failed to upload ${field}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoInputChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const isYouTubeLink = (url) => {
    if (!url) return false;
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const addVariant = () => {
    const newVariant = {
      model: "",
      price: "",
      previous_price: "",
      isDefault: formData.variants.length === 0,
    };
    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    if (
      updatedVariants.length > 0 &&
      !updatedVariants.some((v) => v.isDefault)
    ) {
      updatedVariants[0].isDefault = true;
    }
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);

    try {
      const uploadedImages = [...formData.images];

      for (let file of files) {
        const formDataImg = new FormData();
        formDataImg.append("file", file);
        formDataImg.append(
          "upload_preset",
          process.env.REACT_APP_UPLOAD_PRESET,
        );

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
          formDataImg,
        );

        uploadedImages.push(response.data.secure_url);
      }

      setFormData((prevState) => ({
        ...prevState,
        images: uploadedImages,
      }));

      setImagePreviews(uploadedImages);
    } catch (error) {
      console.error("Error uploading images:", error);
      setError("Failed to upload images");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const productData = {
      ...formData,
      features: Array.isArray(formData.features)
        ? formData.features
        : formData.features.split(",").map((item) => item.trim()),
      ratings: Number(formData.ratings) || 0,
      gstPercentage: Number(formData.gstPercentage),
      extraTaxPercentage: Number(formData.extraTaxPercentage) || 0,
      shippingCharge: Number(formData.shippingCharge) || 0,
      warranty: {
        ...formData.warranty,
        warrantyDays: formData.warranty.hasWarranty
          ? formData.warranty.warrantyDays
          : "0 days",
      },
      uploadedBy: formData.uploadedBy,
    };

    if (formData.hasVariants) {
      const variantsProcessed = formData.variants.map((variant) => ({
        model: variant.model,
        price: Number(variant.price),
        previous_price: variant.previous_price
          ? Number(variant.previous_price)
          : undefined,
        isDefault: variant.isDefault,
      }));
      productData.variants = variantsProcessed;
    } else {
      if (formData.size_type === "single") {
        productData.price = Number(formData.price);
        productData.previous_price = Number(formData.previous_price) || 0;
        productData.price_by_measurement = []; // Ensure this is empty for single
      } else if (formData.size_type === "multiple") {
        productData.price = undefined; // Or 0, or handle as per backend requirement (backend seems to allow null if multiple)
        productData.previous_price = undefined;
        // Ensure price_by_measurement is formatted correctly
        productData.price_by_measurement = formData.price_by_measurement.map(
          (item) => ({
            measurementLabel: item.measurementLabel,
            allPrice: item.allPrice.map((p) => ({
              measurement: p.measurement,
              price: Number(p.price),
              previous_price: Number(p.previous_price) || 0,
            })),
          }),
        );
      }
    }

    if (formData.uploadedBy === "supplier") {
      productData.supplier = supplierId;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/products/create-product`,
        productData,
        { headers: { "Content-Type": "application/json" } },
      );

      console.log("Created===>", productData);
      setSuccess("Product added successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.response?.data?.message || "Failed to add product. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between ml-4">
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150 hover:bg-gray-100"
          >
            <MdArrowBackIos size={26} />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-primaryColor">
            Add New Product
          </h1>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        {success && (
          <p className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
            {success}
          </p>
        )}
        {error && (
          <p className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="Enter brand name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Ratings (1 to 5)
            </label>
            <input
              type="number"
              name="ratings"
              value={formData.ratings}
              readOnly
              className="w-full rounded-md border px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0"
            />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Shipping Type
            </label>
            <div className="flex gap-6 items-center p-3 bg-gray-50 rounded-md border border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="shippingType"
                  value="free"
                  checked={formData.shippingType === "free"}
                  onChange={handleChange}
                  className="w-5 h-5 text-primaryColor focus:ring-primaryColor transition-all cursor-pointer"
                />
                <span className={`text-sm font-medium ${formData.shippingType === "free" ? "text-primaryColor font-bold" : "text-gray-600"}`}>Free Shipping</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="shippingType"
                  value="extra"
                  checked={formData.shippingType === "extra"}
                  onChange={handleChange}
                  className="w-5 h-5 text-primaryColor focus:ring-primaryColor transition-all cursor-pointer"
                />
                <span className={`text-sm font-medium ${formData.shippingType === "extra" ? "text-primaryColor font-bold" : "text-gray-600"}`}>Extra Charges</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="shippingType"
                  value="actual"
                  checked={formData.shippingType === "actual"}
                  onChange={handleChange}
                  className="w-5 h-5 text-primaryColor focus:ring-primaryColor transition-all cursor-pointer"
                />
                <span className={`text-sm font-medium ${formData.shippingType === "actual" ? "text-primaryColor font-bold" : "text-gray-600"}`}>As per actual</span>
              </label>
            </div>
          </div>

          {formData.shippingType === "extra" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
                Shipping Charge (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  name="shippingCharge"
                  value={formData.shippingCharge}
                  onChange={handleChange}
                  required={formData.shippingType === "extra"}
                  className="w-full rounded-md border pl-7 pr-3 py-2 border-primaryColor focus:ring-2 focus:ring-primaryColor outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Measurement
            </label>
            <input
              type="text"
              name="measurement"
              value={formData.measurement}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="e.g., 12ft x 18ft"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="mt-1 text-right">
              <span
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-xs text-blue-600 cursor-pointer hover:underline"
              >
                + Create New Category
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Sub-Category
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              required
              disabled={!formData.category}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Select Sub-Category</option>
              {subCategories.length > 0 ? (
                subCategories.map((sub) => (
                  <option key={sub._id || sub.id} value={sub._id || sub.id}>
                    {sub.name}
                  </option>
                ))
              ) : (
                <option disabled>No sub-categories available</option>
              )}
            </select>
            {formData.category && (
              <div className="mt-1 text-right">
                <span
                  onClick={() => setIsSubCategoryModalOpen(true)}
                  className="text-xs text-blue-600 cursor-pointer hover:underline"
                >
                  + Create New Sub-Category
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Sub-Sub-Category
            </label>
            <select
              name="subSubCategory"
              value={formData.subSubCategory}
              onChange={handleChange}
              required
              disabled={!formData.subCategory}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Select Sub-Sub-Category</option>
              {subSubCategories.length > 0 ? (
                subSubCategories.map((subSub) => (
                  <option key={subSub._id} value={subSub._id}>
                    {subSub.name}
                  </option>
                ))
              ) : (
                <option disabled>No sub-sub-categories available</option>
              )}
            </select>
            {formData.subCategory && (
              <div className="mt-1 text-right">
                <span
                  onClick={() => setIsSubSubCategoryModalOpen(true)}
                  className="text-xs text-blue-600 cursor-pointer hover:underline"
                >
                  + Create New Sub-Sub-Category
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Stock Status
            </label>
            <select
              name="stock_status"
              value={formData.stock_status}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="active">In Stock</option>
              <option value="out of stock">Out of Stock</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="Enter product description"
              rows="4"
            />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Features (comma-separated)
            </label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="e.g. Waterproof, Lightweight"
            />
          </div>

          {/* How To Buy Steps Section */}
          <div className="col-span-2 rounded border p-4 bg-gray-50 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="howToBuyEnabled"
                  checked={formData.howToBuy.enabled}
                  onChange={toggleHowToBuy}
                  className="h-5 w-5 text-primaryColor focus:ring-primaryColor rounded"
                />
                <label
                  htmlFor="howToBuyEnabled"
                  className="font-semibold text-lg text-gray-800"
                >
                  Enable "How to Buy" Steps
                </label>
              </div>

              {formData.howToBuy.enabled && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Show Limit:
                  </label>
                  <input
                    type="number"
                    value={formData.howToBuy.showLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        howToBuy: {
                          ...formData.howToBuy,
                          showLimit: e.target.value,
                        },
                      })
                    }
                    className="w-20 rounded-md border px-2 py-1 text-sm"
                    min="1"
                  />
                </div>
              )}
            </div>

            {formData.howToBuy.enabled && (
              <div className="space-y-4">
                {formData.howToBuy.steps.map((step, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded border border-gray-200 relative"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-500">
                        Step {step.stepNo}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove Step"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) =>
                            handleStepChange(index, "title", e.target.value)
                          }
                          className="w-full rounded border px-3 py-2 text-sm"
                          placeholder="e.g. Select Product"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Description
                        </label>
                        <textarea
                          value={step.desc}
                          onChange={(e) =>
                            handleStepChange(index, "desc", e.target.value)
                          }
                          className="w-full rounded border px-3 py-2 text-sm"
                          placeholder="Short description of this step..."
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center gap-2 text-primaryColor font-semibold hover:underline mt-2"
                >
                  <MdAdd size={20} /> Add Next Step
                </button>
              </div>
            )}
          </div>


          <div className="col-span-2">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasVariants"
                  checked={formData.hasVariants}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      hasVariants: e.target.checked,
                      variants: e.target.checked
                        ? [
                          {
                            model: "",
                            price: "",
                            previous_price: "",
                            isDefault: true,
                          },
                        ]
                        : [],
                    });
                  }}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="hasVariants"
                  className="text-sm font-medium text-primaryColor"
                >
                  This product has multiple variants
                </label>
              </div>
            </div>
          </div>
          {!formData.hasVariants && (
            <>
              <div className="col-span-2">
                <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
                  Size Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="size_type"
                      value="single"
                      checked={formData.size_type === "single"}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    Single Size
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="size_type"
                      value="multiple"
                      checked={formData.size_type === "multiple"}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    Multiple Sizes
                  </label>
                </div>
              </div>

              {formData.size_type === "single" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required={formData.size_type === "single"}
                      className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
                      placeholder="Enter price"
                    />
                    {formData.price && (
                      <div className="mt-1">
                        <p className="text-[10px] font-bold text-green-700">
                          ₹{Number(formData.price) + (Number(formData.price) * (Number(formData.gstPercentage) || 0) / 100)}
                        </p>
                        <p className="text-[8px] text-green-600 font-semibold">
                          Included GST {formData.gstPercentage || 0}%
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
                      Previous Price
                    </label>
                    <input
                      type="number"
                      name="previous_price"
                      value={formData.previous_price}
                      onChange={handleChange}
                      className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
                      placeholder="Enter previous price"
                    />
                  </div>
                </>
              )}

              {formData.size_type === "multiple" && (
                <div className="col-span-2 rounded border p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-3">
                    Price By Measurement
                  </h3>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
                      Measurement Label
                    </label>
                    <input
                      type="text"
                      value={formData.price_by_measurement[0].measurementLabel}
                      onChange={handleMeasurementLabelChange}
                      className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
                      placeholder="e.g., Size, Volume, Weight"
                    />
                  </div>

                  <div className="space-y-3">
                    {formData.price_by_measurement[0].allPrice.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-4 gap-3 items-end bg-white p-3 rounded shadow-sm"
                        >
                          <div>
                            <label className="mb-1 block text-sm font-medium text-primaryColor">
                              Measurement
                            </label>
                            <input
                              type="text"
                              value={item.measurement}
                              onChange={(e) =>
                                handlePriceByMeasurementChange(
                                  index,
                                  "measurement",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border px-3 py-2 text-sm"
                              placeholder="e.g., Small, 1kg"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-primaryColor">
                              Price
                            </label>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handlePriceByMeasurementChange(
                                  index,
                                  "price",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border px-3 py-2 text-sm"
                              placeholder="Enter Price"
                              required
                            />
                            {item.price && (
                              <div className="mt-1">
                                <p className="text-[10px] font-bold text-green-700">
                                  ₹{Number(item.price) + (Number(item.price) * (Number(formData.gstPercentage) || 0) / 100)}
                                </p>
                                <p className="text-[8px] text-green-600 font-semibold">
                                  GST included
                                </p>
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-primaryColor">
                              Previous Price
                            </label>
                            <input
                              type="number"
                              value={item.previous_price}
                              onChange={(e) =>
                                handlePriceByMeasurementChange(
                                  index,
                                  "previous_price",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border px-3 py-2 text-sm"
                              placeholder="Optional"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => removePriceByMeasurement(index)}
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={addPriceByMeasurement}
                    className="mt-3 flex items-center gap-2 bg-primaryBtnColor text-white px-3 py-2 rounded hover:bg-primaryBtnHoverColor"
                  >
                    <MdAdd size={20} />
                    Add Measurement
                  </button>
                </div>
              )}
            </>
          )}
          {formData.hasVariants && (
            <div className="col-span-2">
              <div className="rounded border p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Product Variants</h3>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-2 bg-primaryBtnColor text-white px-3 py-2 rounded hover:bg-primaryBtnHoverColor"
                  >
                    <MdAdd size={20} />
                    Add Variant
                  </button>
                </div>

                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-white rounded border space-y-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Variant {index + 1}</h4>
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MdDelete size={20} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-primaryColor">
                          Model
                        </label>
                        <input
                          type="text"
                          value={variant.model}
                          onChange={(e) =>
                            handleVariantChange(index, "model", e.target.value)
                          }
                          className="w-full rounded-md border px-3 py-2 text-sm"
                          placeholder="e.g., 1000"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-primaryColor">
                          Price
                        </label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, "price", e.target.value)
                          }
                          required
                          className="w-full rounded-md border px-3 py-2 text-sm"
                          placeholder="Enter price"
                        />
                        {variant.price && (
                          <div className="mt-1">
                            <p className="text-[10px] font-bold text-green-700">
                              ₹{Number(variant.price) + (Number(variant.price) * (Number(formData.gstPercentage) || 0) / 100)}
                            </p>
                            <p className="text-[8px] text-green-600 font-semibold">
                              GST included
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-primaryColor">
                          Previous Price
                        </label>
                        <input
                          type="number"
                          value={variant.previous_price}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "previous_price",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-md border px-3 py-2 text-sm"
                          placeholder="Enter previous price"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        checked={variant.isDefault}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "isDefault",
                            e.target.checked,
                          )
                        }
                        className="h-4 w-4"
                      />
                      <label className="text-sm font-medium text-primaryColor">
                        Set as default variant
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              GST (%)
            </label>
            <input
              type="number"
              name="gstPercentage"
              value={formData.gstPercentage}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="Enter GST percentage"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Extra Tax (%) - Optional
            </label>
            <input
              type="number"
              name="extraTaxPercentage"
              value={formData.extraTaxPercentage}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="Enter extra tax (optional)"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Shipping Charges
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="hasShippingCharge"
                checked={formData.shippingCharge !== 0}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    shippingCharge: e.target.checked ? "" : 0,
                  });
                }}
                className="h-4 w-4"
              />
              <label
                htmlFor="hasShippingCharge"
                className="text-sm text-gray-700"
              >
                Add extra shipping charge
              </label>
            </div>
            {formData.shippingCharge !== 0 && (
              <input
                type="number"
                name="shippingCharge"
                value={formData.shippingCharge}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
                placeholder="Enter shipping charges"
                min="0"
              />
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Return Policy
            </label>
            <input
              type="text"
              name="return_policy"
              value={formData.return_policy}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="Enter return policy"
            />
          </div>
          <div className="col-span-2 rounded border p-4">
            <h3 className="mb-3 text-lg font-semibold">Warranty Information</h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasWarranty"
                checked={formData.warranty.hasWarranty}
                onChange={handleWarrantyChange}
                className="h-4 w-4"
              />
              <label className="text-sm font-medium text-primaryColor">
                Has Warranty
              </label>
            </div>
            {formData.warranty.hasWarranty && (
              <div className="mt-2">
                <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
                  Warranty Days
                </label>
                <input
                  type="text"
                  name="warrantyDays"
                  value={formData.warranty.warrantyDays}
                  onChange={handleWarrantyChange}
                  className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
                  placeholder="e.g., 180 days"
                />
              </div>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Automatic Grade
            </label>
            <input
              type="text"
              name="automaticGrade"
              value={formData.automaticGrade}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="e.g., Manual, Semi-Automatic"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Control System
            </label>
            <input
              type="text"
              name="controlSystem"
              value={formData.controlSystem}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="e.g., None, PLC"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Product Type
            </label>
            <input
              type="text"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="e.g., Protective Cover"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Material
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="e.g., Polyethylene"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Energy Consumption
            </label>
            <input
              type="text"
              name="energyConsumption"
              value={formData.energyConsumption}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="e.g., None, 100W"
            />
          </div>

          {/* Trade Information */}
          <div className="col-span-2 rounded border p-4">
            <h3 className="mb-3 text-lg font-semibold">Trade Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
                  Payment Terms
                </label>
                <input
                  type="text"
                  name="paymentTerms"
                  value={formData.tradeInfo.paymentTerms}
                  onChange={handleTradeInfoChange}
                  className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
                  placeholder="e.g., Advance Payment / COD"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
                  Delivery Time
                </label>
                <input
                  type="text"
                  name="deliveryTime"
                  value={formData.tradeInfo.deliveryTime}
                  onChange={handleTradeInfoChange}
                  className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
                  placeholder="e.g., 4-6 days"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
                  Supply Ability
                </label>
                <input
                  type="text"
                  name="supplyAbility"
                  value={formData.tradeInfo.supplyAbility}
                  onChange={handleTradeInfoChange}
                  className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
                  placeholder="e.g., 5000 units/month"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
                  Main Domestic Market
                </label>
                <input
                  type="text"
                  name="mainDomesticMarket"
                  value={formData.tradeInfo.mainDomesticMarket}
                  onChange={handleTradeInfoChange}
                  className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
                  placeholder="e.g., All India"
                />
              </div>
            </div>
          </div>
          {/* Video Upload Section */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            {/* Demo Video */}
            <div className="rounded border p-4">
              <h3 className="mb-3 text-lg font-semibold">Demo Video</h3>

              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setVideoType({ ...videoType, demo: "link" })}
                  className={`px-3 py-1 rounded text-sm ${videoType.demo === "link"
                    ? "bg-primaryBtnColor text-white"
                    : "bg-gray-200"
                    }`}
                >
                  YouTube Link
                </button>
                <button
                  type="button"
                  onClick={() => setVideoType({ ...videoType, demo: "upload" })}
                  className={`px-3 py-1 rounded text-sm ${videoType.demo === "upload"
                    ? "bg-primaryBtnColor text-white"
                    : "bg-gray-200"
                    }`}
                >
                  Upload Video
                </button>
              </div>

              {videoType.demo === "link" ? (
                <div>
                  <input
                    type="text"
                    name="demo_video"
                    value={formData.demo_video}
                    onChange={(e) => handleVideoInputChange(e, "demo_video")}
                    className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary mb-2"
                    placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
                  />
                  {formData.demo_video &&
                    isYouTubeLink(formData.demo_video) && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <p className="text-sm text-green-600">
                          ✓ Valid YouTube link
                        </p>
                      </div>
                    )}
                  {formData.demo_video &&
                    !isYouTubeLink(formData.demo_video) && (
                      <div className="mt-2 p-2 bg-red-50 rounded">
                        <p className="text-sm text-red-600">
                          Please enter a valid YouTube URL
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e, "demo_video")}
                    className="w-full mb-3"
                  />
                  {formData.demo_video &&
                    !formData.demo_video.includes("youtube") &&
                    !formData.demo_video.includes("youtu.be") && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600 mb-2">
                          ✓ Video uploaded successfully!
                        </p>
                        <video
                          src={formData.demo_video}
                          controls
                          className="w-full max-h-48 rounded-md"
                        />
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Production Video */}
            <div className="rounded border p-4">
              <h3 className="mb-3 text-lg font-semibold">Production Video</h3>

              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() =>
                    setVideoType({ ...videoType, production: "link" })
                  }
                  className={`px-3 py-1 rounded text-sm ${videoType.production === "link"
                    ? "bg-primaryBtnColor text-white"
                    : "bg-gray-200"
                    }`}
                >
                  YouTube Link
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setVideoType({ ...videoType, production: "upload" })
                  }
                  className={`px-3 py-1 rounded text-sm ${videoType.production === "upload"
                    ? "bg-primaryBtnColor text-white"
                    : "bg-gray-200"
                    }`}
                >
                  Upload Video
                </button>
              </div>

              {videoType.production === "link" ? (
                <div>
                  <input
                    type="text"
                    name="production_video"
                    value={formData.production_video}
                    onChange={(e) =>
                      handleVideoInputChange(e, "production_video")
                    }
                    className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary mb-2"
                    placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
                  />
                  {formData.production_video &&
                    isYouTubeLink(formData.production_video) && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <p className="text-sm text-green-600">
                          ✓ Valid YouTube link
                        </p>
                      </div>
                    )}
                  {formData.production_video &&
                    !isYouTubeLink(formData.production_video) && (
                      <div className="mt-2 p-2 bg-red-50 rounded">
                        <p className="text-sm text-red-600">
                          Please enter a valid YouTube URL
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e, "production_video")}
                    className="w-full mb-3"
                  />
                  {formData.production_video &&
                    !formData.production_video.includes("youtube") &&
                    !formData.production_video.includes("youtu.be") && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600 mb-2">
                          ✓ Video uploaded successfully!
                        </p>
                        <video
                          src={formData.production_video}
                          controls
                          className="w-full max-h-48 rounded-md"
                        />
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-red-500 mb-2">
            Maximum video size: 25MB. Supported formats: mp4, mov, avi, etc.
          </p>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium tracking-wide text-primaryColor">
              Upload Images
            </label>
            <p className="mb-2 text-sm text-red-700">
              * Images should not contain any watermark or contact number.
            </p>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="w-full"
              accept="image/*"
            />
            <div className="mt-4 grid grid-cols-4 gap-2">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt="Preview"
                    className="h-24 w-24 rounded-md object-cover border"
                  />
                </div>
              ))}
            </div>
          </div>
          {loading ? (
            <button
              disabled
              className="col-span-2 flex w-full items-center justify-center rounded-lg bg-primaryBtnColor font-semibold tracking-wide text-white opacity-50"
            >
              <ModalButtonLoader />
            </button>
          ) : (
            <button
              type="submit"
              className="col-span-2 flex w-full items-center justify-center rounded-lg bg-primaryBtnColor px-4 py-3 font-semibold tracking-wide text-white hover:bg-primaryBtnHoverColor transition duration-150"
            >
              Add Product
            </button>
          )}
        </form>
      </div>


      {isCategoryModalOpen && (
        <CategoryModal
          setIsModalOpen={setIsCategoryModalOpen}
          refreshFun={fetchCategories}
          modalType="addModal"
          categoryDetails={null}
        />
      )}

      {isSubCategoryModalOpen && (
        <AddSubCategoryModal
          isOpen={isSubCategoryModalOpen}
          setIsAddModalOpen={setIsSubCategoryModalOpen}
          subCatsByCat={fetchSubCategories}
        />
      )}

      {isSubSubCategoryModalOpen && (
        <AdminAddSubSubCategoryModal
          isOpen={isSubSubCategoryModalOpen}
          setIsAddModalOpen={setIsSubSubCategoryModalOpen}
          refreshData={fetchSubSubCategories}
        />
      )}

    </div>
  );
};

export default AddProducts;
