import {
    Building2,
    Home,
    Loader2,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Save,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import ModalWrapper from "../../Modals/ModalWrapper";
import LocationPicker from "../../Location/LocationPicker";


const ADDRESS_TYPES = [
    { value: "Home", label: "Home", Icon: Home },
    { value: "Work", label: "Work", Icon: Building2 },
    { value: "Other", label: "Other", Icon: MapPin },
];

const EMPTY_FORM = {
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    landmark: "",
    addressType: "Home",
    isDefault: false,

    coordinates: [],
};


const AddressModal = ({
    isOpen,
    onClose,
    mode = "create",
    address = null,
    onAddressAdded,
    onAddressUpdated,
}) => {
    const isEdit = mode === "edit";

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    /* Populate form when editing */
    useEffect(() => {
        if (isOpen) {
            setErrors({});
            setFormData(isEdit && address ? { ...EMPTY_FORM, ...address } : EMPTY_FORM);
        }
    }, [isOpen, isEdit, address]);

    /* ── Handlers ── */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!formData.fullName.trim()) e.fullName = "Full name is required";
        if (!formData.phone.trim()) e.phone = "Phone number is required";
        if (!formData.addressLine1.trim()) e.addressLine1 = "Address line 1 is required";
        if (!formData.city.trim()) e.city = "City is required";
        if (!formData.state.trim()) e.state = "State is required";
        if (!formData.postalCode.trim()) e.postalCode = "Postal code is required";
        if (!formData.country.trim()) e.country = "Country is required";

        if (formData.phone && !/^\+?[\d\s\-()]{10,}$/.test(formData.phone))
            e.phone = "Please enter a valid phone number";
        if (formData.postalCode && !/^\d{5,6}$/.test(formData.postalCode))
            e.postalCode = "Please enter a valid postal code";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const userData = localStorage.getItem("pm-user-data");
            const user = userData ? JSON.parse(userData) : null;
            if (!user?._id) throw new Error("User not found. Please log in again.");

            let response;
            if (isEdit) {
                if (!address?._id) throw new Error("Address ID not found.");
                response = await fetch(
                    `${process.env.REACT_APP_API_URL}/address/update-address/${address._id}`,
                    { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }
                );
            } else {
                response = await fetch(
                    `${process.env.REACT_APP_API_URL}/address/create-address`,
                    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, user: user._id }) }
                );
            }

            if (!response.ok) {
                const txt = await response.text();
                throw new Error(`Failed: ${response.status} – ${txt}`);
            }

            const data = await response.json();
            if (!data.success) throw new Error(data.message || "Operation failed");

            if (isEdit) onAddressUpdated?.(data.data);
            else onAddressAdded?.(data.data);

            onClose();
        } catch (err) {
            setErrors({ submit: err.message || "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => { if (!loading) onClose(); };

    const handleLocationSelect = (location) => {
        setFormData((prev) => ({
            ...prev,

            addressLine1: [
                location.street,
                location.locality,
            ]
                .filter(Boolean)
                .join(", "),

            city: location.city,

            state: location.state,

            postalCode: location.pincode,

            country: location.country || "India",

            coordinates: location.coordinates,
        }));
    };

    /* ── Shared input classes ── */
    const inputCls = (field) =>
        `w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-colors ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"
        }`;

    const iconInputCls = (field) =>
        `w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-colors ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"
        }`;

    const errMsg = (field) =>
        errors[field] ? <p className="mt-1 text-xs text-red-500">{errors[field]}</p> : null;

    /* ── Render ── */
    return (
        <>
            <ModalWrapper isOpen={isOpen} onClose={handleClose}>
                <div className="max-h-[60vh] lg:max-h-[80vh]  flex flex-col gap-2 lg:gap-4 md:max-w-3xl  overflow-y-auto">
                    {/* Header */}
                    <div className="flex  items-center gap-2.5  p-2  border-b border-gray-200 shrink-0">
                        <h2 className="text-base font-semibold text-gray-900">
                            {isEdit ? "Edit Address" : "Add New Address"}
                        </h2>
                    </div>

                    {/* Scrollable body */}
                    <form onSubmit={handleSubmit} className="overflow-y-auto p-2  flex-1">
                        <div className="space-y-5">

                            {/* Submit error */}
                            {errors.submit && (
                                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-600">
                                    {errors.submit}
                                </div>
                            )}

                            {/* Address Type */}
                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-2">Address Type</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {ADDRESS_TYPES.map(({ value, label, Icon }) => {
                                        const active = formData.addressType === value;
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setFormData((p) => ({ ...p, addressType: value }))}
                                                className={`py-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${active
                                                    ? "border-primaryColor bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <Icon size={18} className={active ? "text-primaryColor" : "text-gray-400"} />
                                                <span className={`text-xs font-medium ${active ? "text-primaryColor" : "text-gray-600"}`}>
                                                    {label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                {!formData.coordinates?.length ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowLocationPicker(true)}
                                        className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                                    >
                                        📍 Select Address From Map
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowLocationPicker(true)}
                                        className="w-full flex items-center justify-between gap-3 p-3 border rounded-lg bg-blue-50 border-blue-200 hover:bg-blue-100 transition"
                                    >
                                        <div className="flex items-start gap-2 text-left overflow-hidden">
                                            <MapPin
                                                size={16}
                                                className="text-primaryColor mt-0.5 shrink-0"
                                            />

                                            <span className="text-sm text-gray-700 truncate">
                                                {[
                                                    formData.addressLine1,
                                                    formData.city,
                                                    formData.state,
                                                    formData.postalCode,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </span>
                                        </div>

                                        <Pencil
                                            size={16}
                                            className="text-gray-500 shrink-0"
                                        />
                                    </button>
                                )}
                            </div>
                            {/* Name + Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                        Full Name <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text" name="fullName" value={formData.fullName}
                                            onChange={handleChange} placeholder="Your full name"
                                            className={iconInputCls("fullName")}
                                        />
                                    </div>
                                    {errMsg("fullName")}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                        Phone <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            maxLength={10}
                                            type="tel" name="phone" value={formData.phone}
                                            onChange={handleChange} placeholder="1234567890"
                                            className={iconInputCls("phone")}
                                        />
                                    </div>
                                    {errMsg("phone")}
                                </div>
                            </div>

                            {/* Address Line 1 */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                    Address Line 1 <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text" name="addressLine1" value={formData.addressLine1}
                                    onChange={handleChange}
                                    placeholder="Street address, P.O. box, company name"
                                    className={inputCls("addressLine1")}
                                />
                                {errMsg("addressLine1")}
                            </div>

                            {/* Address Line 2 */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                    Address Line 2
                                </label>
                                <input
                                    type="text" name="addressLine2" value={formData.addressLine2}
                                    onChange={handleChange}
                                    placeholder="Apartment, suite, floor, etc."
                                    className={inputCls("addressLine2")}
                                />
                            </div>

                            {/* City + State + Postal */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                        City <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text" name="city" value={formData.city}
                                        onChange={handleChange} placeholder="City"
                                        className={inputCls("city")}
                                    />
                                    {errMsg("city")}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                        State <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text" name="state" value={formData.state}
                                        onChange={handleChange} placeholder="State"
                                        className={inputCls("state")}
                                    />
                                    {errMsg("state")}
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                        Postal Code <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text" name="postalCode" value={formData.postalCode}
                                        onChange={handleChange} placeholder="123456"
                                        className={inputCls("postalCode")}
                                    />
                                    {errMsg("postalCode")}
                                </div>
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                    Country <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text" name="country" value={formData.country}
                                    onChange={handleChange} placeholder="Country"
                                    className={inputCls("country")}
                                />
                                {errMsg("country")}
                            </div>

                            {/* Landmark */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                    Landmark <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <div className="relative">
                                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text" name="landmark" value={formData.landmark}
                                        onChange={handleChange}
                                        placeholder="Near Central Park, Behind Mall…"
                                        className={iconInputCls("landmark")}
                                    />
                                </div>
                            </div>

                            {/* Default checkbox */}
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input
                                    type="checkbox" name="isDefault"
                                    checked={formData.isDefault} onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-primaryColor focus:ring-primaryColor accent-primaryBtnColor"
                                />
                                <span className="text-sm text-gray-700">Make this my default address</span>
                            </label>
                        </div>

                        {/* Footer */}
                        <div className="grid grid-cols-2 w-full md:max-w-2xl self-end gap-2.5  py-4 border-t border-gray-200 shrink-0">
                            <button
                                type="button" onClick={handleClose} disabled={loading}
                                className="flex-1 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit" disabled={loading}
                                className={`flex-1 py-2.5 text-sm font-medium text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isEdit
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-primaryBtnColor hover:bg-primaryBtnHoverColor"
                                    }`}
                            >
                                {loading ? (
                                    <><Loader2 size={15} className="animate-spin" /> {isEdit ? "Updating…" : "Adding…"}</>
                                ) : (
                                    <>{isEdit ? <Save size={15} /> : <Plus size={15} />} {isEdit ? "Update Address" : "Add Address"}</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </ModalWrapper>
            {
                showLocationPicker && (
                    <LocationPicker
                        onClose={() => setShowLocationPicker(false)}
                        onSelect={(location) => {
                            handleLocationSelect(location);
                            setShowLocationPicker(false);
                        }}
                    />
                )
            }
        </>
    );
};

export default AddressModal;