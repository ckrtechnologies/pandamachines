import React, { useState, forwardRef, useImperativeHandle } from "react";
import callCenter from "../../Assets/img/common/callCenter.png";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Package,
  Eye,
  Download,
  X,
} from "lucide-react";
import { MdSubject } from "react-icons/md";
import toast from "react-hot-toast";
import QuotationPDF from "../../utils/QuotationPDF";
import VideoPlayer from "./VideoPlayer";
import { FiChevronDown } from "react-icons/fi";

const DetailsRightSection = forwardRef(
  ({ product, quantity, onQuantityChange }, ref) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      fullName: "",
      mobNumber: "",
      email: "",
      city: "",
      state: "",
      subject: "",
      referral: "",
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [pdfSections, setPdfSections] = useState({
      customerInfo: true,
      productInfo: true,
      pricing: true,
      brandInfo: true,
      categoryInfo: true,
      materialInfo: true,
      measurementInfo: true,
      warrantyInfo: true,
    });

    const quoteFormRef = React.useRef(null);

    useImperativeHandle(ref, () => ({
      scrollIntoView: (options) => {
        quoteFormRef.current?.scrollIntoView(options);
      },
    }));

    const quotationPDF = new QuotationPDF();

    const extractYoutubeId = (url) => {
      if (!url) return "fnfkV_MaLr0";
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : "fnfkV_MaLr0";
    };

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleQuantityChange = (e) => {
      const value = parseInt(e.target.value) || 1;
      if (onQuantityChange) {
        onQuantityChange(value);
      }
    };

    const handleCancel = () => {
      setFormData({
        fullName: "",
        mobNumber: "",
        email: "",
        city: "",
        state: "",
        subject: "",
        referral: "",
      });
    };

    const handleSectionToggle = (section) => {
      setPdfSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    };

    const handleSubmit = async () => {
      if (!formData.fullName || !formData.mobNumber || !formData.email) {
        toast.error("Please fill in all required fields");
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
          city: formData.city || undefined,
          state: formData.state || undefined,
          subject: formData.subject,
          referral: formData.referral || undefined,
          product: product._id,
          quantity: quantity || 1,
          category: product.category || undefined,
          subCategory: product.subCategory || undefined,
          subSubCategory: product.subSubCategory || undefined,
        };

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/quotation/create-quotation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(quotationData),
          },
        );

        const responseData = await response.json();

        if (!response.ok || !responseData.success) {
          throw new Error(responseData.message || "Failed to create quotation");
        }

        toast.success("Quotation created successfully!");

        const quotationId = responseData?.data?._id;

        const quotationResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/quotation/get-quotation-by-id/${quotationId}`,
        );

        const completeQuotationData = await quotationResponse.json();

        if (!quotationResponse.ok || !completeQuotationData.success) {
          throw new Error("Failed to fetch complete quotation data");
        }

        const dataToPass = completeQuotationData.data;

        if (!dataToPass) {
          throw new Error("No data found in quotation response");
        }

        setPreviewData(dataToPass);
        setShowPreview(true);
      } catch (error) {
        console.error("Error in handleSubmit:", error);
        toast.error(`Error: ${error.message}`);
      } finally {
        setSubmitLoading(false);
      }
    };

    const handleDownloadPDF = async () => {
      try {
        toast.loading("Generating PDF...");
        await quotationPDF.generatePDFWithJSPDF(previewData, pdfSections);
        toast.dismiss();
        toast.success("PDF downloaded successfully!");
        setShowPreview(false);
        handleCancel();
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast.dismiss();
        toast.error(`Error: ${error.message}`);
      }
    };

    const formatCurrency = (amount) => {
      if (!amount && amount !== 0) return "INR 0.00";
      return `INR ${parseFloat(amount).toFixed(2)}`;
    };

    const calculatePricing = (product) => {
      const basePrice = parseFloat(product?.price || 0);
      const gstPercentage = parseFloat(product?.gstPercentage || 18);
      const extraTaxPercentage = parseFloat(product?.extraTaxPercentage || 0);
      const shippingCharge = parseFloat(product?.shippingCharge || 0);

      const gstAmount = (basePrice * gstPercentage) / 100;
      const extraTaxAmount = (basePrice * extraTaxPercentage) / 100;
      const priceWithTaxes = basePrice + gstAmount + extraTaxAmount;
      const totalAmount = priceWithTaxes + shippingCharge;

      return {
        basePrice,
        gstAmount,
        extraTaxAmount,
        shippingCharge,
        priceWithTaxes,
        totalAmount,
        gstPercentage,
        extraTaxPercentage,
        shippingType: product?.shippingType || "free",
      };
    };

    return (
      <div className="space-y-4 lg:col-span-3">
        {showPreview && previewData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-primaryColor to-primaryColor/90 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    PDF Preview
                  </h2>
                  <p className="text-white/80 text-sm">
                    Review and customize your quotation
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-primaryColor mb-4">
                      Document Preview
                    </h3>

                    {pdfSections.customerInfo && (
                      <div className="bg-gray-50 rounded-lg p-4 border-2 border-primaryColor/20">
                        <h4 className="font-semibold text-primaryColor mb-3">
                          Customer Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-semibold">Name:</span>{" "}
                            {previewData.fullName}
                          </p>
                          <p>
                            <span className="font-semibold">Phone:</span>{" "}
                            {previewData.mobNumber}
                          </p>
                          <p>
                            <span className="font-semibold">Email:</span>{" "}
                            {previewData.email}
                          </p>
                          <p>
                            <span className="font-semibold">City:</span>{" "}
                            {previewData.city || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">State:</span>{" "}
                            {previewData.state || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">Subject:</span>{" "}
                            {previewData.subject || "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
                    {pdfSections.productInfo && (
                      <div className="bg-gray-50 rounded-lg p-4 border-2 border-primaryColor/20">
                        <h4 className="font-semibold text-primaryColor mb-3">
                          Product Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-semibold">Product:</span>{" "}
                            {previewData.product?.name || "N/A"}
                          </p>
                          {pdfSections.brandInfo && (
                            <p>
                              <span className="font-semibold">Brand:</span>{" "}
                              {previewData.product?.brand || "N/A"}
                            </p>
                          )}
                          {pdfSections.categoryInfo && (
                            <>
                              <p>
                                <span className="font-semibold">Category:</span>{" "}
                                {previewData.category?.name || "N/A"}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Sub-Category:
                                </span>{" "}
                                {previewData.subCategory?.name || "N/A"}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Tier-3-Category:
                                </span>{" "}
                                {previewData.subSubCategory?.name || "N/A"}
                              </p>
                            </>
                          )}
                          {pdfSections.materialInfo && (
                            <p>
                              <span className="font-semibold">Material:</span>{" "}
                              {previewData.product?.material || "N/A"}
                            </p>
                          )}
                          {pdfSections.measurementInfo && (
                            <p>
                              <span className="font-semibold">
                                Measurement:
                              </span>{" "}
                              {previewData.product?.measurement || "N/A"}
                            </p>
                          )}
                          {pdfSections.warrantyInfo && (
                            <p>
                              <span className="font-semibold">Warranty:</span>{" "}
                              {previewData.product?.warranty?.warrantyDays ||
                                "N/A"}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {pdfSections.pricing && (
                      <div className="bg-gray-50 rounded-lg p-4 border-2 border-accentColor/20">
                        <h4 className="font-semibold text-primaryColor mb-3">
                          Pricing Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          {(() => {
                            const pricing = calculatePricing(
                              previewData.product,
                            );
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span>Base Price:</span>
                                  <span className="font-semibold">
                                    {formatCurrency(pricing.basePrice)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>GST ({pricing.gstPercentage}%):</span>
                                  <span className="font-semibold">
                                    {formatCurrency(pricing.gstAmount)}
                                  </span>
                                </div>
                                {pricing.extraTaxPercentage > 0 && (
                                  <div className="flex justify-between">
                                    <span>
                                      Extra Tax ({pricing.extraTaxPercentage}%):
                                    </span>
                                    <span className="font-semibold">
                                      {formatCurrency(pricing.extraTaxAmount)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Shipping:</span>
                                  <span className="font-semibold">
                                    {pricing.shippingType === "free"
                                      ? "Free Shipping"
                                      : pricing.shippingType === "extra"
                                        ? formatCurrency(pricing.shippingCharge)
                                        : "As per Actual"}
                                  </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t-2 border-accentColor">
                                  <span className="font-bold">
                                    Total Amount:
                                  </span>
                                  <span className="font-bold text-accentColor">
                                    {formatCurrency(pricing.totalAmount)}
                                  </span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-primaryColor mb-4">
                      Customize PDF Content
                    </h3>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <label className="flex items-start space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={pdfSections.customerInfo}
                          onChange={() => handleSectionToggle("customerInfo")}
                          className="mt-1 w-5 h-5 text-primaryColor rounded focus:ring-primaryColor"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-700 group-hover:text-primaryColor transition-colors">
                            Customer Information
                          </span>
                          <p className="text-xs text-gray-500">
                            Include customer name, contact details, city and
                            state
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={pdfSections.productInfo}
                          onChange={() => handleSectionToggle("productInfo")}
                          className="mt-1 w-5 h-5 text-primaryColor rounded focus:ring-primaryColor"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-700 group-hover:text-primaryColor transition-colors">
                            Product Information
                          </span>
                          <p className="text-xs text-gray-500">
                            Include product name and basic details
                          </p>
                        </div>
                      </label>

                      <div className="ml-8 space-y-2 border-l-2 border-gray-300 pl-4">
                        <label className="flex items-center space-x-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={pdfSections.brandInfo}
                            onChange={() => handleSectionToggle("brandInfo")}
                            disabled={!pdfSections.productInfo}
                            className="w-4 h-4 text-primaryColor rounded focus:ring-primaryColor disabled:opacity-50"
                          />
                          <span
                            className={
                              !pdfSections.productInfo
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          >
                            Brand Information
                          </span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={pdfSections.categoryInfo}
                            onChange={() => handleSectionToggle("categoryInfo")}
                            disabled={!pdfSections.productInfo}
                            className="w-4 h-4 text-primaryColor rounded focus:ring-primaryColor disabled:opacity-50"
                          />
                          <span
                            className={
                              !pdfSections.productInfo
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          >
                            Category Details
                          </span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={pdfSections.materialInfo}
                            onChange={() => handleSectionToggle("materialInfo")}
                            disabled={!pdfSections.productInfo}
                            className="w-4 h-4 text-primaryColor rounded focus:ring-primaryColor disabled:opacity-50"
                          />
                          <span
                            className={
                              !pdfSections.productInfo
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          >
                            Material Information
                          </span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={pdfSections.measurementInfo}
                            onChange={() =>
                              handleSectionToggle("measurementInfo")
                            }
                            disabled={!pdfSections.productInfo}
                            className="w-4 h-4 text-primaryColor rounded focus:ring-primaryColor disabled:opacity-50"
                          />
                          <span
                            className={
                              !pdfSections.productInfo
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          >
                            Measurement Details
                          </span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={pdfSections.warrantyInfo}
                            onChange={() => handleSectionToggle("warrantyInfo")}
                            disabled={!pdfSections.productInfo}
                            className="w-4 h-4 text-primaryColor rounded focus:ring-primaryColor disabled:opacity-50"
                          />
                          <span
                            className={
                              !pdfSections.productInfo
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          >
                            Warranty Information
                          </span>
                        </label>
                      </div>

                      <label className="flex items-start space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={pdfSections.pricing}
                          onChange={() => handleSectionToggle("pricing")}
                          className="mt-1 w-5 h-5 text-primaryColor rounded focus:ring-primaryColor"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-700 group-hover:text-primaryColor transition-colors">
                            Pricing Details
                          </span>
                          <p className="text-xs text-gray-500">
                            Include pricing breakdown and total amount
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Tip:</span> Uncheck any
                        section you don't want to include in your PDF.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t bg-gray-50 p-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-6 py-3 bg-gradient-to-r from-primaryBtnColor to-primaryColor text-white rounded-lg font-semibold hover:from-primaryBtnHoverColor hover:to-primaryBtnColor hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg shadow-xs border hover:shadow-sm transition-shadow duration-300 overflow-hidden flex flex-col gap-4 bg-gray-100">
          <VideoPlayer
            videoUrl={product?.production_video}
            videoTitle="Production video"
          />
          <VideoPlayer videoUrl={product?.demo_video} videoTitle="Demo video" />
        </div>

        <div
          className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-500 overflow-hidden scroll-mt-10"
          ref={quoteFormRef}
        >
          <div className="bg-gradient-to-r from-primaryColor to-primaryColor/90 p-6 relative overflow-hidden">
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
              {/* Full Name */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
                />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* Mobile Number */}
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
                <input
                  type="tel"
                  name="mobNumber"
                  placeholder="Mobile Number *"
                  value={formData.mobNumber}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
                />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* Email */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID *"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
                />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* City */}
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
                />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* State */}
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
                />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* Subject */}
              <div className="relative group">
                <MdSubject className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200 z-10" />
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-8 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300 appearance-none cursor-pointer"
                >
                  <option value="">Quotation For</option>
                  <option value="Plant">Plant</option>
                  <option value="Machinery">Machinery</option>
                  <option value="Spare parts / Raw Material">
                    Spare parts / Raw Material
                  </option>
                  <option value="All of the above">All of the above</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* Referral Name */}
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
                <input
                  type="text"
                  name="referral"
                  placeholder="Referral Name"
                  value={formData.referral}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
                />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* Quantity Input - Hidden */}
              <div className="relative group hidden">
                <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity *"
                  min="1"
                  value={quantity || 1}
                  onChange={handleQuantityChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
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
                        <Eye className="w-5 h-5" />
                        <span>Preview Quotation</span>
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
  },
);
DetailsRightSection.displayName = "DetailsRightSection";

export default DetailsRightSection;
