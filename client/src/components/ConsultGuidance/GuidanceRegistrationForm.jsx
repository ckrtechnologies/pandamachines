import React, { useState, useEffect } from "react";
import { FaBox, FaTh, FaUser } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { AiFillProduct } from "react-icons/ai";
import { IoMdCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GuidanceRegistrationForm = () => {
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(60000);
  const [discussionTime, setDiscussionTime] = useState("60 mins");

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
    date: "", // Keep this in YYYY-MM-DD format for the input
    formattedDate: "", // This will store DD/MM/YYYY format for API
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
      // Keep the original YYYY-MM-DD format for the input
      // Convert to YYYY/MM/DD format for API
      const [year, month, day] = value.split("-");
      const formattedDate = `${year}/${month}/${day}`;

      setFormData({
        ...formData,
        date: value, // Keep YYYY-MM-DD for input display
        formattedDate: formattedDate, // YYYY/MM/DD for API
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDiscussionTimeChange = (time) => {
    setDiscussionTime(time);

    // Convert the time string to match the discussionFeeMap keys
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
    setLoading(true);

    try {
      const bookingData = {
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
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/guidance-booking/book`,
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("bookingResponse", JSON.stringify(response.data));

      console.log("Booking successful:", response.data);
      navigate("/guidance-booking-confirm");
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setLoading(false);
    }
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
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <FaTh size={18} className="text-gray-500 mr-2" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="appearance-none bg-transparent w-full text-gray-600 focus:outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="text-gray-500 ml-2 pointer-events-none" />
                </div>
              </div>

              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <FaBox size={18} className="text-gray-500 mr-2" />
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    disabled={!formData.category}
                    className="appearance-none bg-transparent w-full text-gray-600 focus:outline-none disabled:opacity-50"
                    required
                  >
                    <option value="">Select Sub Category</option>
                    {subCategories.length > 0 ? (
                      subCategories.map((sub) => (
                        <option
                          key={sub._id || sub.id}
                          value={sub._id || sub.id}
                        >
                          {sub.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No sub-categories available</option>
                    )}
                  </select>
                  <FiChevronDown className="text-gray-500 ml-2 pointer-events-none" />
                </div>
              </div>

              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <FaBox size={18} className="text-gray-500 mr-2" />
                  <select
                    name="subSubCategory"
                    value={formData.subSubCategory}
                    onChange={handleChange}
                    disabled={!formData.subCategory}
                    className="appearance-none bg-transparent w-full text-gray-600 focus:outline-none disabled:opacity-50"
                    required
                  >
                    <option value="">Select Sub-Sub Category</option>
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
                  <FiChevronDown className="text-gray-500 ml-2 pointer-events-none" />
                </div>
              </div>

              <div className="relative w-full">
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 w-full">
                  <AiFillProduct size={24} className="text-gray-500 mr-2" />
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    disabled={!formData.subSubCategory}
                    className="appearance-none bg-transparent w-full text-gray-600 focus:outline-none disabled:opacity-50"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No products available</option>
                    )}
                  </select>
                  <FiChevronDown className="text-gray-500 ml-2 pointer-events-none" />
                </div>
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuidanceRegistrationForm;
