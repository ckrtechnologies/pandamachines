import React, { useState, useEffect } from "react";
import { X, Plus, MapPin, Phone, Home, Building, User } from "lucide-react";

const SelectAddressModal = ({ isOpen, onClose, onAddressSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const user = getUserData();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/address/user/${user._id}`
      );
      const data = await response.json();

      if (data.success) {
        setAddresses(data.data);
      } else {
        setError("Failed to fetch addresses");
      }
    } catch (err) {
      setError("Error fetching addresses");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case "Home":
        return <Home className="w-4 h-4 text-green-600" />;
      case "Work":
        return <Building className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAddressTypeColor = (type) => {
    switch (type) {
      case "Home":
        return "bg-green-100 text-green-800";
      case "Work":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddressSelect = (address) => {
    onAddressSelect?.(address);
    onClose();
  };

  const handleAddNewAddress = () => {
    console.log("Add new address clicked");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Select an address
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b">
          <button
            onClick={handleAddNewAddress}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading addresses...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchAddresses}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  SAVED ADDRESSES
                </h3>
                <p className="text-xs text-gray-500">
                  (Choose any address to go ahead..)
                </p>
              </div>

              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      address.isDefault
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleAddressSelect(address)}
                  >
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {address.isDefault && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                          Home
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getAddressTypeColor(
                          address.addressType
                        )}`}
                      >
                        {address.addressType}
                      </span>
                    </div>

                    <div className="pr-16">
                      <div className="flex items-center gap-2 mb-2">
                        {getAddressTypeIcon(address.addressType)}
                        <h4 className="font-semibold text-gray-900">
                          {address.fullName}
                        </h4>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                          <div>
                            <p>{address.addressLine1}</p>
                            <p>{address.addressLine2}</p>
                            <p>
                              {address.city} - {address.postalCode}
                            </p>
                            <p>
                              {address.state}, {address.country}
                            </p>
                            {address.landmark && (
                              <p className="text-xs text-gray-500">
                                Landmark: {address.landmark}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">
                            Mobile: {address.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-3 h-3 bg-red-600 rounded-full opacity-75"></div>
                    </div>
                  </div>
                ))}
              </div>

              {addresses.length === 0 && !loading && (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No saved addresses found</p>
                  <button
                    onClick={handleAddNewAddress}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Add Your First Address
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectAddressModal;
