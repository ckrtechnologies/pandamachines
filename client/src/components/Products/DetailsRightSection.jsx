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
      {/* <div
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
      </div> */}

      {/* Quote Form */}
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
        ref={quoteFormRef}
      >
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-primaryColor to-primaryColor/90 p-6 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accentColor/20 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg md:text-xl mb-2">
                Get Your Free Quotation
              </h3>
              <p className="text-white/90 text-sm">
                Enter your details below and download your personalized quote
                instantly
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
            </div>

            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
              <input
                type="tel"
                name="mobNumber"
                placeholder="Mobile Number"
                value={formData.mobNumber}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
            </div>

            <div className="relative group">
              <MdSubject className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
              <input
                type="text"
                name="subject"
                placeholder="Enter Subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
            </div>

            <div className="relative group">
              <MapPin className="absolute left-4 top-4 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
              <textarea
                name="address"
                placeholder="Enter your complete address"
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm resize-none bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="w-full bg-gradient-to-r from-primaryBtnColor to-primaryColor text-white font-bold py-4 px-6 rounded-lg text-sm shadow-lg hover:from-primaryBtnHoverColor hover:to-primaryBtnColor hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg relative overflow-hidden group"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                <div className="relative flex items-center justify-center space-x-2">
                  {submitLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Download Quotation</span>
                    </>
                  )}
                </div>
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
          className="bg-gradient-to-r from-primaryBtnColor to-primaryColor text-white font-bold py-4 px-6 rounded-lg text-sm shadow-lg 
hover:from-primaryBtnHoverColor hover:to-primaryColor tracking-wide hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
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
