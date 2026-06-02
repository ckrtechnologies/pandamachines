import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FiChevronLeft, FiChevronRight, FiDownload, FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import exportToExcel from "../../../utils/exportToExcel.js";
import { getCloudinaryImageUrl } from "../../../utils/getCloudinaryImageUrl.js";
import { STATUS_FLOW, StatusChangeModal } from "../../../components/AdminSideComponents/Order/OrderStatusModals.jsx";

const ORDERS_PER_PAGE = 10;

const supplierData = JSON.parse(
  localStorage.getItem("pm-supplier-data") || "null"
);

const isSupplier =
  supplierData?.role === "supplier" ||
  supplierData?.userType === "supplier";

const supplierId = supplierData?._id;

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const STATUS_CONFIG = {
  Pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200", clickable: true },
  Confirmed: { label: "Confirmed", className: "bg-sky-50 text-sky-700 border border-sky-200", clickable: true },
  Processing: { label: "Processing", className: "bg-violet-50 text-violet-700 border border-violet-200", clickable: true },
  Shipped: { label: "Shipped", className: "bg-blue-50 text-blue-700 border border-blue-200", clickable: true },
  Delivered: { label: "Delivered", className: "bg-emerald-50 text-emerald-700 border border-emerald-200", clickable: false },
  Cancelled: { label: "Cancelled", className: "bg-rose-50 text-rose-700 border border-rose-200", clickable: false },
  Returned: { label: "Returned", className: "bg-orange-50 text-orange-700 border border-orange-200", clickable: false },
};

const CAPSULE_BASE = "inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-medium w-28 whitespace-nowrap";

const StatusBadge = ({ status, onClick, orderId }) => {
  const cfg = STATUS_CONFIG[status] || { label: status || "—", className: "bg-gray-100 text-gray-500 border border-gray-200", clickable: false };
  return (
    <span
      className={`${CAPSULE_BASE} ${cfg.className} ${cfg.clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
      onClick={cfg.clickable ? (e) => { e.stopPropagation(); onClick(orderId, status); } : undefined}
    >
      {cfg.label}
    </span>
  );
};

// ── Product Preview Cell ───────────────────────────────────────────────────────

const ProductPreviewCell = ({ products = [] }) => {
  if (!products.length) return <span className="text-gray-400 text-xs">—</span>;
  const first = products[0];
  const rest = products.length - 1;
  const rawImage = first.productImage || first.product?.images?.[0];
  const thumbUrl = rawImage ? getCloudinaryImageUrl(rawImage, { width: 48, quality: 70, crop: "fill" }) : null;
  const name = first.productName || first.product?.name || "—";
  const shortName = name.length > 24 ? name.slice(0, 24) + "…" : name;

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex items-center gap-2">
        {thumbUrl ? (
          <img src={thumbUrl} alt={name}
            className="w-8 h-8 rounded object-cover border border-gray-100 flex-shrink-0 bg-gray-50"
            onError={(e) => { e.currentTarget.style.display = "none"; }} />
        ) : (
          <div className="w-8 h-8 rounded border border-gray-100 bg-gray-100 flex-shrink-0" />
        )}
        <span className="text-xs text-gray-700 font-medium leading-tight truncate">{shortName}</span>
      </div>
      {rest > 0 && <span className="text-xs text-gray-400 pl-10">+{rest} more</span>}
    </div>
  );
};

const SellerCell = ({ order }) => {
  if (order.sellerType === "supplier" && order.sellerId) {
    const seller = order.sellerId;
    const name = seller.businessName || seller.fullName || "Supplier";
    const short = name.length > 20 ? name.slice(0, 20) + "…" : name;
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-gray-700 leading-tight">{short}</span>
        <span className="text-[10px] text-violet-500 font-semibold uppercase tracking-wide">Supplier</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-700">Panda Machines</span>
      <span className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">Admin</span>
    </div>
  );
};

const skeletonColumns = isSupplier
  ? [10, 28, 48, 28, 20, 24, 28, 14]
  : [10, 28, 48, 32, 28, 20, 24, 28, 14, 14];

const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    {skeletonColumns?.map((w, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className={`h-3.5 w-${w} bg-gray-100 rounded animate-pulse`} />
      </td>
    ))}
  </tr>
);


const FilterField = ({ label, children }) => (
  <div className="flex flex-col gap-1 min-w-0">
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-0.5">{label}</span>
    {children}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredByDay, setFilteredByDay] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Status modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [modalOrderId, setModalOrderId] = useState("");
  const [modalStatus, setModalStatus] = useState("");

  const navigate = useNavigate();
  const totalPages = Math.ceil(total / ORDERS_PER_PAGE);
  const hasCustomRange = fromDate || toDate;
  const hasQuickFilter = filteredByDay && !hasCustomRange;
  const hasActiveFilters = debouncedSearch || filteredByDay || filterByStatus || fromDate || toDate;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(searchQuery); setCurrentPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const getDateParams = useCallback(() => {
    if (hasCustomRange) {
      const p = {};
      if (fromDate) p.from = new Date(fromDate).toISOString();
      if (toDate) { const d = new Date(toDate); d.setHours(23, 59, 59, 999); p.to = d.toISOString(); }
      return p;
    }
    if (!filteredByDay) return {};
    const to = new Date(), from = new Date();
    if (filteredByDay === "today") { from.setHours(0, 0, 0, 0); to.setHours(23, 59, 59, 999); }
    else if (filteredByDay === "last30") { from.setDate(from.getDate() - 30); from.setHours(0, 0, 0, 0); }
    return { from: from.toISOString(), to: to.toISOString() };
  }, [filteredByDay, fromDate, toDate, hasCustomRange]);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: ORDERS_PER_PAGE,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filterByStatus && { status: filterByStatus }),
        ...(isSupplier && supplierId && { sellerId: supplierId }),
        ...getDateParams(),
      };
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/get-all-orders`, { params });
      setOrders(res.data.orders || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, filterByStatus, getDateParams]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, filterByStatus, filteredByDay, fromDate, toDate]);

  const clearAllFilters = () => {
    setSearchQuery(""); setDebouncedSearch("");
    setFilteredByDay(""); setFilterByStatus("");
    setFromDate(""); setToDate("");
    setCurrentPage(1);
  };

  const openStatusModal = (orderId, currentStatus) => {
    // Only open if there are transitions available
    if ((STATUS_FLOW[currentStatus] || []).length === 0) return;
    setModalOrderId(orderId);
    setModalStatus(currentStatus);
    setStatusModalOpen(true);
  };

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      const params = {
        limit: 10000, ...(debouncedSearch && { search: debouncedSearch }), ...(filterByStatus && { status: filterByStatus }), ...(isSupplier && supplierId && { sellerId: supplierId }),
        ...getDateParams()
      };
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/get-all-orders`, { params });
      const exportOrders = res.data.orders || [];
      if (!exportOrders.length) { toast.error("No orders data to export"); return; }
      const tableData = exportOrders.map((order) => {
        const addr = order.shippingAddress;
        const address = addr ? `${addr.fullName}, ${addr.addressLine1}, ${addr.city}, ${addr.state} - ${addr.postalCode}` : "N/A";
        const productsList = order.products?.length ? order.products.map((p) => `${p.productName} (Qty: ${p.quantity} × ₹${p.price})`).join("; ") : "No items";
        const sellerName = order.sellerType === "supplier" && order.sellerId
          ? (order.sellerId.businessName || order.sellerId.fullName || "Supplier")
          : "Admin / Panda Machines";
        return {
          "Order ID": order.orderId || order._id,
          "Group Order ID": order.groupOrderId || "—",
          "Order Date": new Date(order.createdAt).toLocaleDateString("en-IN"),
          "Customer Name": `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim(),
          "Customer Phone": order.user?.phone || "N/A",
          "Total Amount": `₹${order.pricing?.grandTotal?.toFixed(2) || "0.00"}`,
          Status: order.orderStatus,
          "Seller": sellerName,
          "Payment Method": order.paymentMethod,
          "Payment Status": order.paymentStatus,
          "Shipping Address": address,
          Products: productsList,
        };
      });
      exportToExcel(tableData, `Orders_${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}`);
    } catch (err) {
      console.error("Error during export:", err);
      toast.error("Failed to export orders");
    } finally {
      setIsExporting(false);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) pages.push(1, 2, 3, 4, 5, "...", totalPages);
    else if (currentPage >= totalPages - 3) pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    else pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    return pages;
  };

  const tableHeaders = [
    "#",
    "Customer",
    "Products",
    ...(!isSupplier ? ["Seller"] : []),
    "Address",
    "Date",
    "Total",
    "Status",
    "Exchange",
    "",
  ];

  // Columns: # | Customer+Phone | Products | Seller | Address | Date | Total | Status | →
  return (
    <div className="p-5 md:p-7 min-h-screen bg-gray-50/60">

      {/* ── Header ── */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">All Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {isLoading ? "Loading…" : total > 0 ? `${total.toLocaleString()} orders total` : "No orders found"}
          </p>
        </div>
        <button onClick={handleExportClick} disabled={isExporting}
          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <FiDownload size={14} />
          {isExporting ? "Exporting…" : "Export"}
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
        <div className="flex items-end gap-3 flex-wrap">

          <FilterField label="Search">
            <div className="relative">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={13} />
              <input type="text" placeholder="Name, phone, order ID…"
                className="pl-8 pr-7 py-2 text-sm border border-gray-200 rounded-lg w-64 bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-orange-400/30 focus:border-orange-400 transition-all placeholder-gray-400"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FiX size={12} />
                </button>
              )}
            </div>
          </FilterField>

          <div className="h-8 w-px bg-gray-200 self-end mb-0.5" />

          <FilterField label="Quick Range">
            <select value={filteredByDay} disabled={!!hasCustomRange}
              onChange={(e) => { setFilteredByDay(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-400/30 focus:border-orange-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="last30">Last 30 Days</option>
            </select>
          </FilterField>

          <FilterField label="From Date">
            <input type="date" value={fromDate} disabled={!!hasQuickFilter}
              onChange={(e) => { setFromDate(e.target.value); setFilteredByDay(""); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-400/30 focus:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed" />
          </FilterField>

          <FilterField label="To Date">
            <input type="date" value={toDate} disabled={!!hasQuickFilter}
              onChange={(e) => { setToDate(e.target.value); setFilteredByDay(""); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-400/30 focus:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed" />
          </FilterField>

          <div className="h-8 w-px bg-gray-200 self-end mb-0.5" />

          <FilterField label="Order Status">
            <select value={filterByStatus} onChange={(e) => { setFilterByStatus(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-400/30 focus:border-orange-400 cursor-pointer">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </FilterField>

          {hasActiveFilters && (
            <div className="flex flex-col gap-1 self-end">
              <span className="text-[10px] font-semibold text-transparent uppercase tracking-wider px-0.5 select-none"> </span>
              <button onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm border text-red-600 rounded-lg bg-white hover:text-rose-600 border-red-600 hover:border-red-800 hover:bg-rose-50 transition-colors">
                <FiX size={13} /> Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {tableHeaders.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(ORDERS_PER_PAGE)].map((_, i) => <SkeletonRow key={i} />)
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={isSupplier ? 8 : 9} className="px-4 py-16 text-center">
                    <p className="text-gray-400 text-sm mb-2">No orders found</p>
                    {hasActiveFilters && (
                      <button onClick={clearAllFilters} className="text-orange-500 text-sm hover:underline">Clear filters</button>
                    )}
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const addr = order.shippingAddress;
                  const cityState = addr ? [addr.city, addr.state].filter(Boolean).join(", ") : null;

                  return (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/admin-order-details/${order._id}`)}
                      className="hover:bg-orange-50/30 transition-colors cursor-pointer"
                    >
                      {/* # */}
                      <td className="px-4 py-3.5 text-gray-400 text-xs font-medium">
                        {(currentPage - 1) * ORDERS_PER_PAGE + index + 1}
                      </td>

                      {/* Customer + Phone */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-gray-700 capitalize leading-tight">
                            {[order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") || "—"}
                          </span>
                          {order.user?.phone && (
                            <span className="text-[11px] text-gray-400 tabular-nums">{order.user.phone}</span>
                          )}
                        </div>
                      </td>

                      {/* Products */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <ProductPreviewCell products={order.products || []} />
                      </td>

                      {/* Seller */}
                      {!isSupplier && (
                        <td className="px-4 py-3.5">
                          <SellerCell order={order} />
                        </td>
                      )}

                      {/* Address */}
                      <td className="px-4 py-3.5">
                        {cityState ? (
                          <div className="flex flex-col gap-0.5 max-w-[140px]">
                            <span
                              className="block truncate text-xs text-gray-600 font-medium"
                              title={cityState}
                            >
                              {cityState}
                            </span>

                            {addr?.postalCode && (
                              <span className="text-[11px] text-gray-400 tabular-nums">
                                {addr.postalCode}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 font-semibold text-gray-700 tabular-nums text-xs whitespace-nowrap">
                        {order.pricing?.grandTotal != null
                          ? `₹${order.pricing.grandTotal.toLocaleString("en-IN")}`
                          : "₹—"}
                      </td>

                      {/* Status badge – click opens modal, doesn't navigate */}
                      <td className="px-4 py-3.5">
                        <StatusBadge
                          status={order.orderStatus}
                          onClick={openStatusModal}
                          orderId={order._id}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {order.exchangeRequest?.isRequested
                          ? order.exchangeRequest.status
                          : "-"}
                      </td>

                      {/* View arrow */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin-order-details/${order._id}`); }}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-orange-500 hover:text-orange-600 hover:bg-orange-100 transition-colors"
                        >
                          <FaCircleArrowRight size={22} />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!isLoading && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1}–{Math.min(currentPage * ORDERS_PER_PAGE, total)} of {total.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <FiChevronLeft size={15} />
              </button>
              {getPageNumbers().map((pg, i) =>
                pg === "..." ? (
                  <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
                ) : (
                  <button key={pg} onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors border
                      ${currentPage === pg ? "bg-orange-500 text-white border-orange-500 font-medium" : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"}`}>
                    {pg}
                  </button>
                )
              )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <FiChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <StatusChangeModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        orderId={modalOrderId}
        currentStatus={modalStatus}
        onSuccess={fetchOrders}
      />
    </div>
  );
};

export default AdminOrders;