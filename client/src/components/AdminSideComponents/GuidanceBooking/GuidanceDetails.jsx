import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdArrowBackIosNew } from "react-icons/md";
import {
  FiUser, FiPhone, FiMail, FiCalendar, FiClock,
  FiTag, FiLayers, FiBox, FiDollarSign, FiCreditCard,
  FiShield, FiCheckCircle, FiAlertCircle, FiHash,
} from "react-icons/fi";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dot: "bg-yellow-400",
  },
  completed: {
    label: "Completed",
    className: "bg-green-50 text-green-700 border border-green-200",
    dot: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-400",
  },
};

const PAYMENT_STATUS_CONFIG = {
  completed: {
    label: "Payment Successful",
    className: "bg-green-50 text-green-700 border border-green-200",
    icon: FiCheckCircle,
  },
  pending: {
    label: "Payment Pending",
    className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    icon: FiAlertCircle,
  },
  failed: {
    label: "Payment Failed",
    className: "bg-red-50 text-red-700 border border-red-200",
    icon: FiAlertCircle,
  },
};

// ── Skeleton primitives ───────────────────────────────────────────────────────
const Shimmer = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

const SkeletonField = () => (
  <div className="space-y-2">
    <Shimmer className="h-3 w-24" />
    <Shimmer className="h-5 w-40" />
  </div>
);

const SkeletonCard = ({ fields = 3, title = true }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
      {title && <Shimmer className="h-3 w-32" />}
    </div>
    <div className="p-5 sm:p-6">
      <div className={`grid grid-cols-1 ${fields >= 3 ? "sm:grid-cols-2 md:grid-cols-3" : "sm:grid-cols-2"} gap-5`}>
        {Array.from({ length: fields }).map((_, i) => (
          <SkeletonField key={i} />
        ))}
      </div>
    </div>
  </div>
);

// ── InfoCard ──────────────────────────────────────────────────────────────────
const InfoCard = ({ title, children, cols = 3 }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
      <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest">{title}</h3>
    </div>
    <div className={`p-5 sm:p-6 grid grid-cols-1 ${cols === 3 ? "sm:grid-cols-2 md:grid-cols-3" : cols === 2 ? "sm:grid-cols-2" : ""} gap-5`}>
      {children}
    </div>
  </div>
);

// ── Field ─────────────────────────────────────────────────────────────────────
const Field = ({ icon: Icon, label, value, mono = false, accent }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </p>
    <p className={`text-sm font-medium break-all
            ${mono ? "font-mono text-xs text-gray-600" : "text-gray-800"}
            ${accent === "green" ? "text-green-600 font-semibold" : ""}
            ${accent === "blue" ? "text-[#00395F] font-semibold" : ""}
            ${accent === "orange" ? "text-orange-500 font-bold text-base" : ""}
        `}>
      {value ?? <span className="text-gray-300 italic">—</span>}
    </p>
  </div>
);

// ── Format helpers ────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  // date is stored as "YYYY-MM-DD" string — parse without timezone shift
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
};

