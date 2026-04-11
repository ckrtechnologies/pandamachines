import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
    FiAlertCircle,
    FiChevronRight,
    FiGrid,
    FiList,
    FiPackage,
    FiSearch,
    FiX,
} from "react-icons/fi";
import { HiOutlineViewGrid } from "react-icons/hi";
import UserNavbar from "../../../components/common/UserNavbar";
import AllUserFooter from "../../../components/common/AllUserFooter";
import ProductCardOptimized, {
    ProductCardSkeleton,
} from "../../../components/Products/ProductCardOptimized";

const API = process.env.REACT_APP_API_URL;

/* ─────────────────────────────────────────────────────────── */
/* Skeleton: left sidebar                                       */
/* ─────────────────────────────────────────────────────────── */
const CategorySidebarSkeleton = () => (
    <div className="animate-pulse">
        {Array.from({ length: 10 }).map((_, i) => (
            <div
                key={i}
                className="flex flex-col items-center gap-2 p-3 border-b border-gray-100"
            >
                <div className="w-11 h-11 rounded-full bg-gray-200" />
                <div className="h-2 w-14 bg-gray-200 rounded" />
                <div className="h-2 w-9 bg-gray-200 rounded" />
            </div>
        ))}
    </div>
);

/* ─────────────────────────────────────────────────────────── */
/* Skeleton: horizontal sub-category strip                      */
/* ─────────────────────────────────────────────────────────── */
const SubCategoryStripSkeleton = () => (
    <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar border-b border-gray-100 bg-white">
        {Array.from({ length: 9 }).map((_, i) => (
            <div
                key={i}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 animate-pulse"
            >
                <div className="w-16 h-16 rounded-xl bg-gray-200" />
                <div className="h-2 w-14 bg-gray-200 rounded" />
                <div className="h-2 w-10 bg-gray-200 rounded" />
            </div>
        ))}
    </div>
);

/* ─────────────────────────────────────────────────────────── */
/* Skeleton: sub-sub-category chips                             */
/* ─────────────────────────────────────────────────────────── */
const SubSubChipsSkeleton = () => (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 animate-pulse">
        {Array.from({ length: 7 }).map((_, i) => (
            <div
                key={i}
                className="h-7 rounded-full bg-gray-200 flex-shrink-0"
                style={{ width: `${60 + (i % 3) * 22}px` }}
            />
        ))}
    </div>
);

