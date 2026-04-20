/* eslint-disable react-hooks/exhaustive-deps */
import { pdf } from "@react-pdf/renderer";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaTimesCircle, FaWhatsapp } from "react-icons/fa";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEye,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiUserCheck,
  FiUserX,
  FiX
} from "react-icons/fi";
import { MdAttachMoney, MdOutlineWork } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import TechnicianPDF from "../../../components/AdminSideComponents/Technician/TechnicianPDF";
import { OPERATOR_TYPES as operatorTypes } from "../../../utils/constants"

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">

        {/* Text Section */}
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>

        {/* Icon Section */}
        <div className="p-3 bg-gray-100 rounded-full text-gray-700">
          {icon}
        </div>

      </div>
    </div>
  );
};

// Skeleton loading component
const SkeletonRow = () => (
  <tr className="border-b">
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
    </td>
    <td className="px-4 py-3">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-28"></div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
    </td>
  </tr>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <FaCheckCircle className="mr-1" size={12} />,
      label: "Approved"
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: <FaTimesCircle className="mr-1" size={12} />,
      label: "Rejected"
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <FaClock className="mr-1" size={12} />,
      label: "Pending"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Confirmation Modal
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#FF8617] text-white rounded-lg hover:bg-[#CC5F0F] transition flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Document Viewer Modal
const DocumentViewerModal = ({ isOpen, onClose, documentUrl, documentType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{documentType}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          <img
            src={documentUrl}
            alt={documentType}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

// Technician Details Modal
const TechnicianDetailsModal = ({ isOpen, onClose, technician }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentType, setDocumentType] = useState("");

  if (!isOpen || !technician) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const handleViewDocument = (url, type) => {
    setSelectedDocument(url);
    setDocumentType(type);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Technician Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="p-6">
            {/* Header with Name and Status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{technician.name}</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {technician._id}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <StatusBadge status={technician.status} />
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-4 border border-orange-100">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <MdOutlineWork className="mr-2 text-[#FF8617]" size={20} />
                  Operator Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiUser className="mr-2 text-gray-400 mt-1" size={16} />
                    <div>
                      <p className="text-sm text-gray-500">Operator Name</p>
                      <p className="text-gray-800 font-medium">{technician.operatorName}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <RiMoneyRupeeCircleLine className="mr-2 text-gray-400 mt-1" size={16} />
                    <div>
                      <p className="text-sm text-gray-500">Expected Salary</p>
                      <p className="text-gray-800 font-medium">
                        {formatSalary(technician.expectedSalaryMin)} - {formatSalary(technician.expectedSalaryMax)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <FiPhone className="mr-2 text-blue-500" size={20} />
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiPhone className="mr-2 text-gray-400 mt-1" size={16} />
                    <div>
                      <p className="text-sm text-gray-500">Mobile Number</p>
                      <p className="text-gray-800 font-medium">{technician.mobileNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaWhatsapp className="mr-2 text-green-500 mt-1" size={16} />
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp Number</p>
                      <p className="text-gray-800 font-medium">{technician.whatsappNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-100">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <FiMapPin className="mr-2 text-purple-500" size={20} />
                  Address
                </h4>
                <p className="text-gray-800">{technician.address}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <FiCalendar className="mr-2 text-gray-500" size={20} />
                  Timeline
                </h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Registered:</span>{" "}
                    <span className="text-gray-800">{formatDate(technician.createdAt)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Last Updated:</span>{" "}
                    <span className="text-gray-800">{formatDate(technician.updatedAt)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                <FiDownload className="mr-2 text-[#FF8617]" size={20} />
                KYC Documents
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technician.aadharFront && (
                  <div
                    onClick={() => handleViewDocument(technician.aadharFront, "Aadhar Card (Front)")}
                    className="border rounded-lg p-4 cursor-pointer hover:border-[#FF8617] transition group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Aadhar Front</span>
                      <FiEye className="text-gray-400 group-hover:text-[#FF8617]" />
                    </div>
                    <img
                      src={technician.aadharFront}
                      alt="Aadhar Front"
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
                {technician.aadharBack && (
                  <div
                    onClick={() => handleViewDocument(technician.aadharBack, "Aadhar Card (Back)")}
                    className="border rounded-lg p-4 cursor-pointer hover:border-[#FF8617] transition group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Aadhar Back</span>
                      <FiEye className="text-gray-400 group-hover:text-[#FF8617]" />
                    </div>
                    <img
                      src={technician.aadharBack}
                      alt="Aadhar Back"
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        documentUrl={selectedDocument}
        documentType={documentType}
      />
    </>
  );
};


const AdminTechnician = () => {
  const [technicians, setTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState("all");
  const [exportConfirm, setExportConfirm] = useState(false);
  const [operatorFilter, setOperatorFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);



  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    technicianId: null,
    technicianName: "",
    newStatus: ""
  });

  const isExportingAll =
    !searchQuery &&
    statusFilter === "all" &&
    operatorFilter === "all" &&
    selectedIds.size === 0;

  /* technicians Debounce technicians */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleExportClick = () => {
    if (isExportingAll) {
      setExportConfirm(true);
    } else {
      handleExport();
    }
  };

  /* technicians Fetch Technicians technicians */
  const fetchTechnicians = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/technicians`,
        {
          params: {
            page: currentPage,
            limit: 10,
            search: debouncedSearch,
            status: statusFilter,
            operatorName: operatorFilter
          }
        }
      );

      setTechnicians(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error("Error fetching technicians:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* technicians Fetch Stats technicians */
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/technicians/stats`
      );
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [currentPage, debouncedSearch, statusFilter, operatorFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSelect = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  /* technicians Status Change technicians */
  const handleStatusChange = (technician, newStatus) => {
    setConfirmDialog({
      isOpen: true,
      technicianId: technician._id,
      technicianName: technician.name,
      newStatus
    });
  };

  const confirmStatusChange = async () => {
    try {
      setIsUpdating(true);

      await axios.put(
        `${process.env.REACT_APP_API_URL}/technicians/change-status/${confirmDialog.technicianId}`,
        { status: confirmDialog.newStatus }
      );

      await fetchTechnicians();
      await fetchStats();

      setConfirmDialog({
        isOpen: false,
        technicianId: null,
        technicianName: "",
        newStatus: ""
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelStatusChange = () => {
    setConfirmDialog({
      isOpen: false,
      technicianId: null,
      technicianName: "",
      newStatus: ""
    });
  };

  /* technicians View Details technicians */
  const handleViewDetails = (technician) => {
    setSelectedTechnician(technician);
    setIsDetailsModalOpen(true);
  };

  const generatePDF = async (data) => {
    const blob = await pdf(<TechnicianPDF data={data} />).toBlob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "technicians.pdf";
    link.click();
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      let dataToExport = [];

      if (selectedIds.size > 0) {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/technicians/export`,
          {
            params: {
              ids: Array.from(selectedIds) // send selected IDs
            }
          }
        );
        dataToExport = res.data.data;
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/technicians/export`,
          {
            params: {
              search: debouncedSearch,
              status: statusFilter,
              operatorName: operatorFilter
            }
          }
        );
        dataToExport = res.data.data;
      }

      await generatePDF(dataToExport);

    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setOperatorFilter("all");
    setCurrentPage(1);
  };

  const isFilterActive =
    searchQuery ||
    statusFilter !== "all" ||
    operatorFilter !== "all";

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Technician Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all registered technicians
          </p>
        </div>

        <button
          onClick={fetchTechnicians}
          className="flex items-center border px-4 py-3 rounded-lg"
        >
          <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Technicians" value={stats.total} icon={<FiUser />} />
        <StatCard title="Approved" value={stats.approved} icon={<FaCheckCircle />} />
        <StatCard title="Pending" value={stats.pending} icon={<FaClock />} />
        <StatCard title="Rejected" value={stats.rejected} icon={<FaTimesCircle />} />
      </div>

      {/* Filters (only padding slightly reduced) */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">

          {/*  Search (fixed width) */}
          <div className="relative w-full md:w-[320px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg w-full text-sm focus:ring-1 outline-none focus:ring-orange-600 transition"
              placeholder="Search..."
            />
            {searchQuery && (
              <FiX
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600"
              />
            )}
          </div>

          {/*  Filters */}
          <div className="flex items-center gap-2">
            <select
              value={operatorFilter}
              onChange={(e) => setOperatorFilter(e.target.value)}
              className="border px-3 py-2.5 rounded-lg text-sm focus:ring-1 outline-none focus:ring-orange-600"
            >
              <option value="all">All Operators</option>
              {operatorTypes.map(op => (
                <option key={op}>{op}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2.5 rounded-lg text-sm focus:ring-1 outline-none focus:ring-orange-600"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            {isFilterActive && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition whitespace-nowrap"
              >
                <FiX size={14} />
                Clear
              </button>
            )}
          </div>

          {/*  Spacer (push everything right) */}
          <div className="flex-1" />

          {/* Selection Indicator (compact, no layout shift) */}
          <div className="min-w-[160px] h-[36px] flex items-center justify-end">
            {selectedIds?.size > 0 ? (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-lg text-sm">
                <span className="font-medium whitespace-nowrap">
                  {selectedIds.size} selected
                </span>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="underline hover:text-orange-900 text-xs"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="opacity-0 text-sm">placeholder</div> // 👈 keeps space reserved
            )}
          </div>

          {/* ⬇ Export Button (fixed width, never moves) */}
          <button
            onClick={handleExportClick}
            disabled={isExporting}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition w-[140px]
        ${isExporting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border border-gray-300 hover:bg-gray-50"
              }`}
          >
            {isExporting ? (
              <>
                <FiRefreshCw className="animate-spin" />
                <span>Exporting</span>
              </>
            ) : (
              <>
                <FiDownload />
                <span>Export</span>
                  {selectedIds.size > 0 && (
                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {selectedIds.size}
                    </span>
                  )}
              </>
            )}
          </button>

        </div>
      </div>


      {/* Technicians Table */}
      {isLoading ? (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Operator</th>
                <th className="px-4 py-3 text-left">Expected Salary</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : technicians.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-3 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#FF8617] focus:ring-[#FF8617]"
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          const ids = technicians.map(t => t._id);
                          setSelectedIds(prev => new Set([...prev, ...ids]));
                        } else {
                          const ids = technicians.map(t => t._id);
                          setSelectedIds(prev => {
                            const newSet = new Set(prev);
                            ids.forEach(id => newSet.delete(id));
                            return newSet;
                          });
                        }
                      }}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Operator</th>
                  <th className="px-4 py-3 text-left">Expected Salary</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {technicians.map((technician, index) => (
                  <tr
                    key={technician._id}
                    className={`border-b hover:bg-orange-100 transition-colors ${selectedIds.has(technician._id) ? " bg-orangeAccent/10" : ""} cursor-pointer`}
                    onClick={() => handleViewDetails(technician)}
                  >
                    <td onClick={(e) => e.stopPropagation()} className="px-4 ">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(technician._id)}
                        onChange={() => handleSelect(technician._id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#FF8617] focus:ring-[#FF8617] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">{((pagination.page - 1) * pagination.limit) + index + 1}</td>
                    <td className="px-4 py-3 font-medium">{technician.name}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <FiPhone className="mr-1 text-gray-400" size={12} />
                          <span>{technician.mobileNumber}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FaWhatsapp className="mr-1 text-green-500" size={12} />
                          <span>{technician.whatsappNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {technician.operatorName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <MdAttachMoney className="mr-1 text-gray-400" />
                        <span>
                          {formatSalary(technician.expectedSalaryMin)} - {formatSalary(technician.expectedSalaryMax)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={technician.status} />
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        {technician.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(technician, 'approved')}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                              title="Approve"
                            >
                              <FiUserCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(technician, 'rejected')}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                              title="Reject"
                            >
                              <FiUserX size={16} />
                            </button>
                          </>
                        )}
                        {technician.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(technician, 'rejected')}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                            title="Reject"
                          >
                            <FiUserX size={16} />
                          </button>
                        )}
                        {technician.status === 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(technician, 'approved')}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                            title="Approve"
                          >
                            <FiUserCheck size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 bg-white rounded-lg shadow px-4 py-3">
            <div className="text-sm text-gray-500">
              Showing page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 border rounded-lg ${currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <FiChevronLeft size={20} />
              </button>
              <span className="px-4 py-2 bg-[#FF8617] text-white rounded-lg">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className={`p-2 border rounded-lg ${currentPage === pagination.totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No technicians found</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Technicians will appear here once they register'}
          </p>
        </div>
      )}

      {/* Modals */}
      <TechnicianDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        technician={selectedTechnician}
      />

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title="Confirm Status Change"
        message={`Are you sure you want to ${confirmDialog.newStatus} ${confirmDialog.technicianName}?`}
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default AdminTechnician;