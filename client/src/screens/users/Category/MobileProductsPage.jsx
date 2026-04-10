import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import UserNavbar from "../../../components/common/UserNavbar";
import ProductCardOptimized from "../../../components/Products/ProductCardOptimized";

const API = process.env.REACT_APP_API_URL;

const MobileProductsPage = () => {
    const [searchParams] = useSearchParams();

    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const subSubCategory = searchParams.get("subSubCategory");

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sort, setSort] = useState("newest");

    const observerRef = useRef();

    /* debounce search */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    /* reset when filters change */
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
    }, [category, subCategory, subSubCategory, debouncedSearch, sort]);

    /* fetch products */
    const fetchProducts = async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);

            const res = await axios.get(`${API}/catalog/products`, {
                params: {
                    category,
                    subCategory,
                    subSubCategory,
                    page,
                    limit: 10,
                    search: debouncedSearch,
                    sort,
                },
            });

            const data = res.data;

            setProducts((prev) => [...prev, ...data.products]);

            const totalPages = data.pagination.totalPages;

            if (page >= totalPages) {
                setHasMore(false);
            } else {
                setPage((prev) => prev + 1);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* initial fetch */
    useEffect(() => {
        fetchProducts();
    }, [page === 1]);

    /* infinite scroll */
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchProducts();
            }
        });

        if (observerRef.current) observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [observerRef.current, hasMore]);

    /* skeleton */
    const Skeleton = () => (
        <div className="animate-pulse bg-white p-2 rounded-xl shadow-sm">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="h-3 bg-gray-200 mt-2 rounded w-4/5" />
            <div className="h-3 bg-gray-200 mt-1 rounded w-2/5" />
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-[#F6F8FB]">

            <div className="shrink-0">
                <UserNavbar />
            </div>

            <div className="flex-1 overflow-y-auto">

                {/* sticky search + filters */}
                <div className="sticky top-0 z-10 bg-[#F6F8FB] px-2 pt-2 pb-2 space-y-2">

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
                    />

                    <div className="flex gap-2 overflow-x-auto no-scrollbar">

                        <button
                            onClick={() => setSort("newest")}
                            className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${sort === "newest"
                                    ? "bg-orangeAccent text-white"
                                    : "bg-white"
                                }`}
                        >
                            Newest
                        </button>

                        <button
                            onClick={() => setSort("price_asc")}
                            className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${sort === "price_asc"
                                    ? "bg-orangeAccent text-white"
                                    : "bg-white"
                                }`}
                        >
                            Price Low
                        </button>

                        <button
                            onClick={() => setSort("price_desc")}
                            className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${sort === "price_desc"
                                    ? "bg-orangeAccent text-white"
                                    : "bg-white"
                                }`}
                        >
                            Price High
                        </button>
                    </div>
                </div>

                {/* product grid */}
                <div className="grid grid-cols-2 gap-3 px-2 pb-3">
                    {products.map((p) => (
                        <ProductCardOptimized
                            key={p._id}
                            product={p}
                            onAddToCart={(product) => {
                                console.log("Add", product);
                            }}
                            onBuyNow={(product) => {
                                console.log("Buy", product);
                            }}
                        />
                    ))}

                    {loading &&
                        Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} />
                        ))}
                </div>

                {/* infinite scroll trigger */}
                <div
                    ref={observerRef}
                    className="h-10 flex justify-center items-center"
                >
                    {!hasMore && (
                        <p className="text-xs text-gray-400">
                            No more products
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileProductsPage;