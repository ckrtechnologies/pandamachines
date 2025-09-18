// import React from "react";
// import callCenter from "../../Assets/img/common/callCenter.png";
// import { useNavigate } from "react-router-dom";

// const DetailsRightSection = (product) => {
//   const navigate = useNavigate();
//   return (
//     <div className="space-y-4 lg:col-span-3">
//       {/* Video Section */}
//       <div className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow duration-300 overflow-hidden">
//         <div className="bg-gray-100 h-72 flex items-center justify-center relative">
//           <iframe
//             width="100%"
//             height="100%"
//             src="https://www.youtube.com/embed/fnfkV_MaLr0?si=YaajTwkMA7Z0R68y"
//             title="YouTube video player"
//             frameborder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             referrerpolicy="strict-origin-when-cross-origin"
//             allowfullscreen
//             className="absolute inset-0 w-full h-full"
//           ></iframe>
//         </div>
//       </div>

//       {/* Video Section */}
//       <div className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow duration-300 overflow-hidden">
//         <div className="bg-gray-100 h-72 flex items-center justify-center relative">
//           <iframe
//             width="100%"
//             height="100%"
//             src="https://www.youtube.com/embed/BbgQ98LdIeM?si=KH4cpZjo5K8uD6gC"
//             title="YouTube video player"
//             frameborder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             referrerpolicy="strict-origin-when-cross-origin"
//             allowfullscreen
//             className="absolute inset-0 w-full h-full"
//           ></iframe>
//         </div>
//       </div>

//       {/* Quote Form */}
//       <div className="bg-white rounded-lg border shadow-md hover:shadow-xl transition-shadow duration-300">
//         <div className="bg-rose-50 p-6 rounded-lg">
//           <h3 className="text-center font-semibold text-sm md:text-lg mb-3">
//             Enter Your Details &<br />
//             Download Free <span className="text-orange-500">Quotation</span>
//           </h3>

//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder="Full Name"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />
//             <input
//               type="tel"
//               placeholder="Mobile Number"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />
//             <input
//               type="email"
//               placeholder="Email ID"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />
//             <input
//               type="text"
//               placeholder="Enter Subject"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />
//             <textarea
//               placeholder="Address"
//               rows="2"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />

//             <div className="flex justify-center items-center w-full">
//               <button className="bg-orange-500 tracking-wide font-bold text-white px-4 py-2 rounded text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform">
//                 Download Quotation
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Expert Call Section */}
//       <div className="bg-white rounded-lg border p-4 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
//         <div className="rounded-full mx-auto mb-3 flex justify-center">
//           <img
//             src={callCenter}
//             alt="callCenter"
//             className="h-16 md:h-20 w-auto object-contain"
//           />
//         </div>
//         <h3 className="font-semibold text-sm md:text-lg mb-3">
//           Talk To Our Expert On <br /> Video Call...!
//         </h3>
//         <button
//           className="bg-orange-500 tracking-wide font-bold text-white px-4 py-2 rounded text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
//           onClick={() => {
//             navigate("/consult-guidance");
//             window.scrollTo({
//               top: 0,
//               behavior: "smooth",
//             });
//           }}
//         >
//           Book Consultation
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DetailsRightSection;

import React, { useState, forwardRef, useImperativeHandle } from "react";
import callCenter from "../../Assets/img/common/callCenter.png";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin } from "lucide-react";
import { MdSubject } from "react-icons/md";
import toast from "react-hot-toast";
import QuotationPDF from "../../utils/QuotationPDF";

