import axios from "axios";
import { useEffect, useState } from "react";
import {
    FiAlertCircle,
    FiCalendar,
    FiCheckCircle,
    FiChevronDown,
    FiClock,
    FiCreditCard,
    FiMail,
    FiPhone,
    FiShield,
    FiUser
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const GST_RATE = 0.18;

const DISCUSSION_OPTIONS = [
    { time: "30 mins", fee: 2000 },
    { time: "60 mins", fee: 5000 },
    { time: "Full Day", fee: 10000 },
    { time: "Until Project Completion", fee: 20000 },
];

const INVESTMENT_OPTIONS = [
    "0-5 Lakh",
    "5-10 Lakh",
    "10-20 Lakh",
    "20-30 Lakh",
    "30-40 Lakh",
    "40-50 Lakh",
    "50 Lakh - 1 Cr",
    "1 Cr+",
];

// ── Razorpay loader ───────────────────────────────────────────────────────────
const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });

// ── SelectField ───────────────────────────────────────────────────────────────
const SelectField = ({ label, value, onChange, options, disabled, error }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            {label}
        </label>
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`w-full border rounded-xl px-4 py-3 pr-10 text-sm appearance-none outline-none transition-all
                    ${disabled
                        ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                        : error
                            ? "bg-white border-red-300 text-gray-800 focus:border-red-400 focus:ring-1 focus:ring-red-100"
                            : "bg-white border-gray-200 text-gray-800 focus:border-orange-400 focus:ring-1 focus:ring-orange-100 hover:border-gray-300 cursor-pointer"
                    }`}
            >
                <option value="">— Select {label} —</option>
                {options.map((o) => (
                    <option key={o._id} value={o._id}>
                        {o.name}
                    </option>
                ))}
            </select>
            <FiChevronDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${disabled ? "text-gray-300" : "text-gray-400"}`}
            />
        </div>
        {error && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3 shrink-0" />{error}
            </p>
        )}
    </div>
);

// ── InputField ────────────────────────────────────────────────────────────────
const InputField = ({ icon: Icon, label, type = "text", value, onChange, disabled, maxLength, placeholder, required, error }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2.5 transition-all
            ${disabled
                ? "bg-gray-50 border-gray-200"
                : error
                    ? "bg-white border-red-300 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-100"
                    : "bg-white border-gray-200 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-100 hover:border-gray-300"
            }`}
        >
            {Icon && <Icon className={`w-4 h-4 shrink-0 ${disabled ? "text-gray-300" : "text-gray-400"}`} />}
            <input
                type={type}
                value={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                disabled={disabled}
                maxLength={maxLength}
                placeholder={placeholder || label}
                className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 disabled:text-gray-500"
            />
        </div>
        {error && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3 shrink-0" />{error}
            </p>
        )}
    </div>
);

