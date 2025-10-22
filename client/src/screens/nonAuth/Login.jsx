// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import logo from "../../Assets/img/Logos/PMLogo.png";
// import animatedPandaImg from "../../Assets/Images/animatedPandaImg.gif";
// import { MdOutlineHome } from "react-icons/md";
// import { RiExchange2Line } from "react-icons/ri";
// import toast from "react-hot-toast";
// import Swal from "sweetalert2";

// const Login = () => {
//   const navigate = useNavigate();
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [showOtpField, setShowOtpField] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [phoneError, setPhoneError] = useState("");
//   const [otpError, setOtpError] = useState("");

//   const handlePhoneSubmit = async (e) => {
//     e.preventDefault();
//     setPhoneError("");

//     const phoneRegex = /^[0-9]{10}$/;

//     if (!phoneRegex.test(phoneNumber)) {
//       setPhoneError("Please enter a valid 10-digit phone number.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/admins/admin-login-by-phone`,
//         { phoneNumber },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (response.data.success) {
//         localStorage.setItem(
//           "pm-admin-data",
//           JSON.stringify(response.data.data)
//         );
//         toast.success("OTP sent successfully!");
//         setShowOtpField(true);
//       } else {
//         toast.error(response.data.message || "Failed to send OTP");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.error || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     setOtpError("");

//     const otpRegex = /^[0-9]{4}$/;

//     if (!otpRegex.test(otp)) {
//       setOtpError("Please enter a valid 4-digit OTP.");
//       return;
//     }

//     setLoading(true);

//     try {
//       if (otp === "1111") {
//         toast.success("OTP verified!");

//         await Swal.fire({
//           icon: "success",
//           title: "Login Successful",
//           text: "You have been logged in successfully.",
//           confirmButtonColor: "#3085d6",
//         });

//         navigate("/dashboard");
//       } else {
//         toast.error("Invalid OTP. Please try again.");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.error || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="lg:flex">
//       <div className="lg:w-1/2 xl:max-w-screen-sm">
//         <div className="mt-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
//           <div className="cursor-pointer flex items-center">
//             <div>
//               <svg
//                 className="w-10 text-indigo-500"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 225 225"
//               >
//                 <style>
//                   {
//                     ".st0{fill:none;stroke:currentColor;stroke-width:20;stroke-linecap:round;stroke-miterlimit:3;}"
//                   }
//                 </style>
//                 <g>
//                   <path
//                     className="st0"
//                     d="M173.8,151.5l13.6-13.6 M35.4,89.9l29.1-29 M89.4,34.9v1 M137.4,187.9l-0.6-0.4 M36.6,138.7l0.2-0.2 M56.1,169.1l27.7-27.6 M63.8,111.5l74.3-74.4 M87.1,188.1L187.6,87.6 M110.8,114.5l57.8-57.8"
//                   />
//                 </g>
//               </svg>
//             </div>
//             <div className="text-2xl text-indigo-800 tracking-wide ml-2 font-semibold">
//               Welcome to Panda Machines
//             </div>
//           </div>
//         </div>

//         <div className="mt-10 lg:mt-24 px-12 sm:px-24 md:px-48 lg:px-12 xl:px-24 xl:max-w-2xl">
//           <div className="w-full flex justify-center">
//             <img
//               className="h-20 md:h-28 mb-16 w-auto object-contain"
//               src={logo}
//               alt="logo"
//             />
//           </div>

//           <h2 className="text-center text-3xl text-[#00395F] font-display font-semibold lg:text-left xl:text-4xl xl:text-bold">
//             {showOtpField ? "Enter OTP" : "Log in"}
//           </h2>

//           {error && (
//             <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
//               {error}
//             </div>
//           )}

//           <div className="mt-6">
//             {!showOtpField ? (
//               <div>
//                 <form onSubmit={handlePhoneSubmit}>
//                   <div>
//                     <div className="text-sm font-bold text-gray-700 tracking-wider">
//                       Phone Number
//                     </div>
//                     <input
//                       className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none tracking-wider focus:border-indigo-500"
//                       type="tel"
//                       placeholder="7008190098"
//                       value={phoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value)}
//                       required
//                     />
//                     {phoneError && (
//                       <div className="text-xs text-red-600 mt-1">
//                         {phoneError}
//                       </div>
//                     )}
//                   </div>

//                   <div className="mt-10">
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="bg-[#00395F] text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-[#FF8617] shadow-lg disabled:opacity-70"
//                     >
//                       {loading ? "Sending OTP..." : "Send OTP"}
//                     </button>
//                   </div>
//                 </form>

//                 <div className="mt-8 text-sm text-center">
//                   <button
//                     onClick={() => {
//                       navigate("/");
//                     }}
//                     className="text-[#FF8617] hover:text-indigo-800 flex items-center gap-2 justify-center w-full font-semibold transition duration-200"
//                   >
//                     <MdOutlineHome size={20} />
//                     <span>Go Home</span>
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleOtpSubmit}>
//                 <div>
//                   <div className="text-sm font-bold text-gray-700 tracking-wider">
//                     OTP
//                   </div>
//                   <input
//                     className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none tracking-wider focus:border-indigo-500"
//                     type="text"
//                     placeholder="Enter OTP"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     required
//                   />
//                   {otpError && (
//                     <div className="text-xs text-red-600 mt-1">{otpError}</div>
//                   )}
//                   <div className="text-xs text-gray-500 mt-1">
//                     We've sent an OTP to {phoneNumber}
//                   </div>
//                 </div>