const DetailsRightSection = forwardRef(({ product }, ref) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    mobNumber: "",
    email: "",
    address: "",
    subject: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const quoteFormRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    scrollIntoView: (options) => {
      quoteFormRef.current?.scrollIntoView(options);
    },
  }));

  const quotationPDF = new QuotationPDF();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      mobNumber: "",
      email: "",
      address: "",
      subject: "",
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.mobNumber ||
      !formData.email ||
      !formData.address ||
      !formData.subject
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!product?._id) {
      toast.error("Product information is missing");
      return;
    }

    try {
      setSubmitLoading(true);

      const quotationData = {
        fullName: formData.fullName,
        mobNumber: formData.mobNumber,
        email: formData.email,
        address: formData.address,
        subject: formData.subject,
        product: product._id,
      };

      console.log("Creating quotation with data:", quotationData);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/quotation/create-quotation/by-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quotationData),
        }
      );

      const responseData = await response.json();
      console.log("Quotation creation response:", responseData);

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Failed to create quotation");
      }

      toast.success("Quotation created successfully!");

      const quotationId = responseData?.data?._id;
      console.log("Fetching complete quotation data for ID:", quotationId);

      const quotationResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/quotation/get-quotation-by-id/${quotationId}`
      );

      const completeQuotationData = await quotationResponse.json();
      console.log("Complete quotation data received:", completeQuotationData);

      if (!quotationResponse.ok || !completeQuotationData.success) {
        throw new Error("Failed to fetch complete quotation data");
      }

      console.log("=== DEBUGGING QUOTATION DATA ===");
      console.log(
        "Full response:",
        JSON.stringify(completeQuotationData, null, 2)
      );
      console.log("Data object:", completeQuotationData.data);
      console.log("Product object:", completeQuotationData.data?.product);
      console.log("=== END DEBUGGING ===");

      console.log("Starting PDF generation...");
      toast.loading("Generating PDF...");

      const dataToPass = completeQuotationData.data;
      console.log("data to pass---------->>>>>>>>>>>>>>", dataToPass);

      if (!dataToPass) {
        throw new Error("No data found in quotation response");
      }

      if (!dataToPass.product) {
        console.warn("Warning: No product data found in quotation");
      }

      await quotationPDF.generatePDFWithJSPDF(dataToPass);

      toast.dismiss();
      toast.success("PDF downloaded successfully!");

      handleCancel();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.dismiss();
      toast.error(`Error: ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-4 lg:col-span-3">
      {/* Video Section */}
      <div className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="bg-gray-100 h-72 flex items-center justify-center relative">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/fnfkV_MaLr0?si=YaajTwkMA7Z0R68y"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="bg-gray-100 h-72 flex items-center justify-center relative">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/BbgQ98LdIeM?si=KH4cpZjo5K8uD6gC"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        </div>
      </div>

      {/* Quote Form */}
      <div
        className="bg-white rounded-lg border shadow-md hover:shadow-xl transition-shadow duration-300"
        ref={quoteFormRef}
      >
        <div className="bg-rose-50 p-6 rounded-lg">
          <h3 className="text-center font-semibold text-sm md:text-lg mb-3">
            Enter Your Details &<br />
            Download Free <span className="text-orange-500">Quotation</span>
          </h3>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="tel"
                name="mobNumber"
                placeholder="Mobile Number"
                value={formData.mobNumber}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="relative">
              <MdSubject className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="subject"
                placeholder="Enter Subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <textarea
                name="address"
                placeholder="Address"
                rows="2"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex justify-center items-center w-full">
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="bg-orange-500 tracking-wide font-bold text-white px-4 py-2 rounded text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitLoading ? "Processing..." : "Download Quotation"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Call Section */}
      <div className="bg-white rounded-lg border p-4 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="rounded-full mx-auto mb-3 flex justify-center">
          <img
            src={callCenter}
            alt="callCenter"
            className="h-16 md:h-20 w-auto object-contain"
          />
        </div>
        <h3 className="font-semibold text-sm md:text-lg mb-3">
          Talk To Our Expert On <br /> Video Call...!
        </h3>
        <button
          className="bg-orange-500 tracking-wide font-bold text-white px-4 py-2 rounded text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
          onClick={() => {
            navigate("/consult-guidance");
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          Book Consultation
        </button>
      </div>
    </div>
  );
});
DetailsRightSection.displayName = "DetailsRightSection";

export default DetailsRightSection;
