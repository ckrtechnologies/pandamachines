import React, { useRef, useState } from "react";
import SellersNav from "../../components/common/SellersNav";
import { GoPlus } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";

const BecomeSeller = () => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  // Data arrays to reduce repetition
  const stats = [
    { count: "1 Lakh+", label: "Verified Sellers" },
    { count: "1 Lakh+", label: "Verified Sellers" },
    { count: "1 Lakh+", label: "Verified Sellers" },
    { count: "1 Lakh+", label: "Verified Sellers" },
    { count: "1 Lakh+", label: "Verified Sellers" },
  ];

  const processSteps = [
    {
      title: "Sign Up with Ease",
      image: "4step1.png",
      imagePosition: "right",
      points: [
        "Create Your Seller Account: Begin by registering your business using basic details such as your business name, GSTIN, PAN, and bank information.",
        "Verify and Set Up Your Profile: Complete the verification process to ensure trust and authenticity, and then configure your seller dashboard to manage operations efficiently.",
      ],
    },
    {
      title: "List Your Products",
      image: "BecomeSeller/ertyuio.png",
      imagePosition: "left",
      points: [
        "Upload Product Details: Add detailed descriptions, pricing, category, images, and specifications to make your listings attractive and informative.",
        "Manage Inventory & Stock: Use inventory tools to track stock levels, set availability, and avoid stockouts or over-selling.",
      ],
    },
    {
      title: "Start Receiving Orders from admin",
      image: "BecomeSeller/Recieving.png",
      imagePosition: "right",
      points: [
        "Go Live on the Platform: Once products are listed, they become visible to millions of B2B/B2C customers depending on your category.",
        "Get Order Notifications: Receive real-time alerts and order details through your seller dashboard or mobile app.",
      ],
    },
    {
      title: "Fulfil Orders Seamlessly",
      image: "BecomeSeller/fourth.png",
      imagePosition: "left",
      points: [
        "Pack & Dispatch: Prepare the items as per packaging guidelines and dispatch them through partnered logistics or your own.",
        "Track Shipments: Monitor the delivery status and ensure timely order fulfillment to boost customer satisfaction and ratings.",
      ],
    },
  ];

  const categories = [
    "Mineral Water Plant",
    "Soft Drink Plant",
    "Pouch Packing Machine",
    "BOPP Labeling Machine",
    "RO Water System",
    "Juice Plant",
    "Capping Machine",
    "Pasteurizer Unit",
  ];

  const faqs = [
    {
      q: "Is there a registration fee to become a seller?",
      a: "No, registration is completely free. We do not charge any setup fees.",
    },
    {
      q: "Can I advertise or promote my products?",
      a: "Returns are managed as per platform and logistics policy.",
    },
    {
      q: "What types of products can I sell?",
      a: "You can sell industrial machines, water plants, packing units, etc.",
    },
    {
      q: "Are there any platform fees or commissions?",
      a: "Please contact us for platform-specific commission details.",
    },
    {
      q: "What happens if a product is returned?",
      a: "Returns are managed as per platform and logistics policy.",
    },
  ];

  // Reusable components
  const StatCard = ({ count, label }) => (
    <div className="bg-white shadow-sm rounded-md px-6 py-4">
      <img
        className="h-8 w-10 mx-auto"
        src={require("../../Assets/Images/AVG.png")}
        alt={label}
      />
      <p className="text-xl font-semibold text-blue-900">{count}</p>
      <p className="text-sm tracking-wide text-gray-700">{label}</p>
    </div>
  );

  const ProcessStep = ({ step, index }) => {
    const isImageLeft = step.imagePosition === "left";
    const ImageComponent = (
      <div className="md:w-1/2 flex justify-center">
        <img
          src={require(`../../Assets/Images/${step.image}`)}
          alt={`${step.title} illustration`}
          className={`max-w-full h-auto ${index === 3 ? "md:p-12" : ""}`}
          loading="lazy"
        />
      </div>
    );

    const ContentComponent = (
      <div className="md:w-1/2 mb-8 md:mb-0">
        <div className="md:pr-8">
          <h4 className="font-semibold text-2xl tracking-wide text-gray-800 mb-4">
            {step.title}
          </h4>
          <ul className="space-y-4">
            {step.points.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="flex-shrink-0 w-1.5 h-1.5 mt-3 bg-gray-700 rounded-full mr-2"></span>
                <p className="font-medium text-xl tracking-wide text-gray-700">
                  {point}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );

    return (
      <div className="flex flex-col md:flex-row items-center">
        {isImageLeft ? (
          <>
            {ImageComponent}
            {ContentComponent}
          </>
        ) : (
          <>
            {ContentComponent}
            {ImageComponent}
          </>
        )}
      </div>
    );
  };

  const CategoryCard = ({ name, index }) => (
    <div className="bg-white py-4 px-2 rounded-md shadow text-center hover:bg-blue-50 transition-colors flex flex-col items-center">
      <img
        src={require("../../Assets/Ourcatagories/p1.png")}
        alt={name}
        className="w-10 h-10 object-contain mb-2"
      />
      <span className="text-md font-medium tracking-wide text-gray-600">
        {name}
      </span>
    </div>
  );

  const FAQItem = ({ faq, index }) => {
    return (
      <div className="group bg-white p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
        <button
          className="flex justify-between items-center w-full cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="font-semibold text-base sm:text-lg tracking-wide text-gray-800 text-left">
            {faq.q}
          </span>
          <div className="flex-shrink-0 ml-4 p-1 rounded-md bg-orange-50 group-hover:bg-orange-100 transition-colors">
            {isOpen ? (
              <RxCross2
                size={20}
                className="text-gray-500 group-hover:text-orange-600 transition-colors"
              />
            ) : (
              <GoPlus
                size={20}
                className="text-gray-500 group-hover:text-orange-600 transition-colors"
              />
            )}
          </div>
        </button>

        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-medium text-zinc-600 text-sm sm:text-base">
              {faq.a}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <SellersNav />
      <section className="bg-orange-50 text-gray-800">
        {/* Hero Section */}
        <div className="flex justify-between bg-[#F2F0E6]">
          <div className="px-4 sm:px-8 xl:px-10 py-6 md:py-10">
            <div className="space-y-2 mb-6 md:mb-8">
              {[
                "Sell smarter. Sell faster.",
                "Sell to the world's largest",
                "B2B network.",
              ].map((text, idx) => (
                <h4
                  key={idx}
                  className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide text-gray-800"
                >
                  {text}
                </h4>
              ))}
            </div>
            <p className="text-base sm:text-lg tracking-wider text-gray-700">
              Turn your business into a global brand with our B2B marketplace.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center px-4 xl:px-10 py-10">
            <div className="md:col-start-2">
              <StatCard count={stats[0].count} label={stats[0].label} />
            </div>
            {stats.slice(1).map((stat, idx) => (
              <StatCard key={idx + 1} count={stat.count} label={stat.label} />
            ))}
          </div>
        </div>

        {/* 4-Step Process */}
        <div className="px-4  xl:px-10">
          <div className="text-center mt-24 mb-8">
            <h1 className="font-semibold text-3xl tracking-wide text-gray-900">
              How it works?
            </h1>
            <p className="text-lg tracking-wide font-light text-gray-700 mt-2">
              A simple 4-step process to start selling and grow your business
              online:
            </p>
          </div>

          <div className="space-y-1">
            {processSteps.map((step, idx) => (
              <ProcessStep key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <h2 className="text-2xl font-semibold mb- text-center text-gray-800 px-4 xl:px-10">
          Popular Categories
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-7 gap-6 mb-8 md:px-16 py-14 px-4 xl:px-10">
          {/* Repeat categories 4 times to match original */}
          {Array.from({ length: 4 }, (_, groupIdx) =>
            categories.map((category, idx) => (
              <CategoryCard
                key={`${groupIdx}-${idx}`}
                name={category}
                index={groupIdx * categories.length + idx}
              />
            ))
          )}
        </div>

        {/* FAQs */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-10 justify-between mx-auto px-4 xl:px-10 py-8">
          <div className="w-full lg:w-1/2 space-y-6">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} faq={faq} index={idx} />
            ))}
          </div>

          <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center">
            <img
              src={require("../../Assets/Faq/FaqImg.png")}
              className="w-full max-h-[400px] object-contain"
              alt="FAQ illustration"
            />
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default BecomeSeller;
