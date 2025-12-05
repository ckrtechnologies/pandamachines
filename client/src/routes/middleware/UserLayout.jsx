import React, { useState } from "react";
import UserFooter from "../../components/common/UserFooter";
import { FaRobot, FaWhatsapp } from "react-icons/fa6";
import TopNavbar from "../../components/userNavbar/TopNavbar";
import Inquiry from "../../components/Inquiry/Inquiry";
import ChatBot from "../../components/AdminSideComponents/Common/ChatBot";
import ChatBotButton2 from "../../components/Chat/ChatBotButton";
const UserLayout = (props) => {
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

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

  const handleCloseChatBot = () => {
    setIsChatBotOpen(false);
  };

  return (
    <React.Fragment>
      <TopNavbar />
      {props.children}
      <UserFooter />
      <div className="fixed bottom-6 right-6 z-50">
        <Inquiry />
      </div>

      <ChatBotButton2 />
      {/* <ChatBotButton setIsChatBotOpen={setIsChatBotOpen} /> */}

      {/* Render ChatBot when open */}
      {/* {isChatBotOpen && <ChatBot onClose={handleCloseChatBot} />} */}

      {/* <MessageButton /> */}
    </React.Fragment>
  );
};

export default UserLayout;

const ChatBotButton = ({ setIsChatBotOpen }) => {
  const handleOpenChatBot = () => {
    setIsChatBotOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpenChatBot}
        className="blink-scale-button fixed right-6 bottom-28 w-16 h-16
                   bg-[#144982] 
                   rounded-full shadow-2xl flex items-center justify-center 
                   hover:scale-110 transition-all duration-300 ease-in-out 
                   focus:outline-none border-2 border-[#144982] z-40"
        title="Chatbot Inquiry"
      >
        <FaRobot size={28} className="text-white" />
      </button>

      <style>
        {`
          @keyframes blinkScale {
            0%, 100% { 
              transform: scale(1);
              opacity: 1;
              box-shadow: 0 0 0 0 rgba(20, 73, 130, 0.3);
            }
            50% { 
              transform: scale(1.1);
              opacity: 0.9;
              box-shadow: 0 0 0 10px rgba(20, 73, 130, 0.3);
            }
          }

          .blink-scale-button {
            animation: blinkScale 2s infinite;
          }

          .blink-scale-button:hover {
            animation: none;
            transform: scale(1.1);
          }
        `}
      </style>
    </>
  );
};
