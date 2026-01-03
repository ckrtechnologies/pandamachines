import React, { useState, useEffect } from "react";
import ChatBot from "./ChatBot";
import { FaRobot } from "react-icons/fa6";

const ChatBotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute inset-0  bg-[#144982] rounded-full animate-ping opacity-75"></div>
            <div className="relative w-16 h-16  bg-[#144982] rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50">
              <FaRobot size={28} className="text-white" />
            </div>
          </div>
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-4 whitespace-nowrap shadow-xl">
              Need help? Chat with us!
              <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
      {isOpen && <ChatBot onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatBotButton;

// ChatBot.jsx

// Add these custom animations to your tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'fadeIn': 'fadeIn 0.3s ease-in',
//         'slideUp': 'slideUp 0.3s ease-out',
//       },
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0', transform: 'translateY(10px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         slideUp: {
//           '0%': { opacity: '0', transform: 'translateY(20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//       },
//     },
//   },
// }
