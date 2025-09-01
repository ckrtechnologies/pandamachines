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
    <div>
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
