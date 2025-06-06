import React from "react";

const FooterDashBoard = () => {
  const current_year = new Date().getFullYear()

  return (
    <footer className="py-4 mx-6 mb-6 rounded-md bg-white shadow-lg flex items-center justify-between text-xs px-4 md:px-8">
      <p className="text-primaryColor tracking-wide font-medium text-[16px]">
        &copy; {current_year} {process.env.REACT_APP_NAME}. All rights reserved
      </p>
      <p className="text-primaryTextColor font-medium text-[16px] tracking-wide">
        Design & Developed by{" "}
        <a href="https://www.webbocket.com/" target="_blank" rel="noreferrer">
          <span className="text-orange-600 cursor-pointer">
            Web_Bocket
          </span>
        </a>
      </p>
    </footer>
  );
};

export default FooterDashBoard;
