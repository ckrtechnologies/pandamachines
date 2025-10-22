import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  FileText,
  Image,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import SupplierStatusChangeModal from "../Supplier/SupplierStatusChangeModal";

const SupplierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchSupplierDetails = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/supplier/suppliers-by-id/${id}`
      );
      const result = await response.json();

      if (result.success) {
        setSupplier(result.data);
      } else {
        setError("Failed to fetch supplier details");
      }
    } catch (err) {
      setError("Error fetching supplier details: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchSupplierDetails();
    }
  }, [id]);
  const handleStatusClick = (seller) => {
    if (seller.status === "Approved") {
      return;
    }
    setSelectedSupplier(seller);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-accentColor";
      case "pending":
        return "text-yellow-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-secondaryTextColor";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-accentColor" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const StatusBadge = ({ status, seller, onClick }) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case "Pending":
          return {
            text: "Pending",
            className:
              "px-5 py-2 text-md text-yellow-600 bg-yellow-200 rounded-full transition-colors w-fit cursor-pointer hover:bg-yellow-300",
          };
        case "Rejected":
          return {
            text: "Rejected",
            className:
              "px-5 py-2 text-md w-fit text-red-700 bg-red-200 rounded-full transition-colors cursor-pointer hover:bg-red-300",
          };
        case "Approved":
          return {
            text: "Approved",
            className:
              "px-5 py-2 text-md w-fit text-green-700 bg-green-200 hover:bg-green-300 rounded-full transition-colors cursor-default",
          };
        default:
          return {
            text: status || "Unknown",
            className:
              "px-5 py-2 text-md w-fit text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors cursor-default",
          };
      }
    };

    const config = getStatusConfig(status);

    return (
      <p
        className={config.className}
        onClick={() => status !== "Approved" && onClick(seller)}
        title={
          status === "Approved"
            ? "Cannot change approved status"
            : "Click to change status"
        }
      >
        {config.text}
      </p>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        {/* Header */}
        <div className="mb-6">
          <div className="h-6 w-48 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3 p-4 border rounded-xl">
            <div className="h-5 w-40 bg-gray-300 rounded"></div>
            <div className="h-4 w-56 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-44 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>

          {/* Documents */}
          <div className="space-y-4 p-4 border rounded-xl">
            <div className="h-5 w-32 bg-gray-300 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Business Information */}
        <div className="p-4 border rounded-xl space-y-3 mb-6">
          <div className="h-5 w-48 bg-gray-300 rounded"></div>
          <div className="h-4 w-60 bg-gray-200 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>

        {/* Registration Details */}
        <div className="p-4 border rounded-xl space-y-3">
          <div className="h-5 w-48 bg-gray-300 rounded"></div>
          <div className="h-4 w-60 bg-gray-200 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-primaryTextColor mb-2">
                Error Loading Supplier Details
              </h2>
              <p className="text-secondaryTextColor">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <User className="w-16 h-16 text-secondaryTextColor mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-primaryTextColor mb-2">
                Supplier Not Found
              </h2>
              <p className="text-secondaryTextColor">
                No supplier details available for this ID.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto space-y-3">
        {/* Header */}
        <div className="">
          <div className="flex items-center justify-between">
            <div className="flex items-start justify-start gap-2">
              <div
                onClick={() => navigate(-1)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150"
              >
                <MdArrowBackIos size={26} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primaryTextColor capitalize">
                  {supplier.fullName}
                </h1>
                <p className="text-secondaryTextColor mt-1 capitalize">
                  {supplier.businessName}
                </p>
              </div>
            </div>
            <div>
              <StatusBadge
                status={supplier?.status}
                seller={supplier}
                onClick={handleStatusClick}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white rounded-lg p-4">
              <div className=" flex items-center justify-between">
                <h2 className="text-xl font-semibold text-primaryTextColor mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primaryColor" />
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primaryColor" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">Email</p>
                    <p className="text-primaryTextColor font-medium">
                      {supplier.emailId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primaryColor" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">
                      Mobile Number
                    </p>
                    <p className="text-primaryTextColor font-medium">
                      {supplier.mobNo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-primaryColor" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">Gender</p>
                    <p className="text-primaryTextColor font-medium">
                      {supplier.gender}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primaryColor" />
                  <div>
                    <p className="text-sm text-secondaryTextColor">Address</p>
                    <p className="text-primaryTextColor font-medium">
                      {supplier.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-primaryTextColor mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-primaryColor" />
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-secondaryTextColor">
                    Business Name
                  </p>
                  <p className="text-primaryTextColor font-medium">
                    {supplier.businessName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondaryTextColor">
                    Business Type
                  </p>
                  <p className="text-primaryTextColor font-medium">
                    {supplier.businessType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondaryTextColor">
                    Registration Name
                  </p>
                  <p className="text-primaryTextColor font-medium">
                    {supplier.businessRegistrationName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondaryTextColor">Commission</p>
                  <p className="text-primaryTextColor font-medium">
                    {supplier.commission}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondaryTextColor">
                    Commission on Bulk Order
                  </p>
                  <p className="text-primaryTextColor font-medium">
                    {supplier.bulkOrderCommission}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondaryTextColor">PAN Number</p>
                  <p className="text-primaryTextColor font-medium">
                    {supplier.panNo}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-secondaryTextColor">GST Number</p>
                  <p className="text-primaryTextColor font-medium">
                    {supplier.gstIn}
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-primaryTextColor mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primaryColor" />
                Registration Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-secondaryTextColor">
                    Registration Date
                  </p>
                  <p className="text-primaryTextColor font-medium">
                    {supplier.registrationDate &&
                      formatDate(supplier.registrationDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-primaryTextColor mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primaryColor" />
                Documents
              </h2>
              <div className="space-y-4">
                {supplier.shopImage && (
                  <div>
                    <p className="text-sm text-secondaryTextColor mb-2">
                      Shop Image
                    </p>
                    <img
                      src={supplier.shopImage}
                      alt="Shop"
                      className="w-full h-32 object-cover rounded border cursor-pointer"
                      onClick={() => setSelectedImage(supplier.shopImage)}
                    />
                  </div>
                )}

                {supplier.panImage && (
                  <div>
                    <p className="text-sm text-secondaryTextColor mb-2">
                      PAN Card
                    </p>
                    <img
                      src={supplier.panImage}
                      alt="PAN Card"
                      className="w-full h-32 object-cover rounded border cursor-pointer"
                      onClick={() => setSelectedImage(supplier.panImage)}
                    />
                  </div>
                )}

                {supplier.addressProof && (
                  <div>
                    <p className="text-sm text-secondaryTextColor mb-2">
                      Address Proof
                    </p>
                    <img
                      src={supplier.addressProof}
                      alt="Address Proof"
                      className="w-full h-32 object-cover rounded border cursor-pointer"
                      onClick={() => setSelectedImage(supplier.addressProof)}
                    />
                  </div>
                )}

                {supplier.ownerIdProof && (
                  <div>
                    <p className="text-sm text-secondaryTextColor mb-2">
                      Owner ID Proof
                    </p>
                    <img
                      src={supplier.ownerIdProof}
                      alt="Owner ID"
                      className="w-full h-32 object-cover rounded border cursor-pointer"
                      onClick={() => setSelectedImage(supplier.ownerIdProof)}
                    />
                  </div>
                )}

                {supplier.gstCertificate && (
                  <div>
                    <p className="text-sm text-secondaryTextColor mb-2">
                      GST Certificate
                    </p>
                    <img
                      src={supplier.gstCertificate}
                      alt="GST Certificate"
                      className="w-full h-32 object-cover rounded border cursor-pointer"
                      onClick={() => setSelectedImage(supplier.gstCertificate)}
                    />
                  </div>
                )}

                {supplier.otherDocuments &&
                  supplier.otherDocuments.length > 0 && (
                    <div>
                      <p className="text-sm text-secondaryTextColor mb-2">
                        Other Documents
                      </p>
                      <div className="space-y-2">
                        {supplier.otherDocuments.map((doc, index) => (
                          <div key={index} className="border rounded p-2">
                            {doc.endsWith(".pdf") ? (
                              <a
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primaryColor hover:text-primaryBtnColor"
                              >
                                <FileText className="w-4 h-4" />
                                PDF Document {index + 1}
                              </a>
                            ) : (
                              <img
                                src={doc}
                                alt={`Document ${index + 1}`}
                                className="w-full h-24 object-cover rounded cursor-pointer"
                                onClick={() => setSelectedImage(doc)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
      <SupplierStatusChangeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        modalData={selectedSupplier}
        refreshSuppliers={fetchSupplierDetails}
      />
    </div>
  );
};

export default SupplierDetails;
