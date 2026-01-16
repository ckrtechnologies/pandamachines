import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const API_URL = process.env.REACT_APP_API_URL;
const ADMIN_RESPONSE_TIMEOUT = 30000;

const ChatBot = ({ onClose }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [inquiryId, setInquiryId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [conversationMode, setConversationMode] = useState("initial");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [adminResponseTimer, setAdminResponseTimer] = useState(null);
  const [busyMessageShown, setBusyMessageShown] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    setMessages([
      {
        id: "1",
        sender: "bot",
        message:
          "Hi 👋 Welcome to Panda Machine! Your trusted partner in industrial solutions. How can I assist you today?",
      },
    ]);
    setTimeout(() => {
      setShowOptions(true);
    }, 1000);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && inquiryId) {
      socket.emit("join-inquiry", inquiryId);
      socket.on("admin-online", (data) => {
        setAdminOnline(true);
        clearAdminResponseTimer();
      });
      socket.on("admin-offline", (data) => {
        setAdminOnline(false);
      });
      socket.on("new-message", (message) => {
        if (message.sender === "admin") {
          setMessages((prev) => [...prev, message]);
          clearAdminResponseTimer();
          setBusyMessageShown(false);
        }
      });

      socket.on("load-messages", (loadedMessages) => {
        if (loadedMessages.length > 0) {
          setMessages((prev) => [...prev, ...loadedMessages]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("admin-online");
        socket.off("admin-offline");
        socket.off("new-message");
        socket.off("load-messages");
      }
      clearAdminResponseTimer();
    };
  }, [socket, inquiryId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearAdminResponseTimer = () => {
    if (adminResponseTimer) {
      clearTimeout(adminResponseTimer);
      setAdminResponseTimer(null);
    }
  };

  const startAdminResponseTimer = () => {
    clearAdminResponseTimer();
    const timer = setTimeout(() => {
      if (!busyMessageShown) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "bot",
            message:
              "⏳ All our agents are currently busy. We have saved your details and will connect with you shortly!",
          },
        ]);
        setBusyMessageShown(true);
      }
    }, ADMIN_RESPONSE_TIMEOUT);
    setAdminResponseTimer(timer);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOptionSelect = (option) => {
    setShowOptions(false);

    if (option === "contact") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "bot",
            message:
              "📞 Here are our contact details:\n\n📍 Address:\n784/2647, 3rd Floor, Jagamara\nBhubaneswar - 751030\n\n📞 Phone:\n+91 80717 93049\n\n✉️ Email:\ninfo@pandamachines.com",
          },
        ]);
        setShowOptions(true);
      }, 800);
    } else if (option === "chat") {
      setConversationMode("form");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "bot",
            message: "👤 What is your name?",
          },
        ]);
      }, 800);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      message: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);

    if (conversationMode === "form") {
      if (currentStep === 0) {
        setFormData((prev) => ({ ...prev, name: inputValue }));
        setInputValue("");
        setCurrentStep(1);

        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "bot",
              message: "📱 What is your phone number?",
            },
          ]);
        }, 800);
      } else if (currentStep === 1) {
        const dataToSave = {
          name: formData.name,
          phone: inputValue,
          email: "",
          product: "",
          message: "",
        };

        setInputValue("");

        try {
          setIsTyping(true);
          const response = await fetch(`${API_URL}/chat/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSave),
          });

          const data = await response.json();

          if (data.success) {
            setInquiryId(data.data._id);
            setConversationMode("chat");

            setTimeout(() => {
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  sender: "bot",
                  message:
                    "✅ Thank you! You are now connected to our support team. How can we help you?",
                },
              ]);
            }, 1000);
          }
        } catch (error) {
          console.error("Error saving inquiry:", error);
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "bot",
              message: "❌ Sorry, there was an error. Please try again.",
            },
          ]);
          setConversationMode("initial");
          setShowOptions(true);
        }
      }
    } else if (conversationMode === "chat" && inquiryId) {
      // Real-time chat with admin
      socket.emit("user-message", {
        inquiryId,
        message: inputValue,
        userName: formData.name,
      });
      setInputValue("");
      startAdminResponseTimer();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "1",
        sender: "bot",
        message:
          "Hi 👋 Welcome to Panda Machine! Your trusted partner in industrial solutions. How can I assist you today?",
      },
    ]);
    setCurrentStep(0);
    setConversationMode("initial");
    setInputValue("");
    setFormData({ name: "", phone: "" });
    setInquiryId(null);
    setAdminOnline(false);
    setBusyMessageShown(false);
    clearAdminResponseTimer();
    setTimeout(() => {
      setShowOptions(true);
    }, 500);
  };

  return (
    <div
      className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col z-50"
      style={{ height: "28rem" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00569e] to-[#004680] text-white px-4 py-3 rounded-t-xl flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 ${
              adminOnline ? "bg-[#8cc441]" : "bg-gray-400"
            } rounded-full animate-pulse`}
          ></div>
          <span className="font-semibold text-sm">
            {conversationMode === "chat"
              ? "Live Support"
              : "Panda Machine Assistant"}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={resetChat}
            className="text-white hover:bg-white/20 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 text-sm font-light"
            title="Start new conversation"
          >
            ↺
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 text-lg font-light"
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-[#00569e] to-[#004680] text-white rounded-tr-none shadow"
                  : "bg-white border border-gray-200 text-[#1f2937] rounded-tl-none shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {msg.message}
              </p>
              <span
                className={`text-xs mt-1 block ${
                  msg.sender === "user" ? "text-gray-100" : "text-[#6b7280]"
                }`}
              >
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start space-x-2">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Option Buttons */}
        {showOptions && conversationMode === "initial" && !isTyping && (
          <div className="space-y-2 mt-2">
            <p className="text-xs text-[#6b7280] font-medium mb-2">
              Choose an option:
            </p>
            <button
              onClick={() => handleOptionSelect("chat")}
              className="block w-full text-left bg-white border border-gray-200 px-4 py-3 rounded-xl hover:bg-[#a6c9e9]/10 hover:border-[#00569e] transition-all duration-200 text-sm font-medium text-[#1f2937] shadow-sm hover:shadow"
            >
              💬 Start Live Chat
            </button>
            <button
              onClick={() => handleOptionSelect("contact")}
              className="block w-full text-left bg-white border border-gray-200 px-4 py-3 rounded-xl hover:bg-[#a6c9e9]/10 hover:border-[#00569e] transition-all duration-200 text-sm font-medium text-[#1f2937] shadow-sm hover:shadow"
            >
              📞 Contact Info
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00569e] focus:border-transparent transition-all text-[#1f2937]"
            disabled={
              isTyping || (conversationMode === "initial" && showOptions)
            }
          />
          <button
            onClick={handleSendMessage}
            disabled={
              !inputValue.trim() ||
              isTyping ||
              (conversationMode === "initial" && showOptions)
            }
            className="bg-[#004680] text-white px-4 py-2.5 rounded-lg hover:bg-[#00365f] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium text-sm"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-[#6b7280] text-center mt-2">
          We're here to help!
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
