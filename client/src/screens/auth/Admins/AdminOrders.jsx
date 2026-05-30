import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiSearch,
  FiX
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ExchangeStatusModal from "../../../components/AdminSideComponents/Order/exchangeStatusModal.jsx";
import StatusChangeModal from "../../../components/AdminSideComponents/Order/statusChangeModal.jsx";
import exportToExcel from "../../../utils/exportToExcel.js";

const ORDERS_PER_PAGE = 10;

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

// ── Status config ──────────────────────────────────────
const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    clickable: true,
  },
  Confirmed: {
    label: "Confirmed",
    className: "bg-sky-50 text-sky-700 border border-sky-200",
    clickable: true,
  },
  Processing: {
    label: "Processing",
    className: "bg-violet-50 text-violet-700 border border-violet-200",
    clickable: true,
  },
  Shipped: {
    label: "Shipped",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
    clickable: true,
  },
  Delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    clickable: false,
  },
  Cancelled: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    clickable: false,
  },
  Returned: {
    label: "Returned",
    className: "bg-orange-50 text-orange-700 border border-orange-200",
    clickable: false,
  },
  "Exchange Requested": {
    label: "Exc. Req.",
    className: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
    clickable: false,
  },
};

const EXCHANGE_CONFIG = {
  Requested: {
    label: "Requested",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  Approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  Completed: {
    label: "Completed",
    className: "bg-sky-50 text-sky-700 border border-sky-200",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
  },
};

const CAPSULE_BASE =
  "inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-medium w-24 whitespace-nowrap";

const StatusBadge = ({ status, onClick, orderId }) => {
  const cfg = STATUS_CONFIG[status] || {
    label: status || "—",
    className: "bg-gray-100 text-gray-500 border border-gray-200",
    clickable: false,
  };
  return (
    <span
      className={`${CAPSULE_BASE} ${cfg.className} ${cfg.clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"
        }`}
      onClick={cfg.clickable ? () => onClick(orderId, status) : undefined}
    >
      {cfg.label}
    </span>
  );
};

const ExchangeStatusBadge = ({ status, isRequested, onClick, clickable }) => {
  if (!isRequested) {
    return (
      <span className={`${CAPSULE_BASE} bg-gray-50 text-gray-400 border border-gray-100`}>
        —
      </span>
    );
  }
  const cfg = EXCHANGE_CONFIG[status] || {
    label: status || "—",
    className: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return (
    <span
      className={`${CAPSULE_BASE} ${cfg.className} ${clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"
        }`}
      onClick={clickable ? onClick : undefined}
    >
      {cfg.label}
    </span>
  );
};

// ── Skeleton ───────────────────────────────────────────
const SkeletonRow = ({ idx }) => (
  <tr className="border-b border-gray-100">
    <td className="px-4 py-3.5">
      <div className="h-3.5 w-5 bg-gray-100 rounded animate-pulse" />
    </td>
    <td className="px-4 py-3.5">
      <div className="space-y-1.5">
        <div className="h-3.5 w-28 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
      </div>
    </td>
    <td className="px-4 py-3.5">
      <div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" />
    </td>
    <td className="px-4 py-3.5">
      <div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse" />
    </td>
    <td className="px-4 py-3.5">
      <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
    </td>
    <td className="px-4 py-3.5">
      <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
    </td>
    <td className="px-4 py-3.5">
      <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
    </td>
    <td className="px-4 py-3.5">
      <div className="h-6 w-6 bg-gray-100 rounded-full animate-pulse mx-auto" />
    </td>
  </tr>
);

// ── Main Component ─────────────────────────────────────
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredByDay, setFilteredByDay] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [cHngModalData, setCHngModalData] = useState({ prod_id: "", prod_status: "" });

  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [exchangeStatusLoading, setExchangeStatusLoading] = useState(false);

  const totalPages = Math.ceil(total / ORDERS_PER_PAGE);
  const hasActiveFilters = debouncedSearch || filteredByDay || filterByStatus;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Build date range from filteredByDay
  const getDateParams = () => {
    if (!filteredByDay) return {};
    const to = new Date();
    const from = new Date();
    if (filteredByDay === "today") {
      from.setHours(0, 0, 0, 0);
    } else if (filteredByDay === "last30") {
      from.setDate(from.getDate() - 30);
    }
    return { from: from.toISOString(), to: to.toISOString() };
  };

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: ORDERS_PER_PAGE,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filterByStatus && { status: filterByStatus }),
        ...getDateParams(),
      };

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/get-all-orders`,
        { params }
      );

      setOrders(response.data.orders || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, filterByStatus, filteredByDay]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterByStatus, filteredByDay]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setFilteredByDay("");
    setFilterByStatus("");
    setCurrentPage(1);
  };

  const handleGetStatus = (pid, current_status) => {
    setCHngModalData({ prod_id: pid, prod_status: current_status });
    setStatusChangeModalOpen(true);
  };

  const handleExchangeStatusClick = (order) => {
    if (order.exchangeRequest?.status && order.exchangeRequest?.isRequested) {
      setSelectedOrder(order);
      setExchangeModalOpen(true);
    }
  };

  const handleExchangeStatusChange = async () => {
    try {
      await fetchOrders();
      setExchangeModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating exchange status:", error);
    }
  };

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      // Fetch all for export (no pagination)
      const params = {
        limit: 10000,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filterByStatus && { status: filterByStatus }),
        ...getDateParams(),
      };
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/get-all-orders`,
        { params }
      );
      const exportOrders = response.data.orders || [];

      if (!exportOrders.length) {
        toast.error("No orders data to export");
        return;
      }

      const tableData = exportOrders.map((order) => {
        const addr = order.shippingAddress;
        const address = addr
          ? `${addr.fullName}, ${addr.addressLine1}, ${addr.city}, ${addr.state} - ${addr.postalCode}`
          : "N/A";

        const productsList = order.products?.length
          ? order.products.map((p) => `${p.productName} (Qty: ${p.quantity} × ₹${p.price})`).join("; ")
          : "No items";

        return {
          "Order ID": order.orderId || order._id,
          "Group Order ID": order.groupOrderId || "—",
          "Order Date": new Date(order.createdAt).toLocaleDateString("en-IN"),
          "Customer Name": `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim(),
          "Customer Phone": order.user?.phone || "N/A",
          "Total Amount": `₹${order.pricing?.grandTotal?.toFixed(2) || "0.00"}`,
          Status: order.orderStatus,
          "Payment Method": order.paymentMethod,
          "Payment Status": order.paymentStatus,
          "Shipping Address": address,
          Products: productsList,
        };
      });

      const fileName = `Orders_${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}`;
      exportToExcel(tableData, fileName);
    } catch (error) {
      console.error("Error during export:", error);
      toast.error("Failed to export orders");
    } finally {
      setIsExporting(false);
    }
  };

  // ── Pagination helper ──────────────────────────────
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="p-5 md:p-7 min-h-screen bg-gray-50/60">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">All Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {total > 0 ? `${total} orders total` : "Manage your orders"}
        </p>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-grow max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <input
            type="text"
            placeholder="Search orders, name, phone…"
            className="pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX size={13} />
            </button>
          )}
        </div>

        {/* Day filter */}
        <select
          value={filteredByDay}
          onChange={(e) => { setFilteredByDay(e.target.value); setCurrentPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 cursor-pointer"
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="last30">Last 30 Days</option>
        </select>

        {/* Status filter */}
        <select
          value={filterByStatus}
          onChange={(e) => { setFilterByStatus(e.target.value); setCurrentPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Clear filters — only when active */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
          >
            <FiX size={13} />
            Clear filters
          </button>
        )}

        {/* Export */}
        <button
          onClick={handleExportClick}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          <FiDownload size={14} />
          {isExporting ? "Exporting…" : "Export"}
        </button>
      </div>

      {/* ── Active filter pills ── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {debouncedSearch && (
            <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-full">
              "{debouncedSearch}"
              <button onClick={() => setSearchQuery("")}><FiX size={11} /></button>
            </span>
          )}
          {filteredByDay && (
            <span className="inline-flex items-center gap-1 text-xs bg-sky-50 text-sky-600 border border-sky-200 px-2.5 py-1 rounded-full">
              {filteredByDay === "today" ? "Today" : "Last 30 days"}
              <button onClick={() => setFilteredByDay("")}><FiX size={11} /></button>
            </span>
          )}
          {filterByStatus && (
            <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-600 border border-violet-200 px-2.5 py-1 rounded-full">
              {filterByStatus}
              <button onClick={() => setFilterByStatus("")}><FiX size={11} /></button>
            </span>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Exchange</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? [...Array(ORDERS_PER_PAGE)].map((_, i) => <SkeletonRow key={i} idx={i} />)
                : orders.length === 0
                  ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center">
                        <p className="text-gray-400 text-sm mb-2">No orders found</p>
                        {hasActiveFilters && (
                          <button onClick={clearAllFilters} className="text-orange-500 text-sm hover:underline">
                            Clear filters
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                  : orders.map((order, index) => (
                    <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-gray-400 text-xs">
                        {(currentPage - 1) * ORDERS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-gray-700 capitalize">
                          {[order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 tabular-nums">
                        {order.user?.phone || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-700 tabular-nums">
                        ₹{order.pricing?.grandTotal?.toLocaleString("en-IN") ?? "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge
                          status={order.orderStatus}
                          onClick={handleGetStatus}
                          orderId={order._id}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <ExchangeStatusBadge
                          status={order.exchangeRequest?.status}
                          isRequested={order.exchangeRequest?.isRequested}
                          onClick={() => handleExchangeStatusClick(order)}
                          clickable={order.exchangeRequest?.isRequested}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => navigate(`/admin-order-details/${order._id}`)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                        >
                          <FaCircleArrowRight size={22} />
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!isLoading && totalPages > 1 && (
          <div className="px-4 py-3.5 border-t border-gray-100 flex items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1}–{Math.min(currentPage * ORDERS_PER_PAGE, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={15} />
              </button>

              {getPageNumbers().map((pg, i) =>
                pg === "..." ? (
                  <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors border ${currentPage === pg
                      ? "bg-orange-500 text-white border-orange-500 font-medium"
                      : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
                      }`}
                  >
                    {pg}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <StatusChangeModal
        isOpen={statusChangeModalOpen}
        onClose={() => setStatusChangeModalOpen(false)}
        cHngModalData={cHngModalData}
        getAllOrders={fetchOrders}
      />

      <ExchangeStatusModal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        onConfirm={handleExchangeStatusChange}
        statusLoading={exchangeStatusLoading}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminOrders;