import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Star,
  Shield,
  Truck,
  CreditCard,
  Clock,
  Factory,
  IndianRupee,
} from "lucide-react";

const QuotationDetails = () => {
  const [quotationData, setQuotationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchQuotationData = async () => {
    try {
      setLoading(true);
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_URL}/quotation/get-quotation-by-id/${id}`,
        headers: {},
      };

      const response = await axios.request(config);
      console.log("API Response:", JSON.stringify(response.data));
      setQuotationData(response?.data?.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching quotation:", error);
      setError("Failed to fetch quotation details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuotationData();
    }
  }, [id]);

  // Price calculation function
  const calculatePricing = (product) => {
    const basePrice = product?.price || 0;
    const gstPercentage = product?.gstPercentage || 0;
    const extraTaxPercentage = product?.extraTaxPercentage || 0;
    const shippingCharge = product?.shippingCharge || 0;

    const gstAmount = (basePrice * gstPercentage) / 100;
    const extraTaxAmount = (basePrice * extraTaxPercentage) / 100;
    const priceWithTaxes = basePrice + gstAmount + extraTaxAmount;
    const totalPrice = priceWithTaxes + shippingCharge;

    return {
      basePrice,
      gstAmount,
      extraTaxAmount,
      priceWithTaxes,
      shippingCharge,
      totalPrice,
      gstPercentage,
      extraTaxPercentage,
    };
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-skeletonLoaderColor rounded w-1/3"></div>
            <div className="h-4 bg-skeletonLoaderColor rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-skeletonLoaderColor rounded"></div>
              <div className="h-32 bg-skeletonLoaderColor rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error component
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-primaryTextColor mb-2">
            Error Loading Quotation
          </h2>
          <p className="text-secondaryTextColor mb-4">{error}</p>
          <button
            onClick={fetchQuotationData}
            className="bg-primaryBtnColor hover:bg-primaryBtnHoverColor text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!quotationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-primaryTextColor">
            No quotation data found
          </h2>
        </div>
      </div>
    );
  }

  const {
    fullName,
    mobNumber,
    email,
    address,
    subject,
    category,
    subCategory,
    subSubCategory,
    product,
    createdAt,
  } = quotationData;

  const pricing = calculatePricing(product);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-primaryColor">
              Quotation Details
            </h1>
            <div className="text-sm text-secondaryTextColor flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div className="bg-primaryFadedColor bg-opacity-20 p-4 rounded-lg">
            <p className="text-primaryTextColor font-medium">{subject}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-primaryColor mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-secondaryTextColor mr-3" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">Full Name</p>
                    <p className="text-primaryTextColor font-medium">
                      {fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-secondaryTextColor mr-3" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">
                      Mobile Number
                    </p>
                    <p className="text-primaryTextColor font-medium">
                      {mobNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-secondaryTextColor mr-3" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">Email</p>
                    <p className="text-primaryTextColor font-medium">{email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-secondaryTextColor mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">Address</p>
                    <p className="text-primaryTextColor font-medium">
                      {address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Information */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-primaryColor mb-4 flex items-center">
                <IndianRupee className="w-5 h-5 mr-2" />
                Price Breakdown
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-secondaryTextColor">Base Price:</span>
                  <span className="text-primaryTextColor font-medium">
                    ₹{pricing.basePrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-secondaryTextColor">
                    GST ({pricing.gstPercentage}%):
                  </span>
                  <span className="text-primaryTextColor font-medium">
                    ₹{pricing.gstAmount.toLocaleString()}
                  </span>
                </div>

                {pricing.extraTaxPercentage > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-secondaryTextColor">
                      Extra Tax ({pricing.extraTaxPercentage}%):
                    </span>
                    <span className="text-primaryTextColor font-medium">
                      ₹{pricing.extraTaxAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-secondaryTextColor font-semibold">
                    Price Including All Taxes:
                  </span>
                  <span className="text-primaryTextColor font-bold">
                    ₹{pricing.priceWithTaxes.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-secondaryTextColor">
                    Shipping Charge:
                  </span>
                  <span className="text-primaryTextColor font-medium">
                    ₹{pricing.shippingCharge.toLocaleString()}
                  </span>
                </div>

                <div className="bg-accentColor bg-opacity-10 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-accentColor font-bold text-lg">
                      Total Price:
                    </span>
                    <span className="text-accentColor font-bold text-2xl">
                      ₹{pricing.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-primaryColor mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Product Information
              </h2>

              {/* Product Header */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3">
                  {product?.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  )}
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-primaryTextColor mb-2">
                    {product?.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-secondaryTextColor mr-2">
                      Product ID:
                    </span>
                    <span className="bg-primaryFadedColor bg-opacity-30 text-primaryColor px-2 py-1 rounded text-sm font-medium">
                      {product?.pm_id}
                    </span>
                  </div>
                  <div className="flex items-center mb-4">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-primaryTextColor">
                      {product?.ratings}/5
                    </span>
                    <span className="text-sm text-secondaryTextColor ml-2">
                      Rating
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-2xl font-bold text-accentColor">
                        ₹{product?.price?.toLocaleString()}
                      </span>
                      {product?.previous_price && (
                        <span className="text-lg text-secondaryTextColor line-through ml-2">
                          ₹{product?.previous_price?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-primaryTextColor mb-2">
                  Description
                </h4>
                <p className="text-secondaryTextColor leading-relaxed">
                  {product?.description}
                </p>
              </div>

              {/* Product Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-primaryTextColor mb-3">
                    Specifications
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-secondaryTextColor">Brand:</span>
                      <span className="text-primaryTextColor font-medium">
                        {product?.brand}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondaryTextColor">Material:</span>
                      <span className="text-primaryTextColor font-medium">
                        {product?.material}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondaryTextColor">
                        Product Type:
                      </span>
                      <span className="text-primaryTextColor font-medium">
                        {product?.productType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondaryTextColor">
                        Control System:
                      </span>
                      <span className="text-primaryTextColor font-medium">
                        {product?.controlSystem}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondaryTextColor">
                        Automatic Grade:
                      </span>
                      <span className="text-primaryTextColor font-medium">
                        {product?.automaticGrade}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondaryTextColor">
                        Energy Consumption:
                      </span>
                      <span className="text-primaryTextColor font-medium">
                        {product?.energyConsumption}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primaryTextColor mb-3">
                    Trade Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 text-secondaryTextColor mr-2" />
                      <span className="text-secondaryTextColor">Payment:</span>
                      <span className="text-primaryTextColor font-medium ml-auto">
                        {product?.tradeInfo?.paymentTerms}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-secondaryTextColor mr-2" />
                      <span className="text-secondaryTextColor">Delivery:</span>
                      <span className="text-primaryTextColor font-medium ml-auto">
                        {product?.tradeInfo?.deliveryTime}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Factory className="w-4 h-4 text-secondaryTextColor mr-2" />
                      <span className="text-secondaryTextColor">Supply:</span>
                      <span className="text-primaryTextColor font-medium ml-auto">
                        {product?.tradeInfo?.supplyAbility}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-secondaryTextColor mr-2" />
                      <span className="text-secondaryTextColor">Market:</span>
                      <span className="text-primaryTextColor font-medium ml-auto">
                        {product?.tradeInfo?.mainDomesticMarket}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              {product?.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-primaryTextColor mb-3">
                    Features
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {product.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-primaryFadedColor bg-opacity-20 text-primaryColor px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty & Policies */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-accentColor mr-2" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">Warranty</p>
                    <p className="text-primaryTextColor font-medium">
                      {product?.warranty?.hasWarranty
                        ? product?.warranty?.warrantyDays
                        : "No Warranty"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-accentColor mr-2" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">
                      Return Policy
                    </p>
                    <p className="text-primaryTextColor font-medium">
                      {product?.return_policy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-accentColor mr-2" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">Shipping</p>
                    <p className="text-primaryTextColor font-medium">
                      ₹{product?.shippingCharge}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetails;
