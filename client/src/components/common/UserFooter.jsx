import React from "react";
import { useNavigate } from "react-router-dom";

const UserFooter = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <React.Fragment>
      <footer className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 text-center py-8 shadow-inner">
        <h4 className="text-lg font-semibold text-gray-800">Stay Connected with Us!</h4>
        <p className="text-sm mt-2 text-gray-700">Bringing talent and opportunities together with Dmploi</p>
      </footer>

      <div className="flex flex-wrap justify-center items-center w-full py-3 px-6 text-sm bg-yellow-500 text-white">
        <span className="mr-2">© {currentYear},</span>
        <span className="font-semibold text-gray-900">Dmploi</span>
        <span className="mx-2">|</span>
        <span
          onClick={() => window.open("https://webbocket.com/", "_blank")}
          className="text-white underline cursor-pointer hover:text-gray-200"
        >
          Web_Bocket PVT LTD.
        </span>
        <span className="ml-2">All Rights Reserved.</span>
      </div>
    </React.Fragment>
  );
};

export default UserFooter;
