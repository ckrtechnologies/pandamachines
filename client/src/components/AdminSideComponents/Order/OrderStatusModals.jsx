import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MdClose, MdCheckCircle, MdCancel, MdLocalShipping, MdPending, MdSwapHoriz } from "react-icons/md";
import uploadToCloudinary from "../../../utils/uploadToCloudinary.js";

export const STATUS_FLOW = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Processing", "Cancelled"],
    Processing: ["Shipped", "Cancelled"],
    Shipped: ["Delivered", "Cancelled"],
    Delivered: [],
    Cancelled: [],
    Returned: [],
};

export const STATUS_DISPLAY = {
    Pending: { label: "Pending", color: "text-amber-600" },
    Confirmed: { label: "Confirmed", color: "text-sky-700" },
    Processing: { label: "Processing", color: "text-violet-700" },
    Shipped: { label: "Shipped", color: "text-blue-700" },
    Delivered: { label: "Delivered", color: "text-emerald-700" },
    Cancelled: { label: "Cancelled", color: "text-rose-700" },
    Returned: { label: "Returned", color: "text-orange-700" },
};

export const EXCHANGE_STATUS_DISPLAY = {
    Requested: { label: "Requested", color: "text-amber-600" },
    Approved: { label: "Approved", color: "text-emerald-600" },
    Completed: { label: "Completed", color: "text-sky-600" },
    Rejected: { label: "Rejected", color: "text-rose-600" },
};

export const EXCHANGE_NEXT = {
    Requested: ["Approved", "Rejected"],
    Approved: ["Completed", "Rejected"],
    Completed: [],
    Rejected: [],
};

const Spinner = () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
);

const getStatusIcon = (status) => {
    const sz = 56;
    switch (status) {
        case "Pending": return <MdPending size={sz} className="text-amber-400" />;
        case "Confirmed": return <MdCheckCircle size={sz} className="text-sky-400" />;
        case "Processing": return <MdSwapHoriz size={sz} className="text-violet-400" />;
        case "Shipped": return <MdLocalShipping size={sz} className="text-blue-500" />;
        case "Delivered": return <MdCheckCircle size={sz} className="text-emerald-400" />;
        case "Cancelled": return <MdCancel size={sz} className="text-rose-400" />;
        default: return <MdPending size={sz} className="text-gray-400" />;
    }
};

// ─── StatusChangeModal ────────────────────────────────────────────────────────
/**
 * Props:
 *   isOpen        boolean
 *   onClose       () => void
 *   orderId       string   – mongo _id of the order
 *   currentStatus string
 *   onSuccess     () => void  – called after a successful update
 */
