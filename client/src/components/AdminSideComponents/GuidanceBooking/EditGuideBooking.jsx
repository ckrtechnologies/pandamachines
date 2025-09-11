import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBox, FaTh, FaUser } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { AiFillProduct } from "react-icons/ai";
import { IoMdCall } from "react-icons/io";
import { MdArrowBackIosNew, MdEmail } from "react-icons/md";
import toast from "react-hot-toast";

const EditGuideBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // API data states for dropdowns
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Store original data for display
  const [originalData, setOriginalData] = useState(null);

  const [bookingData, setBookingData] = useState({
    category: "",
    subCategory: "",
    subSubCategory: "",
    product: "",
    investmentAmount: "",
    fullName: "",
    mobileNumber: "",
    email: "",
    discussionTime: "",
    discussionFee: "",
    date: "",
    time: "",
  });

  // Discussion time fee mapping
  const discussionFeeMap = {
    "30 mins": 2000,
    "60 mins": 5000,
    "Full Day": 10000,
    "Until Project Completion": 20000,
  };

  // Fetch categories on component mount
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

  // Fetch subcategories when category changes
  useEffect(() => {
    if (bookingData.category) {
      const fetchSubCategories = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${bookingData.category}`
          );
          setSubCategories(response.data.subCategories || response.data);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
          setSubCategories([]);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [bookingData.category]);

  // Fetch sub-sub-categories when subcategory changes
  useEffect(() => {
    if (bookingData.subCategory) {
      const fetchSubSubCategories = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${bookingData.subCategory}`
          );
          setSubSubCategories(response.data || []);
        } catch (error) {
          console.error("Failed to fetch sub-sub-categories:", error);
          setSubSubCategories([]);
        }
      };
      fetchSubSubCategories();
    } else {
      setSubSubCategories([]);
    }
  }, [bookingData.subCategory]);

  // Fetch products when sub-sub-category changes
  useEffect(() => {
    if (bookingData.subSubCategory) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/products/products-by-sub-sub-category/${bookingData.subSubCategory}`
          );
          setProducts(response.data || []);
        } catch (error) {
          console.error("Failed to fetch products:", error);
          setProducts([]);
        }
      };
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [bookingData.subSubCategory]);

  // Fetch booking data on component mount
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        setError(null);

        const config = {
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/guidance-booking/get-book-by-id/${id}`,
          headers: {},
        };

        const response = await axios.request(config);
        const data = response.data;

        // Store original data for reference
        setOriginalData(data);

        // Format date for input field (YYYY-MM-DD)
        const formattedDate = data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "";

        setBookingData({
          category: data.category?._id || "",
          subCategory: data.subCategory?._id || "",
          subSubCategory: data.subSubCategory?._id || "",
          product: data.product?._id || "",
          investmentAmount: data.investmentAmount || "",
          fullName: data.fullName || "",
          mobileNumber: data.mobileNumber || "",
          email: data.email || "",
          discussionTime: data.discussionTime || "",
          discussionFee: data.discussionFee || "",
          date: formattedDate,
          time: data.time || "",
        });
      } catch (error) {
        console.error("Error fetching booking data:", error);
        setError("Failed to fetch booking data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingData();
    }
  }, [id]);

  // Handle input changes with cascading logic
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "discussionTime") {
      const fee = discussionFeeMap[value] || 0;
      setBookingData({
        ...bookingData,
        [name]: value,
        discussionFee: fee,
      });
    } else {
      setBookingData({ ...bookingData, [name]: value });
    }
  };

  // Handle dropdown changes with cascading logic
  const handleDropdownChange = (name, value) => {
    if (name === "category") {
      setBookingData({
        ...bookingData,
        [name]: value,
        subCategory: "",
        subSubCategory: "",
        product: "",
      });
    } else if (name === "subCategory") {
      setBookingData({
        ...bookingData,
        [name]: value,
        subSubCategory: "",
        product: "",
      });
    } else if (name === "subSubCategory") {
      setBookingData({
        ...bookingData,
        [name]: value,
        product: "",
      });
    } else {
      setBookingData({ ...bookingData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !bookingData.category ||
      !bookingData.subCategory ||
      !bookingData.subSubCategory ||
      !bookingData.product ||
      !bookingData.fullName ||
      !bookingData.mobileNumber ||
      !bookingData.email ||
      !bookingData.date ||
      !bookingData.time
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const updateData = {
        category: bookingData.category,
        subCategory: bookingData.subCategory,
        subSubCategory: bookingData.subSubCategory,
        product: bookingData.product,
        investmentAmount: parseInt(bookingData.investmentAmount),
        fullName: bookingData.fullName,
        mobileNumber: bookingData.mobileNumber,
        email: bookingData.email,
        discussionTime: bookingData.discussionTime,
        discussionFee: parseInt(bookingData.discussionFee),
        date: bookingData.date,
        time: bookingData.time,
      };

      const config = {
        method: "put",
        url: `${process.env.REACT_APP_API_URL}/guidance-booking/update/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(updateData),
      };

      const response = await axios.request(config);
      console.log("Update response:", response.data);

      toast.success("Booking updated successfully!");
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Error updating booking:", error);
      setError("Failed to update booking");
    } finally {
      setUpdating(false);
    }
  };

  // Get selected names for display
  const getSelectedCategoryName = () => {
    const selectedCategory = categories.find(
      (c) => c._id === bookingData.category
    );
    return selectedCategory
      ? selectedCategory.name
      : originalData?.category?.name || "";
  };

  const getSelectedSubCategoryName = () => {
    const selectedSubCategory = subCategories.find(
      (sc) => sc._id === bookingData.subCategory
    );
    return selectedSubCategory
      ? selectedSubCategory.name
      : originalData?.subCategory?.name || "";
  };

  const getSelectedSubSubCategoryName = () => {
    const selectedSubSubCategory = subSubCategories.find(
      (ssc) => ssc._id === bookingData.subSubCategory
    );
    return selectedSubSubCategory
      ? selectedSubSubCategory.name
      : originalData?.subSubCategory?.name || "";
  };

  const getSelectedProductName = () => {
    const selectedProduct = products.find((p) => p._id === bookingData.product);
    return selectedProduct
      ? selectedProduct.name
      : originalData?.product?.name || "";
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <EditGuideBookingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="w-full mx-auto px-4">
        <div className="">
          <div className="px-6 flex justify-start items-center gap-3">
            <MdArrowBackIosNew
              size={26}
              onClick={() => {
                navigate(-1);
              }}
              className="cursor-pointer"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Guide Booking
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {/* Category Selection */}
            <div>
              <p className="text-orange-500 tracking-wide font-medium mb-2">
                Category Selection
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category */}
                <div className="relative w-full">
                  <CustomDropdown
                    label="Select Category"
                    options={categories.map((c) => ({
                      value: c._id,
                      label: c.name,
                    }))}
                    value={bookingData.category}
                    onChange={(val) => handleDropdownChange("category", val)}
                    icon={<FaTh size={18} className="text-gray-500 mr-2" />}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Current: {getSelectedCategoryName()}
                  </div>
                </div>

                {/* Sub Category */}
                <div className="relative w-full">
                  <CustomDropdown
                    label="Select Sub Category"
                    options={subCategories.map((s) => ({
                      value: s._id || s.id,
                      label: s.name,
                    }))}
                    value={bookingData.subCategory}
                    onChange={(val) => handleDropdownChange("subCategory", val)}
                    disabled={!bookingData.category}
                    icon={<FaBox size={18} className="text-gray-500 mr-2" />}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Current: {getSelectedSubCategoryName()}
                  </div>
                </div>

                {/* Sub Sub Category */}
                <div className="relative w-full">
                  <CustomDropdown
                    label="Select Sub-Sub Category"
                    options={subSubCategories.map((s) => ({
                      value: s._id,
                      label: s.name,
                    }))}
                    value={bookingData.subSubCategory}
                    onChange={(val) =>
                      handleDropdownChange("subSubCategory", val)
                    }
                    disabled={!bookingData.subCategory}
                    icon={<FaBox size={18} className="text-gray-500 mr-2" />}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Current: {getSelectedSubSubCategoryName()}
                  </div>
                </div>

                {/* Product */}
                <div className="relative w-full">
                  <CustomDropdown
                    label="Select Product"
                    options={products.map((p) => ({
                      value: p._id,
                      label: p.name,
                    }))}
                    value={bookingData.product}
                    onChange={(val) => handleDropdownChange("product", val)}
                    disabled={!bookingData.subSubCategory}
                    icon={
                      <AiFillProduct size={24} className="text-gray-500 mr-2" />
                    }
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Current: {getSelectedProductName()}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <p className="text-orange-500 tracking-wide font-medium mb-2">
                Personal Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Full Name */}
                <div className="relative w-full">
                  <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                    <FaUser size={16} className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      name="fullName"
                      value={bookingData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="bg-transparent w-full text-gray-700 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="relative w-full">
                  <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                    <IoMdCall size={20} className="text-gray-500 mr-2" />
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={bookingData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Mobile Number"
                      className="bg-transparent w-full text-gray-700 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="relative w-full">
                  <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                    <MdEmail size={20} className="text-gray-500 mr-2" />
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="bg-transparent w-full text-gray-700 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investment Amount */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">
                  Investment Amount (₹)
                </label>
                <input
                  type="number"
                  name="investmentAmount"
                  value={bookingData.investmentAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Discussion Time */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">
                  Discussion Time
                </label>
                <select
                  name="discussionTime"
                  value={bookingData.discussionTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Discussion Time</option>
                  <option value="30 mins">30 mins - ₹2,000</option>
                  <option value="60 mins">60 mins - ₹5,000</option>
                  <option value="Full Day">Full Day - ₹10,000</option>
                  <option value="Until Project Completion">
                    Until Project Completion - ₹20,000
                  </option>
                </select>
              </div>

              {/* Discussion Fee */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">
                  Discussion Fee (₹)
                </label>
                <input
                  type="number"
                  name="discussionFee"
                  value={bookingData.discussionFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? "Updating..." : "Update Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGuideBooking;

const EditGuideBookingSkeleton = () => {
  return (
    <div className="p-6 animate-pulse">
      {/* Title */}
      <div className="h-8 w-48 bg-gray-300 rounded mb-6"></div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-300 rounded"></div>
        ))}
      </div>

      {/* Personal Information */}
      <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="h-12 bg-gray-300 rounded"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>

      {/* Investment + Discussion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="h-12 bg-gray-300 rounded"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>

      {/* Fee + Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="h-12 bg-gray-300 rounded"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>

      {/* Time */}
      <div className="h-12 w-full md:w-1/2 bg-gray-300 rounded"></div>
    </div>
  );
};

// CustomDropdown Component
const CustomDropdown = ({
  label,
  options,
  value,
  onChange,
  disabled,
  icon,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex items-center border border-gray-400 rounded-md px-3 py-2 cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : "bg-white"
        }`}
        onClick={() => !disabled && setOpen(!open)}
      >
        {icon}
        <span className="text-gray-600 flex-1">
          {selectedOption ? selectedOption.label : label}
        </span>
        <FiChevronDown className="text-gray-500 ml-2" />
      </div>

      {open && !disabled && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((opt) => (
              <li
                key={opt.value}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-gray-700"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-2 py-1 text-gray-400">No options available</li>
          )}
        </ul>
      )}
    </div>
  );
};
