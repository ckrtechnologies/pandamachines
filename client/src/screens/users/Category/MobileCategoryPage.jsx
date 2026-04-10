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
    const categoryIdFromUrl = searchParams.get("categoryId");

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
        if (!categories.length) return;

        const selected =
            categories.find((c) => c._id === categoryIdFromUrl) ||
            categories[0];

        setActiveCategory(selected);
    }, [categories, categoryIdFromUrl]);

    /* Load Categories */
    const loadCategories = async () => {
        if (loadingCats || !catHasMore) return;

        try {
            setLoadingCats(true);

            const res = await axios.get(`${API}/navigation/categories`, {
                params: { page: catPage, limit: 12 },
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

        if (!categoryIdFromUrl) {
            setSearchParams({ categoryId: categories[0]._id });
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
                                setSearchParams({ categoryId: cat._id });
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

                    {loadingCats && (
                        <p className="text-center text-xs py-2 text-gray-400">
                            Loading...
                        </p>
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

                    {loadingSubs && (
                        <p className="text-center text-xs py-3 text-gray-400">
                            Loading...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileCategoryPage;