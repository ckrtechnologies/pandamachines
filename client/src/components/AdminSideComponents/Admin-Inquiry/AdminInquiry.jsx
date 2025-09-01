import React, { useState, useEffect } from "react";
import { MessageCircle, X, Trash2, Clock, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";

const AdminInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchInquiries = async () => {
    setLoading(true);
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

      // Sort to show pending first
      const sortedData = data.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setInquiries(sortedData);
      setPendingCount(
        sortedData.filter((inquiry) => inquiry.status === "pending").length
      );
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch inquiries. Please check if the server is running.",
        icon: "error",
      });
    } finally {
      setLoading(false);
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
          const updated = prev
            .map((inquiry) =>
              inquiry._id === id ? { ...inquiry, status: newStatus } : inquiry
            )
            .sort((a, b) => {
              if (a.status === "pending" && b.status !== "pending") return -1;
              if (a.status !== "pending" && b.status === "pending") return 1;
              return new Date(b.createdAt) - new Date(a.createdAt);
            });

          setPendingCount(
            updated.filter((inquiry) => inquiry.status === "pending").length
          );
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

        // Update local state
        setInquiries((prev) => {
          const updated = prev.filter((inquiry) => inquiry._id !== id);
          setPendingCount(
            updated.filter((inquiry) => inquiry.status === "pending").length
          );
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
      }
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4">
      {/* All Inquiry Button */}
      <div className="relative inline-block">
        <button
          onClick={setIsModalOpen}
          className="relative bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg"
        >
          <MessageCircle size={20} />
          Inquiries
          {pendingCount > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md"
              title="Pending Inquiries Count"
            >
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">All Inquiries</h2>
                <p className="text-blue-100">
                  Total: {inquiries.length} | Pending: {pendingCount}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-red-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <p className="text-lg">No inquiries found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry._id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 group relative bg-white"
                    >
                      {/* Delete Button - Shows on Hover */}
                      <button
                        onClick={() => deleteInquiry(inquiry._id, inquiry.name)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>

                      {/* Customer Info */}
                      <div className="mb-4 pr-8">
                        <h3
                          className="font-bold text-gray-800 text-md mb-2 truncate"
                          title={inquiry.name}
                        >
                          {inquiry.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p
                            className="flex items-center gap-2 truncate"
                            title={inquiry.email}
                          >
                            <span className="text-xs">✉️</span>
                            {inquiry.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-xs">📞</span>
                            {inquiry.phone}
                          </p>
                        </div>
                        {/* <p className="text-xs text-gray-400 mt-3">
                          Created: {formatDate(inquiry.createdAt)}
                        </p> */}
                      </div>

                      {/* Status Badge */}
                      <div className="flex justify-center mb-4">
                        <span
                          className={`px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
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
                      </div>

                      {/* Action Button */}
                      <div className="text-center">
                        <button
                          onClick={() =>
                            updateInquiryStatus(inquiry._id, inquiry.status)
                          }
                          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            inquiry.status === "pending"
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-orange-600 hover:bg-orange-700 text-white"
                          }`}
                        >
                          Mark as{" "}
                          {inquiry.status === "pending"
                            ? "Completed"
                            : "Pending"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiry;
