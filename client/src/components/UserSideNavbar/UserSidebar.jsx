import React, { useState } from "react";
import { FiMenu, FiX, FiChevronRight, FiUser } from "react-icons/fi";
import { RiGuideFill } from "react-icons/ri";
import {
  FaFileSignature,
  FaTools,
  FaUserTie,
  FaShippingFast,
  FaTags,
  FaUserCog,
} from "react-icons/fa";
import { HiCheck, HiExclamationCircle } from "react-icons/hi";
import Quotation from "../../screens/users/Quotation";
import useIsMobile from "../../hooks/useIsMobile";

const UserSidebar = ({ isSidebarOpen, toggleSidebar, navigate }) => {
  const [QuotationUpon, setQuotationUpon] = useState(false);
  const isMobile = useIsMobile();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requirement: "",
  });

  const isLoggedIn = !!localStorage.getItem("pm-user-data");

  const mainMenuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about-us" },
    { name: "Blog", path: "/blogs" },
    { name: "Contact", path: "/contact-us" },
    { name: "Categories", path: "/categories" },
  ];

  const userOptions = [
    {
      icon: <RiGuideFill className="text-blue-500" />,
      text: "Online Consultation",
      path: "/consult-guidance",
    },
    {
      icon: <FaFileSignature className="text-green-500" />,
      text: "Request For Quotation",
      onClick: () => {
        isMobile ? navigate(`/user-quotation`) : setQuotationUpon(true);
      },
    },
    {
      icon: <FaUserCog className="text-purple-600" />,
      text: "Join Technician",
      path: "/join-technician",
    },
    {
      icon: <FaUserTie className="text-teal-500" />,
      text: "Become a Seller",
      path: "/become-seller",
    },
    ...(isLoggedIn
      ? [
        {
          icon: <FaShippingFast className="text-purple-500" />,
          text: "Track Order",
          path: "/user-orders",
        },
      ]
      : []),
    {
      icon: <FaTags className="text-yellow-500" />,
      text: "Offers",
      path: "/offers",
    },
  ];

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone.trim()) {
      showToastMessage("Phone number is required!");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiData = {
        phone: formData.phone.trim(),
      };
      if (formData.name.trim()) {
        apiData.name = formData.name.trim();
      }
      if (formData.email.trim()) {
        apiData.email = formData.email.trim();
      }
      if (formData.requirement.trim()) {
        apiData.requirement = formData.requirement.trim();
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/inquiry/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      setShowSuccess(true);
      setFormData({ name: "", email: "", phone: "", requirement: "" });

      setTimeout(() => {
        setShowSuccess(false);
        setShowInquiryForm(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      showToastMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for Hire technician click
  const handleHireTechnician = () => {
    setShowInquiryForm(true);
  };

  // Handler to go back to main menu
  const handleBackToMenu = () => {
    setShowInquiryForm(false);
    setShowSuccess(false);
    setFormData({ name: "", email: "", phone: "", requirement: "" });
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[999] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="px-4 py-2 flex justify-between items-center border-b border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-gray-900 tracking-wide flex items-center gap-2">
            <span className="bg-primaryColor text-white p-1 text-sm rounded-lg">
              <FiMenu />
            </span>
            {showInquiryForm ? "Hire Technician" : "Menu"}
          </h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
            aria-label="Close sidebar"
          >
            <FiX className="text-gray-600 hover:text-red-500 text-lg transition-colors" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)] relative">
          {showInquiryForm ? (
            <>
              {/* Back button */}
              <div className="px-4 py-2 border-b border-gray-100">
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-primaryColor transition-colors"
                >
                  <FiChevronRight className="rotate-180" />
                  <span>Back to Menu</span>
                </button>
              </div>

              {/* Inquiry Form */}
              <div className="relative p-4">
                {showSuccess && (
                  <div className="absolute inset-0 bg-white rounded-xl flex flex-col items-center justify-center z-10">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <HiCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600 text-center px-4 text-sm">
                      Your inquiry has been submitted successfully. You'll receive a
                      call from our team soon.
                    </p>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <p className="text-gray-600 text-xs">
                      We'll get back to you shortly
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-[#25d366] transition-colors duration-200 outline-none"
                        placeholder="Enter your full name (optional)"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-[#25d366] transition-colors duration-200 outline-none"
                        placeholder="Enter your email address (optional)"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-medium text-gray-700 mb-1"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-[#25d366] transition-colors duration-200 outline-none"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="requirement"
                        className="block text-xs font-medium text-gray-700 mb-1"
                      >
                        Write Your Requirement
                      </label>
                      <textarea
                        id="requirement"
                        name="requirement"
                        value={formData.requirement}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-[#25d366] transition-colors duration-200 outline-none resize-none"
                        placeholder="Enter your requirement (optional)"
                        rows="3"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleBackToMenu}
                        className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-[#25d366] to-[#20ba5a] hover:from-[#25d366] hover:to-[#20ba5a] text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin -ml-1 mr-2 h-3 w-3 text-white border-2 border-white border-t-transparent rounded-full"></div>
                            Submitting...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : (
            /* Main Menu Content */
            <>
              <nav className="px-4 py-2 flex flex-col gap-1">
                {mainMenuItems.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-1.5 cursor-pointer rounded-lg hover:bg-primaryColor/10 hover:text-primaryColor transition-all flex items-center gap-3 group"
                    onClick={() => {
                      toggleSidebar();
                      navigate(item.path);
                    }}
                  >
                    <span className="text-primaryColor opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiChevronRight size={14} />
                    </span>
                    <span className="text-md font-medium text-gray-700 group-hover:font-semibold">
                      {item.name}
                    </span>
                  </div>
                ))}
              </nav>

              <div className="relative my-2 h-px mx-5 bg-gray-200"></div>

              <div className="px-5 py-3">
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 tracking-wider uppercase flex items-center gap-2">
                  <FiUser className="text-gray-700" />
                  <span>User Options</span>
                </div>

                <div className="mt-2 space-y-1">
                  {userOptions.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (option.onClick) {
                          option.onClick();
                          toggleSidebar();
                        } else if (option.path) {
                          navigate(option.path);
                          toggleSidebar();
                        }
                      }}
                      className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-3 cursor-pointer"
                    >
                      <span className="p-2 bg-white rounded-lg shadow-sm">
                        {option.icon}
                      </span>
                      <span className="font-medium text-gray-700">
                        {option.text}
                      </span>
                      <span className="ml-auto text-gray-400">
                        <FiChevronRight />
                      </span>
                    </div>
                  ))}

                  {/* Hire technician option */}
                  <div
                    onClick={handleHireTechnician}
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-3 cursor-pointer"
                  >
                    <span className="p-2 bg-white rounded-lg shadow-sm">
                      <FaTools className="text-orange-500" />
                    </span>
                    <span className="font-medium text-gray-700">
                      Hire technician
                    </span>
                    <span className="ml-auto text-gray-400">
                      <FiChevronRight />
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Toast notification */}
          {showToast && (
            <div className="absolute bottom-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
              <div className="flex items-center">
                <HiExclamationCircle className="w-4 h-4 mr-2" />
                {toastMessage}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quotation modal - this still opens as a modal */}
      {QuotationUpon && <Quotation onClose={() => setQuotationUpon(false)} />}
    </>
  );
};

export default UserSidebar;




// import React, { useState } from "react";
// import { FiMenu, FiX, FiChevronRight, FiUser } from "react-icons/fi";
// import { RiGuideFill } from "react-icons/ri";
// import {
//   FaFileSignature,
//   FaTools,
//   FaUserTie,
//   FaShippingFast,
//   FaTags,
//   FaUserCog,
// } from "react-icons/fa";
// import Quotation from "../../screens/users/Quotation";

// const UserSidebar = ({ isSidebarOpen, toggleSidebar, navigate }) => {
//   const [QuotationUpon, setQuotationUpon] = useState(false);
//   const isLoggedIn = !!localStorage.getItem("pm-user-data");
//   const mainMenuItems = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about-us" },
//     { name: "Blog", path: "/blogs" },
//     { name: "Contact", path: "/contact-us" },
//     { name: "Categories", path: "/categories" },
//   ];

//   const userOptions = [
//     {
//       icon: <RiGuideFill className="text-blue-500" />,
//       text: "Online Consultation",
//       path: "/consult-guidance",
//     },
//     {
//       icon: <FaFileSignature className="text-green-500" />,
//       text: "Request For Quotation",
//       onClick: () => setQuotationUpon(true),
//     },
//     {
//       icon: <FaUserCog className="text-purple-600" />, // ✅ Updated icon + color
//       text: "Join Technician",
//       path: "/join-technician",
//     },
//     {
//       icon: <FaUserTie className="text-teal-500" />,
//       text: "Become a Seller",
//       path: "/become-seller",
//     },
//     ...(isLoggedIn
//       ? [
//           {
//             icon: <FaShippingFast className="text-purple-500" />,
//             text: "Track Order",
//             path: "/user-orders",
//           },
//         ]
//       : []),
//     {
//       icon: <FaTags className="text-yellow-500" />,
//       text: "Offers",
//       path: "/offers",
//     },
//   ];

//   return (
//     <>
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
//           onClick={toggleSidebar}
//         ></div>
//       )}

//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[999] transform transition-transform duration-300 ease-in-out ${
//           isSidebarOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="px-4 py-2 flex justify-between items-center border-b border-gray-100 bg-white">
//           <h2 className="text-xl font-bold text-gray-900 tracking-wide flex items-center gap-2">
//             <span className="bg-primaryColor text-white p-1 text-sm rounded-lg">
//               <FiMenu />
//             </span>
//             Menu
//           </h2>
//           <button
//             onClick={toggleSidebar}
//             className="p-2 rounded-full hover:bg-gray-100 transition-all"
//             aria-label="Close sidebar"
//           >
//             <FiX className="text-gray-600 hover:text-red-500 text-lg transition-colors" />
//           </button>
//         </div>

//         <div className="overflow-y-auto h-[calc(100%-60px)]">
//           <nav className="px-4 py-2 flex flex-col gap-1">
//             {mainMenuItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="px-4 py-1.5 cursor-pointer rounded-lg hover:bg-primaryColor/10 hover:text-primaryColor transition-all flex items-center gap-3 group"
//                 onClick={() => {
//                   toggleSidebar();
//                   navigate(item.path);
//                 }}
//               >
//                 <span className="text-primaryColor opacity-0 group-hover:opacity-100 transition-opacity">
//                   <FiChevronRight size={14} />
//                 </span>
//                 <span className="text-md font-medium text-gray-700 group-hover:font-semibold">
//                   {item.name}
//                 </span>
//               </div>
//             ))}
//           </nav>

//           <div className="relative my-2 h-px mx-5 bg-gray-200"></div>

//           <div className="px-5 py-3">
//             <div className="px-3 py-1 text-xs font-semibold text-gray-500 tracking-wider uppercase flex items-center gap-2">
//               <FiUser className="text-gray-700" />
//               <span>User Options</span>
//             </div>

//             <div className="mt-2 space-y-1">
//               {userOptions.map((option, index) => (
//                 <div
//                   key={index}
//                   onClick={() => {
//                     if (option.onClick) {
//                       option.onClick();
//                       toggleSidebar();
//                     } else if (option.path) {
//                       navigate(option.path);
//                       toggleSidebar();
//                     }
//                   }}
//                   className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-3 cursor-pointer"
//                 >
//                   <span className="p-2 bg-white rounded-lg shadow-sm">
//                     {option.icon}
//                   </span>
//                   <span className="font-medium text-gray-700">
//                     {option.text}
//                   </span>
//                   <span className="ml-auto text-gray-400">
//                     <FiChevronRight />
//                   </span>
//                 </div>
//               ))}

//               <div className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-3 cursor-pointer">
//                 <span className="p-2 bg-white rounded-lg shadow-sm">
//                   <FaTools className="text-orange-500" />
//                 </span>
//                 <span className="font-medium text-gray-700">
//                   Hire technician
//                 </span>
//                 <span className="ml-auto text-gray-400">
//                   <FiChevronRight />
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {QuotationUpon && <Quotation onClose={() => setQuotationUpon(false)} />}
//     </>
//   );
// };

// export default UserSidebar;
