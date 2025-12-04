// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//   FiEdit2,
//   FiTrash2,
//   FiPlus,
//   FiChevronLeft,
//   FiChevronRight,
//   FiSearch,
// } from "react-icons/fi";
// import { FaChevronLeft, FaChevronRight, FaRegEye } from "react-icons/fa";
// import "./AdminSubCategories.css";
// import AddSubCategoryModal from "../../../components/AdminSideComponents/Sub-category/AddSubCategoryModal";
// import EditSubCatModal from "../../../components/AdminSideComponents/Sub-category/EditSubCatModal";
// import DeleteAlertModal from "../../../components/AdminSideComponents/Common/DeleteAlertModal";
// import { useNavigate } from "react-router-dom";

// const AdminSubCategories = () => {
//   const [allSubCategories, setAllSubCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeCategory, setActiveCategory] = useState("All Categories");
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedSubCategory, setSelectedSubCategory] = useState(null);

//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const navigate = useNavigate();

//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const itemsPerPage = 6;

//   const fetchSubCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/sub-categories/get-all-sub-categories`
//       );
//       setAllSubCategories(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubCategories();
//   }, []);

//   const refreshSubCategories = () => {
//     fetchSubCategories();
//   };

//   const handleAddSubCategory = () => {
//     setIsAddModalOpen(true);
//   };

//   const handleEditSubCategory = (subCategory) => {
//     setSelectedSubCategory(subCategory);
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedSubCategory(null);
//   };

//   const handleDeleteSubCategory = (subCategory) => {
//     setSubCategoryToDelete(subCategory);
//     setIsDeleteModalOpen(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setSubCategoryToDelete(null);
//   };

//   const handleConfirmDelete = async () => {
//     if (!subCategoryToDelete) return;

//     try {
//       setDeleteLoading(true);
//       await axios.delete(
//         `${process.env.REACT_APP_API_URL}/sub-categories/delete-sub-category/${subCategoryToDelete._id}`
//       );

//       refreshSubCategories();

//       handleCloseDeleteModal();
//     } catch (err) {
//       console.error("Error deleting sub-category:", err);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const uniqueCategories = [
//     "All Categories",
//     ...Array.from(
//       new Set(
//         allSubCategories.map((subCat) =>
//           subCat.category ? subCat.category.name : "Uncategorized"
//         )
//       )
//     ),
//   ];

//   const filteredSubCategories = allSubCategories.filter((subCat) => {
//     const matchesSearch =
//       subCat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (subCat.category &&
//         subCat.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

//     const matchesCategory =
//       activeCategory === "All Categories" ||
//       (subCat.category && subCat.category.name === activeCategory) ||
//       (activeCategory === "Uncategorized" && !subCat.category);

//     return matchesSearch && matchesCategory;
//   });

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentSubCategories = filteredSubCategories.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );
//   const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const scrollContainerRef = useRef(null);

//   const scroll = (direction) => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = 150;
//       scrollContainerRef.current.scrollBy({
//         left: direction === "left" ? -scrollAmount : scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   // Skeleton Loader Component
//   const SkeletonLoader = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//       {[...Array(itemsPerPage)].map((_, index) => (
//         <div
//           key={index}
//           className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md animate-pulse"
//         >
//           <div className="relative h-40 bg-gray-200"></div>
//           <div className="p-4">
//             <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
//             <div className="h-4 bg-gray-200 rounded w-full"></div>
//             <div className="h-4 bg-gray-200 rounded w-5/6 mt-1"></div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   if (error) {
//     return (
//       <div className="p-4 md:p-6">
//         <div className="bg-red-50 border-l-4 border-red-500 p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg
//                 className="h-5 w-5 text-red-500"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">
//                 Error loading sub-categories: {error}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
//         <div>
//           <h1 className="text-xl md:text-2xl font-bold text-gray-800">
//             Sub-Categories
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage your product sub-categories
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//           <div className="relative flex-grow max-w-md">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search sub-categories..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//             />
//           </div>
//           <button
//             onClick={handleAddSubCategory}
//             className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
//           >
//             <FiPlus className="mr-2" />
//             Add Sub-Category
//           </button>
//         </div>
//       </div>

//       <div className="relative flex items-center mb-4">
//         {/* Left Arrow */}
//         <button
//           onClick={() => scroll("left")}
//           className="absolute left-0 z-10 p-2 bg-[#FF8617] hover:bg-[#CC5F0F] shadow-md rounded-full transition duration-200"
//         >
//           <FaChevronLeft className="w-4 h-4" />
//         </button>

//         <div
//           ref={scrollContainerRef}
//           className="flex gap-3 overflow-x-auto hide-scrollbar py-2 px-8"
//         >
//           {loading ? (
//             <>
//               {[...Array(10)].map((_, index) => (
//                 <button
//                   key={index}
//                   className="px-4 min-w-32 bg-gradient-to-r from-gray-200 via-gray-50 to-gray-200 animate-pulse border-gray-300 py-2 shadow-md whitespace-nowrap rounded-full border text-sm font-medium transition-all"
//                 >
//                   &nbsp;
//                 </button>
//               ))}
//             </>
//           ) : (
//             uniqueCategories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => {
//                   setActiveCategory(category);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-4 py-2 shadow-md whitespace-nowrap rounded-full border text-sm font-medium transition-all ${activeCategory === category
//                     ? "bg-[#00395F] text-white border-[#00395F]"
//                     : "bg-white text-gray-600 border-gray-300 hover:bg-gray-200"
//                   }`}
//               >
//                 {category}
//               </button>
//             ))
//           )}
//         </div>

