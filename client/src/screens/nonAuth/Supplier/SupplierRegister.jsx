// import React, { useState, useEffect } from "react";
// import { CheckCircle, Upload, User, Building, FileText, X } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const SupplierRegister = ({
//   isOpen = true,
//   onClose = () => {},
//   onLoginClick = () => {},
// }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     mobNo: "",
//     emailId: "",
//     gender: "Male",
//     address: "",
//     businessName: "",
//     businessType: "",
//     gstIn: "",
//     panNo: "",
//     commission: "",
//     bulkOrderCommission: "",
//     shopImage: null,
//     businessRegistrationName: "",
//     gstCertificate: null,
//     ownerIdProof: null,
//     showroomPhoto: null,
//     shopImageDoc: null,
//     otherDocuments: [],
//   });
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [uploading, setUploading] = useState({});
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [otherDocumentFiles, setOtherDocumentFiles] = useState([]);

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen) {
//       setCurrentStep(1);
//       setFormData({
//         fullName: "",
//         mobNo: "",
//         emailId: "",
//         gender: "Male",
//         address: "",
//         businessName: "",
//         businessType: "",
//         gstIn: "",
//         panNo: "",
//         commission: "",
//         bulkOrderCommission: "",
//         shopImage: null,
//         businessRegistrationName: "",
//         gstCertificate: null,
//         ownerIdProof: null,
//         showroomPhoto: null,
//         shopImageDoc: null,
//         otherDocuments: [],
//       });
//       setTermsAccepted(false);
//       setOtherDocumentFiles([]);
//       setErrors({});
//       setIsSubmitting(false);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     const handleEscKey = (event) => {
//       if (event.key === "Escape" && isOpen) {
//         onClose();
//       }
//     };

//     document.addEventListener("keydown", handleEscKey);
//     return () => {
//       document.removeEventListener("keydown", handleEscKey);
//     };
//   }, [isOpen, onClose]);

//   const uploadToCloudinary = async (file, fieldName) => {
//     setUploading((prev) => ({ ...prev, [fieldName]: true }));

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", `${process.env.REACT_APP_UPLOAD_PRESET}`);

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await response.json();
//       return data.secure_url;
//     } catch (error) {
//       console.error("Upload failed:", error);
//       return null;
//     } finally {
//       setUploading((prev) => ({ ...prev, [fieldName]: false }));
//     }
//   };

//   const handleFileUpload = async (e, fieldName) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const url = await uploadToCloudinary(file, fieldName);
//     if (url) {
//       setFormData((prev) => ({ ...prev, [fieldName]: url }));
//     }
//   };

//   const handleOtherDocumentUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const fieldName = `otherDoc_${Date.now()}_${i}`;
//       setUploading((prev) => ({ ...prev, [fieldName]: true }));

//       try {
//         const url = await uploadToCloudinary(file, fieldName);
//         if (url) {
//           setFormData((prev) => ({
//             ...prev,
//             otherDocuments: [...prev.otherDocuments, url],
//           }));

//           setOtherDocumentFiles((prev) => [
//             ...prev,
//             { id: fieldName, name: file.name, url: url },
//           ]);
//         }
//       } finally {
//         setUploading((prev) => ({ ...prev, [fieldName]: false }));
//       }
//     }

//     e.target.value = "";
//   };

//   const removeOtherDocument = (documentId, url) => {
//     setFormData((prev) => ({
//       ...prev,
//       otherDocuments: prev.otherDocuments.filter((docUrl) => docUrl !== url),
//     }));

//     setOtherDocumentFiles((prev) =>
//       prev.filter((doc) => doc.id !== documentId)
//     );
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateBasicDetails = () => {
//     const newErrors = {};

//     if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
//     if (!formData.mobNo.trim()) newErrors.mobNo = "Mobile number is required";
//     else if (!/^\d{10}$/.test(formData.mobNo))
//       newErrors.mobNo = "Enter valid 10-digit mobile number";
//     if (!formData.emailId.trim()) newErrors.emailId = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.emailId))
//       newErrors.emailId = "Enter valid email";
//     if (!formData.address.trim()) newErrors.address = "Address is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateBusinessDetails = () => {
//     const newErrors = {};

//     if (!formData.businessName.trim())
//       newErrors.businessName = "Business name is required";
//     if (!formData.businessType.trim())
//       newErrors.businessType = "Business type is required";
//     if (!formData.gstIn.trim()) newErrors.gstIn = "GSTIN is required";
//     if (!formData.panNo.trim()) newErrors.panNo = "PAN number is required";
//     if (!formData.commission) newErrors.commission = "Commission is required";
//     else if (![5, 10, 15, 20, 30, 40].includes(Number(formData.commission)))
//       newErrors.commission = "Please select a valid commission percentage";

//     if (
//       formData.bulkOrderCommission &&
//       (Number(formData.bulkOrderCommission) < 0 ||
//         Number(formData.bulkOrderCommission) > 50)
//     ) {
//       newErrors.bulkOrderCommission =
//         "Bulk order commission must be between 0 and 50";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleContinue = () => {
//     if (currentStep === 1 && validateBasicDetails()) {
//       setCurrentStep(2);
//     } else if (currentStep === 2 && validateBusinessDetails()) {
//       setCurrentStep(3);
//     } else if (currentStep === 3 && validateDocuments()) {
//     }
//   };

//   const handleSubmit = async () => {
//     if (!termsAccepted) {
//       toast.error("Please accept Terms and Conditions to proceed");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const payload = {
//         fullName: formData.fullName,
//         mobNo: formData.mobNo,
//         emailId: formData.emailId,
//         gender: formData.gender,
//         address: formData.address,
//         businessName: formData.businessName,
//         businessType: formData.businessType,
//         businessRegistrationName: formData.businessRegistrationName,
//         panNo: formData.panNo,
//         commission: Number(formData.commission),
//         bulkOrderCommission: Number(formData.bulkOrderCommission) || 0,
//         gstIn: formData.gstIn,
//         shopImage: formData.shopImage || formData.shopImageDoc,
//         panImage: formData.ownerIdProof,
//         addressProof: formData.showroomPhoto,
//         ownerIdProof: formData.ownerIdProof,
//         gstCertificate: formData.gstCertificate,
//         otherDocuments: formData.otherDocuments,
//       };

//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/supplier/suppliers/register`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setCurrentStep(4);
//         toast.success("Registration Success , Wait For Approval");
//       } else {
//         throw new Error(response.data.message || "Registration failed");
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error(
//         error.response?.data?.error ||
//           error.response?.data?.message ||
//           error.message ||
//           "Registration failed. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   const validateDocuments = () => {
//     const newErrors = {};

//     if (!formData.shopImage) {
//       newErrors.shopImage = "Shop Image is required";
//     }
//     if (!formData.gstCertificate) {
//       newErrors.gstCertificate = "GST Certificate is required";
//     }
//     if (!formData.ownerIdProof) {
//       newErrors.ownerIdProof = "Owner ID Proof is required";
//     }
//     if (!formData.showroomPhoto) {
//       newErrors.showroomPhoto = "Showroom Photo is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const steps = [
//     { step: 1, label: "Basic Detail", icon: User },
//     { step: 2, label: "Business Detail", icon: Building },
//     { step: 3, label: "Documents", icon: FileText },
//   ];

//   const FileUpload = ({
//     fieldName,
//     label,
//     accept = "image/*",
//     required = false,
//     sublabel = "",
//   }) => (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//         {sublabel && (
//           <span className="text-gray-500 text-xs ml-2">({sublabel})</span>
//         )}
//       </label>
//       <div
//         className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-[#00569e] transition-colors ${
//           errors[fieldName] ? "border-red-500 bg-red-50" : "border-gray-300"
//         }`}
//       >
//         <input
//           type="file"
//           accept={accept}
//           onChange={(e) => handleFileUpload(e, fieldName)}
//           className="hidden"
//           id={fieldName}
//         />
//         <label htmlFor={fieldName} className="cursor-pointer">
//           {uploading[fieldName] ? (
//             <div className="flex items-center justify-center">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00569e]"></div>
//               <span className="ml-2">Uploading...</span>
//             </div>
//           ) : formData[fieldName] ? (
//             <div className="text-[#8cc441] flex items-center justify-center">
//               <CheckCircle className="h-5 w-5 mr-2" />
//               File uploaded successfully
//             </div>
//           ) : (
//             <div className="text-gray-600 flex items-center justify-center">
//               <Upload className="h-5 w-5 mr-2" />
//               Click to upload {label.toLowerCase()}
//             </div>
//           )}
//         </label>
//       </div>
//       {errors[fieldName] && (
//         <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
//       )}
//       <p className="text-xs text-gray-500 mt-2">
//         Accepted formats: Images, PDF, DOC, DOCX. You can select single file at
//         once.
//       </p>
//     </div>
//   );

//   const OtherDocumentsUpload = () => {
//     const isUploading = Object.keys(uploading).some(
//       (key) => key.startsWith("otherDoc_") && uploading[key]
//     );

//     return (
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Other Documents (Optional)
//         </label>

//         {otherDocumentFiles.length > 0 && (
//           <div className="mb-4 space-y-2">
//             {otherDocumentFiles.map((doc) => (
//               <div
//                 key={doc.id}
//                 className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
//               >
//                 <div className="flex-1">
//                   <div className="font-medium text-gray-900 text-sm">
//                     {doc.name}
//                   </div>
//                   <div className="text-gray-500 text-xs">
//                     Document uploaded successfully
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => removeOtherDocument(doc.id, doc.url)}
//                   className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
//                   type="button"
//                   title="Remove document"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#00569e] transition-colors">
//           <input
//             type="file"
//             accept="image/*,.pdf,.doc,.docx"
//             multiple
//             onChange={handleOtherDocumentUpload}
//             className="hidden"
//             id="otherDocuments"
//             disabled={isUploading}
//           />
//           <label htmlFor="otherDocuments" className="cursor-pointer">
//             {isUploading ? (
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00569e]"></div>
//                 <span className="ml-2">Uploading documents...</span>
//               </div>
//             ) : (
//               <div className="text-gray-600 flex items-center justify-center">
//                 <Upload className="h-5 w-5 mr-2" />
//                 Click to upload additional documents
//               </div>
//             )}
//           </label>
//         </div>

//         <p className="text-xs text-gray-500 mt-2">
//           Accepted formats: Images, PDF, DOC, DOCX. You can select multiple
//           files at once.
//         </p>
//       </div>
//     );
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto no-scrollbar">
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//         onClick={onClose}
//       ></div>

//       {/* Modal Container */}
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
//           {/* Fixed Header Section */}
//           <div className="bg-gradient-to-r from-[#2a6e8e] to-[#00569e] border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-semibold text-white">
//                 Supplier Registration
//               </h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
//               aria-label="Close modal"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Fixed Step Indicators */}
//           <div className="bg-white px-6 py-5">
//             <div className="flex justify-center">
//               <div className="relative w-full max-w-md flex items-center justify-between">
//                 {/* Progress lines between steps */}
//                 {steps.map((_, idx) => {
//                   if (idx === steps.length - 1) return null;

//                   return (
//                     <div
//                       key={`line-${idx}`}
//                       className={`absolute top-1/2 h-1 rounded-full transition-all duration-300 ${
//                         currentStep > idx + 1
//                           ? "bg-gradient-to-r from-[#FF8617] to-[#fc7d06]"
//                           : currentStep === idx + 2
//                           ? "bg-gradient-to-r from-[#00569e] to-blue-400"
//                           : "bg-gray-300"
//                       }`}
//                       style={{
//                         left: `${
//                           (100 / (steps.length - 1)) * idx +
//                           (100 / (steps.length - 1)) * 0.15
//                         }%`,
//                         width: `${(100 / (steps.length - 1)) * 0.7}%`,
//                         transform: "translateY(-50%)",
//                       }}
//                     />
//                   );
//                 })}

//                 {steps.map(({ step, label, icon: Icon }) => (
//                   <div key={step} className="relative group z-10">
//                     {/* Step Circle */}
//                     <div
//                       className={`flex items-center justify-center w-10 h-10 rounded-full border-3 transition-all duration-300 ${
//                         currentStep === step
//                           ? "border-[#00569e] bg-[#00569e] text-white shadow-lg scale-110"
//                           : currentStep > step
//                           ? "border-[#FF8617] bg-[#FF8617] text-white"
//                           : "border-gray-300 bg-white text-gray-500"
//                       }`}
//                     >
//                       {currentStep > step ? (
//                         <CheckCircle className="h-6 w-6" />
//                       ) : (
//                         <Icon className="h-5 w-5" />
//                       )}
//                     </div>

//                     {/* Step Label */}
//                     <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
//                       <span
//                         className={`text-xs font-medium ${
//                           currentStep >= step
//                             ? "text-[#00569e]"
//                             : "text-gray-500"
//                         }`}
//                       >
//                         {label}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Scrollable Content Area */}
//           <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar">
//             {/* Step 1: Basic Details */}
//             {currentStep === 1 && (
//               <div className="space-y-4">
//                 <div>
//                   <input
//                     type="text"
//                     name="fullName"
//                     placeholder="Full Name"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
//                       errors.fullName ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.fullName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.fullName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <input
//                     type="tel"
//                     name="mobNo"
//                     placeholder="Mobile Number"
//                     value={formData.mobNo}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
//                       errors.mobNo ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.mobNo && (
//                     <p className="text-red-500 text-sm mt-1">{errors.mobNo}</p>
//                   )}
//                 </div>

//                 <div>
//                   <input
//                     type="email"
//                     name="emailId"
//                     placeholder="Email Address"
//                     value={formData.emailId}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
//                       errors.emailId ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.emailId && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.emailId}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <p className="text-sm font-medium text-gray-700 mb-3">
//                     Gender <span className="text-red-500">*</span>
//                   </p>
//                   <div className="flex space-x-6">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value="Male"
//                         checked={formData.gender === "Male"}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-[#00569e] border-gray-300 focus:ring-[#00569e]"
//                       />
//                       <span className="ml-2 text-gray-700">Male</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value="Female"
//                         checked={formData.gender === "Female"}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-[#00569e] border-gray-300 focus:ring-[#00569e]"
//                       />
//                       <span className="ml-2 text-gray-700">Female</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <textarea
//                     name="address"
//                     placeholder="Complete Address"
//                     rows="3"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors resize-none ${
//                       errors.address ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.address && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.address}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Step 2: Business Details */}
//             {currentStep === 2 && (
//               <div className="space-y-4">
//                 <div>
//                   <input
//                     type="text"
//                     name="businessName"
//                     placeholder="Business Name"
//                     value={formData.businessName}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
//                       errors.businessName ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.businessName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.businessName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <input
//                     type="text"
//                     name="businessType"
//                     placeholder="Business Type"
//                     value={formData.businessType}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
//                       errors.businessType ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.businessType && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.businessType}
//                     </p>
//                   )}
//                 </div>

//                 {/* Commission Selection */}
//                 <div>
//                   <select
//                     name="commission"
//                     value={formData.commission}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
//                       errors.commission ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select Commission Percentage</option>
//                     {/* <option value="5">5%</option> */}
//                     <option value="10">10%</option>
//                     <option value="15">15%</option>
//                     <option value="20">20%</option>
//                     <option value="30">30%</option>
//                     <option value="40">40%</option>
//                   </select>
//                   {errors.commission && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.commission}
//                     </p>
//                   )}
//                   <p className="text-xs text-gray-700 mt-1">
//                     Higher commission rates increase your product’s visibility —
//                     the more you offer, the higher your product appears in
//                     listings.
//                   </p>
//                 </div>

//                 <div>
//                   <select
//                     name="bulkOrderCommission"
//                     value={formData.bulkOrderCommission}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
//                       errors.bulkOrderCommission
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">
//                       Select Bulk Order Commission (Optional)
//                     </option>
//                     <option value="0">0% - No extra commission</option>
//                     <option value="5">5%</option>
//                     <option value="10">10%</option>
//                     <option value="15">15%</option>
//                     <option value="20">20%</option>
//                     <option value="25">25%</option>
//                     <option value="30">30%</option>
//                     <option value="35">35%</option>
//                     <option value="40">40%</option>
//                     <option value="45">45%</option>
//                     <option value="50">50%</option>
//                   </select>
//                   {errors.bulkOrderCommission && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.bulkOrderCommission}
//                     </p>
//                   )}
//                   <p className="text-xs text-gray-700 mt-1">
//                     Extra commission applied only on bulk orders. This is
//                     optional and can help attract larger orders.
//                   </p>
//                 </div>

//                 <div>
//                   <label htmlFor="Gst" className="text-sm">
//                     GST <span className="text-red-400">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="gstIn"
//                     placeholder="GST Number"
//                     value={formData.gstIn}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 mt-1.5 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
//                       errors.gstIn ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.gstIn && (
//                     <p className="text-red-500 text-sm mt-1">{errors.gstIn}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="Gst" className="text-sm">
//                     PAN <span className="text-red-400">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="panNo"
//                     placeholder="PAN Number (e.g., ABCDE1234F)"
//                     value={formData.panNo}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 mt-1.5 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
//                       errors.panNo ? "border-red-500" : "border-gray-300"
//                     }`}
//                     maxLength="10"
//                     style={{ textTransform: "uppercase" }}
//                   />
//                   {errors.panNo && (
//                     <p className="text-red-500 text-sm mt-1">{errors.panNo}</p>
//                   )}
//                   <p className="text-xs text-gray-500 mt-1">
//                     Enter 10-character PAN (e.g., ABCDE1234F)
//                   </p>
//                 </div>

//                 <FileUpload
//                   fieldName="shopImage"
//                   label="Shop Image"
//                   required={true}
//                 />
//               </div>
//             )}

//             {/* Step 3: Documents */}
//             {currentStep === 3 && (
//               <div className="space-y-4">
//                 <div>
//                   <input
//                     type="text"
//                     name="businessRegistrationName"
//                     placeholder="Business Registration Name"
//                     value={formData.businessRegistrationName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors"
//                   />
//                 </div>

//                 <FileUpload
//                   fieldName="gstCertificate"
//                   label="GST Certificate"
//                   required={true}
//                 />
//                 <FileUpload
//                   fieldName="ownerIdProof"
//                   label="Owner ID Proof"
//                   required={true}
//                   sublabel="Aadhar card/Corporation certificate"
//                 />
//                 <FileUpload
//                   fieldName="showroomPhoto"
//                   label="Showroom Photo"
//                   required={true}
//                 />
//                 <OtherDocumentsUpload />
//                 <div className="mt-6 pt-4 border-t border-gray-200">
//                   <label className="flex items-start cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={termsAccepted}
//                       onChange={(e) => setTermsAccepted(e.target.checked)}
//                       className="mt-1 h-4 w-4 text-[#00569e] border-gray-300 rounded focus:ring-[#00569e]"
//                     />
//                     <span className="ml-3 text-sm text-gray-700">
//                       I agree to the{" "}
//                       <a
//                         href="#"
//                         className="text-[#00569e] hover:text-[#004680] font-medium"
//                       >
//                         Terms and Conditions
//                       </a>{" "}
//                       and{" "}
//                       <a
//                         href="#"
//                         className="text-[#00569e] hover:text-[#004680] font-medium"
//                       >
//                         Privacy Policy
//                       </a>
//                     </span>
//                   </label>
//                 </div>
//               </div>
//             )}

//             {/* Step 4: Success */}
//             {currentStep === 4 && (
//               <div className="text-center py-8">
//                 <div className="mb-6">
//                   <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
//                     <CheckCircle className="h-12 w-12 text-[#FF8617]" />
//                   </div>
//                 </div>

//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                   Registration Submitted!
//                 </h2>
//                 <p className="text-gray-600 mb-6">
//                   {/* Your registration has been submitted successfully. You will be
//                   notified once your application is reviewed. */}
//                   Your registration has been submitted and is under review. You
//                   will be notified once approved.
//                 </p>

//                 <button
//                   onClick={() => {
//                     onClose();
//                     onLoginClick();
//                   }}
//                   className="text-[#004680] hover:text-[#00365f] font-medium underline mt-4"
//                 >
//                   Click here to login
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Fixed Footer with Action Buttons */}
//           {currentStep < 4 && (
//             <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
//               {currentStep === 1 && (
//                 <div>
//                   <div className="flex space-x-4 justify-between items-center">
//                     <button
//                       onClick={onClose}
//                       className="border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors w-full border"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleContinue}
//                       className="w-full bg-[#004680] hover:bg-[#00365f] text-white py-3 px-6 rounded-lg font-medium transition-colors"
//                     >
//                       Continue
//                     </button>
//                   </div>
//                   {/* Login link below continue button */}
//                   <div className="text-center mt-4">
//                     <span className="text-sm text-gray-600">
//                       Already have an account?{" "}
//                     </span>
//                     <button
//                       onClick={() => {
//                         onClose();
//                         onLoginClick();
//                       }}
//                       className="text-[#004680] hover:text-[#00365f] font-medium underline text-sm"
//                     >
//                       Click here to login
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {currentStep > 1 && currentStep < 4 && (
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={() => setCurrentStep(currentStep - 1)}
//                     className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//                   >
//                     Back
//                   </button>
//                   {currentStep === 3 ? (
//                     <button
//                       onClick={() => {
//                         if (!termsAccepted) {
//                           toast.error(
//                             "Please accept Terms and Conditions to proceed"
//                           );
//                           return;
//                         }
//                         if (validateDocuments()) {
//                           handleSubmit();
//                         }
//                       }}
//                       disabled={isSubmitting || !termsAccepted}
//                       className="flex-1 bg-[#004680] hover:bg-[#00365f] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isSubmitting ? (
//                         <div className="flex items-center justify-center">
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                           Submitting...
//                         </div>
//                       ) : (
//                         "Submit Registration"
//                       )}
//                     </button>
//                   ) : (
//                     <button
//                       onClick={handleContinue}
//                       className="flex-1 bg-[#004680] hover:bg-[#00365f] text-white py-3 px-6 rounded-lg font-medium transition-colors"
//                     >
//                       Continue
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Success page close button */}
//           {currentStep === 4 && (
//             <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
//               <button
//                 onClick={onClose}
//                 className="w-full bg-[#004680] hover:bg-[#00365f] text-white py-3 px-6 rounded-lg font-medium transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupplierRegister;


import React, { useState, useEffect } from "react";
import { CheckCircle, Upload, User, Building, FileText, X } from "lucide-react";

const TermsAndPrivacyModal = ({ isOpen = false, onClose = () => {}, onAccept = () => {} }) => {
  const [activeTab, setActiveTab] = useState("terms");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);

  const handleScroll = (e) => {
    const element = e.target;
    const isScrolledToBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 10;

    if (activeTab === "terms" && isScrolledToBottom) {
      setHasReadTerms(true);
    } else if (activeTab === "privacy" && isScrolledToBottom) {
      setHasReadPrivacy(true);
    }
  };

  const canAccept = hasReadTerms && hasReadPrivacy;

  const handleAccept = () => {
    if (termsAccepted && privacyAccepted && canAccept) {
      onAccept();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-[#2a6e8e] to-[#00569e] px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Terms & Conditions and Privacy Policy
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex border-b border-gray-200 bg-gray-50 px-6">
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "terms"
                  ? "border-b-2 border-[#00569e] text-[#00569e]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "privacy"
                  ? "border-b-2 border-[#00569e] text-[#00569e]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Privacy Policy
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto px-6 py-6 text-sm text-gray-700 space-y-4"
            onScroll={handleScroll}
          >
            {activeTab === "terms" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Agreement to Terms</h3>
                  <p>By registering as a supplier on our platform, you agree to comply with and be bound by these Terms and Conditions.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Supplier Registration</h3>
                  <p>You must provide accurate, truthful, and complete information. You are responsible for maintaining confidentiality of your account credentials.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Business Information</h3>
                  <p>All business information including GST number, PAN, and business registration must be genuine and verified.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Commission Structure</h3>
                  <p>Commission percentages you select are binding. Higher commission rates improve product visibility on our platform.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Product Quality Standards</h3>
                  <p>You agree to provide products that meet all applicable quality standards and legal requirements.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Prohibited Activities</h3>
                  <p>You agree not to engage in fraudulent activities, misrepresent products, or manipulate platform systems.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">7. Account Termination</h3>
                  <p>We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent activity.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">8. Limitation of Liability</h3>
                  <p>The platform and its services are provided "as is" without warranties.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">9. Changes to Terms</h3>
                  <p>We may update these Terms and Conditions at any time. Your continued use indicates acceptance.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">10. Governing Law</h3>
                  <p>These Terms are governed by the laws of India.</p>
                </div>
                {hasReadTerms && (
                  <div className="flex items-center text-[#8cc441] font-medium mt-4">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Document fully read
                  </div>
                )}
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Information Collection</h3>
                  <p>We collect personal and business information including name, contact details, business documents, GST, and payment details.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Use of Information</h3>
                  <p>Your information is used to verify registration, process payments, communicate about your account, and comply with legal obligations.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Data Security</h3>
                  <p>We implement industry-standard security measures to protect your information from unauthorized access.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Document Storage</h3>
                  <p>Your uploaded documents are stored securely on encrypted servers and kept confidential.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Third-Party Sharing</h3>
                  <p>We may share information with payment processors and legal authorities if required by law.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Communication</h3>
                  <p>We use your email and mobile number to send important updates about your account and registration status.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">7. Data Retention</h3>
                  <p>We retain your information as long as your account is active or as required by law.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">8. Your Rights</h3>
                  <p>You have the right to access, update, or delete your personal information by contacting our support team.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">9. Cookies and Tracking</h3>
                  <p>Our platform uses cookies to enhance your experience. You can disable cookies in browser settings.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">10. Policy Changes</h3>
                  <p>We may update this Privacy Policy. Changes will be posted with an updated date.</p>
                </div>
                {hasReadPrivacy && (
                  <div className="flex items-center text-[#8cc441] font-medium mt-4">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Document fully read
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 space-y-4">
            <div className="space-y-3">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={!hasReadTerms}
                  className="mt-1 h-4 w-4 text-[#00569e] border-gray-300 rounded focus:ring-[#00569e] disabled:opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  I have read and agree to the Terms & Conditions
                  {!hasReadTerms && (
                    <span className="text-gray-500 ml-1">(Please scroll to bottom)</span>
                  )}
                </span>
              </label>

              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  disabled={!hasReadPrivacy}
                  className="mt-1 h-4 w-4 text-[#00569e] border-gray-300 rounded focus:ring-[#00569e] disabled:opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  I have read and agree to the Privacy Policy
                  {!hasReadPrivacy && (
                    <span className="text-gray-500 ml-1">(Please scroll to bottom)</span>
                  )}
                </span>
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={!canAccept || !termsAccepted || !privacyAccepted}
                className="flex-1 bg-[#004680] hover:bg-[#00365f] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SupplierRegister = ({
  isOpen = true,
  onClose = () => {},
  onLoginClick = () => {},
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobNo: "",
    emailId: "",
    gender: "Male",
    address: "",
    businessName: "",
    businessType: "",
    gstIn: "",
    panNo: "",
    commission: "",
    bulkOrderCommission: "",
    shopImage: null,
    businessRegistrationName: "",
    gstCertificate: null,
    ownerIdProof: null,
    showroomPhoto: null,
    shopImageDoc: null,
    otherDocuments: [],
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otherDocumentFiles, setOtherDocumentFiles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({
        fullName: "",
        mobNo: "",
        emailId: "",
        gender: "Male",
        address: "",
        businessName: "",
        businessType: "",
        gstIn: "",
        panNo: "",
        commission: "",
        bulkOrderCommission: "",
        shopImage: null,
        businessRegistrationName: "",
        gstCertificate: null,
        ownerIdProof: null,
        showroomPhoto: null,
        shopImageDoc: null,
        otherDocuments: [],
      });
      setTermsAccepted(false);
      setOtherDocumentFiles([]);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  const uploadToCloudinary = async (file, fieldName) => {
    setUploading((prev) => ({ ...prev, [fieldName]: true }));

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", `${process.env.REACT_APP_UPLOAD_PRESET}`);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadToCloudinary(file, fieldName);
    if (url) {
      setFormData((prev) => ({ ...prev, [fieldName]: url }));
    }
  };

  const handleOtherDocumentUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fieldName = `otherDoc_${Date.now()}_${i}`;
      setUploading((prev) => ({ ...prev, [fieldName]: true }));

      try {
        const url = await uploadToCloudinary(file, fieldName);
        if (url) {
          setFormData((prev) => ({
            ...prev,
            otherDocuments: [...prev.otherDocuments, url],
          }));

          setOtherDocumentFiles((prev) => [
            ...prev,
            { id: fieldName, name: file.name, url: url },
          ]);
        }
      } finally {
        setUploading((prev) => ({ ...prev, [fieldName]: false }));
      }
    }

    e.target.value = "";
  };

  const removeOtherDocument = (documentId, url) => {
    setFormData((prev) => ({
      ...prev,
      otherDocuments: prev.otherDocuments.filter((docUrl) => docUrl !== url),
    }));

    setOtherDocumentFiles((prev) =>
      prev.filter((doc) => doc.id !== documentId)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateBasicDetails = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.mobNo.trim()) newErrors.mobNo = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobNo))
      newErrors.mobNo = "Enter valid 10-digit mobile number";
    if (!formData.emailId.trim()) newErrors.emailId = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.emailId))
      newErrors.emailId = "Enter valid email";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBusinessDetails = () => {
    const newErrors = {};

    if (!formData.businessName.trim())
      newErrors.businessName = "Business name is required";
    if (!formData.businessType.trim())
      newErrors.businessType = "Business type is required";
    if (!formData.gstIn.trim()) newErrors.gstIn = "GSTIN is required";
    if (!formData.panNo.trim()) newErrors.panNo = "PAN number is required";
    if (!formData.commission) newErrors.commission = "Commission is required";
    else if (![10, 15, 20, 30, 40].includes(Number(formData.commission)))
      newErrors.commission = "Please select a valid commission percentage";

    if (
      formData.bulkOrderCommission &&
      (Number(formData.bulkOrderCommission) < 0 ||
        Number(formData.bulkOrderCommission) > 50)
    ) {
      newErrors.bulkOrderCommission =
        "Bulk order commission must be between 0 and 50";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDocuments = () => {
    const newErrors = {};

    if (!formData.shopImage) {
      newErrors.shopImage = "Shop Image is required";
    }
    if (!formData.gstCertificate) {
      newErrors.gstCertificate = "GST Certificate is required";
    }
    if (!formData.ownerIdProof) {
      newErrors.ownerIdProof = "Owner ID Proof is required";
    }
    if (!formData.showroomPhoto) {
      newErrors.showroomPhoto = "Showroom Photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (currentStep === 1 && validateBasicDetails()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateBusinessDetails()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!validateDocuments()) return;

    setShowTermsModal(true);
  };

  const handleTermsAccept = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        mobNo: formData.mobNo,
        emailId: formData.emailId,
        gender: formData.gender,
        address: formData.address,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessRegistrationName: formData.businessRegistrationName,
        panNo: formData.panNo,
        commission: Number(formData.commission),
        bulkOrderCommission: Number(formData.bulkOrderCommission) || 0,
        gstIn: formData.gstIn,
        shopImage: formData.shopImage || formData.shopImageDoc,
        panImage: formData.ownerIdProof,
        addressProof: formData.showroomPhoto,
        ownerIdProof: formData.ownerIdProof,
        gstCertificate: formData.gstCertificate,
        otherDocuments: formData.otherDocuments,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/supplier/suppliers/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCurrentStep(4);
        setShowTermsModal(false);
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { step: 1, label: "Basic Detail", icon: User },
    { step: 2, label: "Business Detail", icon: Building },
    { step: 3, label: "Documents", icon: FileText },
  ];

  const FileUpload = ({
    fieldName,
    label,
    accept = "image/*",
    required = false,
    sublabel = "",
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {sublabel && (
          <span className="text-gray-500 text-xs ml-2">({sublabel})</span>
        )}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-[#00569e] transition-colors ${
          errors[fieldName] ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileUpload(e, fieldName)}
          className="hidden"
          id={fieldName}
        />
        <label htmlFor={fieldName} className="cursor-pointer">
          {uploading[fieldName] ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00569e]"></div>
              <span className="ml-2">Uploading...</span>
            </div>
          ) : formData[fieldName] ? (
            <div className="text-[#8cc441] flex items-center justify-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              File uploaded successfully
            </div>
          ) : (
            <div className="text-gray-600 flex items-center justify-center">
              <Upload className="h-5 w-5 mr-2" />
              Click to upload {label.toLowerCase()}
            </div>
          )}
        </label>
      </div>
      {errors[fieldName] && (
        <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        Accepted formats: Images, PDF, DOC, DOCX. You can select single file at
        once.
      </p>
    </div>
  );

  const OtherDocumentsUpload = () => {
    const isUploading = Object.keys(uploading).some(
      (key) => key.startsWith("otherDoc_") && uploading[key]
    );

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Other Documents (Optional)
        </label>

        {otherDocumentFiles.length > 0 && (
          <div className="mb-4 space-y-2">
            {otherDocumentFiles.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {doc.name}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Document uploaded successfully
                  </div>
                </div>
                <button
                  onClick={() => removeOtherDocument(doc.id, doc.url)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                  type="button"
                  title="Remove document"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#00569e] transition-colors">
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            multiple
            onChange={handleOtherDocumentUpload}
            className="hidden"
            id="otherDocuments"
            disabled={isUploading}
          />
          <label htmlFor="otherDocuments" className="cursor-pointer">
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00569e]"></div>
                <span className="ml-2">Uploading documents...</span>
              </div>
            ) : (
              <div className="text-gray-600 flex items-center justify-center">
                <Upload className="h-5 w-5 mr-2" />
                Click to upload additional documents
              </div>
            )}
          </label>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Accepted formats: Images, PDF, DOC, DOCX. You can select multiple
          files at once.
        </p>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-[#2a6e8e] to-[#00569e] border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Supplier Registration
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white px-6 py-5">
              <div className="flex justify-center">
                <div className="relative w-full max-w-md flex items-center justify-between">
                  {steps.map((_, idx) => {
                    if (idx === steps.length - 1) return null;

                    return (
                      <div
                        key={`line-${idx}`}
                        className={`absolute top-1/2 h-1 rounded-full transition-all duration-300 ${
                          currentStep > idx + 1
                            ? "bg-gradient-to-r from-[#FF8617] to-[#fc7d06]"
                            : currentStep === idx + 2
                            ? "bg-gradient-to-r from-[#00569e] to-blue-400"
                            : "bg-gray-300"
                        }`}
                        style={{
                          left: `${
                            (100 / (steps.length - 1)) * idx +
                            (100 / (steps.length - 1)) * 0.15
                          }%`,
                          width: `${(100 / (steps.length - 1)) * 0.7}%`,
                          transform: "translateY(-50%)",
                        }}
                      />
                    );
                  })}

                  {steps.map(({ step, label, icon: Icon }) => (
                    <div key={step} className="relative group z-10">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-3 transition-all duration-300 ${
                          currentStep === step
                            ? "border-[#00569e] bg-[#00569e] text-white shadow-lg scale-110"
                            : currentStep > step
                            ? "border-[#FF8617] bg-[#FF8617] text-white"
                            : "border-gray-300 bg-white text-gray-500"
                        }`}
                      >
                        {currentStep > step ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>

                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span
                          className={`text-xs font-medium ${
                            currentStep >= step
                              ? "text-[#00569e]"
                              : "text-gray-500"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="mobNo"
                      placeholder="Mobile Number"
                      value={formData.mobNo}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
                        errors.mobNo ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.mobNo && (
                      <p className="text-red-500 text-sm mt-1">{errors.mobNo}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="emailId"
                      placeholder="Email Address"
                      value={formData.emailId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
                        errors.emailId ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.emailId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.emailId}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Gender <span className="text-red-500">*</span>
                    </p>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === "Male"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-[#00569e] border-gray-300 focus:ring-[#00569e]"
                        />
                        <span className="ml-2 text-gray-700">Male</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === "Female"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-[#00569e] border-gray-300 focus:ring-[#00569e]"
                        />
                        <span className="ml-2 text-gray-700">Female</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <textarea
                      name="address"
                      placeholder="Complete Address"
                      rows="3"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors resize-none ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="businessName"
                      placeholder="Business Name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
                        errors.businessName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="businessType"
                      placeholder="Business Type"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
                        errors.businessType ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.businessType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.businessType}
                      </p>
                    )}
                  </div>

                  <div>
                    <select
                      name="commission"
                      value={formData.commission}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
                        errors.commission ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Commission Percentage</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                      <option value="30">30%</option>
                      <option value="40">40%</option>
                    </select>
                    {errors.commission && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.commission}
                      </p>
                    )}
                    <p className="text-xs text-gray-700 mt-1">
                      Higher commission rates increase your product's visibility
                    </p>
                  </div>

                  <div>
                    <select
                      name="bulkOrderCommission"
                      value={formData.bulkOrderCommission}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
                        errors.bulkOrderCommission
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">
                        Select Bulk Order Commission (Optional)
                      </option>
                      <option value="0">0% - No extra commission</option>
                      <option value="5">5%</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                      <option value="25">25%</option>
                      <option value="30">30%</option>
                      <option value="35">35%</option>
                      <option value="40">40%</option>
                      <option value="45">45%</option>
                      <option value="50">50%</option>
                    </select>
                    {errors.bulkOrderCommission && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bulkOrderCommission}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm">
                      GST <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="gstIn"
                      placeholder="GST Number"
                      value={formData.gstIn}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 mt-1.5 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
                        errors.gstIn ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.gstIn && (
                      <p className="text-red-500 text-sm mt-1">{errors.gstIn}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm">
                      PAN <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="panNo"
                      placeholder="PAN Number"
                      value={formData.panNo}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 mt-1.5 border rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors ${
                        errors.panNo ? "border-red-500" : "border-gray-300"
                      }`}
                      maxLength="10"
                    />
                    {errors.panNo && (
                      <p className="text-red-500 text-sm mt-1">{errors.panNo}</p>
                    )}
                  </div>

                  <FileUpload
                    fieldName="shopImage"
                    label="Shop Image"
                    required={true}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="businessRegistrationName"
                      placeholder="Business Registration Name"
                      value={formData.businessRegistrationName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00569e] focus:border-[#00569e] transition-colors"
                    />
                  </div>

                  <FileUpload
                    fieldName="gstCertificate"
                    label="GST Certificate"
                    required={true}
                  />
                  <FileUpload
                    fieldName="ownerIdProof"
                    label="Owner ID Proof"
                    required={true}
                    sublabel="Aadhar card/Corporation certificate"
                  />
                  <FileUpload
                    fieldName="showroomPhoto"
                    label="Showroom Photo"
                    required={true}
                  />
                  <OtherDocumentsUpload />
                </div>
              )}

              {currentStep === 4 && (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-12 w-12 text-[#FF8617]" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Registration Submitted!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your registration has been submitted and is under review. You
                    will be notified once approved.
                  </p>

                  <button
                    onClick={() => {
                      onClose();
                      onLoginClick();
                    }}
                    className="text-[#004680] hover:text-[#00365f] font-medium underline mt-4"
                  >
                    Click here to login
                  </button>
                </div>
              )}
            </div>

            {currentStep < 4 && (
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                {currentStep === 1 && (
                  <div>
                    <div className="flex space-x-4 justify-between items-center">
                      <button
                        onClick={onClose}
                        className="border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors w-full border"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleContinue}
                        className="w-full bg-[#004680] hover:bg-[#00365f] text-white py-3 px-6 rounded-lg font-medium transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                    <div className="text-center mt-4">
                      <span className="text-sm text-gray-600">
                        Already have an account?{" "}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onLoginClick();
                        }}
                        className="text-[#004680] hover:text-[#00365f] font-medium underline text-sm"
                      >
                        Click here to login
                      </button>
                    </div>
                  </div>
                )}

                {currentStep > 1 && currentStep < 4 && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    {currentStep === 3 ? (
                      <button
                        onClick={() => {
                          if (validateDocuments()) {
                            handleSubmit();
                          }
                        }}
                        disabled={isSubmitting}
                        className="flex-1 bg-[#004680] hover:bg-[#00365f] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          "Submit Registration"
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleContinue}
                        className="flex-1 bg-[#004680] hover:bg-[#00365f] text-white py-3 px-6 rounded-lg font-medium transition-colors"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                <button
                  onClick={onClose}
                  className="w-full bg-[#004680] hover:bg-[#00365f] text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TermsAndPrivacyModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
      />
    </>
  );
};

export default SupplierRegister;