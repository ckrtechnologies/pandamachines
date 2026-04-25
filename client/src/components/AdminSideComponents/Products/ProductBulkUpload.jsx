import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    FiAlertCircle,
    FiArrowLeft,
    FiArrowRight,
    FiCheck,
    FiCheckCircle,
    FiClipboard,
    FiEdit3,
    FiFileText,
    FiTrash2,
    FiUpload,
    FiX,
    FiXCircle
} from "react-icons/fi";
import * as XLSX from "xlsx";
import axios from "axios";
import uploadToCloudinary from "../../../utils/uploadToCloudinary";
import { useNavigate, useSearchParams } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL;
const isSupplierUser = Boolean(localStorage.getItem("pm-supplier-data"));

const Portal = ({ children }) => createPortal(children, document.body);

const normalizeKey = (key) =>
    key?.toString().trim().toLowerCase().replace(/\s+/g, "");

const COLUMN_LABELS = {
    name: "Name",
    description: "Description",
    brand: "Brand",
    category: "Category",
    subCategory: "Sub Category",
    subSubCategory: "Sub Sub Category",
    shippingType: "Shipping Type",
    shippingCharge: "Shipping Charge",
    price: "Price",
    previous_price: "Crossed Price",
    features: "Features",
};

const REQUIRED_COLUMNS = [
    "name", "description", "brand", "category", "subCategory", "subSubCategory",
    "shippingType", "shippingCharge", "price", "previous_price", "features",
];

const LABEL_TO_KEY_MAP = Object.fromEntries(
    Object.entries(COLUMN_LABELS).map(([key, label]) => [normalizeKey(label), key])
);

const TEMPLATE_COLUMNS = [
    { key: "name", required: true, example: "Industrial Water Pump" },
    { key: "description", required: true, example: "High-performance pump for industrial use" },
    { key: "brand", required: true, example: "Kirloskar" },
    { key: "category", required: true, example: "Machinery" },
    { key: "subCategory", required: true, example: "Pumps" },
    { key: "subSubCategory", required: true, example: "Centrifugal Pumps" },
    { key: "shippingType", required: true, example: "free | extra | actual" },
    { key: "shippingCharge", required: true, example: "0 or 500" },
    { key: "price", required: true, example: "25000" },
    { key: "previous_price", required: true, example: "28000" },
    { key: "features", required: true, example: "Rust-proof, High RPM, Low noise" },
];

// ─── Small reusable UI 

