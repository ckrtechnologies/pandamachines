import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import loginPanda from "../../../Assets/img/common/loginPanda.gif";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const SupplierLogin = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterClick,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setPhoneError("");

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/supplier/suppliers/login`,
        { phoneNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        localStorage.setItem(
          "pm-supplier-data",
          JSON.stringify(response.data.data)
        );
        toast.success("OTP sent successfully!");
        setShowOtpField(true);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");

    const otpRegex = /^[0-9]{4}$/;

    if (!otpRegex.test(otp)) {
      setOtpError("Please enter a valid 4-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      if (otp === "1111") {
        toast.success("OTP verified!");

        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have been logged in successfully as a supplier.",
          confirmButtonColor: "#004680",
        });

        if (onLoginSuccess) {
          onLoginSuccess();
        }

        handleClose();
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPhoneNumber("");
    setOtp("");
    setShowOtpField(false);
    setPhoneError("");
    setOtpError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChangePhoneNumber = () => {
    setShowOtpField(false);
    setOtp("");
    setOtpError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex transform transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Left Column - Design Section */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-[#00395F] via-purple-800 to-[#FF8617] relative">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Welcome Supplier!</h2>
              <p className="text-lg opacity-90 mb-8">
                Login to manage your business with us.
              </p>
              <div className="bg-white bg-opacity-20 rounded-full p-4 inline-block">
                <img
                  className="h-20 md:h-28 w-auto"
                  src={loginPanda}
                  alt="panda-img"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Section */}
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Supplier Login</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {!showOtpField ? (
              <form onSubmit={handlePhoneSubmit}>
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
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/\D/g, ""))
                      }
                      className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="9876543210"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                  {phoneError && (
                    <p className="mt-2 text-sm text-red-600">{phoneError}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    We'll send you a verification code
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                    loading
                      ? "bg-[#FF8617]"
                      : "bg-primaryBtnColor hover:bg-primaryBtnHoverColor"
                  } duration-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <div className="flex space-x-3">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        type="text"
                        value={otp[index] || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value) {
                            const newOtp =
                              otp.slice(0, index) +
                              value +
                              otp.slice(index + 1);
                            setOtp(newOtp.slice(0, 4));
                            // Auto focus to next input
                            if (index < 3 && value) {
                              document
                                .getElementById(`supplier-otp-${index + 1}`)
                                .focus();
                            }
                          } else {
                            setOtp(otp.slice(0, index) + otp.slice(index + 1));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            !otp[index] &&
                            index > 0
                          ) {
                            document
                              .getElementById(`supplier-otp-${index - 1}`)
                              .focus();
                          }
                        }}
                        id={`supplier-otp-${index}`}
                        className="block w-full px-4 py-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength="1"
                        required
                      />
                    ))}
                  </div>
                  {otpError && (
                    <p className="mt-2 text-sm text-red-600">{otpError}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    OTP sent to +91 {phoneNumber}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                    loading ? "bg-[#FF8617]" : "bg-[#00395F] hover:bg-[#FF8617]"
                  } duration-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3`}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleChangePhoneNumber}
                    className="text-sm text-[#FF8617] hover:text-blue-800 font-medium"
                  >
                    Change Phone Number
                  </button>
                </div>
              </form>
            )}

            {/* Register Link Section */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?
                <button
                  className="text-[#FF8617] font-medium hover:underline focus:outline-none ml-1"
                  onClick={onRegisterClick}
                >
                  Register as Supplier
                </button>
              </p>
            </div>
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

export default SupplierLogin;
