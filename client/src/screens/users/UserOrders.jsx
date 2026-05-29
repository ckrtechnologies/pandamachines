import {
  ArrowUpDown,
  Calendar,
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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import BedsCarousel from "../../components/common/BedsCarousel";
import UserNavbar from "../../components/common/UserNavbar";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const ORDER_STATUSES = [
  { value: "", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Processing", label: "Processing" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Returned", label: "Returned" },
  { value: "Exchange Requested", label: "Exchange" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getUserData = () => {
  try {
    const raw = localStorage.getItem("pm-user-data");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

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

// ─── Status helpers ───────────────────────────────────────────────────────────

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

const getStatusMeta = (status = "") => {
  const key = status.toLowerCase();
  return STATUS_META[key] || { color: "bg-gray-50 text-gray-600 border-gray-200", icon: Clock };
};

const PAYMENT_STATUS_COLOR = {
  paid: "text-green-600",
  pending: "text-yellow-600",
  failed: "text-red-600",
  refunded: "text-blue-600",
  "partially refunded": "text-blue-500",
};

const getPaymentStatusColor = (s = "") =>
  PAYMENT_STATUS_COLOR[s.toLowerCase()] || "text-gray-500";

// ─── Sub-components ───────────────────────────────────────────────────────────

const OrderCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-40" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-24" />
    </div>
    <div className="p-5 flex gap-4">
      <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="w-20 space-y-2 hidden sm:block">
        <div className="h-5 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium whitespace-nowrap ${meta.color}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

const OrderCard = ({ order, onClick }) => {
  const firstProduct = order.products?.[0];
  const image =
    firstProduct?.product?.images?.[0] ||
    firstProduct?.productImage ||
    null;
  const name =
    firstProduct?.product?.name ||
    firstProduct?.productName ||
    "Product";
  const extraCount = order.products.length - 1;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* TOP BAR */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-sm font-semibold text-gray-900 tracking-tight">
              {order.orderId}
            </span>
            <StatusBadge status={order.orderStatus} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
            <Calendar className="w-3 h-3" />
            {formatDate(order.createdAt)}
            {order.groupOrderId && (
              <>
                <span className="text-gray-200">·</span>
                <span className="text-gray-400 font-mono text-[10px]">
                  {order.groupOrderId}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col sm:text-right items-center sm:items-end gap-3 sm:gap-0.5">
          <p className="text-base font-bold text-gray-900">
            {formatCurrency(order.pricing?.grandTotal)}
          </p>
          <p className={`text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentMethod} · {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="px-5 py-4 flex gap-4 items-start">
        {/* Product image */}
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {name}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-1.5">
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {order.products.length} item{order.products.length !== 1 ? "s" : ""}
            </span>
            {firstProduct?.size && (
              <>
                <span>·</span>
                <span>Size: {firstProduct.size}</span>
              </>
            )}
            {firstProduct?.variantModel && (
              <>
                <span>·</span>
                <span>{firstProduct.variantModel}</span>
              </>
            )}
          </div>
          {extraCount > 0 && (
            <p className="text-xs text-[#00395F] font-medium mt-1.5">
              +{extraCount} more item{extraCount > 1 ? "s" : ""}
            </p>
          )}

          {/* Seller tag */}
          <div className="mt-2.5">
            {order.sellerType === "supplier" ? (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full">
                <ShoppingBag className="w-2.5 h-2.5" />
                Supplier
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 border border-gray-200 rounded-full">
                <ShoppingBag className="w-2.5 h-2.5" />
                Panda Machines
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1 group-hover:text-gray-500 transition-colors" />
      </div>
    </div>
  );
};

// ─── Filter Bar ───────────────────────────────────────────────────────────────

const FilterBar = ({ filters, onChange, onReset, totalResults }) => {
  const hasActiveFilters =
    filters.status || filters.sort !== "newest" || filters.search;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-5">
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search by order ID, product name…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00395F]/10 focus:border-[#00395F] transition-all bg-gray-50"
          />
          {filters.search && (
            <button
              onClick={() => onChange("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => onChange("status", e.target.value)}
            className="flex-1 sm:flex-none text-sm px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00395F]/10 focus:border-[#00395F] bg-gray-50 text-gray-700 min-w-[130px]"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* Sort */}
          <button
            onClick={() =>
              onChange("sort", filters.sort === "newest" ? "oldest" : "newest")
            }
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {filters.sort === "newest" ? "Newest first" : "Oldest first"}
          </button>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm border border-red-100 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {totalResults !== null && (
        <p className="text-xs text-gray-400 mt-2.5 ml-0.5">
          {totalResults === 0
            ? "No orders found"
            : `${totalResults} order${totalResults !== 1 ? "s" : ""} found`}
        </p>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  status: "",
  sort: "newest",
  search: "",
};

const UserOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef(null);

  const observerRef = useRef(null);

  // ── Fetch ─────────────────────────────────────────────────────────
  const fetchOrders = useCallback(
    async (pageNumber = 1, currentFilters = filters, isRefresh = false) => {
      const user = getUserData();
      if (!user?._id) {
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      if (pageNumber === 1 || isRefresh) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        const params = new URLSearchParams({
          page: pageNumber,
          limit: PAGE_SIZE,
          sort: currentFilters.sort,
        });
        if (currentFilters.status) params.set("status", currentFilters.status);
        if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/orders/get-user-orders/${user._id}?${params}`
        );
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();

        setOrders((prev) =>
          pageNumber === 1 ? data.orders : [...prev, ...data.orders]
        );
        setHasMore(data.hasMore);
        setTotal(data.total);
        setPage(pageNumber);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, debouncedSearch]
  );

  // ── Filter change handler ─────────────────────────────────────────
  const handleFilterChange = (key, value) => {
    if (key === "search") {
      setFilters((prev) => ({ ...prev, search: value }));
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => setDebouncedSearch(value), 400);
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDebouncedSearch("");
    clearTimeout(searchTimerRef.current);
  };

  // ── Refetch when filters / debounced search change ────────────────
  useEffect(() => {
    setPage(1);
    setOrders([]);
    fetchOrders(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.sort, debouncedSearch]);

  // ── Infinite scroll sentinel ──────────────────────────────────────
  const sentinelRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            fetchOrders(page + 1);
          }
        },
        { threshold: 0.3 }
      );

      if (node) observerRef.current.observe(node);
    },
    [page, hasMore, loadingMore, fetchOrders]
  );

  // ── Stats bar ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const delivered = orders.filter((o) => o.orderStatus === "Delivered").length;
    const pending = orders.filter((o) => ["Pending", "Confirmed", "Processing"].includes(o.orderStatus)).length;
    const inTransit = orders.filter((o) => o.orderStatus === "Shipped").length;
    return { delivered, pending, inTransit };
  }, [orders]);

  // ── Render ────────────────────────────────────────────────────────

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <BedsCarousel />
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <BedsCarousel />
        <div className="flex justify-center items-center py-24 px-4">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Couldn't load orders
            </h2>
            <p className="text-gray-500 text-sm mb-5">{error}</p>
            <button
              onClick={() => fetchOrders(1, filters, true)}
              className="px-5 py-2.5 rounded-xl bg-[#00395F] text-white text-sm font-semibold hover:bg-[#FF8617] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <BedsCarousel />

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 pb-24">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Orders
            </h1>
            <div className="flex items-center text-xs text-gray-400 mt-1 gap-1.5">
              <span
                className="hover:text-gray-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>
              <ChevronRight className="w-3 h-3" />
              <span>My Orders</span>
            </div>
          </div>

          {/* Quick stat pills */}
          {total !== null && total > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <StatPill label="Total" value={total} color="gray" />
              {stats.pending > 0 && (
                <StatPill label="Active" value={stats.pending} color="orange" />
              )}
              {stats.inTransit > 0 && (
                <StatPill label="Shipped" value={stats.inTransit} color="purple" />
              )}
              {stats.delivered > 0 && (
                <StatPill label="Delivered" value={stats.delivered} color="green" />
              )}
            </div>
          )}
        </div>

        {/* ── Filters ── */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          totalResults={total}
        />

        {/* ── Empty state ── */}
        {!loading && orders.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {filters.status || filters.search
                ? "No orders match your filters"
                : "No Orders Yet"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {filters.status || filters.search
                ? "Try adjusting your filters or search term."
                : "Your purchased products will appear here."}
            </p>
            {filters.status || filters.search ? (
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-xl bg-[#00395F] text-white text-sm font-semibold hover:bg-[#FF8617] transition-colors"
              >
                Continue Shopping
              </button>
            )}
          </div>
        )}

        {/* ── Order list ── */}
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <div
              key={order._id}
              ref={idx === orders.length - 1 ? sentinelRef : null}
            >
              <OrderCard
                order={order}
                onClick={() => navigate(`/order/${order._id}`)}
              />
            </div>
          ))}

          {/* Load-more skeletons */}
          {loadingMore && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* End of list */}
          {!hasMore && orders.length > 0 && (
            <div className="text-center py-8 text-sm text-gray-400">
              <Package className="w-5 h-5 mx-auto mb-2 text-gray-300" />
              You've seen all your orders
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── Stat Pill ────────────────────────────────────────────────────────────────

const PILL_COLORS = {
  gray: "bg-gray-100 text-gray-700 border-gray-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  green: "bg-green-50 text-green-700 border-green-200",
};

const StatPill = ({ label, value, color = "gray" }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${PILL_COLORS[color]}`}>
    <span className="text-[11px] opacity-70">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

export default UserOrders;