import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import regPanda from "../../Assets/img/common/registerPanda.gif";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaFileImage, FaSpinner } from "react-icons/fa";
import uploadToCloudinary from "../../utils/uploadToCloudinary";

const UserRegisterModal = ({ onClose, onLoginClick }) => {
  const [step, setStep] = useState(1); // 1: phone, 2: OTP, 3: details
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (otp === "1111") {
        toast.success("OTP Verified!");
        setStep(3);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = JSON.stringify({
      ...formData,
      phone: phone,
    });
    // console.log("data:", data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/customers/create-user`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Registration successful!");

      await Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Your account has been created successfully.",
        confirmButtonColor: "#3085d6",
      });

      onLoginClick();
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");

      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //HANDLE CAMPAIGN IMAGE CHANGE
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));

    try {
      setIsImageUploading(true);
      const uploadedUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: uploadedUrl,
      }));
      setPreviewUrl(null); 
    } catch (error) {
      console.log("Error uploading image:", error);
    } finally {
      setIsImageUploading(false); 
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
    setPreviewUrl(null); // clear preview as well
  };

  //TO TRIGGER FILE EXPLORER OPENING FOR IMAGE UPLOADING
  const triggerImageInput = (index) => {
    document.getElementById(`profile-upload`)?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex">
        {/* Left Column */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-[#00395F] via-purple-800 to-[#FF8617] relative">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-lg opacity-90 mb-8">
                Join us to access exclusive features.
              </p>
              <div className="bg-white bg-opacity-20 rounded-full w-36 h-36 inline-block">
                <img
                  className="h-20 md:h-32 w-auto object-contain"
                  src={regPanda}
                  alt="panda-img"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 1
                ? "Register"
                : step === 2
                ? "Verify OTP"
                : "Complete Profile"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">+91</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="9876543210"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    We'll send you a verification code
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                    isLoading
                      ? "bg-[#FF8617]"
                      : "bg-[#00395F] hover:bg-[#FF8617]"
                  } duration-200 transition-colors`}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      className="text-[#FF8617] font-medium hover:underline focus:outline-none ml-1"
                      onClick={onLoginClick}
                    >
                      Login
                    </button>
                  </p>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <div className="flex gap-3">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        type="text"
                        value={otp[index] || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 1) {
                            const newOtp = otp.split("");
                            newOtp[index] = value;
                            setOtp(newOtp.join(""));

                            // Auto focus to next input
                            if (value && index < 3) {
                              document
                                .getElementById(`otp-${index + 1}`)
                                .focus();
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace to move to previous input
                          if (
                            e.key === "Backspace" &&
                            !otp[index] &&
                            index > 0
                          ) {
                            document.getElementById(`otp-${index - 1}`).focus();
                          }
                        }}
                        id={`otp-${index}`}
                        className="block w-full px-4 py-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength="1"
                        required
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    OTP sent to +91 {phone}
                  </p>
                </div>

                {/* <div className="mb-6">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234"
                    maxLength="4"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    OTP sent to +91 {phone}
                  </p>
                </div> */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                    isLoading
                      ? "bg-[#FF8617]"
                      : "bg-[#00395F] hover:bg-[#FF8617]"
                  } duration-200 transition-colors`}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-[#FF8617] hover:text-blue-800 font-medium"
                  >
                    Change Phone Number
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleRegister}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Gender (Optional)
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="imageUrl"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Profile Image (Optional)
                  </label>
                  <div className="flex items-start gap-4">
                    {formData.imageUrl?.length < 1 && (
                      <button
                        type="button"
                        onClick={() => triggerImageInput("profile-upload")}
                        className="flex flex-col items-center justify-center w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-primaryColor transition-colors"
                      >
                        <FaFileImage className="text-2xl text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Upload Image
                        </span>
                      </button>
                    )}

                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {(previewUrl || formData.imageUrl) && (
                      <div className="flex-1 overflow-x-auto pb-2">
                        <div className="flex gap-3">
                          <div className="relative flex-shrink-0 w-32 h-24">
                            <img
                              src={previewUrl || formData.imageUrl}
                              alt="Upload"
                              className="w-full h-full object-cover rounded border"
                            />
                            {isImageUploading && (
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
                                <FaSpinner className="text-white animate-spin" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-5 h-5 pb-0.5 flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                            >
                              <span>x</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                    isLoading
                      ? "bg-[#FF8617]"
                      : "bg-[#00395F] hover:bg-[#FF8617]"
                  } duration-200 transition-colors`}
                >
                  {isLoading ? "Registering..." : "Complete Registration"}
                </button>
              </form>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t">
            <p className="text-center text-sm text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-[#FF8617] hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#FF8617] hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterModal;
