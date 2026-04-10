import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
    FiChevronRight,
    FiSearch,
    FiGrid,
    FiList,
    FiPackage,
    FiChevronDown,
    FiChevronUp,
    FiX,
    FiAlertCircle,
} from "react-icons/fi";
import { HiOutlineViewGrid } from "react-icons/hi";
import UserNavbar from "../../../components/common/UserNavbar";
import AllUserFooter from "../../../components/common/AllUserFooter";

const API = process.env.REACT_APP_API_URL;

/* ─── Skeleton: sidebar ────────────────────────────────────── */
const CategorySidebarSkeleton = () => (
    <div className="animate-pulse">
        {Array.from({ length: 7 }).map((_, i) => (
            <div
                key={i}
                className="flex flex-col items-center gap-2 p-3 border-b border-gray-100"
            >
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="h-2.5 w-14 bg-gray-200 rounded" />
            </div>
        ))}
    </div>
);

/* ─── Skeleton: subcategory grid ───────────────────────────── */
const SubCategoryGridSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
            <div
                key={i}
                className="animate-pulse bg-white rounded-lg overflow-hidden border border-gray-100"
            >
                <div className="aspect-square bg-gray-200" />
                <div className="p-2">
                    <div className="h-2.5 bg-gray-200 rounded w-3/4 mx-auto" />
                </div>
            </div>
        ))}
    </div>
);

/* ─── Skeleton: products ───────────────────────────────────── */
const ProductGridSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
            <div
                key={i}
                className="animate-pulse bg-white rounded-lg border border-gray-100"
            >
                <div className="aspect-square bg-gray-200" />
                <div className="p-2.5 space-y-2">
                    <div className="h-2.5 bg-gray-200 rounded w-full" />
                    <div className="h-2.5 bg-gray-200 rounded w-2/3" />
                    <div className="h-3.5 bg-gray-300 rounded w-1/2" />
                </div>
            </div>
        ))}
    </div>
);

/* ─── Sub-Sub-Category Pills ───────────────────────────────── */
const SubSubCategoryPills = ({ items, activeId, onSelect }) => {
    if (!items.length) return null;
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <button
                onClick={() => onSelect(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${!activeId
                    ? "bg-[#002B45] text-white border-[#002B45]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#002B45] hover:text-[#002B45]"
                    }`}
            >
                All
            </button>
            {items.map((ss) => (
                <button
                    key={ss._id}
                    onClick={() => onSelect(ss._id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeId === ss._id
                        ? "bg-[#002B45] text-white border-[#002B45]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#002B45] hover:text-[#002B45]"
                        }`}
                >
                    {ss.name}
                </button>
            ))}
        </div>
    );
};

