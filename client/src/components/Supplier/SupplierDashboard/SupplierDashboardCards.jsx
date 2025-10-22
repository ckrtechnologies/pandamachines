import React, { useState } from "react";
import { FiPackage } from "react-icons/fi";
import OrdersChart from "../../AdminSideComponents/Dashboards/OrdersChart";
import { useNavigate } from "react-router-dom";
import { TbCategory2, TbCategoryMinus } from "react-icons/tb";
import { MdOutlineCategory } from "react-icons/md";

const SupplierDashboardCards = () => {
  const navigate = useNavigate();

  const fetchCategories = () => {
    console.log("Refreshing categories...");
  };

  const handleAddCategory = () => {
    navigate("/supplier-categories");
  };
  const handleAddSubCategory = () => {
    navigate("/supplier-sub-categories");
  };
  const handleSubSubCategories = () => {
    navigate("/supplier-tier3-categories");
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OrdersChart />

        {/* Quick Actions Section */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-5">
            <button
              onClick={handleAddCategory}
              className="w-full flex items-center justify-between p-4 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <span className="text-blue-600">All Categories</span>
              <TbCategory2 className="text-blue-400" />
            </button>
            <button
              onClick={handleAddSubCategory}
              className="w-full flex items-center justify-between p-4 hover:bg-green-50 rounded-lg transition-colors"
            >
              <span className="text-green-600">All Sub-Categories</span>
              <MdOutlineCategory className="text-green-400" />
            </button>
            <button
              onClick={handleSubSubCategories}
              className="w-full flex items-center justify-between p-4 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <span className="text-purple-600">All Tier-3-Categories</span>
              <TbCategoryMinus className="text-purple-400" />
            </button>
            <button
              onClick={() => navigate("/supplier-products")}
              className="w-full flex items-center justify-between p-4 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <span className="text-amber-600">Your Products</span>
              <FiPackage className="text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboardCards;
