import React, { useState } from "react";
import { FiUsers, FiLayers, FiGrid, FiPackage } from "react-icons/fi";
import OrdersChart from "./OrdersChart";
import CategoryModal from "../Category/CategoryModal";
import AddSubCategoryModal from "../Sub-category/AddSubCategoryModal";
import { useNavigate } from "react-router-dom";

const DashboardCards = () => {
  const [modalType, setModalType] = useState("add modal");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate()

  const fetchCategories = () => {
    console.log('Refreshing categories...');
  };
  const stats = [
    {
      title: "Total Users",
      value: "1,254",
      change: "+12.5%",
      isIncrease: true,
      icon: <FiUsers className="text-blue-500" size={24} />,
      color: "bg-blue-100",
    },
    {
      title: "Categories",
      value: "24",
      change: "+3.2%",
      isIncrease: true,
      icon: <FiLayers className="text-green-500" size={24} />,
      color: "bg-green-100",
    },
    {
      title: "Sub-Categories",
      value: "156",
      change: "-2.1%",
      isIncrease: false,
      icon: <FiGrid className="text-purple-500" size={24} />,
      color: "bg-purple-100",
    },
    {
      title: "Products",
      value: "2,843",
      change: "+8.7%",
      isIncrease: true,
      icon: <FiPackage className="text-orange-500" size={24} />,
      color: "bg-orange-100",
    },
  ];

  // Helper functions for consistent colors
  function getGradientColor(index) {
    const gradients = [
      "bg-gradient-to-b from-blue-500 to-blue-400",
      "bg-gradient-to-b from-green-500 to-green-400",
      "bg-gradient-to-b from-purple-500 to-purple-400",
      "bg-gradient-to-b from-amber-500 to-amber-400",
    ];
    return gradients[index % gradients.length];
  }

  function getIconBgColor(index) {
    const colors = [
      "bg-blue-100",
      "bg-green-100",
      "bg-purple-100",
      "bg-amber-100",
    ];
    return colors[index % colors.length];
  }

  function getIconColor(index) {
    const colors = [
      "text-blue-600",
      "text-green-600",
      "text-purple-600",
      "text-amber-600",
    ];
    return colors[index % colors.length];
  }
  const refreshSubCategories = () => {
    console.log('Refreshing Subcategories...');
  };
  const handleAddCategory = () => {
    setModalType("addModal");
    setSelectedCategory(null);
    setIsModalOpen(true);
  };
  const handleAddSubCategory = () => {
    setIsAddModalOpen(true);
    setSelectedSubCategory(null)
  };

  return (
    <div className="">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative p-6 rounded-xl bg-white border border-gray-100 overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-lg shadow-md"
          >
            {/* Gradient accent bar */}
            <div
              className={`absolute top-0 left-0 w-1 h-full ${getGradientColor(
                index
              )}`}
            ></div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`p-3 rounded-lg bg-opacity-80 ${getIconBgColor(
                  index
                )} group-hover:scale-110 transition-transform`}
              >
                {React.cloneElement(stat.icon, {
                  className: `${getIconColor(index)} text-xl`,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Section */}
        <OrdersChart />

        {/* Quick Actions Section */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors">
              <span className="text-blue-600">Add New User</span>
              <FiUsers className="text-blue-400" />
            </button>
            <button onClick={handleAddCategory} className="w-full flex items-center justify-between p-3 hover:bg-green-50 rounded-lg transition-colors">
              <span className="text-green-600">Create Category</span>
              <FiLayers className="text-green-400" />
            </button>
            <button onClick={handleAddSubCategory} className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-lg transition-colors">
              <span className="text-purple-600">Add Sub-Category</span>
              <FiGrid className="text-purple-400" />
            </button>
            <button
              onClick={() => navigate("/admin-products")}
              className="w-full flex items-center justify-between p-3 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <span className="text-orange-600">Upload Product</span>
              <FiPackage className="text-orange-400" />
            </button>

            <button onClick={() => navigate("/admin-categories")}
             className="w-full flex items-center justify-between p-3 hover:bg-[#f3f5f7] rounded-lg transition-colors"
             >
              <span className="text-[#00395F]">All Categories</span>
              <FiLayers className="text-[#00395F]" />
            </button>
          </div>
          {isModalOpen && (
            <CategoryModal
              setIsModalOpen={setIsModalOpen}
              refreshFun={fetchCategories}
              modalType={modalType}
              categoryDetails={selectedCategory}
            />
          )}
          {isAddModalOpen && (
            <AddSubCategoryModal
              isOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
              categoryDetails={selectedSubCategory}
              subCatsByCat={refreshSubCategories}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
