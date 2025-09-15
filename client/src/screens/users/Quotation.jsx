import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  Image,
  Video,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Grid3X3,
  ChevronDown,
  X,
} from "lucide-react";
import { MdSubject } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

const Quotation = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobNumber: "",
    email: "",
    address: "",
    subject: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    product: "",
  });

  // API data states
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      mobNumber: "",
      email: "",
      address: "",
      subject: "",
      category: "",
      subCategory: "",
      subSubCategory: "",
      product: "",
    });
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const fetchSubCategories = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${formData.category}`
          );
          setSubCategories(response.data.subCategories || response.data);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
          setSubCategories([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);

  // Fetch sub-sub-categories when subcategory changes
  useEffect(() => {
    if (formData.subCategory) {
      const fetchSubSubCategories = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${formData.subCategory}`
          );
          setSubSubCategories(response.data || []);
        } catch (error) {
          console.error("Failed to fetch sub-sub-categories:", error);
          setSubSubCategories([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSubSubCategories();
    } else {
      setSubSubCategories([]);
    }
  }, [formData.subCategory]);

  // Fetch products when sub-sub-category changes
  useEffect(() => {
    if (formData.subSubCategory) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/products/products-by-sub-sub-category/${formData.subSubCategory}`
          );
          setProducts(response.data || []);
        } catch (error) {
          console.error("Failed to fetch products:", error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [formData.subSubCategory]);

  // Handle dropdown changes with cascade reset
  const handleDropdownChange = (name, value) => {
    if (name === "category") {
      setFormData({
        ...formData,
        [name]: value,
        subCategory: "",
        subSubCategory: "",
        product: "",
      });
    } else if (name === "subCategory") {
      setFormData({
        ...formData,
        [name]: value,
        subSubCategory: "",
        product: "",
      });
    } else if (name === "subSubCategory") {
      setFormData({
        ...formData,
        [name]: value,
        product: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (
      !formData.fullName ||
      !formData.mobNumber ||
      !formData.email ||
      !formData.address ||
      !formData.subject ||
      !formData.category ||
      !formData.subCategory ||
      !formData.subSubCategory ||
      !formData.product
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitLoading(true);

      const quotationData = {
        fullName: formData.fullName,
        mobNumber: formData.mobNumber,
        email: formData.email,
        address: formData.address,
        subject: formData.subject,
        category: formData.category,
        subCategory: formData.subCategory,
        subSubCategory: formData.subSubCategory,
        product: formData.product,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/quotation/create-quotation`,
        quotationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        toast.success(
          "Quotation request submitted successfully! We will contact you soon."
        );
        handleCancel();
        onClose();
      }
    } catch (error) {
      console.error("Failed to submit quotation:", error);
      toast.error("Failed to submit quotation. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const features = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Full Price Details of the Products.",
      description: "",
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Product Images and Information with Details.",
      description: "",
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Link of Each Product.",
      description: "",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full flex relative max-h-[100vh]">
        <button
          className="absolute top-2 right-4 cursor-pointer text-gray-500 hover:text-gray-800 text-2xl z-10"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Left Section */}
        <div className="bg-gray-50 p-8 w-96 flex flex-col rounded-l-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-8 leading-tight">
            What features you will get in this quotation ?
          </h2>

          <div className="space-y-7">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 tracking-normal"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600">{feature.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-blue-600 font-semibold text-md leading-relaxed">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Enter Your Details and Download Free{" "}
                <span className="text-orange-500">Quotation !</span>
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Enter your details, our team will get back to you soon.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* First Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name Here"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="mobNumber"
                  placeholder="Mob Number"
                  value={formData.mobNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Subject Row */}
            <div className="w-full">
              <div className="relative">
                <MdSubject className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="subject"
                  placeholder="Add Subject here"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                <CustomDropdown
                  label="Select Category"
                  options={categories.map((c) => ({
                    value: c._id,
                    label: c.name,
                  }))}
                  value={formData.category}
                  onChange={(val) => handleDropdownChange("category", val)}
                  loading={loading}
                />
              </div>
              <div className="relative">
                <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                <CustomDropdown
                  label="Select Sub Category"
                  options={subCategories.map((s) => ({
                    value: s._id || s.id,
                    label: s.name,
                  }))}
                  value={formData.subCategory}
                  onChange={(val) => handleDropdownChange("subCategory", val)}
                  disabled={!formData.category}
                  loading={loading}
                />
              </div>
            </div>

            {/* Sub-Sub Category and Product */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                <CustomDropdown
                  label="Select Sub-Sub Category"
                  options={subSubCategories.map((s) => ({
                    value: s._id,
                    label: s.name,
                  }))}
                  value={formData.subSubCategory}
                  onChange={(val) =>
                    handleDropdownChange("subSubCategory", val)
                  }
                  disabled={!formData.subCategory}
                  loading={loading}
                />
              </div>
              <div className="relative">
                <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                <CustomDropdown
                  label="Select Product"
                  options={products.map((p) => ({
                    value: p._id,
                    label: p.name,
                  }))}
                  value={formData.product}
                  onChange={(val) => handleDropdownChange("product", val)}
                  disabled={!formData.subSubCategory}
                  loading={loading}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Cancel
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? "Processing..." : "Download Quotation"}
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Dropdown Component
const CustomDropdown = ({
  label,
  options,
  value,
  onChange,
  disabled,
  loading,
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
        className={`flex items-center justify-between border border-gray-300 rounded-lg pl-10 pr-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
          disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "bg-white"
        }`}
        onClick={() => !disabled && !loading && setOpen(!open)}
      >
        <span
          className={`${selectedOption ? "text-gray-700" : "text-gray-400"}`}
        >
          {loading
            ? "Loading..."
            : selectedOption
            ? selectedOption.label
            : label}
        </span>
        <FiChevronDown
          className={`text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && !disabled && !loading && (
        <ul className="absolute z-[9999] mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((opt) => (
              <li
                key={opt.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400">No options available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Quotation;