export const StatusChangeModal = ({ isOpen, onClose, orderId, currentStatus, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStatus, setSelected] = useState("");
    const [selectedFile, setFile] = useState(null);
    const [fileError, setFileError] = useState("");
    const [imagePreview, setPreview] = useState(null);
    const previewRef = useRef(null);

    const available = STATUS_FLOW[currentStatus] || [];

    useEffect(() => {
        if (isOpen) {
            setSelected(available[0] || "");
            setFile(null);
            setFileError("");
            setPreview(null);
        }
    }, [isOpen, currentStatus]); // eslint-disable-line

    // revoke blob on unmount
    useEffect(() => () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current); }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileError("");
        if (previewRef.current) { URL.revokeObjectURL(previewRef.current); previewRef.current = null; }
        setPreview(null);
        if (!file) return;
        if (!["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type)) {
            setFileError("Please select a valid image (JPEG, PNG or GIF)");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { setFileError("File must be under 5MB"); return; }
        setFile(file);
        previewRef.current = URL.createObjectURL(file);
        setPreview(previewRef.current);
    };

    const handleConfirm = async () => {
        if (!selectedStatus) return;
        const needsPOD = selectedStatus === "Delivered" && currentStatus === "Shipped";
        if (needsPOD && !selectedFile) { setFileError("Please upload a delivery confirmation image"); return; }
        setIsLoading(true);
        try {
            let pod_img_url = null;
            if (selectedFile) {
                pod_img_url = await uploadToCloudinary(selectedFile);
                if (!pod_img_url) { setFileError("Image upload failed. Try again."); setIsLoading(false); return; }
            }
            await axios.put(
                `${process.env.REACT_APP_API_URL}/orders/update-order-status/${orderId}`,
                { status: selectedStatus, ...(pod_img_url && { pod_img_url }) },
                { headers: { "Content-Type": "application/json" } }
            );
            onSuccess?.();
            handleClose();
        } catch (err) {
            console.error("[StatusChangeModal]", err);
            setFileError("Failed to update status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (previewRef.current) { URL.revokeObjectURL(previewRef.current); previewRef.current = null; }
        setSelected(""); setFile(null); setFileError(""); setPreview(null);
        onClose();
    };

    if (!isOpen) return null;

    const showPOD = selectedStatus === "Delivered" && currentStatus === "Shipped";
    const currentCfg = STATUS_DISPLAY[currentStatus] || { label: currentStatus, color: "text-gray-700" };
    const selectedCfg = STATUS_DISPLAY[selectedStatus];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 pt-6 pb-4 text-center">
                    <button onClick={handleClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <MdClose size={20} />
                    </button>
                    <div className="flex justify-center mb-3">{getStatusIcon(currentStatus)}</div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Current Status</p>
                    <p className={`text-lg font-bold ${currentCfg.color}`}>{currentCfg.label}</p>
                </div>

                <div className="px-6 py-5">
                    {available.length > 0 ? (
                        <>
                            <p className="text-sm font-semibold text-gray-700 mb-3">Select new status</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {available.map((s) => {
                                    const cfg = STATUS_DISPLAY[s] || { label: s };
                                    const sel = selectedStatus === s;
                                    return (
                                        <button key={s} onClick={() => { setSelected(s); setFileError(""); }}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all
                        ${sel ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                                            {cfg.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {showPOD && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-xs font-semibold text-blue-700 mb-2">Upload delivery confirmation image</p>
                                    <input type="file" accept="image/*" onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
                                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-16 w-auto rounded border border-blue-200 object-cover" />}
                                </div>
                            )}

                            {fileError && <p className="text-xs text-rose-600 mb-3 text-center">{fileError}</p>}

                            {selectedStatus && (
                                <p className="text-sm text-gray-500 mb-4 text-center">
                                    Change status to{" "}
                                    <span className={`font-semibold ${selectedCfg?.color}`}>{selectedCfg?.label || selectedStatus}</span>?
                                </p>
                            )}

                            <div className="flex gap-2">
                                <button onClick={handleClose} className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleConfirm} disabled={!selectedStatus || isLoading}
                                    className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white transition-colors flex items-center justify-center gap-1.5">
                                    {isLoading ? <><Spinner /> Saving…</> : "Confirm Change"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-sm text-gray-500 mb-4">This order status cannot be changed further.</p>
                            <button onClick={handleClose} className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">Close</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ExchangeStatusModal = ({ isOpen, onClose, order, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelected] = useState("");

    const currentStatus =
        order?.exchangeRequest?.status || null;
    
    const available = EXCHANGE_NEXT[currentStatus] || [];

    useEffect(() => {
        if (isOpen) { setSelected(available[0] || ""); setError(null); }
    }, [isOpen, currentStatus]); // eslint-disable-line

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (!selectedStatus) { setError("Please select a status"); return; }
        setIsLoading(true); setError(null);
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/orders/update-exchange-status/${order?._id}`,
                { status: selectedStatus }
            );
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("[ExchangeStatusModal]", err);
            setError(err.response?.data?.message || "Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    const currentCfg = EXCHANGE_STATUS_DISPLAY[currentStatus] || { label: currentStatus || "Unknown", color: "text-gray-700" };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-6 pt-6 pb-4 text-center">
                    <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <MdClose size={20} />
                    </button>
                    <div className="flex justify-center mb-3"><MdSwapHoriz size={56} className="text-fuchsia-400" /></div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Exchange Status</p>
                    <p className={`text-lg font-bold ${currentCfg.color}`}>{currentCfg.label}</p>
                </div>

                <div className="px-6 py-5">
                    {error && <p className="text-xs text-rose-600 mb-3 text-center">{error}</p>}

                    {available.length > 0 ? (
                        <>
                            <p className="text-sm text-gray-500 mb-3 text-center">What would you like to do with this exchange request?</p>
                            <div className="flex flex-wrap gap-2 mb-5">
                                {available.map((s) => {
                                    const cfg = EXCHANGE_STATUS_DISPLAY[s] || { label: s };
                                    const sel = selectedStatus === s;
                                    return (
                                        <button key={s} onClick={() => setSelected(s)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all
                        ${sel ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                                            {cfg.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={onClose} className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                                <button onClick={handleConfirm} disabled={!selectedStatus || isLoading}
                                    className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white transition-colors flex items-center justify-center gap-1.5">
                                    {isLoading ? <><Spinner /> Saving…</> : "Confirm Change"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-sm text-gray-500 mb-4">This exchange request is already {currentStatus?.toLowerCase()}.</p>
                            <button onClick={onClose} className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">Close</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};