const StatBadge = ({ count, label, color }) => (
    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border ${color}`}>
        <span className="text-xl font-bold">{count}</span>
        <span className="text-sm">{label}</span>
    </div>
);

const ErrorBanner = ({ message }) => (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
        <FiAlertCircle className="text-red-500 mt-1" />
        <div>
            <p className="text-sm font-semibold text-red-700">Upload Error</p>
            <p className="text-xs text-red-600">{message}</p>
        </div>
    </div>
);

const SuccessBanner = () => (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
        <FiCheckCircle className="text-green-600" />
        <p className="text-sm font-semibold text-green-700">All rows are valid and ready to submit!</p>
    </div>
);

const WarningBanner = ({ invalidCount }) => (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <FiAlertCircle className="text-amber-600 mt-1" />
        <div>
            <p className="text-sm font-semibold text-amber-800">
                {invalidCount} row{invalidCount > 1 ? "s" : ""} have issues
            </p>
            <p className="text-xs text-amber-700 mt-0.5">Only valid rows will be submitted.</p>
        </div>
    </div>
);

const StatsRow = ({ total, valid, invalid }) => (
    <div className="flex gap-3">
        <StatBadge count={total} label="Total Rows" color="border-gray-200 text-gray-700" />
        <StatBadge count={valid} label="Valid" color="border-green-200 text-green-700 bg-green-50" />
        <StatBadge count={invalid} label="Need Fixes" color={`border-red-200 text-red-700 bg-red-50 ${invalid === 0 ? "opacity-40" : ""}`} />
    </div>
);

const InfoCards = () => {
    const cards = [
        {
            icon: <FiFileText />,
            title: "Upload File",
            desc: "Add your Excel file",
            color: "from-blue-500 to-blue-600",
        },
        {
            icon: <FiCheckCircle />,
            title: "Check Data",
            desc: "We review your file for errors",
            color: "from-green-500 to-emerald-600",
        },
        {
            icon: <FiEdit3 />,
            title: "Edit & Submit",
            desc: "Fix issues before final upload",
            color: "from-purple-500 to-indigo-600",
        },
    ];
    return (
        <div className="grid grid-cols-3 gap-3 ">
            {cards.map((c) => (
                <div key={c.title} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className={`w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br ${c.color} text-white shadow-sm`}>
                        <span className="text-sm">{c.icon}</span>
                    </div>
                    <div className="leading-tight">
                        <div className="text-xs font-semibold text-gray-800">{c.title}</div>
                        <div className="text-[11px] text-gray-500">{c.desc}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const StepIndicator = ({ current }) => {
    const steps = [{ n: 1, label: "Upload File" }, { n: 2, label: "Preview & Fix" }, { n: 3, label: "Submit" }];
    return (
        <div className="flex items-center gap-0">
            {steps.map((s, i) => (
                <React.Fragment key={s.n}>
                    <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${current >= s.n ? "bg-[#00569e] border-[#00569e] text-white" : "border-gray-300 text-gray-400 bg-white"}`}>
                            {current > s.n ? <FiCheck size={16} /> : s.n}
                        </div>
                        <span className={`text-xs mt-1 font-medium whitespace-nowrap ${current >= s.n ? "text-[#00569e]" : "text-gray-400"}`}>{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`h-0.5 w-16 mb-4 mx-1 ${current > s.n ? "bg-[#00569e]" : "bg-gray-200"}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const parseExcelRow = (row) => ({
    name: row["name"]?.trim() || "",
    description: row["description"]?.trim() || "",
    brand: row["brand"]?.trim() || "",
    category: row["category"]?.trim() || "",
    subCategory: row["subCategory"]?.trim() || "",
    subSubCategory: row["subSubCategory"]?.trim() || "",
    shippingType: row["shippingType"]?.toLowerCase().trim() || "free",
    shippingCharge: row["shippingCharge"] !== undefined && row["shippingCharge"] !== "" ? Number(row["shippingCharge"]) : 0,
    price: row["price"] !== undefined && row["price"] !== "" ? Number(row["price"]) : "",
    previous_price: row["previous_price"] !== undefined && row["previous_price"] !== "" ? Number(row["previous_price"]) : "",
    features: row["features"]?.trim() || "",
});

// ─── TemplateModal (unchanged) ────────────────────

const TemplateModal = ({ onClose }) => {
    const downloadTemplate = () => {
        const headers = TEMPLATE_COLUMNS.map((col) => COLUMN_LABELS[col.key] || col.key);
        const exampleRow = TEMPLATE_COLUMNS.reduce((acc, col) => {
            acc[COLUMN_LABELS[col.key] || col.key] = col.example;
            return acc;
        }, {});
        const worksheet = XLSX.utils.json_to_sheet([exampleRow], { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
        XLSX.writeFile(workbook, "product_upload_template.xlsx");
    };

    return (
        <Portal>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Excel Template Guide</h2>
                            <p className="text-sm text-gray-500">Only required fields are needed for upload</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={downloadTemplate} className="px-3 py-1.5 text-sm bg-[#00569e] text-white rounded-lg hover:bg-[#00457c]">
                                Download Template
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><FiX size={18} /></button>
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-[#00569e] text-white">
                                        <th className="px-4 py-3 text-left font-semibold">Column</th>
                                        <th className="px-4 py-3 text-left font-semibold">Required</th>
                                        <th className="px-4 py-3 text-left font-semibold">Example</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {TEMPLATE_COLUMNS.map((col, i) => (
                                        <tr key={col.key} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                                            <td className="px-4 py-2.5 font-mono text-[#00569e]">{COLUMN_LABELS[col.key] || col.key}</td>
                                            <td className="px-4 py-2.5">{col.required ? "Required" : "Optional"}</td>
                                            <td className="px-4 py-2.5 text-gray-600 text-xs">{col.example}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <p className="text-sm font-semibold text-blue-800 mb-2">Upload Rules</p>
                            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                                <li>Only these columns are required. Do not rename headers.</li>
                                <li>Maximum 50 rows per upload.</li>
                                <li><strong>{COLUMN_LABELS.shippingType}</strong> must be: free, extra, or actual</li>
                                <li>If <strong>{COLUMN_LABELS.shippingType}</strong> = <strong>extra</strong>, <strong>{COLUMN_LABELS.shippingCharge}</strong> is required</li>
                                <li><strong>{COLUMN_LABELS.price}</strong> must be greater than 0</li>
                                <li><strong>{COLUMN_LABELS.previous_price}</strong> should be &gt;= <strong>{COLUMN_LABELS.price}</strong></li>
                                <li><strong>{COLUMN_LABELS.features}</strong> must be comma-separated values</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

// ─── UploadDropZone (unchanged) ───────────────────

const UploadDropZone = ({ isDragging, isProcessing, handleDrop, handleDragOver, handleDragLeave, fileInputRef, handleFileSelect }) => (
    <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer ${isDragging ? "border-[#00569e] bg-blue-50" : "border-gray-300 bg-white"}`}
    >
        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])} />
        {isProcessing ? (
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#00569e] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#00569e]">Validating with server...</p>
            </div>
        ) : (
            <>
                <div className="w-16 h-16 bg-[#00569e]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiUpload size={28} className="text-[#00569e]" />
                </div>
                <p className="text-lg font-semibold">{isDragging ? "Drop it here" : "Drag & drop file"}</p>
                <p className="text-sm text-gray-500 mb-4">or click</p>
                <span className="bg-[#00569e] text-white px-5 py-2 rounded-lg">Choose File</span>
            </>
        )}
    </div>
);

