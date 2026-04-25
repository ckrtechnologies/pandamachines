export const validateProductRow = (row, { isStrict = false } = {}) => {
    const errors = {};

    // Name
    if (!row.name?.trim()) {
        errors.name = "Name is required";
    } else if (row.name.trim().length < 3) {
        errors.name = "Name must be at least 3 characters";
    }

    // Description
    if (!row.description?.trim()) {
        errors.description = "Description is required";
    } else if (row.description.trim().length < 10) {
        errors.description = "Description too short (min 10 chars)";
    }

    // Brand
    if (!row.brand?.trim()) {
        errors.brand = "Brand is required";
    }

    // Shipping
    const validShipping = ["free", "extra", "actual"];
    if (!row.shippingType || !validShipping.includes(row.shippingType?.toLowerCase())) {
        errors.shippingType = isStrict
            ? "Invalid shippingType"
            : "Must be: free, extra or actual";
    }

    if (
        row.shippingType?.toLowerCase() === "extra" &&
        (!row.shippingCharge || Number(row.shippingCharge) <= 0)
    ) {
        errors.shippingCharge = isStrict
            ? "shippingCharge required when shippingType is extra"
            : "Required when shippingType is 'extra'";
    }

    // Price
    if (row.price === "" || row.price === undefined || isNaN(row.price)) {
        errors.price = "Price is required";
    } else if (Number(row.price) <= 0) {
        errors.price = "Price must be greater than 0";
    }

    // Previous Price
    if (
        row.previous_price !== "" &&
        row.previous_price !== undefined &&
        !isNaN(row.previous_price)
    ) {
        if (Number(row.previous_price) < Number(row.price)) {
            errors.previous_price = "Previous price must be >= price";
        }
    }

    // Features
    if (!row.features || (typeof row.features === "string" && !row.features.trim())) {
        errors.features = "At least one feature is required";
    }

    return errors;
};