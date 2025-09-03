import React, { useState } from "react";
import { CheckCircle, Upload, User, Building, FileText } from "lucide-react";

const SupplierRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    mobNo: "",
    emailId: "",
    gender: "Male",
    address: "",

    businessName: "",
    businessType: "",
    gstIn: "",
    panNo: "",
    shopImage: null,

    businessRegistrationName: "",
    gstCertificate: null,
    ownerIdProof: null,
    showroomPhoto: null,
    shopImageDoc: null,
    otherDocuments: [],
  });

  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cloudinary upload function
  const uploadToCloudinary = async (file, fieldName) => {
    setUploading((prev) => ({ ...prev, [fieldName]: true }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `${process.env.REACT_APP_UPLOAD_PRESET}`);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadToCloudinary(file, fieldName);
    if (url) {
      setFormData((prev) => ({ ...prev, [fieldName]: url }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateBasicDetails = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.mobNo.trim()) newErrors.mobNo = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobNo))
      newErrors.mobNo = "Enter valid 10-digit mobile number";
    if (!formData.emailId.trim()) newErrors.emailId = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.emailId))
      newErrors.emailId = "Enter valid email";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBusinessDetails = () => {
    const newErrors = {};

    if (!formData.businessName.trim())
      newErrors.businessName = "Business name is required";
    if (!formData.businessType.trim())
      newErrors.businessType = "Business type is required";
    if (!formData.gstIn.trim()) newErrors.gstIn = "GSTIN is required";
    if (!formData.panNo.trim()) newErrors.panNo = "PAN number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle step navigation
  const handleContinue = () => {
    if (currentStep === 1 && validateBasicDetails()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateBusinessDetails()) {
      setCurrentStep(3);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        mobNo: formData.mobNo,
        emailId: formData.emailId,
        gender: formData.gender,
        address: formData.address,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessRegistrationName: formData.businessRegistrationName,
        panNo: formData.panNo,
        gstIn: formData.gstIn,
        shopImage: formData.shopImage || formData.shopImageDoc,
        panImage: formData.ownerIdProof,
        addressProof: formData.showroomPhoto,
        ownerIdProof: formData.ownerIdProof,
        gstCertificate: formData.gstCertificate,
        otherDocuments: formData.otherDocuments,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/supplier/suppliers/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setCurrentStep(4); // Success step
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // File upload component
  const FileUpload = ({ fieldName, label, accept = "image/*" }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileUpload(e, fieldName)}
          className="hidden"
          id={fieldName}
        />
        <label htmlFor={fieldName} className="cursor-pointer">
          {uploading[fieldName] ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="ml-2">Uploading...</span>
            </div>
          ) : formData[fieldName] ? (
            <div className="text-green-600 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              File uploaded successfully
            </div>
          ) : (
            <div className="text-gray-600 flex items-center justify-center">
              <Upload className="h-5 w-5 mr-2" />
              Click to upload {label.toLowerCase()}
            </div>
          )}
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register</h1>
          <p className="text-gray-600">Enter your details for part of us.</p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[
              { step: 1, label: "Basic Detail", icon: User },
              { step: 2, label: "Business Detail", icon: Building },
              { step: 3, label: "Documents", icon: FileText },
            ].map(({ step, label, icon: Icon }) => (
              <div
                key={step}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                  currentStep === step
                    ? "bg-orange-100 text-orange-600 border-b-2 border-orange-500"
                    : currentStep > step
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  name="mobNo"
                  placeholder="Mob No"
                  value={formData.mobNo}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.mobNo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.mobNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobNo}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="emailId"
                  placeholder="Email Id"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.emailId ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.emailId && (
                  <p className="text-red-500 text-sm mt-1">{errors.emailId}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Gender <span className="text-red-500">*</span>
                </p>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Female</span>
                  </label>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Business Details */}
        {currentStep === 2 && (
          <div>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.businessName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessName}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="businessType"
                  placeholder="Business Type"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.businessType ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.businessType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessType}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="gstIn"
                  placeholder="GstIN"
                  value={formData.gstIn}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.gstIn ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.gstIn && (
                  <p className="text-red-500 text-sm mt-1">{errors.gstIn}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="panNo"
                  placeholder="Pan No"
                  value={formData.panNo}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.panNo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.panNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.panNo}</p>
                )}
              </div>

              <FileUpload fieldName="shopImage" label="Shop Image" />
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="businessRegistrationName"
                  placeholder="Business Registration Name"
                  value={formData.businessRegistrationName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <FileUpload fieldName="gstCertificate" label="GST Certificate" />
              <FileUpload fieldName="ownerIdProof" label="Owner Id Proof" />
              <FileUpload fieldName="showroomPhoto" label="Showroom Photo" />
              <FileUpload fieldName="shopImageDoc" label="Shop Image" />
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-purple-600" />
              </div>
              <div className="w-16 h-24 bg-purple-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-12 h-16 bg-white rounded border-2 border-purple-300"></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Congratulations !
            </h2>
            <p className="text-gray-600 mb-6">
              your data registered successfully, you will notify soon
            </p>

            <button
              onClick={() => {
                setCurrentStep(1);
                setFormData({
                  fullName: "",
                  mobNo: "",
                  emailId: "",
                  gender: "Male",
                  address: "",
                  businessName: "",
                  businessType: "",
                  gstIn: "",
                  panNo: "",
                  shopImage: null,
                  businessRegistrationName: "",
                  gstCertificate: null,
                  ownerIdProof: null,
                  showroomPhoto: null,
                  shopImageDoc: null,
                  otherDocuments: [],
                });
              }}
              className="w-full max-w-md bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Go to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierRegister;