/* ─────────────────────────────────────────────────────────── */
/* Left sidebar category item                                   */
/* ─────────────────────────────────────────────────────────── */
const CatSidebarItem = ({ cat, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`relative w-full flex flex-col items-center gap-1.5 py-3 px-2 border-b border-gray-100 transition-all duration-150 ${isActive ? "bg-blue-50" : "bg-white hover:bg-gray-50"
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
                    loading="lazy"
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


const SubCategoryChip = ({ sub, isActive, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-1 flex-shrink-0 group w-20"
    >
        {/* image box */}
        <div
            className={`relative w-16 h-16  rounded-md overflow-hidden flex items-center justify-center border bg-white transition-all duration-150 ${isActive
                ? "border-[#002B45] shadow-sm ring-1 ring-[#002B45]/20"
                : "border-gray-200 group-hover:border-gray-300"
                }`}
        >
            {sub.imgUrl ? (
                <img
                    src={sub.imgUrl}
                    alt={sub.name}
                    className="w-full h-full object-cover "
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <FiPackage
                        size={18}
                        className={isActive ? "text-[#002B45]" : "text-gray-400"}
                    />
                </div>
            )}

            {sub.productCount != null && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[8px]  text-center py-[2px] backdrop-blur-sm">
                    {sub.productCount}
                </div>
            )}
        </div>

        {/* name */}
        <span
            className={`text-[10px]  text-center leading-tight line-clamp-2 w-full ${isActive ? "text-[#002B45]" : "text-gray-600"
                }`}
        >
            {sub.name}
        </span>
    </button>
);


const SubSubCategoryChips = ({ items, activeId, onSelect }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
                onClick={() => onSelect(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0 transition-all duration-150 ${!activeId
                    ? "bg-[#002B45] text-white border-[#002B45] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#002B45] hover:text-[#002B45]"
                    }`}
            >
                All
            </button>
            {items.map((ss) => (
                <button
                    key={ss._id}
                    onClick={() => onSelect(ss._id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0 transition-all duration-150 ${activeId === ss._id
                        ? "bg-[#002B45] text-white border-[#002B45] shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#002B45] hover:text-[#002B45]"
                        }`}
                >
                    {ss.name}
                    {ss.productCount != null && (
                        <span
                            className={`ml-1.5 text-[10px] ${activeId === ss._id ? "text-white/70" : "text-gray-400"
                                }`}
                        >
                            {ss.productCount}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

/* ─────────────────────────────────────────────────────────── */
/* List view product row + skeleton                             */
/* ─────────────────────────────────────────────────────────── */
const ListProductRow = ({ product, onClick }) => {
    const getPrice = () => {
        if (product.hasVariants && product.variants?.length > 0) {
            const def =
                product.variants.find((v) => v.isDefault) || product.variants[0];
            return def?.price;
        }
        return product.price;
    };

    const price = getPrice();
    const prevPrice = !product.hasVariants ? product.previous_price : null;
    const discount =
        prevPrice && price
            ? Math.round(((prevPrice - price) / prevPrice) * 100)
            : null;

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg border border-gray-100 p-3 flex gap-3 items-center hover:shadow-sm cursor-pointer transition-shadow"
        >
            <div className="w-16 h-16 bg-gray-50 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                {product.images?.[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-1"
                        loading="lazy"
                    />
                ) : (
                    <FiPackage size={18} className="text-gray-300" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-5">
                    {product.name}
                </p>
                {product.brand && (
                    <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>
                )}
            </div>
            <div className="text-right flex-shrink-0">
                {price != null && (
                    <p className="text-sm font-bold text-[#002B45]">
                        ₹{Number(price).toLocaleString("en-IN")}
                    </p>
                )}
                {prevPrice && discount > 0 && (
                    <p className="text-[10px] text-gray-400 line-through">
                        ₹{Number(prevPrice).toLocaleString("en-IN")}
                    </p>
                )}
                {product.stock_status === "out of stock" && (
                    <span className="text-[10px] text-red-500">Out of Stock</span>
                )}
            </div>
        </div>
    );
};

const ListProductRowSkeleton = () => (
    <div className="animate-pulse bg-white rounded-lg border border-gray-100 p-3 flex gap-3 items-center">
        <div className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-2.5 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-4 bg-gray-300 rounded w-16" />
    </div>
);

/* ─────────────────────────────────────────────────────────── */
/* Main component                                               */
/* ─────────────────────────────────────────────────────────── */
const AllCategories = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    /* categories — left sidebar, paginated infinite scroll */
    const [categories, setCategories] = useState([]);
    const [catPage, setCatPage] = useState(1);
    const [catHasMore, setCatHasMore] = useState(true);
    const [loadingCats, setLoadingCats] = useState(false);
    const catRef = useRef(null);

    /* sub-categories — horizontal strip, paginated infinite scroll */
    const [subCategories, setSubCategories] = useState([]);
    const [subPage, setSubPage] = useState(1);
    const [subHasMore, setSubHasMore] = useState(true);
    const [loadingSubs, setLoadingSubs] = useState(false);
    const subLoadingRef = useRef(false);
    const subHasMoreRef = useRef(true);
    const subStripRef = useRef(null);

    /* sub-sub-categories — chips */
    const [subSubCategories, setSubSubCategories] = useState([]);
    const [loadingSubSubs, setLoadingSubSubs] = useState(false);

    /* products — paginated infinite scroll */
    const [products, setProducts] = useState([]);
    const [prodHasMore, setProdHasMore] = useState(true);
    const [loadingProds, setLoadingProds] = useState(false);
    const prodPageRef = useRef(1);
    const prodHasMoreRef = useRef(true);
    const prodLoadingRef = useRef(false);

    /* selection */
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);
    const [activeSubSubCategoryId, setActiveSubSubCategoryId] = useState(null);

    /* ui */
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");
    const [error, setError] = useState(null);

    const mainRef = useRef(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    /* ── Load categories ────────────────────────────────────── */
    const loadCategories = useCallback(async () => {
        if (loadingCats || !catHasMore) return;
        try {
            setLoadingCats(true);
            const res = await axios.get(`${API}/navigation/categories`, {
                params: { page: catPage, limit: 15 },
            });
            const data = res.data;
            setCategories((prev) => {
                const map = new Map();
                [...prev, ...data.categories].forEach((c) => map.set(c._id, c));
                return Array.from(map.values());
            });
            setCatHasMore(data.hasMore);
            setCatPage((p) => p + 1);
        } catch (err) {
            console.error("Category load error:", err);
            setError("Failed to load categories.");
        } finally {
            setLoadingCats(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catPage, catHasMore, loadingCats]);

    useEffect(() => {
        loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* set active category from URL or first */
    useEffect(() => {
        if (!categories.length || activeCategory) return;
        const urlCatId = searchParams.get("category");
        const initial = urlCatId
            ? categories.find((c) => c._id === urlCatId)
            : null;
        setActiveCategory(initial || categories[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories]);

    const handleCatScroll = () => {
        const el = catRef.current;
        if (!el) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
            loadCategories();
        }
    };

    /* ── Load sub-categories ────────────────────────────────── */
    const loadSubCategories = useCallback(
        async (catId, reset = false) => {
            if (subLoadingRef.current || (!subHasMoreRef.current && !reset)) return;
            try {
                subLoadingRef.current = true;
                setLoadingSubs(true);
                const pageToUse = reset ? 1 : subPage;
                const res = await axios.get(`${API}/navigation/subcategories`, {
                    params: { categoryId: catId, page: pageToUse, limit: 20 },
                });
                const data = res.data;
                setSubCategories((prev) => {
                    const merged = reset
                        ? data.subCategories
                        : [...prev, ...data.subCategories];
                    const map = new Map();
                    merged.forEach((s) => map.set(s._id, s));
                    return Array.from(map.values());
                });
                subHasMoreRef.current = data.hasMore;
                setSubHasMore(data.hasMore);
                if (reset) setSubPage(2);
                else setSubPage((p) => p + 1);
            } catch (err) {
                console.error("SubCategory load error:", err);
            } finally {
                subLoadingRef.current = false;
                setLoadingSubs(false);
            }
        },
        [subPage]
    );

    /* ── Load sub-sub-categories for a given sub-category ────── */
    const loadSubSubCategories = useCallback(async (subCatId) => {
        try {
            setLoadingSubSubs(true);
            /* fetch all sub-sub-cats for the parent category, filter by sub */
            const res = await axios.get(
                `${API}/sub-sub-categories/category/${activeCategory?._id || ""}`
            );
            const data = Array.isArray(res.data) ? res.data : [];
            const filtered = data.filter((ss) => {
                const ref = ss.subCategory?._id || ss.subCategory;
                return ref === subCatId;
            });
            setSubSubCategories(filtered);
        } catch (err) {
            console.error("SubSubCategory load error:", err);
            setSubSubCategories([]);
        } finally {
            setLoadingSubSubs(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory?._id]);

    /* ── Load products ──────────────────────────────────────── */
    const loadProducts = useCallback(async () => {
        if (prodLoadingRef.current || !prodHasMoreRef.current) return;
        if (!activeSubCategory) return;
        try {
            prodLoadingRef.current = true;
            setLoadingProds(true);
            const res = await axios.get(`${API}/catalog/products`, {
                params: {
                    category: activeCategory?._id,
                    subCategory: activeSubCategory._id,
                    subSubCategory: activeSubSubCategoryId || undefined,
                    page: prodPageRef.current,
                    limit: 20,
                    search: debouncedSearch || undefined,
                    sort,
                },
            });
            const data = res.data;
            setProducts((prev) => [...prev, ...data.products]);
            const totalPages = data.pagination.totalPages;
            if (prodPageRef.current >= totalPages) {
                prodHasMoreRef.current = false;
                setProdHasMore(false);
            } else {
                prodPageRef.current += 1;
            }
        } catch (err) {
            console.error("Products fetch error:", err);
        } finally {
            prodLoadingRef.current = false;
            setLoadingProds(false);
        }
    }, [activeCategory, activeSubCategory, activeSubSubCategoryId, debouncedSearch, sort]);

    /* reset products when filters change */
    useEffect(() => {
        if (!activeSubCategory) return;
        setProducts([]);
        prodPageRef.current = 1;
        prodHasMoreRef.current = true;
        setProdHasMore(true);
    }, [activeSubCategory, activeSubSubCategoryId, debouncedSearch, sort]);

    useEffect(() => {
        if (!activeSubCategory) return;
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSubCategory, activeSubSubCategoryId, debouncedSearch, sort]);

    /* ── When active category changes ───────────────────────── */
    useEffect(() => {
        if (!activeCategory) return;
        setSubCategories([]);
        setSubPage(1);
        subHasMoreRef.current = true;
        setSubHasMore(true);
        setActiveSubCategory(null);
        setActiveSubSubCategoryId(null);
        setSubSubCategories([]);
        setProducts([]);
        setSearch("");

        loadSubCategories(activeCategory._id, true);

        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("category", activeCategory._id);
            next.delete("subcategory");
            next.delete("subsubcategory");
            return next;
        });

        mainRef.current?.scrollTo({ top: 0 });
        subStripRef.current?.scrollTo({ left: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory?._id]);

    /* auto-select first sub-category when list arrives */
    useEffect(() => {
        if (!subCategories.length || activeSubCategory) return;
        const urlSubId = searchParams.get("subcategory");
        const initial = urlSubId
            ? subCategories.find((s) => s._id === urlSubId)
            : null;
        const target = initial || subCategories[0];
        handleSubCategorySelect(target);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subCategories]);

    /* strip horizontal scroll — load more subs */
    const handleSubStripScroll = () => {
        const el = subStripRef.current;
        if (!el) return;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 80) {
            if (activeCategory && !subLoadingRef.current && subHasMoreRef.current) {
                loadSubCategories(activeCategory._id);
            }
        }
    };

    /* main panel scroll — load more products */
    const handleMainScroll = () => {
        const el = mainRef.current;
        if (!el) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) {
            loadProducts();
        }
    };

    /* ── Handlers ───────────────────────────────────────────── */
    const handleCategorySelect = (cat) => {
        if (activeCategory?._id === cat._id) return;
        setActiveCategory(cat);
    };

    const handleSubCategorySelect = (sub) => {
        setActiveSubCategory(sub);
        setActiveSubSubCategoryId(null);
        setSubSubCategories([]);
        setSearch("");
        loadSubSubCategories(sub._id);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("subcategory", sub._id);
            next.delete("subsubcategory");
            return next;
        });
        mainRef.current?.scrollTo({ top: 0 });
    };

    const handleSubSubSelect = (id) => {
        setActiveSubSubCategoryId(id);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (id) next.set("subsubcategory", id);
            else next.delete("subsubcategory");
            return next;
        });
        mainRef.current?.scrollTo({ top: 0 });
    };

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

    /* ── Render ─────────────────────────────────────────────── */
    return (
        <>
            <UserNavbar />

            <div className="bg-[#F2F7FF]" style={{ minHeight: "calc(100vh - 56px)" }}>
                <div
                    className="max-w-screen-2xl mx-auto flex"
                    style={{ height: "calc(100vh - 96px)" }}
                >
                    {/* ── Left sidebar ─────────────────────────────── */}
                    <aside
                        ref={catRef}
                        onScroll={handleCatScroll}
                        className="w-24 lg:w-28 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto no-scrollbar"
                    >
                        {loadingCats && categories.length === 0 ? (
                            <CategorySidebarSkeleton />
                        ) : (
                            <>
                                {categories.map((cat) => (
                                    <CatSidebarItem
                                        key={cat._id}
                                        cat={cat}
                                        isActive={activeCategory?._id === cat._id}
                                        onClick={() => handleCategorySelect(cat)}
                                    />
                                ))}
                                {loadingCats && (
                                    <div className="py-3 flex justify-center">
                                        <div className="w-4 h-4 border-2 border-[#002B45] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </>
                        )}
                    </aside>

                    {/* ── Right panel ──────────────────────────────── */}
                    <div className="flex-1 relative min-w-0 flex flex-col overflow-hidden">

                        <div className="sticky top-0 bg-orangeAccent/5 backdrop-blur-md border-b border-orangeAccent/20 px-4 lg:px-6 py-1.5  z-20">
                            <div className="max-w-screen-2xl mx-auto flex items-center gap-1 text-[0.66rem] text-gray-500 whitespace-nowrap overflow-hidden">

                                <span
                                    className="cursor-pointer hover:text-[#002B45] transition-colors shrink-0"
                                    onClick={() => navigate("/")}
                                >
                                    Home
                                </span>

                                <FiChevronRight size={10} className="shrink-0" />

                                <span className="text-gray-600 shrink-0">All Categories</span>

                                {activeCategory && (
                                    <>
                                        <FiChevronRight size={10} className="shrink-0" />
                                        <span className="text-gray-700 ">
                                            {activeCategory.name}
                                        </span>
                                    </>
                                )}

                                {activeSubCategory && (
                                    <>
                                        <FiChevronRight size={10} className="shrink-0" />
                                        <span className="text-gray-800 font-medium text-xs ">
                                            {activeSubCategory.name}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* horizontal sub-category strip */}
                        <div className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm">
                            {loadingSubs && subCategories.length === 0 ? (
                                <SubCategoryStripSkeleton />
                            ) : (
                                <div
                                    ref={subStripRef}
                                    onScroll={handleSubStripScroll}
                                    className="flex gap-3 px-3 py-2 overflow-x-auto no-scrollbar"
                                >
                                    {subCategories.map((sub) => (
                                        <SubCategoryChip
                                            key={sub._id}
                                            sub={sub}
                                            isActive={activeSubCategory?._id === sub._id}
                                            onClick={() => handleSubCategorySelect(sub)}
                                        />
                                    ))}
                                    {/* spinner at end of strip when loading more */}
                                    {loadingSubs && subCategories.length > 0 && (
                                        <div className="flex items-center justify-center w-10 flex-shrink-0">
                                            <div className="w-4 h-4 border-2 border-[#002B45] border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* scrollable main content */}
                        <div
                            ref={mainRef}
                            onScroll={handleMainScroll}
                            className="flex-1"
                        >


                            <div className="px-4 py-3 flex-1  overflow-y-auto">
                                {/* sub-sub-category chips */}
                                {activeSubCategory && (
                                    <div className="mb-3">
                                        {loadingSubSubs ? (
                                            <SubSubChipsSkeleton />
                                        ) : (
                                            <SubSubCategoryChips
                                                items={subSubCategories}
                                                activeId={activeSubSubCategoryId}
                                                onSelect={handleSubSubSelect}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* toolbar */}
                                {activeSubCategory && (
                                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                                        <div className="flex flex-1 items-center gap-2">
                                            {/* SEARCH */}
                                            <div className={`relative max-w-96 ${activeSubSubCategoryId ? "flex-1 min-w-[120px]" : "flex-1 min-w-[160px] "}`}>
                                                <FiSearch
                                                    size={12}
                                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                                                />
                                                <input
                                                    type="text"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    placeholder="Search"
                                                    className="w-full pl-7 pr-6 py-1.5 rounded-md border border-gray-200 text-[11px] outline-none bg-white focus:border-[#002B45] transition-all shadow-sm placeholder:text-gray-400"
                                                />
                                                {search && (
                                                    <button
                                                        onClick={() => setSearch("")}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FiX size={11} />
                                                    </button>
                                                )}
                                            </div>
                                            {/* right: active sub-sub-category */}
                                            {activeSubSubCategoryId && (
                                                <div className="px-2.5 py-1 rounded-md bg-[#002B45]/5 text-[#002B45] text-[11px] font-medium border border-[#002B45]/20">
                                                    {
                                                        subSubCategories.find(ss => ss._id === activeSubSubCategoryId)?.name
                                                    }
                                                </div>
                                            )}


                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* SORT */}
                                            <div className="flex gap-1.5 flex-shrink-0">
                                                {[
                                                    { value: "newest", label: "Newest" },
                                                    { value: "price_asc", label: "Price: Low → High" },
                                                    { value: "price_desc", label: "Price: High → Low" },
                                                ]?.map((s) => (
                                                    <button
                                                        key={s.value}
                                                        onClick={() => setSort(s.value)}
                                                        className={`px-2.5 py-1.5 text-[11px] font-medium rounded-md border transition-all ${sort === s.value
                                                            ? "bg-[#002B45] border-[#002B45] text-white shadow-sm"
                                                            : "bg-white border-gray-200 text-gray-600 hover:border-[#002B45] hover:text-[#002B45]"
                                                            }`}
                                                    >
                                                        {s.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* VIEW TOGGLE */}
                                            <div className="flex border border-gray-200 rounded-md overflow-hidden bg-white flex-shrink-0 shadow-sm">
                                                <button
                                                    onClick={() => setViewMode("grid")}
                                                    className={`px-2 py-1.5 flex items-center gap-1 text-[11px] ${viewMode === "grid"
                                                        ? "text-[#002B45] bg-blue-50"
                                                        : "text-gray-500 hover:text-gray-700"
                                                        }`}
                                                >
                                                    <FiGrid size={13} />
                                                    Grid
                                                </button>
                                                <button
                                                    onClick={() => setViewMode("list")}
                                                    className={`px-2 py-1.5 flex items-center gap-1 text-[11px] ${viewMode === "list"
                                                        ? "text-[#002B45] bg-blue-50"
                                                        : "text-gray-500 hover:text-gray-700"
                                                        }`}
                                                >
                                                    <FiList size={13} />
                                                    List
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {/* grid view */}
                                {activeSubCategory && viewMode === "grid" && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                        {products.map((p) => (
                                            <ProductCardOptimized
                                                key={p._id}
                                                product={p}
                                                fullWidth
                                                onAddToCart={(product) =>
                                                    console.log("Add to cart", product)
                                                }
                                                onBuyNow={(product) =>
                                                    navigate(`/checkout?productId=${product._id}`)
                                                }
                                            />
                                        ))}

                                        {loadingProds &&
                                            products.length === 0 &&
                                            Array.from({ length: 10 }).map((_, i) => (
                                                <ProductCardSkeleton key={i} />
                                            ))}

                                        {loadingProds &&
                                            products.length > 0 &&
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <ProductCardSkeleton key={`more-${i}`} />
                                            ))}
                                    </div>
                                )}

                                {/* list view */}
                                {activeSubCategory && viewMode === "list" && (
                                    <div className="flex flex-col gap-2">
                                        {products.map((p) => (
                                            <ListProductRow
                                                key={p._id}
                                                product={p}
                                                onClick={() =>
                                                    navigate(`/user-product-details/${p._id}`)
                                                }
                                            />
                                        ))}

                                        {loadingProds &&
                                            products.length === 0 &&
                                            Array.from({ length: 8 }).map((_, i) => (
                                                <ListProductRowSkeleton key={i} />
                                            ))}

                                        {loadingProds && products.length > 0 && (
                                            <p className="text-center text-xs text-gray-400 py-3">
                                                Loading more...
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* end of products */}
                                {activeSubCategory &&
                                    !prodHasMore &&
                                    products.length > 0 && (
                                        <p className="text-center text-xs text-gray-400 py-6">
                                            No more products
                                        </p>
                                    )}

                                {/* empty state */}
                                {activeSubCategory &&
                                    !loadingProds &&
                                    products.length === 0 && (
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
                                    )}

                                {/* hint when nothing selected yet */}
                                {!activeSubCategory && !loadingSubs && (
                                    <p className="text-center text-xs text-gray-400 mt-8">
                                        Select a sub-category above to browse products
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <AllUserFooter />
        </>
    );
};

export default AllCategories;