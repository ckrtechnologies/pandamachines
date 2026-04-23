
import {
  Building,
  Check,
  Home,
  MapPin,
  Phone,
  Plus,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { LOCATION_KEY } from "../../../utils/constants";
import AddAddressModal from "../Address/Addressmodal";

const SelectAddressModal = ({ onAddressSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestedLocation, setSuggestedLocation] = useState(null);

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    const stored = localStorage.getItem(LOCATION_KEY);
    if (stored) {
      setSuggestedLocation(JSON.parse(stored));
    }
    // console.log("address stored:", JSON.parse(stored))
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const user = getUserData();

      if (!user || !user._id) {
        setAddresses([]);
        setError(null); // no error
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/address/user/${user._id}`
      );
      const data = await response.json();

      if (data.success) {
        const sortedAddresses = data.data.sort((a, b) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          return 0;
        });
        setAddresses(sortedAddresses);

        // Auto-select default address
        const defaultAddress = sortedAddresses.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
          onAddressSelect && onAddressSelect(defaultAddress._id);
        }
      } else {
        setError("Failed to fetch addresses");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case "Home":
        return <Home className="w-4 h-4 text-gray-600" />;
      case "Work":
        return <Building className="w-4 h-4 text-gray-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };
  const handleUseSuggestedAddress = async () => {
    try {
      const userData = localStorage.getItem("pm-user-data");
      const user = userData ? JSON.parse(userData) : null;

      if (!user || !user._id) {
        throw new Error("User not found");
      }

      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

      const payload = {
        user: user._id,

        fullName: fullName || "",
        phone: user.phone || "",

        addressLine1: suggestedLocation.name || "",
        addressLine2: suggestedLocation.full || "",

        city: suggestedLocation.city || "",
        state: suggestedLocation.state || "",
        postalCode: suggestedLocation.pincode || "",

        country: "India",

        landmark: suggestedLocation.name || "",

        addressType: "Home",
        isDefault: true,

        coordinates: suggestedLocation.coordinates || [],
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/address/create-address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create address");
      }

      const newAddress = data.data;

      //  instant UI update
      setAddresses((prev) => [newAddress, ...prev]);

      //  auto select
      setSelectedAddress(newAddress._id);
      onAddressSelect && onAddressSelect(newAddress._id);

    } catch (err) {
      console.error("Suggested address failed:", err);
    }
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    onAddressSelect && onAddressSelect(addressId);
  };

  const handleAddNewAddress = () => {
    setIsModalOpen(true);
  };

  const handleAddressAdded = (newAddress) => {
    setAddresses((prev) => {
      const updated = [...prev, newAddress];
      const sorted = updated.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return 0;
      });
      return sorted;
    });

    if (newAddress.isDefault) {
      setSelectedAddress(newAddress._id);
      onAddressSelect && onAddressSelect(newAddress._id);
    }

    setIsModalOpen(false);
  };

  const AddressSkeleton = () => {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="animate-pulse border rounded-lg p-4 bg-white"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-gray-200 mt-1"></div>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        <button
          onClick={handleAddNewAddress}
          className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {loading ? (
        <AddressSkeleton />
      ) : error ? (
        <div className="p-8 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={fetchAddresses}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div>
          {addresses.length === 0 ? (
            <div className="space-y-4">
              {/* Suggested Location */}
              {suggestedLocation && (
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium mb-2">
                    Suggested Address (from your location)
                  </p>

                  <p className="text-sm text-gray-700">
                    {suggestedLocation.full}
                  </p>

                  <button
                    onClick={() => handleUseSuggestedAddress()}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Use this address
                  </button>
                </div>
              )}

              {/* Existing Empty State */}
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No saved addresses found</p>
                <button
                  onClick={handleAddNewAddress}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add Your First Address
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${selectedAddress === address._id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => handleAddressSelect(address._id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {selectedAddress === address._id ? (
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {address.fullName}
                          </h4>
                          {getAddressTypeIcon(address.addressType)}
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {address.addressType}
                          </span>
                        </div>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded font-medium">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-700 space-y-1">
                        <p className="font-medium">{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>
                          {address.city}, {address.state} - {address.postalCode}
                        </p>
                        {address.landmark && (
                          <p className="text-gray-500">
                            Near {address.landmark}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700">
                          {address.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedAddress && addresses.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <Check className="w-5 h-5" />
            <span className="font-medium">Delivery address selected</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your order will be delivered to the selected address
          </p>
        </div>
      )}

      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddressAdded={handleAddressAdded}
      />
    </div>
  );
};

export default SelectAddressModal;
