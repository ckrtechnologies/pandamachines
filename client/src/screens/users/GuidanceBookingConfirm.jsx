import React from "react";
import UserNavbar from "../../components/common/UserNavbar";
import ExpertCallBanner from "../../components/common/ExpertCallBanner";
import AllUserFooter from "../../components/common/AllUserFooter";
import sideImg from "../../Assets/Images/OBJECTS.png";
import { useNavigate } from "react-router-dom";
import { WHATSAPP_NUMBER } from "../../utils/constants";

const GuidanceBookingConfirm = () => {
  const navigate = useNavigate();

  const getBookingResponse = () => {
    try {
      const storedData = localStorage.getItem("bookingResponse");
      if (!storedData) {
        console.log("No bookingResponse found in localStorage");
        return null;
      }
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Error parsing bookingResponse from localStorage:", error);
      return null;
    }
  };

  const bookingResponse = getBookingResponse();

  // If no booking data is found, show an error message
  if (!bookingResponse) {
    return (
      <React.Fragment>
        <UserNavbar />
        <ExpertCallBanner />
        <div className="flex items-center justify-center bg-[#FFFAF6] px-4 xl:px-6 py-6">
          <div className="w-full p-10 shadow-xl rounded-xl bg-white text-center">
            <h1 className="text-2xl md:text-4xl font-extrabold text-red-600 mb-4">
              No Booking Data Found
            </h1>
            <p className="text-gray-600 text-lg">
              Unable to retrieve your booking information. Please try booking
              again.
            </p>
          </div>
        </div>
        <AllUserFooter />
      </React.Fragment>
    );
  }

  // Format date and time properly
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString; // fallback to original string
    }
  };

  const handleGoHome = () => {
    localStorage.removeItem("bookingResponse");
    navigate("/", { "replace": true });
  };
  const whatsappMessage = `Hello, I have successfully completed my payment and booked a video session. Looking forward to my session. Thank you!`;

  return (
    <React.Fragment>
      <UserNavbar />
      <ExpertCallBanner />

      <div className="flex items-center justify-center bg-[#FFFAF6] px-4 xl:px-6 py-6">
        <div className="w-full p-10 shadow-xl rounded-xl bg-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-extrabold text-[#00395F] tracking-wide mb-4">
                Congratulations ...!
              </h1>
              <p className="text-gray-600 text-lg font-semibold tracking-wide mb-4">
                Your video session was booked with us. Please wait, our team
                will connect with you soon.
              </p>
              <div className="text-gray-800 text-md tracking-wide space-y-2 mb-6">
                <div className="text-xl font-bold text-[#FF8617]">
                  {bookingResponse?.booking?.fullName || "N/A"}
                </div>
                <div>{bookingResponse?.booking?.mobileNumber || "N/A"}</div>
                <div>
                  {bookingResponse?.booking?.discussionTime || "N/A"} Video
                  Session (₹
                  {bookingResponse?.booking?.discussionFee || "N/A"})
                </div>
                <div>
                  {formatDate(bookingResponse?.booking?.date)} |{" "}
                  {bookingResponse?.booking?.time || "N/A"}
                </div>

                {/* Additional booking details */}
                <div className="pt-4 text-sm text-gray-600">
                  <div>
                    <strong>Email:</strong>{" "}
                    {bookingResponse?.booking?.email || "N/A"}
                  </div>
                  <div>
                    <strong>Investment Amount:</strong> ₹
                    {bookingResponse?.booking?.investmentAmount || "N/A"}
                  </div>
                  <div>
                    <strong>Category:</strong>{" "}
                    {bookingResponse?.booking?.category?.name || "N/A"}
                  </div>
                  <div>
                    <strong>Product:</strong>{" "}
                    {bookingResponse?.booking?.product?.name || "N/A"}
                  </div>
                  {/* <div>
                    <strong>Status:</strong>{" "}
                    {bookingResponse?.booking?.status || "N/A"}
                  </div> */}
                </div>
              </div>

              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      whatsappMessage
                    )}`,
                    "_blank"
                  )
                }
                className="text-xl px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2"
              >
                WhatsApp Us
                <span className="inline-block transform translate-x-0.5">
                  →
                </span>
              </button>
            </div>

            {/* Right Image */}
            <div className="flex-1 flex justify-center">
              <img
                src={sideImg}
                alt="Illustration"
                className="max-w-[500px] w-full h-auto"
              />
            </div>
          </div>
          <div className="flex justify-center items-center mt-10">
            <button
              onClick={handleGoHome}
              className="text-xl px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
      <AllUserFooter />
    </React.Fragment>
  );
};

export default GuidanceBookingConfirm;
