import React, { useState } from "react";
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

const Quotation = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    subject: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    product: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      mobile: "",
      email: "",
      address: "",
      subject: "",
      category: "",
      subCategory: "",
      subSubCategory: "",
      product: "",
    });
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
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full flex overflow-hidden relative">
        <button
          className="absolute top-2 right-4 cursor-pointer text-gray-500 hover:text-gray-800 text-2xl z-10"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        {/* Left Section */}
        <div className="bg-gray-50 p-8 w-96 flex flex-col">
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
                    <div className="text-primaryColor">{feature.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-primaryColor font-semibold text-md leading-relaxed">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor rounded-lg flex items-center justify-center">
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
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name Here"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mob Number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid-cols-2 ">
              <div className="relative col-span-2">
                <MdSubject className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="subject"
                  placeholder="Add Subject here"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select Category</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select Sub Category</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Fourth Row - Sub-Sub Category and Product */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="subSubCategory"
                  value={formData.subSubCategory}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select Sub-Sub Category</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select Product</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 bg-secondaryTextColor hover:bg-primaryTextColor text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Cancel
                <X className="w-5 h-5" />
              </button>
              <button className="flex-1 bg-primaryBtnColor hover:bg-primaryBtnHoverColor text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                Download Quotation
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotation;
