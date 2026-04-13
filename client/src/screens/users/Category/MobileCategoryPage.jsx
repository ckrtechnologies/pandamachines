import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { HiOutlineCube, HiOutlineViewGrid } from "react-icons/hi";
import UserNavbar from "../../../components/common/UserNavbar";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

const MobileCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get("category");

    const [catPage, setCatPage] = useState(1);
    const [subPage, setSubPage] = useState(1);

    const [catHasMore, setCatHasMore] = useState(true);
    const [subHasMore, setSubHasMore] = useState(true);

    const [loadingCats, setLoadingCats] = useState(false);
    const [loadingSubs, setLoadingSubs] = useState(false);

    const catRef = useRef();
    const subRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    useEffect(() => {
        if (!categories.length) return;

        const selected =
            categories.find((c) => c._id === categoryFromUrl) ||
            categories[0];

        setActiveCategory(selected);
    }, [categories, categoryFromUrl]);

    /* Load Categories */
    const loadCategories = async () => {
        if (loadingCats || !catHasMore) return;

        try {
            setLoadingCats(true);

            const res = await axios.get(`${API}/navigation/categories`, {
                params: { page: catPage, limit: 16 },
            });

            const data = res.data;

            setCategories((prev) => {
                const map = new Map();

                [...prev, ...data.categories].forEach((item) => {
                    map.set(item._id, item);
                });

                return Array.from(map.values());
            });
            setCatHasMore(data.hasMore);

            setCatPage((prev) => prev + 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCats(false);
        }
    };


    /* Load Subcategories */
    const loadSubCategories = async (categoryId, reset = false) => {
        if (loadingSubs || (!subHasMore && !reset)) return;

        try {
            setLoadingSubs(true);

            const pageToUse = reset ? 1 : subPage;

            const res = await axios.get(`${API}/navigation/subcategories`, {
                params: { categoryId, page: pageToUse, limit: 12 },
            });

            const data = res.data;

            setSubCategories((prev) => {
                const merged = reset
                    ? data.subCategories
                    : [...prev, ...data.subCategories];

                const map = new Map();

                merged.forEach((item) => {
                    map.set(item._id, item);
                });

                return Array.from(map.values());
            });

            setSubHasMore(data.hasMore);

            if (reset) setSubPage(2);
            else setSubPage((prev) => prev + 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSubs(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (!activeCategory) return;

        setSubCategories([]);
        setSubPage(1);
        setSubHasMore(true);

        loadSubCategories(activeCategory._id, true);
    }, [activeCategory]);

    useEffect(() => {
        if (!categories.length) return;

        if (!categoryFromUrl) {
            setSearchParams({ category: categories[0]._id });
        }
    }, [categories]);

    useEffect(() => {
        subRef.current?.scrollTo(0, 0);
    }, [activeCategory]);

    /* Scroll handlers */
    const handleCatScroll = () => {
        const el = catRef.current;
        if (!el) return;

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            loadCategories();
        }
    };

    const handleSubScroll = () => {
        const el = subRef.current;
        if (!el) return;

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            loadSubCategories(activeCategory._id);
        }
    };

    return (
        <div className="h-screen flex flex-col">

            {/*  Navbar (fixed top) */}
            <div className="shrink-0">
                <UserNavbar />
            </div>

            {/*  MAIN CONTENT */}
            <div className="flex flex-1 overflow-hidden bg-[#F2F7FF]">

                {/* LEFT SIDEBAR */}
                <div
                    ref={catRef}
                    onScroll={handleCatScroll}
                    className="w-28 bg-white overflow-y-auto border-r"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => {
                                setSearchParams({ category: cat._id });
                            }}
                            className={`w-full py-3 px-2 text-xs flex flex-col items-center ${activeCategory?._id === cat._id
                                ? "bg-blue-50 text-[#002B45]"
                                : "text-gray-600"
                                }`}
                        >
                            {cat.imgUrl ? (
                                <img
                                    alt={cat?.name}
                                    src={cat.imgUrl}
                                    className="w-16 h-16 rounded-sm object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gray-50 flex items-center justify-center">
                                    <HiOutlineViewGrid size={28} />
                                </div>
                            )}
                            <span className="mt-1 text-[10px] text-center line-clamp-2">
                                {cat.name}
                            </span>
                        </button>
                    ))}

                    {loadingCats && categories.length === 0 && (
                        Array.from({ length: 10 }).map((_, i) => (
                            <CategorySkeleton key={i} />
                        ))
                    )}
                </div>

                {/* RIGHT PANEL */}
                <div
                    ref={subRef}
                    onScroll={handleSubScroll}
                    className="flex-1 p-3 overflow-y-auto"
                >
                    <h2 className="font-bold text-sm mb-3">
                        {activeCategory?.name}
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                        {subCategories.map((sub) => (
                            <div
                                key={sub._id}
                                onClick={() => navigate(`/subcategory/${sub._id}`)}
                                className="bg-white rounded-lg cursor-pointer border p-2"
                            >
                                <div className="relative aspect-square bg-gray-100 rounded">
                                    {sub.imgUrl ? (
                                        <img
                                            alt={sub?.name}
                                            src={sub.imgUrl}
                                            className="w-full h-full object-contain"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <HiOutlineCube size={32} className="text-gray-400" />
                                        </div>
                                    )}

                                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] text-center py-1">
                                        {sub.productCount}
                                    </div>
                                </div>

                                <p className="text-xs text-center mt-2 line-clamp-2">
                                    {sub.name}
                                </p>
                            </div>
                        ))}
                    </div>

                    {loadingSubs && subCategories.length === 0 && (
                        <div className="grid grid-cols-2 gap-3">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <SubCategorySkeleton key={i} />
                            ))}
                        </div>
                    )}
                    {loadingSubs && subCategories.length > 0 && (
                        <p className="text-center text-xs py-3 text-gray-400">
                            Loading more...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const CategorySkeleton = () => {
    return (
        <div className="w-full py-3 px-2 flex flex-col items-center animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-sm" />
            <div className="mt-1 h-2 w-10 bg-gray-200 rounded" />
            <div className="mt-1 h-2 w-6 bg-gray-200 rounded" />
        </div>
    );
};

const SubCategorySkeleton = () => {
    return (
        <div className="bg-white rounded-lg border p-2 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded relative">
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-300 rounded-b" />
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="mt-1 h-2 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
    );
};

export default MobileCategoryPage;