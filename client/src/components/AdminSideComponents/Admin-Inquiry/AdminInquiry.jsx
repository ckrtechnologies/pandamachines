// import React, { useState, useEffect } from "react";
// import { MessageCircle, X, Trash2, Clock, CheckCircle } from "lucide-react";
// import Swal from "sweetalert2";

// const AdminInquiry = () => {
//   const [inquiries, setInquiries] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [pendingCount, setPendingCount] = useState(0);
//   const supplierData = localStorage.getItem("pm-supplier-data");

//   const fetchInquiries = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/inquiry/get-all`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       // Sort to show pending first
//       const sortedData = data.sort((a, b) => {
//         if (a.status === "pending" && b.status !== "pending") return -1;
//         if (a.status !== "pending" && b.status === "pending") return 1;
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });

//       setInquiries(sortedData);
//       setPendingCount(
//         sortedData.filter((inquiry) => inquiry.status === "pending").length
//       );
//     } catch (error) {
//       console.error("Error fetching inquiries:", error);
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to fetch inquiries. Please check if the server is running.",
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateInquiryStatus = async (id, currentStatus) => {
//     const newStatus = currentStatus === "pending" ? "completed" : "pending";

//     const result = await Swal.fire({
//       title: "Change Status?",
//       text: `Do you really want to change the status from ${currentStatus} to ${newStatus}?`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Yes, change it!",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//     });

//     if (result.isConfirmed) {
//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_API_URL}/inquiry/update-status/${id}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ status: newStatus }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         setInquiries((prev) => {
//           const updated = prev
//             .map((inquiry) =>
//               inquiry._id === id ? { ...inquiry, status: newStatus } : inquiry
//             )
//             .sort((a, b) => {
//               if (a.status === "pending" && b.status !== "pending") return -1;
//               if (a.status !== "pending" && b.status === "pending") return 1;
//               return new Date(b.createdAt) - new Date(a.createdAt);
//             });

//           setPendingCount(
//             updated.filter((inquiry) => inquiry.status === "pending").length
//           );
//           return updated;
//         });

//         Swal.fire({
//           title: "Updated!",
//           text: "Status has been changed successfully.",
//           icon: "success",
//         });
//       } catch (error) {
//         console.error("Error updating status:", error);
//         Swal.fire({
//           title: "Error!",
//           text: "Failed to update status. Please try again.",
//           icon: "error",
//         });
//       }
//     }
//   };

//   const deleteInquiry = async (id, name) => {
//     const result = await Swal.fire({
//       title: "Delete Inquiry?",
//       text: `Are you sure you want to delete inquiry from ${name}? This action cannot be undone.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//     });

//     if (result.isConfirmed) {
//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_API_URL}/inquiry/delete-inquiry/${id}`,
//           {
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         setInquiries((prev) => {
//           const updated = prev.filter((inquiry) => inquiry._id !== id);
//           setPendingCount(
//             updated.filter((inquiry) => inquiry.status === "pending").length
//           );
//           return updated;
//         });

//         Swal.fire({
//           title: "Deleted!",
//           text: "Inquiry has been deleted successfully.",
//           icon: "success",
//         });
//       } catch (error) {
//         console.error("Error deleting inquiry:", error);
//         Swal.fire({
//           title: "Error!",
//           text: "Failed to delete inquiry. Please try again.",
//           icon: "error",
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     fetchInquiries();
//   }, []);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (supplierData) return null;

//   return (
//     <div className="p-4">
//       <div className="relative inline-block">
//         <button
//           onClick={setIsModalOpen}
//           className="relative bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg"
//         >
//           <MessageCircle size={20} />
//           Inquiries
//           {pendingCount > 0 && (
//             <span
//               className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md"
//               title="Pending Inquiries Count"
//             >
//               {pendingCount}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-[#e6eeff] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor text-white p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-bold">All Inquiries</h2>
//                 <p className="text-blue-100">
//                   Total: {inquiries.length} | Pending: {pendingCount}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-white hover:text-red-300 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
//               {loading ? (
//                 <div className="flex justify-center items-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                 </div>
//               ) : inquiries.length === 0 ? (
//                 <div className="text-center py-12 text-gray-500">
//                   <MessageCircle
//                     size={48}
//                     className="mx-auto mb-4 opacity-50"
//                   />
//                   <p className="text-lg">No inquiries found</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {inquiries.map((inquiry) => (
//                     <div
//                       key={inquiry._id}
//                       className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 group relative bg-[#f2f2f2]"
//                     >
//                       {/* Delete Button - Shows on Hover */}
//                       <button
//                         onClick={() => deleteInquiry(inquiry._id, inquiry.name)}
//                         className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-red-50"
//                       >
//                         <Trash2 size={18} />
//                       </button>

//                       {/* Customer Info */}
//                       <div className="mb-4 pr-8">
//                         <h3
//                           className="font-bold text-gray-800 text-md mb-2 truncate"
//                           title={inquiry.name}
//                         >
//                           {inquiry.name}
//                         </h3>
//                         <div className="space-y-1 text-sm text-gray-600">
//                           <p
//                             className="flex items-center gap-2 truncate"
//                             title={inquiry.email}
//                           >
//                             <span className="text-xs">✉️</span>
//                             {inquiry.email}
//                           </p>
//                           <p className="flex items-center gap-2">
//                             <span className="text-xs">📞</span>
//                             {inquiry.phone}
//                           </p>
//                         </div>
//                         {/* <p className="text-xs text-gray-400 mt-3">
//                           Created: {formatDate(inquiry.createdAt)}
//                         </p> */}
//                       </div>

//                       {/* Status Badge */}
//                       <div className="flex justify-center mb-4">
//                         <span
//                           className={`px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
//                             inquiry.status === "pending"
//                               ? "bg-orange-100 text-orange-800"
//                               : "bg-green-100 text-green-800"
//                           }`}
//                         >
//                           {inquiry.status === "pending" ? (
//                             <Clock size={14} />
//                           ) : (
//                             <CheckCircle size={14} />
//                           )}
//                           {inquiry.status.charAt(0).toUpperCase() +
//                             inquiry.status.slice(1)}
//                         </span>
//                       </div>

//                       {/* Action Button */}
//                       <div className="text-center">
//                         <button
//                           onClick={() =>
//                             updateInquiryStatus(inquiry._id, inquiry.status)
//                           }
//                           className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
//                             inquiry.status === "pending"
//                               ? "bg-green-600 hover:bg-green-700 text-white"
//                               : "bg-orange-600 hover:bg-orange-700 text-white"
//                           }`}
//                         >
//                           Mark as{" "}
//                           {inquiry.status === "pending"
//                             ? "Completed"
//                             : "Pending"}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="bg-[#e6eeff] px-6 py-4 flex justify-end border-t">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-6 py-2 bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor hover:from-primaryColor hover:to-primaryBtnHoverColor text-white rounded-lg transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminInquiry;

import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { Clock, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";

const AdminInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredByStatus, setFilteredByStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const inquiryPerPage = 10;

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/inquiry/get-all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Sort by newest first
      const sortedData = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      setInquiries(sortedData);
      setFilteredInquiries(sortedData);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch inquiries. Please check if the server is running.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateInquiryStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    const result = await Swal.fire({
      title: "Change Status?",
      text: `Do you really want to change the status from ${currentStatus} to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/inquiry/update-status/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setInquiries((prev) => {
          const updated = prev.map((inquiry) =>
            inquiry._id === id ? { ...inquiry, status: newStatus } : inquiry
          );
          applyFilters(updated);
          return updated;
        });

        Swal.fire({
          title: "Updated!",
          text: "Status has been changed successfully.",
          icon: "success",
        });
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update status. Please try again.",
          icon: "error",
        });
      }
    }
  };

  const deleteInquiry = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete Inquiry?",
      text: `Are you sure you want to delete inquiry from ${name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      setDeleteLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/inquiry/delete-inquiry/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setInquiries((prev) => {
          const updated = prev.filter((inquiry) => inquiry._id !== id);
          applyFilters(updated);
          return updated;
        });

        Swal.fire({
          title: "Deleted!",
          text: "Inquiry has been deleted successfully.",
          icon: "success",
        });
      } catch (error) {
        console.error("Error deleting inquiry:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete inquiry. Please try again.",
          icon: "error",
        });
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const applyFilters = (dataToFilter) => {
    let results = dataToFilter;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter((inq) => {
        return (
          inq?.name?.toLowerCase().includes(lowerQuery) ||
          inq?.email?.toLowerCase().includes(lowerQuery) ||
          inq?.phone?.toLowerCase().includes(lowerQuery) ||
          inq?.product?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    if (filteredByStatus) {
      results = results.filter((inq) => inq.status === filteredByStatus);
    }

    setFilteredInquiries(results);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters(inquiries);
  }, [searchQuery, filteredByStatus, inquiries]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilteredByStatus("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredInquiries.length / inquiryPerPage);
  const indexOfLastInquiry = currentPage * inquiryPerPage;
  const indexOfFirstInquiry = indexOfLastInquiry - inquiryPerPage;
  const currentInquiries = filteredInquiries.slice(
    indexOfFirstInquiry,
    indexOfLastInquiry
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingCount = inquiries.filter(
    (inq) => inq.status === "pending"
  ).length;
  const completedCount = inquiries.filter(
    (inq) => inq.status === "completed"
  ).length;

  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Inquiries
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track customer inquiries
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              {inquiries.length}
            </p>
            <p className="text-gray-500">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
            <p className="text-gray-500">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {completedCount}
            </p>
            <p className="text-gray-500">Completed</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, phone, or product..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <select
          value={filteredByStatus}
          onChange={(e) => setFilteredByStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={clearAllFilters}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Active Filters */}
      {(searchQuery || filteredByStatus) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {searchQuery && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Search: {searchQuery}
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {filteredByStatus && (
            <span
              className={`inline-flex items-center text-sm px-3 py-1 rounded-full ${
                filteredByStatus === "pending"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              Status:{" "}
              {filteredByStatus.charAt(0).toUpperCase() +
                filteredByStatus.slice(1)}
              <button
                onClick={() => setFilteredByStatus("")}
                className={`ml-2 ${
                  filteredByStatus === "pending"
                    ? "text-orange-600 hover:text-orange-800"
                    : "text-green-600 hover:text-green-800"
                }`}
              >
                <FiX size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase border-b">
              <tr>
                <th className="px-4 py-3 text-left">Sl</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                {/* <th className="px-4 py-3 text-left">Product</th> */}
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[...Array(inquiryPerPage)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredInquiries.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Sl</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  {/* <th className="px-4 py-3 text-left">Product</th> */}
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentInquiries.map((inquiry, index) => (
                  <tr
                    key={inquiry._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {indexOfFirstInquiry + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">{inquiry.name}</td>
                    <td className="px-4 py-3 text-sm">{inquiry.email}</td>
                    <td className="px-4 py-3">{inquiry.phone}</td>
                    {/* <td className="px-4 py-3 text-sm">{inquiry.product}</td> */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          inquiry.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {inquiry.status === "pending" ? (
                          <Clock size={14} />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        {inquiry.status.charAt(0).toUpperCase() +
                          inquiry.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            updateInquiryStatus(inquiry._id, inquiry.status)
                          }
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            inquiry.status === "pending"
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-orange-600 hover:bg-orange-700 text-white"
                          }`}
                        >
                          {inquiry.status === "pending" ? "Complete" : "Reopen"}
                        </button>
                        <button
                          onClick={() =>
                            deleteInquiry(inquiry._id, inquiry.name)
                          }
                          disabled={deleteLoading}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete inquiry"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
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
                  <FiChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-1 border-t border-b ${
                        currentPage === number
                          ? "bg-blue-100 text-blue-600 border-blue-500"
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
                  <FiChevronRight size={18} />
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            No inquiries found for the selected filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminInquiry;
