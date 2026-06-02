import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Package,
  RefreshCw,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  X,
  XCircle
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserNavbar from "../../components/common/UserNavbar";
import { useAuth } from "../../context/AuthContext";

const PAGE_SIZE = 10;


const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });


const normaliseOrder = (order) => {
  const isLegacy = !order.orderId && !order.orderStatus;
  const orderStatus = order.orderStatus || order.status || "Pending";

  // Grand total: new pricing object → old totalAmount → compute from lines
  let grandTotal = order.pricing?.grandTotal ?? null;
  if (!grandTotal) {
    if (order.totalAmount && order.totalAmount > 0) {
      grandTotal = order.totalAmount;
    } else {
      grandTotal = (order.products || []).reduce((sum, p) => {
        const qty = p.quantity || 1;
        return sum + ((p.price || 0) + (p.gst || 0) + (p.extraTax || 0) + (p.shippingCharge || 0)) * qty;
      }, 0);
    }
  }

  const orderId = order.orderId || order._id?.slice(-8).toUpperCase();
  const paymentMethod = order.paymentMethod || null;
  const paymentStatus = order.paymentStatus || null;

  return { ...order, _normalised: true, isLegacy, orderStatus, grandTotal, orderId, paymentMethod, paymentStatus };
};

const STATUS_META = {
  pending: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  confirmed: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle },
  processing: { color: "bg-orange-50 text-orange-700 border-orange-200", icon: RefreshCw },
  shipped: { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck },
  delivered: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
  cancelled: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  returned: { color: "bg-gray-100 text-gray-700 border-gray-300", icon: RotateCcw },
  "exchange requested": { color: "bg-teal-50 text-teal-700 border-teal-200", icon: RotateCcw },
};

const getStatusMeta = (status = "") =>
  STATUS_META[status.toLowerCase()] || { color: "bg-gray-50 text-gray-600 border-gray-200", icon: Clock };

const OrderCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    {/* TOP BAR */}
    <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between">
        {/* Order ID */}
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-28" />

        {/* Price */}
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-16 sm:w-24" />
      </div>
    </div>

    {/* BODY */}
    <div className="relative px-4 sm:px-5 py-4 flex gap-3 sm:gap-4 items-start">
      {/* Product Image */}
      <div className="w-[68px] h-[68px] sm:w-20 sm:h-20 rounded-xl bg-gray-200 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 pr-2">
        {/* Product Name Line 1 */}
        <div className="h-4 bg-gray-200 rounded w-[85%]" />

        {/* Product Name Line 2 */}
        <div className="h-4 bg-gray-200 rounded w-[55%] mt-2" />

        {/* Item Count / Variant */}
        <div className="h-3 bg-gray-200 rounded w-32 mt-3" />

        {/* Status Badge */}
        <div className="h-5 bg-gray-200 rounded-full w-20 mt-3" />

        {/* Extra Items */}
        <div className="h-3 bg-gray-200 rounded w-24 mt-2" />
      </div>

      {/* Chevron */}
      <div className="w-4 h-4 rounded bg-gray-200 flex-shrink-0 self-center" />

      {/* Date */}
      <div className="absolute bottom-3 right-10 h-3 bg-gray-200 rounded w-16" />
    </div>
  </div>
);

const ListSkeleton = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => <OrderCardSkeleton key={i} />)}
  </div>
);

