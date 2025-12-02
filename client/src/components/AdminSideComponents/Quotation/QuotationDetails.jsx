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
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Quotation
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchQuotationData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
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
          <h2 className="text-xl font-semibold text-gray-800">
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
    city,
    state,
    subject,
    createdAt,
    products = [],
  } = quotationData;

  // Get the first product from the products array
  const product = products?.[0]?.product;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            No product data found
          </h2>
        </div>
      </div>
    );
  }

  const pricing = calculatePricing(product);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-blue-600">
              Quotation Details
            </h1>
            <div className="text-sm text-gray-600 flex items-center">
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
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-800 font-medium">{subject}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-gray-800 font-medium">{fullName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Mobile Number</p>
                    <p className="text-gray-800 font-medium">{mobNumber}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-800 font-medium">{email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">city and state</p>
                    <p className="text-gray-800 font-medium">
                      {city}, {state}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Information */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <IndianRupee className="w-5 h-5 mr-2" />
                Price Breakdown
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="text-gray-800 font-medium">
                    ₹{pricing.basePrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    GST ({pricing.gstPercentage}%):
                  </span>
                  <span className="text-gray-800 font-medium">
                    ₹{pricing.gstAmount.toLocaleString()}
                  </span>
                </div>

                {pricing.extraTaxPercentage > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Extra Tax ({pricing.extraTaxPercentage}%):
                    </span>
                    <span className="text-gray-800 font-medium">
                      ₹{pricing.extraTaxAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600 font-semibold">
                    Price Including All Taxes:
                  </span>
                  <span className="text-gray-800 font-bold">
                    ₹{pricing.priceWithTaxes.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping Charge:</span>
                  <span className="text-gray-800 font-medium">
                    ₹{pricing.shippingCharge.toLocaleString()}
                  </span>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-bold text-lg">
                      Total Price:
                    </span>
                    <span className="text-orange-600 font-bold text-2xl">
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
              <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
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
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {product?.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-600 mr-2">
                      Product ID:
                    </span>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium">
                      {product?.pm_id}
                    </span>
                  </div>
                  <div className="flex items-center mb-4">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-800">
                      {product?.ratings}/5
                    </span>
                    <span className="text-sm text-gray-600 ml-2">Rating</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{product?.price?.toLocaleString()}
                      </span>
                      {product?.previous_price && (
                        <span className="text-lg text-gray-600 line-through ml-2">
                          ₹{product?.previous_price?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {product?.description}
                </p>
              </div>

              {/* Product Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Specifications
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="text-gray-800 font-medium">
                        {product?.brand}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Material:</span>
                      <span className="text-gray-800 font-medium">
                        {product?.material}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Type:</span>
                      <span className="text-gray-800 font-medium">
                        {product?.productType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Control System:</span>
                      <span className="text-gray-800 font-medium">
                        {product?.controlSystem}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Automatic Grade:</span>
                      <span className="text-gray-800 font-medium">
                        {product?.automaticGrade}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Energy Consumption:</span>
                      <span className="text-gray-800 font-medium">
                        {product?.energyConsumption}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Trade Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-gray-600">Payment:</span>
                      <span className="text-gray-800 font-medium ml-auto">
                        {product?.tradeInfo?.paymentTerms}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-gray-600">Delivery:</span>
                      <span className="text-gray-800 font-medium ml-auto">
                        {product?.tradeInfo?.deliveryTime}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Factory className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-gray-600">Supply:</span>
                      <span className="text-gray-800 font-medium ml-auto">
                        {product?.tradeInfo?.supplyAbility}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-gray-600">Market:</span>
                      <span className="text-gray-800 font-medium ml-auto">
                        {product?.tradeInfo?.mainDomesticMarket}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              {product?.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Features
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {product.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
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
                  <Shield className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Warranty</p>
                    <p className="text-gray-800 font-medium">
                      {product?.warranty?.hasWarranty
                        ? product?.warranty?.warrantyDays
                        : "No Warranty"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Return Policy</p>
                    <p className="text-gray-800 font-medium">
                      {product?.return_policy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Shipping</p>
                    <p className="text-gray-800 font-medium">
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