const formatTime = (timeStr) => {
  if (!timeStr) return null;
  const [hh, mm] = timeStr.split(":");
  const h = parseInt(hh);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${mm} ${suffix}`;
};

const formatDateTime = (isoStr) => {
  if (!isoStr) return null;
  const d = new Date(isoStr);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

const INR = (n) =>
  n != null ? `₹${Number(n).toLocaleString("en-IN")}` : null;

// ── GuidanceDetails ───────────────────────────────────────────────────────────
const GuidanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/guidance-booking/get-book-by-id/${id}`)
      .then((r) => { setData(r.data); setError(null); })
      .catch(() => setError("Failed to fetch guidance details"))
      .finally(() => setLoading(false));
  }, [id]);

  const bookingStatus = STATUS_CONFIG[data?.status?.toLowerCase()] || STATUS_CONFIG.pending;
  const paymentConfig = PAYMENT_STATUS_CONFIG[data?.paymentStatus?.toLowerCase()] || PAYMENT_STATUS_CONFIG.pending;
  const PaymentIcon = paymentConfig.icon;

  return (
    <div className="min-h-screen bg-[#FFFAF6] py-8">
      <div className="max-w-full mx-auto px-4">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-7">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-all"
          >
            <MdArrowBackIosNew size={15} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Guidance Booking</h1>
            {!loading && data && (
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{data._id}</p>
            )}
            {loading && <Shimmer className="h-3 w-48 mt-1" />}
          </div>

          {/* Status badge — top right on desktop */}
          {!loading && data && (
            <div className="ml-auto flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${bookingStatus.className}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${bookingStatus.dot}`} />
                {bookingStatus.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${paymentConfig.className}`}>
                <PaymentIcon className="w-3 h-3" />
                {paymentConfig.label}
              </span>
            </div>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3 mb-6">
            <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">{error}</p>
              <button onClick={() => navigate(-1)} className="text-xs text-red-500 underline mt-0.5">
                Go back
              </button>
            </div>
          </div>
        )}

        {/* ── Skeleton ── */}
        {loading && (
          <div className="space-y-5">
            <SkeletonCard fields={3} />
            <SkeletonCard fields={4} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <SkeletonCard fields={2} />
              <SkeletonCard fields={3} />
            </div>
            <SkeletonCard fields={3} />
          </div>
        )}

        {/* ── Content ── */}
        {!loading && data && (
          <div className="space-y-5">

            {/* Personal Information */}
            <InfoCard title="Personal Information" cols={3}>
              <Field icon={FiUser} label="Full Name" value={data.fullName} />
              <Field icon={FiPhone} label="Mobile Number" value={data.mobileNumber} />
              <Field icon={FiMail} label="Email Address" value={data.email} />
            </InfoCard>

            {/* Category Details */}
            <InfoCard title="Category Details" cols={2}>
              <Field icon={FiTag} label="Category" value={data.category?.name} />
              <Field icon={FiLayers} label="Sub Category" value={data.subCategory?.name} />
              <Field icon={FiLayers} label="Sub-Sub Category" value={data.subSubCategory?.name} />
              <Field icon={FiBox} label="Product" value={data.product?.name} />
            </InfoCard>

            {/* Two-column: Scheduling + Financial */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Scheduling */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                  <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest">Scheduling</h3>
                </div>
                <div className="p-5 sm:p-6 space-y-5">
                  <Field icon={FiCalendar} label="Date" value={formatDate(data.date)} />
                  <Field icon={FiClock} label="Time" value={formatTime(data.time)} />
                  <Field icon={FiClock} label="Discussion Time" value={data.discussionTime} />
                </div>
              </div>

              {/* Financial */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                  <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest">Financials</h3>
                </div>
                <div className="p-5 sm:p-6 space-y-5">
                  <Field icon={FiDollarSign} label="Investment Range" value={data.investmentAmount || "Not specified"} />
                  <Field icon={FiCreditCard} label="Consultation Fee" value={INR(data.discussionFee)} accent="blue" />
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Base fee</span>
                      <span className="font-medium text-gray-700">{INR(data.paymentAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">GST (18%)</span>
                      <span className="font-medium text-gray-700">{INR(data.gstAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                      <span className="text-gray-800">Total Paid</span>
                      <span className="text-orange-500 text-base">{INR(data.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest">Payment Details</h3>
              </div>
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  <Field icon={FiHash} label="Payment ID" value={data.paymentId} mono />
                  <Field icon={FiHash} label="Order ID" value={data.orderId} mono />
                  <Field icon={FiShield} label="Signature" value={data.paymentSignature ? `${data.paymentSignature.slice(0, 16)}…` : null} mono />
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest">Record Info</h3>
              </div>
              <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <Field icon={FiHash} label="Booking ID" value={data._id} mono />
                <Field icon={FiCalendar} label="Created At" value={formatDateTime(data.createdAt)} />
                <Field icon={FiCalendar} label="Updated At" value={formatDateTime(data.updatedAt)} />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default GuidanceDetails;
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { MdArrowBackIosNew } from "react-icons/md";

// const GuidanceDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [guidanceData, setGuidanceData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchGuidanceDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/guidance-booking/get-book-by-id/${id}`
//         );
//         setGuidanceData(response.data);
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch guidance details");
//         console.error("Error fetching guidance details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchGuidanceDetails();
//     }
//   }, [id]);

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
//       completed: "bg-blue-100 text-blue-700 border border-blue-300",
//       rejected: "bg-red-100 text-red-700 border border-red-300",
//     };
//     return (
//       colors[status?.toLowerCase()] ||
//       "bg-gray-100 text-gray-700 border border-gray-300"
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
//           <p className="text-gray-600">Loading guidance details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!guidanceData) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <p className="text-gray-600">No guidance data found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6">
//       <div className="px-4">
//         {/* Header */}
//         <div className="flex items-center mb-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 mr-3"
//           >
//             <MdArrowBackIosNew size={18} className="text-gray-600" />
//           </button>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Guidance Details
//           </h1>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white rounded-lg shadow-sm border p-5">
//             <h2 className="text-lg font-medium text-gray-800 mb-4">
//               Personal Information
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Full Name
//                 </label>
//                 <p className="text-gray-800">{guidanceData.fullName}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Mobile Number
//                 </label>
//                 <p className="text-gray-800">{guidanceData.mobileNumber}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Email
//                 </label>
//                 <p className="text-gray-800">{guidanceData.email}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm border p-5">
//             <h2 className="text-lg font-medium text-gray-800 mb-4">
//               Category Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Category
//                 </label>
//                 <p className="text-gray-800">{guidanceData.category?.name}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Sub Category
//                 </label>
//                 <p className="text-gray-800">
//                   {guidanceData.subCategory?.name}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Sub Sub Category
//                 </label>
//                 <p className="text-gray-800">
//                   {guidanceData.subSubCategory?.name}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Product
//                 </label>
//                 <p className="text-gray-800">{guidanceData.product?.name}</p>
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white rounded-lg shadow-sm border p-5">
//               <h2 className="text-lg font-medium text-gray-800 mb-4">
//                 Financial Details
//               </h2>
//               <div className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Investment Amount
//                   </label>
//                   <p className="text-lg font-semibold text-green-600">
//                     ₹{guidanceData.investmentAmount?.toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Discussion Fee
//                   </label>
//                   <p className="text-lg font-semibold text-blue-600">
//                     ₹{guidanceData.discussionFee?.toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg shadow-sm border p-5">
//               <h2 className="text-lg font-medium text-gray-800 mb-4">
//                 Scheduling Details
//               </h2>
//               <div className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Date
//                   </label>
//                   <p className="text-gray-800">
//                     {new Date(guidanceData.date).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Time
//                   </label>
//                   <p className="text-gray-800">{guidanceData.time}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Discussion Time
//                   </label>
//                   <p className="text-gray-800">{guidanceData.discussionTime}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white rounded-lg shadow-sm border p-5">
//               <h2 className="text-lg font-medium text-gray-800 mb-4">Status</h2>
//               <div
//                 className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                   guidanceData.status
//                 )}`}
//               >
//                 {guidanceData.status?.charAt(0).toUpperCase() +
//                   guidanceData.status?.slice(1)}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuidanceDetails;
