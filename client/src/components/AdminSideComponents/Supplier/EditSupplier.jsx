import React, { useState, useEffect } from "react";
import { Save, Upload, X, Eye, Camera } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdArrowBackIos } from "react-icons/md";

const EditSupplier = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [supplier, setSupplier] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState({});
  const navigate = useNavigate();

  const CLOUDINARY_UPLOAD_PRESET = `${process.env.REACT_APP_UPLOAD_PRESET}`;
  const CLOUDINARY_CLOUD_NAME = `${process.env.REACT_APP_CLOUDINARY_NAME}`;

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    mobNo: "",
    emailId: "",
    gender: "Male",
    address: "",
    businessName: "",
    businessType: "Retail",
    businessRegistrationName: "",
    panNo: "",
    gstIn: "",
    shopImage: "",
    panImage: "",
    addressProof: "",
    ownerIdProof: "",
    gstCertificate: "",
    otherDocuments: [],
  });

  // Fetch supplier data
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/supplier/suppliers-by-id/${id}`
        );
        const result = await response.json();

        if (result.success) {
          setSupplier(result.data);
          setFormData({
            fullName: result.data.fullName || "",
            mobNo: result.data.mobNo || "",
            emailId: result.data.emailId || "",
            gender: result.data.gender || "Male",
            address: result.data.address || "",
            businessName: result.data.businessName || "",
            businessType: result.data.businessType || "Retail",
            businessRegistrationName:
              result.data.businessRegistrationName || "",
            panNo: result.data.panNo || "",
            gstIn: result.data.gstIn || "",
            shopImage: result.data.shopImage || "",
            panImage: result.data.panImage || "",
            addressProof: result.data.addressProof || "",
            ownerIdProof: result.data.ownerIdProof || "",
            gstCertificate: result.data.gstCertificate || "",
            otherDocuments: result.data.otherDocuments || [],
          });
        } else {
          setError("Failed to fetch supplier data");
        }
      } catch (err) {
        setError("Error fetching supplier data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSupplier();
    }
  }, [id]);

  // Upload file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  // Handle file upload
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, GIF images and PDF files are allowed");
      return;
    }

    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));
    setError("");

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        [fieldName]: uploadedUrl,
      }));
      setSuccessMessage(`${fieldName} uploaded successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(`Failed to upload ${fieldName}: ${err.message}`);
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  // Handle other documents upload
  const handleOtherDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, GIF images and PDF files are allowed");
      return;
    }

    setUploadingFiles((prev) => ({ ...prev, otherDocument: true }));
    setError("");

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        otherDocuments: [...prev.otherDocuments, uploadedUrl],
      }));
      setSuccessMessage("Document uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(`Failed to upload document: ${err.message}`);
    } finally {
      setUploadingFiles((prev) => ({ ...prev, otherDocument: false }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Remove other document
  const removeOtherDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      otherDocuments: prev.otherDocuments.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/supplier/update-suppliers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Supplier updated successfully");
        navigate(-1);
      } else {
        setError(result.message || "Failed to update supplier");
        toast.error("Supplier not updated");
      }
    } catch (err) {
      setError("Error updating supplier: " + err.message);
      toast.error("Supplier not updated");
    } finally {
      setSaving(false);
    }
  };

  // Preview image modal
  const [previewImage, setPreviewImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const openImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setShowPreview(true);
  };

  const goBack = () => {
    navigate(-1);
  };

  // File input component
  const FileUploadInput = ({
    fieldName,
    label,
    currentValue,
    accept = "image/*,.pdf",
  }) => (
    <div>
      <label className="block text-sm font-medium text-primaryColor mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <input
            type="file"
            id={`file-${fieldName}`}
            accept={accept}
            onChange={(e) => handleFileUpload(e, fieldName)}
            className="hidden"
          />
          <label
            htmlFor={`file-${fieldName}`}
            className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
          >
            {uploadingFiles[fieldName] ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Upload className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {currentValue ? "Change File" : "Upload File"}
                </span>
              </div>
            )}
          </label>
        </div>
        {currentValue && (
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => openImagePreview(currentValue)}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {currentValue && (
        <p className="mt-1 text-xs text-gray-500 truncate">
          Current: {currentValue.split("/").pop()}
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading supplier data...</p>
        </div>
      </div>
    );
  }

  if (error && !supplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold">Error</p>
            <p className="mt-2">{error}</p>
            <button
              onClick={goBack}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="w-full mx-auto">
        <div className="rounded-lg">
          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center">
              <div
                onClick={() => navigate(-1)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-150"
              >
                <MdArrowBackIos size={26} />
              </div>
              <h1 className="text-2xl font-semibold text-primaryColor">
                Edit Supplier
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-lg">
          <div className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobNo"
                  value={formData.mobNo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  Email ID *
                </label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Business Information */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Business Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Service">Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  Business Registration Name *
                </label>
                <input
                  type="text"
                  name="businessRegistrationName"
                  value={formData.businessRegistrationName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  PAN Number *
                </label>
                <input
                  type="text"
                  name="panNo"
                  value={formData.panNo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  GST IN *
                </label>
                <input
                  type="text"
                  name="gstIn"
                  value={formData.gstIn}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Documents */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Documents
                </h3>
              </div>

              {/* File Upload Components */}
              <FileUploadInput
                fieldName="shopImage"
                label="Shop Image"
                currentValue={formData.shopImage}
                accept="image/*"
              />

              <FileUploadInput
                fieldName="panImage"
                label="PAN Image"
                currentValue={formData.panImage}
                accept="image/*,.pdf"
              />

              <FileUploadInput
                fieldName="addressProof"
                label="Address Proof"
                currentValue={formData.addressProof}
                accept="image/*,.pdf"
              />

              <FileUploadInput
                fieldName="ownerIdProof"
                label="Owner ID Proof"
                currentValue={formData.ownerIdProof}
                accept="image/*,.pdf"
              />

              <FileUploadInput
                fieldName="gstCertificate"
                label="GST Certificate"
                currentValue={formData.gstCertificate}
                accept="image/*,.pdf"
              />

              {/* Other Documents */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primaryColor mb-2">
                  Other Documents
                </label>
                <div className="space-y-3">
                  {formData.otherDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-primaryColor truncate">
                          {doc.split("/").pop()}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{doc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openImagePreview(doc)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeOtherDocument(index)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  <div>
                    <input
                      type="file"
                      id="other-document-upload"
                      accept="image/*,.pdf"
                      onChange={handleOtherDocumentUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="other-document-upload"
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
                    >
                      {uploadingFiles.otherDocument ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-gray-600">
                            Uploading...
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Upload className="h-5 w-5 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            Add Document
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={goBack}
                className="px-4 py-2 border border-gray-300 rounded-lg text-primaryColor hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 bg-primaryBtnColor text-white rounded-lg hover:bg-primaryBtnHoverColor disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Preview Modal */}
        {showPreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setShowPreview(false)}
          >
            <div className="max-w-4xl max-h-screen p-4 relative">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-2 right-2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
              >
                <X className="h-6 w-6" />
              </button>
              {previewImage.endsWith(".pdf") ? (
                <div className="bg-white p-8 rounded-lg">
                  <p className="text-center text-gray-600">PDF Preview</p>
                  <a
                    href={previewImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 text-blue-600 hover:text-blue-800 text-center"
                  >
                    Open PDF in new tab
                  </a>
                </div>
              ) : (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSupplier;
