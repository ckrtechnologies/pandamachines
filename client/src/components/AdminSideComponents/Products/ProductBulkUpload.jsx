import React, { useCallback, useRef, useState } from "react";
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
    FiUpload,
    FiX
} from "react-icons/fi";
import * as XLSX from "xlsx";

const Portal = ({ children }) => {
    return createPortal(children, document.body);
};

const normalizeKey = (key) => {
    return key
        ?.toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
};

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
    "shippingType", "shippingCharge",
    "price", "previous_price", "features",
];

const LABEL_TO_KEY_MAP = Object.fromEntries(
    Object.entries(COLUMN_LABELS).map(([key, label]) => [
        normalizeKey(label),
        key
    ])
);
const TEMPLATE_COLUMNS = [
    { key: "name", label: "Name", required: true, example: "Industrial Water Pump" },
    { key: "description", label: "Description", required: true, example: "High-performance pump for industrial use" },
    { key: "brand", label: "Brand", required: true, example: "Kirloskar" },
    { key: "category", label: "Category", required: true, example: "Machinery" },
    { key: "subCategory", label: "Sub Category", required: true, example: "Pumps" },
    { key: "subSubCategory", label: "Sub Sub Category", required: true, example: "Centrifugal Pumps" },
    { key: "shippingType", label: "Shipping Type", required: true, example: "free | extra | actual" },
    { key: "shippingCharge", label: "Shipping Charge", required: true, example: "0 or 500" },
    { key: "price", label: "Price", required: true, example: "25000" },
    { key: "previous_price", label: "Previous Price", required: true, example: "28000" },
    { key: "features", label: "Features", required: true, example: "Rust-proof, High RPM, Low noise" },
];
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
        <p className="text-sm font-semibold text-green-700">
            All rows are valid and ready to submit!
        </p>
    </div>
);
const WarningBanner = ({ invalidCount }) => (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <FiAlertCircle className="text-amber-600 mt-1" />
        <div>
            <p className="text-sm font-semibold text-amber-800">
                {invalidCount} row{invalidCount > 1 ? "s" : ""} have issues
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
                Only valid rows will be submitted.
            </p>
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
            title: "Excel / CSV",
            desc: "Upload .xlsx or .csv",
            color: "from-blue-500 to-blue-600",
            bg: "bg-blue-50",
            text: "text-blue-600",
        },
        {
            icon: <FiCheckCircle />,
            title: "Auto Validate",
            desc: "Instant field checks",
            color: "from-green-500 to-emerald-600",
            bg: "bg-green-50",
            text: "text-green-600",
        },
        {
            icon: <FiEdit3 />,
            title: "Fix & Submit",
            desc: "Edit before saving",
            color: "from-purple-500 to-indigo-600",
            bg: "bg-purple-50",
            text: "text-purple-600",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-3 mb-5">
            {cards.map((c) => (
                <div
                    key={c.title}
                    className="group flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200"
                >
                    {/* Icon */}
                    <div
                        className={`w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br ${c.color} text-white shadow-sm`}
                    >
                        <span className="text-sm">{c.icon}</span>
                    </div>

                    {/* Text */}
                    <div className="leading-tight">
                        <div className="text-xs font-semibold text-gray-800">
                            {c.title}
                        </div>
                        <div className="text-[11px] text-gray-500">
                            {c.desc}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const StepIndicator = ({ current }) => {
    const steps = [
        { n: 1, label: "Upload File" },
        { n: 2, label: "Preview & Fix" },
        { n: 3, label: "Submit" },
    ];

    return (
        <div className="flex items-center gap-0">
            {steps.map((s, i) => (
                <React.Fragment key={s.n}>
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${current >= s.n
                                ? "bg-[#00569e] border-[#00569e] text-white"
                                : "border-gray-300 text-gray-400 bg-white"
                                }`}
                        >
                            {current > s.n ? <FiCheck size={16} /> : s.n}
                        </div>
                        <span className={`text-xs mt-1 font-medium whitespace-nowrap ${current >= s.n ? "text-[#00569e]" : "text-gray-400"
                            }`}>
                            {s.label}
                        </span>
                    </div>

                    {i < steps.length - 1 && (
                        <div className={`h-0.5 w-16 mb-4 mx-1 ${current > s.n ? "bg-[#00569e]" : "bg-gray-200"
                            }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const validateRow = (row) => {
    const errors = {};

    // ─── STRING REQUIRED FIELDS ─────────────────────────────
    if (!row.name?.trim()) errors.name = "Name is required";
    else if (row.name.length < 3) errors.name = "Name too short";

    if (!row.description?.trim()) errors.description = "Description is required";
    else if (row.description.length < 10) errors.description = "Description too short";

    if (!row.brand?.trim()) errors.brand = "Brand is required";

    if (!row.category?.trim()) errors.category = "Category is required";

    if (!row.subCategory?.trim()) errors.subCategory = "Sub Category is required";

    if (!row.subSubCategory?.trim()) errors.subSubCategory = "Sub Sub Category is required";


    // ─── SHIPPING TYPE ─────────────────────────────────────
    const validShipping = ["free", "extra", "actual"];
    if (!row.shippingType || !validShipping.includes(row.shippingType)) {
        errors.shippingType = "Must be free, extra or actual";
    }


    // ─── SHIPPING CHARGE ───────────────────────────────────
    if (row.shippingType === "extra" && !row.shippingCharge) {
        errors.shippingCharge = "Required when shippingType is 'extra'";
    }

    // ─── PRICE ─────────────────────────────────────────────
    if (row.price === "" || isNaN(row.price)) {
        errors.price = "Price is required";
    } else if (Number(row.price) <= 0) {
        errors.price = "Price must be greater than 0";
    }


    // ─── PREVIOUS PRICE (OPTIONAL BUT VALIDATED IF PRESENT) ─
    if (row.previous_price !== "" && !isNaN(row.previous_price)) {
        if (Number(row.previous_price) < Number(row.price)) {
            errors.previous_price = "Previous price should be >= price";
        }
    }


    // ─── FEATURES (REQUIRED IN YOUR SCHEMA) ────────────────
    if (!row.features?.trim()) {
        errors.features = "Features required";
    } else if (row.features.split(",").length < 1) {
        errors.features = "At least one feature required";
    }


    return errors;
};

const parseExcelRow = (row) => {
    return {
        name: row["name"]?.trim() || "",
        description: row["description"]?.trim() || "",
        brand: row["brand"]?.trim() || "",
        category: row["category"]?.trim() || "",
        subCategory: row["subCategory"]?.trim() || "",
        subSubCategory: row["subSubCategory"]?.trim() || "",

        shippingType: row["shippingType"]?.toLowerCase().trim() || "free",

        shippingCharge:
            row["shippingCharge"] !== undefined && row["shippingCharge"] !== ""
                ? Number(row["shippingCharge"])
                : 0,

        price:
            row["price"] !== undefined && row["price"] !== ""
                ? Number(row["price"])
                : "",

        previous_price:
            row["previous_price"] !== undefined && row["previous_price"] !== ""
                ? Number(row["previous_price"])
                : "",

        features: row["features"]?.trim() || "",

    };
};

const TemplateModal = ({ onClose }) => {
    const downloadTemplate = () => {
        const headers = TEMPLATE_COLUMNS.map(
            col => COLUMN_LABELS[col.key] || col.key
        );

        const exampleRow = TEMPLATE_COLUMNS.reduce((acc, col) => {
            const label = COLUMN_LABELS[col.key] || col.key;
            acc[label] = col.example;
            return acc;
        }, {});

        const worksheet = XLSX.utils.json_to_sheet([exampleRow], {
            header: headers,
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

        XLSX.writeFile(workbook, "product_upload_template.xlsx");
    };

    return (
        <Portal>
            <div className="fixed inset-0 b-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">

                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Excel Template Guide</h2>
                            <p className="text-sm text-gray-500">Only required fields are needed for upload</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={downloadTemplate}
                                className="px-3 py-1.5 text-sm bg-[#00569e] text-white rounded-lg hover:bg-[#00457c]"
                            >
                                Download Template
                            </button>

                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                                <FiX size={18} />
                            </button>
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
                                        <tr key={COLUMN_LABELS[col.key] || col.key} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                                            <td className="px-4 py-2.5 font-mono text-[#00569e]">{COLUMN_LABELS[col.key] || col.key}</td>
                                            <td className="px-4 py-2.5">
                                                {col.required ? "Required" : "Optional"}
                                            </td>
                                            <td className="px-4 py-2.5 text-gray-600 text-xs">{col.example}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* UPDATED NOTES */}
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <p className="text-sm font-semibold text-blue-800 mb-2">
                                Upload Rules
                            </p>

                            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                                <li>Only these columns are required. Do not rename headers.</li>
                                <li>Maximum 50 rows per upload.</li>
                                <li><strong>shippingType</strong> must be: free, extra, or actual</li>
                                <li>If shippingType = <strong>extra</strong>, shippingCharge is required</li>
                                <li><strong>price</strong> must be greater than 0</li>
                                <li><strong>previous_price</strong> should be greater than or equal to price</li>
                                <li><strong>features</strong> must be comma-separated values</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </Portal>
    );
};

const UploadDropZone = ({
    isDragging,
    isProcessing,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    fileInputRef,
    handleFileSelect,
}) => (
    <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer ${isDragging ? "border-[#00569e] bg-blue-50" : "border-gray-300 bg-white"
            }`}
    >
        <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
        />

        {isProcessing ? (
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#00569e] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#00569e]">Parsing...</p>
            </div>
        ) : (
            <>
                <div className="w-16 h-16 bg-[#00569e]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiUpload size={28} className="text-[#00569e]" />
                </div>

                <p className="text-lg font-semibold">
                    {isDragging ? "Drop it here" : "Drag & drop file"}
                </p>

                <p className="text-sm text-gray-500 mb-4">or click</p>

                <span className="bg-[#00569e] text-white px-5 py-2 rounded-lg">
                    Choose File
                </span>
            </>
        )}
    </div>
);

const ParsedTable = ({
    rows,
    rowErrors,
    setParsedRows,
    setRowErrors,
}) => {

    if (!rows.length) return null;

    const columns = Object.keys(rows[0]);

    const handleRemove = (index) => {
        setParsedRows(prev => prev.filter((_, i) => i !== index));
        setRowErrors(prev => {
            const copy = { ...prev };
            delete copy[index];
            return copy;
        });
    };

    const handleImageUpload = (index, file) => {
        setParsedRows(prev => {
            const updated = [...prev];
            updated[index].image = file;
            return updated;
        });
    };

    const renderCell = (value) => {
        if (value === null || value === undefined || value === "") return "-";

        if (typeof value === "object") {
            return (
                <span className="text-xs text-gray-500">
                    {JSON.stringify(value).slice(0, 50)}...
                </span>
            );
        }

        return String(value);
    };

    return (
        <div className="overflow-x-auto mb-4 border rounded-xl bg-white shadow-sm">
            <table className="min-w-[1200px] text-sm">

                {/* HEADER */}
                <thead className="bg-[#00569e] text-white sticky top-0">
                    <tr>
                        <th className="px-3 py-2">Image</th>

                        {columns.map(col => (
                            <th key={col} className="px-3 py-2 text-left whitespace-nowrap">
                                {COLUMN_LABELS[col] || col}
                            </th>
                        ))}

                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Actions</th>
                    </tr>
                </thead>

                {/* BODY */}
                <tbody>
                    {rows.map((row, index) => {
                        const hasError = !!rowErrors[index];

                        return (
                            <tr
                                key={index}
                                className={`border-b ${hasError ? "bg-red-50" : "hover:bg-gray-50"
                                    }`}
                            >

                                {/* IMAGE */}
                                <td className="px-3 py-2">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) =>
                                                e.target.files[0] &&
                                                handleImageUpload(index, e.target.files[0])
                                            }
                                        />

                                        {row.image ? (
                                            <img
                                                src={URL.createObjectURL(row.image)}
                                                alt="preview"
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                                Upload
                                            </div>
                                        )}
                                    </label>
                                </td>

                                {/* ALL FIELDS */}
                                {columns.map(col => (
                                    <td key={col} className="px-3 py-2 max-w-[200px] truncate">
                                        {renderCell(row[col])}
                                    </td>
                                ))}

                                {/* STATUS */}
                                <td className="px-3 py-2">
                                    {hasError ? (
                                        <span className="text-red-600 text-xs font-semibold">
                                            Invalid
                                        </span>
                                    ) : (
                                        <span className="text-green-600 text-xs font-semibold">
                                            Valid
                                        </span>
                                    )}
                                </td>

                                {/* ACTIONS */}
                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                        Remove
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

const ProductBulkUpload = () => {
    const [step, setStep] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [parseError, setParseError] = useState(null);
    const [parsedRows, setParsedRows] = useState([]);
    const [rowErrors, setRowErrors] = useState({});
    const [showTemplate, setShowTemplate] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const processFile = useCallback((f) => {
        setParseError(null);
        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                const normalizedRows = rawRows.map((row) => {
                    const newRow = {};

                    Object.keys(row).forEach((key) => {
                        const normalized = normalizeKey(key);

                        const mappedKey = LABEL_TO_KEY_MAP[normalized];

                        if (mappedKey) {
                            newRow[mappedKey] = row[key];
                        }
                    });

                    return newRow;
                });

                if (rawRows.length === 0) {
                    setParseError("The file is empty. Please add at least one product row.");
                    setIsProcessing(false);
                    return;
                }
                if (rawRows.length > 50) {
                    setParseError(`File contains ${rawRows.length} rows. Maximum allowed is 50 rows per upload.`);
                    setIsProcessing(false);
                    return;
                }

                // Check required columns
                const fileColumns = Object.keys(normalizedRows[0]);
                const missing = REQUIRED_COLUMNS.filter(
                    (col) => !fileColumns.includes(col)
                );
                
                const missingLabels = missing.map(key => COLUMN_LABELS[key]);
                if (missing.length > 0) {
                    setParseError(
                        `Missing required columns: ${missingLabels.join(", ")}. Please use the provided template.`
                    );
                    setIsProcessing(false);
                    return;
                }

                const parsed = normalizedRows.map((r) => parseExcelRow(r));

                // Validate all rows immediately
                const errors = {};
                parsed.forEach((row, i) => {
                    const errs = validateRow(row);
                    if (Object.keys(errs).length > 0) errors[i] = errs;
                });

                setParsedRows(parsed);
                setRowErrors(errors);
                setStep(2);
            } catch (err) {
                setParseError("Failed to parse file. Ensure it is a valid .xlsx or .csv file.");
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

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFileSelect(f);
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);


    const validCount = parsedRows.filter((_, i) => !rowErrors[i]).length;
    const invalidCount = parsedRows.length - validCount;


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans">
            {showTemplate && <TemplateModal onClose={() => setShowTemplate(false)} />}

            {/* Header */}
            <div className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">

                    {/* Left Section */}
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

                    {/* Right Section */}
                    <div className="flex items-center">
                        <StepIndicator current={step} />
                    </div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="max-w-3xl mx-auto">

                        <InfoCards />

                        <UploadDropZone {...{
                            isDragging,
                            isProcessing,
                            handleDrop,
                            handleDragOver,
                            handleDragLeave,
                            fileInputRef,
                            handleFileSelect
                        }} />

                        {parseError && <ErrorBanner message={parseError} />}

                        <div className="mt-6 p-4 bg-[#00569e]/5 border rounded-xl flex justify-between">
                            <div className="flex gap-3 items-center">
                                <FiClipboard />
                                <div>
                                    <p className="text-sm font-semibold">Need the template?</p>
                                    <p className="text-xs text-gray-500">View required format</p>
                                </div>
                            </div>

                            <button onClick={() => setShowTemplate(true)} className="text-[#00569e] font-semibold">
                                View Guide →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">

                            {/* Left Section: Title + Stats */}
                            <div className="flex items-center gap-5">

                                {/* Title */}
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        Review Parsed Products
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        {parsedRows.length} rows found
                                    </p>
                                </div>

                                {/* Stats */}
                                <StatsRow
                                    total={parsedRows.length}
                                    valid={validCount}
                                    invalid={invalidCount}
                                />

                            </div>

                            {/* Right Section: Actions */}
                            <div className="flex items-center gap-2 sm:gap-3">

                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition"
                                >
                                    <FiArrowLeft className="text-sm" />
                                    <span className="hidden sm:inline">Upload Different File</span>
                                </button>

                                <button
                                    disabled={validCount === 0}
                                    onClick={() => setStep(3)}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-[#00569e] text-white rounded-md text-sm hover:bg-[#00457c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="hidden sm:inline">Continue</span>
                                    <FiArrowRight className="text-sm" />
                                </button>

                            </div>

                        </div>

                        <ParsedTable
                            rows={parsedRows}
                            rowErrors={rowErrors}
                            setParsedRows={setParsedRows}
                            setRowErrors={setRowErrors}
                        />

                        {invalidCount === 0 && <SuccessBanner />}

                        {invalidCount > 0 && <WarningBanner invalidCount={invalidCount} />}

                        <div className="mt-4 flex justify-end">
                            <button
                                disabled={validCount === 0}
                                onClick={() => setStep(3)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#00569e] text-white rounded-xl font-semibold"
                            >
                                Continue with {validCount} valid products
                                <FiArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className="max-w-lg mx-auto text-center py-20">
                        <div className="w-16 h-16 bg-[#00569e]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FiFileText size={28} className="text-[#00569e]" />
                        </div>

                        <h2 className="text-xl font-bold">Phase 3 Coming Next</h2>

                        <button onClick={() => setStep(2)} className="text-[#00569e] mt-4 font-semibold">
                            Back to Preview
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductBulkUpload;