import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiDownload,
} from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import CategoryModal from "../../../components/AdminSideComponents/Category/CategoryModal";
import DeleteAlertModal from "../../../components/AdminSideComponents/Common/DeleteAlertModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import exportToExcel from "../../../utils/exportToExcel";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("addModal");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setModalType("addModal");
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setModalType("editModal");
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/categories/delete-category/${categoryToDelete._id}`
      );
      fetchCategories();
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
    setDeleteLoading(false);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      const categoriesToExport =
        filteredCategories.length > 0 ? filteredCategories : categories;

      if (categoriesToExport?.length > 0) {
        const tableData = categoriesToExport.map((cat) => ({
          "Category ID": cat._id,
          "Category Name": cat.name || "N/A",
          Description: cat.description || "N/A",
          Sequence: cat.sequence || "N/A",
          "Image URL": cat.imgUrl || "N/A",
        }));

        const fileName = `Categories_${new Date()
          .toLocaleDateString("en-IN")
          .replace(/\//g, "-")}`;

        exportToExcel(tableData, fileName);
      } else {
        toast.error("No categories data to export");
      }
    } catch (error) {
      console.error("Error during export:", error);
      toast.error("Failed to export categories");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product categories
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleExportClick}
            disabled={isExporting}
            className="flex items-center gap-2 border border-green-300 rounded-lg px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            <FiDownload size={16} />
            {isExporting ? "Exporting..." : "Export"}
          </button>

          <button
            onClick={handleAddCategory}
            className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <FiPlus className="mr-2" />
            Add Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {loading
          ? Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md animate-pulse"
              >
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-200"></div>
                  <div className="p-3 flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          : filteredCategories.map((category) => (
              <div
                key={category?._id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md"
              >
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0 relative">
                    <img
                      src={category?.imgUrl}
                      alt={category?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                    <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-sm font-medium px-2 py-1 rounded">
                      S - {category?.sequence}
                    </div>
                  </div>

                  <div className="p-3 flex-grow">
                    <div className="flex justify-between flex-wrap">
                      <h3 className="text-sm md:text-md lg:text-lg font-bold text-gray-800 truncate">
                        {category?.name.length > 30
                          ? category?.name.substring(0, 30) + "..."
                          : category?.name}
                      </h3>
                      <div className="flex space-x-2 ml-2">
                        <button className="text-[#FF8617] hover:text-[#CC5F0F]">
                          <FaRegEye
                            size={18}
                            onClick={() =>
                              navigate(
                                `/admin-category-details/${category?._id}`
                              )
                            }
                          />
                        </button>
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-gray-500 hover:text-[#00395F]"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {category?.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <CategoryModal
          setIsModalOpen={setIsModalOpen}
          refreshFun={fetchCategories}
          modalType={modalType}
          categoryDetails={selectedCategory}
        />
      )}

      <DeleteAlertModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        dltType="category"
        dltName={categoryToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        dltLoading={deleteLoading}
      />
    </div>
  );
};

export default AdminCategories;
