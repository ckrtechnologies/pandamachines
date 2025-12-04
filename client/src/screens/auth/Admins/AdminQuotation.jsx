import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";
import exportToExcel from "../../../utils/exportToExcel";

const AdminQuotation = () => {
  const [allQuotations, setAllQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const quotationsPerPage = 10;
  const Navigate = useNavigate();

  // Extract unique categories from all products in all quotations
  const categories = [
    ...new Set(
      allQuotations
        .flatMap((quotation) => quotation.products || [])
        .map((product) => product.category?.name)
        .filter(Boolean)
    ),
  ];

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/quotation/get-all-quotation`
        );

        const data = await response.json();

        if (data.success) {
          setAllQuotations(data?.data?.reverse());
          setFilteredQuotations(data.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching quotations:", error);
        toast.error("Failed to fetch quotations");
        setIsLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  useEffect(() => {
    let results = allQuotations;

    if (searchQuery) {
      results = results.filter(
        (quotation) =>
          quotation.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          quotation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quotation.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      results = results.filter((quotation) =>
        quotation.products?.some(
          (product) => product.category?.name === selectedCategory
        )
      );
    }

    setFilteredQuotations(results);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, allQuotations]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  // Create a flattened array of quotations with their products
  const flattenedQuotations = filteredQuotations.flatMap(
    (quotation) =>
      quotation.products?.map((product, index) => ({
        ...quotation,
        product,
        productIndex: index,
      })) || []
  );

  const totalPages = Math.ceil(flattenedQuotations.length / quotationsPerPage);
  const indexOfLastQuotation = currentPage * quotationsPerPage;
  const indexOfFirstQuotation = indexOfLastQuotation - quotationsPerPage;
  const currentQuotations = flattenedQuotations.slice(
    indexOfFirstQuotation,
    indexOfLastQuotation
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-IN", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const openModal = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      const quotations =
        filteredQuotations.length > 0 ? filteredQuotations : allQuotations;

      if (quotations?.length > 0) {
        const tableData = quotations.flatMap(
          (quota) =>
            quota.products?.map((product) => ({
              "Full Name": quota.fullName || "N/A",
              Email: quota.email || "N/A",
              Phone: quota.mobNumber || "N/A",
              Subject: quota.subject || "N/A",
              City: quota.city || "N/A",
              State: quota.state || "N/A",
              Category: product?.category?.name || "N/A",
              "Sub-Category": product?.subCategory?.name || "N/A",
              "Sub-Sub-Category": product?.subSubCategory?.name || "N/A",
              Product: product?.product?.name || "N/A",
              Quantity: product?.quantity || "N/A",
              "Request Date": formatDate(quota.createdAt),
            })) || []
        );

        const fileName = `Quotations_${new Date()
          .toLocaleDateString("en-IN")
          .replace(/\//g, "-")}`;
        exportToExcel(tableData, fileName);
        toast.success("Quotations exported successfully");
      } else {
        toast.error("No quotations data to export");
      }
    } catch (error) {
      console.error("Error during export:", error);
      toast.error("Failed to export quotations");
    } finally {
      setIsExporting(false);
    }
  };

  // Skeleton loader
  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Quotations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your all quotation requests
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Quotations..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <button
            onClick={handleExportClick}
            disabled={isExporting}
            className="flex items-center gap-2 border border-green-300 rounded-lg px-3 py-2.5 w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-medium text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiDownload size={16} />
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 md:mt-0">
          <button
            onClick={clearAllFilters}
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition duration-150 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <X className="mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedCategory) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchQuery && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Search: {searchQuery}
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("")}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Quotation Table */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Sl</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Cat</th>
                <th className="px-4 py-3 text-left">Sub-Cat</th>
                <th className="px-4 py-3 text-left">Sub-Sub-Cat</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[...Array(quotationsPerPage)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : flattenedQuotations.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table
              className="bg-white shadow-md rounded-lg overflow-hidden"
              style={{ minWidth: "1400px" }}
            >
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left" style={{ width: "60px" }}>
                    Sl
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "150px" }}
                  >
                    Name
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "200px" }}
                  >
                    Email
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "120px" }}
                  >
                    Mobile
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "120px" }}
                  >
                    City
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "120px" }}
                  >
                    State
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "250px" }}
                  >
                    Subject
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "140px" }}
                  >
                    Category
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "140px" }}
                  >
                    Sub-Category
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "160px" }}
                  >
                    Sub-Sub-Category
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "140px" }}
                  >
                    Product
                  </th>
                  <th
                    className="px-4 py-3 text-left"
                    style={{ width: "100px" }}
                  >
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentQuotations.map((item, index) => (
                  <tr
                    key={`${item._id}-${item.productIndex}`}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      Navigate(`/admin-quotation-details/${item._id}`);
                    }}
                  >
                    <td className="px-4 py-3" style={{ width: "60px" }}>
                      {indexOfFirstQuotation + index + 1}
                    </td>
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ width: "150px" }}
                    >
                      <div className="truncate" title={item.fullName}>
                        {item.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "200px" }}>
                      <div className="truncate" title={item.email}>
                        {item.email}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "120px" }}>
                      {item.mobNumber}
                    </td>
                    <td className="px-4 py-3" style={{ width: "120px" }}>
                      {item.city}
                    </td>
                    <td className="px-4 py-3" style={{ width: "120px" }}>
                      {item.state}
                    </td>
                    <td className="px-4 py-3" style={{ width: "250px" }}>
                      <div className="truncate" title={item.subject}>
                        {item.subject}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "140px" }}>
                      <div
                        className="truncate"
                        title={item.product?.category?.name || "N/A"}
                      >
                        {item.product?.category?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "140px" }}>
                      <div
                        className="truncate"
                        title={item.product?.subCategory?.name || "N/A"}
                      >
                        {item.product?.subCategory?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "160px" }}>
                      <div
                        className="truncate"
                        title={item.product?.subSubCategory?.name || "N/A"}
                      >
                        {item.product?.subSubCategory?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "140px" }}>
                      <div
                        className="truncate"
                        title={item.product?.product?.name || "N/A"}
                      >
                        {item.product?.product?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ width: "100px" }}>
                      {item.product?.quantity || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l-md border ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 border-gray-300"
                      : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-1 border-t border-b ${
                        currentPage === number
                          ? "bg-blue-100 text-[#00395F] border-[#00395F]"
                          : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r-md border ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 border-gray-300"
                      : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-4">No quotations found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminQuotation;
// import React, { useState, useEffect } from "react";
// import { Search, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import exportToExcel from "../../../utils/exportToExcel";

// const AdminQuotation = () => {
//   const [allQuotations, setAllQuotations] = useState([]);
//   const [filteredQuotations, setFilteredQuotations] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedQuotation, setSelectedQuotation] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const quotationsPerPage = 10;
//   const Navigate = useNavigate();

//   const categories = [
//     ...new Set(
//       allQuotations.map((quotation) => quotation.category?.name).filter(Boolean)
//     ),
//   ];

//   useEffect(() => {
//     const fetchQuotations = async () => {
//       try {
//         setIsLoading(true);

//         const response = await fetch(
//           `${process.env.REACT_APP_API_URL}/quotation/get-all-quotation`
//         );

//         const data = await response.json();

//         if (data.success) {
//           setAllQuotations(data?.data?.reverse());
//           setFilteredQuotations(data.data);
//         }
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching quotations:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchQuotations();
//   }, []);

//   useEffect(() => {
//     let results = allQuotations;

//     if (searchQuery) {
//       results = results.filter(
//         (quotation) =>
//           quotation.fullName
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           quotation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           quotation.subject.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (selectedCategory) {
//       results = results.filter(
//         (quotation) =>
//           quotation.category && quotation.category.name === selectedCategory
//       );
//     }

//     setFilteredQuotations(results);
//     setCurrentPage(1);
//   }, [searchQuery, selectedCategory, allQuotations]);

//   const clearAllFilters = () => {
//     setSearchQuery("");
//     setSelectedCategory("");
//     setCurrentPage(1);
//   };

//   const totalPages = Math.ceil(filteredQuotations.length / quotationsPerPage);
//   const indexOfLastQuotation = currentPage * quotationsPerPage;
//   const indexOfFirstQuotation = indexOfLastQuotation - quotationsPerPage;
//   const currentQuotations = filteredQuotations.slice(
//     indexOfFirstQuotation,
//     indexOfLastQuotation
//   );

//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const openModal = (quotation) => {
//     setSelectedQuotation(quotation);
//     setShowModal(true);
//   };

//   // Skeleton loader matching AdminProducts style
//   const SkeletonRow = () => (
//     <tr className="border-b">
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-8"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-32"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-40"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-24"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-48"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-24"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-32"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-32"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-24"></div>
//       </td>
//       <td className="px-4 py-3">
//         <div className="h-4 bg-gray-200 rounded w-20"></div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="p-4 md:p-6">
//       {/* Header - matching AdminProducts style */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
//         <div>
//           <h1 className="text-xl md:text-2xl font-bold text-gray-800">
//             All Quotations
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage your all quotation requests
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//           <div className="relative flex-grow max-w-md">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search Quotations..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             {searchQuery && (
//               <button
//                 onClick={() => setSearchQuery("")}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               >
//                 <X className="text-gray-400 hover:text-gray-600" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Category
//             </label>
//             <select
//               value={selectedCategory}
//               onChange={(e) => {
//                 setSelectedCategory(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="border border-gray-300 rounded px-3 py-2 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">All Categories</option>
//               {categories.map((cat, index) => (
//                 <option key={index} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="mt-6 md:mt-0">
//           <button
//             onClick={clearAllFilters}
//             className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition duration-150 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap"
//           >
//             <X className="mr-2" />
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Active Filters */}
//       {(searchQuery || selectedCategory) && (
//         <div className="flex flex-wrap gap-2 mb-4">
//           {searchQuery && (
//             <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
//               Search: {searchQuery}
//               <button
//                 onClick={() => setSearchQuery("")}
//                 className="ml-2 text-blue-600 hover:text-blue-800"
//               >
//                 <X size={14} />
//               </button>
//             </span>
//           )}
//           {selectedCategory && (
//             <span className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
//               Category: {selectedCategory}
//               <button
//                 onClick={() => setSelectedCategory("")}
//                 className="ml-2 text-green-600 hover:text-green-800"
//               >
//                 <X size={14} />
//               </button>
//             </span>
//           )}
//         </div>
//       )}

//       {/* Quotation Table - matching AdminProducts style */}
//       {isLoading ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//               <tr>
//                 <th className="px-4 py-3 text-left">Sl</th>
//                 <th className="px-4 py-3 text-left">Name</th>
//                 <th className="px-4 py-3 text-left">Email</th>
//                 <th className="px-4 py-3 text-left">Mobile</th>
//                 <th className="px-4 py-3 text-left">Subject</th>
//                 <th className="px-4 py-3 text-left">Cat</th>
//                 <th className="px-4 py-3 text-left">Sub-Cat</th>
//                 <th className="px-4 py-3 text-left">Sub-Sub-Cat</th>
//                 <th className="px-4 py-3 text-left">Product</th>
//                 <th className="px-4 py-3 text-left">Date</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {[...Array(quotationsPerPage)].map((_, index) => (
//                 <SkeletonRow key={index} />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : filteredQuotations.length > 0 ? (
//         <>
//           <div className="overflow-x-auto">
//             <table
//               className="bg-white shadow-md rounded-lg overflow-hidden"
//               style={{ minWidth: "1400px" }}
//             >
//               <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//                 <tr>
//                   <th className="px-4 py-3 text-left" style={{ width: "60px" }}>
//                     Sl
//                   </th>
//                   <th
//                     className="px-4 py-3 text-left"
//                     style={{ width: "150px" }}
//                   >
//                     Name
//                   </th>
//                   <th
//                     className="px-4 py-3 text-left"
//                     style={{ width: "200px" }}
//                   >
//                     Email
//                   </th>
//                   <th
//                     className="px-4 py-3 text-left"
//                     style={{ width: "120px" }}
//                   >
//                     Mobile
//                   </th>
//                   <th
//                     className="px-4 py-3 text-left"
//                     style={{ width: "250px" }}
//                   >
//                     Subject
//                   </th>
//                   <th
//                     className="px-4 py-3 text-left"
//                     style={{ width: "140px" }}
//                   >
//                     Cat
//                   </th>
//                   <th
//                     className="px-4 py-3 text-left"
//                     style={{ width: "140px" }}
//                   >
//                     Sub-Cat
//                   </th>
//                   <th
//                     className="px-4 py-3 text-left"
//                     style={{ width: "160px" }}
//                   >
//                     Sub-Sub-Cat
//                   </th>
//                   <th
//                     className="px-4 py-3 text-left"
//                     style={{ width: "140px" }}
//                   >
//                     Product
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="text-gray-700">
//                 {currentQuotations.map((quotation, index) => (
//                   <tr
//                     key={quotation._id}
//                     className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
//                     onClick={() => {
//                       Navigate(`/admin-quotation-details/${quotation._id}`);
//                     }}
//                   >
//                     <td className="px-4 py-3" style={{ width: "60px" }}>
//                       {indexOfFirstQuotation + index + 1}
//                     </td>
//                     <td
//                       className="px-4 py-3 font-medium"
//                       style={{ width: "150px" }}
//                     >
//                       <div className="truncate" title={quotation.fullName}>
//                         {quotation.fullName}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3" style={{ width: "200px" }}>
//                       <div className="truncate" title={quotation.email}>
//                         {quotation.email}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3" style={{ width: "120px" }}>
//                       {quotation.mobNumber}
//                     </td>
//                     <td className="px-4 py-3" style={{ width: "250px" }}>
//                       <div className="truncate" title={quotation.subject}>
//                         {quotation.subject}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3" style={{ width: "140px" }}>
//                       <div
//                         className="truncate"
//                         title={quotation?.category?.name || "N/A"}
//                       >
//                         {quotation?.category?.name || "N/A"}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3" style={{ width: "140px" }}>
//                       <div
//                         className="truncate"
//                         title={quotation?.subCategory?.name || "N/A"}
//                       >
//                         {quotation?.subCategory?.name || "N/A"}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3" style={{ width: "160px" }}>
//                       <div
//                         className="truncate"
//                         title={quotation?.subSubCategory?.name || "N/A"}
//                       >
//                         {quotation?.subSubCategory?.name || "N/A"}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3" style={{ width: "140px" }}>
//                       <div
//                         className="truncate"
//                         title={quotation?.product?.name || "N/A"}
//                       >
//                         {quotation?.product?.name || "N/A"}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {totalPages > 1 && (
//             <div className="flex justify-center mt-8">
//               <nav className="inline-flex rounded-md shadow-sm -space-x-px">
//                 <button
//                   onClick={() => paginate(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded-l-md border ${
//                     currentPage === 1
//                       ? "bg-gray-100 text-gray-400 border-gray-300"
//                       : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
//                   }`}
//                 >
//                   <ChevronLeft size={18} />
//                 </button>

//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (number) => (
//                     <button
//                       key={number}
//                       onClick={() => paginate(number)}
//                       className={`px-4 py-1 border-t border-b ${
//                         currentPage === number
//                           ? "bg-blue-100 text-[#00395F] border-[#00395F]"
//                           : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
//                       }`}
//                     >
//                       {number}
//                     </button>
//                   )
//                 )}

//                 <button
//                   onClick={() =>
//                     paginate(Math.min(totalPages, currentPage + 1))
//                   }
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded-r-md border ${
//                     currentPage === totalPages
//                       ? "bg-gray-100 text-gray-400 border-gray-300"
//                       : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
//                   }`}
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </nav>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-center py-8">
//           <p className="text-gray-500 text-lg mb-4">No quotations found .</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminQuotation;
