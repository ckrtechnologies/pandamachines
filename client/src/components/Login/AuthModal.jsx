import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFileImage, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import loginPanda from "../../Assets/img/common/loginPanda.gif";
import regPanda from "../../Assets/img/common/registerPanda.gif";

const GENDERS = ["Male", "Female", "Other"];

const inputCls =
    "block w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors";

const AuthModal = ({ mode, onModeChange, onClose }) => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [pendingUserData, setPendingUserData] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", gender: "Male", email: "", imageUrl: "",
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isImageUploading, setIsImageUploading] = useState(false);

    const { checkPhone, verifyLoginOTP, verifyRegisterOTP, registerUser, authLoading } = useAuth();

    useEffect(() => {
        setPhone("");
        setOtp("");
        setStep(1);
        setPendingUserData(null);
        setFormData({ firstName: "", lastName: "", gender: "Male", email: "", imageUrl: "" });
        setPreviewUrl(null);
    }, [mode]);

    const switchMode = (newMode) => onModeChange(newMode);

    const getTitle = () => {
        if (mode === "login") return "Login";
        if (step === 1) return "Register";
        if (step === 2) return "Verify OTP";
        return "Complete Profile";
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (mode === "login") {
            try {
                const result = await checkPhone(phone);
                if (result.exists) {
                    setPendingUserData(result.userData);
                    setStep(2);
                } else {
                    toast.error("No account found. Please register.");
                    switchMode("register");
                }
            } catch {
                toast.error("Something went wrong. Try again.");
            }
        } else {
            setStep(2);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            if (mode === "login") {
                await verifyLoginOTP(phone, otp, pendingUserData);
                onClose();
            } else {
                await verifyRegisterOTP(phone, otp);
                setStep(3);
            }
        } catch { }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ ...formData, phone });
            toast.success("Registration Successful");
            onClose();
        } catch {
            toast.error("Registration Failed");
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreviewUrl(URL.createObjectURL(file));
        try {
            setIsImageUploading(true);
            const uploadedUrl = await uploadToCloudinary(file);
            setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
            setPreviewUrl(null);
        } catch {
            toast.error("Image upload failed.");
        } finally {
            setIsImageUploading(false);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, imageUrl: "" }));
        setPreviewUrl(null);
    };

    const handleOtpChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, "");
        if (!value) {
            setOtp(otp.slice(0, index) + otp.slice(index + 1));
            return;
        }
        const newOtp = otp.slice(0, index) + value + otp.slice(index + 1);
        setOtp(newOtp.slice(0, 4));
        if (index < 3 && value) document.getElementById(`otp-${index + 1}`)?.focus();
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const leftContent = {
        login: { title: "Welcome Back!", subtitle: "Login to access your exclusive features.", img: loginPanda },
        register: { title: "Create Account", subtitle: "Join us to access exclusive features.", img: regPanda },
    };
    const { title: leftTitle, subtitle: leftSubtitle, img: leftImg } = leftContent[mode];

    const btnCls = (loading) =>
        `w-full py-2.5 px-4 rounded-lg font-medium text-white text-sm ${loading ? "bg-[#FF8617]" : "bg-[#00395F] hover:bg-[#FF8617]"} duration-200 transition-colors`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex"
                style={{ maxHeight: "92vh" }}
            >
                {/* ── Left Panel ── */}
                <div
                    className="hidden md:flex w-[42%] flex-shrink-0 bg-gradient-to-br from-[#00395F] via-purple-800 to-[#FF8617] items-center justify-center p-8"
                >
                    <div className="text-white text-center">
                        <h2 className="text-2xl font-bold mb-1">{leftTitle}</h2>
                        <p className="text-sm opacity-80 mb-6">{leftSubtitle}</p>
                        <div className="bg-white bg-opacity-20 rounded-full inline-flex items-center justify-center w-28 h-28">
                            <img className="h-20 w-auto object-contain" src={leftImg} alt="panda" />
                        </div>
                    </div>
                </div>

                {/* ── Right Panel ── */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Header — fixed */}
                    <div className="flex justify-between items-center px-6 py-4 border-b flex-shrink-0">
                        <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body — scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-5">

                        {/* Step 1: Phone */}
                        {step === 1 && (
                            <form onSubmit={handleSendOtp}>
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1.5">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="text-gray-400 text-sm">+91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            maxLength={10}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                            className={`${inputCls} pl-11`}
                                            placeholder="9876543210"
                                            pattern="[0-9]{10}"
                                            required
                                        />
                                    </div>
                                    <p className="mt-1.5 text-xs text-gray-400">We'll send you a verification code</p>
                                </div>
                                <button type="submit" disabled={authLoading} className={btnCls(authLoading)}>
                                    {authLoading ? "Sending..." : "Send OTP"}
                                </button>
                                <div className="mt-5 text-center">
                                    <p className="text-xs text-gray-500">
                                        {mode === "login" ? (
                                            <>Don't have an account?{" "}
                                                <button type="button" onClick={() => switchMode("register")} className="text-[#FF8617] font-medium hover:underline">Create</button>
                                            </>
                                        ) : (
                                            <>Already have an account?{" "}
                                                <button type="button" onClick={() => switchMode("login")} className="text-[#FF8617] font-medium hover:underline">Login</button>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </form>
                        )}

                        {/* Step 2: OTP */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp}>
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Enter OTP</label>
                                    <div className="flex gap-2.5">
                                        {[0, 1, 2, 3].map((index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                value={otp[index] || ""}
                                                onChange={(e) => handleOtpChange(e, index)}
                                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                                className="block w-full py-3 text-center text-base font-semibold border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                maxLength="1"
                                                required
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-1.5 text-xs text-gray-400">OTP sent to +91 {phone}</p>
                                </div>
                                <button type="submit" disabled={authLoading} className={btnCls(authLoading)}>
                                    {authLoading ? "Verifying..." : "Verify OTP"}
                                </button>
                                <div className="mt-3 text-center">
                                    <button type="button" onClick={() => setStep(1)} className="text-xs text-[#FF8617] hover:underline font-medium">
                                        Change Phone Number
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 3: Profile */}
                        {step === 3 && mode === "register" && (
                            <form onSubmit={handleRegister} className="space-y-4">
                                {/* Name row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="firstName" className="block text-xs font-medium text-gray-600 mb-1.5">
                                            First Name <span className="text-gray-400 font-normal"></span>
                                        </label>
                                        <input
                                            type="text" id="firstName" value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className={inputCls} placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-xs font-medium text-gray-600 mb-1.5">
                                            Last Name <span className="text-gray-400 font-normal"></span>
                                        </label>
                                        <input
                                            type="text" id="lastName" value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className={inputCls} placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1.5">
                                        Email <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="email" id="email" value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={inputCls} placeholder="john@example.com"
                                    />
                                </div>

                                {/* Gender chips */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                        Gender <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <div className="flex gap-2">
                                        {GENDERS.map((g) => {
                                            const active = formData.gender === g;
                                            return (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, gender: g })}
                                                    className="transition-all duration-150 text-xs font-medium px-4 py-2 select-none"
                                                    style={{
                                                        borderRadius: "10px",
                                                        border: active ? "1.5px solid #00395F" : "1.5px solid #e5e7eb",
                                                        background: active ? "#00395F" : "#f9fafb",
                                                        color: active ? "#ffffff" : "#6b7280",
                                                        boxShadow: active ? "0 1px 4px rgba(0,57,95,0.15)" : "none",
                                                    }}
                                                >
                                                    {g}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Profile Image */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                        Profile Image <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <div className="flex items-center gap-3">
                                        {!formData.imageUrl && !previewUrl && (
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById("profile-upload")?.click()}
                                                className="flex flex-col items-center justify-center w-20 h-16 border border-dashed border-gray-300 rounded-xl hover:border-[#FF8617] transition-colors bg-gray-50"
                                            >
                                                <FaFileImage className="text-lg text-gray-400 mb-1" />
                                                <span className="text-[10px] text-gray-400">Upload</span>
                                            </button>
                                        )}
                                        <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        {(previewUrl || formData.imageUrl) && (
                                            <div className="relative w-20 h-16 flex-shrink-0">
                                                <img
                                                    src={previewUrl || formData.imageUrl}
                                                    alt="Upload"
                                                    className="w-full h-full object-cover rounded-xl border border-gray-200"
                                                />
                                                {isImageUploading && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center rounded-xl">
                                                        <FaSpinner className="text-white animate-spin text-sm" />
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow hover:bg-red-600 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                        {(previewUrl || formData.imageUrl) && (
                                            <span className="text-xs text-gray-400">
                                                {isImageUploading ? "Uploading..." : "Looks good!"}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button type="submit" disabled={authLoading} className={btnCls(authLoading)}>
                                    {authLoading ? "Registering..." : "Complete Registration"}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Footer — fixed */}
                    <div className="bg-gray-50 px-6 py-3 border-t flex-shrink-0">
                        <p className="text-center text-xs text-gray-400">
                            By continuing, you agree to our{" "}
                            <a href="##" className="text-[#FF8617] hover:underline">Terms</a>{" "}
                            and{" "}
                            <a href="##" className="text-[#FF8617] hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;