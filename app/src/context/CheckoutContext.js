import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/basicInfo';

const CheckoutContext = createContext(null);

export const useCheckout = () => {
    const ctx = useContext(CheckoutContext);
    if (!ctx) throw new Error('useCheckout must be used inside <CheckoutProvider>');
    return ctx;
};

export const computePricing = (items = []) => {
    let subtotal = 0, gst = 0, extraTax = 0, shipping = 0;

    for (const item of items) {
        const qty = item.quantity || 1;
        const price = item.price || 0;
        subtotal += price * qty;
        gst += (item.gst || 0) * qty;
        extraTax += (item.extraTax || 0) * qty;
        shipping += (item.shippingCharge || 0) * qty;
    }

    const grandTotal = subtotal + gst + extraTax + shipping;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        gst: Number(gst.toFixed(2)),
        extraTax: Number(extraTax.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2)),
    };
};

export const normaliseItem = (product, quantity = 1, selectedSize = '') => {
    const price = Number(product?.price || 0);
    const gstPct = product?.gstPercentage || 0;
    const extraTaxPct = product?.extraTaxPercentage || 0;

    return {
        productId: product?._id,
        name: product?.name || '',
        image: product?.images?.[0] || '',
        price,
        quantity,
        selectedSize,
        gst: Number(((price * gstPct) / 100).toFixed(2)),
        extraTax: Number(((price * extraTaxPct) / 100).toFixed(2)),
        shippingCharge: Number(product?.shippingCharge || 0),
        gstPercentage: gstPct,
        extraTaxPercentage: extraTaxPct,
    };
};

//  COD threshold (mirrors web) 
export const COD_THRESHOLD = 50000;

//  Provider ──
export const CheckoutProvider = ({ children }) => {
    const [checkoutMode, setCheckoutMode] = useState(null);   // "buy_now" | "cart" | null
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── Derived ─
    const pricing = useMemo(() => computePricing(checkoutItems), [checkoutItems]);

    const isLargeOrder = pricing.grandTotal > COD_THRESHOLD;

    // ── setBuyNow ──
    // Call this BEFORE navigating to CheckoutPage with mode="buy_now"
    const setBuyNow = useCallback((product, quantity = 1, selectedSize = '') => {
        const item = normaliseItem(product, quantity, selectedSize);
        setCheckoutMode('buy_now');
        setCheckoutItems([item]);
        setSelectedAddress(null);
        setPaymentMethod('COD');
        setError(null);
    }, []);

    // ── loadCartItems ─
    // Pass already-normalised items from CartContext (avoids double fetch)
    const loadCartItems = useCallback((normalisedItems = []) => {
        setCheckoutMode('cart');
        setCheckoutItems(normalisedItems);
        setSelectedAddress(null);
        setPaymentMethod('COD');
        setError(null);
    }, []);

    // ── placeOrder 
    const placeOrder = useCallback(
        async ({ userId, razorpayId = null }) => {
            if (!selectedAddress) {
                return { success: false, message: 'Please select a delivery address' };
            }
            if (checkoutItems.length === 0) {
                return { success: false, message: 'No items to order' };
            }

            const products = checkoutItems.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                measurement: item.selectedSize || undefined,
            }));

            const payload = {
                userId,
                products,
                shippingAddress: selectedAddress._id,
                paymentMethod,
                ...(razorpayId ? { razorpayId } : {}),
            };

            try {
                setLoading(true);
                const { data } = await axios.post(
                    `${API_BASE_URL}/orders/place-order`,
                    payload,
                );
                return { success: true, data };
            } catch (err) {
                const msg =
                    err?.response?.data?.message || 'Failed to place order. Please try again.';
                return { success: false, message: msg };
            } finally {
                setLoading(false);
            }
        },
        [checkoutItems, selectedAddress, paymentMethod],
    );

    // ── reset 
    const resetCheckout = useCallback(() => {
        setCheckoutMode(null);
        setCheckoutItems([]);
        setSelectedAddress(null);
        setPaymentMethod('COD');
        setError(null);
    }, []);

    return (
        <CheckoutContext.Provider
            value={{
                checkoutMode,
                checkoutItems,
                selectedAddress,
                paymentMethod,
                pricing,
                isLargeOrder,
                loading,
                error,

                setSelectedAddress,
                setPaymentMethod,

                setBuyNow,
                loadCartItems,
                placeOrder,
                resetCheckout,

                // utils for consumers
                computePricing,
                normaliseItem,
                COD_THRESHOLD,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};