import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const API_URL = process.env.REACT_APP_API_URL;

const CombinedInquiry = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch all inquiries
  useEffect(() => {
    fetchInquiries();
  }, []);

  // Setup socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Join inquiry and load messages
  useEffect(() => {
    if (socket && selectedInquiry) {
      socket.emit("admin-join-inquiry", selectedInquiry._id);

      socket.on("new-message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on("load-messages", (messages) => {
        setMessages(messages);
      });
    }

    return () => {
      if (socket) {
        socket.off("new-message");
        socket.off("load-messages");
      }
    };
  }, [socket, selectedInquiry]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/all`);
      if (response.data.success) {
        setInquiries(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedInquiry(response.data.data[0]);
          setFormData(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setFormData(inquiry);
    setIsEditing(false);
    setMessages([]);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/chat/${selectedInquiry._id}`,
        formData
      );
      if (response.data.success) {
        setSelectedInquiry(response.data.data);
        setIsEditing(false);
        setInquiries(
          inquiries.map((inq) =>
            inq._id === response.data.data._id ? response.data.data : inq
          )
        );
        alert("Inquiry updated successfully!");
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
      alert("Error updating inquiry");
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socket) return;

    socket.emit("admin-message", {
      inquiryId: selectedInquiry._id,
      message: inputMessage,
      adminName: "Admin",
    });

    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF8617] border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-[90vh]  fixed lg:w-[85%] w-[100%]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Inquiry Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer inquiries and conversations
          </p>
        </div>
        <buuton
          className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer"
          onClick={() => navigate("/admin-chatbot-inquiries")}
        >
          show all
        </buuton>
      </div>

      {/* Main Content - Two Column Layout */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        style={{ height: "75vh" }}
      >
        {/* LEFT SIDE - Inquiries List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-gray-100 border-b">
            <h2 className="text-sm font-semibold text-gray-700 uppercase">
              Inquiries ({inquiries.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {inquiries.length === 0 ? (
              <div className="p-6 text-center">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-500 text-sm">No inquiries yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry._id}
                    onClick={() => handleSelectInquiry(inquiry)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedInquiry?._id === inquiry._id
                        ? "bg-orange-50 border-l-4 border-[#FF8617]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#FF8617] flex items-center justify-center text-white font-semibold">
                        {inquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">
                          {inquiry.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {inquiry.phone}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(inquiry.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Chat Box */}
        {selectedInquiry ? (
          <div className="lg:col-span-2 h-full">
            <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
              <div className="px-4 py-3 bg-gray-100 border-b">
                <h2 className="text-sm font-semibold text-gray-700 uppercase flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Chat with {selectedInquiry.name}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm">No messages yet</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.sender === "admin"
                          ? "bg-[#FF8617] text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-4 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex items-center justify-center">
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-lg">
                Select an inquiry to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedInquiry;
