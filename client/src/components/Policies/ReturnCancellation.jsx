import React, { useState } from "react";
import UserNavbar from "../common/UserNavbar";
import AllUserFooter from "../common/AllUserFooter";
import {
  ArrowUturnLeftIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TruckIcon,
  WrenchIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CogIcon,
  CubeIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const ReturnCancellation = () => {
  const [activeSection, setActiveSection] = useState("cancellation");
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const companyInfo = {
    name: "Industrial Machinery Corp",
    email: "returns@industrial-machinery.com",
    phone: "+91 80717 93049",
    address: "M-44, 2ND FLOOR, BASANTY COLONY, ROURKELA",
    lastUpdated: "Nov 15, 2025",
  };

  const sections = [
    {
      id: "cancellation",
      title: "1. Order Cancellation Policy",
      icon: XCircleIcon,
    },
    { id: "return", title: "2. Return Policy", icon: ArrowUturnLeftIcon },
    { id: "replacement", title: "3. Replacement & Repair", icon: WrenchIcon },
    { id: "refund", title: "4. Refund Policy", icon: CurrencyDollarIcon },
    { id: "shipping", title: "5. Shipping & Logistics", icon: TruckIcon },
    {
      id: "nonreturnable",
      title: "6. Non-Returnable Items",
      icon: ExclamationCircleIcon,
    },
    {
      id: "inspection",
      title: "7. Inspection & Verification",
      icon: DocumentMagnifyingGlassIcon,
    },
    { id: "contact", title: "8. Contact Us", icon: EnvelopeIcon },
  ];

  const nonReturnableItems = [
    "Customized machinery",
    "Special-purpose equipment",
    "Machinery manufactured on order",
    "Spare parts procured specially for a customer",
    "Machinery used, installed, or altered after delivery",
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
        <header className="bg-gradient-to-r from-red-900 to-orange-800 text-white shadow-lg">
          <div className="px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                  <ArrowUturnLeftIcon className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Return & Cancellation Policy
                  </h1>
                  <p className="text-orange-200 mt-1">
                    Last Updated: {companyInfo.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Important Notice</p>
                    <p className="text-sm text-orange-200">
                      Custom Industrial Machinery Policies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 py-8">
          {/* Disclaimer Banner */}
          {showDisclaimer && (
            <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-xl p-6 shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Important Notice
                    </h3>
                    <p className="text-gray-700 mb-3">
                      At <span className="font-bold">{companyInfo.name}</span>,
                      we strive to provide high-quality machinery, equipment,
                      and industrial solutions. Due to the specialized and
                      customized nature of our products, our return and
                      cancellation processes follow strict guidelines.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <p className="text-gray-800 font-bold">
                        ⚠️ Please read the policy carefully before placing an
                        order.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-1/4">
              <div className="sticky top-8 bg-white rounded-2xl shadow-lg p-6 hidden lg:block">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                  <DocumentTextIcon className="h-6 w-6 text-red-600" />
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
                          ? "bg-red-50 text-red-700 border-l-4 border-red-600"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <section.icon
                        className={`h-5 w-5 ${
                          activeSection === section.id
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      />
                      <span className="font-medium text-sm">
                        {section.title}
                      </span>
                      <ChevronRightIcon
                        className={`h-4 w-4 ml-auto ${
                          activeSection === section.id
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </nav>

                {/* Quick Policy Summary */}
                <div className="mt-10 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                    Key Points
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <ClockIcon className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        48-hour cancellation window
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <ExclamationCircleIcon className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        Custom machinery: non-cancelable
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CubeIcon className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        7-day return window
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="lg:hidden mb-6">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-red-600 mr-2" />
                    Jump to Section
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`px-3 py-2 text-xs rounded-lg transition-colors flex items-center ${
                          activeSection === section.id
                            ? "bg-red-600 text-white"
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
              {/* 1. Order Cancellation Policy */}
              <section
                id="cancellation"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <XCircleIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        1. Order Cancellation Policy
                      </h2>
                      <p className="text-orange-100">
                        Guidelines for canceling your orders
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  {/* 1.1 Standard Machinery */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 text-red-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                        1.1
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Standard Machinery
                      </h3>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                      <div className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700">
                            Customers may request cancellation of standard
                            equipment orders{" "}
                            <span className="font-bold">within 48 hours</span>{" "}
                            of purchase, provided production has not yet
                            started.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1.2 Customized Machinery */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 text-red-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                        1.2
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Customized Machinery & Plants
                      </h3>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                      <div className="flex items-start space-x-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700 mb-3">
                            Orders involving customization, design modification,
                            or special manufacturing requirements{" "}
                            <span className="font-bold">
                              cannot be canceled
                            </span>{" "}
                            once:
                          </p>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start space-x-2">
                              <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
                              <span>
                                Engineering or design work has begun, or
                              </span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
                              <span>Production has started, or</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
                              <span>
                                Components have been procured specifically for
                                the order.
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1.3 Cancellation Charges */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 text-red-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                        1.3
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Cancellation Charges
                      </h3>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                      <p className="text-gray-700 mb-3">
                        If a cancellation request is approved:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start space-x-2">
                          <div className="h-2 w-2 bg-amber-500 rounded-full mt-2"></div>
                          <span>
                            A cancellation fee may apply to cover
                            administrative, design, or material costs already
                            incurred.
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="h-2 w-2 bg-amber-500 rounded-full mt=2"></div>
                          <span>
                            Refunds for eligible cancellations will be processed
                            after deducting applicable charges.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 1.4 How to Request Cancellation */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 text-red-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                        1.4
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        How to Request Cancellation
                      </h3>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <p className="text-gray-700 mb-2">
                            Email your cancellation request to:
                          </p>
                          <div className="bg-white p-3 rounded-lg inline-block">
                            <p className="font-bold text-gray-800">
                              {companyInfo.email}
                            </p>
                          </div>
                          <p className="text-gray-700 mt-3">
                            Include: Order ID, purchase date, and reason for
                            cancellation.
                          </p>
                        </div>
                        <button className="mt-4 md:mt-0 bg-red-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
                          Send Cancellation Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Return Policy */}
              <section
                id="return"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <ArrowUturnLeftIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        2. Return Policy
                      </h2>
                      <p className="text-orange-100">
                        Conditions for returning industrial machinery
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5 mb-8">
                    <div className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700">
                          As industrial machinery is custom-built, heavy, and
                          often made to order, returns are generally{" "}
                          <span className="font-bold">not accepted</span> after
                          delivery, installation, or use.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                      Returns may be considered only under these conditions:
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 2.1 Wrong Product */}
                      <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-200">
                        <div className="flex items-center mb-4">
                          <div className="bg-blue-100 p-2 rounded-lg mr-4">
                            <span className="text-blue-700 font-bold">2.1</span>
                          </div>
                          <h4 className="font-bold text-gray-800">
                            Wrong Product Delivered
                          </h4>
                        </div>
                        <p className="text-gray-700">
                          If the machinery delivered does not match the
                          confirmed order or approved specifications.
                        </p>
                        <div className="mt-4 bg-blue-100 p-3 rounded-lg">
                          <p className="text-blue-800 text-sm font-medium">
                            Must be reported within 24 hours of delivery
                          </p>
                        </div>
                      </div>

                      {/* 2.2 Manufacturing Defects */}
                      <div className="bg-gradient-to-br from-red-50 to-white p-5 rounded-xl border border-red-200">
                        <div className="flex items-center mb-4">
                          <div className="bg-red-100 p-2 rounded-lg mr-4">
                            <span className="text-red-700 font-bold">2.2</span>
                          </div>
                          <h4 className="font-bold text-gray-800">
                            Manufacturing Defects
                          </h4>
                        </div>
                        <p className="text-gray-700">
                          If a major manufacturing defect is identified and
                          confirmed by our technical inspection team.
                        </p>
                        <div className="mt-4 bg-red-100 p-3 rounded-lg">
                          <p className="text-red-800 text-sm font-medium">
                            Subject to technical verification
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2.3 Eligibility Conditions */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-orange-100 text-orange-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                        2.3
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Eligibility Conditions
                      </h3>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
                      <p className="text-gray-700 mb-4 text-center font-medium">
                        To qualify for a return, all conditions must be met:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ClockIcon className="h-8 w-8 text-orange-600" />
                          </div>
                          <h4 className="font-bold text-gray-800 mb-2">
                            Time Limit
                          </h4>
                          <p className="text-gray-600">
                            Request within{" "}
                            <span className="font-bold">7 days</span> of
                            delivery
                          </p>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CubeIcon className="h-8 w-8 text-orange-600" />
                          </div>
                          <h4 className="font-bold text-gray-800 mb-2">
                            Condition
                          </h4>
                          <p className="text-gray-600">
                            Equipment must be{" "}
                            <span className="font-bold">unused</span> and in
                            original condition
                          </p>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DocumentTextIcon className="h-8 w-8 text-orange-600" />
                          </div>
                          <h4 className="font-bold text-gray-800 mb-2">
                            Documentation
                          </h4>
                          <p className="text-gray-600">
                            All accessories, manuals, and packaging must be
                            intact
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Replacement & Repair */}
              <section
                id="replacement"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-red-100 p-3 rounded-full">
                    <WrenchIcon className="h-7 w-7 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      3. Replacement & Repair
                    </h2>
                    <p className="text-gray-600">
                      Our solutions for defective equipment
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* 3.1 Replacement */}
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-2 rounded-lg mr-4">
                        <span className="text-green-700 font-bold">3.1</span>
                      </div>
                      <h3 className="font-bold text-gray-800">Replacement</h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      We may replace the defective machine or component with a
                      new one as per warranty terms.
                    </p>
                    <div className="bg-green-100 p-4 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        ✓ Covered under standard warranty conditions
                      </p>
                    </div>
                  </div>

                  {/* 3.2 Repair */}
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <span className="text-blue-700 font-bold">3.2</span>
                      </div>
                      <h3 className="font-bold text-gray-800">Repair</h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      In many cases, on-site repair or replacement of defected
                      parts will be carried out as per warranty conditions.
                    </p>
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <p className="text-blue-800 text-sm font-medium">
                        🛠️ On-site service available for eligible cases
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3.3 Non-Replaceable Items */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-red-100 text-red-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                      3.3
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Non-Replaceable Items
                    </h3>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700">
                          Certain components or custom parts may not be eligible
                          for replacement due to third-party manufacturing
                          limitations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Refund Policy */}
              <section
                id="refund"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <CurrencyDollarIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        4. Refund Policy
                      </h2>
                      <p className="text-emerald-100">
                        Our refund process and timelines
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  {/* 4.1 Approved Refunds */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-emerald-100 text-emerald-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                        4.1
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Approved Refunds
                      </h3>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                      <p className="text-gray-700 mb-3">
                        Refunds will be issued only for:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg text-center">
                          <div className="text-emerald-600 font-bold text-lg mb-2">
                            ✓
                          </div>
                          <p className="text-gray-700">
                            Eligible cancellations
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg text-center">
                          <div className="text-emerald-600 font-bold text-lg mb-2">
                            ✓
                          </div>
                          <p className="text-gray-700">
                            Approved return requests
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg text-center">
                          <div className="text-emerald-600 font-bold text-lg mb-2">
                            ✓
                          </div>
                          <p className="text-gray-700">
                            Excess or duplicate payments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 4.2 Refund Timeline */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="bg-emerald-100 text-emerald-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                          4.2
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Refund Timeline
                        </h3>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-3">
                          7–14
                        </div>
                        <p className="text-gray-700 font-bold">Business Days</p>
                        <p className="text-gray-600 text-sm mt-2">
                          Refunds are processed within 7–14 business days after
                          approval.
                        </p>
                      </div>
                    </div>

                    {/* 4.3 Deductions */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="bg-emerald-100 text-emerald-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                          4.3
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Deductions
                        </h3>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <p className="text-gray-700 mb-3">
                          Refund amounts may include deductions for:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                            <span>Processing fees</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                            <span>Production or design costs</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                            <span>
                              Shipping, logistics, or inspection charges
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 4.4 Mode of Refund */}
                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-emerald-100 text-emerald-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                        4.4
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Mode of Refund
                      </h3>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <p className="text-gray-700">
                        Refunds will be issued using the{" "}
                        <span className="font-bold">same payment method</span>{" "}
                        used during the purchase unless otherwise agreed.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Shipping & Logistics */}
              <section
                id="shipping"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-red-100 p-3 rounded-full">
                    <TruckIcon className="h-7 w-7 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      5. Shipping & Logistics for Returns
                    </h2>
                    <p className="text-gray-600">
                      Important information about return shipping
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 5.1 Return Shipping */}
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <span className="text-blue-700 font-bold">5.1</span>
                      </div>
                      <h3 className="font-bold text-gray-800">
                        Return Shipping
                      </h3>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                        <span>
                          Customers are responsible for return shipping unless
                          the error is from our end.
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                        <span>
                          Machinery must be shipped using authorized and insured
                          logistics providers.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* 5.2 Damage During Transit */}
                  <div className="bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 p-2 rounded-lg mr-4">
                        <span className="text-red-700 font-bold">5.2</span>
                      </div>
                      <h3 className="font-bold text-gray-800">
                        Damage During Return Transit
                      </h3>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">
                          We are{" "}
                          <span className="font-bold">not responsible</span> for
                          damage caused during return transportation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Non-Returnable Items */}
              <section
                id="nonreturnable"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-700 to-rose-700 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <ExclamationCircleIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        6. Non-Returnable & Non-Cancellable Items
                      </h2>
                      <p className="text-rose-100">
                        Items that cannot be returned or canceled
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
                    <p className="text-gray-700 text-center font-bold text-lg">
                      The following items cannot be returned or canceled under
                      any circumstances:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nonReturnableItems.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <XCircleIcon className="h-5 w-5 text-red-600" />
                          </div>
                          <p className="text-gray-700 font-medium">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl p-6 text-white">
                    <div className="flex items-center space-x-4">
                      <ShieldCheckIcon className="h-8 w-8" />
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          Important Note
                        </h3>
                        <p>
                          Due to the custom nature of industrial machinery,
                          please verify all specifications before ordering.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 7. Inspection & Verification */}
              <section
                id="inspection"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-red-100 p-3 rounded-full">
                    <DocumentMagnifyingGlassIcon className="h-7 w-7 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      7. Inspection & Verification
                    </h2>
                    <p className="text-gray-600">
                      Our quality verification process
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                  <p className="text-gray-700 text-center mb-8">
                    All returned equipment undergoes a comprehensive
                    verification process before any action is taken:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CogIcon className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Technical Inspection
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Detailed examination by engineers
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <WrenchIcon className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Functional Testing
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Performance and operation tests
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircleIcon className="h-10 w-10 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Quality Verification
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Compliance with specifications
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 bg-white p-5 rounded-lg border border-gray-200">
                    <p className="text-gray-700 text-center font-bold">
                      Only after successful evaluation will a refund or
                      replacement be processed.
                    </p>
                  </div>
                </div>
              </section>

              {/* 8. Contact Us */}
              <section
                id="contact"
                className="scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-red-100 p-3 rounded-full">
                    <EnvelopeIcon className="h-7 w-7 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      8. Contact Us
                    </h2>
                    <p className="text-gray-600">
                      Get in touch with our returns team
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                  <p className="text-gray-700 mb-8 text-center">
                    For any cancellations, return requests, or policy-related
                    questions, contact:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <EnvelopeIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Email</h3>
                      </div>
                      <p className="text-gray-600">{companyInfo.email}</p>
                      <button className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium">
                        Send returns inquiry →
                      </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <PhoneIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Phone</h3>
                      </div>
                      <p className="text-gray-600">{companyInfo.phone}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        Returns Department: Ext. 102
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <MapPinIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Address</h3>
                      </div>
                      <p className="text-gray-600">{companyInfo.address}</p>
                      <button className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium">
                        Get directions →
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-3">
                      Required Information for Requests
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">
                          Order ID
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">
                          Invoice Number
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">
                          Purchase Date
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">
                          Machine Serial No.
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

export default ReturnCancellation;
