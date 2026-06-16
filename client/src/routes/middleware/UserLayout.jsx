import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import UserFooter from "../../components/common/UserFooter";
import Inquiry from "../../components/Inquiry/Inquiry";
import TalkToExpert from "../../components/Inquiry/TalkToExpert";
import TopNavbar from "../../components/userNavbar/TopNavbar";
import MobileBottomBar from "../../components/userNavbar/MobileBottomBar";
import { useCart } from "../../context/CartContext";
import { WHATSAPP_NUMBER } from "../../utils/constants";

const UserLayout = (props) => {
  const location = useLocation();

  const hideTopNavbarOnTheseRoutes = ["/categories", "/all-categories", "/subcategory", "/products"]
  const { cartCount } = useCart();

  const WhatsAppButton = () => {
    const openWhatsApp = () => {
      const phoneNumber = WHATSAPP_NUMBER || "919393991563";
      const whatsappUrl = `https://wa.me/${phoneNumber}`;
      window.open(whatsappUrl, "_blank");
    };

    return (
      <button
        onClick={openWhatsApp}
        className="flex items-center gap-2 px-6 py-3 
                   bg-gradient-to-r from-[#25d366] to-[#20ba5a]
                   rounded-full shadow-2xl hover:shadow-3xl
                   hover:scale-105 transition-all duration-300 ease-in-out 
                   focus:outline-none z-40 group"
        title="Chat with us on WhatsApp"
      >
        <FaWhatsapp size={32} className="text-white" />
        <span className="text-white font-semibold text-sm whitespace-nowrap">
          Chat with us
        </span>
      </button>
    );
  };

  const shouldHideTopNavbar = hideTopNavbarOnTheseRoutes.some((route) =>
    location.pathname?.startsWith(route)
  );

  return (
    <React.Fragment>
      {!shouldHideTopNavbar && <TopNavbar />}
      {props.children}
      {!shouldHideTopNavbar && <UserFooter />}

      <MobileBottomBar cartCount={cartCount} />

      <Inquiry showButton={false} />
      {
        !shouldHideTopNavbar && (
          <>
            <div className="hidden md:block fixed bottom-40  sm:bottom-28 right-6 z-40">
              <WhatsAppButton />
            </div>

            <div className="hidden md:block fixed bottom-20 sm:bottom-12 right-6 z-50">
              <Inquiry />
            </div>

            <div className="hidden md:block fixed bottom-20 sm:bottom-12 left-6 z-50">
              <TalkToExpert />
            </div>
          </>
        )
      }

    </React.Fragment>
  );
};

export default UserLayout;
