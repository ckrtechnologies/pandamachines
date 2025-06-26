import React from "react";
import UserNavbar from "../../components/common/UserNavbar";
import ExpertCallBanner from "../../components/common/ExpertCallBanner";
import AllUserFooter from "../../components/common/AllUserFooter";
import sideImg from "../../Assets/Images/OBJECTS.png";

const GuidanceBookingConfirm = () => {
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
              <div className="text-gray-800 text-md tracking-wide space-y-2 mb-12">
                <div className="text-xl font-bold text-[#FF8617]">Sidhartha Srichandan</div>
                <div>+91 80937 71275</div>
                <div>30 mins Video Session (₹5000)</div>
                <div>20-06-2025 | 11:30 am</div>
              </div>

              <button className="text-xl px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2">
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
        </div>
      </div>
      <AllUserFooter />
    </React.Fragment>
  );
};

export default GuidanceBookingConfirm;
