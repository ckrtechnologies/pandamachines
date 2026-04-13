import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserNavbar from "../../../components/common/UserNavbar";
import ProductCardOptimized, { ProductCardSkeleton } from "../../../components/Products/ProductCardOptimized";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

const API = process.env.REACT_APP_API_URL;

const MobileProductsPage = () => {
    const [searchParams] = useSearchParams();

    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const subSubCategory = searchParams.get("subSubCategory");

    const [breadcrumb, setBreadcrumb] = useState(null);
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sort, setSort] = useState("newest");

    const scrollContainerRef = useRef();
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const loadingRef = useRef(false);
    const navigate = useNavigate();

    /* debounce search */
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    /* reset when filters change */
    useEffect(() => {
        setProducts([]);
        pageRef.current = 1;
        setHasMore(true);
        hasMoreRef.current = true;
    }, [category, subCategory, subSubCategory, debouncedSearch, sort]);

    /* fetch products */
    const fetchProducts = useCallback(async () => {
        if (loadingRef.current || !hasMoreRef.current) return;

        try {
            loadingRef.current = true;
            setLoading(true);

            const res = await axios.get(`${API}/catalog/products`, {
                params: {
                    category,
                    subCategory,
                    subSubCategory,
                    page: pageRef.current,
                    limit: 10,
                    search: debouncedSearch,
                    sort,
                },
            });

            const data = res.data;

            setProducts((prev) => [...prev, ...data.products]);

            if (pageRef.current === 1) {
                setBreadcrumb(data.breadcrumb);
            }

            const totalPages = data.pagination.totalPages;

            if (pageRef.current >= totalPages) {
                hasMoreRef.current = false;
                setHasMore(false);
            } else {
                pageRef.current += 1;
            }
        } catch (err) {
            console.error(err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [category, subCategory, subSubCategory, debouncedSearch, sort]);

    /* initial fetch + re-fetch on filter change */
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    /* scroll-based infinite scroll — same pattern as MobileCategoryPage */
    const handleScroll = () => {
        const el = scrollContainerRef.current;
        if (!el) return;

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            fetchProducts();
        }
    };


    return (
        <div className="h-screen flex flex-col bg-[#F6F8FB]">

            <div className="shrink-0">
                <UserNavbar />
            </div>

            {/* single scrollable container — scroll events fire here */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto"
            >
                <div className="sticky top-0 z-20 flex items-center gap-2 px-2 py-2 bg-white/80 backdrop-blur-md">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center h-9 px-2 rounded-md border border-gray-200 bg-white shadow-sm active:scale-95"
                    >
                        <FiArrowLeft size={18} className="text-gray-700" />
                    </button>

                    {!breadcrumb && (
                        <div className="flex items-center gap-2 px-2 py-2 animate-pulse">
                            <div className="h-4 w-52 bg-gray-200 rounded" />
                        </div>
                    )}

                    {breadcrumb && (
                        <div className="flex items-center gap-1 text-xs min-w-0 w-full">
                            {breadcrumb.categoryName && (
                                <>
                                    <span className="text-gray-400 truncate max-w-[100px]">
                                        {breadcrumb.categoryName}
                                    </span>
                                    <span className="text-gray-300">/</span>
                                </>
                            )}
                            {breadcrumb.subCategoryName && (
                                <>
                                    <span className="text-gray-500 truncate max-w-[100px]">
                                        {breadcrumb.subCategoryName}
                                    </span>
                                    <span className="text-gray-300">/</span>
                                </>
                            )}
                            {breadcrumb.subSubCategoryName && (
                                <span className="text-gray-800 font-medium truncate max-w-[120px]">
                                    {breadcrumb.subSubCategoryName}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="sticky top-0 z-10 bg-[#F6F8FB]/95 backdrop-blur-sm px-3 pt-2 pb-2 space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-orangeAccent focus:ring-1 focus:ring-orangeAccent/20 transition-all shadow-sm placeholder:text-gray-400"
                        />
                    </div>

                    {/* Sort Pills */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {["newest", "price_asc", "price_desc"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setSort(s)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-full border whitespace-nowrap transition-all duration-200 ${sort === s
                                    ? "bg-orangeAccent border-orangeAccent text-white shadow-sm scale-[0.98]"
                                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100"
                                    }`}
                            >
                                {s === "newest" ? "Newest Arrivals" : s === "price_asc" ? "Price: Low to High" : "Price: High to Low"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* product grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 px-2 pb-3">
                    {!loading && products?.map((p) => (
                        <ProductCardOptimized
                            key={p._id}
                            product={p}
                            fullWidth={true}
                            onAddToCart={(product) => console.log("Add", product)}
                            onBuyNow={(product) => console.log("Buy", product)}
                        />
                    ))}

                    {loading && products.length === 0 &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}

                    {loading && products.length > 0 && (
                        <p className="col-span-full text-center text-xs text-gray-400 py-2">
                            Loading more...
                        </p>
                    )}
                </div>

                {!hasMore && (
                    <p className="text-xs text-gray-400 text-center py-4">
                        No more products
                    </p>
                )}
            </div>
        </div>
    );
};

export default MobileProductsPage;