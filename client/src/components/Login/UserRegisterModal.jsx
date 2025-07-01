import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const UserRegisterModal = ({ onClose, onLoginClick }) => {
  const [step, setStep] = useState(1); // 1: phone, 2: OTP, 3: details
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
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

    // In a real app, you would send the phone to your backend to get OTP
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
        setIsLoading(false);
        setStep(3);
      } else {
        alert("Invalid OTP. Please try again.");
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = JSON.stringify({
      ...formData,
      phone: phone,
    });

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
      console.log(response.data);
      alert("Registration successful!");
      onLoginClick();
    } catch (error) {
      console.log(error);
      alert("Registration failed. Please try again.");
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex">
        {/* Left Column */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-[#00395F] via-purple-800 to-[#FF8617] relative">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Create Account</h2>
              <p className="text-lg opacity-90 mb-8">
                Join us to access exclusive features.
              </p>
              <div className="bg-white bg-opacity-20 rounded-full p-4 inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
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
                    Profile Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/profile.jpg"
                  />
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