//         <button
//           onClick={() => scroll("right")}
//           className="absolute right-0 z-10 p-2 bg-[#FF8617] hover:bg-[#CC5F0F] shadow-md rounded-full transition duration-200"
//         >
//           <FaChevronRight className="w-4 h-4" />
//         </button>
//       </div>

//       {/* Content Area */}
//       {loading ? (
//         <SkeletonLoader />
//       ) : currentSubCategories.length > 0 ? (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {currentSubCategories.map((subCat) => (
//               <div
//                 key={subCat._id}
//                 className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md transition-all"
//               >
//                 <div className="relative h-40 overflow-hidden">
//                   <img
//                     src={subCat.imgUrl}
//                     alt={subCat.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src =
//                         "https://via.placeholder.com/400x200?text=No+Image";
//                     }}
//                   />
//                   <div className="absolute top-0 left-0 bg-gradient-to-r from-[#00395F] to-[#FF8617] tracking-wide text-white text-xs font-medium px-2 py-1 rounded-br">
//                     {subCat.category ? subCat.category.name : "Uncategorized"}
//                   </div>
//                   <div className="absolute top-0 right-0 flex space-x-1 p-2">
//                     <button
//                       className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
//                       onClick={() => {
//                         navigate(`/admin-subcategory-details/${subCat._id}`);
//                       }}
//                     >
//                       <FaRegEye className="text-[#FF8617]" size={16} />
//                     </button>
//                     <button
//                       onClick={() => handleEditSubCategory(subCat)}
//                       className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
//                     >
//                       <FiEdit2 className="text-blue-600" size={16} />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteSubCategory(subCat)}
//                       className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
//                     >
//                       <FiTrash2 className="text-red-600" size={16} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-1">
//                     {subCat.name}
//                   </h3>
//                   <p className="text-sm text-gray-600 line-clamp-2">
//                     {subCat.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-8">
//               <nav className="inline-flex rounded-md shadow-sm -space-x-px">

//                 {/* Prev Page */}
//                 <button
//                   onClick={() => paginate(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded-l-md border ${currentPage === 1
//                       ? "bg-gray-100 text-gray-400 border-gray-300"
//                       : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
//                     }`}
//                 >
//                   <FiChevronLeft size={18} />
//                 </button>

//                 {/* Dynamic Page Window (5 pages at a time) */}
//                 {(() => {
//                   const maxButtons = 5;
//                   const pageGroup = Math.ceil(currentPage / maxButtons);

//                   const startPage = (pageGroup - 1) * maxButtons + 1;
//                   const endPage = Math.min(startPage + maxButtons - 1, totalPages);

//                   return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
//                     const pageNumber = startPage + i;
//                     return (
//                       <button
//                         key={pageNumber}
//                         onClick={() => paginate(pageNumber)}
//                         className={`px-4 py-1 border-t border-b ${currentPage === pageNumber
//                             ? "bg-blue-100 text-[#00395F] border-[#00395F]"
//                             : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
//                           }`}
//                       >
//                         {pageNumber}
//                       </button>
//                     );
//                   });
//                 })()}

//                 {/* Next Page */}
//                 <button
//                   onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded-r-md border ${currentPage === totalPages
//                       ? "bg-gray-100 text-gray-400 border-gray-300"
//                       : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
//                     }`}
//                 >
//                   <FiChevronRight size={18} />
//                 </button>
//               </nav>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="bg-gray-50 rounded-xl p-12 text-center">
//           <div className="mx-auto max-w-md">
//             <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-lg font-medium text-gray-900">
//               No sub-categories found
//             </h3>
//             <p className="mt-1 text-sm text-gray-500">
//               {searchTerm
//                 ? "Try another search term"
//                 : "Create your first sub-category to get started"}
//             </p>
//             <div className="mt-6">
//               <button
//                 onClick={handleAddSubCategory}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#FF8617] hover:bg-[#CC5F0F] shadow-md"
//               >
//                 <FiPlus className="-ml-1 mr-2 h-5 w-5" />
//                 Add Sub-Category
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <AddSubCategoryModal
//         isOpen={isAddModalOpen}
//         setIsAddModalOpen={setIsAddModalOpen}
//         subCatsByCat={refreshSubCategories}
//       />

//       {selectedSubCategory && isEditModalOpen && (
//         <EditSubCatModal
//           catId={
//             selectedSubCategory.category?._id || selectedSubCategory.categoryId
//           }
//           catName={selectedSubCategory.category?.name || "Uncategorized"}
//           setIsModalOpen={handleCloseEditModal}
//           refreshFun={refreshSubCategories}
//           subCatId={selectedSubCategory._id}
//         />
//       )}

