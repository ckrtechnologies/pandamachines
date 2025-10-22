// import React, { useState, useRef, useEffect } from "react";
// import { X, ChevronRight, Package, Search } from "lucide-react";

// const ChatBot = ({ onClose }) => {
//   const [messages, setMessages] = useState([
//     {
//       from: "bot",
//       text: "Hi 👋 Welcome to Panda Machine! Your trusted partner in industrial solutions. How can I assist you today?",
//       timestamp: new Date(),
//     },
//   ]);

//   const [input, setInput] = useState("");
//   const [step, setStep] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const [conversationFlow, setConversationFlow] = useState("initial");
//   const [userDetails, setUserDetails] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//     product: "",
//   });
//   const [currentDetail, setCurrentDetail] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Product selection modal state
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [modalStep, setModalStep] = useState("category"); // category, subCategory, subSubCategory, product
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubCategory, setSelectedSubCategory] = useState(null);
//   const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Data states
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [subSubCategories, setSubSubCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch categories on mount
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
//       );
//       const data = await response.json();
//       setCategories(Array.isArray(data) ? data.reverse() : []);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSubCategories = async (categoryId) => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-categories-by-category/${categoryId}`
//       );
//       const data = await response.json();
//       const subCats = data?.subCategories || data;
//       setSubCategories(Array.isArray(subCats) ? subCats : []);
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//       setSubCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSubSubCategories = async (subCategoryId) => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/sub-sub-categories/subcategory/${subCategoryId}`
//       );
//       const data = await response.json();
//       setSubSubCategories(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching sub-sub-categories:", error);
//       setSubSubCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async (subSubCategoryId) => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/products/products-by-sub-sub-category/${subSubCategoryId}`
//       );
//       const data = await response.json();
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isTyping]);

//   const simulateTyping = (responseMessages, callback) => {
//     setIsTyping(true);
//     let currentIndex = 0;

//     const typeNextMessage = () => {
//       if (currentIndex < responseMessages.length) {
//         setMessages((prev) => [...prev, responseMessages[currentIndex]]);
//         currentIndex++;
//         setTimeout(typeNextMessage, 800);
//       } else {
//         setIsTyping(false);
//         if (callback) callback();
//       }
//     };

//     setTimeout(typeNextMessage, 600);
//   };

//   const handleContactInfo = () => {
//     setIsTyping(true);
//     setTimeout(() => {
//       const botResponses = [
//         {
//           from: "bot",
//           text: "Here are our contact details. We'd love to hear from you! 📞",
//           timestamp: new Date(),
//         },
//         {
//           from: "bot",
//           text: `📍 **Address:**\n784/2647, 3rd Floor, Jagamara\nBhubaneswar - 751030`,
//           timestamp: new Date(),
//         },
//         {
//           from: "bot",
//           text: `📞 **Phone:**\n+91 80717 93049`,
//           timestamp: new Date(),
//         },
//         {
//           from: "bot",
//           text: `✉️ **Email:**\ninfo@pandamachines.com`,
//           timestamp: new Date(),
//         },
//         // {
//         //   from: "bot",
//         //   text: "🕒 **Business Hours:**\n• Monday-Friday: 9 AM - 6 PM\n• Saturday: 9 AM - 6 PM\n• Sunday: Closed",
//         //   timestamp: new Date(),
//         // },
//         {
//           from: "bot",
//           text: "Feel free to reach out for product inquiries, technical support, or business partnerships! 🤝",
//           timestamp: new Date(),
//         },
//       ];
//       simulateTyping(botResponses, () => {
//         setStep(1);
//         setConversationFlow("free_chat");
//       });
//     }, 800);
//   };

//   const openProductSelectionModal = () => {
//     setShowProductModal(true);
//     setModalStep("category");
//     setSelectedCategory(null);
//     setSelectedSubCategory(null);
//     setSelectedSubSubCategory(null);
//     setSelectedProduct(null);
//     setSearchQuery("");
//   };

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);
//     setModalStep("subCategory");
//     fetchSubCategories(category._id);
//   };

