/**
 * CheckoutContext
 * ───────────────
 * Survives page refresh by persisting to sessionStorage.
 *
 * Two flows:
 *   "buy_now"  — single product; productId lives in the URL, item in sessionStorage.
 *   "cart"     — multiple items; fetched fresh from server on mount / rehydration.
 *
 * Usage in CheckoutPage:
 *   const { checkoutItems, pricing, ... } = useCheckout();
 *
 * Before navigating to /checkout/cart  → just navigate (context auto-fetches cart).
 * Before navigating to /checkout/:id  → call setBuyNow(product, { quantity, selectedSize })
 *   then navigate("/checkout/" + product._id).
 */

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
} from "react";
import axios from "axios";

const STORAGE_KEY = "pm-checkout-session";

const CheckoutContext = createContext(null);

// ─── Pricing helper (mirrors backend buildPricing) ──────────────────────────

const computePricing = (items = []) => {
    let subtotal = 0;
    let gst = 0;
    let extraTax = 0;
    let shipping = 0;
    let discount = 0;

    for (const item of items) {
        const product = item.product || item;
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price ?? product?.price ?? 0);
        const prevPrice = Number(product?.previous_price ?? 0);

        subtotal += price * qty;

        gst += ((price * (Number(product?.gstPercentage) || 0)) / 100) * qty;

        extraTax +=
            ((price * (Number(product?.extraTaxPercentage) || 0)) / 100) * qty;

        const shippingType = product?.shippingType;
        const shippingCharge = Number(product?.shippingCharge) || 0;
        if (shippingType !== "free") {
            shipping += shippingCharge * qty;
        }

        if (prevPrice > price) {
            discount += (prevPrice - price) * qty;
        }
    }

    const grandTotal = subtotal + gst + extraTax + shipping;

    return {
        subtotal: round2(subtotal),
        gst: round2(gst),
        extraTax: round2(extraTax),
        shipping: round2(shipping),
        discount: round2(discount),
        grandTotal: round2(grandTotal),
    };
};

const round2 = (n) => Math.round(n * 100) / 100;

// ─── Group items by seller (mirrors backend logic) ──────────────────────────

export const groupBySeller = (items = []) => {
    const groups = {};
    for (const item of items) {
        const product = item.product || item;
        const sellerId =
            product?.uploadedBy === "supplier" && product?.supplier
                ? product.supplier.toString()
                : "admin";
        if (!groups[sellerId]) groups[sellerId] = [];
        groups[sellerId].push(item);
    }
    return groups; // { "admin": [...], "supplierId1": [...], ... }
};

// ─── Persist / restore helpers ───────────────────────────────────────────────

const persist = (state) => {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { }
};

const restore = () => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (_) {
        return null;
    }
};

const clearPersisted = () => {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch (_) { }
};

// ─── Provider ────────────────────────────────────────────────────────────────

