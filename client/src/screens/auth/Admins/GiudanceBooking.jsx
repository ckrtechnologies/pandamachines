import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import axios from "axios";
import StatusChangingModal from "../../../components/AdminSideComponents/GuidanceBooking/StatusChangingModal";
import { useNavigate } from "react-router-dom";

const GuidanceBooking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const guidesPerPage = 10;
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // DATA & LOADING STATES
  const [allGuides, setAllGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [cHngModalData, setCHngModalData] = useState({
    guide_id: "",
    status: "",
  });

  // FETCH DATA FROM BACKEND
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/guidance-booking/get-all-booking`
      );
      setAllGuides(response.data?.bookings || []);
    } catch (error) {
      console.error("Error fetching guides:", error);
      setError("Failed to load bookings. Try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // MEMOIZED FILTERING - This prevents unnecessary re-renders
  const filteredGuides = useMemo(() => {
    let updated = [...allGuides];

    // SEARCH FILTER (BY PHONE NUMBER AND NAME)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      updated = updated.filter(
        (g) =>
          g.mobileNumber?.toLowerCase().includes(query) ||
          g.fullName?.toLowerCase().includes(query)
      );
    }

    // STATUS FILTER
    if (filterByStatus) {
      updated = updated.filter((g) => g.status === filterByStatus);
    }

    // DATE FILTER - Using the 'date' field from the booking
    if (selectedDate) {
      const selectedDateString = new Date(selectedDate)
        .toISOString()
        .split("T")[0];
      updated = updated.filter((g) => {
        if (!g.date) return false;
        const bookingDateString = new Date(g.date).toISOString().split("T")[0];
        return bookingDateString === selectedDateString;
      });
    }

    return updated;
  }, [searchQuery, filterByStatus, selectedDate, allGuides]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterByStatus, selectedDate]);

  // PAGINATION LOGIC
  const indexOfLastGuide = currentPage * guidesPerPage;
  const indexOfFirstGuide = indexOfLastGuide - guidesPerPage;
  const currentGuides = filteredGuides.slice(
    indexOfFirstGuide,
    indexOfLastGuide
  );
  const totalPages = Math.ceil(filteredGuides.length / guidesPerPage);

  // CLEAR ALL FILTERS
  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setFilterByStatus("");
    setSelectedDate("");
    setCurrentPage(1);
  }, []);

  const handleGetStatus = useCallback((guide_id, status) => {
    setCHngModalData({
      guide_id,
      status,
    });
    setStatusChangeModalOpen(true);
  }, []);

  const refreshBookings = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // MEMOIZED HEADER SECTION TO PREVENT RE-RENDERS
  const BookingsHeader = useMemo(() => {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        {/* TITLE + SUBTITLE */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Guide Bookings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your guidance bookings
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          {/* SEARCH BY PHONE AND NAME */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by Phone Number or Name..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                type="button"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* DATE INPUT FILTER */}
          <div className="relative w-full md:w-56">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-blue-500 focus:border-blue-500"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                type="button"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* FILTER BY STATUS */}
          <div>
            <select
              value={filterByStatus}
              onChange={(e) => {
                setFilterByStatus(e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2.5 w-full md:w-56 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
    );
  }, [searchQuery, selectedDate, filterByStatus]);

  // MEMOIZED STATUS BADGE COMPONENT
  const StatusBadge = React.memo(({ status, onClick, guideId }) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case "pending":
          return {
            text: "Pending",
            className:
              "px-3 py-1 text-xs w-fit text-yellow-600 bg-yellow-100 rounded-full transition-colors cursor-pointer hover:bg-yellow-200",
            clickable: true,
          };
        case "completed":
          return {
            text: "Completed",
            className:
              "px-3 py-1 text-xs w-fit text-blue-600 bg-blue-100 rounded-full transition-colors cursor-default",
            clickable: false,
          };
        case "rejected":
          return {
            text: "Rejected",
            className:
              "px-3 py-1 text-xs w-fit text-red-700 bg-red-100 rounded-full transition-colors cursor-pointer hover:bg-red-200",
            clickable: true,
          };
        default:
          return {
            text: "__",
            className:
              "px-3 py-1 text-xs w-fit text-gray-500 bg-gray-100 rounded-full",
            clickable: false,
          };
      }
    };

    const config = getStatusConfig(status);

    return (
      <p
        className={config.className}
        onClick={config.clickable ? () => onClick(guideId, status) : undefined}
        title={
          config.clickable
            ? "Click to change status"
            : "Status cannot be changed"
        }
      >
        {config.text}
      </p>
    );
  });

  return (
    <div className="p-4 md:p-6">
      {BookingsHeader}

      {/* STATUS CHANGING MODAL */}
      <StatusChangingModal
        isOpen={statusChangeModalOpen}
        onClose={() => setStatusChangeModalOpen(false)}
        modalData={cHngModalData}
        refreshBookings={refreshBookings}
      />

      {/* TABLE SECTION */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Sl</th>
                <th className="px-4 py-3 text-left">Name</th>
                {/* <th className="px-4 py-3 text-left">Email</th> */}
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left"> Duration</th>
                <th className="px-4 py-3 text-left">Fee</th>
                {/* <th className="px-4 py-3 text-left">Investment</th> */}
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Product Name</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
                {/* <th className="px-4 py-3 text-left">Time</th> */}
                {/* <th className="px-4 py-3 text-left">Category</th> */}
                {/* <th className="px-4 py-3 text-left"> Sub Category</th> */}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[...Array(10)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredGuides.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Sl</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap max-w-[150px]">
                    Name
                  </th>
                  {/* <th className="px-4 py-3 text-left whitespace-nowrap max-w-[200px]">
                    Email
                  </th> */}
                  <th className="px-4 py-3 text-left whitespace-nowrap max-w-[140px]">
                    Mobile
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap max-w-[120px]">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap max-w-[120px]">
                    Fee
                  </th>
                  {/* <th className="px-4 py-3 text-left whitespace-nowrap max-w-[120px]">
                    Investment
                  </th> */}
                  <th className="px-4 py-3 text-left whitespace-nowrap max-w-[140px]">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap max-w-[120px]">
                    Time
                  </th>
                  {/* <th className="px-4 py-3 text-left whitespace-nowrap max-w-[150px]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap max-w-[150px]">
                    Sub Category
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap max-w-[150px]">
                    Sub Sub Category
                  </th> */}
                  <th className="px-4 py-3 text-left whitespace-nowrap max-w-[150px]">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap max-w-[120px]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {currentGuides.map((guide, index) => (
                  <tr
                    key={guide._id}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      navigate(`/guidance-details/${guide._id}`);
                    }}
                  >
                    {/* SL NO */}
                    <td className="px-4 py-3">
                      {indexOfFirstGuide + index + 1}
                    </td>

                    {/* FULL NAME */}
                    <td
                      className="px-4 py-3 whitespace-nowrap truncate max-w-[300px]"
                      title={guide.fullName}
                    >
                      {guide.fullName}
                    </td>

                    {/* EMAIL */}
                    {/* <td
                      className="px-4 py-3 whitespace-nowrap truncate max-w-[300px]"
                      title={guide.email || "N/A"}
                    >
                      {guide.email || "N/A"}
                    </td> */}

                    {/* MOBILE NUMBER */}
                    <td
                      className="px-4 py-3 whitespace-nowrap truncate max-w-[200px]"
                      title={guide.mobileNumber}
                    >
                      {guide.mobileNumber}
                    </td>

                    {/* DISCUSSION TIME */}
                    <td
                      className="px-4 py-3 max-w-[120px] truncate"
                      title={guide.discussionTime}
                    >
                      {guide.discussionTime}
                    </td>

                    {/* DISCUSSION FEE */}
                    <td
                      className="px-4 py-3 max-w-[120px] truncate"
                      title={`₹ ${guide.discussionFee}`}
                    >
                      ₹ {guide.discussionFee}
                    </td>

                    {/* INVESTMENT AMOUNT */}
                    {/* <td
                      className="px-4 py-3 whitespace-nowrap truncate max-w-[300px]"
                      title={`₹ ${guide.investmentAmount}`}
                    >
                      ₹ {guide.investmentAmount}
                    </td> */}

                    {/* DATE */}
                    <td
                      className="px-4 py-3 max-w-[140px] truncate"
                      title={
                        guide.date
                          ? new Date(guide.date).toLocaleDateString()
                          : "N/A"
                      }
                    >
                      {guide.date
                        ? new Date(guide.date)
                            .toISOString()
                            .slice(0, 10)
                            .split("-")
                            .reverse()
                            .join("-")
                        : "N/A"}
                    </td>

                    {/* TIME */}
                    <td
                      className="px-4 py-3 max-w-[120px] truncate"
                      title={guide.time}
                    >
                      {guide.time}
                    </td>

                    {/* CATEGORY */}
                    {/* <td
                      className="px-4 py-3 whitespace-nowrap truncate max-w-[300px]"
                      title={guide.category?.name}
                    >
                      {guide.category?.name}
                    </td> */}

                    {/* SUB CATEGORY */}
                    {/* <td
                      className="px-4 py-3 whitespace-nowrap truncate max-w-[300px]"
                      title={guide.subCategory?.name}
                    >
                      {guide.subCategory?.name}
                    </td> */}

                    {/* SUB-SUB CATEGORY */}
                    {/* <td
                      className="px-4 py-3 whitespace-nowrap truncate max-w-[300px]"
                      title={guide.subSubCategory?.name}
                    >
                      {guide.subSubCategory?.name}
                    </td> */}

                    {/* PRODUCT NAME */}
                    <td
                      className="px-4 py-3 whitespace-nowrap truncate max-w-[300px]"
                      title={guide.product?.name}
                    >
                      {guide.product?.name}
                    </td>

                    {/* STATUS */}
                    <td
                      className="px-4 py-3 max-w-[120px] truncate capitalize"
                      title={guide.status}
                    >
                      <StatusBadge
                        status={guide?.status}
                        onClick={handleGetStatus}
                        guideId={guide?._id}
                      />
                    </td>

                    {/* ACTION / EDIT BUTTON */}
                    <td className="px-4 py-3 flex justify-center items-center">
                      <FaEdit
                        size={20}
                        className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                        onClick={() => {
                          navigate(`/edit-guide-booking/${guide?._id}`);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                      onClick={() => setCurrentPage(number)}
                      className={`px-4 py-1 border-t border-b ${
                        currentPage === number
                          ? "bg-blue-100 text-blue-600 border-blue-600"
                          : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
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
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-4">
            No bookings found for the selected filters.
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

export default GuidanceBooking;
const SkeletonRow = () => (
  <tr className="border-b">
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
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
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </td>
  </tr>
);
