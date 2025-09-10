import React, { useState, useEffect } from "react";
import {
  Home,
  Building2,
  MapPin,
  Edit3,
  Trash2,
  Plus,
  Phone,
  Star,
  MoreVertical,
  AlertCircle,
  RefreshCw,
  User,
  Search,
  Map,
} from "lucide-react";
import AddAddressModal from "../../components/UserSideComponents/Address/AddAddressModal";
import EditAddressModal from "../../components/UserSideComponents/Address/EditAddressModal";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";

import Swal from "sweetalert2";
import BedsCarousel from "../../components/common/BedsCarousel";

const getUserData = () => {
  const userData = localStorage.getItem("pm-user-data");
  return userData ? JSON.parse(userData) : null;
};

const isUserLoggedIn = () => {
  return !!localStorage.getItem("pm-user-data");
};

const AddressSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full animate-pulse"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AddressCard = ({ address, onEdit, onDelete, isDeleting }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getAddressIcon = (addressType) => {
    switch (addressType?.toLowerCase()) {
      case "home":
        return <Home className="text-emerald-600" size={18} />;
      case "office":
      case "work":
        return <Building2 className="text-blue-600" size={18} />;
      default:
        return <MapPin className="text-purple-600" size={18} />;
    }
  };

  const getAddressTypeColor = (addressType) => {
    switch (addressType?.toLowerCase()) {
      case "home":
        return "text-emerald-600";
      case "office":
      case "work":
        return "text-blue-600";
      default:
        return "text-purple-600";
    }
  };

  return (
    <div className="relative group">
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        {address.isDefault && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              Default
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {getAddressIcon(address.addressType)}
            </div>
            <div>
              <h3
                className={`font-semibold text-sm ${getAddressTypeColor(
                  address.addressType
                )}`}
              >
                {address.addressType}
              </h3>
              <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                <User size={12} />
                {address.fullName}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20">
                <button
                  onClick={() => {
                    onEdit(address);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2 text-gray-700 text-sm transition-colors"
                >
                  <Edit3 size={14} />
                  Edit Address
                </button>
                <button
                  onClick={() => {
                    onDelete(address._id);
                    setShowMenu(false);
                  }}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 disabled:opacity-50 text-sm transition-colors"
                >
                  {isDeleting ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete Address
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-medium text-gray-900 text-sm mb-1">
              {address.addressLine1}
            </p>
            {address.addressLine2 && (
              <p className="text-gray-700 text-sm mb-1">
                {address.addressLine2}
              </p>
            )}
            <p className="text-gray-700 text-sm mb-1">
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className="text-gray-600 text-sm mb-2">{address.country}</p>
            {address.landmark && (
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <Map size={12} />
                {address.landmark}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg p-3">
            <Phone size={14} />
            <span className="font-medium text-sm">{address.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ onAddAddress, isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full p-8 mb-6">
          <MapPin className="text-gray-400" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Sign in to manage addresses
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Save your delivery addresses and make ordering faster and easier
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-full p-8 mb-6">
        <MapPin className="text-gray-400" size={48} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        No addresses saved yet
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Add your first address to get started with faster deliveries
      </p>
      <button
        onClick={onAddAddress}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
      >
        <Plus size={18} />
        Add Your First Address
      </button>
    </div>
  );
};

const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const isLoggedIn = isUserLoggedIn();

  const fetchAddresses = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = getUserData();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/address/user/${user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();

      if (data.success) {
        setAddresses(data.data || []);
      } else {
        setError("Failed to load addresses.");
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to load addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [isLoggedIn]);

  const handleDeleteAddress = async (addressId) => {
    if (!isLoggedIn) {
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoadingDelete((prev) => new Set([...prev, addressId]));

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/address/delete-address/${addressId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete address");
        }

        setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
        Swal.fire({
          title: "Deleted!",
          text: "Address has been deleted successfully.",
          icon: "success",
        });
      } catch (err) {
        console.error("Error deleting address:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete address. Please try again.",
          icon: "error",
        });
      } finally {
        setLoadingDelete((prev) => {
          const newSet = new Set(prev);
          newSet.delete(addressId);
          return newSet;
        });
      }
    }
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setShowEditAddressModal(true);
  };

  const handleAddressUpdated = (updatedAddress) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr._id === updatedAddress._id ? updatedAddress : addr
      )
    );
    setShowEditAddressModal(false);
    setSelectedAddress(null);

    Swal.fire({
      title: "Success!",
      text: "Address updated successfully.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleAddAddress = () => {
    if (!isLoggedIn) {
      return;
    }
    setShowAddAddressModal(true);
  };

  const handleAddressAdded = (newAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
    setShowAddAddressModal(false);
  };

  const closeAllModals = () => {
    setShowAddAddressModal(false);
    setShowEditAddressModal(false);
    setSelectedAddress(null);
  };

  const filteredAddresses = addresses.filter(
    (address) =>
      address.addressType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.addressLine1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <UserNavbar />
        <BedsCarousel />

        <div className="py-4 px-4 md:px-6 xl:px-6">
          <div className="mb-8">
            <div className="w-64 h-8 bg-gray-300 rounded-lg animate-pulse mb-3"></div>
            <div className="w-48 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <AddressSkeleton />
        </div>
        <AllUserFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <UserNavbar />
        <BedsCarousel />

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-red-50 rounded-full p-6 mx-auto mb-4 w-fit">
              <AlertCircle className="text-red-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
        <AllUserFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <UserNavbar />
      <BedsCarousel />

      <div className="py-4 px-4 md:px-6 xl:px-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Addresses
              </h1>
              <p className="text-gray-600">
                {addresses.length === 0
                  ? "No addresses saved yet"
                  : `${addresses.length} address${
                      addresses.length !== 1 ? "es" : ""
                    } saved`}
              </p>
            </div>

            {isLoggedIn && addresses.length > 0 && (
              <button
                onClick={handleAddAddress}
                className="bg-gradient-to-r from-primaryBtnColor to-primaryColor hover:from-primaryBtnHoverColor hover:to-primaryTextColor text-white px-5 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={18} />
                Add New Address
              </button>
            )}
          </div>

          {isLoggedIn && addresses.length > 0 && (
            <div className="mt-6 relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search addresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          )}
        </div>

        {!isLoggedIn || addresses.length === 0 ? (
          <EmptyState onAddAddress={handleAddAddress} isLoggedIn={isLoggedIn} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAddresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                isDeleting={loadingDelete.has(address._id)}
              />
            ))}
          </div>
        )}

        {isLoggedIn &&
          addresses.length > 0 &&
          filteredAddresses.length === 0 && (
            <div className="text-center py-16">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No addresses found
              </h3>
              <p className="text-gray-600">
                Try searching with different keywords
              </p>
            </div>
          )}
      </div>

      <AllUserFooter />

      <AddAddressModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onAddressAdded={handleAddressAdded}
      />

      <EditAddressModal
        isOpen={showEditAddressModal}
        onClose={() => {
          setShowEditAddressModal(false);
          setSelectedAddress(null);
        }}
        address={selectedAddress}
        onAddressUpdated={handleAddressUpdated}
      />
    </div>
  );
};

export default SavedAddresses;
