import React, { useState } from "react";
import UserNavbar from "../common/UserNavbar";
import AllUserFooter from "../common/AllUserFooter";
import {
  TruckIcon,
  GlobeAltIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  CubeIcon,
  FlagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const ShippingPolicy = () => {
  const [activeSection, setActiveSection] = useState("coverage");
  const [showInternationalInfo, setShowInternationalInfo] = useState(false);

  const companyInfo = {
    name: "Industrial Machinery Corp",
    email: "sales.pandamachines@gmail.com",
    phone: "+91 80717 93049",
    address: "M-44, 2ND FLOOR, BASANTY COLONY, ROURKELA",
    lastUpdated: "Nov 15, 2025",
  };

  const shippingMethods = [
    {
      type: "Domestic Shipping",
      methods: [
        "Road transport",
        "Cargo trucks",
        "Industrial freight services",
      ],
      icon: TruckIcon,
      color: "from-blue-500 to-blue-600",
    },
    {
      type: "International Shipping",
      methods: [
        "Sea freight (LCL/FCL containers)",
        "Air cargo (for smaller equipment)",
        "Third-party freight forwarding",
      ],
      icon: GlobeAltIcon,
      color: "from-green-500 to-green-600",
    },
  ];

  const sections = [
    { id: "coverage", title: "1. Shipping Coverage", icon: MapPinIcon },
    { id: "processing", title: "2. Processing & Dispatch", icon: ClockIcon },
    { id: "methods", title: "3. Shipping Methods", icon: TruckIcon },
    { id: "charges", title: "4. Shipping Charges", icon: CurrencyDollarIcon },
    { id: "packaging", title: "5. Packaging", icon: CubeIcon },
    {
      id: "tracking",
      title: "6. Tracking & Updates",
      icon: DocumentMagnifyingGlassIcon,
    },
    {
      id: "delivery",
      title: "7. Delivery & Inspection",
      icon: ShieldCheckIcon,
    },
    {
      id: "international",
      title: "8. International Shipping",
      icon: GlobeAltIcon,
    },
    { id: "pickup", title: "9. Customer-Pickup Option", icon: UserIcon },
    {
      id: "failures",
      title: "10. Delivery Failures",
      icon: ExclamationTriangleIcon,
    },
    { id: "contact", title: "11. Contact Us", icon: EnvelopeIcon },
  ];

  const packagingMethods = [
    {
      method: "Wooden crates",
      description: "Reinforced construction for heavy machinery",
    },
    {
      method: "Heavy-duty pallets",
      description: "Load-bearing platforms for secure stacking",
    },
    {
      method: "Protective wrapping",
      description: "Water and dust resistant materials",
    },
    {
      method: "Moisture-resistant coverings",
      description: "Protection against humidity during transit",
    },
    {
      method: "Shock-absorbing materials",
      description: "Foam and cushioning for fragile components",
    },
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <React.Fragment>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-lg">
          <div className="px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                  <TruckIcon className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Shipping Policy
                  </h1>
                  <p className="text-blue-200 mt-1">
                    Last Updated: {companyInfo.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Global Shipping Network</p>
                    <p className="text-sm text-blue-200">
                      Domestic & International Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 py-8">
          {/* Introduction Banner */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-xl p-6 shadow-md">
            <div className="flex items-start space-x-4">
              <TruckIcon className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Safe & Reliable Delivery
                </h3>
                <p className="text-gray-700 mb-3">
                  At <span className="font-bold">{companyInfo.name}</span>, we
                  are committed to delivering our machinery and equipment
                  safely, efficiently, and within the agreed timelines. This
                  Shipping Policy outlines how we manage domestic and
                  international shipments for all orders.
                </p>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800 font-bold">
                    🚚 Partnered with certified logistics providers worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-1/4">
              <div className="sticky top-8 bg-white rounded-2xl shadow-lg p-6 hidden lg:block">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Policy Sections
                  </h2>
                </div>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center space-x-3 w-full p-3 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <section.icon
                        className={`h-5 w-5 ${
                          activeSection === section.id
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      />
                      <span className="font-medium text-sm">
                        {section.title}
                      </span>
                      <ChevronRightIcon
                        className={`h-4 w-4 ml-auto ${
                          activeSection === section.id
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </nav>

                {/* Shipping Timeline Preview */}
                <div className="mt-10 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                    Estimated Dispatch Times
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Standard Machinery
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          7-30 days
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Custom Machinery
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          Project Based
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="lg:hidden mb-6">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                    Jump to Section
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`px-3 py-2 text-xs rounded-lg transition-colors flex items-center ${
                          activeSection === section.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <section.icon className="h-3 w-3 mr-1" />
                        {section.title.split(". ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* 1. Shipping Coverage */}
              <section
                id="coverage"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <MapPinIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        1. Shipping Coverage
                      </h2>
                      <p className="text-blue-100">
                        Our global delivery network
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg mr-4">
                          <FlagIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Domestic Shipping
                        </h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        We ship machinery and equipment to all states within the
                        country.
                      </p>
                      <div className="bg-blue-100 p-4 rounded-lg">
                        <p className="text-blue-800 font-medium">
                          ✓ Full nationwide coverage
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-green-100 p-3 rounded-lg mr-4">
                          <GlobeAltIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          International Shipping
                        </h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        International destinations worldwide.
                      </p>
                      <div className="bg-green-100 p-4 rounded-lg">
                        <p className="text-green-800 font-medium">
                          🌍 Global delivery network
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm mt-3">
                        Shipping availability depends on local import rules and
                        regulations.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-3 rounded-full">
                        <span className="text-xl font-bold">50+</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          Countries Served
                        </h3>
                        <p className="text-gray-300">
                          Reliable delivery to manufacturing hubs worldwide
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Processing & Dispatch Time */}
              <section
                id="processing"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ClockIcon className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      2. Processing & Dispatch Time
                    </h2>
                    <p className="text-gray-600">
                      Estimated timelines for order preparation
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* 2.1 Standard Machinery */}
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <span className="text-blue-700 font-bold">2.1</span>
                      </div>
                      <h3 className="font-bold text-gray-800">
                        Standard Machinery
                      </h3>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        7-30
                      </div>
                      <p className="text-gray-700 font-bold">Business Days</p>
                    </div>
                    <p className="text-gray-700 text-center">
                      Dispatch typically within 7–30 business days after order
                      confirmation and payment terms are met.
                    </p>
                  </div>

                  {/* 2.2 Customized Machinery */}
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-2 rounded-lg mr-4">
                        <span className="text-green-700 font-bold">2.2</span>
                      </div>
                      <h3 className="font-bold text-gray-800">
                        Customized Machinery / Plants
                      </h3>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        Project
                      </div>
                      <p className="text-gray-700 font-bold">Based Timeline</p>
                    </div>
                    <p className="text-gray-700 text-center">
                      Dispatch time depends on complexity, production schedule,
                      and engineering work.
                    </p>
                    <div className="mt-4 bg-green-100 p-3 rounded-lg">
                      <p className="text-green-800 text-sm">
                        Estimated delivery timelines are shared during quotation
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2.3 Delays */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-100 text-amber-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                      2.3
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Delays</h3>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <div className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 mb-3">
                          Delays may occur due to:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-700">
                              Production modifications
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-700">
                              Availability of components
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-700">
                              Transport restrictions
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-700">
                              Customs clearance
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 bg-white p-4 rounded-lg">
                          <p className="text-gray-800 font-bold">
                            Any such delays will be communicated in advance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Shipping Methods */}
              <section
                id="methods"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <TruckIcon className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      3. Shipping Methods
                    </h2>
                    <div className="mt-2 bg-blue-50 inline-flex items-center px-4 py-2 rounded-full">
                      <ShieldCheckIcon className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-blue-700 font-medium text-sm">
                        Reliable and certified logistics partners
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {shippingMethods.map((method, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center mb-6">
                        <div
                          className={`bg-gradient-to-r ${method.color} p-3 rounded-lg mr-4`}
                        >
                          <method.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {method.type}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {method.methods.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <p className="text-gray-700 text-center font-medium">
                    Shipping mode depends on product size, weight, and
                    destination.
                  </p>
                </div>
              </section>

              {/* 4. Shipping Charges */}
              <section
                id="charges"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <CurrencyDollarIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        4. Shipping Charges
                      </h2>
                      <p className="text-emerald-100">
                        Transparent pricing structure
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                      Shipping charges are calculated based on:
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CubeIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          Dimensions & Weight
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Size and weight of machinery
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPinIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          Delivery Location
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Distance and destination
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <TruckIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          Transport Mode
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Sea, air, or road freight
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                        <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CubeIcon className="h-8 w-8 text-amber-600" />
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          Packaging Requirements
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Special handling needs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <DocumentTextIcon className="h-8 w-8 text-emerald-600" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          Clear Pricing
                        </h3>
                        <p className="text-gray-700">
                          Shipping rates will be clearly mentioned in quotations
                          and invoices. No hidden charges.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Packaging */}
              <section
                id="packaging"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <CubeIcon className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      5. Packaging
                    </h2>
                    <p className="text-gray-600">
                      Industry-standard protection for your machinery
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                  <p className="text-gray-700 text-center mb-6">
                    We follow industry-standard packaging to ensure safe
                    delivery:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packagingMethods.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center mb-3">
                          <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 className="font-bold text-gray-800">
                            {item.method}
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        Customized Packaging
                      </h4>
                      <p className="text-gray-700">
                        Customized packaging can be arranged upon request (may
                        include additional charges).
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Tracking & Updates */}
              <section
                id="tracking"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <DocumentMagnifyingGlassIcon className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      6. Tracking & Updates
                    </h2>
                    <p className="text-gray-600">
                      Stay informed about your shipment
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <span className="text-blue-700 font-bold">📋</span>
                      </div>
                      <h3 className="font-bold text-gray-800">Documentation</h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Tracking details or shipment documents (such as AWB, BL,
                      LR, etc.) will be provided once the shipment is
                      dispatched.
                    </p>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-blue-800 text-sm font-medium">
                        Documents sent via email within 24 hours of dispatch
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-2 rounded-lg mr-4">
                        <span className="text-green-700 font-bold">📞</span>
                      </div>
                      <h3 className="font-bold text-gray-800">
                        Customer Support
                      </h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Customers may contact us anytime for shipping updates.
                    </p>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        24/7 customer support for urgent shipments
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gray-800 rounded-xl p-6 text-white">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Real-time Tracking
                      </h3>
                      <p className="text-gray-300">
                        Access your shipment status through our portal
                      </p>
                    </div>
                    <button className="mt-4 md:mt-0 bg-white text-gray-800 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                      Track Shipment
                    </button>
                  </div>
                </div>
              </section>

              {/* 7. Delivery & Inspection */}
              <section
                id="delivery"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <ShieldCheckIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        7. Delivery & Inspection
                      </h2>
                      <p className="text-indigo-100">
                        Critical steps for safe receipt of machinery
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  {/* 7.1 Upon Delivery */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 text-indigo-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                        7.1
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Upon Delivery
                      </h3>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                      <p className="text-gray-700 mb-6 text-center font-bold">
                        Customers must:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-lg text-center">
                          <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DocumentMagnifyingGlassIcon className="h-6 w-6 text-red-600" />
                          </div>
                          <h4 className="font-bold text-gray-800 mb-2">
                            Inspect Immediately
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Check machinery upon delivery
                          </p>
                        </div>
                        <div className="bg-white p-5 rounded-lg text-center">
                          <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                          </div>
                          <h4 className="font-bold text-gray-800 mb-2">
                            Check for Damage
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Visible damage, missing components
                          </p>
                        </div>
                        <div className="bg-white p-5 rounded-lg text-center">
                          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <h4 className="font-bold text-gray-800 mb-2">
                            Note Issues
                          </h4>
                          <p className="text-gray-600 text-sm">
                            On delivery receipt before signing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 7.2 Reporting Issues */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 text-indigo-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                        7.2
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Reporting Issues
                      </h3>
                    </div>
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5">
                      <div className="flex items-start space-x-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700 mb-3">
                            Any shipping-related damages or discrepancies must
                            be reported within{" "}
                            <span className="font-bold">48 hours</span> of
                            delivery.
                          </p>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-red-700 font-bold">
                              ⚠️ Failure to report within the timeframe may
                              affect eligibility for claims or support.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. International Shipping & Customs */}
              <section
                id="international"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <GlobeAltIcon className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      8. International Shipping & Customs
                    </h2>
                    <p className="text-gray-600">
                      Important information for cross-border shipments
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setShowInternationalInfo(!showInternationalInfo)
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-4 mb-6 hover:opacity-90 transition-opacity"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      International Shipping Details
                    </span>
                    <span>
                      {showInternationalInfo ? "▲ Hide" : "▼ Show More"}
                    </span>
                  </div>
                </button>

                {showInternationalInfo && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                        <div className="flex items-center mb-3">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                          <h4 className="font-bold text-gray-800">
                            Customer Responsibilities
                          </h4>
                        </div>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start space-x-2">
                            <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
                            <span>
                              Customs duties, import taxes, and border clearance
                              charges
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <div className="h-2 w-2 bg-red-500 rounded-full mt=2"></div>
                            <span>
                              Compliance with the laws of the destination
                              country
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                        <div className="flex items-center mb-3">
                          <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                          <h4 className="font-bold text-gray-800">
                            Our Support
                          </h4>
                        </div>
                        <p className="text-gray-700">
                          Our team can assist with necessary export
                          documentation.
                        </p>
                        <div className="mt-3 bg-white p-3 rounded-lg">
                          <p className="text-green-800 text-sm font-medium">
                            ✓ Export certificates
                          </p>
                          <p className="text-green-800 text-sm font-medium mt-1">
                            ✓ Commercial invoices
                          </p>
                          <p className="text-green-800 text-sm font-medium mt-1">
                            ✓ Packing lists
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                      <h4 className="font-bold text-gray-800 mb-3">
                        Recommended Actions
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                          <span className="text-gray-700">
                            Check customs regulations of your country before
                            ordering
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                          <span className="text-gray-700">
                            Budget for potential duties and taxes (typically
                            5-25% of order value)
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                          <span className="text-gray-700">
                            Keep all shipping documents for customs clearance
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* 9. Customer-Pickup Option */}
              <section
                id="pickup"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <UserIcon className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      9. Customer-Pickup Option
                    </h2>
                    <p className="text-gray-600">
                      Self-collection from our facility
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-6 md:mb-0 md:mr-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Self-Collection Available
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Customers may arrange their own shipping pickup after
                        payment clearance.
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-amber-200">
                        <p className="text-amber-800 font-bold">
                          Pickup requires prior coordination with our logistics
                          team.
                        </p>
                      </div>
                    </div>
                    <button className="bg-amber-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap">
                      Schedule Pickup
                    </button>
                  </div>
                </div>
              </section>

              {/* 10. Delivery Failures */}
              <section
                id="failures"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ExclamationTriangleIcon className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      10. Delivery Failures
                    </h2>
                    <p className="text-gray-600">
                      Common reasons for failed deliveries
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
                  <p className="text-gray-700 text-center mb-6 font-bold">
                    Delivery may fail if:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-red-200 text-center">
                      <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPinIcon className="h-8 w-8 text-red-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        Incorrect Address
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Delivery address is incorrect or incomplete
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-red-200 text-center">
                      <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="h-8 w-8 text-red-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        Unavailability
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Customer is unavailable to receive the shipment
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-red-200 text-center">
                      <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DocumentTextIcon className="h-8 w-8 text-red-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        Import Requirements
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Import requirements are not fulfilled
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-100 border-l-4 border-red-500 rounded-r-xl p-4">
                    <p className="text-red-800 font-bold">
                      In such cases, additional redelivery or storage costs may
                      apply.
                    </p>
                  </div>
                </div>
              </section>

              {/* 11. Contact Us */}
              <section
                id="contact"
                className="scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <EnvelopeIcon className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      11. Contact Us
                    </h2>
                    <p className="text-gray-600">
                      Get in touch with our shipping team
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <p className="text-gray-700 mb-8 text-center">
                    For questions or assistance regarding shipping, contact:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Email</h3>
                      </div>
                      <p className="text-gray-600">{companyInfo.email}</p>
                      <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Send shipping inquiry →
                      </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <PhoneIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Phone</h3>
                      </div>
                      <p className="text-gray-600">{companyInfo.phone}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        Shipping Department: Ext. 201
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <MapPinIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Address</h3>
                      </div>
                      <p className="text-gray-600">{companyInfo.address}</p>
                      <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View on map →
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-3">
                      Shipping Hours
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">
                          Dispatch Hours
                        </p>
                        <p className="text-gray-600 text-sm">
                          Mon-Fri: 8AM-6PM
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">
                          Support Hours
                        </p>
                        <p className="text-gray-600 text-sm">
                          24/7 for urgent shipments
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">
                          Response Time
                        </p>
                        <p className="text-gray-600 text-sm">
                          Within 4 business hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      <AllUserFooter />
    </React.Fragment>
  );
};

export default ShippingPolicy;
