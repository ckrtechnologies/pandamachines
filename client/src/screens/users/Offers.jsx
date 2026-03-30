import React, { useState } from "react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import BedsCarousel from "../../components/common/BedsCarousel";
import { useEffect } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate();

  const fetchOffers = () => {
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
        const ongoingOffers = response.data.filter(
          (offer) => offer.status === "Ongoing" || offer.status === "Incoming"
        );

        const sortedOffers = ongoingOffers.sort((a, b) => {
          if (a.status === "Ongoing" && b.status === "Incoming") return -1;
          if (a.status === "Incoming" && b.status === "Ongoing") return 1;
          return 0;
        });

        setOffers(sortedOffers);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to load offers");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    );
  };

  const isOfferActive = (startDate, endDate) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    return now >= start && now <= end;
  };

  const getRemainingDays = (endDate) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const end = parseDate(endDate);
    end.setHours(23, 59, 59, 999);

    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  const OfferSkeleton = () => (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 h-80 animate-pulse">
      <div className="w-full h-full bg-skeletonLoaderColor rounded-xl"></div>
    </div>
  );

  const getBadgeInfo = (offer) => {
    if (offer.status === "Incoming") {
      return {
        text: "Incoming",
        bgColor: "bg-blue-500",
        textColor: "text-white",
      };
    } else if (offer.status === "Ongoing") {
      const remainingDays = getRemainingDays(offer.endDate);
      return {
        text:
          remainingDays === 0
            ? "Last Day!"
            : `${remainingDays} ${remainingDays === 1 ? "day" : "days"} left`,
        bgColor: "bg-red-500",
        textColor: "text-white",
      };
    }
    return {
      text: "Active",
      bgColor: "bg-green-500",
      textColor: "text-white",
    };
  };

  if (error) {
    return (
      <div>
        <UserNavbar />
        <BedsCarousel />
        <div className="px-4 xl:px-6 mb-6 pt-6 pb-10 bg-gradient-to-br from-[#E0F2EA] via-[#F9F0DC] to-[#FFF8F8]">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-primaryTextColor mb-2">
              Unable to Load Offers
            </h3>
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={fetchOffers}
              className="px-6 py-3 bg-primaryBtnColor hover:bg-primaryBtnHoverColor text-white rounded-lg transition-colors duration-200 font-medium"
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
    <div>
      <UserNavbar />
      <BedsCarousel />

      <div className="px-4 xl:px-6 mb-6 pt-8 pb-12 bg-gradient-to-br from-[#E0F2EA] via-[#F9F0DC] to-[#FFF8F8]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 px-1">
          <div className="text-center w-full mb-6 md:mb-0">
            <h1 className="text-2xl tracking-wide md:text-3xl font-bold text-primaryTextColor mb-3">
              🎉 Active Offers & Deals
            </h1>
            <p className="text-secondaryTextColor text-base md:text-lg tracking-wide max-w-2xl mx-auto">
              Don't miss out on our ongoing limited-time offers. Save big on
              your favorite products!
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <OfferSkeleton key={index} />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 text-secondaryTextColor">🎁</div>
            <h3 className="text-2xl font-semibold text-primaryTextColor mb-3">
              No Active Offers Available
            </h3>
            <p className="text-secondaryTextColor text-lg">
              Stay tuned for exciting deals and offers coming your way!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 ">
            {offers.map((offer) => {
              const badgeInfo = getBadgeInfo(offer);

              return (
                <div
                  key={offer._id}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform duration-300 border border-gray-100 h-96 cursor-pointer"
                >
                  <div className="absolute top-4 right-4 z-20">
                    <span
                      className={`${badgeInfo.bgColor} ${badgeInfo.textColor} px-2 py-1 rounded-full text-xs font-bold shadow-lg`}
                    >
                      {badgeInfo.text}
                    </span>
                  </div>

                  <img
                    src={offer.image}
                    alt={offer.name}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02]"
                  />

                  <div className="absolute inset-0 bg-gray-900 bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 p-6">
                    <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-2/3 space-y-7">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">
                        {offer.name}
                      </h3>

                      <p className="text-md text-gray-200 mb-4 line-clamp-3 leading-relaxed">
                        {offer.description}
                      </p>

                      <div className="mb-4 p-3 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                        <div className="text-xs font-medium text-gray-300 mb-1">
                          Offer Period
                        </div>
                        <div className="text-sm font-semibold">
                          {formatDate(
                            offer.startDate.split("-").reverse().join("-")
                          )}{" "}
                          -{" "}
                          {formatDate(
                            offer.endDate.split("-").reverse().join("-")
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AllUserFooter />
    </div>
  );
};

export default Offers;
