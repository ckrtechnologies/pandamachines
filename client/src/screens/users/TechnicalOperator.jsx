import axios from "axios";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Briefcase,
  Camera,
  CheckCircle,
  ChevronRight,
  DollarSign,
  HelpCircle,
  IndianRupee,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Upload,
  User,
  Wrench,
  X
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AllUserFooter from "../../components/common/AllUserFooter";
import UserNavbar from "../../components/common/UserNavbar";

const TechnicalOperator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [imageUploading, setImageUploading] = useState({
    aadharFront: false,
    aadharBack: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobileNumber: "",
    whatsappNumber: "",
    operatorName: "",
    expectedSalaryMin: "",
    expectedSalaryMax: "",
    aadharFront: "",
    aadharBack: "",
    experience: "",
    availability: "immediate",
    preferredLocation: "",
    languages: [],
    skills: []
  });

  const [previewImages, setPreviewImages] = useState({
    aadharFront: null,
    aadharBack: null
  });

  const operatorTypes = [
    "JCB Machine Operator",
    "Crane Operator",
    "Forklift Operator",
    "Excavator Operator",
    "Loader Operator",
    "Dozer Operator",
    "Grader Operator",
    "Backhoe Operator",
    "Pile Driver Operator",
    "Paver Operator",
    "Roller Operator",
    "Concrete Pump Operator"
  ];

  const availabilityOptions = [
    { value: "immediate", label: "Immediately Available" },
    { value: "15days", label: "Within 15 Days" },
    { value: "30days", label: "Within 30 Days" },
    { value: "negotiable", label: "Negotiable" }
  ];

  const languageOptions = [
    "Hindi", "English", "Gujarati", "Marathi", "Tamil", "Telugu", "Kannada", "Bengali"
  ];

  const skillOptions = [
    "Heavy Equipment Operation",
    "Site Safety",
    "Basic Maintenance",
    "Load Calculation",
    "Team Coordination",
    "Emergency Response",
    "Equipment Inspection",
    "Fuel Management"
  ];

  const handleImageUpload = async (e, type) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImages(prev => ({
        ...prev,
        [type]: reader.result
      }));
    };
    reader.readAsDataURL(imageFile);

    setImageUploading(prev => ({ ...prev, [type]: true }));
    setError("");

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        formData
      );

      setFormData(prev => ({
        ...prev,
        [type]: response.data.secure_url
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      setError(`Failed to upload ${type === 'aadharFront' ? 'front' : 'back'} image. Please try again.`);
      // Remove preview on error
      setPreviewImages(prev => ({
        ...prev,
        [type]: null
      }));
    } finally {
      setImageUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const removeImage = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: ""
    }));
    setPreviewImages(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.mobileNumber.trim()) return "Mobile number is required";
    if (!/^\d{10}$/.test(formData.mobileNumber)) return "Invalid mobile number";
    if (formData.whatsappNumber && !/^\d{10}$/.test(formData.whatsappNumber)) {
      return "Invalid WhatsApp number";
    }
    return "";
  };

  const validateStep2 = () => {
    if (!formData.operatorName) return "Please select operator type";
    if (!formData.expectedSalaryMin) return "Minimum salary is required";
    if (!formData.expectedSalaryMax) return "Maximum salary is required";
    if (Number(formData.expectedSalaryMin) > Number(formData.expectedSalaryMax)) {
      return "Minimum salary cannot be greater than maximum salary";
    }
    if (!formData.address.trim()) return "Address is required";
    return "";
  };

  const validateStep3 = () => {
    if (!formData.aadharFront) return "Aadhar front image is required";
    if (!formData.aadharBack) return "Aadhar back image is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate current step
    let validationError = "";
    if (currentStep === 1) validationError = validateStep1();
    else if (currentStep === 2) validationError = validateStep2();
    else if (currentStep === 3) validationError = validateStep3();

    if (validationError) {
      setError(validationError);
      return;
    }

    // If not on last step, move to next
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      setError("");
      return;
    }

    // Submit form
    setLoading(true);
    setError("");

    const submitData = {
      name: formData.name,
      address: formData.address,
      mobileNumber: formData.mobileNumber,
      whatsappNumber: formData.whatsappNumber || formData.mobileNumber,
      operatorName: formData.operatorName,
      expectedSalaryMin: Number(formData.expectedSalaryMin),
      expectedSalaryMax: Number(formData.expectedSalaryMax),
      aadharFront: formData.aadharFront,
      aadharBack: formData.aadharBack,
      experience: formData.experience,
      availability: formData.availability,
      preferredLocation: formData.preferredLocation,
      languages: formData.languages,
      skills: formData.skills
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/technicians/register`,
        submitData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep >= step
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-gray-200 text-gray-600"
                }`}
            >
              {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${currentStep > step ? "bg-blue-600" : "bg-gray-200"
                  }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-12 mt-2 text-sm">
        <span className={currentStep === 1 ? "text-blue-600 font-medium" : "text-gray-500"}>
          Personal Info
        </span>
        <span className={currentStep === 2 ? "text-blue-600 font-medium" : "text-gray-500"}>
          Professional Details
        </span>
        <span className={currentStep === 3 ? "text-blue-600 font-medium" : "text-gray-500"}>
          Documents
        </span>
      </div>
    </div>
  );

  if (success) {
    return (
      <React.Fragment>
        <UserNavbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Registration Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for registering. Our team will review your application and contact you soon.
              </p>
            </div>
          </div>
        </div>
        <AllUserFooter />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <UserNavbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-bold mb-4">Technical Operator Registration</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Join our network of skilled operators and get access to top construction companies
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">150+</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Avg. Salary</p>
                  <p className="text-2xl font-bold text-gray-900">₹25k - 45k</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Companies</p>
                  <p className="text-2xl font-bold text-gray-900">75+</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {renderStepIndicator()}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        maxLength="10"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter 10-digit mobile number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageCircle className="w-4 h-4 inline mr-2" />
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                        maxLength="10"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter WhatsApp number (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Languages Known
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {languageOptions.map(lang => (
                          <label key={lang} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.languages.includes(lang)}
                              onChange={() => handleArrayChange('languages', lang)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{lang}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Details */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Professional Details
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Wrench className="w-4 h-4 inline mr-2" />
                        Operator Type *
                      </label>
                      <select
                        name="operatorName"
                        value={formData.operatorName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="">Select operator type</option>
                        {operatorTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        min="0"
                        max="50"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Years of experience"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <IndianRupee className="w-4 h-4 inline mr-2" />
                          Expected Salary (Min) *
                        </label>
                        <input
                          type="number"
                          name="expectedSalaryMin"
                          value={formData.expectedSalaryMin}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Minimum salary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <IndianRupee className="w-4 h-4 inline mr-2" />
                          Expected Salary (Max) *
                        </label>
                        <input
                          type="number"
                          name="expectedSalaryMax"
                          value={formData.expectedSalaryMax}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Maximum salary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your full address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Preferred Work Location
                      </label>
                      <input
                        type="text"
                        name="preferredLocation"
                        value={formData.preferredLocation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="City/District"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        {availabilityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {skillOptions.map(skill => (
                          <label key={skill} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.skills.includes(skill)}
                              onChange={() => handleArrayChange('skills', skill)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{skill}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Documents */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Document Upload
                    </h3>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Aadhar Card Required</h4>
                          <p className="text-sm text-blue-700">
                            Please upload clear images of your Aadhar card (front and back)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Aadhar Front */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhar Card (Front) *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {previewImages.aadharFront ? (
                          <div className="relative">
                            <img
                              src={previewImages.aadharFront}
                              alt="Aadhar Front Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage('aadharFront')}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'aadharFront')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={imageUploading.aadharFront}
                              />
                              <button
                                type="button"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                disabled={imageUploading.aadharFront}
                              >
                                {imageUploading.aadharFront ? (
                                  <span className="flex items-center">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Uploading...
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Front Image
                                  </span>
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Supported formats: JPG, PNG (Max 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Aadhar Back */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhar Card (Back) *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {previewImages.aadharBack ? (
                          <div className="relative">
                            <img
                              src={previewImages.aadharBack}
                              alt="Aadhar Back Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage('aadharBack')}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'aadharBack')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={imageUploading.aadharBack}
                              />
                              <button
                                type="button"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                disabled={imageUploading.aadharBack}
                              >
                                {imageUploading.aadharBack ? (
                                  <span className="flex items-center">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Uploading...
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Back Image
                                  </span>
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Supported formats: JPG, PNG (Max 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* Form Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(prev => prev - 1);
                        setError("");
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center ${currentStep === 1 ? 'ml-auto' : ''
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : currentStep === 3 ? (
                      'Submit Registration'
                    ) : (
                      <>
                        Next Step
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Need Help?</h4>
                <p className="text-sm text-gray-600">
                  If you face any issues while registering, please contact our support team at{" "}
                  <a href="tel:18001234567" className="text-blue-600 hover:underline">
                    1800-123-4567
                  </a>{" "}
                  or email{" "}
                  <a href="mailto:support@pandamachines.com" className="text-blue-600 hover:underline">
                    support@pandamachines.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AllUserFooter />

      {/* Add custom animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </React.Fragment>
  );
};

export default TechnicalOperator;