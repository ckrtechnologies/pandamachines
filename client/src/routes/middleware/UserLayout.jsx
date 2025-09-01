import React from "react";
import UserFooter from "../../components/common/UserFooter";
import { FaWhatsapp } from "react-icons/fa6";
import TopNavbar from "../../components/userNavbar/TopNavbar";
import Inquiry from "../../components/Inquiry/Inquiry";

const UserLayout = (props) => {
  const MessageButton = () => {
    const openMessageModal = () => {
      const phoneNumber = "919393991563";
      const whatsappUrl = `https://wa.me/${phoneNumber}`;
      window.open(whatsappUrl, "_blank");
    };

    return (
      <button
        className="fixed right-4 bottom-4 p-2 bg-[#f5e7e7] rounded-full shadow-lg hover:bg-[#f8bdbd] hover:scale-105 ease-in-out duration-300 focus:outline-none transition-transform transform-gpu"
        onClick={openMessageModal}
      >
        <FaWhatsapp size={32} color="#10b416" />
      </button>
    );
  };

  return (
    <React.Fragment>
      <TopNavbar />
      {props.children}
      <UserFooter />
      <div className="fixed bottom-6 right-6 z-50">
        <Inquiry />
      </div>
      {/* <MessageButton /> */}
    </React.Fragment>
  );
};

export default UserLayout;
