import React from "react";
import UserNavbar from "../../components/common/UserNavbar";
import { PhoneCall, Mail, MapPin, Headphones, Home, ChevronRight } from "lucide-react";
import AllUserFooter from "../../components/common/AllUserFooter";

const ContactUs = () => {
  return (
    <React.Fragment>
      <UserNavbar />
      
      {/* Breadcrumb Header */}
      <header className="bg-slate-700 text-white">
        <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-orange-400">Contact Us</span>
          </nav>
        </div>
      </header>
      
      <div className="min-h-screen bg-gray-50 py-4 px-4 md:px-6 xl:px-6">
        <div className="mx-auto">
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Left - Form Section */}
            <div className="bg-white w-full xl:w-2/3 p-4 sm:p-6 rounded-lg shadow-md border">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#00395F] mb-4 sm:mb-6">
                Make Custom Request
              </h2>

              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Subject"
                      className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Type your message"
                    rows={6}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] transition-colors resize-vertical min-h-[120px]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors font-medium w-full sm:w-auto"
                >
                  Get a Quote
                </button>
              </form>
            </div>

            {/* Right - Contact Info Section */}
            <div className="bg-white w-full xl:w-1/3 p-4 rounded-lg shadow-md border h-fit">
              <h2 className="text-lg font-semibold text-[#00395F] mb-4">
                Get In Touch
              </h2>

              <ul className="space-y-3 mb-4">
                <li className="flex items-center gap-3 text-gray-700">
                  <PhoneCall className="text-[#00395F] w-4 h-4" />
                  <span className="text-sm">+00 123 456 789</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <Mail className="text-[#00395F] w-4 h-4" />
                  <span className="text-sm">support@marketpro.com</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <MapPin className="text-[#00395F] w-4 h-4 mt-0.5" />
                  <span className="text-sm">789 Inner Lane, California, USA</span>
                </li>
              </ul>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button className="bg-[#FF8617] hover:bg-orange-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors font-medium text-sm">
                  <Headphones className="w-4 h-4" />
                  <span>Support On Call</span>
                </button>
                <button className="bg-[#FF8617] hover:bg-orange-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors font-medium text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Get Direction</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AllUserFooter />
    </React.Fragment>
  );
};

export default ContactUs;