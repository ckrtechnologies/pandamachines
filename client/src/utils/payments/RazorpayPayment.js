import { useState, useCallback } from "react";
import axios from "axios";

const RazorpayPayment = ({
    amount,
    customerData = {},
    orderMeta = {},
    onSuccess,
    onFailure,
    onDismiss,
    disabled = false,
    children,
    className = "",
    label,
}) => {
    const [loading, setLoading] = useState(false);

    // ── Load SDK lazily ──────────────────────────────────────────
    const loadScript = useCallback(() => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }, []);

    // ── Create order on backend ──────────────────────────────────
    const createRazorpayOrder = useCallback(async () => {
        const payload = {
            amount,                               // rupees; backend multiplies ×100 for paise
            name: customerData.fullName || "Customer",
            email: customerData.email || "",
            number: customerData.phone || "",
            product: orderMeta.description || "Order Payment",
            profile_name: (customerData.fullName || "customer")
                .toLowerCase()
                .replace(/\s+/g, "_"),
        };

        const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/razorpay/create-order`,
            payload,
            { headers: { "Content-Type": "application/json" } }
        );

        return data; // { id, amount, currency, ... }
    }, [amount, customerData, orderMeta]);

    // ── Open Razorpay modal ──────────────────────────────────────
    const initiatePayment = useCallback(async () => {
        if (disabled || loading) return;
        setLoading(true);

        try {
            const scriptLoaded = await loadScript();
            if (!scriptLoaded) {
                throw new Error("Could not load Razorpay SDK. Check your internet connection.");
            }

            const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
            if (!razorpayKey) {
                throw new Error("Razorpay key is missing. Check REACT_APP_RAZORPAY_KEY_ID.");
            }

            const orderData = await createRazorpayOrder();

            const options = {
                key: razorpayKey,
                amount: orderData.amount,           // paise (from backend)
                currency: orderData.currency || "INR",
                name: "Panda Machines",
                description: orderMeta.description || "Product Order",
                order_id: orderData.id,

                handler: (response) => {
                    // Payment captured by Razorpay — pass raw IDs up
                    onSuccess?.({
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                    });
                },

                prefill: {
                    name: customerData.fullName || "",
                    email: customerData.email || "",
                    contact: customerData.phone || "",
                },

                notes: {
                    ...orderMeta,
                },

                theme: { color: "#FF8617" },

                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        onDismiss?.();
                    },
                },
            };

            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", (response) => {
                onFailure?.({
                    type: "payment_failed",
                    message: response.error?.description || "Payment failed",
                    error: response.error,
                });
            });

            rzp.open();
        } catch (err) {
            onFailure?.({
                type: "initiation_failed",
                message: err.message || "Failed to start payment",
                error: err,
            });
        } finally {
            // Don't stop loading here — modal takes over; ondismiss handles it.
            // But if we never opened the modal (error), we do need to reset.
            // rzp.open() is sync-ish; errors above mean we never reached it.
        }
    }, [disabled, loading, loadScript, createRazorpayOrder, onSuccess, onFailure, onDismiss, customerData, orderMeta]);

    const buttonLabel = label ?? `Pay ₹${Number(amount || 0).toLocaleString("en-IN")}`;

    if (children) {
        return (
            <span onClick={initiatePayment} style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
                {children}
            </span>
        );
    }

    return (
        <button
            type="button"
            onClick={initiatePayment}
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-2
        bg-[#FF8617] hover:bg-[#e6750f] active:scale-[0.98]
        text-white font-semibold text-sm
        px-6 py-3 rounded-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
        >
            {loading ? (
                <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processing…
                </>
            ) : (
                <>
                    <PayIcon />
                    {buttonLabel}
                </>
            )}
        </button>
    );
};

const PayIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 10h20" strokeLinecap="round" />
    </svg>
);

export default RazorpayPayment;