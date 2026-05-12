import {
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  X
} from "lucide-react";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import callCenter from "../../Assets/img/common/callCenter.png";
import QuotationPDF from "../../utils/QuotationPDF";
import { useJsApiLoader } from "@react-google-maps/api";
import { MdMyLocation } from "react-icons/md";

const DetailsRightSection = forwardRef(
  ({ product, quantity, onQuantityChange }, ref) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      fullName: "",
      mobNumber: "",
      email: "",
      city: "",
      state: "",
      pincode: "",
      coordinates: {
        lat: null,
        lng: null,
      },
      subject: "",
      referral: "",
    });
    const [isLocating, setIsLocating] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [highlightForm, setHighlightForm] = useState(false);
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

    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
      libraries: ["places"],
    });
    const getPart = (components, types) => {
      const tset = Array.isArray(types) ? types : [types];

      const comp = components.find((c) =>
        tset.every((t) => c.types.includes(t)),
      );

      return comp?.long_name || "";
    };

    const parseAddressComponents = (components) => {
      const city =
        getPart(components, "locality") ||
        getPart(components, "administrative_area_level_2");

      const state = getPart(
        components,
        "administrative_area_level_1",
      );

      const pincode = getPart(components, "postal_code");

      return {
        city,
        state,
        pincode,
      };
    };
    const quoteFormRef = React.useRef(null);

    useImperativeHandle(ref, () => ({
      scrollToForm: () => {
        quoteFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        setHighlightForm(true);

        setTimeout(() => {
          setHighlightForm(false);
        }, 1600);
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

    const handleUseCurrentLocation = () => {
      if (!navigator.geolocation) {
        toast.error("Geolocation not supported");
        return;
      }

      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode(
            {
              location: { lat, lng },
            },
            (results, status) => {
              setIsLocating(false);

              if (status !== "OK" || !results[0]) {
                toast.error("Unable to fetch address");
                return;
              }

              const parsed = parseAddressComponents(
                results[0].address_components,
              );

              setFormData((prev) => ({
                ...prev,
                city: parsed.city,
                state: parsed.state,
                pincode: parsed.pincode,
                coordinates: {
                  lat,
                  lng,
                },
              }));

              toast.success("Location fetched successfully");
            },
          );
        },
        () => {
          setIsLocating(false);
          toast.error("Location permission denied");
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    };
    const handleSubmit = async () => {
      if (!formData.fullName || !formData.mobNumber) {
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
          referral: formData.referral || undefined,
          product: product._id,
          quantity: quantity || 1,
          category: product.category || undefined,
          subCategory: product.subCategory || undefined,
          subSubCategory: product.subSubCategory || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          coordinates: formData.coordinates,
          pincode: formData.pincode || undefined,
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
      <div className=" flex flex-col gap-4 lg:col-span-3">
        {showPreview && previewData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full  my-auto max-h-[75vh] lg:max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-primaryColor to-primaryColor/90 p-4 md:p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                    PDF Preview
                  </h2>
                  <p className="text-white/80 text-xs md:text-sm">
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

              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid md:grid-cols-2 gap-3 md:gap-6">
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
                          {
                            previewData.subject &&
                            <p>
                              <span className="font-semibold">Subject:</span>{" "}
                              {previewData.subject || "N/A"}
                            </p>
                          }
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

              <div className="border-t bg-gray-50 text-xs md:text-sm lg:text-base p-4 md:p-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 md:px-6 py-1.5 md:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 md:px-6 py-1.5 md:py-3 bg-gradient-to-r from-primaryBtnColor to-primaryColor text-white rounded-lg font-semibold hover:from-primaryBtnHoverColor hover:to-primaryBtnColor hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}



        <div
          ref={quoteFormRef}
          className={`
    bg-white rounded-md border overflow-hidden scroll-mt-10
    transition-all duration-500

    ${highlightForm
              ? "border-primaryColor shadow-[0_0_0_4px_rgba(59,130,246,0.15)] animate-pulse"
              : "border-gray-200 shadow-xs hover:shadow-sm"
            }
  `}
        >
          <div className="bg-gradient-to-r from-primaryColor to-primaryColor/90 px-4 py-4 sm:px-5 sm:py-5 relative overflow-hidden min-h-[110px] flex items-center">

            {/* Background Shapes */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>

            <div className="absolute bottom-0 left-0 w-20 h-20 bg-accentColor/20 rounded-full translate-y-10 -translate-x-10"></div>

            <div className="relative z-10 w-full">
              <div className="flex items-center gap-4">

                {/* Icon */}
                <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl border border-white/10">
                  <FileText className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-base sm:text-lg leading-tight">
                    Get Your Free Consultation
                  </h3>

                  <p className="text-white/80 text-xs sm:text-sm mt-1 leading-relaxed">
                    Fill your details and receive expert assistance instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="space-y-2 sm:space-y-4">
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
                  maxLength={10}
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
                  placeholder="Email ID "
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
                  className="w-full pl-12 pr-14 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
                />

                {/* Locate Me Button */}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={!isLoaded || isLocating}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full hover:bg-primaryColor/10 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLocating ? (
                    <div className="w-4 h-4 border-2 border-primaryColor/30 border-t-primaryColor rounded-full animate-spin" />
                  ) : (
                    <MdMyLocation className="w-5 h-5 text-primaryColor" />
                  )}
                </button>

                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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

                {/* Pincode */}
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondaryTextColor group-focus-within:text-primaryColor transition-colors duration-200" />

                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 transition-all duration-200 hover:border-gray-300"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primaryColor to-accentColor transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>

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
        <div className="bg-white rounded-md border p-4 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
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
