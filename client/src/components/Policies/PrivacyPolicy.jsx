import React, { useState } from "react";
import {
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentTextIcon,
  ChartBarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  ServerIcon,
  UserGroupIcon,
  TrashIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import UserNavbar from "../common/UserNavbar";
import AllUserFooter from "../common/AllUserFooter";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("collect");
  const [showDataExample, setShowDataExample] = useState(false);

  const companyInfo = {
    name: "Industrial Machinery Corp",
    email: "sales.pandamachines@gmail.com",
    phone: "+91 80717 93049",
    address: "M-44, 2ND FLOOR, BASANTY COLONY, ROURKELA",
    lastUpdated: "Nov 15, 2025",
  };

  const sections = [
    { id: "collect", title: "1. Information We Collect", icon: ChartBarIcon },
    { id: "use", title: "2. How We Use Your Information", icon: CogIcon },
    {
      id: "cookies",
      title: "3. Cookies & Tracking Technologies",
      icon: LockClosedIcon,
    },
    {
      id: "share",
      title: "4. How We Share Your Information",
      icon: UserGroupIcon,
    },
    {
      id: "protection",
      title: "5. Data Protection & Security",
      icon: ShieldCheckIcon,
    },
    { id: "retention", title: "6. Data Retention", icon: ServerIcon },
    { id: "rights", title: "7. Your Privacy Rights", icon: EyeIcon },
    { id: "links", title: "8. Third-Party Links", icon: LinkIcon },
    {
      id: "international",
      title: "9. International Users",
      icon: GlobeAltIcon,
    },
    {
      id: "changes",
      title: "10. Changes to This Policy",
      icon: ExclamationTriangleIcon,
    },
    { id: "contact", title: "11. Contact Us", icon: EnvelopeIcon },
  ];

  const dataTypes = [
    {
      category: "Personal Information",
      items: [
        "Full name",
        "Company name",
        "Email address",
        "Phone number",
        "Billing/shipping address",
        "Job title",
        "Communication preferences",
      ],
      color: "from-blue-500 to-blue-600",
    },
    {
      category: "Business Information",
      items: [
        "Product inquiries",
        "Purchase orders",
        "Quotations",
        "Payment info",
        "Machine specifications",
      ],
      color: "from-purple-500 to-purple-600",
    },
    {
      category: "Technical Data",
      items: [
        "IP address",
        "Browser type",
        "Device type",
        "Browsing behavior",
        "Cookies & tracking data",
      ],
      color: "from-green-500 to-green-600",
    },
    {
      category: "Communication Data",
      items: [
        "Contact form submissions",
        "Chat/WhatsApp messages",
        "Email correspondence",
        "Phone call records",
        "Social media messages",
      ],
      color: "from-amber-500 to-amber-600",
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
        <header className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white shadow-lg">
          <div className="px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                  <LockClosedIcon className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Privacy Policy
                  </h1>
                  <p className="text-indigo-200 mt-1">
                    Last Updated: {companyInfo.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Your Privacy Matters</p>
                    <p className="text-sm text-indigo-200">
                      Transparent • Secure • Compliant
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-1/4">
              <div className="sticky top-8 bg-white rounded-2xl shadow-lg p-6 hidden lg:block">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                  <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
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
                          ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <section.icon
                        className={`h-5 w-5 ${
                          activeSection === section.id
                            ? "text-indigo-600"
                            : "text-gray-500"
                        }`}
                      />
                      <span className="font-medium text-sm">
                        {section.title}
                      </span>
                      <ChevronRightIcon
                        className={`h-4 w-4 ml-auto ${
                          activeSection === section.id
                            ? "text-indigo-600"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </nav>

                {/* Data Collection Preview */}
                <div className="mt-10 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    Data We Collect
                  </h3>
                  <div className="space-y-3">
                    {dataTypes.slice(0, 3).map((type, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className={`h-3 w-3 rounded-full bg-gradient-to-r ${type.color} mr-2`}
                        ></div>
                        <span className="text-sm text-gray-700">
                          {type.category}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowDataExample(!showDataExample)}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    {showDataExample ? (
                      <EyeSlashIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <EyeIcon className="h-4 w-4 mr-1" />
                    )}
                    {showDataExample ? "Hide details" : "Show all categories"}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="lg:hidden mb-6">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    Jump to Section
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`px-3 py-2 text-xs rounded-lg transition-colors flex items-center ${
                          activeSection === section.id
                            ? "bg-indigo-600 text-white"
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
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-white to-indigo-50 rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-indigo-100">
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="mb-6 md:mb-0 md:mr-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                      At{" "}
                      <span className="text-indigo-700">
                        {companyInfo.name}
                      </span>
                    </h2>
                    <p className="text-gray-700 mb-4">
                      ("Company", "we", "us", or "our"), we are committed to
                      protecting your privacy. This Privacy Policy explains how
                      we collect, use, store, and safeguard your information
                      when you visit our website, interact with us, or purchase
                      our products and services.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                      <p className="text-gray-700 font-medium">
                        <span className="font-bold">Important:</span> By using
                        our website or communicating with us, you consent to the
                        practices described in this Privacy Policy.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-w-[280px]">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                      Our Commitment
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          No selling of personal data
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          Transparent data practices
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          Industry-standard security
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          Clear opt-in/opt-out options
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 1. Information We Collect */}
              <section
                id="collect"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <ChartBarIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        1. Information We Collect
                      </h2>
                      <p className="text-indigo-100">
                        We may collect the following types of information
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        1.1
                      </span>
                      Personal Information
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Information that identifies you or your business, such as:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dataTypes[0].items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {showDataExample && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                          <span className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            1.2
                          </span>
                          Business & Transaction Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dataTypes[1].items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 bg-purple-50 p-3 rounded-lg"
                            >
                              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                          <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            1.3
                          </span>
                          Automatically Collected Information
                        </h3>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4">
                          <p className="text-gray-700 mb-4">
                            When you visit our website, we may automatically
                            collect: IP address, browser type and version,
                            device type, browsing behavior (pages visited, time
                            spent, referring pages), cookies and tracking data.
                          </p>
                          <p className="text-gray-600 text-sm">
                            This information helps improve website performance
                            and customer experience.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                          <span className="bg-amber-100 text-amber-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            1.4
                          </span>
                          Communication Data
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Information submitted through:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {dataTypes[3].items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 bg-amber-50 p-3 rounded-lg"
                            >
                              <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                              <span className="text-gray-700 text-sm">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!showDataExample && (
                    <button
                      onClick={() => setShowDataExample(true)}
                      className="mt-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <EyeIcon className="h-5 w-5 mr-2" />
                      Show all data collection categories
                    </button>
                  )}
                </div>
              </section>

              {/* 2. How We Use Your Information */}
              <section
                id="use"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <CogIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      2. How We Use Your Information
                    </h2>
                    <p className="text-gray-600">
                      We use collected information to:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <span className="text-blue-700 font-bold">2.1</span>
                      </div>
                      Provide and Improve Services
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-2"></div>
                        <span>Process inquiries, orders, and shipments</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-2"></div>
                        <span>Offer product recommendations</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-2"></div>
                        <span>Improve website performance and content</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <span className="text-green-700 font-bold">2.2</span>
                      </div>
                      Customer Support
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2"></div>
                        <span>Respond to questions or support requests</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2"></div>
                        <span>Provide after-sales assistance</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt=2"></div>
                        <span>Handle warranty or technical cases</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-100">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <span className="text-purple-700 font-bold">2.3</span>
                      </div>
                      Marketing & Communication
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2"></div>
                        <span>
                          Send brochures, offers, product updates (opt-in only)
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2"></div>
                        <span>
                          Notify about policy updates or service changes
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                      <div className="bg-amber-100 p-2 rounded-lg mr-3">
                        <span className="text-amber-700 font-bold">2.4</span>
                      </div>
                      Business Operations
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-amber-400 rounded-full mt-2"></div>
                        <span>Maintain internal records</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-amber-400 rounded-full mt-2"></div>
                        <span>Conduct data analytics</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 bg-amber-400 rounded-full mt-2"></div>
                        <span>Prevent fraud and enhance security</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                  <h4 className="font-bold text-gray-800 mb-2">
                    2.5 Legal Compliance
                  </h4>
                  <p className="text-gray-700">
                    Comply with applicable laws, regulations, or government
                    requests.
                  </p>
                </div>
              </section>

              {/* 3. Cookies & Tracking */}
              <section
                id="cookies"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <LockClosedIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      3. Cookies & Tracking Technologies
                    </h2>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
                  <p className="text-gray-700 mb-4">
                    Our website uses cookies to:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-800 mb-2">
                        Analyze Traffic
                      </h4>
                      <p className="text-sm text-gray-600">
                        Understand how visitors use our site
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-800 mb-2">
                        Improve Experience
                      </h4>
                      <p className="text-sm text-gray-600">
                        Personalize and enhance user journey
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-bold text-gray-800 mb-2">
                        Remember Preferences
                      </h4>
                      <p className="text-sm text-gray-600">
                        Store your settings and choices
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        Cookie Control
                      </h4>
                      <p className="text-gray-700 mb-2">
                        You can disable cookies through your browser settings.
                        However, some website features may not function properly
                        without cookies.
                      </p>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        Learn how to manage cookies in your browser →
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. How We Share Information */}
              <section
                id="share"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <UserGroupIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      4. How We Share Your Information
                    </h2>
                    <div className="mt-2 bg-green-50 inline-flex items-center px-4 py-2 rounded-full">
                      <ShieldCheckIcon className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-700 font-medium text-sm">
                        We do not sell or rent your personal information
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="border border-gray-200 rounded-xl p-5">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-blue-700 font-bold">4.1</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-3">
                      Service Providers
                    </h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                        <span>Shipping and logistics companies</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                        <span>Payment processors</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                        <span>Website hosting and IT providers</span>
                      </li>
                    </ul>
                    <p className="text-gray-500 text-xs mt-3">
                      These partners are required to maintain confidentiality.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-5">
                    <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-purple-700 font-bold">4.2</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-3">
                      Business Partners
                    </h3>
                    <p className="text-gray-700 text-sm">
                      If required for executing your order (example: component
                      manufacturers, installation partners).
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-5">
                    <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-red-700 font-bold">4.3</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-3">
                      Legal & Regulatory
                    </h3>
                    <p className="text-gray-700 text-sm mb-3">
                      We may disclose information if required by:
                    </p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                        <span>Law enforcement</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                        <span>Court orders</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                        <span>Government regulations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 5. Data Protection */}
              <section
                id="protection"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <ShieldCheckIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      5. Data Protection & Security
                    </h2>
                    <p className="text-gray-600">
                      We implement security measures to protect your information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-200 text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LockClosedIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Encrypted Transfers
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Secure data transmission using encryption
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-200 text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ServerIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Secure Servers
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Protected servers with firewalls
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-200 text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <EyeSlashIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Restricted Access
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Limited access to personal data
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-200 text-center">
                    <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DocumentTextIcon className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Regular Checks
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Ongoing security assessments
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        Security Disclaimer
                      </h4>
                      <p className="text-gray-700">
                        While we strive to protect your information, no online
                        system is 100% secure. Users share data at their own
                        risk.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Data Retention */}
              <section
                id="retention"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <ServerIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      6. Data Retention
                    </h2>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-6">
                  <p className="text-gray-700 mb-6">
                    We retain your information for as long as necessary to:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-indigo-600 mb-3">
                        01
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Fulfill Purpose
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Complete the reason it was collected
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-indigo-600 mb-3">
                        02
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Provide Services
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Offer ongoing support and assistance
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-indigo-600 mb-3">
                        03
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Meet Legal Requirements
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Comply with tax and regulatory needs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 text-white rounded-xl p-5">
                  <div className="flex items-center space-x-3">
                    <TrashIcon className="h-6 w-6 text-red-400" />
                    <div>
                      <h4 className="font-bold mb-2">Data Disposal</h4>
                      <p>
                        After retention periods expire, data is securely deleted
                        or anonymized.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 7. Your Privacy Rights */}
              <section
                id="rights"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <EyeIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      7. Your Privacy Rights
                    </h2>
                    <p className="text-gray-600">
                      Depending on your location, you may have rights such as:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-blue-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <span className="text-blue-700 font-bold">7.1</span>
                      </div>
                      <h3 className="font-bold text-gray-800">Access</h3>
                    </div>
                    <p className="text-gray-700">
                      Request a copy of the personal data we hold about you.
                    </p>
                  </div>

                  <div className="border border-green-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-2 rounded-lg mr-4">
                        <span className="text-green-700 font-bold">7.2</span>
                      </div>
                      <h3 className="font-bold text-gray-800">Correction</h3>
                    </div>
                    <p className="text-gray-700">
                      Request correction of inaccurate or outdated information.
                    </p>
                  </div>

                  <div className="border border-red-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 p-2 rounded-lg mr-4">
                        <span className="text-red-700 font-bold">7.3</span>
                      </div>
                      <h3 className="font-bold text-gray-800">Deletion</h3>
                    </div>
                    <p className="text-gray-700">
                      Request deletion of your information (unless legally
                      required to keep it).
                    </p>
                  </div>

                  <div className="border border-purple-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-2 rounded-lg mr-4">
                        <span className="text-purple-700 font-bold">7.4</span>
                      </div>
                      <h3 className="font-bold text-gray-800">Opt-Out</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        Unsubscribe from marketing emails anytime
                      </p>
                      <p className="text-gray-700">
                        Disable cookies through browser settings
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        To Exercise Your Rights
                      </h3>
                      <p>Contact us using the details in Section 11 below.</p>
                    </div>
                    <button className="mt-4 md:mt-0 bg-white text-indigo-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                      Contact Privacy Team
                    </button>
                  </div>
                </div>
              </section>

              {/* 8. Third-Party Links */}
              <section
                id="links"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <LinkIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      8. Third-Party Links
                    </h2>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 mb-4">
                        Our website may contain links to third-party websites.
                        We are not responsible for the privacy practices or
                        content of these external sites.
                      </p>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-gray-700 font-medium">
                          We encourage users to review the Privacy Policy of any
                          external site they visit.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 9. International Users */}
              <section
                id="international"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <GlobeAltIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      9. International Users
                    </h2>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="mb-6 md:mb-0 md:mr-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Global Data Transfer
                      </h3>
                      <p className="text-gray-700">
                        As a global exporter, we may process data
                        internationally. By using our services, you consent to
                        the transfer of your information to locations outside
                        your country, where data protection laws may differ.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm min-w-[200px]">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 mb-2">
                          50+
                        </div>
                        <p className="text-gray-700 font-medium">
                          Countries Served
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 10. Changes to This Policy */}
              <section
                id="changes"
                className="mb-12 scroll-mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <ExclamationTriangleIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      10. Changes to This Privacy Policy
                    </h2>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <p className="text-gray-700 mb-6">
                    We may update this Privacy Policy occasionally to reflect
                    changes in regulations, our business operations, or
                    improvements in data protection practices.
                  </p>
                  <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                    <p className="text-gray-800 font-bold">
                      The "Last Updated" date at the top will indicate the
                      latest version.
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
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <EnvelopeIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      11. Contact Us
                    </h2>
                    <p className="text-gray-600">
                      Get in touch with our privacy team
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                  <p className="text-gray-700 mb-8 text-center">
                    If you have any questions, requests, or concerns regarding
                    this Privacy Policy, please contact us:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <EnvelopeIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Email</h3>
                      </div>
                      <p className="text-gray-600">{companyInfo.email}</p>
                      <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Send privacy inquiry →
                      </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <PhoneIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Phone</h3>
                      </div>
                      <p className="text-gray-600">{companyInfo.phone}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        Mon-Fri, 9AM-6PM (Local Time)
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <MapPinIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Address</h3>
                      </div>
                      <p className="text-gray-600">{companyInfo.address}</p>
                      <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Get directions →
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 p-5 bg-white rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-3">
                      Response Time
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Typically within 48 hours
                      </div>
                      <div className="text-gray-600 text-sm">
                        For formal data requests, allow up to 30 days as per
                        regulations
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

export default PrivacyPolicy;