// ─── CategoryDropdowns — only shown on rows with category resolution failures ──

const CategoryDropdowns = ({ row, rowIndex, categoryTree, onCategoryChange }) => {
    const selectedCat = categoryTree.find((c) => c._id?.toString() === row.categoryId?.toString());
    const subCats = selectedCat?.subCategories || [];
    const selectedSub = subCats.find((s) => s._id?.toString() === row.subCategoryId?.toString());
    const subSubCats = selectedSub?.subSubCategories || [];

    return (
        <div className="flex flex-col gap-1.5 min-w-[200px]">
            <select
                value={row.categoryId || ""}
                onChange={(e) => {
                    const cat = categoryTree.find((c) => c._id?.toString() === e.target.value);
                    onCategoryChange(rowIndex, {
                        categoryId: cat?._id || null,
                        category: cat?.name || "",
                        subCategoryId: null,
                        subCategory: "",
                        subSubCategoryId: null,
                        subSubCategory: "",
                    });
                }}
                className="text-xs border border-red-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#00569e] focus:border-[#00569e]"
            >
                <option value="">— Select Category —</option>
                {categoryTree.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>

            {row.categoryId && (
                <select
                    value={row.subCategoryId || ""}
                    onChange={(e) => {
                        const sub = subCats.find((s) => s._id?.toString() === e.target.value);
                        onCategoryChange(rowIndex, {
                            subCategoryId: sub?._id || null,
                            subCategory: sub?.name || "",
                            subSubCategoryId: null,
                            subSubCategory: "",
                        });
                    }}
                    className="text-xs border border-red-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#00569e] focus:border-[#00569e]"
                >
                    <option value="">— Select Sub Category —</option>
                    {subCats.map((sub) => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                </select>
            )}

            {row.subCategoryId && (
                <select
                    value={row.subSubCategoryId || ""}
                    onChange={(e) => {
                        const subSub = subSubCats.find((s) => s._id?.toString() === e.target.value);
                        onCategoryChange(rowIndex, {
                            subSubCategoryId: subSub?._id || null,
                            subSubCategory: subSub?.name || "",
                        });
                    }}
                    className="text-xs border border-red-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#00569e] focus:border-[#00569e]"
                >
                    <option value="">— Select Sub Sub Category —</option>
                    {subSubCats.map((ss) => (
                        <option key={ss._id} value={ss._id}>{ss.name}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

// ─── ParsedTable ──────

const ParsedTable = ({ rows, rowErrors, categoryTree, setParsedRows, setRowErrors }) => {
    if (!rows.length) return null;

    const fixedColumns = ["name", "description", "brand", "shippingType", "shippingCharge", "price", "previous_price", "features"];

    // Re-index errors cleanly after a row is removed
    const handleRemove = (index) => {
        setParsedRows((prev) => prev.filter((_, i) => i !== index));
        setRowErrors((prev) => {
            const newErrors = {};
            Object.keys(prev).forEach((key) => {
                const k = Number(key);
                if (k < index) newErrors[k] = prev[k];
                else if (k > index) newErrors[k - 1] = prev[k];
            });
            return newErrors;
        });
    };

    const handleImageUpload = async (index, files) => {
        const fileArray = Array.from(files);
        for (const file of fileArray) {
            const preview = URL.createObjectURL(file);
            const uploadId = Date.now() + Math.random();

            setParsedRows((prev) => {
                const updated = [...prev];
                const currentRow = { ...updated[index] };
                currentRow.images = [...(currentRow.images || []), { file, preview, url: "", uploading: true, error: false, uploadId }];
                updated[index] = currentRow;
                return updated;
            });

            try {
                const url = await uploadToCloudinary(file);
                setParsedRows((prev) => {
                    const updated = [...prev];
                    const currentRow = { ...updated[index] };
                    currentRow.images = currentRow.images.map((img) =>
                        img.uploadId === uploadId ? { ...img, url, uploading: false } : img
                    );
                    updated[index] = currentRow;
                    return updated;
                });
            } catch {
                setParsedRows((prev) => {
                    const updated = [...prev];
                    const currentRow = { ...updated[index] };
                    currentRow.images = currentRow.images.map((img) =>
                        img.uploadId === uploadId ? { ...img, uploading: false, error: true } : img
                    );
                    updated[index] = currentRow;
                    return updated;
                });
            }
        }
    };

    // When user picks from dropdowns: update row data + clear resolved category errors
    const handleCategoryChange = (index, updates) => {
        setParsedRows((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates };
            return updated;
        });

        setRowErrors((prev) => {
            const currentErrors = { ...(prev[index] || {}) };
            if (updates.categoryId !== undefined) delete currentErrors.category;
            if (updates.subCategoryId !== undefined) delete currentErrors.subCategory;
            if (updates.subSubCategoryId !== undefined) delete currentErrors.subSubCategory;

            if (Object.keys(currentErrors).length === 0) {
                const newErrors = { ...prev };
                delete newErrors[index];
                return newErrors;
            }
            return { ...prev, [index]: currentErrors };
        });
    };

    const hasCategoryError = (errors) => errors?.category || errors?.subCategory || errors?.subSubCategory;

    const renderCell = (value) => {
        if (value === null || value === undefined || value === "") return <span className="text-gray-300">—</span>;
        if (typeof value === "object") return <span className="text-xs text-gray-400">{JSON.stringify(value).slice(0, 40)}</span>;
        return String(value);
    };

    return (
        <div className="overflow-x-auto mb-4 border rounded-xl bg-white shadow-sm">
            <table className="min-w-[1400px] text-sm">
                <thead className="bg-[#00569e] text-white sticky top-0">
                    <tr>
                        <th className="px-3 py-2 text-left">#</th>
                        {fixedColumns.map((col) => (
                            <th key={col} className="px-3 py-2 text-left whitespace-nowrap">
                                {COLUMN_LABELS[col] || col}
                            </th>
                        ))}
                        <th className="px-3 py-2 text-left whitespace-nowrap">Category / Sub / SubSub</th>
                        <th className="px-3 py-2 text-left">Images</th>
                        <th className="px-3 py-2 text-center">Status</th>
                        <th className="px-3 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => {
                        const errors = rowErrors[index];
                        const hasError = !!errors;
                        const showDropdowns = !!(errors && hasCategoryError(errors));

                        return (
                            <tr key={index} className={`border-b ${hasError ? "bg-red-50" : "hover:bg-gray-50"}`}>

                                {/* Row number */}
                                <td className="px-3 py-2 text-gray-400 text-xs font-mono">{index + 1}</td>

                                {/* Fixed data columns */}
                                {fixedColumns.map((col) => (
                                    <td
                                        key={col}
                                        className={`px-3 py-2 max-w-[150px] truncate ${errors?.[col] ? "bg-red-100 text-red-700" : ""}`}
                                        title={errors?.[col] || String(row[col] ?? "")}
                                    >
                                        {renderCell(row[col])}
                                    </td>
                                ))}

                                {/* Category column: resolved text OR dropdowns */}
                                <td className="px-3 py-2">
                                    {showDropdowns ? (
                                        <CategoryDropdowns
                                            row={row}
                                            rowIndex={index}
                                            categoryTree={categoryTree}
                                            onCategoryChange={handleCategoryChange}
                                        />
                                    ) : (
                                        <div className="flex flex-col gap-0.5 text-xs min-w-[160px]">
                                            <span className="font-medium text-gray-800">{row.category || "—"}</span>
                                            <span className="text-gray-500">{row.subCategory || "—"}</span>
                                            <span className="text-gray-400">{row.subSubCategory || "—"}</span>
                                        </div>
                                    )}
                                </td>

                                {/* Image upload */}
                                <td className="px-3 py-2">
                                    <div className="flex gap-3">
                                        <label className="w-12 h-12 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 shrink-0">
                                            <FiUpload className="text-gray-400" size={14} />
                                            <input type="file" multiple className="hidden" onChange={(e) => handleImageUpload(index, e.target.files)} />
                                        </label>
                                        {row.images?.map((img, imgIndex) => (
                                            <div key={img.uploadId} className="relative w-12 h-12 shrink-0">
                                                <img alt="" src={img.preview} className="w-full h-full object-cover rounded-lg" />
                                                {img.uploading && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                )}
                                                {img.error && (
                                                    <div className="absolute inset-0 bg-red-500/70 flex flex-col items-center justify-center text-white text-[9px] rounded-lg">
                                                        Fail
                                                        <button onClick={(e) => { e.preventDefault(); handleImageUpload(index, [img.file]); }} className="underline">Retry</button>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setParsedRows((prev) => {
                                                            const updated = [...prev];
                                                            URL.revokeObjectURL(img.preview);
                                                            updated[index].images = updated[index].images.filter((_, i) => i !== imgIndex);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow"
                                                >
                                                    <FiX size={10} className="text-red-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </td>

                                {/* Status with hover tooltip */}
                                <td className="px-3 py-2 text-center">
                                    {hasError ? (
                                        <div className="flex flex-col items-center group relative cursor-default">
                                            <FiXCircle className="text-red-500 text-sm" />
                                            <span className="text-[8px] text-red-600 font-bold uppercase mt-0.5">Invalid</span>
                                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 z-50 w-52 shadow-xl">
                                                {Object.entries(errors).map(([field, msg]) => (
                                                    <div key={field} className="mb-0.5">
                                                        <span className="text-gray-300">{field}:</span> {msg}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <FiCheckCircle className="text-green-500 text-sm" />
                                            <span className="text-[8px] text-green-600 font-bold uppercase mt-0.5">Valid</span>
                                        </div>
                                    )}
                                </td>

                                {/* Remove */}
                                <td className="px-3 py-2 text-center">
                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                                        title="Remove row"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// ─── Submit Result Screen 

const SubmitResult = ({ result, onReset }) => {
    const { summary, errors } = result;
    const allSuccess = summary.failed === 0;

    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className={`rounded-2xl border p-8 text-center ${allSuccess ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${allSuccess ? "bg-green-100" : "bg-amber-100"}`}>
                    {allSuccess
                        ? <FiCheckCircle size={32} className="text-green-600" />
                        : <FiAlertCircle size={32} className="text-amber-600" />
                    }
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {allSuccess ? "All Products Uploaded!" : "Upload Completed with Issues"}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    {allSuccess
                        ? "All products are now pending admin approval."
                        : `${summary.success} products saved. ${summary.failed} rows had issues.`}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 border rounded-xl p-4">
                        <div className="text-2xl font-bold text-gray-800">{summary.total}</div>
                        <div className="text-xs text-gray-500 mt-1">Total Rows</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-700">{summary.success}</div>
                        <div className="text-xs text-green-600 mt-1">Saved</div>
                    </div>
                    <div className={`border rounded-xl p-4 ${summary.failed > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200 opacity-40"}`}>
                        <div className={`text-2xl font-bold ${summary.failed > 0 ? "text-red-600" : "text-gray-400"}`}>{summary.failed}</div>
                        <div className={`text-xs mt-1 ${summary.failed > 0 ? "text-red-500" : "text-gray-400"}`}>Failed</div>
                    </div>
                </div>

                {errors?.length > 0 && (
                    <div className="text-left bg-red-50 border border-red-200 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                        <p className="text-xs font-semibold text-red-700 mb-2">Failed Rows:</p>
                        {errors.map((e, i) => (
                            <div key={i} className="text-xs text-red-600 mb-1">
                                <span className="font-medium">Row {e.row}:</span>{" "}
                                {typeof e.errors === "object" ? Object.values(e.errors).join(", ") : e.message}
                            </div>
                        ))}
                    </div>
                )}

                <button onClick={onReset} className="px-6 py-2.5 bg-[#00569e] text-white rounded-xl font-semibold hover:bg-[#00457c] transition">
                    Upload Another Batch
                </button>
            </div>
        </div>
    );
};

// ─── Main Component ───

const ProductBulkUpload = () => {
    const [step, setStep] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [parseError, setParseError] = useState(null);
    const [parsedRows, setParsedRows] = useState([]);
    const [rowErrors, setRowErrors] = useState({});
    const [showTemplate, setShowTemplate] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // ── NEW state ───
    const [categoryTree, setCategoryTree] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);

    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const supplierIdFromUrl = searchParams.get("supplierId");

    const hasUploading = parsedRows.some((row) => row.images?.some((img) => img.uploading));
    const validCount = parsedRows.filter((_, i) => !rowErrors[i]).length;
    const invalidCount = parsedRows.length - validCount;

    useEffect(() => {
        if (isSupplierUser) return;

        const fetchSuppliers = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/supplier/suppliers`);
                const all = res.data?.data || [];

                const validSuppliers = all.filter(
                    (s) => s.status === "Approved" && !s.isBlocked
                );

                setSuppliers(validSuppliers);

                if (supplierIdFromUrl) {
                    const matched = validSuppliers.find(
                        (s) => s._id === supplierIdFromUrl
                    );
                    if (matched) setSelectedSupplier(matched);
                }
            } catch (err) {
                console.error("Error fetching suppliers", err);
            }
        };

        fetchSuppliers();
    }, [supplierIdFromUrl, isSupplierUser]);

    // ── Read uploader identity from localStorage 
    const getUploaderInfo = () => {
        // 1️ Supplier logged in (highest priority)
        try {
            const supplierRaw = localStorage.getItem("pm-supplier-data");
            if (supplierRaw) {
                const supplier = JSON.parse(supplierRaw);
                if (supplier?._id || supplier?.id) {
                    return {
                        uploadedBy: "supplier",
                        supplierId: supplier._id || supplier.id,
                    };
                }
            }
        } catch { }

        // 2️ Admin uploading for supplier via URL
        if (supplierIdFromUrl) {
            return {
                uploadedBy: "admin",
                supplierId: supplierIdFromUrl,
            };
        }

        // 3️ Pure admin upload
        return {
            uploadedBy: "admin",
            supplierId: null,
        };
    };

    // ── Parse Excel locally → call bulk-preview API 
    const processFile = useCallback((f) => {
        setParseError(null);
        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                // Local guards
                if (rawRows.length === 0) {
                    setParseError("The file is empty. Please add at least one product row.");
                    setIsProcessing(false);
                    return;
                }
                if (rawRows.length > 50) {
                    setParseError(`File contains ${rawRows.length} rows. Maximum allowed is 50.`);
                    setIsProcessing(false);
                    return;
                }

                const normalizedRows = rawRows.map((row) => {
                    const newRow = {};
                    Object.keys(row).forEach((key) => {
                        const mappedKey = LABEL_TO_KEY_MAP[normalizeKey(key)];
                        if (mappedKey) newRow[mappedKey] = row[key];
                    });
                    return newRow;
                });

                const fileColumns = Object.keys(normalizedRows[0] || {});
                const missing = REQUIRED_COLUMNS.filter((col) => !fileColumns.includes(col));
                if (missing.length > 0) {
                    setParseError(`Missing columns: ${missing.map((k) => COLUMN_LABELS[k]).join(", ")}. Use the provided template.`);
                    setIsProcessing(false);
                    return;
                }

                const parsed = normalizedRows.map((r) => parseExcelRow(r));

                // ── Hit bulk-preview API ──────────
                const { data: responseData } = await axios.post(
                    `${BASE_URL}/products/bulk-preview`,
                    { rows: parsed }
                );

                const { rows: previewRows, categoryTree: tree } = responseData;

                // Rebuild rows with resolved IDs + empty images array
                const resolvedRows = previewRows.map((r) => ({
                    ...r.resolvedData,
                    images: [],
                }));

                // Build error map from API response
                const errors = {};
                previewRows.forEach((r) => {
                    if (r.status === "invalid" && Object.keys(r.errors).length > 0) {
                        errors[r.rowIndex] = r.errors;
                    }
                });

                setParsedRows(resolvedRows);
                setRowErrors(errors);
                setCategoryTree(tree || []);
                setStep(2);
            } catch (err) {
                setParseError(
                    err.response?.data?.message ||
                    "Failed to validate file. Please check the format and try again."
                );
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsArrayBuffer(f);
    }, []);

    const handleFileSelect = (f) => {
        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
            "application/vnd.ms-excel",
        ];
        if (!validTypes.includes(f.type) && !f.name.match(/\.(xlsx|csv|xls)$/i)) {
            setParseError("Invalid file type. Please upload a .xlsx or .csv file.");
            return;
        }
        processFile(f);
    };

    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    // ── Final submit: only send valid rows ──────
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const { uploadedBy, supplierId } = getUploaderInfo();

            const validRows = parsedRows
                .filter((_, i) => !rowErrors[i])
                .map((row) => ({
                    ...row,
                    images: row.images?.map((img) => img.url).filter(Boolean) || [],
                }));

            const { data: result } = await axios.post(`${BASE_URL}/products/bulk-submit`, {
                rows: validRows,
                uploadedBy,
                ...(supplierId && { supplierId }),
            });

            setSubmitResult(result);
            setStep(3);
        } catch (err) {
            setParseError(err.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Full reset ───
    const handleReset = () => {
        setStep(1);
        setParsedRows([]);
        setRowErrors({});
        setCategoryTree([]);
        setParseError(null);
        setSubmitResult(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ── Render ───────

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans">
            {showTemplate && <TemplateModal onClose={() => setShowTemplate(false)} />}

            <div className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">

                    {/* Left Section */}
                    <div className="flex items-center gap-3">

                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                        >
                            <FiArrowLeft size={16} />
                        </button>

                        {/* Title Block */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00569e] to-blue-600 flex items-center justify-center shadow-sm">
                                <FiUpload className="text-white text-sm" />
                            </div>

                            <div className="leading-tight">
                                <h1 className="text-sm font-semibold text-gray-900">
                                    Bulk Upload
                                </h1>
                                <p className="text-[11px] text-gray-500">
                                    Max 50 via Excel
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <StepIndicator current={step} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* STEP 1 — Upload */}
                {step === 1 && (
                    <div className="max-w-7xl mx-auto">

                        <div
                            className={`mb-5 flex flex-col lg:flex-row lg:items-center gap-4 ${isSupplierUser ? "lg:justify-center" : "lg:justify-between"
                                }`}
                        >
                            {/* LEFT → Info Cards */}
                            <div
                                className={`w-full ${isSupplierUser ? "lg:max-w-2xl mx-auto" : "lg:w-auto"
                                    }`}
                            >
                                <InfoCards />
                            </div>

                            {/* RIGHT → Upload Context (Admin Only) */}
                            {!isSupplierUser && (
                                <div className="flex items-center justify-between  gap-4 bg-white border rounded-xl px-4 py-3 shadow-sm min-w-[260px]">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500">
                                            {selectedSupplier
                                                ? `Uploading for ${selectedSupplier.businessName}`
                                                : "Uploading as Admin"}
                                        </p>
                                    </div>

                                    {!supplierIdFromUrl && (
                                        <select
                                            value={selectedSupplier?._id || ""}
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                const supplier = suppliers.find((s) => s._id === id);
                                                setSelectedSupplier(supplier || null);

                                                if (id) {
                                                    setSearchParams({ supplierId: id });
                                                } else {
                                                    setSearchParams({});
                                                }
                                            }}
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#00569e] focus:border-[#00569e]"
                                        >
                                            <option value="">Upload as Admin</option>
                                            {suppliers.map((s) => (
                                                <option key={s._id} value={s._id}>
                                                    {s.businessName}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}
                        </div>

                        <UploadDropZone {...{ isDragging, isProcessing, handleDrop, handleDragOver, handleDragLeave, fileInputRef, handleFileSelect }} />
                        {parseError && <ErrorBanner message={parseError} />}
                        <div className="mt-6 p-4 bg-[#00569e]/5 border rounded-xl flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                                <FiClipboard />
                                <div>
                                    <p className="text-sm font-semibold">Need the template?</p>
                                    <p className="text-xs text-gray-500">View required format</p>
                                </div>
                            </div>
                            <button onClick={() => setShowTemplate(true)} className="text-[#00569e] font-semibold text-sm">
                                View Guide →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2 — Preview & Fix */}
                {step === 2 && (
                    <div>
                        {/* Top bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                            <div className="flex items-center gap-5">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">Review Parsed Products</h2>
                                    <p className="text-xs text-gray-500">{parsedRows.length} rows found</p>
                                </div>
                                <StatsRow total={parsedRows.length} valid={validCount} invalid={invalidCount} />
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition"
                                >
                                    <FiArrowLeft className="text-sm" />
                                    <span className="hidden sm:inline">Upload Different File</span>
                                </button>
                                <button
                                    disabled={validCount === 0 || hasUploading || isSubmitting}
                                    onClick={handleSubmit}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-[#00569e] text-white rounded-md text-sm hover:bg-[#00457c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline">Submit {validCount} Products</span>
                                            <FiArrowRight className="text-sm" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Tip banner for rows with category errors */}
                        {invalidCount > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
                                <span className="font-semibold">Tip:</span> Rows with category errors show dropdown selectors.
                                Pick the correct Category → Sub Category → Sub Sub Category to resolve them.
                            </div>
                        )}

                        <ParsedTable
                            rows={parsedRows}
                            rowErrors={rowErrors}
                            categoryTree={categoryTree}
                            setParsedRows={setParsedRows}
                            setRowErrors={setRowErrors}
                        />

                        {invalidCount === 0 && <SuccessBanner />}
                        {invalidCount > 0 && <WarningBanner invalidCount={invalidCount} />}

                        {/* Bottom submit */}
                        <div className="mt-4 flex justify-end">
                            <button
                                disabled={validCount === 0 || hasUploading || isSubmitting}
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#00569e] text-white rounded-xl font-semibold hover:bg-[#00457c] disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit {validCount} valid product{validCount !== 1 ? "s" : ""}
                                        {hasUploading && " (waiting for uploads...)"}
                                        <FiArrowRight />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3 — Result */}
                {step === 3 && submitResult && (
                    <SubmitResult result={submitResult} onReset={handleReset} />
                )}

            </div>
        </div>
    );
};

export default ProductBulkUpload;