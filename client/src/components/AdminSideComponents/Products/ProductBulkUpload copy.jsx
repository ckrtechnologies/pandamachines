import React, { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";

// ─── Constants ────────────────────────────────────────────────────────────────

const REQUIRED_COLUMNS = [
  "name", "description", "brand", "category", "subCategory", "subSubCategory",
  "gstPercentage", "shippingType", "shippingCharge", "size_type",
  "price", "previous_price", "price_by_measurement", "hasVariants", "variants",
  "features", "return_policy", "warranty", "stock_status",
  "measurement", "material", "productType",
];

const TEMPLATE_COLUMNS = [
  { key: "name", label: "Name", required: true, example: "Industrial Water Pump" },
  { key: "description", label: "Description", required: true, example: "High-performance pump for industrial use" },
  { key: "brand", label: "Brand", required: true, example: "Kirloskar" },
  { key: "category", label: "Category", required: true, example: "Machinery" },
  { key: "subCategory", label: "Sub Category", required: true, example: "Pumps" },
  { key: "subSubCategory", label: "Sub Sub Category", required: true, example: "Centrifugal Pumps" },
  { key: "gstPercentage", label: "GST %", required: true, example: "18" },
  { key: "shippingType", label: "Shipping Type", required: true, example: "free | extra | actual" },
  { key: "shippingCharge", label: "Shipping Charge", required: false, example: "0" },
  { key: "size_type", label: "Size Type", required: true, example: "single | multiple" },
  { key: "price", label: "Price", required: false, example: "25000 (if single)" },
  { key: "previous_price", label: "Previous Price", required: false, example: "28000" },
  { key: "price_by_measurement", label: "Price By Measurement", required: false, example: "500ml:100:120, 1L:180:200" },
  { key: "hasVariants", label: "Has Variants", required: false, example: "true | false" },
  { key: "variants", label: "Variants", required: false, example: "64GB:25000:30000, 128GB:30000" },
  { key: "features", label: "Features", required: false, example: "Rust-proof, High RPM, Low noise" },
  { key: "return_policy", label: "Return Policy", required: false, example: "7 days return" },
  { key: "warranty", label: "Warranty", required: false, example: "true:365 days | false" },
  { key: "stock_status", label: "Stock Status", required: false, example: "active | inactive" },
  { key: "measurement", label: "Measurement", required: false, example: "kg | litre" },
  { key: "material", label: "Material", required: false, example: "Stainless Steel" },
  { key: "productType", label: "Product Type", required: false, example: "Industrial" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseWarranty = (val) => {
  if (!val) return { hasWarranty: false, warrantyDays: "0 days" };
  const str = String(val).trim().toLowerCase();
  if (str === "false" || str === "0") return { hasWarranty: false, warrantyDays: "0 days" };
  if (str.startsWith("true:")) {
    const days = str.replace("true:", "").trim();
    return { hasWarranty: true, warrantyDays: days };
  }
  return { hasWarranty: false, warrantyDays: "0 days" };
};

const parseVariants = (val) => {
  if (!val) return [];
  return String(val).split(",").map((v, i) => {
    const parts = v.trim().split(":");
    return {
      model: parts[0]?.trim() || "",
      price: parseFloat(parts[1]) || 0,
      previous_price: parseFloat(parts[2]) || undefined,
      isDefault: i === 0,
    };
  }).filter((v) => v.model || v.price);
};

const parsePriceByMeasurement = (val) => {
  if (!val) return [];
  const entries = String(val).split(",").map((v) => {
    const parts = v.trim().split(":");
    return {
      measurement: parts[0]?.trim() || "",
      price: parseFloat(parts[1]) || 0,
      previous_price: parseFloat(parts[2]) || undefined,
    };
  }).filter((e) => e.measurement && e.price);
  if (entries.length === 0) return [];
  return [{ measurementLabel: "Size", allPrice: entries }];
};

const parseFeatures = (val) => {
  if (!val) return [];
  return String(val).split(",").map((f) => f.trim()).filter(Boolean);
};

const validateRow = (row) => {
  const errors = {};
  if (!row.name?.trim()) errors.name = "Name is required";
  if (!row.description?.trim()) errors.description = "Description is required";
  if (!row.brand?.trim()) errors.brand = "Brand is required";
  if (!row.category?.trim()) errors.category = "Category is required";
  if (!row.subCategory?.trim()) errors.subCategory = "Sub Category is required";
  if (!row.subSubCategory?.trim()) errors.subSubCategory = "Sub Sub Category is required";
  if (row.gstPercentage === undefined || row.gstPercentage === "") errors.gstPercentage = "GST % is required";
  if (!["free", "extra", "actual"].includes(row.shippingType)) errors.shippingType = "Must be free, extra or actual";
  if (!["single", "multiple"].includes(row.size_type)) errors.size_type = "Must be single or multiple";

  const hasVariants = row.hasVariants === true || String(row.hasVariants).toLowerCase() === "true";
  if (!hasVariants) {
    if (row.size_type === "single" && (row.price === undefined || row.price === "")) {
      errors.price = "Price required for single size type";
    }
    if (row.size_type === "multiple") {
      const pbm = parsePriceByMeasurement(row.price_by_measurement);
      if (!pbm.length) errors.price_by_measurement = "Price by measurement required for multiple size type";
    }
  } else {
    const variants = parseVariants(row.variants);
    if (!variants.length) errors.variants = "At least one variant required";
  }
  return errors;
};

const parseExcelRow = (row) => {
  return {
    name: row["name"] || "",
    description: row["description"] || "",
    brand: row["brand"] || "",
    category: row["category"] || "",
    subCategory: row["subCategory"] || "",
    subSubCategory: row["subSubCategory"] || "",
    gstPercentage: row["gstPercentage"] !== undefined ? Number(row["gstPercentage"]) : "",
    shippingType: row["shippingType"] || "free",
    shippingCharge: row["shippingCharge"] !== undefined ? Number(row["shippingCharge"]) : 0,
    size_type: row["size_type"] || "single",
    price: row["price"] !== undefined ? Number(row["price"]) : "",
    previous_price: row["previous_price"] !== undefined ? Number(row["previous_price"]) : "",
    price_by_measurement: row["price_by_measurement"] || "",
    hasVariants: String(row["hasVariants"] || "false").toLowerCase() === "true",
    variants: row["variants"] || "",
    features: row["features"] || "",
    return_policy: row["return_policy"] || "",
    warranty: row["warranty"] || "false",
    stock_status: row["stock_status"] || "active",
    measurement: row["measurement"] || "",
    material: row["material"] || "",
    productType: row["productType"] || "",
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                current >= s.n
                  ? "bg-[#00569e] border-[#00569e] text-white"
                  : "border-gray-300 text-gray-400 bg-white"
              }`}
            >
              {current > s.n ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : s.n}
            </div>
            <span className={`text-xs mt-1 font-medium whitespace-nowrap ${current >= s.n ? "text-[#00569e]" : "text-gray-400"}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-16 mb-4 mx-1 transition-all duration-500 ${current > s.n ? "bg-[#00569e]" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const StatBadge = ({ count, label, color }) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${color}`}>
    <span className="text-xl font-bold">{count}</span>
    <span className="text-sm">{label}</span>
  </div>
);

const TemplateModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Excel Template Guide</h2>
          <p className="text-sm text-gray-500">Use these exact column headers in your file</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="overflow-y-auto flex-1 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#00569e] text-white">
                <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Column Header</th>
                <th className="px-4 py-3 text-left font-semibold">Required</th>
                <th className="px-4 py-3 text-left font-semibold rounded-tr-lg">Example Value</th>
              </tr>
            </thead>
            <tbody>
              {TEMPLATE_COLUMNS.map((col, i) => (
                <tr key={col.key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-2.5 font-mono text-[#00569e] font-medium">{col.key}</td>
                  <td className="px-4 py-2.5">
                    {col.required ? (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Required</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Optional</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 text-xs">{col.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm font-semibold text-amber-800 mb-2">⚡ Format Notes</p>
          <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
            <li><strong>variants:</strong> model:price:prev_price separated by commas — e.g. <code>64GB:25000:30000, 128GB:30000</code></li>
            <li><strong>price_by_measurement:</strong> size:price:prev_price — e.g. <code>500ml:100:120, 1L:180</code></li>
            <li><strong>warranty:</strong> <code>true:30 days</code> or <code>false</code></li>
            <li><strong>features:</strong> comma-separated values</li>
            <li>Max <strong>50 rows</strong> per upload</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ProductBulkUpload = () => {
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [rowErrors, setRowErrors] = useState({});
  const [showTemplate, setShowTemplate] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // ── File Processing ──────────────────────────────────────────────────────────

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
        const fileColumns = Object.keys(rawRows[0]);
        const missing = REQUIRED_COLUMNS.filter(
          (col) => !fileColumns.includes(col)
        );
        if (missing.length > 0) {
          setParseError(
            `Missing required columns: ${missing.join(", ")}. Please use the provided template.`
          );
          setIsProcessing(false);
          return;
        }

        const parsed = rawRows.map((r) => parseExcelRow(r));

        // Validate all rows immediately
        const errors = {};
        parsed.forEach((row, i) => {
          const errs = validateRow(row);
          if (Object.keys(errs).length > 0) errors[i] = errs;
        });

        setParsedRows(parsed);
        setRowErrors(errors);
        setFile(f);
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

  // ── Stats ────────────────────────────────────────────────────────────────────

  const validCount = parsedRows.filter((_, i) => !rowErrors[i]).length;
  const invalidCount = parsedRows.length - validCount;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showTemplate && <TemplateModal onClose={() => setShowTemplate(false)} />}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00569e] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">Bulk Product Upload</h1>
              <p className="text-xs text-gray-500">Upload up to 50 products via Excel</p>
            </div>
          </div>
          <StepIndicator current={step} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── STEP 1: Upload ────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            {/* Info cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: "📄", title: "Excel / CSV", desc: "Upload .xlsx or .csv files" },
                { icon: "🔍", title: "Auto Validate", desc: "Fields checked instantly" },
                { icon: "✏️", title: "Fix & Submit", desc: "Correct errors in preview" },
              ].map((c) => (
                <div key={c.title} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="text-sm font-semibold text-gray-800">{c.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-[#00569e] bg-blue-50 scale-[1.01]"
                  : "border-gray-300 bg-white hover:border-[#00569e] hover:bg-blue-50/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv,.xls"
                className="hidden"
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
              />

              {isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-[#00569e] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-[#00569e]">Parsing your file...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#00569e]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#00569e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-1">
                    {isDragging ? "Drop it here!" : "Drag & drop your file"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                  <span className="inline-block bg-[#00569e] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#004a87] transition-colors">
                    Choose File
                  </span>
                  <p className="text-xs text-gray-400 mt-4">.xlsx or .csv • Max 50 products</p>
                </>
              )}
            </div>

            {/* Error message */}
            {parseError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-700">Upload Error</p>
                  <p className="text-xs text-red-600 mt-0.5">{parseError}</p>
                </div>
              </div>
            )}

            {/* Template guide */}
            <div className="mt-6 p-4 bg-[#00569e]/5 border border-[#00569e]/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00569e]/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📋</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Need the template?</p>
                  <p className="text-xs text-gray-500">View required column headers and format guide</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowTemplate(true); }}
                className="text-sm text-[#00569e] font-semibold hover:underline"
              >
                View Guide →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Preview ───────────────────────────────────────────────── */}
        {step === 2 && (
          <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Review Parsed Products</h2>
                <p className="text-sm text-gray-500">
                  From: <span className="font-medium text-gray-700">{file?.name}</span>
                  <span className="mx-2 text-gray-300">·</span>
                  {parsedRows.length} rows found
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setStep(1); setFile(null); setParsedRows([]); setRowErrors({}); setParseError(null); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Upload Different File
                </button>
                <button
                  disabled={validCount === 0}
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-5 py-2 text-sm bg-[#00569e] text-white rounded-lg hover:bg-[#004a87] disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Continue to Submit
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mb-6">
              <StatBadge count={parsedRows.length} label="Total Rows" color="border-gray-200 text-gray-700" />
              <StatBadge count={validCount} label="Valid" color="border-green-200 text-green-700 bg-green-50" />
              <StatBadge count={invalidCount} label="Need Fixes" color={`border-red-200 text-red-700 bg-red-50 ${invalidCount === 0 ? "opacity-40" : ""}`} />
            </div>

            {/* All valid banner */}
            {invalidCount === 0 && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-green-700">All rows are valid and ready to submit!</p>
              </div>
            )}

            {/* Horizontal scrollable table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[160px]">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[100px]">Brand</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[120px]">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[130px]">Sub Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[140px]">Sub Sub Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[80px]">Size Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[80px]">Price (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[70px]">GST %</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[100px]">Shipping</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[80px]">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[100px]">Variants</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[80px]">Errors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedRows.map((row, i) => {
                      const errors = rowErrors[i] || {};
                      const hasErrors = Object.keys(errors).length > 0;
                      const cellCls = (field) =>
                        errors[field]
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "";

                      return (
                        <tr
                          key={i}
                          className={`transition-colors ${hasErrors ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-gray-50"}`}
                        >
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                          <td className="px-4 py-3">
                            {hasErrors ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                Error
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                Valid
                              </span>
                            )}
                          </td>
                          <td className={`px-4 py-3 font-medium text-gray-800 ${cellCls("name")}`}>
                            <div className="max-w-[150px] truncate" title={row.name}>
                              {row.name || <span className="text-red-400 italic">Missing</span>}
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-gray-600 ${cellCls("brand")}`}>
                            <div className="max-w-[90px] truncate" title={row.brand}>
                              {row.brand || <span className="text-red-400 italic">Missing</span>}
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-gray-600 ${cellCls("category")}`}>
                            <div className="max-w-[110px] truncate" title={row.category}>
                              {row.category || <span className="text-red-400 italic">Missing</span>}
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-gray-600 ${cellCls("subCategory")}`}>
                            <div className="max-w-[120px] truncate" title={row.subCategory}>
                              {row.subCategory || <span className="text-red-400 italic">Missing</span>}
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-gray-600 ${cellCls("subSubCategory")}`}>
                            <div className="max-w-[130px] truncate" title={row.subSubCategory}>
                              {row.subSubCategory || <span className="text-red-400 italic">Missing</span>}
                            </div>
                          </td>
                          <td className={`px-4 py-3 ${cellCls("size_type")}`}>
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                              row.size_type === "single"
                                ? "bg-blue-100 text-blue-700"
                                : row.size_type === "multiple"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-red-100 text-red-600"
                            }`}>
                              {row.size_type || "—"}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-gray-800 font-medium ${cellCls("price")}`}>
                            {row.hasVariants
                              ? <span className="text-xs text-gray-400 italic">via variants</span>
                              : row.size_type === "multiple"
                              ? <span className="text-xs text-purple-600 italic">multi</span>
                              : row.price !== "" && row.price !== undefined
                              ? `₹${Number(row.price).toLocaleString()}`
                              : <span className="text-red-400 italic text-xs">Missing</span>
                            }
                          </td>
                          <td className={`px-4 py-3 text-gray-600 ${cellCls("gstPercentage")}`}>
                            {row.gstPercentage !== "" ? `${row.gstPercentage}%` : <span className="text-red-400 italic text-xs">Missing</span>}
                          </td>
                          <td className={`px-4 py-3 ${cellCls("shippingType")}`}>
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                              row.shippingType === "free" ? "bg-green-100 text-green-700" :
                              row.shippingType === "extra" ? "bg-orange-100 text-orange-700" :
                              row.shippingType === "actual" ? "bg-gray-100 text-gray-600" :
                              "bg-red-100 text-red-600"
                            }`}>
                              {row.shippingType || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                              row.stock_status === "active" ? "bg-green-100 text-green-700" :
                              row.stock_status === "inactive" ? "bg-gray-100 text-gray-500" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                              {row.stock_status || "active"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {row.hasVariants
                              ? <span className="text-xs text-[#00569e] font-medium">
                                  {parseVariants(row.variants).length} variant(s)
                                </span>
                              : <span className="text-xs text-gray-400">—</span>
                            }
                          </td>
                          <td className="px-4 py-3">
                            {hasErrors ? (
                              <div className="group relative">
                                <button className="text-xs text-red-600 font-medium underline underline-offset-2">
                                  {Object.keys(errors).length} issue{Object.keys(errors).length > 1 ? "s" : ""}
                                </button>
                                {/* Tooltip */}
                                <div className="absolute right-0 top-full mt-1 w-56 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-10 hidden group-hover:block">
                                  <p className="font-semibold mb-1.5 text-red-300">Errors in row {i + 1}:</p>
                                  <ul className="space-y-1">
                                    {Object.entries(errors).map(([field, msg]) => (
                                      <li key={field} className="flex gap-1.5">
                                        <span className="text-red-400 shrink-0">•</span>
                                        <span><span className="text-gray-300">{field}:</span> {msg}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-green-600">✓ OK</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom note */}
            {invalidCount > 0 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    {invalidCount} row{invalidCount > 1 ? "s" : ""} have issues
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    In the next phase, you'll be able to fix errors row-by-row using dropdowns and inline editing.
                    Only valid rows will be submitted to the database. Rows with unresolved errors will be skipped.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                disabled={validCount === 0}
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#00569e] text-white rounded-xl font-semibold hover:bg-[#004a87] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Continue with {validCount} valid product{validCount !== 1 ? "s" : ""}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 Placeholder ────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="w-16 h-16 bg-[#00569e]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#00569e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Phase 3 Coming Next</h2>
            <p className="text-sm text-gray-500 mb-6">
              The fix & submit panel — with dependent category dropdowns, image uploads, inline editing, and final API submission — will be built here.
            </p>
            <button
              onClick={() => setStep(2)}
              className="text-sm text-[#00569e] font-semibold hover:underline"
            >
              ← Back to Preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBulkUpload;