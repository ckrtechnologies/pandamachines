/**
 * pricingUtils.js
 * ────────────────
 * Single source of truth for all cart/checkout pricing calculations.
 * Used by CartContext, CheckoutContext, and can mirror backend buildPricing.
 *
 * Each `item` shape expected:
 *   {
 *     price: number,          // unit price (already resolved for size/variant)
 *     quantity: number,
 *     product: {
 *       previous_price?,
 *       gstPercentage?,
 *       extraTaxPercentage?,
 *       shippingType?,        // "free" → no charge
 *       shippingCharge?,
 *     }
 *   }
 */

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Compute full pricing breakdown from a normalised item list.
 * Returns: { subtotal, discount, gst, extraTax, shipping, grandTotal }
 */
export const computePricing = (items = []) => {
    let subtotal = 0;
    let discount = 0;
    let gst = 0;
    let extraTax = 0;
    let shipping = 0;

    for (const item of items) {
        const product = item.product || {};
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price || product?.price || 0);
        const prevPrice = Number(product?.previous_price || 0);

        subtotal += price * qty;

        gst += ((price * (Number(product?.gstPercentage) || 0)) / 100) * qty;

        extraTax +=
            ((price * (Number(product?.extraTaxPercentage) || 0)) / 100) * qty;

        if (product?.shippingType !== "free") {
            shipping += (Number(product?.shippingCharge) || 0) * qty;
        }

        if (prevPrice > price) {
            discount += (prevPrice - price) * qty;
        }
    }

    const grandTotal = subtotal + gst + extraTax + shipping;

    return {
        subtotal: round2(subtotal),
        discount: round2(discount),
        gst: round2(gst),
        extraTax: round2(extraTax),
        shipping: round2(shipping),
        grandTotal: round2(grandTotal),
    };
};

/**
 * Normalise a raw cart/product item into a consistent shape.
 * Works for:
 *   - Cart API items     → { _id, product: {...}, quantity, selectedSize, price }
 *   - setBuyNow calls    → { product: {...}, quantity, selectedSize }
 *   - Rehydrated session items (already normalised)
 */
export const normaliseItem = (raw) => {
    const isCartItem = !!raw?.product && typeof raw.product === "object";
    const product = isCartItem ? raw.product : raw;
    const productId = raw?.productId || product?._id || "";
    const quantity = Number(raw?.quantity) || 1;
    const selectedSize = raw?.selectedSize || "";

    // Resolve price — use || (not ??) so that price:0 from the cart API
    // correctly falls through to product.price.
    // ?? only skips null/undefined; || also skips 0, which is what we want here
    // because the cart API sometimes returns price:0 when price lives on the product.
    let price = Number(raw?.price || product?.price || 0);

    // Override with size-specific price if applicable
    if (product?.size_type === "multiple" && selectedSize) {
        const allPrices = product?.price_by_measurement?.[0]?.allPrice || [];
        const matchedSize = allPrices.find((s) => s.measurement === selectedSize);
        if (matchedSize?.price) price = Number(matchedSize.price);
    }

    const name = raw?.name || product?.name || "";
    const image = raw?.image || product?.images?.[0] || "";

    return {
        _id: raw?._id || `item-${productId}-${selectedSize}-${Date.now()}`,
        product,
        productId,
        quantity,
        selectedSize,
        price,
        name,
        image,
    };
};

/**
 * Group checkout items by seller.
 * Returns { "admin": [...], "supplierId": [...], ... }
 */
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
    return groups;
};