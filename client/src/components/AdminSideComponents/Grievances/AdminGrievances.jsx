import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { Clock, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const AdminGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;

  useEffect(() => {
    fetchGrievances(currentPage);
  }, [currentPage, search, statusFilter]);

  const fetchGrievances = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/grievance`,
        {
          params: {
            page,
            limit: perPage,
            search,
            status: statusFilter,
          },
        }
      );

      const data = res?.data;

      setGrievances(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch grievances");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const nextStatus =
      currentStatus === "pending"
        ? "in-progress"
        : currentStatus === "in-progress"
          ? "resolved"
          : "pending";

    const confirm = await Swal.fire({
      title: "Change Status?",
      text: `Change status to ${nextStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/grievance/${id}/status`,
        { status: nextStatus }
      );

      toast.success("Status updated");
      fetchGrievances(currentPage);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete grievance?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/grievance/${id}`
      );

      toast.success("Deleted successfully");
      fetchGrievances(currentPage);
    } catch {
      toast.error("Delete failed");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const SkeletonRow = () => (
    <tr className="border-b">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <td key={i} className="px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          </td>
        ))}
    </tr>
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Grievances
          </h1>
          <p className="text-sm text-gray-500">
            Manage user complaints and issues
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-xl font-bold">{grievances.length}</p>
            <p className="text-gray-500">Current Page</p>
          </div>
          <div>
            <p className="text-xl font-bold text-orange-600">
              {grievances.filter((g) => g.status === "pending").length}
            </p>
            <p className="text-gray-500">Pending</p>
          </div>
          <div>
            <p className="text-xl font-bold text-green-600">
              {grievances.filter((g) => g.status === "resolved").length}
            </p>
            <p className="text-gray-500">Resolved</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, mobile"
            className="pl-10 pr-10 py-2 border rounded w-full"
            value={search}
            onChange={(e) => {
              setCurrentPage(1);
              setSearch(e.target.value);
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-3"
            >
              <FiX />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setCurrentPage(1);
            setStatusFilter(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <tbody>
              {[...Array(10)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : grievances.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Mobile</th>
                  <th className="px-4 py-3 text-left">Message</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {grievances.map((g) => (
                  <tr key={g._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{g.name}</td>
                    <td className="px-4 py-3">{g.mobile}</td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      {g.message}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs ${g.status === "pending"
                          ? "bg-orange-100 text-orange-700"
                          : g.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                          }`}
                      >
                        {g.status === "pending" ? (
                          <Clock size={14} />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        {g.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {formatDate(g.createdAt)}
                    </td>

                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          handleStatusChange(g._id, g.status)
                        }
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                      >
                        Update Status
                      </button>

                      <button
                        onClick={() => handleDelete(g._id)}
                        className="text-red-600"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                className="px-3 py-1 border"
              >
                <FiChevronLeft />
              </button>

              <span className="px-4 py-1">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-10 text-center rounded shadow">
          <p className="text-gray-500">No grievances found</p>
        </div>
      )}
    </div>
  );
};

export default AdminGrievances;