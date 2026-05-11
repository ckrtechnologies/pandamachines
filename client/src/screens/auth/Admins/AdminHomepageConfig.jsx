import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiEdit2, FiSave, FiX, FiSearch, FiGripVertical, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { HiOutlineViewGrid } from "react-icons/hi";
import { MdOutlineDragIndicator } from "react-icons/md";
import toast from "react-hot-toast";
import { getCloudinaryImageUrl } from "../../../utils/getCloudinaryImageUrl";

const MAX_SLOTS = 6;

// ─── Drag-reorderable slot ────────────────────────────────────────────────────
const CategorySlot = ({
    cat,
    index,
    editing,
    onOpen,
    onClear,
    onDragStart,
    onDragOver,
    onDrop,
    isDragOver,
}) => {
    return (
        <div
            draggable={editing && !!cat}
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => { e.preventDefault(); onDragOver(index); }}
            onDrop={() => onDrop(index)}
            onClick={() => editing && onOpen(index)}
            className={`
        relative group h-36 rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden
        ${isDragOver
                    ? "border-orange-400 scale-[1.03] shadow-lg shadow-orange-100"
                    : cat
                        ? "border-gray-200 hover:border-orange-300 hover:shadow-md"
                        : "border-dashed border-gray-300 hover:border-orange-300 bg-gray-50/60"
                }
        ${!editing ? "cursor-default" : ""}
      `}
        >
            {cat ? (
                <>
                    {/* Image */}
                    <img
                        src={getCloudinaryImageUrl(cat.imgUrl, { width: 300 })}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Name */}
                    <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-semibold px-1 truncate">
                        {cat.name}
                    </p>

                    {/* Slot number badge */}
                    <span className="absolute top-2 left-2 bg-black/40 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                        #{index + 1}
                    </span>

                    {/* Edit actions — only in editing mode */}
                    {editing && (
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Drag handle */}
                            <div className="w-6 h-6 bg-white/80 rounded-md flex items-center justify-center cursor-grab active:cursor-grabbing">
                                <MdOutlineDragIndicator size={14} className="text-gray-600" />
                            </div>
                            {/* Clear */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onClear(index); }}
                                className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center hover:bg-red-600 transition"
                            >
                                <FiX size={11} className="text-white" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                // Empty slot
                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                    <div className={`w-9 h-9 rounded-full border-2 border-dashed flex items-center justify-center transition ${editing ? "border-orange-300 text-orange-400" : "border-gray-300"}`}>
                        {editing ? <FiPlus size={16} /> : <span className="text-lg font-light">—</span>}
                    </div>
                    <span className="text-[11px] font-medium">
                        {editing ? `Slot ${index + 1}` : "Empty"}
                    </span>
                </div>
            )}
        </div>
    );
};