const StatusBadge = ({ status }) => {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border text-[10px] sm:text-[11px] font-medium whitespace-nowrap ${meta.color}`}
    >
      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
      {status}
    </span>
  );
};

const OrderCard = ({ order, onClick }) => {
  const o = normaliseOrder(order);

  const firstProduct = o.products?.[0];
  const image =
    firstProduct?.product?.images?.[0] ||
    firstProduct?.productImage ||
    null;

  const name =
    firstProduct?.product?.name ||
    firstProduct?.productName ||
    "Product";

  const extraCount = (o.products?.length || 1) - 1;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* TOP BAR */}
      <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] sm:text-sm font-semibold text-gray-700 tracking-tight">
            #{o.orderId}
          </span>

          <p className="text-sm sm:text-base font-bold text-gray-900">
            {formatCurrency(o.grandTotal)}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="relative px-4 sm:px-5 py-4 flex gap-3 sm:gap-4 items-start">
        <div className="w-[68px] h-[68px] sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-7 h-7 text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {name}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400 mt-1">
            <span>
              {o.products?.length || 1} item
              {(o.products?.length || 1) !== 1 ? "s" : ""}
            </span>

            {firstProduct?.size && (
              <>
                <span>•</span>
                <span>{firstProduct.size}</span>
              </>
            )}

            {firstProduct?.variantModel && (
              <>
                <span>•</span>
                <span>{firstProduct.variantModel}</span>
              </>
            )}
          </div>

          <div className="mt-2">
            <StatusBadge status={o.orderStatus} />
          </div>

          {extraCount > 0 && (
            <p className="text-xs text-[#00395F] font-medium mt-1.5">
              +{extraCount} more item{extraCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 self-center group-hover:text-gray-500 transition-colors" />

        {/* DATE */}
        <span className="absolute bottom-3 right-10 text-[10px] sm:text-xs text-gray-400">
          {formatDate(o.createdAt)}
        </span>
      </div>
    </div>
  );
};


const FilterBar = ({ filters, onChange, onReset, totalResults, isFiltering }) => {

  return (
    <div className="bg-white relative flex-1 rounded-2xl border border-gray-100 shadow-sm mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
        placeholder="Search by order ID, product name…"
        className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-gray-400 outline-none focus:ring-1 focus:ring-primaryColor transition-all bg-gray-50"
      />
      {filters.search && (
        <button onClick={() => onChange("search", "")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({ page, total, limit, onChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = [];
  const left = Math.max(2, page - 1);
  const right = Math.min(totalPages - 1, page + 1);

  pages.push(1);
  if (left > 2) pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push("…");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 pb-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-2 text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${p === page ? "bg-[#00395F] text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const DEFAULT_FILTERS = { status: "", sort: "newest", search: "" };

const UserOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);  // first load only
  const [listLoading, setListLoading] = useState(false); // filter/page changes
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const searchTimerRef = useRef(null);
  const isFirstLoad = useRef(true);
  const isMount = useRef(true);

  const fetchOrders = useCallback(async (pageNum, currentFilters, debSearch) => {

    if (isFirstLoad.current) {
      setPageLoading(true);
    } else {
      setListLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams({ page: pageNum, limit: PAGE_SIZE, sort: currentFilters.sort });
      if (currentFilters.status) params.set("status", currentFilters.status);
      if (debSearch?.trim()) params.set("search", debSearch.trim());

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/get-user-orders/${user._id}?${params}`
      );
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total ?? 0);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setPageLoading(false);
      setListLoading(false);
      isFirstLoad.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchOrders(1, DEFAULT_FILTERS, "");
  }, [fetchOrders]);

  // Filter / page changes (skip first render)
  useEffect(() => {
    if (isMount.current) { isMount.current = false; return; }
    fetchOrders(page, filters, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.status, filters.sort, debouncedSearch]);

  const handleFilterChange = (key, value) => {
    if (key === "search") {
      setFilters((prev) => ({ ...prev, search: value }));
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => { setPage(1); setDebouncedSearch(value); }, 400);
      return;
    }
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    clearTimeout(searchTimerRef.current);
    setFilters(DEFAULT_FILTERS);
    setDebouncedSearch("");
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = filters.status || filters.sort !== "newest" || filters.search;

  // ── Full page skeleton (first load only) ──────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6 animate-pulse">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-36" />
              <div className="h-3 bg-gray-200 rounded w-28" />
            </div>
            <div className="h-8 bg-gray-200 rounded-xl w-20" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 h-16 mb-5 animate-pulse" />
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  // ── Error (empty list only) ───────────────────────────────────────
  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="flex justify-center items-center py-24 px-4">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Couldn't load orders</h2>
            <p className="text-gray-500 text-sm mb-5">{error}</p>
            <button
              onClick={() => { isFirstLoad.current = true; fetchOrders(1, filters, debouncedSearch); }}
              className="px-5 py-2.5 rounded-xl bg-[#00395F] text-white text-sm font-semibold hover:bg-[#FF8617] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 pb-10 sm:pb-16">

        {/* Header — always stable */}
        <div className="flex flex-row gap-4 justify-between items-center mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
            <div className="flex items-center text-[0.7rem] sm:text-xs text-gray-400 mt-1 gap-1.5">
              <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span>My Orders</span>
            </div>
          </div>
          {total !== null && total > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-100 text-xs font-medium text-gray-700">
              <span className="text-[11px] opacity-70">Total</span>
              <span className="font-bold">{total}</span>
            </div>
          )}
        </div>

        {/* Filters — always visible */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          totalResults={total}
          isFiltering={listLoading}
        />

        {/* List area — only this section swaps to skeleton on filter change */}
        {listLoading ? (
          <ListSkeleton count={4} />
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {hasActiveFilters ? "No orders match your filters" : "No Orders Yet"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters or search term."
                : "Your purchased products will appear here."}
            </p>
            {hasActiveFilters ? (
              <button onClick={handleResetFilters} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Clear Filters
              </button>
            ) : (
              <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-[#00395F] text-white text-sm font-semibold hover:bg-[#FF8617] transition-colors">
                Continue Shopping
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onClick={() => navigate(`/orders/${order._id}`)}
                />
              ))}
            </div>

            <Pagination
              page={page}
              total={total}
              limit={PAGE_SIZE}
              onChange={handlePageChange}
            />
          </>
        )}

      </div>
    </div>
  );
};

export default UserOrders;