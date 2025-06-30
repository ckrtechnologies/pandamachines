import React from "react";
import { useNavigate } from "react-router-dom";
import "./animatedText.css";
import logo from "../../Assets/Logos/PMLogo.png";
import animatedPandaImg from "../../Assets/Images/animatedPandaImg.gif";

const Login = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/dashboard");
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
              Welcome in Panda Machines
            </div>
          </div>
        </div>

        <div className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl">
          <div className="w-full flex justify-center">
            <img
              className="h-20 md:h-28 mb-4 w-auto object-contain"
              src={logo}
              alt="logo"
            />
          </div>
          <h2 className="text-center text-3xl text-[#00395F] font-display font-semibold lg:text-left xl:text-4xl xl:text-bold">
            Log in
          </h2>
          <div className="mt-6">
            <form onSubmit={handleLogin}>
              <div>
                <div className="text-sm font-bold text-gray-700 tracking-wider">
                  Email Address
                </div>
                <input
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none tracking-wider focus:border-indigo-500"
                  type="email"
                  placeholder="mike@gmail.com"
                />
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold text-gray-700 tracking-wider">
                    Password
                  </div>
                </div>
                <input
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none tracking-wider focus:border-indigo-500"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  className="bg-[#00395F] text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-[#FF8617] shadow-lg"
                >
                  Log In
                </button>
              </div>
            </form>

            <div className="mt-12 text-sm font-display tracking-wide font-semibold text-gray-700 text-center">
              Forgot Your{" "}
              <a className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                Password ?
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-indigo-100 flex-1 h-screen">
        <div>
          <img
            className="h-auto w-auto object-contain"
            src={animatedPandaImg}
            alt="lgn-img"
          />

          <div className="animated-text-container">
            <div className="animated-text">Panda</div>
            <div className="animated-text">Machines Pvt Ltd</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
