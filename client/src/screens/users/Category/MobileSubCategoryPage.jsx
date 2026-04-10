import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiImage } from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import UserNavbar from "../../../components/common/UserNavbar";
import useScrollLock from "../../../hooks/useScrollLock";
import ProductCardOptimized from "../../../components/Products/ProductCardOptimized";

const API = process.env.REACT_APP_API_URL;

/*  Gradients rotation */
const gradients = [
    {
        start: "254, 240, 138", // yellow
        mid: "134, 239, 172",   // green
    },
    {
        start: "233, 213, 255", // purple
        mid: "251, 207, 232",   // pink
    },
    {
        start: "191, 219, 254", // blue
        mid: "165, 180, 252",   // indigo
    },
    {
        start: "254, 215, 170", // orange
        mid: "252, 165, 165",   // red
    },
];
const MobileSubCategoryPage = () => {
    const { subCategoryId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);

    const observerRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${API}/catalog/subcategory/${subCategoryId}`
                );
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subCategoryId]);

    useEffect(() => {
        if (!drawerOpen) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisibleCount((prev) => prev + 10);
            }
        });

        if (observerRef.current) observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [drawerOpen]);

    /*  Placeholder */
    const Placeholder = () => (
        <div className="flex items-center justify-center h-full text-gray-400">
            <HiOutlineCube size={26} />
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-[#F6F8FB]">
            <div className="shrink-0">
                <UserNavbar />
            </div>

            <div className="flex-1  overflow-y-auto ">
                {/* BACK */}
                <div className="sticky top-0 z-10 flex items-center gap-2 px-2 py-2 bg-white/70 backdrop-blur-md">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center h-9 px-2 rounded-md border border-gray-200 bg-white shadow-sm active:scale-95 transition"
                    >
                        <FiArrowLeft size={18} className="text-gray-700" />
                    </button>

                    {/* Breadcrumb */}
                    {data?.breadcrumb && (
                        <div className="flex items-center gap-1 text-xs min-w-0 w-full">
                            <span className="text-gray-400 truncate max-w-[50%] sm:max-w-[180px]">
                                {data.breadcrumb.categoryName}
                            </span>

                            <span className="text-gray-300">/</span>

                            <span className="text-gray-800 font-medium truncate max-w-[120px] sm:max-w-[180px]">
                                {data.breadcrumb.subCategoryName}
                            </span>

                        </div>
                    )}
                </div>

                {/*  SHOP BY CATEGORIES  */}
                {loading ? (
                    <div className="animate-pulse h-20 bg-gray-200 rounded" />
                ) : (
                    <div className="p-3">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-base font-medium">
                                Shop by Categories
                            </h3>
                            <button
                                className="text-xs shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 transition active:scale-95 text-orangeAccent border-orangeAccent bg-orangeAccent/10"
                                onClick={() => setDrawerOpen(true)}
                            >
                                View All
                            </button>

                        </div>

                        <div className="flex gap-3 overflow-x-auto no-scrollbar">
                            {data.shopByCategories.map((cat) => (
                                <div
                                    key={cat._id}
                                    className="w-20 flex-shrink-0"
                                >
                                    <div className="relative aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
                                        {cat.imgUrl ? (
                                            <img
                                                alt=""
                                                src={cat.imgUrl}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Placeholder />
                                        )}

                                        <div className="absolute bottom-0 w-full text-[0.63rem] bg-black/50 text-white text-center py-[2px]">
                                            {cat.productCount}
                                        </div>
                                    </div>

                                    <p className="text-[0.67rem] font-medium  text-center mt-1 line-clamp-2">
                                        {cat.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/*  SECTIONS  */}
                <div className="">
                    {data?.sections.map((section, index) => {
                        const gradient = gradients[index % gradients.length];

                        return (
                            <div
                                key={section._id}
                                className="relative overflow-hidden "
                            >
                                {/*      TOP HALF GRADIENT */}
                                <div
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{
                                        background: `
                                                    linear-gradient(
                                                        to bottom,
                                                        rgba(${gradient.start}, 0.4),
                                                        rgba(255,255,255,0)
                                                    )
                                                    `,
                                    }}
                                />

                                <div className="relative p-3 space-y-5 backdrop-blur-sm bg-white/20 pt-4">
                                    {/* HEADER */}
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-base font-medium">
                                            {section.name}
                                        </h3>

                                        {section.hasMore && (
                                            <button
                                                onClick={() => navigate(`/products?subSubCategory=${section._id}`)}
                                                className="text-xs shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 transition active:scale-95 text-orangeAccent border-orangeAccent bg-orangeAccent/10"
                                            >
                                                View All
                                            </button>
                                        )}
                                    </div>

                                    {/* PRODUCTS */}
                                    {section.products.length === 0 ? (
                                        <div className="text-center py-4 text-gray-400 text-xs">
                                            No products available
                                        </div>
                                    ) : (
                                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">

                                            {section.products.map((p) => (
                                                <ProductCardOptimized
                                                    key={p._id}
                                                    product={p}
                                                    onAddToCart={(product) => {
                                                        console.log("Add to cart", product);

                                                        // TODO: integrate Zustand / Redux / API
                                                    }}
                                                    onBuyNow={(product) => {
                                                        navigate(`/checkout?productId=${product._id}`);
                                                    }}
                                                />
                                            ))}

                                            {/*  VIEW ALL CARD */}
                                            {section.hasMore && (
                                                <div
                                                    onClick={() =>
                                                        navigate(`/products?subSubCategory=${section._id}`)
                                                    }
                                                    className="w-28 flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm text-sm font-medium text-orangeAccent cursor-pointer"
                                                >
                                                    View All →
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/*  DRAWER  */}
            {drawerOpen && (
                <Drawer
                    data={data}
                    visibleCount={visibleCount}
                    setVisibleCount={setVisibleCount}
                    observerRef={observerRef}
                    onClose={() => setDrawerOpen(false)}
                    loading={loading}
                />
            )}
        </div>
    );
};

const Drawer = ({
    data,
    visibleCount,
    setVisibleCount,
    observerRef,
    onClose,
    loading,
}) => {
    const drawerRef = useRef(null);
    const [closing, setClosing] = useState(false);

    useScrollLock(true);


    /* CLICK OUTSIDE */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ESC CLOSE */
    useEffect(() => {
        const esc = (e) => e.key === "Escape" && handleClose();
        document.addEventListener("keydown", esc);
        return () => document.removeEventListener("keydown", esc);
    }, []);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    const total = data?.shopByCategories?.length || 0;

    /* SKELETON */
    const Skeleton = () => (
        <div className="animate-pulse">
            <div className="aspect-square bg-skeletonLoaderColor rounded-lg" />
            <div className="h-2 mt-2 bg-skeletonLoaderColor rounded w-3/4 mx-auto" />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]">
            <div
                ref={drawerRef}
                className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl px-4 pt-4 pb-4 max-h-[85vh] overflow-y-auto no-scrollbar ${closing ? "animate-slideDown" : "animate-slideUp"}`}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="font-semibold text-sm">All Categories <span className="text-secondaryTextColor">
                            ({total})</span></h3>

                    </div>

                    <button
                        onClick={handleClose}
                        className="text-sm px-2 py-1 rounded-md bg-gray-200 active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-3 gap-4">
                    {loading
                        ? Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} />)
                        : data?.shopByCategories
                            ?.slice(0, visibleCount)
                            .map((cat) => (
                                <div key={cat._id}>
                                    <div className="relative aspect-square rounded-xl overflow-hidden group">
                                        {/* IMAGE CONTAINER */}
                                        <div className="w-full h-full border border-orangeAccent/40 bg-gradient-to-br from-white to-orangeAccent/5 flex items-center justify-center rounded-xl overflow-hidden transition-all duration-200 group-active:scale-[0.97]">

                                            {cat.imgUrl ? (
                                                <img
                                                    src={cat.imgUrl}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
                                                    <FiImage size={20} className="opacity-70" />
                                                    <span className="text-[10px]">No Image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* COUNT BADGE */}
                                        <div className="absolute bottom-1.5 right-1.5 text-[10px] px-2 py-[3px] rounded-md bg-black/40 text-white backdrop-blur-sm shadow-sm">
                                            {cat.productCount}
                                        </div>
                                    </div>

                                    <p className="text-xs text-center mt-1 line-clamp-2">
                                        {cat.name}
                                    </p>
                                </div>
                            ))}
                </div>

                {/* INFINITE SCROLL TRIGGER */}
                <div
                    ref={observerRef}
                    className="h-10 flex items-center justify-center"
                >
                    {!loading && visibleCount < total && (
                        <span className="text-xs text-gray-400">Loading more...</span>
                    )}
                </div>
            </div>
        </div>
    );
};


export default MobileSubCategoryPage;