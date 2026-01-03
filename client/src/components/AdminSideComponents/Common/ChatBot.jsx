import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi 👋 Welcome to Panda Machine! Your trusted partner in industrial solutions. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationFlow, setConversationFlow] = useState("initial");
  const [showProductForm, setShowProductForm] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    product: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showProductForm]);

  const simulateTyping = (responseMessages, callback) => {
    setIsTyping(true);
    let currentIndex = 0;

    const typeNextMessage = () => {
      if (currentIndex < responseMessages.length) {
        setMessages((prev) => [...prev, responseMessages[currentIndex]]);
        currentIndex++;
        setTimeout(typeNextMessage, 800);
      } else {
        setIsTyping(false);
        if (callback) callback();
      }
    };

    setTimeout(typeNextMessage, 600);
  };

  const handleContactInfo = () => {
    setIsTyping(true);
    setTimeout(() => {
      const botResponses = [
        {
          from: "bot",
          text: "Here are our contact details. We'd love to hear from you! 📞",
          timestamp: new Date(),
        },
        {
          from: "bot",
          text: `📍 **Address:**\n784/2647, 3rd Floor, Jagamara\nBhubaneswar - 751030`,
          timestamp: new Date(),
        },
        {
          from: "bot",
          text: `📞 **Phone:**\n+91 80717 93049`,
          timestamp: new Date(),
        },
        {
          from: "bot",
          text: `✉️ **Email:**\ninfo@pandamachines.com`,
          timestamp: new Date(),
        },
        {
          from: "bot",
          text: "Feel free to reach out for product inquiries, technical support, or business partnerships! 🤝",
          timestamp: new Date(),
        },
      ];
      simulateTyping(botResponses, () => {
        setStep(1);
        setConversationFlow("free_chat");
      });
    }, 800);
  };

  const openProductForm = () => {
    setShowProductForm(true);
    setUserDetails({
      name: "",
      email: "",
      phone: "",
      message: "",
      product: "",
    });
    setFormErrors({});
  };

  const validateForm = (details) => {
    const errors = {};

    if (!details.name.trim()) {
      errors.name = "Name is required";
    }

    if (!details.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!details.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/[\d\s\-\(\)\+]{10,}/.test(details.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid phone number (at least 10 digits)";
    }

    if (!details.product.trim()) {
      errors.product = "Product name is required";
    }

    return errors;
  };

  const handleFormSubmit = async () => {
    const errors = validateForm(userDetails);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setShowProductForm(false);
    setIsTyping(true);

    const inquiryData = {
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      message: userDetails.message || "I want to know more about this product.",
      product: userDetails.product,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chatbot-inquiry/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inquiryData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit inquiry");
      }

      setTimeout(() => {
        const botResponses = [
          {
            from: "bot",
            text: "🎉 Your inquiry has been submitted successfully!",
            timestamp: new Date(),
          },
          {
            from: "bot",
            text: `📋 **Inquiry Summary:**\n🔧 **Product:** ${
              userDetails.product
            }\n👤 **Name:** ${userDetails.name}\n📞 **Phone:** ${
              userDetails.phone
            }\n📧 **Email:** ${userDetails.email}${
              userDetails.message
                ? `\n💬 **Message:** ${userDetails.message}`
                : ""
            }`,
            timestamp: new Date(),
          },
          {
            from: "bot",
            text: "Our technical team will contact you shortly with detailed information. We're excited to help you with your industrial needs! 🏭",
            timestamp: new Date(),
          },
          {
            from: "bot",
            text: "For immediate assistance:\n📍 Visit: 784/2647, 3rd Floor, Jagamara, Bhubaneswar - 751030\n📞 Call: +91 80717 93049\n✉️ Email: info@pandamachines.com",
            timestamp: new Date(),
          },
        ];
        simulateTyping(botResponses, () => {
          setConversationFlow("free_chat");
          setStep(1);
          setUserDetails({
            name: "",
            email: "",
            phone: "",
            message: "",
            product: "",
          });
          setIsSubmitting(false);
        });
      }, 800);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setShowProductForm(false);
      setTimeout(() => {
        const errorResponses = [
          {
            from: "bot",
            text: `Oops! There was an issue: ${error.message}. Please try again or contact us directly.`,
            timestamp: new Date(),
          },
          {
            from: "bot",
            text: "📞 Call: +91 80717 93049\n✉️ Email: info@pandamachines.com",
            timestamp: new Date(),
          },
        ];
        simulateTyping(errorResponses, () => {
          setConversationFlow("free_chat");
          setStep(1);
          setIsSubmitting(false);
        });
      }, 800);
    }
  };

  const handleFreeMessage = (userMessage) => {
    setIsTyping(true);
    const userMessageLower = userMessage.toLowerCase();

    setTimeout(() => {
      let botResponse = "";

      if (
        userMessageLower.includes("hour") ||
        userMessageLower.includes("time") ||
        userMessageLower.includes("open")
      ) {
        botResponse =
          "Our business hours are:\n• Monday-Friday: 9 AM - 6 PM\n• Saturday: 9 AM - 2 PM\n• Sunday: Closed\n\nYou can visit us anytime during these hours! 🕒";
      } else if (
        userMessageLower.includes("price") ||
        userMessageLower.includes("cost") ||
        userMessageLower.includes("quote")
      ) {
        botResponse =
          "Our pricing varies based on the product and requirements. For accurate quotes and bulk pricing, please contact our sales team or submit a product inquiry. We offer competitive rates and flexible payment options! 💰";
      } else if (
        userMessageLower.includes("warranty") ||
        userMessageLower.includes("guarantee")
      ) {
        botResponse =
          "We provide comprehensive warranty coverage on all our machines:\n• Standard warranty on parts and labor\n• Extended warranty options available\n• Quick support and maintenance services\n\nFor specific warranty details, please inquire about the particular product! 🛡️";
      } else if (
        userMessageLower.includes("delivery") ||
        userMessageLower.includes("shipping")
      ) {
        botResponse =
          "We offer pan-India delivery services:\n• Safe and secure packaging\n• Professional installation support\n• Timely delivery schedules\n• Tracking available\n\nDelivery timelines depend on your location and product availability. 🚚";
      } else if (
        userMessageLower.includes("service") ||
        userMessageLower.includes("maintenance") ||
        userMessageLower.includes("support")
      ) {
        botResponse =
          "We provide comprehensive after-sales services:\n• Regular maintenance support\n• Technical troubleshooting\n• Spare parts availability\n• On-site service options\n• Training for operators\n\nOur technical team is always ready to assist! 🔧";
      } else if (
        userMessageLower.includes("product") ||
        userMessageLower.includes("machine") ||
        userMessageLower.includes("equipment")
      ) {
        botResponse =
          "We offer a wide range of industrial machines and equipment. Would you like to submit a product inquiry? Just select 'Product Inquiry' to get started! 🏭";
      } else if (
        userMessageLower.includes("thank") ||
        userMessageLower.includes("thanks")
      ) {
        botResponse =
          "You're welcome! 😊 Is there anything else I can help you with today?";
      } else if (
        userMessageLower.includes("hello") ||
        userMessageLower.includes("hi") ||
        userMessageLower.includes("hey")
      ) {
        botResponse = "Hello again! 👋 How can I assist you further?";
      } else if (
        userMessageLower.includes("bye") ||
        userMessageLower.includes("goodbye")
      ) {
        botResponse =
          "Thanks for reaching out! Have a great day and feel free to contact us anytime! 🏭✨";
      } else {
        botResponse =
          "Thanks for your message! Our team at Panda Machine specializes in industrial solutions. Could you tell me more about what you're looking for? I'm here to help with product inquiries, technical questions, or any other needs!";
      }

      const botResponses = [
        { from: "bot", text: botResponse, timestamp: new Date() },
      ];

      if (
        !userMessageLower.includes("thank") &&
        !userMessageLower.includes("hello") &&
        !userMessageLower.includes("hi") &&
        !userMessageLower.includes("bye")
      ) {
        botResponses.push({
          from: "bot",
          text: "For immediate assistance:\n📍 784/2647, 3rd Floor, Jagamara, Bhubaneswar - 751030\n📞 +91 80717 93049\n✉️ info@pandamachines.com",
          timestamp: new Date(),
        });
      }

      simulateTyping(botResponses, () => {
        setConversationFlow("free_chat");
        setStep(1);
      });
    }, 1000);
  };

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      from: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    if (text === "Contact Info") {
      handleContactInfo();
    } else if (text === "Product Inquiry") {
      openProductForm();
    } else {
      handleFreeMessage(text);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const resetChat = () => {
    setMessages([
      {
        from: "bot",
        text: "Hi 👋 Welcome to Panda Machine! Your trusted partner in industrial solutions. How can I assist you today?",
        timestamp: new Date(),
      },
    ]);
    setStep(0);
    setConversationFlow("initial");
    setInput("");
    setUserDetails({
      name: "",
      email: "",
      phone: "",
      message: "",
      product: "",
    });
    setShowProductForm(false);
    setFormErrors({});
  };

  return (
    <div
      className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col z-50 font-sans "
      style={{ height: "28rem" }}
    >
      <div className="bg-gradient-to-r from-[#00569e] to-[#004680] text-white px-4 py-3 rounded-t-xl flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#8cc441] rounded-full animate-pulse"></div>
          <span className="font-semibold text-sm">Panda Machine Assistant</span>
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

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 hide-scrollbar">
        <div className="space-y-3">
          {messages.map((msg, idx) => {
            if (!msg?.text || msg.text.trim() === "") return null;

            return (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg?.from === "bot" ? "items-start" : "items-end"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg?.from === "bot"
                      ? "bg-white border border-gray-200 text-[#1f2937] rounded-tl-none shadow-sm"
                      : "bg-gradient-to-r from-[#00569e] to-[#004680] text-white rounded-tr-none shadow"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {msg?.text}
                  </p>
                  <span
                    className={`text-xs mt-1 block ${
                      msg?.from === "bot" ? "text-[#6b7280]" : "text-gray-100"
                    }`}
                  >
                    {formatTime(msg?.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}

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

          {showProductForm && (
            <div className="bg-white border-2 border-[#00569e] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-[#1f2937]">
                  Product Inquiry Form
                </h3>
                <button
                  onClick={() => setShowProductForm(false)}
                  className="text-[#6b7280] hover:text-[#1f2937] text-lg"
                >
                  ×
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2937] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={userDetails.product}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, product: e.target.value })
                  }
                  placeholder="Product name"
                  className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00569e] focus:border-transparent transition-all ${
                    formErrors.product ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.product && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {formErrors.product}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2937] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                  placeholder="Your name"
                  className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00569e] focus:border-transparent transition-all ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2937] mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                  placeholder="Your email"
                  className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00569e] focus:border-transparent transition-all ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2937] mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={userDetails.phone}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, phone: e.target.value })
                  }
                  placeholder="Phone number"
                  className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00569e] focus:border-transparent transition-all ${
                    formErrors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2937] mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={userDetails.message}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, message: e.target.value })
                  }
                  placeholder="Your message"
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00569e] focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowProductForm(false)}
                  className="flex-1 px-3 py-2 border-2 border-gray-300 text-[#1f2937] rounded-lg font-medium hover:bg-gray-100 transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 bg-[#004680] text-white rounded-lg font-medium hover:bg-[#00365f] transition-all text-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}

          {step === 0 &&
            !isTyping &&
            !showProductForm &&
            conversationFlow === "initial" && (
              <div className="space-y-2 mt-2">
                <p className="text-xs text-[#6b7280] font-medium mb-2">
                  Choose an option or type your question:
                </p>
                <button
                  onClick={() => handleSend("Product Inquiry")}
                  className="block w-full text-left bg-white border border-gray-200 px-4 py-3 rounded-xl hover:bg-[#a6c9e9]/10 hover:border-[#00569e] transition-all duration-200 text-sm font-medium text-[#1f2937] shadow-sm hover:shadow"
                >
                  🔧 Product Inquiry
                </button>
                <button
                  onClick={() => handleSend("Contact Info")}
                  className="block w-full text-left bg-white border border-gray-200 px-4 py-3 rounded-xl hover:bg-[#a6c9e9]/10 hover:border-[#00569e] transition-all duration-200 text-sm font-medium text-[#1f2937] shadow-sm hover:shadow"
                >
                  📞 Contact Info
                </button>
              </div>
            )}

          {conversationFlow === "free_chat" &&
            !isTyping &&
            !showProductForm && (
              <div className="text-center mt-2">
                <p className="text-xs text-[#6b7280]">
                  Feel free to ask more questions! 💬
                </p>
              </div>
            )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00569e] focus:border-transparent transition-all text-[#1f2937]"
            disabled={isTyping || showProductForm}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping || showProductForm}
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
