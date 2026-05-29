/**
 * CheckoutContext
 * ───────────────
 * Survives page refresh by persisting to sessionStorage.
 *
 * Two flows:
 *   "buy_now"  — single product; productId lives in the URL, item in sessionStorage.
 *   "cart"     — multiple items; fetched fresh from server on mount / rehydration.
 *
 * Pricing is computed via shared `computePricing` from pricingUtils —
 * the same function used by CartContext.  No duplicate logic.
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
import { computePricing, groupBySeller, normaliseItem } from "../utils/pricingUtils";


const STORAGE_KEY = "pm-checkout-session";

const CheckoutContext = createContext(null);

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
    const [checkoutMode, setCheckoutMode] = useState(null);   // "buy_now" | "cart" | null
    const [checkoutItems, setCheckoutItems] = useState([]);   // normalised items
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── Derived pricing via shared util ───────────────────────────────────────
    const pricing = useMemo(() => computePricing(checkoutItems), [checkoutItems]);

    // ── Sync to sessionStorage ─────────────────────────────────────────────────
    useEffect(() => {
        if (!checkoutMode) return;
        persist({ checkoutMode, checkoutItems, selectedAddress, paymentMethod, notes });
    }, [checkoutMode, checkoutItems, selectedAddress, paymentMethod, notes]);

    // ── Set buy-now item ───────────────────────────────────────────────────────
    const setBuyNow = useCallback(
        (product, { quantity = 1, selectedSize = "" } = {}) => {
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
        },
        []
    );

    // ── Load cart items from server ────────────────────────────────────────────
    const loadCartItems = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/cart/get-users-cart/${userId}`
            );
            const items = (data?.items || []).map((item) => normaliseItem(item));
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

    // ── Rehydrate from sessionStorage on mount ─────────────────────────────────
    const rehydrate = useCallback(
        async ({ mode, productId, userId }) => {
            const saved = restore();

            if (mode === "buy_now") {
                if (
                    saved?.checkoutMode === "buy_now" &&
                    saved?.checkoutItems?.[0]?.productId === productId
                ) {
                    // Restore from session — items already have full product object
                    setCheckoutMode("buy_now");
                    setCheckoutItems(saved.checkoutItems);
                    setSelectedAddress(saved.selectedAddress ?? null);
                    setPaymentMethod(saved.paymentMethod ?? "COD");
                    setNotes(saved.notes ?? "");
                    return;
                }

                // Fetch product fresh from server
                setLoading(true);
                try {
                    const { data } = await axios.get(
                        `${process.env.REACT_APP_API_URL}/products/${productId}`
                    );
                    const product = data?.product || data;
                    setCheckoutItems([normaliseItem({ product, quantity: 1 })]);
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
                // Restore prefs but always re-fetch items for fresh prices
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

    // ── Reset ──────────────────────────────────────────────────────────────────
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
                checkoutMode,
                checkoutItems,
                selectedAddress,
                paymentMethod,
                notes,
                pricing,
                loading,
                error,

                setSelectedAddress,
                setPaymentMethod,
                setNotes,

                setBuyNow,
                loadCartItems,
                rehydrate,
                resetCheckout,

                // Utils — exposed for consumers that need them
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