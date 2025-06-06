import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { IoIosKey } from "react-icons/io";
import ButtonLoader from "../../components/common/ButtonLoader";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ phoneNumber: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { phoneNumber: "", password: "" };

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
      valid = false;
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("carRental-token", "demo-token");
        localStorage.setItem(
          "carRental-userData",
          JSON.stringify({ phoneNumber })
        );
        navigate("/dashboard");
      }, 1000); // Simulate short delay
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-300 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-10">
        <h1 className="text-center text-2xl font-bold text-primaryColor mb-1">
          Welcome Back!
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your credentials to continue
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor`}
              placeholder="Enter 10 digit phone number"
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 flex justify-center items-center bg-primaryBtnColor text-white font-semibold rounded-md transition hover:bg-primaryBtnHoverColor"
            >
              {isLoading ? <ButtonLoader /> : "Login"}
            </button>
          </div>

          <div className="flex justify-between text-sm mt-4 text-primaryTextColor">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-secondaryTextColor hover:text-primaryColor"
            >
              <HiMiniHome size={18} /> Home
            </button>
            <button
              onClick={() => navigate("/forgot-password")}
              className="flex items-center gap-1 text-secondaryTextColor hover:text-primaryColor"
            >
              <IoIosKey size={18} /> Forgot Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
