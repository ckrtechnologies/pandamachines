export const LOCATION_KEY = "pm-user-location";
export const OPERATOR_TYPES = [
    "JCB Machine Operator",
    "Crane Operator",
    "Forklift Operator",
    "Excavator Operator",
    "Loader Operator",
    "Dozer Operator",
    "Grader Operator",
    "Backhoe Operator",
    "Pile Driver Operator",
    "Paver Operator",
    "Roller Operator",
    "Concrete Pump Operator"
];

//  Checkout / Payment 

/**
 * COD_THRESHOLD
 * Orders whose grandTotal is ABOVE this value will only be offered
 * Razorpay (online) payment. Orders at or below this threshold show COD.
 *
 * Set to Infinity to always show COD.
 * Set to 0 to never show COD (always require online payment).
 *
 * Current: orders > ₹50,000 must pay online.
 */

export const COD_THRESHOLD = 50000;