import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import EditProductSkeletonLoader from "./EditProductSkeletonLoader";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    images: [],
    ratings: "",
    features: [],
    stock_status: "active",
    return_policy: "",
    gstPercentage: "",
    extraTaxPercentage: "",
    shippingCharge: "",
    measurement: "",
    warranty: {
      hasWarranty: false,
      warrantyDays: "",
    },
    automaticGrade: "",
    controlSystem: "",
    productType: "",
    material: "",
    energyConsumption: "",
    tradeInfo: {
      paymentTerms: "",
      deliveryTime: "",
      supplyAbility: "",
      mainDomesticMarket: "",
    },
    price: "",
    previous_price: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setFetchingProduct(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/get-product-by-id/${id}`
        );

        const product = response.data;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          category: product.category?._id || "",
          subCategory: product.subCategory?._id || "",
          brand: product.brand || "",
          images: product.images || [],
          ratings: product.ratings || "",
          features: Array.isArray(product.features) ? product.features : [],
          stock_status: product.stock_status || "active",
          return_policy: product.return_policy || "",
          gstPercentage: product.gstPercentage || "",
          extraTaxPercentage: product.extraTaxPercentage || "",
          shippingCharge: product.shippingCharge || "",
          measurement: product.measurement || "",
          warranty: {
            hasWarranty: product.warranty?.hasWarranty || false,
            warrantyDays: product.warranty?.warrantyDays || "",
          },
          automaticGrade: product.automaticGrade || "",
          controlSystem: product.controlSystem || "",
          productType: product.productType || "",
          material: product.material || "",
          energyConsumption: product.energyConsumption || "",
          tradeInfo: {
            paymentTerms: product.tradeInfo?.paymentTerms || "",
            deliveryTime: product.tradeInfo?.deliveryTime || "",
            supplyAbility: product.tradeInfo?.supplyAbility || "",
            mainDomesticMarket: product.tradeInfo?.mainDomesticMarket || "",
          },
          price: product.price || "",
          previous_price: product.previous_price || "",
        });

        setImagePreviews(product.images || []);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError("Failed to load product data");
        toast.error("Failed to load product data");
      } finally {
        setFetchingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      const fetchSubCategories = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${formData.category}`
          );
          setSubCategories(response.data.subCategories || response.data);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
          process.env.REACT_APP_UPLOAD_PRESET
        );

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
          formDataImg
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
    }
    setLoading(false);
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = formData.images.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, images: updatedImages });
    setImagePreviews(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const productData = {
      ...formData,
      features: Array.isArray(formData.features)
        ? formData.features
        : formData.features.split(",").map((item) => item.trim()),
      ratings: Number(formData.ratings),
      gstPercentage: Number(formData.gstPercentage),
      extraTaxPercentage: Number(formData.extraTaxPercentage),
      shippingCharge: Number(formData.shippingCharge),
      price: Number(formData.price),
      previous_price: Number(formData.previous_price),
      warranty: {
        ...formData.warranty,
        warrantyDays: formData.warranty.hasWarranty
          ? formData.warranty.warrantyDays
          : "",
      },
    };

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/products/update-product/${id}`,
        productData,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Product updated successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to update product. Try again.");
      toast.error("Failed to update product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return <EditProductSkeletonLoader />;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between ml-4">
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150"
          >
            <MdArrowBackIos size={26} />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-primaryColor">
            Edit Product
          </h1>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        {/* {error && <p className="mb-4 text-red-600">{error}</p>} */}
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
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="Enter price"
            />
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

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Ratings (1 to 5)
            </label>
            <input
              type="number"
              name="ratings"
              value={formData.ratings}
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                if (value < 1) value = 1;
                if (value > 5) value = 5;
                setFormData({ ...formData, ratings: value });
              }}
              min="1"
              max="5"
              step="0.1"
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="Enter product ratings"
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
              Shipping Charges
            </label>
            <input
              type="number"
              name="shippingCharge"
              value={formData.shippingCharge}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="Enter shipping charges"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Stock Status
            </label>
            <select
              name="stock_status"
              value={formData.stock_status}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
            >
              <option value="active">In Stock</option>
              <option value="out of stock">Out of Stock</option>
            </select>
          </div>

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

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Features (comma-separated)
            </label>
            <input
              type="text"
              name="features"
              value={
                Array.isArray(formData.features)
                  ? formData.features.join(", ")
                  : formData.features
              }
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:ring focus:ring-primary"
              placeholder="e.g. Waterproof, Lightweight"
            />
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
          </div>

          {/* Warranty Section */}
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

          {/* Product Specifications */}
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

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium tracking-wide text-primaryColor">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="w-full"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt="Preview"
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <button className="col-span-2 flex w-full items-center justify-center rounded-lg bg-primaryBtnColor px-4 font-semibold tracking-wide text-white hover:bg-primaryBtnHoverColor">
              <ModalButtonLoader />
            </button>
          ) : (
            <button
              type="submit"
              className="col-span-2 flex w-full items-center justify-center rounded-lg bg-primaryBtnColor px-4 py-3 font-semibold tracking-wide text-white hover:bg-primaryBtnHoverColor"
            >
              Update Product
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