export const CheckoutProvider = ({ children }) => {
    // "buy_now" | "cart" | null
    const [checkoutMode, setCheckoutMode] = useState(null);

    // Normalised item list — shape: { _id, product, productId, quantity, selectedSize, price, name, image }
    const [checkoutItems, setCheckoutItems] = useState([]);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── Derived pricing ────────────────────────────────────────
    const pricing = useMemo(() => computePricing(checkoutItems), [checkoutItems]);

    // ── Sync to sessionStorage whenever relevant state changes ──
    useEffect(() => {
        if (!checkoutMode) return;
        persist({
            checkoutMode,
            checkoutItems,
            selectedAddress,
            paymentMethod,
            notes,
        });
    }, [checkoutMode, checkoutItems, selectedAddress, paymentMethod, notes]);

    // ── Set buy-now item (called before navigating) ────────────
    const setBuyNow = useCallback((product, { quantity = 1, selectedSize = "" } = {}) => {
        const item = normaliseItem({ product, quantity, selectedSize });
        const next = {
            checkoutMode: "buy_now",
            checkoutItems: [item],
            selectedAddress: null,
            paymentMethod: "COD",
            notes: "",
        };
        setCheckoutMode("buy_now");
        setCheckoutItems([item]);
        setSelectedAddress(null);
        setPaymentMethod("COD");
        setNotes("");
        persist(next);
    }, []);

    // ── Load cart from server ──────────────────────────────────
    const loadCartItems = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/cart/get-users-cart/${userId}`
            );
            const raw = data?.items || [];
            const items = raw.map((item) => normaliseItem(item));
            setCheckoutItems(items);
            setCheckoutMode("cart");
            return items;
        } catch (err) {
            setError("Failed to load cart items.");
            console.error("[CheckoutContext] loadCartItems:", err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Rehydrate from sessionStorage on mount ─────────────────
    //   Called by CheckoutPage after it knows the mode from the URL.
    const rehydrate = useCallback(
        async ({ mode, productId, userId }) => {
            const saved = restore();

            if (mode === "buy_now") {
                // If we already have the right product in session, use it.
                if (
                    saved?.checkoutMode === "buy_now" &&
                    saved?.checkoutItems?.[0]?.productId === productId
                ) {
                    setCheckoutMode("buy_now");
                    setCheckoutItems(saved.checkoutItems);
                    setSelectedAddress(saved.selectedAddress ?? null);
                    setPaymentMethod(saved.paymentMethod ?? "COD");
                    setNotes(saved.notes ?? "");
                    return;
                }

                // Otherwise fetch the product from the server.
                setLoading(true);
                try {
                    const { data } = await axios.get(
                        `${process.env.REACT_APP_API_URL}/products/${productId}`
                    );
                    const product = data?.product || data;
                    const item = normaliseItem({ product, quantity: 1, selectedSize: "" });
                    setCheckoutItems([item]);
                    setCheckoutMode("buy_now");
                } catch (err) {
                    setError("Could not load product details.");
                    console.error("[CheckoutContext] rehydrate buy_now:", err);
                } finally {
                    setLoading(false);
                }
                return;
            }

            if (mode === "cart") {
                // Restore address/payment prefs from session but always re-fetch items.
                if (saved?.checkoutMode === "cart") {
                    setSelectedAddress(saved.selectedAddress ?? null);
                    setPaymentMethod(saved.paymentMethod ?? "COD");
                    setNotes(saved.notes ?? "");
                }
                if (userId) {
                    await loadCartItems(userId);
                }
            }
        },
        [loadCartItems]
    );

    // ── Reset ──────────────────────────────────────────────────
    const resetCheckout = useCallback(() => {
        setCheckoutMode(null);
        setCheckoutItems([]);
        setSelectedAddress(null);
        setPaymentMethod("COD");
        setNotes("");
        setError(null);
        clearPersisted();
    }, []);

    return (
        <CheckoutContext.Provider
            value={{
                // State
                checkoutMode,
                checkoutItems,
                selectedAddress,
                paymentMethod,
                notes,
                pricing,
                loading,
                error,

                // Setters
                setSelectedAddress,
                setPaymentMethod,
                setNotes,

                // Actions
                setBuyNow,
                loadCartItems,
                rehydrate,
                resetCheckout,

                // Utils
                groupBySeller,
                computePricing,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => {
    const ctx = useContext(CheckoutContext);
    if (!ctx) throw new Error("useCheckout must be used inside <CheckoutProvider>");
    return ctx;
};

// ─── Normalise a raw cart/product item ───────────────────────────────────────

const normaliseItem = (raw) => {
    // raw can come from:
    //   cart API   → { _id, product: {...}, quantity, selectedSize, price }
    //   setBuyNow  → { product: {...}, quantity, selectedSize }
    //   plain product obj (rehydrated buy_now)

    const isCartItem = !!raw?.product && typeof raw.product === "object";

    const product = isCartItem ? raw.product : raw;
    const productId = raw?.productId || product?._id || "";
    const quantity = Number(raw?.quantity) || 1;
    const selectedSize = raw?.selectedSize || "";
    const price = Number(raw?.price ?? product?.price ?? 0);
    const name = raw?.name || product?.name || "";
    const image = raw?.image || product?.images?.[0] || "";

    return {
        _id: raw?._id || `checkout-${productId}-${selectedSize}`,
        product,
        productId,
        quantity,
        selectedSize,
        price,
        name,
        image,
    };
};