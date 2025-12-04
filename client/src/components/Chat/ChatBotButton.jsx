// ChatBotButton.jsx
import React, { useState, useEffect } from 'react';
import ChatBot from './ChatBot';

const ChatBotButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Auto-open chatbot after 2 seconds
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Floating Chatbot Button */}
            {!isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-6 z-50 cursor-pointer group"
                >
                    <div className="relative">
                        {/* Pulse Animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-ping opacity-75"></div>
                        
                        {/* Main Button */}
                        <div className="relative w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-8 h-8 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                        </div>

                        {/* Notification Badge */}
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-white text-xs font-bold">1</span>
                        </div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-4 whitespace-nowrap shadow-xl">
                            Need help? Chat with us!
                            <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chatbot Window */}
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