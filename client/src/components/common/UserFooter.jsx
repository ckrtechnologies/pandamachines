import React from "react";
import pay_Methods from "../../Assets/Images/payment_method.png";

const UserFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white py-4 shadow-md border-t px-4 xl:px-10">
      <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-3 text-sm">
        <div className="space-x-2">
          <span>© {currentYear},</span>
          <span className="font-semibold text-[#FF8717]">Panda Machines.</span>
          <span className="text-[#5F5D5D]">All Rights Reserved.</span>
        </div>

        <div className="flex items-center gap-3">
          <img src={pay_Methods} alt="pay_Methods" className="h-6" />
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