//                 <div className="mt-10">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-[#00395F] text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-[#FF8617] shadow-lg disabled:opacity-70"
//                   >
//                     {loading ? "Verifying..." : "Verify OTP"}
//                   </button>
//                 </div>

//                 <div className="mt-8 text-sm text-center">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowOtpField(false);
//                       setError("");
//                       setOtp("");
//                     }}
//                     className="text-[#FF8617] hover:text-indigo-800 flex items-center gap-2 justify-center w-full font-semibold transition duration-200"
//                   >
//                     <RiExchange2Line size={20} />
//                     <span>Change Phone Number</span>
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="hidden lg:flex items-center justify-center bg-indigo-100 flex-1 h-screen">
//         <div>
//           <img
//             className="h-auto w-auto object-contain"
//             src={animatedPandaImg}
//             alt="login-image"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../Assets/img/Logos/PMLogo.png";
import animatedPandaImg from "../../Assets/Images/animatedPandaImg.gif";
import { MdOutlineHome } from "react-icons/md";
import { RiExchange2Line } from "react-icons/ri";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [adminData, setAdminData] = useState(null); // Store admin data from API

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
        `${process.env.REACT_APP_API_URL}/admins/admin-login-by-phone`,
        { phoneNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        // Store the admin data from API response
        setAdminData(response.data.data);
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
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have been logged in successfully.",
          confirmButtonColor: "#3085d6",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("pm-supplier-data");

            // Store the complete admin data from API response
            if (adminData) {
              localStorage.setItem("pm-admin-data", JSON.stringify(adminData));
            }

            toast.success("OTP verified!");
            navigate("/dashboard");
          }
        });
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

  return (
    <div className="lg:flex">
      <div className="lg:w-1/2 xl:max-w-screen-sm">
        <div className="mt-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
          <div className="cursor-pointer flex items-center">
            <div>
              <svg
                className="w-10 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 225 225"
              >
                <style>
                  {
                    ".st0{fill:none;stroke:currentColor;stroke-width:20;stroke-linecap:round;stroke-miterlimit:3;}"
                  }
                </style>
                <g>
                  <path
                    className="st0"
                    d="M173.8,151.5l13.6-13.6 M35.4,89.9l29.1-29 M89.4,34.9v1 M137.4,187.9l-0.6-0.4 M36.6,138.7l0.2-0.2 M56.1,169.1l27.7-27.6 M63.8,111.5l74.3-74.4 M87.1,188.1L187.6,87.6 M110.8,114.5l57.8-57.8"
                  />
                </g>
              </svg>
            </div>
            <div className="text-2xl text-indigo-800 tracking-wide ml-2 font-semibold">
              Welcome to Panda Machines
            </div>
          </div>
        </div>

        <div className="mt-10 lg:mt-24 px-12 sm:px-24 md:px-48 lg:px-12 xl:px-24 xl:max-w-2xl">
          <div className="w-full flex justify-center">
            <img
              className="h-20 md:h-28 mb-16 w-auto object-contain"
              src={logo}
              alt="logo"
            />
          </div>

          <h2 className="text-center text-3xl text-[#00395F] font-display font-semibold lg:text-left xl:text-4xl xl:text-bold">
            {showOtpField ? "Enter OTP" : "Log in"}
          </h2>

          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="mt-6">
            {!showOtpField ? (
              <div>
                <form onSubmit={handlePhoneSubmit}>
                  <div>
                    <div className="text-sm font-bold text-gray-700 tracking-wider">
                      Phone Number
                    </div>
                    <input
                      className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none tracking-wider focus:border-indigo-500"
                      type="tel"
                      placeholder="7008190098"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                    {phoneError && (
                      <div className="text-xs text-red-600 mt-1">
                        {phoneError}
                      </div>
                    )}
                  </div>

                  <div className="mt-10">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#00395F] text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-[#FF8617] shadow-lg disabled:opacity-70"
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-sm text-center">
                  <button
                    onClick={() => {
                      navigate("/");
                    }}
                    className="text-[#FF8617] hover:text-indigo-800 flex items-center gap-2 justify-center w-full font-semibold transition duration-200"
                  >
                    <MdOutlineHome size={20} />
                    <span>Go Home</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div>
                  <div className="text-sm font-bold text-gray-700 tracking-wider">
                    OTP
                  </div>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none tracking-wider focus:border-indigo-500"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  {otpError && (
                    <div className="text-xs text-red-600 mt-1">{otpError}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    We've sent an OTP to {phoneNumber}
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#00395F] text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-[#FF8617] shadow-lg disabled:opacity-70"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>

                <div className="mt-8 text-sm text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpField(false);
                      setError("");
                      setOtp("");
                    }}
                    className="text-[#FF8617] hover:text-indigo-800 flex items-center gap-2 justify-center w-full font-semibold transition duration-200"
                  >
                    <RiExchange2Line size={20} />
                    <span>Change Phone Number</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-indigo-100 flex-1 h-screen">
        <div>
          <img
            className="h-auto w-auto object-contain"
            src={animatedPandaImg}
            alt="login-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