// ── SectionCard ───────────────────────────────────────────────────────────────
const SectionCard = ({ title, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest">{title}</h3>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const GuidanceRegistrationForm = () => {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        category: "",
        subCategory: "",
        subSubCategory: "",
        product: "",
        investmentAmount: "",
        fullName: "",
        mobileNumber: "",
        email: "",
        discussionTime: "30 mins",
        discussionFee: 2000,
        date: "",
        time: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Prefill from auth context
// Prefill registered user's details from auth context
useEffect(() => {
    if (user) {
        const fullName = [
            user.firstName,
            user.lastName,
        ]
            .filter(Boolean)
            .join(" ")
            .trim();

        const mobileNumber =
            user.phone ||
            user.mobileNumber ||
            user.mobile ||
            "";

        const email = user.email || "";

        setFormData((prev) => ({
            ...prev,
            fullName: fullName || user.fullName || user.name || "",
            mobileNumber,
            email,
        }));
    }
}, [user]);

    // Fetch categories
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/categories/get-all-categories`)
            .then((r) => setCategories(r.data || []))
            .catch(console.error);
    }, []);

    // Fetch subcategories
    useEffect(() => {
        if (!formData.category) return setSubCategories([]);
        axios
            .get(`${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${formData.category}`)
            .then((r) => setSubCategories(r.data.subCategories || r.data || []))
            .catch(() => setSubCategories([]));
    }, [formData.category]);

    // Fetch sub-sub-categories
    useEffect(() => {
        if (!formData.subCategory) return setSubSubCategories([]);
        axios
            .get(`${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${formData.subCategory}`)
            .then((r) => setSubSubCategories(r.data || []))
            .catch(() => setSubSubCategories([]));
    }, [formData.subCategory]);

    // Fetch products
    useEffect(() => {
        if (!formData.subSubCategory) return setProducts([]);
        axios
            .get(`${process.env.REACT_APP_API_URL}/products/products-by-sub-sub-category/${formData.subSubCategory}`)
            .then((r) => setProducts(r.data || []))
            .catch(() => setProducts([]));
    }, [formData.subSubCategory]);

    const set = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const selectCategory = (id) =>
        setFormData((p) => ({ ...p, category: id, subCategory: "", subSubCategory: "", product: "" }));
    const selectSubCategory = (id) =>
        setFormData((p) => ({ ...p, subCategory: id, subSubCategory: "", product: "" }));
    const selectSubSubCategory = (id) =>
        setFormData((p) => ({ ...p, subSubCategory: id, product: "" }));
    const selectDiscussionTime = (time, fee) =>
        setFormData((p) => ({ ...p, discussionTime: time, discussionFee: fee }));
    const handleInvestmentSelect = (option) =>
        setFormData((p) => ({ ...p, investmentAmount: p.investmentAmount === option ? "" : option }));

    const todayStr = new Date().toISOString().split("T")[0];
    const gstAmount = Math.round(formData.discussionFee * GST_RATE);
    const totalAmount = formData.discussionFee + gstAmount;

    // ── Client-side validation ────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!formData.category) e.category = "Please select a category";
        if (!formData.subCategory) e.subCategory = "Please select a sub category";
        if (!formData.subSubCategory) e.subSubCategory = "Please select a sub-sub category";
        if (!formData.product) e.product = "Please select a product";
        if (!formData.fullName.trim()) e.fullName = "Full name is required";

        // Mobile: must be exactly 10 digits, no spaces, no country code
        const mobile = String(formData.mobileNumber || "").replace(/\s/g, "");
        if (!mobile) {
            e.mobileNumber = "Mobile number is required";
        } else if (!/^\d{10}$/.test(mobile)) {
            e.mobileNumber = "Enter a valid 10-digit Indian mobile number (without country code)";
        } else if (!["6", "7", "8", "9"].includes(mobile[0])) {
            e.mobileNumber = "Mobile number must start with 6, 7, 8, or 9";
        }

        // Email
        if (!formData.email.trim()) {
            e.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            e.email = "Enter a valid email address";
        }

        if (!formData.date) e.date = "Please select a date";
        if (!formData.time) e.time = "Please select a time";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Build clean booking payload ───────────────────────────────────────────
    const buildPayload = (paymentResponse) => {
        // Sanitize mobile — strip any spaces, ensure plain 10-digit string
        const cleanMobile = String(formData.mobileNumber || "").replace(/\s/g, "");

        const payload = {
            category: formData.category,
            subCategory: formData.subCategory || undefined,
            subSubCategory: formData.subSubCategory || undefined,
            product: formData.product || undefined,
            fullName: formData.fullName.trim(),
            mobileNumber: cleanMobile,
            email: formData.email.trim(),
            discussionTime: formData.discussionTime,
            discussionFee: formData.discussionFee,
            date: formData.date,
            time: formData.time,
            ...(formData.investmentAmount ? { investmentAmount: formData.investmentAmount } : {}),
            paymentId: paymentResponse.razorpay_payment_id,
            orderId: paymentResponse.razorpay_order_id,
            paymentSignature: paymentResponse.razorpay_signature,
            paymentStatus: "completed",
        };
        return payload;
    };

    // ── Create Razorpay order ─────────────────────────────────────────────────
    const createOrder = async () => {
        const selectedProduct = products.find((p) => p._id === formData.product);
        const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/razorpay/create-order`,
            {
                amount: totalAmount,
                name: formData.fullName.trim(),
                email: formData.email.trim(),
                number: String(formData.mobileNumber).replace(/\s/g, ""),
                product: selectedProduct?.name || "Guidance Consultation",
                profile_name: formData.fullName.trim().toLowerCase().replace(/\s+/g, "_"),
            },
            { headers: { "Content-Type": "application/json" } }
        );
        return data;
    };

    // ── Create booking after payment ──────────────────────────────────────────
    const createBooking = async (paymentResponse) => {
        const payload = buildPayload(paymentResponse);
        const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/guidance-booking/book`,
            payload,
            { headers: { "Content-Type": "application/json" } }
        );
        return data;
    };

    // ── Handle payment flow ───────────────────────────────────────────────────
    const handlePayment = async () => {
        // 1. Client-side validation
        if (!validate()) {
            setTimeout(() => {
                const el = document.querySelector("[data-field-error='true']");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);
            return;
        }

        setSubmitting(true);

        try {
            // 2. Load Razorpay SDK
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded)
                throw new Error("Could not load payment gateway. Please check your internet connection.");

            const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
            if (!razorpayKey) throw new Error("Payment configuration missing. Please contact support.");

            // 3. Create Razorpay order on backend
            const orderData = await createOrder();
            if (!orderData?.id || !orderData?.amount) {
                throw new Error("Invalid order response from server. Please try again.");
            }

            // 4. Open Razorpay checkout
            const options = {
                key: razorpayKey,
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                name: "Panda Machines",
                description: `Guidance Consultation – ${formData.discussionTime}`,
                order_id: orderData.id,
                handler: async (response) => {
                    // Payment succeeded — now create booking
                    try {
                        const bookingResult = await createBooking(response);
                        localStorage.setItem("bookingResponse", JSON.stringify(bookingResult));
                        navigate("/guidance-booking-confirm", { replace: true });
                        // No setSubmitting(false) here — we're navigating away
                    } catch (bookingErr) {
                        console.error("Booking creation failed after payment:", bookingErr);
                        const errMsg =
                            bookingErr?.response?.data?.error ||
                            bookingErr?.response?.data?.message ||
                            bookingErr.message ||
                            "Unknown error";
                        alert(
                            `⚠️ Payment was successful but booking creation failed.\n\nReason: ${errMsg}\n\nPlease save your Payment ID and contact support:\n${response.razorpay_payment_id}`
                        );
                        setSubmitting(false); // Unlock button so they can retry or contact support
                    }
                },
                prefill: {
                    name: formData.fullName.trim(),
                    email: formData.email.trim(),
                    contact: String(formData.mobileNumber).replace(/\s/g, ""),
                },
                notes: {
                    discussionTime: formData.discussionTime,
                    category: formData.category,
                },
                theme: { color: "#FF8617" },
                modal: {
                    // Fires when user closes the modal WITHOUT completing payment
                    ondismiss: () => {
                        setSubmitting(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", (res) => {
                console.error("Payment failed:", res.error);
                alert("Payment failed: " + (res.error?.description || "Unknown error. Please try again."));
                setSubmitting(false); // ← KEY FIX: unlock button on payment failure
            });

            rzp.open();

        } catch (err) {
            console.error("Payment initiation error:", err);
            alert(err.message || "Failed to initiate payment. Please try again.");
            setSubmitting(false); // Always unlock on any thrown error
        }
    };

    // ── Shared error wrapper for scrolling ────────────────────────────────────
    const fieldError = (key) => errors[key] ? true : undefined;

    return (
        <div className="bg-[#FFFAF6] min-h-screen">
            <div className="max-w-7xl mx-auto px-4">

                {/* ── Two-column layout ── */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* ════════════════════════════════════════
                        LEFT COLUMN — form sections
                    ════════════════════════════════════════ */}
                    <div className="flex-1 min-w-0 space-y-5">

                        {/* Plant Type Selection */}
                        <SectionCard title="Plant Type Selection">
                            <div className="space-y-4">
                                <div data-field-error={fieldError("category")}>
                                    <SelectField
                                        label="Category"
                                        value={formData.category}
                                        onChange={selectCategory}
                                        options={categories}
                                        error={errors.category}
                                    />
                                </div>
                                <SelectField
                                    label="Sub Category"
                                    value={formData.subCategory}
                                    onChange={selectSubCategory}
                                    options={subCategories}
                                    disabled={!formData.category}
                                    error={errors.subCategory}
                                />
                                <SelectField
                                    label="Sub-Sub Category"
                                    value={formData.subSubCategory}
                                    onChange={selectSubSubCategory}
                                    options={subSubCategories}
                                    disabled={!formData.subCategory}
                                    error={errors.subSubCategory}
                                />
                                <SelectField
                                    label="Product"
                                    value={formData.product}
                                    onChange={(id) => set("product", id)}
                                    options={products}
                                    disabled={!formData.subSubCategory}
                                    error={errors.product}
                                />
                            </div>
                        </SectionCard>

                        {/* Investment Amount */}
                        <SectionCard title="Investment Amount">
                            <p className="text-xs text-gray-400 mb-3">
                                How much are you planning to invest? (Optional — tap again to deselect)
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {INVESTMENT_OPTIONS.map((option) => {
                                    const active = formData.investmentAmount === option;
                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => handleInvestmentSelect(option)}
                                            className={`flex items-center gap-2 px-3 py-2.5 border-2 rounded-xl text-sm font-medium transition-all text-left
                                                ${active
                                                    ? "border-[#00395F] bg-[#EBF5FB] text-[#00395F]"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/50"
                                                }`}
                                        >
                                            <span className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                                ${active ? "border-[#00395F]" : "border-gray-300"}`}>
                                                {active && <span className="w-2 h-2 rounded-full bg-[#00395F]" />}
                                            </span>
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </SectionCard>

                        {/* Discussion Duration */}
                        <SectionCard title="Discussion Duration">
                            <div className="grid grid-cols-2 gap-3">
                                {DISCUSSION_OPTIONS.map(({ time, fee }) => {
                                    const active = formData.discussionTime === time;
                                    return (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => selectDiscussionTime(time, fee)}
                                            className={`relative rounded-xl border-2 py-4 px-3 text-center transition-all focus:outline-none
                                                ${active
                                                    ? "border-[#00395F] bg-[#EBF5FB] shadow-sm"
                                                    : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/50"
                                                }`}
                                        >
                                            {active && (
                                                <span className="absolute top-2 right-2">
                                                    <FiCheckCircle className="w-3.5 h-3.5 text-[#00395F]" />
                                                </span>
                                            )}
                                            <p className={`text-sm font-bold mb-1.5 ${active ? "text-[#00395F]" : "text-gray-700"}`}>
                                                {time}
                                            </p>
                                            <p className={`text-base font-extrabold ${active ? "text-orange-500" : "text-[#00395F]"}`}>
                                                ₹{fee.toLocaleString("en-IN")}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </SectionCard>

                        {/* Preferred Time Slot */}
                        <SectionCard title="Preferred Time Slot">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div data-field-error={!!errors.date || undefined}>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        Date <span className="text-red-400">*</span>
                                    </label>
                                    <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2.5 transition-all bg-white
                                        ${errors.date
                                            ? "border-red-300 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-100"
                                            : "border-gray-200 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-100 hover:border-gray-300"
                                        }`}
                                    >
                                        <FiCalendar className="w-4 h-4 text-[#00395F] shrink-0" />
                                        <input
                                            type="date"
                                            value={formData.date}
                                            min={todayStr}
                                            onChange={(e) => set("date", e.target.value)}
                                            className="flex-1 text-sm bg-transparent outline-none text-gray-800"
                                        />
                                    </div>
                                    {errors.date && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <FiAlertCircle className="w-3 h-3" />{errors.date}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        Time <span className="text-red-400">*</span>
                                    </label>
                                    <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2.5 transition-all bg-white
                                        ${errors.time
                                            ? "border-red-300 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-100"
                                            : "border-gray-200 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-100 hover:border-gray-300"
                                        }`}
                                    >
                                        <FiClock className="w-4 h-4 text-[#00395F] shrink-0" />
                                        <input
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => set("time", e.target.value)}
                                            className="flex-1 text-sm bg-transparent outline-none text-gray-800"
                                        />
                                    </div>
                                    {errors.time && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <FiAlertCircle className="w-3 h-3" />{errors.time}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </SectionCard>

                    </div>
                    {/* END LEFT COLUMN */}


                    {/* ════════════════════════════════════════
                        RIGHT COLUMN — user info + payment
                        sticky on desktop
                    ════════════════════════════════════════ */}
                    <div className="w-full lg:w-[420px] xl:w-[470px] shrink-0 space-y-4 lg:sticky lg:top-6">

                        {/* Your Information */}
                        <SectionCard title="Your Information">
                            <div className="space-y-4">
                                <div data-field-error={!!errors.fullName || undefined}>
                                    <InputField
                                        icon={FiUser}
                                        label="Full Name"
                                        value={formData.fullName}
                                        onChange={isLoggedIn ? null : (v) => set("fullName", v)}
                                        disabled={isLoggedIn}
                                        required
                                        error={errors.fullName}
                                    />
                                </div>
                                <div data-field-error={!!errors.mobileNumber || undefined}>
                                    <InputField
                                        icon={FiPhone}
                                        label="Mobile Number"
                                        type="tel"
                                        value={formData.mobileNumber}
                                        onChange={isLoggedIn ? null : (v) => {
                                            // Only allow digits, max 10
                                            const cleaned = v.replace(/\D/g, "").slice(0, 10);
                                            set("mobileNumber", cleaned);
                                        }}
                                        disabled={isLoggedIn}
                                        maxLength={10}
                                        placeholder="10-digit number"
                                        required
                                        error={errors.mobileNumber}
                                    />
                                </div>
                                <div data-field-error={!!errors.email || undefined}>
                                    <InputField
                                        icon={FiMail}
                                        label="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={isLoggedIn ? null : (v) => set("email", v)}
                                        disabled={isLoggedIn}
                                        required
                                        error={errors.email}
                                    />
                                </div>
                                {isLoggedIn && (
                                    <p className="text-xs text-gray-400 flex items-center gap-1.5 -mt-1">
                                        <FiCheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                                        Details pre-filled from your account
                                    </p>
                                )}
                            </div>
                        </SectionCard>

                        {/* Payment Summary */}
                        <div className="bg-gradient-to-br from-[#00395F] to-[#005080] rounded-2xl p-5 text-white">
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">
                                Payment Summary
                            </p>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-200">Consultation Fee</span>
                                    <span className="font-semibold">₹{formData.discussionFee.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-200">Duration</span>
                                    <span className="font-semibold">{formData.discussionTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-200">GST (18%)</span>
                                    <span className="font-semibold">₹{gstAmount.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-white/20">
                                    <span className="font-bold text-base">Total Payable</span>
                                    <span className="text-2xl font-extrabold text-orange-300">
                                        ₹{totalAmount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button
                            type="button"
                            onClick={handlePayment}
                            disabled={submitting}
                            className="w-full flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl transition-all shadow-lg shadow-orange-200/60"
                        >
                            {submitting ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Processing…
                                </>
                            ) : (
                                <>
                                    <FiCreditCard className="w-5 h-5" />
                                    Pay ₹{totalAmount.toLocaleString("en-IN")} – Confirm Booking
                                </>
                            )}
                        </button>

                        {/* Security note */}
                        <div className="flex items-center justify-center text-green-600 gap-2 text-xs  pb-2">
                            <FiShield className="w-3.5 h-3.5" />
                            Secured by Razorpay
                        </div>

                    </div>
                    {/* END RIGHT COLUMN */}

                </div>
                {/* END TWO-COLUMN */}

            </div>
        </div>
    );
};

export default GuidanceRegistrationForm;