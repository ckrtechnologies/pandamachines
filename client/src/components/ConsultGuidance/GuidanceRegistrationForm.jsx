import React, { useState, useEffect } from "react";
import { FaBox, FaTh, FaUser } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { AiFillProduct } from "react-icons/ai";
import { IoMdCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RazorpayPayment from "../../utils/RazorpayPayment";
import { useRef } from "react";
// import { FiChevronDown } from "react-icons/fi";

const GuidanceRegistrationForm = () => {
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(60000);
  const [discussionTime, setDiscussionTime] = useState("30 mins");
  const [showPayment, setShowPayment] = useState(false);

  // API data states
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    subSubCategory: "",
    product: "",
    investmentAmount: 60000,
    fullName: "",
    mobileNumber: "",
    email: "",
    discussionTime: "30 mins",
    discussionFee: 2000,
    date: "",
    formattedDate: "",
    time: "",
  });

  // Discussion time fee mapping
  const discussionFeeMap = {
    30: 2000,
    60: 5000,
    full: 10000,
    project: 20000,
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
    if (formData.category) {
      const fetchSubCategories = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${formData.category}`
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
  }, [formData.category]);

  // Fetch sub-sub-categories when subcategory changes
  useEffect(() => {
    if (formData.subCategory) {
      const fetchSubSubCategories = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${formData.subCategory}`
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
  }, [formData.subCategory]);

  useEffect(() => {
    if (formData.subSubCategory) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/products/products-by-sub-sub-category/${formData.subSubCategory}`
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
  }, [formData.subSubCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;

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
    } else if (name === "date") {
      const [year, month, day] = value.split("-");
      const formattedDate = `${year}/${month}/${day}`;

      setFormData({
        ...formData,
        date: value,
        formattedDate: formattedDate,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDiscussionTimeChange = (time) => {
    setDiscussionTime(time);

    let feeKey;
    if (time === "30 mins") feeKey = 30;
    else if (time === "60 mins") feeKey = 60;
    else if (time === "Full Day") feeKey = "full";
    else if (time === "Until Project Completion") feeKey = "project";

    setFormData({
      ...formData,
      discussionTime: time,
      discussionFee: discussionFeeMap[feeKey],
    });
  };

  const handleInvestmentChange = (e) => {
    const value = e.target.value;
    setInvestment(value);
    setFormData({
      ...formData,
      investmentAmount: parseInt(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.category ||
      !formData.subCategory ||
      !formData.subSubCategory ||
      !formData.product ||
      !formData.fullName ||
      !formData.mobileNumber ||
      !formData.email ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Show payment modal
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentResult) => {
    console.log("Payment successful:", paymentResult);

    // Store booking response in localStorage
    localStorage.setItem(
      "bookingResponse",
      JSON.stringify(paymentResult.bookingData)
    );
    localStorage.setItem(
      "paymentResult",
      JSON.stringify(paymentResult.paymentData)
    );

    // Navigate to confirmation page
    setShowPayment(false);
    navigate("/guidance-booking-confirm");
  };

  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
    setShowPayment(false);

    // Show user-friendly error message
    const errorMessage =
      error.description || "Payment failed. Please try again.";
    alert(`Payment Failed: ${errorMessage}`);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  // Get selected product name for display
  const getSelectedProductName = () => {
    const selectedProduct = products.find((p) => p._id === formData.product);
    return selectedProduct ? selectedProduct.name : "Guidance Consultation";
  };

  // Get selected category name for display
  const getSelectedCategoryName = () => {
    const selectedCategory = categories.find(
      (c) => c._id === formData.category
    );
    return selectedCategory ? selectedCategory.name : "";
  };

  return (
    <div className="px-4 py-6 xl:px-6 bg-[#fff8f4]">
      <div className="p-10 bg-white shadow-lg rounded-md">
        <div className="bg-blue-100 text-center py-3 rounded mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900">
            REGISTER HERE & GET A CALL BACK FROM US !
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-orange-500 tracking-wide font-medium mb-2">
              In which type of plant do you want to register ?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative w-full">
                <CustomDropdown
                  label="Select Category"
                  options={categories.map((c) => ({
                    value: c._id,
                    label: c.name,
                  }))}
                  value={formData.category}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      category: val,
                      subCategory: "",
                      subSubCategory: "",
                      product: "",
                    })
                  }
                />
              </div>

              <div className="relative w-full">
                <CustomDropdown
                  label="Select Sub Category"
                  options={subCategories.map((s) => ({
                    value: s._id || s.id,
                    label: s.name,
                  }))}
                  value={formData.subCategory}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      subCategory: val,
                      subSubCategory: "",
                      product: "",
                    })
                  }
                  disabled={!formData.category}
                />
              </div>

              <div className="relative w-full">
                <CustomDropdown
                  label="Select Sub-Sub Category"
                  options={subSubCategories.map((s) => ({
                    value: s._id,
                    label: s.name,
                  }))}
                  value={formData.subSubCategory}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      subSubCategory: val,
                      product: "",
                    })
                  }
                  disabled={!formData.subCategory}
                />
              </div>

              <div className="relative w-full">
                <CustomDropdown
                  label="Select Product"
                  options={products.map((p) => ({
                    value: p._id,
                    label: p.name,
                  }))}
                  value={formData.product}
                  onChange={(val) => setFormData({ ...formData, product: val })}
                  disabled={!formData.subSubCategory}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-orange-500 tracking-wide font-medium mb-2">
              How Much do you want to Invest ?
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10000"
                max="100000"
                step="1000"
                value={investment}
                onChange={handleInvestmentChange}
                className="w-full"
              />
              <span className="text-white bg-[#00395F] px-3 py-1 rounded">
                {investment / 1000}k
              </span>
            </div>
          </div>

          <div>
            <p className="text-orange-500 tracking-wide font-medium mb-2">
              Your Information Please ?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <FaUser size={16} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name here"
                    className="bg-transparent w-full text-gray-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <IoMdCall size={20} className="text-gray-500 mr-2" />
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Mob Number"
                    className="bg-transparent w-full text-gray-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <MdEmail size={20} className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-mail Id"
                    className="bg-transparent w-full text-gray-700 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-orange-500 tracking-wide font-medium mb-2">
              Discussion Time
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discussion"
                  checked={discussionTime === "30 mins"}
                  onChange={() => handleDiscussionTimeChange("30 mins")}
                />
                <span>
                  30 mins <br /> <span className="text-[#1B6392]">₹ 2,000</span>
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discussion"
                  checked={discussionTime === "60 mins"}
                  onChange={() => handleDiscussionTimeChange("60 mins")}
                />
                <span>
                  60 mins <br /> <span className="text-[#1B6392]">₹ 5,000</span>
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discussion"
                  checked={discussionTime === "Full Day"}
                  onChange={() => handleDiscussionTimeChange("Full Day")}
                />
                <span>
                  Full Day <br />{" "}
                  <span className="text-[#1B6392]">₹ 10,000</span>
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discussion"
                  checked={discussionTime === "Until Project Completion"}
                  onChange={() =>
                    handleDiscussionTimeChange("Until Project Completion")
                  }
                />
                <span>
                  Until Project Completion <br />{" "}
                  <span className="text-[#1B6392]">₹ 20,000</span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <p className="text-orange-500 tracking-wide font-medium mb-2">
              Select Time Slot
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border border-gray-400 rounded-md w-full p-2"
                required
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="border border-gray-400 rounded-md w-full p-2"
                required
              />
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Payment Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Discussion Fee ({formData.discussionTime}):</span>
                <span className="font-medium">
                  ₹{formData.discussionFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total Amount:</span>
                <span className="text-green-600">
                  ₹{formData.discussionFee.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </form>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Complete Payment</h3>
                <button
                  onClick={handlePaymentClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Service:</strong> {getSelectedProductName()}
                  </div>
                  <div>
                    <strong>Category:</strong> {getSelectedCategoryName()}
                  </div>
                  <div>
                    <strong>Duration:</strong> {formData.discussionTime}
                  </div>
                  <div>
                    <strong>Date:</strong> {formData.date}
                  </div>
                  <div>
                    <strong>Time:</strong> {formData.time}
                  </div>
                  <div className="text-lg font-semibold text-orange-400">
                    <strong>
                      Amount: ₹{formData.discussionFee.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              <RazorpayPayment
                amount={formData.discussionFee}
                customerData={{
                  fullName: formData.fullName,
                  email: formData.email,
                  mobileNumber: formData.mobileNumber,
                  product: getSelectedProductName(),
                }}
                bookingData={{
                  category: formData.category,
                  subCategory: formData.subCategory,
                  subSubCategory: formData.subSubCategory,
                  product: formData.product,
                  investmentAmount: formData.investmentAmount,
                  fullName: formData.fullName,
                  mobileNumber: formData.mobileNumber,
                  email: formData.email,
                  discussionTime: formData.discussionTime,
                  discussionFee: formData.discussionFee,
                  date: formData.formattedDate,
                  time: formData.time,
                }}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
                onClose={handlePaymentClose}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidanceRegistrationForm;

const CustomDropdown = ({ label, options, value, onChange, disabled }) => {
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
        className={`flex items-center justify-between border border-gray-400 rounded-md px-3 py-2 cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : "bg-white"
        }`}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className="text-gray-600">
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
