import axios from "axios";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    FiAlertCircle,
    FiChevronRight,
    FiPackage,
    FiSearch,
    FiX
} from "react-icons/fi";
import { HiOutlineViewGrid } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";
import AllUserFooter from "../../../components/common/AllUserFooter";
import UserNavbar from "../../../components/common/UserNavbar";
import ProductCardOptimized, {
    ProductCardSkeleton,
} from "../../../components/Products/ProductCardOptimized";

const API = process.env.REACT_APP_API_URL;

// Main component  
const AllCategories = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const urlCategory = searchParams.get("category");
    const urlSubCategory = searchParams.get("subcategory");
    const urlSubSubCategory = searchParams.get("subsubcategory");

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

    const [feedSections, setFeedSections] = useState([]);
    const [loadingFeed, setLoadingFeed] = useState(false);

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
    const [error, setError] = useState(null);

    const mainRef = useRef(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    const loadSubCategoryFeed = useCallback(async (subCatId) => {
        try {
            setLoadingFeed(true);
            const res = await axios.get(`${API}/catalog/subcategory/${subCatId}`, {
                params: {
                    limit: 12
                }
            });
            setFeedSections(res.data.sections || []);
        } catch (err) {
            console.error("Feed load error:", err);
            setFeedSections([]);
        } finally {
            setLoadingFeed(false);
        }
    }, []);

    /*  Load categories  */
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
        if (!categories.length) return;

        if (!activeCategory) {
            const found = categories.find(c => c._id === urlCategory);

            if (found) {
                setActiveCategory(found);
            } else if (!urlCategory) {
                setActiveCategory(categories[0]);
            } else if (catHasMore) {
                loadCategories(); // keep fetching until found
            }
        }
    }, [categories, urlCategory]);

    const handleCatScroll = () => {
        const el = catRef.current;
        if (!el) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
            loadCategories();
        }
    };

    /*  Load sub-categories  */
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

    /*  Load sub-sub-categories for a given sub-category  */
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

    /*  Load products  */
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

    /*  When active category changes ─ */
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
            if (!urlCategory || urlCategory !== activeCategory._id) {
                next.set("category", activeCategory._id);
            }
            next.delete("categoryId");
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
        if (!subCategories.length) return;

        if (!activeSubCategory) {
            const found = subCategories.find(s => s._id === urlSubCategory);

            if (found) {
                handleSubCategorySelect(found);
            } else if (!urlSubCategory) {
                handleSubCategorySelect(subCategories[0]);
            } else if (subHasMoreRef.current) {
                loadSubCategories(activeCategory._id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subCategories, urlSubCategory]);

    useEffect(() => {
        if (!subSubCategories.length) return;

        if (urlSubSubCategory) {
            const found = subSubCategories.find(ss => ss._id === urlSubSubCategory);
            if (found) {
                setActiveSubSubCategoryId(found._id);
            }
        }
    }, [subSubCategories, urlSubSubCategory]);

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

    /*  Handlers  */
    const handleCategorySelect = (cat) => {
        if (activeCategory?._id === cat._id) return;
        setActiveCategory(cat);
    };

    const handleSubCategorySelect = (sub) => {
        setActiveSubCategory(sub);
        setActiveSubSubCategoryId(null);
        setSubSubCategories([]);
        setSearch("");
        setFeedSections([]);          // ← reset feed
        loadSubCategoryFeed(sub._id); // ← fetch feed
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

    /*  Error screen  */
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

    /*  Render  */
    return (
        <>
            <UserNavbar />

            <div className="bg-[#F2F7FF]" style={{ minHeight: "calc(100vh - 56px)" }}>
                <div
                    className="max-w-screen-2xl mx-auto flex"
                    style={{ height: "calc(100vh - 96px)" }}
                >
                    {/*  Left sidebar ─ */}
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

                    {/*  Right panel  */}
                    <div className="flex-1 relative min-w-0 flex flex-col overflow-hidden">
                        <div className="sticky top-0 bg-orangeAccent/5 backdrop-blur-md border-b border-orangeAccent/20 px-4 lg:px-6 py-1.5  z-20">
                            {loadingCats && !activeCategory ? (
                                <BreadcrumbSkeleton />
                            ) :
                                (<div className="max-w-screen-2xl mx-auto flex items-center gap-1 text-[0.66rem] text-gray-500 whitespace-nowrap overflow-hidden">

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
                                </div>)
                            }
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
                        <div className="flex-1 overflow-hidden">
                            <div
                                ref={mainRef}
                                onScroll={handleMainScroll}
                                className="px-4 py-3 h-full overflow-y-auto no-scrollbar">

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
                                {activeSubCategory && (<div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
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
                                            <div className="px-2.5 py-1 flex items-center gap-2 rounded-md bg-[#002B45]/5 text-[#002B45] text-[11px] font-medium border border-[#002B45]/20">
                                                {
                                                    subSubCategories.find(ss => ss._id === activeSubSubCategoryId)?.name
                                                }
                                                <X onClick={() => { setActiveSubSubCategoryId(null) }} className="size-4 cursor-pointer text-primaryBtnColor hover:text-primaryBtnHoverColor" />
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


                                    </div>
                                </div>
                                )
                                }
                                {/* grid view */}
                                {activeSubCategory && (
                                    <div className="space-y-6">
                                        {activeSubSubCategoryId ? (
                                            /* ── Filtered by chip: flat paginated grid ── */
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                                {products.map((p) => (
                                                    <ProductCardOptimized
                                                        key={p._id} product={p} fullWidth
                                                        onAddToCart={(product) => console.log("Add to cart", product)}
                                                    />
                                                ))}
                                                {loadingProds && products.length === 0 &&
                                                    Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton fullWidth key={i} />)}
                                                {loadingProds && products.length > 0 &&
                                                    Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton fullWidth key={`more-${i}`} />)}
                                            </div>
                                        ) : loadingFeed ? (
                                            /* ── Feed loading skeleton ── */
                                            <div className="space-y-6">
                                                {Array.from({ length: 3 }).map((_, i) => (
                                                    <div key={i} className="rounded-xl border border-gray-200 p-4 animate-pulse">

                                                        {/* header */}
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="h-3 w-32 bg-gray-200 rounded" />
                                                            <div className="h-3 w-16 bg-gray-200 rounded-full" />
                                                            <div className="ml-auto h-3 w-20 bg-gray-200 rounded" />
                                                        </div>

                                                        {/* grid */}
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                                            {Array.from({ length: 6 }).map((_, j) => (
                                                                <ProductCardSkeleton fullWidth key={j} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            /* ── Sectioned feed view ── */
                                            <>
                                                {feedSections.map((section, idx) => {
                                                    const sectionColors = [
                                                        { bg: "bg-blue-50", border: "border-blue-200", heading: "text-blue-800", badge: "bg-blue-100 text-blue-700" },
                                                        { bg: "bg-purple-50", border: "border-purple-200", heading: "text-purple-800", badge: "bg-purple-100 text-purple-700" },
                                                        { bg: "bg-emerald-50", border: "border-emerald-200", heading: "text-emerald-800", badge: "bg-emerald-100 text-emerald-700" },
                                                        { bg: "bg-orange-50", border: "border-orange-200", heading: "text-orange-800", badge: "bg-orange-100 text-orange-700" },
                                                        { bg: "bg-rose-50", border: "border-rose-200", heading: "text-rose-800", badge: "bg-rose-100 text-rose-700" },
                                                        { bg: "bg-cyan-50", border: "border-cyan-200", heading: "text-cyan-800", badge: "bg-cyan-100 text-cyan-700" },
                                                    ];
                                                    const color = sectionColors[idx % sectionColors.length];

                                                    return (
                                                        <div key={section._id} className={`rounded-xl border ${color.bg} ${color.border} p-4`}>
                                                            {/* Section header */}
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <h3 className={`text-sm font-semibold ${color.heading}`}>
                                                                    {section.name}
                                                                </h3>
                                                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color.badge}`}>
                                                                    {section.productCount} products
                                                                </span>
                                                                {section.hasMore && (
                                                                    <button
                                                                        onClick={() => handleSubSubSelect(section._id)}
                                                                        className={`ml-auto text-[11px] font-medium ${color.heading} underline underline-offset-2 hover:opacity-70`}
                                                                    >
                                                                        View all →
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* Products row */}
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                                                {section.products.map((p) => (
                                                                    <ProductCardOptimized
                                                                        key={p._id} product={p} fullWidth
                                                                        onAddToCart={(product) => console.log("Add to cart", product)}
                                                                        onBuyNow={(product) => navigate(`/checkout?productId=${product._id}`)}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {!loadingFeed && feedSections.length === 0 && (
                                                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                                        <FiPackage size={44} className="mb-3 opacity-30" />
                                                        <p className="text-sm font-medium">No products found</p>
                                                    </div>
                                                )}
                                            </>
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

/* Left sidebar category item  */

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
            className={`w-14 h-14 rounded-md overflow-hidden flex items-center justify-center border-2 transition-colors flex-shrink-0 ${isActive ? "border-[#002B45]" : "border-gray-200"
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

const BreadcrumbSkeleton = () => (
    <div className="flex gap-2 items-center animate-pulse px-4 py-2">
        <div className="h-2 w-10 bg-gray-200 rounded" />
        <div className="h-2 w-6 bg-gray-200 rounded" />
        <div className="h-2 w-16 bg-gray-200 rounded" />
        <div className="h-2 w-20 bg-gray-200 rounded" />
    </div>
);


const CategorySidebarSkeleton = () => (
    <div className="animate-pulse">
        {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 py-3 px-2 border-b border-gray-100">
                <div className="w-14 h-14 rounded-md bg-gray-200 border-2 border-gray-100" />
                <div className="h-[10px] w-12 bg-gray-200 rounded" />
                <div className="h-[10px] w-8 bg-gray-200 rounded" />
            </div>
        ))}
    </div>
);

const SubCategoryStripSkeleton = () => (
    <div className="flex gap-3 px-3 py-2 overflow-x-auto no-scrollbar bg-white border-b border-gray-100">
        {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0 animate-pulse w-20">
                <div className="relative w-16 h-16 rounded-md bg-gray-200">
                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-gray-300 rounded-b-md opacity-60" />
                </div>
                <div className="h-2 w-12 bg-gray-200 rounded" />
                <div className="h-2 w-8 bg-gray-200 rounded" />
            </div>
        ))}
    </div>
);

const SubSubChipsSkeleton = () => (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 animate-pulse">
        {Array.from({ length: 10 }).map((_, i) => (
            <div
                key={i}
                className="h-7 rounded-full bg-gray-200 flex-shrink-0"
                style={{ width: `${70 + (i % 3) * 20}px` }}
            />
        ))}
    </div>
);


export default AllCategories;