//       <DeleteAlertModal
//         isOpen={isDeleteModalOpen}
//         onClose={handleCloseDeleteModal}
//         dltType="sub-category"
//         dltName={subCategoryToDelete?.name || ""}
//         onConfirm={handleConfirmDelete}
//         dltLoading={deleteLoading}
//       />
//     </div>
//   );
// };

// export default AdminSubCategories;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight, FaRegEye } from "react-icons/fa";
import "./AdminSubCategories.css";
import AddSubCategoryModal from "../../../components/AdminSideComponents/Sub-category/AddSubCategoryModal";
import EditSubCatModal from "../../../components/AdminSideComponents/Sub-category/EditSubCatModal";
import DeleteAlertModal from "../../../components/AdminSideComponents/Common/DeleteAlertModal";
import { useNavigate } from "react-router-dom";

const AdminSubCategories = () => {
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sub-categories/get-all-sub-categories`
      );
      setAllSubCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const refreshSubCategories = () => {
    fetchSubCategories();
  };

  const handleAddSubCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleEditSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSubCategory(null);
  };

  const handleDeleteSubCategory = (subCategory) => {
    setSubCategoryToDelete(subCategory);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSubCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!subCategoryToDelete) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/sub-categories/delete-sub-category/${subCategoryToDelete._id}`
      );

      refreshSubCategories();

      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting sub-category:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const uniqueCategories = [
    "All Categories",
    ...Array.from(
      new Set(
        allSubCategories.map((subCat) =>
          subCat.category ? subCat.category.name : "Uncategorized"
        )
      )
    ),
  ];

  const filteredSubCategories = allSubCategories.filter((subCat) => {
    const matchesSearch =
      subCat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subCat.category &&
        subCat.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      activeCategory === "All Categories" ||
      (subCat.category && subCat.category.name === activeCategory) ||
      (activeCategory === "Uncategorized" && !subCat.category);

    return matchesSearch && matchesCategory;
  });

  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 150;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md animate-pulse"
        >
          <div className="relative h-40 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mt-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading sub-categories: {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Sub-Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product sub-categories
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sub-categories..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddSubCategory}
            className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <FiPlus className="mr-2" />
            Add Sub-Category
          </button>
        </div>
      </div>

      <div className="relative flex items-center mb-4">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 p-2 bg-[#FF8617] hover:bg-[#CC5F0F] shadow-md rounded-full transition duration-200"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar py-2 px-8"
        >
          {loading ? (
            <>
              {[...Array(10)].map((_, index) => (
                <button
                  key={index}
                  className="px-4 min-w-32 bg-gradient-to-r from-gray-200 via-gray-50 to-gray-200 animate-pulse border-gray-300 py-2 shadow-md whitespace-nowrap rounded-full border text-sm font-medium transition-all"
                >
                  &nbsp;
                </button>
              ))}
            </>
          ) : (
            uniqueCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 shadow-md whitespace-nowrap rounded-full border text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-[#00395F] text-white border-[#00395F]"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))
          )}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 p-2 bg-[#FF8617] hover:bg-[#CC5F0F] shadow-md rounded-full transition duration-200"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <SkeletonLoader />
      ) : filteredSubCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubCategories.map((subCat) => (
            <div
              key={subCat._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md transition-all"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={subCat.imgUrl}
                  alt={subCat.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
                <div className="absolute top-0 left-0 bg-gradient-to-r from-[#00395F] to-[#FF8617] tracking-wide text-white text-xs font-medium px-2 py-1 rounded-br">
                  {subCat.category ? subCat.category.name : "Uncategorized"}
                </div>
                <div className="absolute top-0 right-0 flex space-x-1 p-2">
                  <button
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
                    onClick={() => {
                      navigate(`/admin-subcategory-details/${subCat._id}`);
                    }}
                  >
                    <FaRegEye className="text-[#FF8617]" size={16} />
                  </button>
                  <button
                    onClick={() => handleEditSubCategory(subCat)}
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
                  >
                    <FiEdit2 className="text-blue-600" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSubCategory(subCat)}
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
                  >
                    <FiTrash2 className="text-red-600" size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {subCat.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {subCat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <div className="mx-auto max-w-md">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No sub-categories found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try another search term"
                : "Create your first sub-category to get started"}
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddSubCategory}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#FF8617] hover:bg-[#CC5F0F] shadow-md"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Add Sub-Category
              </button>
            </div>
          </div>
        </div>
      )}

      <AddSubCategoryModal
        isOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        subCatsByCat={refreshSubCategories}
      />

      {selectedSubCategory && isEditModalOpen && (
        <EditSubCatModal
          catId={
            selectedSubCategory.category?._id || selectedSubCategory.categoryId
          }
          catName={selectedSubCategory.category?.name || "Uncategorized"}
          setIsModalOpen={handleCloseEditModal}
          refreshFun={refreshSubCategories}
          subCatId={selectedSubCategory._id}
        />
      )}

      <DeleteAlertModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        dltType="sub-category"
        dltName={subCategoryToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        dltLoading={deleteLoading}
      />
    </div>
  );
};

export default AdminSubCategories;