// ─── Category picker modal ────────────────────────────────────────────────────
const CategoryModal = ({ categories, loading, onSelect, onClose }) => {
    const [search, setSearch] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 80);
    }, []);

    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="bg-white w-full sm:w-[520px] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[82vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">Select Category</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{categories.length} categories available</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    >
                        <FiX size={15} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                        <FiSearch size={15} className="text-gray-400 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                                <FiX size={13} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid */}
                <div className="overflow-y-auto flex-1 p-4">
                    {loading ? (
                        <div className="grid grid-cols-3 gap-3">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-square bg-gray-200 rounded-xl" />
                                    <div className="h-2.5 bg-gray-200 rounded mt-2 w-3/4 mx-auto" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <HiOutlineViewGrid size={32} className="mb-2 opacity-50" />
                            <p className="text-sm">No categories found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {filtered.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => onSelect(cat)}
                                    className="group text-left rounded-xl border border-gray-100 overflow-hidden hover:border-orange-400 hover:shadow-md transition-all duration-150 active:scale-[0.97]"
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-50">
                                        <img
                                            src={getCloudinaryImageUrl(cat.imgUrl, { width: 200 })}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>
                                    <p className="text-[11px] font-medium text-center text-gray-700 px-1 py-1.5 line-clamp-2 leading-snug">
                                        {cat.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AdminHomepageConfig = () => {
    const [slots, setSlots] = useState(Array(MAX_SLOTS).fill(null));
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(false);

    const dragIndex = useRef(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Fetch saved config
    const fetchConfig = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/home/config`);
            const selected = res.data.data?.featuredCategoryIds || [];
            setSlots(Array(MAX_SLOTS).fill(null).map((_, i) => selected[i] || null));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load homepage config");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchConfig(); }, []);

    // Open slot picker
    const openCategorySelector = async (index) => {
        setActiveIndex(index);
        setModalOpen(true);
        setFetchingCategories(true);
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/categories?simple=true&limit=100`
            );
            const selectedIds = slots.filter(Boolean).map((c) => c._id);
            setAvailableCategories(
                res.data.data.filter((cat) => !selectedIds.includes(cat._id))
            );
        } catch (err) {
            toast.error("Failed to load categories");
        } finally {
            setFetchingCategories(false);
        }
    };

    const handleSelectCategory = (category) => {
        const updated = [...slots];
        updated[activeIndex] = category;
        setSlots(updated);
        setModalOpen(false);
    };

    const handleClearSlot = (index) => {
        const updated = [...slots];
        updated[index] = null;
        setSlots(updated);
    };

    const handleClearAll = () => {
        setSlots(Array(MAX_SLOTS).fill(null));
    };

    // Drag reorder
    const handleDragStart = (index) => { dragIndex.current = index; };
    const handleDragOver = (index) => { setDragOverIndex(index); };
    const handleDrop = (dropIndex) => {
        if (dragIndex.current === null || dragIndex.current === dropIndex) {
            setDragOverIndex(null);
            return;
        }
        const updated = [...slots];
        const dragged = updated[dragIndex.current];
        updated[dragIndex.current] = updated[dropIndex];
        updated[dropIndex] = dragged;
        setSlots(updated);
        dragIndex.current = null;
        setDragOverIndex(null);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const ids = slots.filter(Boolean).map((c) => c._id);
            await axios.put(
                `${process.env.REACT_APP_API_URL}/home/config`,
                { featuredCategoryIds: ids }
            );
            setEditing(false);
            toast.success("Homepage updated");
        } catch (err) {
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        fetchConfig(); // revert to saved
        setEditing(false);
    };

    const filledCount = slots.filter(Boolean).length;

    return (
        <div className="min-h-screen bg-[#F7F8FA] p-4 sm:p-8 font-sans">
            <div className="max-w-full  mx-auto space-y-6">

                {/* Page header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Homepage Builder
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Control which category strips appear on the home screen
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-700 transition active:scale-[0.97]"
                            >
                                <FiEdit2 size={14} />
                                Edit Layout
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-sm font-medium px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition active:scale-[0.97]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-orange-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-orange-600 transition active:scale-[0.97] disabled:opacity-60"
                                >
                                    <FiSave size={14} />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Category strips card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Card header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                <HiOutlineViewGrid size={16} className="text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Featured Category Strips
                                </h2>
                                <p className="text-xs text-gray-400">
                                    {filledCount} of {MAX_SLOTS} slots filled
                                </p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-orange-400 rounded-full transition-all duration-500"
                                    style={{ width: `${(filledCount / MAX_SLOTS) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{filledCount}/{MAX_SLOTS}</span>
                        </div>
                    </div>

                    {/* Editing hint */}
                    {editing && (
                        <div className="mx-5 mt-4 px-3.5 py-2.5 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-2.5">
                            <MdOutlineDragIndicator size={16} className="text-orange-400 shrink-0" />
                            <p className="text-xs text-orange-700">
                                Click an empty slot to add a category. Drag filled slots to reorder. Changes are only saved when you click Save.
                            </p>
                        </div>
                    )}

                    {/* Slots grid */}
                    <div className="p-5">
                        {loading ? (
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {Array.from({ length: MAX_SLOTS }).map((_, i) => (
                                    <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {slots.map((cat, index) => (
                                    <CategorySlot
                                        key={index}
                                        cat={cat}
                                        index={index}
                                        editing={editing}
                                        onOpen={openCategorySelector}
                                        onClear={handleClearSlot}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        isDragOver={dragOverIndex === index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer actions */}
                    {editing && filledCount > 0 && (
                        <div className="px-5 pb-5">
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition font-medium"
                            >
                                <FiTrash2 size={12} />
                                Clear all slots
                            </button>
                        </div>
                    )}
                </div>

                {/* Live preview hint */}
                {!editing && filledCount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 px-1">
                        <FiEye size={14} className="text-gray-400" />
                        <span>
                            These {filledCount} categories are currently live on the home screen.
                        </span>
                    </div>
                )}

            </div>

            {/* Category picker modal */}
            {modalOpen && (
                <CategoryModal
                    categories={availableCategories}
                    loading={fetchingCategories}
                    onSelect={handleSelectCategory}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminHomepageConfig;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FiEdit2, FiSave, FiX } from "react-icons/fi";
// import toast from "react-hot-toast";
// import { getCloudinaryImageUrl } from "../../../utils/getCloudinaryImageUrl";

// const AdminHomepageConfig = () => {
//     const [slots, setSlots] = useState(Array(6).fill(null));
//     const [loading, setLoading] = useState(false);
//     const [editing, setEditing] = useState(false);
//     const [saving, setSaving] = useState(false);

//     const [modalOpen, setModalOpen] = useState(false);
//     const [activeIndex, setActiveIndex] = useState(null);

//     const [availableCategories, setAvailableCategories] = useState([]);
//     const [fetchingCategories, setFetchingCategories] = useState(false);

//     // Fetch config
//     const fetchConfig = async () => {
//         try {
//             setLoading(true);

//             const res = await axios.get(
//                 `${process.env.REACT_APP_API_URL}/home/config`
//             );

//             const selected = res.data.data?.featuredCategoryIds || [];

//             const filledSlots = Array(6)
//                 .fill(null)
//                 .map((_, i) => selected[i] || null);

//             setSlots(filledSlots);
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to load homepage config");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchConfig();
//     }, []);

//     // Open modal + ALWAYS recalc categories
//     const openCategorySelector = async (index) => {
//         setActiveIndex(index);
//         setModalOpen(true);

//         try {
//             setFetchingCategories(true);

//             const res = await axios.get(
//                 `${process.env.REACT_APP_API_URL}/categories?simple=true&limit=100`
//             );

//             const selectedIds = slots.filter(Boolean).map((c) => c._id);

//             const filtered = res.data.data.filter(
//                 (cat) => !selectedIds.includes(cat._id)
//             );

//             setAvailableCategories(filtered);
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to load categories");
//         } finally {
//             setFetchingCategories(false);
//         }
//     };

//     // Select category
//     const handleSelectCategory = (category) => {
//         const updated = [...slots];
//         updated[activeIndex] = category;
//         setSlots(updated);
//         setModalOpen(false);
//     };

//     // Save config
//     const handleSave = async () => {
//         try {
//             setSaving(true);

//             const ids = slots.filter(Boolean).map((c) => c._id);

//             await axios.put(
//                 `${process.env.REACT_APP_API_URL}/home/config`,
//                 { featuredCategoryIds: ids }
//             );

//             setEditing(false);
//             toast.success("Homepage updated successfully");
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to save homepage config");
//         } finally {
//             setSaving(false);
//         }
//     };

//     return (
//         <div className="p-6 space-y-6">
//             {/* HEADER */}
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl font-bold">Homepage Builder</h1>
//                     <p className="text-sm text-gray-500">
//                         Configure homepage layout
//                     </p>
//                 </div>
//             </div>

//             {/* CATEGORY SECTION */}
//             <div className="bg-white border rounded-xl p-5">
//                 {/* Section Header */}
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold">
//                         Category Section
//                     </h2>

//                     {!editing ? (
//                         <button
//                             onClick={() => setEditing(true)}
//                             className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded"
//                         >
//                             <FiEdit2 /> Edit
//                         </button>
//                     ) : (
//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => setEditing(false)}
//                                 className="px-4 py-2 bg-gray-300 rounded"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 onClick={handleSave}
//                                 className="flex items-center gap-2 bg-[#FF8617] text-white px-4 py-2 rounded"
//                             >
//                                 <FiSave />
//                                 {saving ? "Saving..." : "Save"}
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* Slots */}
//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : (
//                     <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
//                         {slots.map((cat, index) => (
//                             <div
//                                 key={index}
//                                 onClick={() =>
//                                     editing && openCategorySelector(index)
//                                 }
//                                 className={`h-28 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition ${editing ? "hover:border-orange-400" : ""
//                                     }`}
//                             >
//                                 {cat ? (
//                                     <>
//                                         <img
//                                             src={getCloudinaryImageUrl(cat.imgUrl, {
//                                                 width: 300,
//                                             })}
//                                             alt={cat.name}
//                                             className="w-full h-16 object-cover rounded"
//                                         />
//                                         <p className="text-xs mt-1 text-center">
//                                             {cat.name}
//                                         </p>
//                                     </>
//                                 ) : (
//                                     <p className="text-gray-400 text-sm">
//                                         Empty
//                                     </p>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* MODAL */}
//             {modalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white w-[500px] p-4 rounded-lg">
//                         <div className="flex justify-between mb-3">
//                             <h3>Select Category</h3>
//                             <FiX
//                                 className="cursor-pointer"
//                                 onClick={() => setModalOpen(false)}
//                             />
//                         </div>

//                         {fetchingCategories ? (
//                             <p>Loading...</p>
//                         ) : (
//                             <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
//                                 {availableCategories.map((cat) => (
//                                     <div
//                                         key={cat._id}
//                                         onClick={() => handleSelectCategory(cat)}
//                                         className="border p-2 rounded cursor-pointer hover:border-orange-400"
//                                     >
//                                         <img
//                                             alt=""
//                                             src={getCloudinaryImageUrl(cat.imgUrl, {
//                                                 width: 300,
//                                             })}
//                                             className="h-16 w-full object-cover rounded"
//                                         />
//                                         <p className="text-xs mt-1 text-center">
//                                             {cat.name}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminHomepageConfig;