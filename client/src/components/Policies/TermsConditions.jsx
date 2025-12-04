import React, { useState } from "react";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import AllUserFooter from "../common/AllUserFooter";
import UserNavbar from "../common/UserNavbar";

const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState("general");

  // Company details - customizable
  const companyInfo = {
    name: "Industrial Machinery Corp",
    email: "sales.pandamachines@gmail.com",
    phone: "+91 80717 93049",
    address: "M-44, 2ND FLOOR, BASANTY COLONY, ROURKELA",
    lastUpdated: "Nov 15, 2025",
  };

  const sections = [
    { id: "general", title: "1. General" },
    { id: "website", title: "2. Use of Website" },
    { id: "product", title: "3. Product Information" },
    { id: "orders", title: "4. Orders & Payments" },
    { id: "warranty", title: "5. Warranty & Liability" },
    { id: "property", title: "6. Intellectual Property" },
    { id: "law", title: "7. Governing Law" },
    { id: "contact", title: "8. Contact Us" },
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-lg">
          <div className="px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <div className="bg-white p-3 rounded-full">
                  <ShieldCheckIcon className="h-10 w-10 text-blue-700" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Terms & Conditions
                  </h1>
                  <p className="text-blue-200 mt-1">
                    Last Updated: {companyInfo.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <BuildingLibraryIcon className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">{companyInfo.name}</p>
                    <p className="text-sm text-blue-200">
                      Manufacturer & Exporter of Industrial Machinery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation - Desktop */}
            <aside className="lg:w-1/4">
              <div className="sticky top-8 bg-white rounded-2xl shadow-lg p-6 hidden lg:block">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Sections</h2>
                </div>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="font-medium">{section.title}</span>
                      <ChevronRightIcon
                        className={`h-4 w-4 ${
                          activeSection === section.id
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </nav>

                {/* Quick Contact Info */}
                <div className="mt-10 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-gray-800 mb-3">
                    Quick Contact
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                      <span>{companyInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="h-4 w-4 text-blue-600" />
                      <span>{companyInfo.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="lg:hidden mb-6">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3">
                    Jump to Section
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeSection === section.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {section.title.split(". ")[1]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Welcome to {companyInfo.name}
                      </h2>
                      <p className="text-blue-100 mt-2 max-w-3xl">
                        By accessing or using our website, products, or
                        services, you agree to be bound by the following Terms &
                        Conditions. Please read them carefully.
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <GlobeAltIcon className="h-5 w-5 text-white" />
                        <span className="font-medium text-white">
                          Global Supplier
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Content */}
                <div className="p-6 md:p-8">
                  {/* 1. General */}
                  <section id="general" className="mb-12 scroll-mt-24">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <span className="text-blue-700 font-bold text-lg">
                          1
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          General
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                          <p className="text-gray-700 mb-4">
                            <span className="font-bold">
                              {companyInfo.name}
                            </span>{" "}
                            is a manufacturer, supplier, and exporter of
                            manufacturing, processing, and packaging machinery
                            used across the food & beverage, paper & plastic,
                            chemical, cosmetics, pharmaceutical, and other
                            industrial sectors.
                          </p>
                          <p className="text-gray-700">
                            These Terms apply to all visitors, customers, and
                            users of our website.
                          </p>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-gray-800 mb-2">
                              Manufacturer
                            </h4>
                            <p className="text-sm text-gray-600">
                              State-of-the-art industrial machinery production
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-gray-800 mb-2">
                              Supplier
                            </h4>
                            <p className="text-sm text-gray-600">
                              Global supply chain & distribution network
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-gray-800 mb-2">
                              Exporter
                            </h4>
                            <p className="text-sm text-gray-600">
                              International export to 50+ countries
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 2. Use of Website */}
                  <section id="website" className="mb-12 scroll-mt-24">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <span className="text-blue-700 font-bold text-lg">
                          2
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          Use of Website
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                            <p className="text-gray-700">
                              You agree to use our website only for lawful
                              purposes.
                            </p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                            <p className="text-gray-700">
                              You must not attempt to gain unauthorized access,
                              disrupt functionality, or misuse the site.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 3. Product Information */}
                  <section id="product" className="mb-12 scroll-mt-24">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <span className="text-blue-700 font-bold text-lg">
                          3
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          Product Information
                        </h3>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                          <div className="space-y-4">
                            <p className="text-gray-700">
                              Product specifications, pricing, and availability
                              may change without prior notice.
                            </p>
                            <p className="text-gray-700">
                              Images, diagrams, and descriptions are for
                              reference and may not represent the exact final
                              product.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 4. Orders & Payments */}
                  <section id="orders" className="mb-12 scroll-mt-24">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <span className="text-blue-700 font-bold text-lg">
                          4
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          Orders & Payments
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <p className="text-gray-700 mb-3">
                              All orders are subject to acceptance and
                              confirmation by our company.
                            </p>
                            <p className="text-gray-700 mb-3">
                              Payment terms, including advance payment
                              requirements, will be communicated during order
                              processing.
                            </p>
                            <p className="text-gray-700">
                              We reserve the right to refuse or cancel orders
                              due to errors, fraudulent activity, or
                              unavailability.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 5. Warranty & Liability */}
                  <section id="warranty" className="mb-12 scroll-mt-24">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <span className="text-blue-700 font-bold text-lg">
                          5
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          Warranty & Liability
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <p className="text-gray-700 mb-3">
                              Machinery may include warranties as specified in
                              product documents or purchase agreements.
                            </p>
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                              <p className="text-gray-700 font-medium">
                                We are not liable for losses due to:
                              </p>
                              <ul className="mt-2 space-y-1 text-gray-600">
                                <li className="flex items-center space-x-2">
                                  <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                                  <span>Improper installation</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                                  <span>Misuse</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                                  <span>Negligence</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                                  <span>Unauthorized modifications</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 6. Intellectual Property */}
                  <section id="property" className="mb-12 scroll-mt-24">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <span className="text-blue-700 font-bold text-lg">
                          6
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          Intellectual Property
                        </h3>
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                          <p className="text-gray-700">
                            All content on this website (text, images, logos,
                            and materials) is the property of{" "}
                            <span className="font-bold">
                              {companyInfo.name}
                            </span>{" "}
                            and may not be copied, reproduced, or distributed
                            without permission.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 7. Governing Law */}
                  <section id="law" className="mb-12 scroll-mt-24">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <span className="text-blue-700 font-bold text-lg">
                          7
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          Governing Law
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                          <p className="text-gray-700">
                            These Terms are governed by the laws of{" "}
                            <span className="font-bold">
                              [Your Country/State]
                            </span>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 8. Contact Us */}
                  <section id="contact" className="scroll-mt-24">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <span className="text-blue-700 font-bold text-lg">
                          8
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          Contact Us
                        </h3>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                          <p className="text-gray-700 mb-6">
                            For questions, reach us at:
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h4 className="font-bold text-gray-800">
                                  Email
                                </h4>
                              </div>
                              <p className="text-gray-600">
                                {companyInfo.email}
                              </p>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <PhoneIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h4 className="font-bold text-gray-800">
                                  Phone
                                </h4>
                              </div>
                              <p className="text-gray-600">
                                {companyInfo.phone}
                              </p>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <MapPinIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h4 className="font-bold text-gray-800">
                                  Address
                                </h4>
                              </div>
                              <p className="text-gray-600">
                                {companyInfo.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <AllUserFooter />
    </div>
  );
};

export default TermsConditions;