//   const handleSubCategorySelect = (subCategory) => {
//     setSelectedSubCategory(subCategory);
//     setModalStep("subSubCategory");
//     fetchSubSubCategories(subCategory._id);
//   };

//   const handleSubSubCategorySelect = (subSubCategory) => {
//     setSelectedSubSubCategory(subSubCategory);
//     setModalStep("product");
//     fetchProducts(subSubCategory._id);
//   };

//   const handleProductSelect = (product) => {
//     setSelectedProduct(product);
//     setShowProductModal(false);
//     startProductInquiry(product);
//   };

//   const startProductInquiry = (product) => {
//     setIsTyping(true);
//     setTimeout(() => {
//       const botResponses = [
//         {
//           from: "bot",
//           text: `Great choice! You've selected "${product.name}". Let's gather your details so our team can provide you with the best assistance. Please enter your name.`,
//           timestamp: new Date(),
//         },
//       ];
//       simulateTyping(botResponses, () => {
//         setConversationFlow("collecting_details");
//         setCurrentDetail("name");
//       });
//     }, 800);
//   };

//   const handleInquiryDetails = (text) => {
//     const updatedDetails = { ...userDetails };

//     switch (currentDetail) {
//       case "name":
//         updatedDetails.name = text;
//         setUserDetails(updatedDetails);
//         setCurrentDetail("phone");
//         setIsTyping(true);
//         setTimeout(() => {
//           const botResponses = [
//             {
//               from: "bot",
//               text: "Thanks! What's your phone number?",
//               timestamp: new Date(),
//             },
//           ];
//           simulateTyping(botResponses);
//         }, 800);
//         break;

//       case "phone":
//         const phoneRegex = /[\d\s\-\(\)\+]{10,}/;
//         if (!phoneRegex.test(text.replace(/\D/g, ""))) {
//           setMessages((prev) => [
//             ...prev,
//             {
//               from: "bot",
//               text: "Please enter a valid phone number (at least 10 digits):",
//               timestamp: new Date(),
//             },
//           ]);
//           return;
//         }
//         updatedDetails.phone = text;
//         setUserDetails(updatedDetails);
//         setCurrentDetail("email");
//         setIsTyping(true);
//         setTimeout(() => {
//           const botResponses = [
//             {
//               from: "bot",
//               text: "Perfect! What's your email address?",
//               timestamp: new Date(),
//             },
//           ];
//           simulateTyping(botResponses);
//         }, 800);
//         break;

//       case "email":
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(text)) {
//           setMessages((prev) => [
//             ...prev,
//             {
//               from: "bot",
//               text: "Please enter a valid email address:",
//               timestamp: new Date(),
//             },
//           ]);
//           return;
//         }
//         updatedDetails.email = text;
//         setUserDetails(updatedDetails);
//         setCurrentDetail("message");
//         setIsTyping(true);
//         setTimeout(() => {
//           const botResponses = [
//             {
//               from: "bot",
//               text: "Almost done! Any specific questions or requirements? (Optional - type 'skip' to skip)",
//               timestamp: new Date(),
//             },
//           ];
//           simulateTyping(botResponses);
//         }, 800);
//         break;

//       case "message":
//         if (text.toLowerCase() !== "skip") {
//           updatedDetails.message = text;
//         } else {
//           updatedDetails.message = "I want to know more about this product.";
//         }
//         updatedDetails.product = selectedProduct._id;
//         setUserDetails(updatedDetails);
//         completeInquiry(updatedDetails);
//         break;

//       default:
//         break;
//     }
//   };

//   const completeInquiry = async (details) => {
//     setIsTyping(true);

//     try {
//       const inquiryData = {
//         name: details.name,
//         email: details.email,
//         phone: details.phone,
//         message: details.message || "I want to know more about this product.",
//         product: details.product,
//       };

//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/chatbot-inquiry/create`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(inquiryData),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to submit inquiry");
//       }

//       setTimeout(() => {
//         const botResponses = [
//           {
//             from: "bot",
//             text: "🎉 Your inquiry has been submitted successfully!",
//             timestamp: new Date(),
//           },
//           {
//             from: "bot",
//             text: `📋 **Inquiry Summary:**\n🔧 **Product:** ${
//               selectedProduct.name
//             }\n👤 **Name:** ${details.name}\n📞 **Phone:** ${
//               details.phone
//             }\n📧 **Email:** ${details.email}${
//               details.message ? `\n💬 **Message:** ${details.message}` : ""
//             }`,
//             timestamp: new Date(),
//           },
//           {
//             from: "bot",
//             text: "Our technical team will contact you shortly with detailed information. We're excited to help you with your industrial needs! 🏭",
//             timestamp: new Date(),
//           },
//           {
//             from: "bot",
//             text: "For immediate assistance:\n📍 Visit: 784/2647, 3rd Floor, Jagamara, Bhubaneswar - 751030\n📞 Call: +91 80717 93049\n✉️ Email: info@pandamachines.com",
//             timestamp: new Date(),
//           },
//         ];
//         simulateTyping(botResponses, () => {
//           setConversationFlow("free_chat");
//           setStep(1);
//           setUserDetails({
//             name: "",
//             email: "",
//             phone: "",
//             message: "",
//             product: "",
//           });
//           setSelectedProduct(null);
//         });
//       }, 800);
//     } catch (error) {
//       console.error("Error submitting inquiry:", error);
//       setTimeout(() => {
//         const errorResponses = [
//           {
//             from: "bot",
//             text: `Oops! There was an issue: ${error.message}. Please try again or contact us directly.`,
//             timestamp: new Date(),
//           },
//           {
//             from: "bot",
//             text: "📞 Call: +91 80717 93049\n✉️ Email: info@pandamachines.com",
//             timestamp: new Date(),
//           },
//         ];
//         simulateTyping(errorResponses, () => {
//           setConversationFlow("free_chat");
//           setStep(1);
//         });
//       }, 800);
//     }
//   };

//   const handleFreeMessage = (userMessage) => {
//     setIsTyping(true);
//     const userMessageLower = userMessage.toLowerCase();

//     setTimeout(() => {
//       let botResponse = "";

//       if (
//         userMessageLower.includes("hour") ||
//         userMessageLower.includes("time") ||
//         userMessageLower.includes("open")
//       ) {
//         botResponse =
//           "Our business hours are:\n• Monday-Friday: 9 AM - 6 PM\n• Saturday: 9 AM - 2 PM\n• Sunday: Closed\n\nYou can visit us anytime during these hours! 🕒";
//       } else if (
//         userMessageLower.includes("price") ||
//         userMessageLower.includes("cost") ||
//         userMessageLower.includes("quote")
//       ) {
//         botResponse =
//           "Our pricing varies based on the product and requirements. For accurate quotes and bulk pricing, please contact our sales team or submit a product inquiry. We offer competitive rates and flexible payment options! 💰";
//       } else if (
//         userMessageLower.includes("warranty") ||
//         userMessageLower.includes("guarantee")
//       ) {
//         botResponse =
//           "We provide comprehensive warranty coverage on all our machines:\n• Standard warranty on parts and labor\n• Extended warranty options available\n• Quick support and maintenance services\n\nFor specific warranty details, please inquire about the particular product! 🛡️";
//       } else if (
//         userMessageLower.includes("delivery") ||
//         userMessageLower.includes("shipping")
//       ) {
//         botResponse =
//           "We offer pan-India delivery services:\n• Safe and secure packaging\n• Professional installation support\n• Timely delivery schedules\n• Tracking available\n\nDelivery timelines depend on your location and product availability. 🚚";
//       } else if (
//         userMessageLower.includes("service") ||
//         userMessageLower.includes("maintenance") ||
//         userMessageLower.includes("support")
//       ) {
//         botResponse =
//           "We provide comprehensive after-sales services:\n• Regular maintenance support\n• Technical troubleshooting\n• Spare parts availability\n• On-site service options\n• Training for operators\n\nOur technical team is always ready to assist! 🔧";
//       } else if (
//         userMessageLower.includes("product") ||
//         userMessageLower.includes("machine") ||
//         userMessageLower.includes("equipment")
//       ) {
//         botResponse =
//           "We offer a wide range of industrial machines and equipment. Would you like to browse our product catalog? Just select 'Product Inquiry' to explore! 🏭";
//       } else if (
//         userMessageLower.includes("thank") ||
//         userMessageLower.includes("thanks")
//       ) {
//         botResponse =
//           "You're welcome! 😊 Is there anything else I can help you with today?";
//       } else if (
//         userMessageLower.includes("hello") ||
//         userMessageLower.includes("hi") ||
//         userMessageLower.includes("hey")
//       ) {
//         botResponse = "Hello again! 👋 How can I assist you further?";
//       } else if (
//         userMessageLower.includes("bye") ||
//         userMessageLower.includes("goodbye")
//       ) {
//         botResponse =
//           "Thanks for reaching out! Have a great day and feel free to contact us anytime! 🏭✨";
//       } else {
//         botResponse =
//           "Thanks for your message! Our team at Panda Machine specializes in industrial solutions. Could you tell me more about what you're looking for? I'm here to help with product inquiries, technical questions, or any other needs!";
//       }

//       const botResponses = [
//         { from: "bot", text: botResponse, timestamp: new Date() },
//       ];

//       if (
//         !userMessageLower.includes("thank") &&
//         !userMessageLower.includes("hello") &&
//         !userMessageLower.includes("hi") &&
//         !userMessageLower.includes("bye")
//       ) {
//         botResponses.push({
//           from: "bot",
//           text: "For immediate assistance:\n📍 784/2647, 3rd Floor, Jagamara, Bhubaneswar - 751030\n📞 +91 80717 93049\n✉️ info@pandamachines.com",
//           timestamp: new Date(),
//         });
//       }

//       simulateTyping(botResponses, () => {
//         setConversationFlow("free_chat");
//         setStep(1);
//       });
//     }, 1000);
//   };

//   const handleSend = (text) => {
//     if (!text.trim()) return;

//     const userMessage = {
//       from: "user",
//       text,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);

//     if (conversationFlow === "collecting_details") {
//       handleInquiryDetails(text);
//     } else if (text === "Contact Info") {
//       handleContactInfo();
//     } else if (text === "Product Inquiry") {
//       openProductSelectionModal();
//     } else {
//       handleFreeMessage(text);
//     }

//     setInput("");
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend(input);
//     }
//   };

//   const formatTime = (date) => {
//     return date?.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const resetChat = () => {
//     setMessages([
//       {
//         from: "bot",
//         text: "Hi 👋 Welcome to Panda Machine! Your trusted partner in industrial solutions. How can I assist you today?",
//         timestamp: new Date(),
//       },
//     ]);
//     setStep(0);
//     setConversationFlow("initial");
//     setInput("");
//     setUserDetails({
//       name: "",
//       email: "",
//       phone: "",
//       message: "",
//       product: "",
//     });
//     setSelectedProduct(null);
//   };

//   const getInputPlaceholder = () => {
//     if (conversationFlow === "collecting_details") {
//       switch (currentDetail) {
//         case "name":
//           return "Enter your full name...";
//         case "email":
//           return "Enter your email...";
//         case "phone":
//           return "Enter your phone number...";
//         case "message":
//           return "Enter your message or type 'skip'...";
//         default:
//           return "Type your response...";
//       }
//     }
//     return "Type your message or question...";
//   };

//   const filteredItems = (items) => {
//     if (!Array.isArray(items)) return [];
//     if (!searchQuery) return items;
//     return items.filter((item) =>
//       item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   const goBack = () => {
//     if (modalStep === "subCategory") {
//       setModalStep("category");
//       setSelectedCategory(null);
//       setSubCategories([]);
//     } else if (modalStep === "subSubCategory") {
//       setModalStep("subCategory");
//       setSelectedSubCategory(null);
//       setSubSubCategories([]);
//     } else if (modalStep === "product") {
//       setModalStep("subSubCategory");
//       setSelectedSubSubCategory(null);
//       setProducts([]);
//     }
//     setSearchQuery("");
//   };

//   return (
//     <>
//       <div className="fixed bottom-20 right-6 w-80 h-[28rem] bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col z-50 font-sans">
//         <div className="bg-gradient-to-r from-[#00569e] to-[#004680] text-white px-4 py-3 rounded-t-xl flex justify-between items-center shadow-md">
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-[#8cc441] rounded-full animate-pulse"></div>
//             <span className="font-semibold text-sm">
//               Panda Machine Assistant
//             </span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <button
//               onClick={resetChat}
//               className="text-white hover:bg-white/20 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 text-sm font-light"
//               title="Start new conversation"
//             >
//               ↺
//             </button>
//             <button
//               onClick={onClose}
//               className="text-white hover:bg-white/20 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 text-lg font-light"
//             >
//               ×
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//           <div className="space-y-3">
//             {messages.map((msg, idx) => {
//               if (!msg?.text || msg.text.trim() === "") return null;

//               return (
//                 <div
//                   key={idx}
//                   className={`flex flex-col ${
//                     msg?.from === "bot" ? "items-start" : "items-end"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
//                       msg?.from === "bot"
//                         ? "bg-white border border-gray-200 text-[#1f2937] rounded-tl-none shadow-sm"
//                         : "bg-gradient-to-r from-[#00569e] to-[#004680] text-white rounded-tr-none shadow"
//                     }`}
//                   >
//                     <p className="text-sm leading-relaxed whitespace-pre-line">
//                       {msg?.text}
//                     </p>
//                     <span
//                       className={`text-xs mt-1 block ${
//                         msg?.from === "bot" ? "text-[#6b7280]" : "text-gray-100"
//                       }`}
//                     >
//                       {formatTime(msg?.timestamp)}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}

//             {isTyping && (
//               <div className="flex items-start space-x-2">
//                 <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     ></div>
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {step === 0 && !isTyping && conversationFlow === "initial" && (
//               <div className="space-y-2 mt-2">
//                 <p className="text-xs text-[#6b7280] font-medium mb-2">
//                   Choose an option or type your question:
//                 </p>
//                 <button
//                   onClick={() => handleSend("Product Inquiry")}
//                   className="block w-full text-left bg-white border border-gray-200 px-4 py-3 rounded-xl hover:bg-[#a6c9e9]/10 hover:border-[#00569e] transition-all duration-200 text-sm font-medium text-[#1f2937] shadow-sm hover:shadow"
//                 >
//                   🔧 Product Inquiry
//                 </button>
//                 <button
//                   onClick={() => handleSend("Contact Info")}
//                   className="block w-full text-left bg-white border border-gray-200 px-4 py-3 rounded-xl hover:bg-[#a6c9e9]/10 hover:border-[#00569e] transition-all duration-200 text-sm font-medium text-[#1f2937] shadow-sm hover:shadow"
//                 >
//                   📞 Contact Info
//                 </button>
//               </div>
//             )}

//             {conversationFlow === "free_chat" && !isTyping && (
//               <div className="text-center mt-2">
//                 <p className="text-xs text-[#6b7280]">
//                   Feel free to ask more questions! 💬
//                 </p>
//               </div>
//             )}
//           </div>
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
//           <div className="flex space-x-2">
//             <input
//               type={
//                 currentDetail === "email"
//                   ? "email"
//                   : currentDetail === "phone"
//                   ? "tel"
//                   : "text"
//               }
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder={getInputPlaceholder()}
//               className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00569e] focus:border-transparent transition-all text-[#1f2937]"
//               disabled={isTyping}
//             />
//             <button
//               onClick={() => handleSend(input)}
//               disabled={!input.trim() || isTyping}
//               className="bg-[#004680] text-white px-4 py-2.5 rounded-lg hover:bg-[#00365f] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium text-sm"
//             >
//               Send
//             </button>
//           </div>
//           <p className="text-xs text-[#6b7280] text-center mt-2">
//             {conversationFlow === "initial"
//               ? "Ask me anything about Panda Machine!"
//               : "We're here to help with all your needs!"}
//           </p>
//         </div>
//       </div>

//       {/* Product Selection Modal */}
//       {showProductModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-[#00569e] to-[#004680] p-6 flex justify-between items-center">
//               <div className="flex items-center space-x-3">
//                 {modalStep !== "category" && (
//                   <button
//                     onClick={goBack}
//                     className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
//                   >
//                     <ChevronRight className="w-5 h-5 rotate-180" />
//                   </button>
//                 )}
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">
//                     {modalStep === "category" && "Select Category"}
//                     {modalStep === "subCategory" && "Select Sub-Category"}
//                     {modalStep === "subSubCategory" && "Select Tier-3 Category"}
//                     {modalStep === "product" && "Select Product"}
//                   </h2>
//                   {(selectedCategory ||
//                     selectedSubCategory ||
//                     selectedSubSubCategory) && (
//                     <p className="text-white/80 text-sm mt-1">
//                       {selectedCategory?.name}
//                       {selectedSubCategory && ` > ${selectedSubCategory.name}`}
//                       {selectedSubSubCategory &&
//                         ` > ${selectedSubSubCategory.name}`}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowProductModal(false)}
//                 className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             {/* Search Bar */}
//             <div className="p-4 border-b border-gray-200 bg-gray-50">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder={`Search ${modalStep}...`}
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00569e] text-sm"
//                 />
//               </div>
//             </div>

//             {/* Modal Content */}
//             <div className="flex-1 overflow-y-auto p-6">
//               {loading ? (
//                 <div className="flex justify-center items-center h-64">
//                   <div className="w-12 h-12 border-4 border-[#a6c9e9] border-t-[#00569e] rounded-full animate-spin"></div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {modalStep === "category" &&
//                     filteredItems(categories).map((category) => (
//                       <button
//                         key={category._id}
//                         onClick={() => handleCategorySelect(category)}
//                         className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#00569e] hover:shadow-lg transition-all duration-300 text-left overflow-hidden"
//                       >
//                         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#a6c9e9]/20 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-300"></div>
//                         <div className="relative z-10">
//                           <div className="w-12 h-12 bg-gradient-to-br from-[#00569e] to-[#004680] rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
//                             <Package className="w-6 h-6 text-white" />
//                           </div>
//                           <h3 className="font-semibold text-[#1f2937] text-lg mb-1 group-hover:text-[#00569e] transition-colors">
//                             {category.name}
//                           </h3>
//                           {category.description && (
//                             <p className="text-sm text-[#6b7280] line-clamp-2">
//                               {category.description}
//                             </p>
//                           )}
//                         </div>
//                         <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-[#00569e] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
//                       </button>
//                     ))}

//                   {modalStep === "subCategory" &&
//                     filteredItems(subCategories).map((subCategory) => (
//                       <button
//                         key={subCategory._id}
//                         onClick={() => handleSubCategorySelect(subCategory)}
//                         className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#00569e] hover:shadow-lg transition-all duration-300 text-left overflow-hidden"
//                       >
//                         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#8cc441]/20 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-300"></div>
//                         <div className="relative z-10">
//                           <div className="w-12 h-12 bg-gradient-to-br from-[#8cc441] to-[#7ab335] rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
//                             <Package className="w-6 h-6 text-white" />
//                           </div>
//                           <h3 className="font-semibold text-[#1f2937] text-lg mb-1 group-hover:text-[#00569e] transition-colors">
//                             {subCategory.name}
//                           </h3>
//                           {subCategory.description && (
//                             <p className="text-sm text-[#6b7280] line-clamp-2">
//                               {subCategory.description}
//                             </p>
//                           )}
//                         </div>
//                         <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-[#00569e] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
//                       </button>
//                     ))}

//                   {modalStep === "subSubCategory" &&
//                     filteredItems(subSubCategories).map((subSubCategory) => (
//                       <button
//                         key={subSubCategory._id}
//                         onClick={() =>
//                           handleSubSubCategorySelect(subSubCategory)
//                         }
//                         className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#00569e] hover:shadow-lg transition-all duration-300 text-left overflow-hidden"
//                       >
//                         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#a6c9e9]/20 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-300"></div>
//                         <div className="relative z-10">
//                           <div className="w-12 h-12 bg-gradient-to-br from-[#004680] to-[#00365f] rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
//                             <Package className="w-6 h-6 text-white" />
//                           </div>
//                           <h3 className="font-semibold text-[#1f2937] text-lg mb-1 group-hover:text-[#00569e] transition-colors">
//                             {subSubCategory.name}
//                           </h3>
//                           {subSubCategory.description && (
//                             <p className="text-sm text-[#6b7280] line-clamp-2">
//                               {subSubCategory.description}
//                             </p>
//                           )}
//                         </div>
//                         <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-[#00569e] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
//                       </button>
//                     ))}

//                   {modalStep === "product" &&
//                     filteredItems(products).map((product) => (
//                       <button
//                         key={product._id}
//                         onClick={() => handleProductSelect(product)}
//                         className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#8cc441] hover:shadow-lg transition-all duration-300 text-left overflow-hidden"
//                       >
//                         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#8cc441]/20 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-300"></div>
//                         <div className="relative z-10">
//                           {product.images && product.images.length > 0 ? (
//                             <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
//                               <img
//                                 src={product.images[0]}
//                                 alt={product.name}
//                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                               />
//                             </div>
//                           ) : (
//                             <div className="w-12 h-12 bg-gradient-to-br from-[#8cc441] to-[#7ab335] rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
//                               <Package className="w-6 h-6 text-white" />
//                             </div>
//                           )}
//                           <h3 className="font-semibold text-[#1f2937] text-lg mb-1 group-hover:text-[#00569e] transition-colors line-clamp-2">
//                             {product.name}
//                           </h3>
//                           {product.description && (
//                             <p className="text-sm text-[#6b7280] line-clamp-2 mb-2">
//                               {product.description}
//                             </p>
//                           )}
//                           {product.brand && (
//                             <div className="inline-block bg-[#a6c9e9]/20 px-2 py-1 rounded text-xs font-medium text-[#00569e]">
//                               {product.brand}
//                             </div>
//                           )}
//                         </div>
//                         <div className="absolute bottom-4 right-4 w-8 h-8 bg-[#8cc441] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
//                           <ChevronRight className="w-5 h-5 text-white" />
//                         </div>
//                       </button>
//                     ))}
//                 </div>
//               )}

//               {!loading &&
//                 ((modalStep === "category" &&
//                   filteredItems(categories).length === 0) ||
//                   (modalStep === "subCategory" &&
//                     filteredItems(subCategories).length === 0) ||
//                   (modalStep === "subSubCategory" &&
//                     filteredItems(subSubCategories).length === 0) ||
//                   (modalStep === "product" &&
//                     filteredItems(products).length === 0)) && (
//                   <div className="flex flex-col items-center justify-center h-64 text-center">
//                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                       <Package className="w-8 h-8 text-gray-400" />
//                     </div>
//                     <p className="text-lg font-semibold text-[#1f2937] mb-2">
//                       No items found
//                     </p>
//                     <p className="text-sm text-[#6b7280]">
//                       {searchQuery
//                         ? `No results for "${searchQuery}". Try a different search.`
//                         : "No items available at the moment."}
//                     </p>
//                   </div>
//                 )}
//             </div>

//             {/* Modal Footer */}
//             <div className="border-t border-gray-200 bg-gray-50 p-4">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-[#6b7280]">
//                   {modalStep === "category" &&
//                     `${filteredItems(categories).length} categories available`}
//                   {modalStep === "subCategory" &&
//                     `${
//                       filteredItems(subCategories).length
//                     } sub-categories available`}
//                   {modalStep === "subSubCategory" &&
//                     `${
//                       filteredItems(subSubCategories).length
//                     } tier-3 categories available`}
//                   {modalStep === "product" &&
//                     `${filteredItems(products).length} products available`}
//                 </div>
//                 <button
//                   onClick={() => setShowProductModal(false)}
//                   className="px-4 py-2 border-2 border-gray-300 text-[#1f2937] rounded-lg font-medium hover:bg-gray-100 transition-all text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatBot;

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