/* ─── Product Card ─────────────────────────────────────────── */
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);

    const getPrice = () => {
        if (product.hasVariants && product.variants?.length > 0) {
            const def =
                product.variants.find((v) => v.isDefault) || product.variants[0];
            return def?.price;
        }
        return product.price;
    };

    const prevPrice = !product.hasVariants ? product.previous_price : null;
    const price = getPrice();
    const discount =
        prevPrice && price
            ? Math.round(((prevPrice - price) / prevPrice) * 100)
            : null;

    return (
        <div
            onClick={() => navigate(`/product/${product._id}`)}
            className="group bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
        >
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {product.images?.[0] && !imgError ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <FiPackage size={36} />
                    </div>
                )}
                {discount > 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        -{discount}%
                    </span>
                )}
                {product.stock_status === "out of stock" && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-red-500 text-[10px] font-semibold border border-red-400 px-2 py-0.5 rounded bg-white">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>
            <div className="p-2.5 flex flex-col flex-grow">
                <p className="text-xs text-gray-700 font-medium line-clamp-2 mb-1.5 flex-grow leading-4">
                    {product.name}
                </p>
                {price != null && (
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-[#002B45]">
                            ₹{Number(price).toLocaleString("en-IN")}
                        </span>
                        {prevPrice && (
                            <span className="text-[10px] text-gray-400 line-through">
                                ₹{Number(prevPrice).toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── Sidebar Category Item ────────────────────────────────── */
const CatSidebarItem = ({ cat, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`relative w-full flex flex-col items-center gap-1.5 py-3 px-2 border-b border-gray-100 transition-all ${isActive ? "bg-blue-50" : "bg-white hover:bg-gray-50"
            }`}
    >
        {isActive && (
            <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#002B45] rounded-r" />
        )}
        <div
            className={`w-11 h-11 rounded-full overflow-hidden flex items-center justify-center border-2 transition-colors flex-shrink-0 ${isActive ? "border-[#002B45]" : "border-gray-200"
                }`}
        >
            {cat.imgUrl ? (
                <img
                    src={cat.imgUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <HiOutlineViewGrid
                    size={18}
                    className={isActive ? "text-[#002B45]" : "text-gray-400"}
                />
            )}
        </div>
        <span
            className={`text-center leading-tight text-[10px] font-medium line-clamp-2 w-full ${isActive ? "text-[#002B45]" : "text-gray-600"
                }`}
        >
            {cat.name}
        </span>
    </button>
);

/* ═════════ */
/*  MAIN COMPONENT                                             */
/* ═════════ */
const AllCategories = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const contentRef = useRef(null);

    /* data */
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);
    const [products, setProducts] = useState([]);

    /* selection */
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);
    const [activeSubSubCategoryId, setActiveSubSubCategoryId] = useState(null);

    /* loading */
    const [loadingCats, setLoadingCats] = useState(true);
    const [loadingSubs, setLoadingSubs] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState(null);

    /* ui */
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [showSubsOnMobile, setShowSubsOnMobile] = useState(true);

    /* ── 1. Load all categories ──────────────────────────────── */
    useEffect(() => {
        const load = async () => {
            try {
                setLoadingCats(true);
                const res = await axios.get(`${API}/categories/get-all-categories`);
                const cats = Array.isArray(res.data)
                    ? res.data
                    : res.data?.categories || [];
                const sorted = [...cats].sort(
                    (a, b) => (a.sequence || 0) - (b.sequence || 0)
                );
                setCategories(sorted);

                const urlCatId = searchParams.get("category");
                const initial = urlCatId
                    ? sorted.find((c) => c._id === urlCatId)
                    : sorted[0];
                if (initial) setActiveCategory(initial);
            } catch (err) {
                setError("Failed to load categories.");
            } finally {
                setLoadingCats(false);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── 2. Load subs when category changes ──────────────────── */
    useEffect(() => {
        if (!activeCategory) return;

        const load = async () => {
            try {
                setLoadingSubs(true);
                setSubCategories([]);
                setSubSubCategories([]);
                setActiveSubCategory(null);
                setActiveSubSubCategoryId(null);
                setProducts([]);
                setSearch("");

                const [subRes, subSubRes] = await Promise.allSettled([
                    axios.get(
                        `${API}/sub-categories/get-sub-categories-by-category/${activeCategory._id}`
                    ),
                    axios.get(
                        `${API}/sub-sub-categories/category/${activeCategory._id}`
                    ),
                ]);

                const subs =
                    subRes.status === "fulfilled" && Array.isArray(subRes.value.data)
                        ? subRes.value.data
                        : [];
                const subSubs =
                    subSubRes.status === "fulfilled" &&
                        Array.isArray(subSubRes.value.data)
                        ? subSubRes.value.data
                        : [];

                setSubCategories(subs);
                setSubSubCategories(subSubs);

                // honour URL subcategory param
                const urlSubId = searchParams.get("subcategory");
                if (urlSubId) {
                    const found = subs.find((s) => s._id === urlSubId);
                    if (found) setActiveSubCategory(found);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSubs(false);
            }
        };

        load();
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("category", activeCategory._id);
            next.delete("subcategory");
            next.delete("subsubcategory");
            return next;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory?._id]);

    /* ── 3. Load products when sub / sub-sub changes ─────────── */
    useEffect(() => {
        if (!activeCategory) return;

        const load = async () => {
            try {
                setLoadingProducts(true);
                setProducts([]);

                if (activeSubSubCategoryId) {
                    const res = await axios.get(
                        `${API}/products/products-by-sub-sub-category/${activeSubSubCategoryId}`
                    );
                    setProducts(Array.isArray(res.data) ? res.data : []);
                } else if (activeSubCategory) {
                    const res = await axios.get(
                        `${API}/products/products-by-sub-category/${activeSubCategory._id}`
                    );
                    setProducts(Array.isArray(res.data) ? res.data : []);
                } else {
                    // No sub selected — load all for category (grouped endpoint)
                    const res = await axios.get(
                        `${API}/products/sub-categories-products-by-category/${activeCategory._id}`
                    );
                    const grouped = Array.isArray(res.data) ? res.data : [];
                    const all = grouped.flatMap(
                        (g) =>
                            g.subSubCategories?.flatMap((ss) => ss.products || []) || []
                    );
                    setProducts(all);
                }
            } catch (err) {
                console.warn(err.message);
                setProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSubCategory?._id, activeSubSubCategoryId]);

    /* ── Handlers ───────────────────────────────────────────── */
    const handleCategorySelect = (cat) => {
        if (activeCategory?._id === cat._id) return;
        setActiveCategory(cat);
        setMobileDrawerOpen(false);
        setShowSubsOnMobile(true);
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubCategorySelect = (sub) => {
        setActiveSubCategory(sub);
        setActiveSubSubCategoryId(null);
        setSearch("");
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("subcategory", sub._id);
            next.delete("subsubcategory");
            return next;
        });
    };

    const handleSubSubSelect = (id) => {
        setActiveSubSubCategoryId(id);
        setSearch("");
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (id) next.set("subsubcategory", id);
            else next.delete("subsubcategory");
            return next;
        });
    };

    const handleBackToSubs = () => {
        setActiveSubCategory(null);
        setActiveSubSubCategoryId(null);
        setSearch("");
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete("subcategory");
            next.delete("subsubcategory");
            return next;
        });
    };

    /* ── Derived ────────────────────────────────────────────── */
    const subSubsForActiveSub = activeSubCategory
        ? subSubCategories.filter((ss) => {
            const ref = ss.subCategory?._id || ss.subCategory;
            return ref === activeSubCategory._id;
        })
        : [];

    const filteredProducts = products.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    /* ── Error screen ───────────────────────────────────────── */
    if (error) {
        return (
            <>
                <UserNavbar />
                <div className="min-h-screen bg-[#F2F7FF] flex items-center justify-center">
                    <div className="text-center">
                        <FiAlertCircle size={40} className="text-red-400 mx-auto mb-3" />
                        <p className="text-red-600 font-semibold">{error}</p>
                    </div>
                </div>
                <AllUserFooter />
            </>
        );
    }

    /* ════════
       RENDER
    ════════ */
    return (
        <>
            <UserNavbar />

            <div className="min-h-screen bg-[#F2F7FF]">
                {/* Page header */}
                <div className="bg-white border-b border-gray-200 px-4 py-3">
                    <div className="max-w-screen-2xl mx-auto flex items-center gap-2 text-sm text-gray-500">
                        <span
                            className="cursor-pointer hover:text-[#002B45]"
                            onClick={() => navigate("/")}
                        >
                            Home
                        </span>
                        <FiChevronRight size={13} />
                        <span className="text-gray-800 font-medium">All Categories</span>
                        {activeCategory && (
                            <>
                                <FiChevronRight size={13} />
                                <span className="text-gray-800 font-medium">
                                    {activeCategory.name}
                                </span>
                            </>
                        )}
                        {activeSubCategory && (
                            <>
                                <FiChevronRight size={13} />
                                <span className="text-gray-800 font-medium">
                                    {activeSubCategory.name}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div
                    className="max-w-screen-2xl mx-auto flex"
                    style={{ minHeight: "calc(100vh - 110px)" }}
                >
                    {/* 
              LEFT SIDEBAR  (desktop)
           */}
                    <aside
                        className="hidden md:block w-24 lg:w-28 flex-shrink-0 bg-white border-r border-gray-200 no-scrollbar overflow-y-auto sticky top-0 scrollbar-thin scrollbar-thumb-gray-200"
                        style={{ height: "calc(100vh - 56px)" }}
                    >
                        {loadingCats ? (
                            <CategorySidebarSkeleton />
                        ) : (
                            categories.map((cat) => (
                                <CatSidebarItem
                                    key={cat._id}
                                    cat={cat}
                                    isActive={activeCategory?._id === cat._id}
                                    onClick={() => handleCategorySelect(cat)}
                                />
                            ))
                        )}
                    </aside>

                    {/* 
              MOBILE: floating button + drawer
           */}
                    <button
                        onClick={() => setMobileDrawerOpen(true)}
                        className="md:hidden fixed bottom-5 left-5 z-30 bg-[#002B45] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl"
                        aria-label="Open categories"
                    >
                        <HiOutlineViewGrid size={22} />
                    </button>

                    {mobileDrawerOpen && (
                        <div className="fixed inset-0 z-40 flex">
                            <div
                                className="absolute inset-0 bg-black/40"
                                onClick={() => setMobileDrawerOpen(false)}
                            />
                            <aside className="relative w-64 bg-white h-full overflow-y-auto z-50 shadow-2xl">
                                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91]">
                                    <span className="text-white font-semibold text-sm">
                                        All Categories
                                    </span>
                                    <button
                                        onClick={() => setMobileDrawerOpen(false)}
                                        className="text-white"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategorySelect(cat)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 text-left transition-colors ${activeCategory?._id === cat._id
                                            ? "bg-blue-50 text-[#002B45] font-semibold"
                                            : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {cat.imgUrl ? (
                                            <img
                                                src={cat.imgUrl}
                                                alt={cat.name}
                                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <HiOutlineViewGrid size={16} className="text-gray-400 flex-shrink-0" />
                                        )}
                                        <span className="text-sm">{cat.name}</span>
                                        {activeCategory?._id === cat._id && (
                                            <FiChevronRight size={14} className="ml-auto text-[#002B45]" />
                                        )}
                                    </button>
                                ))}
                            </aside>
                        </div>
                    )}

                    {/* 
              MAIN CONTENT PANEL
           */}
                    <main
                        ref={contentRef}
                        className="flex-1 min-w-0 overflow-y-auto px-3 md:px-5 py-4"
                        style={{ maxHeight: "calc(100vh - 56px)" }}
                    >
                        {/* ── Category title + subcategory count (Moglix style) ── */}
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <h2 className="text-base md:text-lg font-bold text-gray-800">
                                {activeCategory?.name}
                                {subCategories.length > 0 && (
                                    <span className="ml-1.5 text-sm text-gray-400 font-normal">
                                        ({subCategories.length})
                                    </span>
                                )}
                            </h2>
                            {/* Mobile toggle for sub-category grid */}
                            <button
                                className="md:hidden flex items-center gap-1 text-xs font-medium text-[#002B45]"
                                onClick={() => setShowSubsOnMobile((v) => !v)}
                            >
                                Sub-categories
                                {showSubsOnMobile ? (
                                    <FiChevronUp size={14} />
                                ) : (
                                    <FiChevronDown size={14} />
                                )}
                            </button>
                        </div>

                        {/* ── Sub-category image grid ── */}
                        <div className={`mb-6 ${showSubsOnMobile ? "block" : "hidden md:block"}`}>
                            {loadingSubs ? (
                                <SubCategoryGridSkeleton />
                            ) : subCategories.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-8">
                                    No sub-categories found.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex items-center flex-row no-scrollbar gap-3 md:gap-4">
                                    {subCategories.map((sub) => (
                                        <div
                                            key={sub._id}
                                            onClick={() => handleSubCategorySelect(sub)}
                                            className={`group bg-white rounded-lg overflow-hidden border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${activeSubCategory?._id === sub._id
                                                ? "border-[#002B45] shadow-md ring-1 ring-[#002B45]/20"
                                                : "border-gray-100"
                                                }`}
                                        >
                                            <div className="relative aspect-square size-[4rem] bg-gray-50 overflow-hidden">
                                                {sub.imgUrl ? (
                                                    <img
                                                        src={sub.imgUrl}
                                                        alt={sub.name}
                                                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                        <FiGrid size={30} />
                                                    </div>
                                                )}
                                                {/* product count overlay — bottom of image */}
                                                {(sub.productCount || sub.count) && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                                                        <span className="text-white text-[10px] font-medium flex items-center gap-0.5">
                                                            <FiPackage size={9} />
                                                            {sub.productCount || sub.count}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-2 pt-1.5 pb-2 text-center">
                                                <p className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-4">
                                                    {sub.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Products panel (only when a sub-category is selected) ── */}
                        {activeSubCategory && (
                            <div>
                                {/* Sub-category header + back */}
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <button
                                        onClick={handleBackToSubs}
                                        className="flex items-center gap-1 text-sm text-[#002B45] hover:underline font-medium"
                                    >
                                        ← Back
                                    </button>
                                    <span className="text-gray-300">/</span>
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        {activeSubCategory.name}
                                    </h3>
                                    {!loadingProducts && (
                                        <span className="ml-auto text-xs text-gray-400">
                                            {filteredProducts.length} products
                                        </span>
                                    )}
                                </div>

                                {/* Sub-sub-category pills */}
                                <SubSubCategoryPills
                                    items={subSubsForActiveSub}
                                    activeId={activeSubSubCategoryId}
                                    onSelect={handleSubSubSelect}
                                />

                                {/* Toolbar: search + view toggle */}
                                <div className="flex items-center gap-2 mb-4 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                                    <FiSearch size={14} className="text-gray-400 flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search products…"
                                        className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch("")}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <FiX size={13} />
                                        </button>
                                    )}
                                    <div className="h-4 w-px bg-gray-200 mx-1" />
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        title="Grid view"
                                        className={`p-1 rounded transition-colors ${viewMode === "grid"
                                            ? "text-[#002B45] bg-blue-50"
                                            : "text-gray-400 hover:text-gray-600"
                                            }`}
                                    >
                                        <FiGrid size={15} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        title="List view"
                                        className={`p-1 rounded transition-colors ${viewMode === "list"
                                            ? "text-[#002B45] bg-blue-50"
                                            : "text-gray-400 hover:text-gray-600"
                                            }`}
                                    >
                                        <FiList size={15} />
                                    </button>
                                </div>

                                {/* Products */}
                                {loadingProducts ? (
                                    viewMode === "grid" ? (
                                        <ProductGridSkeleton />
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {Array.from({ length: 6 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="animate-pulse bg-white rounded-lg border border-gray-100 p-3 flex gap-3"
                                                >
                                                    <div className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0" />
                                                    <div className="flex-1 space-y-2 py-1">
                                                        <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                                                        <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                                                    </div>
                                                    <div className="h-4 bg-gray-300 rounded w-16 self-center" />
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ) : filteredProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                        <FiPackage size={44} className="mb-3 opacity-30" />
                                        <p className="text-sm font-medium">No products found</p>
                                        {search && (
                                            <button
                                                onClick={() => setSearch("")}
                                                className="mt-2 text-xs text-[#002B45] underline"
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </div>
                                ) : viewMode === "grid" ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                        {filteredProducts.map((p) => (
                                            <ProductCard key={p._id} product={p} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {filteredProducts.map((p) => (
                                            <div
                                                key={p._id}
                                                onClick={() => navigate(`/product/${p._id}`)}
                                                className="bg-white rounded-lg border border-gray-100 p-3 flex gap-3 items-center hover:shadow-sm cursor-pointer transition-shadow"
                                            >
                                                <div className="w-16 h-16 bg-gray-50 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                                                    {p.images?.[0] ? (
                                                        <img
                                                            src={p.images[0]}
                                                            alt={p.name}
                                                            className="w-full h-full object-contain p-1"
                                                        />
                                                    ) : (
                                                        <FiPackage size={18} className="text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-5">
                                                        {p.name}
                                                    </p>
                                                    {p.brand && (
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {p.brand}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    {p.price != null && (
                                                        <p className="text-sm font-bold text-[#002B45]">
                                                            ₹{Number(p.price).toLocaleString("en-IN")}
                                                        </p>
                                                    )}
                                                    {p.stock_status === "out of stock" && (
                                                        <span className="text-[10px] text-red-500">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No sub-category selected & no subs loading → show empty hint */}
                        {!activeSubCategory && !loadingSubs && subCategories.length > 0 && (
                            <p className="text-center text-xs text-gray-400 mt-2">
                                Select a sub-category above to browse products
                            </p>
                        )}
                    </main>
                </div>
            </div>

            <AllUserFooter />
        </>
    );
};

export default AllCategories;