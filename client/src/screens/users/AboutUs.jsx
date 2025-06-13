import React from "react";
import UserNavbar from "../../components/common/UserNavbar";
import { Home, ChevronRight } from "lucide-react";

const AboutUs = () => {
  return (
    <React.Fragment>
      <UserNavbar />

      {/* Breadcrumb Header */}
      <header className="bg-slate-700 text-white">
        <div className="mx-auto py-4 px-4 md:px-6  xl:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-orange-400">About Us</span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 pt-8">
        <div className="mx-auto px-4 md:px-6 xl:px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
            <div className="w-full lg:w-[60%] order-2 lg:order-1 lg:pr-10">
              <p className="text-sm italic tracking-wide text-orange-500 font-medium mb-2">
                About Us
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide text-gray-900 mb-4 lg:pr-20">
                Engineered to Perform. Delivered with Trust.
              </h2>
              <p className="text-base md:text-lg text-gray-500 font-normal leading-relaxed mb-6">
                At Panda Machines Pvt. Ltd., we are revolutionizing the way
                industries procure machinery by offering a reliable,
                transparent, and efficient e-commerce platform for industrial
                solutions. Specializing in large-scale machinery like packaging
                machines, cap sealing machines, water purification RO plants,
                bottling units, and more, we are your one-stop destination for
                high-performance equipment at competitive prices.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md shadow transition-colors w-full sm:w-auto">
                  Contact Us
                </button>
                <button className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-100 px-6 py-3 rounded-md shadow transition-colors w-full sm:w-auto">
                  Make A Call
                </button>
              </div>
            </div>
            <div className="w-full lg:w-[60%] order-1 lg:order-2 flex gap-2 sm:gap-4">
              <img
                src={require("../../Assets/About-us/AboutUsP-1.png")}
                alt="Machinery"
                className="w-2/3 h-[250px] sm:h-[300px] lg:h-[400px] rounded-bl-[50px] sm:rounded-bl-[70px] rounded-tl-[50px] sm:rounded-tl-[70px] rounded-tr-[50px] sm:rounded-tr-[70px] object-cover shadow-lg"
              />
              <img
                src={require("../../Assets/About-us/AboutUsP-2.png")}
                alt="Bottling"
                className="w-1/3 h-[250px] sm:h-[300px] lg:h-[400px] rounded-br-[50px] sm:rounded-br-[70px] rounded-tr-[50px] sm:rounded-tr-[70px] object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Production to Purification Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="mx-auto px-4 md:px-6 xl:px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
            <div className="w-full lg:w-[60%] flex gap-2 sm:gap-4 order-1">
              <img
                src={require("../../Assets/About-us/AboutUsP-4.png")}
                alt="Machinery"
                className="w-2/3 h-[250px] sm:h-[300px] lg:h-[400px] rounded-bl-[50px] sm:rounded-bl-[70px] object-cover shadow-lg"
              />
              <div className="flex flex-col justify-between w-1/3">
                <img
                  src={require("../../Assets/About-us/AboutUsP-3.png")}
                  alt="Bottling"
                  className="w-full h-[180px] sm:h-[220px] lg:h-[280px] rounded-br-[50px] sm:rounded-br-[70px] rounded-tr-[50px] sm:rounded-tr-[70px] object-cover shadow-lg mb-2 sm:mb-4"
                />
                <img
                  src={require("../../Assets/About-us/AboutUsP-5.png")}
                  alt="Bottling"
                  className="w-full h-[60px] sm:h-[70px] lg:h-[100px] object-cover shadow-lg rounded-md"
                />
              </div>
            </div>
            <div className="w-full lg:w-[60%] order-2 lg:pr-10">
              <p className="text-sm italic tracking-wide text-orange-500 font-medium mb-2">
                About Us
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide text-gray-900 mb-4 lg:pr-18">
                From Production to Purification — We've Got the Machines.
              </h2>
              <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-6">
                Founded with a mission to simplify B2B equipment purchases, we
                bridge the gap between manufacturers and businesses by providing
                direct access to certified machinery suppliers. Our platform is
                designed to serve manufacturers, wholesalers, and production
                units looking for trusted and high-capacity machinery under one
                roof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Order Section */}
      <section className="pt-4 bg-orange-50">
        <div className="mx-auto px-4 md:px-6 xl:px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center bg-orange-100 rounded-lg overflow-hidden">
            <div className="w-full lg:w-[30%] px-6 sm:px-10 py-8 lg:py-0">
              <div className="bg-blue-900 text-white px-4 py-2 rounded-md inline-block text-sm font-medium mb-6">
                Low Delivery Charges
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Want Order In Bulk
              </h2>
              <p className="text-gray-900 tracking-wide mb-8 font-medium">
                If you want to order in bulk quantity, you can contact us! We'll
                Help You.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-bold tracking-wide transition-colors w-full sm:w-auto">
                CONTACT US →
              </button>
            </div>
            <img
              src={require("../../Assets/About-us/AboutUsP-6.png")}
              alt="Production line"
              className="rounded-lg object-cover shadow-lg lg:w-[70%] w-full h-60 sm:h-80"
            />
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="pt-8 bg-orange-50">
        <div className="mx-auto px-4 md:px-6 xl:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 mb-10">
            What We Offer?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            <img
              src={require("../../Assets/About-us/AboutUsP-7.png")}
              alt="Production line"
              className="rounded-lg shadow-lg rounded-tr-[50px] sm:rounded-tr-[70px] rounded-br-[50px] sm:rounded-br-[70px] w-full h-64 sm:h-80 object-cover"
            />
            <div className="space-y-4 order-last lg:order-none">
              <p className="text-gray-500 font-normal text-base sm:text-lg tracking-wide">
                • Comprehensive Product Range: From industrial packaging to
                water treatment systems, we feature machinery that meets global
                quality and compliance standards.
              </p>
              <p className="text-gray-500 font-normal text-base sm:text-lg tracking-wide">
                • Verified Vendors: Every seller on our platform is carefully
                vetted to ensure authenticity, performance, and after-sales
                support.
              </p>
              <p className="text-gray-500 font-normal text-base sm:text-lg tracking-wide">
                • Technical Guidance: Our expert team offers consultations and
                product comparisons to help you choose the right equipment for
                your operational needs.
              </p>
            </div>
            <img
              src={require("../../Assets/About-us/AboutUsP-3.png")}
              alt="Production line"
              className="rounded-lg shadow-lg rounded-tl-[50px] sm:rounded-tl-[70px] rounded-bl-[50px] sm:rounded-bl-[70px] w-full h-64 sm:h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="pt-8 bg-orange-50">
        <div className="mx-auto px-4 md:px-6 xl:px-6 py-1">
          <div className="flex flex-col lg:flex-row items-center bg-white rounded-[60px] sm:rounded-[80px] p-6 sm:p-8 lg:px-12 gap-8">
            <div className="text-center space-y-4 flex-1 order-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Our Vision
              </h2>
              <p className="text-gray-500 text-lg sm:text-xl tracking-wide leading-relaxed px-4 ">
                To become the leading online destination for industrial-grade
                machinery, enabling businesses across sectors to access
                top-quality equipment through a seamless digital platform.
              </p>
            </div>
            <div className="flex-shrink-0 order-2">
              <img
                src={require("../../Assets/About-us/AboutUsP-3.png")}
                className="mx-auto rounded-[40px] sm:rounded-[60px] h-[200px] sm:h-[250px] lg:h-[300px] w-full sm:w-[250px] lg:w-full object-cover shadow-lg"
              />
            </div>
            <div className="text-center flex-1 order-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 text-lg sm:text-xl tracking-wide leading-relaxed px-4 ">
                To connect manufacturers, suppliers, and buyers through our
                reliable and scalable e-commerce system. To provide a
                transparent and efficient buying experience for heavy and large
                machinery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-8 bg-orange-50">
        <div className="mx-auto px-4 md:px-6  xl:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us?
          </h2>
          <div className="space-y-4 max-w-7xl mx-auto">
            <div className="border-2 bg-gray-200 border-orange-400 rounded-lg p-4 text-center">
              <span className="text-orange-500 text-lg sm:text-xl tracking-wide font-medium">
                Water Purification RO Plant
              </span>
            </div>
            <div className="border-2 bg-gray-200 border-orange-400 rounded-lg p-4 text-center">
              <span className="text-orange-500 text-lg sm:text-xl tracking-wide font-medium">
                Nationwide delivery & logistics support
              </span>
            </div>
            <div className="border-2 bg-gray-200 border-orange-400 rounded-lg p-4 text-center">
              <span className="text-orange-500 text-lg sm:text-xl tracking-wide font-medium">
                Easy financing and purchase assistance
              </span>
            </div>
            <div className="border-2 bg-gray-200 border-orange-500 rounded-lg p-4 text-center">
              <span className="text-orange-500 text-lg sm:text-xl tracking-wide font-medium">
                Live technical support and documentation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-12 bg-slate-700 text-white">
        <div className="mx-auto px-4 md:px-6  xl:px-[130px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">We Are Ready To Help</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                For information Contact with our expert members
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-l-md sm:rounded-r-none rounded-r-md text-gray-900 w-full sm:w-64 mb-2 sm:mb-0"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-r-md sm:rounded-l-none rounded-l-md font-medium transition-colors w-full sm:w-auto">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};
export default AboutUs;