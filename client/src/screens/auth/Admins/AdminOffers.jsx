import React from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiInbox,
  FiPercent,
  FiCalendar,
} from "react-icons/fi";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddOfferModal from "../../../components/AdminSideComponents/Offer/AddOfferModal";
import EditOfferModal from "../../../components/AdminSideComponents/Offer/EditOfferModal";
import DeleteAlertModal from "../../../components/AdminSideComponents/Common/DeleteAlertModal";

const AdminOffers = () => {
  const [offerDetails, setOfferDetails] = useState([]);
  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
  const [isEditOfferModalOpen, setIsEditOfferModalOpen] = useState(false);
  const [isDeleteOfferModalOpen, setIsDeleteOfferModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [dltLoading, setDltLoading] = useState(false);
  const navigate = useNavigate();

  const allOffers = () => {
    setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/offer/get-all-offer`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setOfferDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    allOffers();
  }, []);

  const handleDelete = () => {
    setDltLoading(true);
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/offer/delete-offer/${offerToDelete._id}`,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        allOffers();
        setIsDeleteOfferModalOpen(false);
        setDltLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setDltLoading(false);
      });
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    const formattedDate = new Date(`${year}-${month}-${day}`);
    return formattedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Ongoing":
        return "Active";
      case "Incoming":
        return "Upcoming";
      case "Expired":
        return "Expired";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Ongoing":
        return "bg-accentColor text-white";
      case "Incoming":
        return "bg-primaryColor text-white";
      case "Expired":
        return "bg-red-500 text-white";
      default:
        return "bg-secondaryTextColor text-white";
    }
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const getRemainingDays = (endDate) => {
    const today = new Date();
    const end = parseDate(endDate);
    const difference = end - today;
    if (difference < 0) return 0;
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Offers
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your offers</p>
        </div>
        <div>
          <button
            className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
            onClick={() => setIsAddOfferModalOpen(true)}
          >
            <FiPlus className="mr-2" />
            Add Offer
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-skeletonLoaderColor w-full"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-skeletonLoaderColor rounded w-3/4"></div>
                  <div className="h-3 bg-skeletonLoaderColor rounded w-full"></div>
                  <div className="h-3 bg-skeletonLoaderColor rounded w-5/6"></div>
                  <div className="h-8 bg-skeletonLoaderColor rounded w-20"></div>
                </div>
              </div>
            ))}
        </div>
      ) : offerDetails.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <FiInbox className="text-secondaryTextColor text-4xl" />
            </div>
            <h2 className="text-2xl font-semibold text-primaryTextColor mb-2">
              No offers found
            </h2>
            <p className="text-secondaryTextColor max-w-md mb-6">
              It looks like you haven't created any offers yet. Start by
              creating your first promotional offer to boost your sales!
            </p>
            <button
              className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
              onClick={() => setIsAddOfferModalOpen(true)}
            >
              <FiPlus className="mr-2" />
              Add Offer
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offerDetails.map((offer, index) => {
            const status = offer.status;
            return (
              <div
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primaryFadedColor transition-all duration-300 transform hover:-translate-y-0.5"
                key={index}
              >
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                    onClick={() => {
                      setSelectedOfferId(offer._id);
                      setIsEditOfferModalOpen(true);
                    }}
                  >
                    <FiEdit className="text-primaryColor text-sm" />
                  </button>
                  <button
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                    onClick={() => {
                      setOfferToDelete(offer);
                      setIsDeleteOfferModalOpen(true);
                    }}
                  >
                    <FiTrash2 className="text-red-500 text-sm" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      status
                    )}`}
                  >
                    {getStatusText(status)}
                  </span>
                  {status === "Ongoing" && (
                    <div className="text-sm text-primaryColor mt-2 bg-red-100 rounded-xl px-2 py-1">
                      {getRemainingDays(offer.endDate)} days left
                    </div>
                  )}
                </div>

                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.name}
                    className="h-48 w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Offer+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-primaryTextColor mb-2 line-clamp-1">
                      {offer.name}
                    </h3>
                    <p className="text-secondaryTextColor text-sm line-clamp-2 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  {/* Date Information */}
                  <div className="p-1 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-xs text-secondaryTextColor">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-primaryColor" />
                        <span className="font-medium">Start:</span>
                        <span>{formatDate(offer.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-primaryColor" />
                        <span className="font-medium">End:</span>
                        <span>{formatDate(offer.endDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddOfferModal
        isOpen={isAddOfferModalOpen}
        setIsAddModalOpen={setIsAddOfferModalOpen}
        refetchOffers={allOffers}
      />
      <EditOfferModal
        isOpen={isEditOfferModalOpen}
        setIsEditModalOpen={setIsEditOfferModalOpen}
        offerId={selectedOfferId}
        refetchOffers={allOffers}
      />
      <DeleteAlertModal
        isOpen={isDeleteOfferModalOpen}
        onClose={() => setIsDeleteOfferModalOpen(false)}
        dltType="offer"
        dltName={offerToDelete?.name}
        onConfirm={handleDelete}
        dltLoading={dltLoading}
      />
    </div>
  );
};

export default AdminOffers;
