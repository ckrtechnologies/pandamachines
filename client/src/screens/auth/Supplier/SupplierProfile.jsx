import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsExclamationCircle } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { SlCalender } from "react-icons/sl";
import { FaBuilding, FaIdCard, FaMapMarkerAlt } from "react-icons/fa";
import { MdBusiness } from "react-icons/md";

const SupplierProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [supplierProfile, setSupplierProfile] = useState(null);
  const [error, setError] = useState("");

  const getSupplierId = () => {
    const storedId = localStorage.getItem("pm-supplier-data");
    return storedId ? JSON.parse(storedId) : null;
  };

  useEffect(() => {
    const supplierId = getSupplierId();

    if (supplierId) {
      fetchData(supplierId);
    } else {
      setError("Supplier ID not found");
      setIsLoading(false);
    }
  }, []);

  const fetchData = async (supplierId) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/supplier/suppliers-by-id/${supplierId._id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSupplierProfile(data);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response) {
        setError(
          `API Error: ${error.response.status} - ${
            error.response.data?.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        setError("No response from server. Check your network connection.");
      } else {
        setError(`Request failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    const supplierId = getSupplierId();
    if (supplierId) {
      navigate(`/edit-supplier/${supplierId._id}`);
    }
  };

  const onlyDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-4">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-300" />
            <div>
              <div className="h-4 w-40 bg-gray-300 rounded mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
              <div className="mt-1 h-5 w-16 bg-orange-200 rounded-full" />
            </div>
          </div>
          <div className="h-10 w-28 bg-orange-300 rounded-md" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="h-4 w-24 bg-gray-300 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 bg-orange-100 rounded-xl shadow space-y-2"
            >
              <div className="h-4 w-20 bg-orange-300 rounded" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full text-center border border-red-100">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <BsExclamationCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-red-700 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!supplierProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full text-center border border-gray-100">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <BsExclamationCircle className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">
            No Profile Data
          </h3>
          <p className="text-gray-600 text-sm">
            Check the browser console for API response details.
          </p>
        </div>
      </div>
    );
  }

  const supplier = supplierProfile.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 md:p-6">
      <div className="w-full mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-orange-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <img
                src={supplier?.shopImage || "/default-avatar.png"}
                alt="Supplier Shop"
                className="w-20 h-20 rounded-full object-cover border-2 border-orange-300 shadow-sm"
              />
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  {supplier?.fullName}
                </h1>
                <p className="text-gray-500 text-sm">{supplier?.emailId}</p>
                <div className="flex gap-2">
                  <div className="inline-flex items-center px-2 py-1 rounded-md bg-orange-100 text-orange-700 font-medium text-xs">
                    {supplier?.userType}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-1">
                <FaRegEdit className="w-4 h-4" />
                Edit Profile
              </div>
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-orange-100 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primaryTextColor mb-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-300 to-orange-600 rounded-md flex items-center justify-center">
                <IoInformationCircleOutline className="w-4 h-4 text-white" />
              </div>
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <MdOutlineAlternateEmail className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Email</h3>
              </div>
              <p className="text-gray-600 text-sm">{supplier?.emailId}</p>
            </div>

            {/* Phone */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <LuPhone className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Mobile Number
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{supplier?.mobNo}</p>
            </div>

            {/* Gender */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <CgProfile className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Gender</h3>
              </div>
              <p className="text-gray-600 text-sm capitalize">
                {supplier?.gender}
              </p>
            </div>

            {/* Registration Date */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <SlCalender className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Registration Date
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {onlyDate(supplier?.registrationDate)}
              </p>
            </div>

            {/* Address */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Address</h3>
              </div>
              <p className="text-gray-600 text-sm">{supplier?.address}</p>
            </div>
          </div>
        </div>

        {/* Business Information Section */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-orange-100 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primaryTextColor mb-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-300 to-orange-600 rounded-md flex items-center justify-center">
                <MdBusiness className="w-4 h-4 text-white" />
              </div>
              Business Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Name */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <FaBuilding className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Business Name
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{supplier?.businessName}</p>
            </div>

            {/* Business Type */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <MdBusiness className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Business Type
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{supplier?.businessType}</p>
            </div>

            {/* Registration Name */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <FaIdCard className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Registration Name
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {supplier?.businessRegistrationName}
              </p>
            </div>

            {/* PAN Number */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <FaIdCard className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  PAN Number
                </h3>
              </div>
              <p className="text-gray-600 text-sm font-mono">
                {supplier?.panNo}
              </p>
            </div>

            {/* GST Number */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <FaIdCard className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  GST Number
                </h3>
              </div>
              <p className="text-gray-600 text-sm font-mono">
                {supplier?.gstIn}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-orange-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primaryTextColor mb-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-300 to-orange-600 rounded-md flex items-center justify-center">
                <FaIdCard className="w-4 h-4 text-white" />
              </div>
              Documents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* PAN Image */}
            {supplier?.panImage && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                    <FaIdCard className="text-white text-xs" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    PAN Document
                  </h3>
                </div>
                <div className="relative group cursor-pointer">
                  <img
                    src={supplier.panImage}
                    alt="PAN Document"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                    onClick={() => window.open(supplier.panImage, "_blank")}
                  />
                </div>
              </div>
            )}

            {/* Address Proof */}
            {supplier?.addressProof && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                    <FaMapMarkerAlt className="text-white text-xs" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Address Proof
                  </h3>
                </div>
                <div className="relative group cursor-pointer">
                  <img
                    src={supplier.addressProof}
                    alt="Address Proof"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                    onClick={() => window.open(supplier.addressProof, "_blank")}
                  />
                </div>
              </div>
            )}

            {/* Owner ID Proof */}
            {supplier?.ownerIdProof && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                    <CgProfile className="text-white text-xs" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Owner ID Proof
                  </h3>
                </div>
                <div className="relative group cursor-pointer">
                  <img
                    src={supplier.ownerIdProof}
                    alt="Owner ID Proof"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                    onClick={() => window.open(supplier.ownerIdProof, "_blank")}
                  />
                </div>
              </div>
            )}

            {/* GST Certificate */}
            {supplier?.gstCertificate && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                    <FaIdCard className="text-white text-xs" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    GST Certificate
                  </h3>
                </div>
                <div className="relative group cursor-pointer">
                  <img
                    src={supplier.gstCertificate}
                    alt="GST Certificate"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                    onClick={() =>
                      window.open(supplier.gstCertificate, "_blank")
                    }
                  />
                </div>
              </div>
            )}

            {/* Other Documents */}
            {supplier?.otherDocuments &&
              supplier.otherDocuments.length > 0 &&
              supplier.otherDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                      <FaIdCard className="text-white text-xs" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Other Document {index + 1}
                    </h3>
                  </div>
                  <div className="relative group cursor-pointer">
                    <img
                      src={doc}
                      alt={`Other Document ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                      onClick={() => window.open(doc, "_blank")}
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* No Documents Message */}
          {!supplier?.panImage &&
            !supplier?.addressProof &&
            !supplier?.ownerIdProof &&
            !supplier?.gstCertificate &&
            (!supplier?.otherDocuments ||
              supplier.otherDocuments.length === 0) && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaIdCard className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  No documents uploaded yet
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;
