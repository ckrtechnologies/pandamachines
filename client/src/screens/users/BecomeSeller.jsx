import React from "react";
import SellersNav from "../../components/common/SellersNav";
import { GoPlus } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import SellersFooter from "../../components/common/SellersFooter";

const BecomeSeller = () => {
  const stats = [
    {
      count: "1 Lakh+",
      label: "Verified Sellers",
      image: require("../../Assets/BecomeSeller/Stats/image1.png"),
    },
    {
      count: "1 Lakh+",
      label: "Verified Sellers",
      image: require("../../Assets/BecomeSeller/Stats/image2.png"),
    },
    {
      count: "1 Lakh+",
      label: "Verified Sellers",
      image: require("../../Assets/BecomeSeller/Stats/image3.png"),
    },
    {
      count: "1 Lakh+",
      label: "Verified Sellers",
      image: require("../../Assets/BecomeSeller/Stats/image4.png"),
    },
    {
      count: "1 Lakh+",
      label: "Verified Sellers",
      image: require("../../Assets/BecomeSeller/Stats/image5.png"),
    },
  ];

  const processSteps = [
    {
      title: "Sign Up with Ease",
      image: "image1.png",
      imagePosition: "right",
      points: [
        "Create Your Seller Account: Begin by registering your business using basic details such as your business name, GSTIN, PAN, and bank information.",
        "Verify and Set Up Your Profile: Complete the verification process to ensure trust and authenticity, and then configure your seller dashboard to manage operations efficiently.",
      ],
    },
    {
      title: "List Your Products",
      image: "image2.png",
      imagePosition: "left",
      points: [
        "Upload Product Details: Add detailed descriptions, pricing, category, images, and specifications to make your listings attractive and informative.",
        "Manage Inventory & Stock: Use inventory tools to track stock levels, set availability, and avoid stockouts or over-selling.",
      ],
    },
    {
      title: "Start Receiving Orders from admin",
      image: "image3.png",
      imagePosition: "right",
      points: [
        "Go Live on the Platform: Once products are listed, they become visible to millions of B2B/B2C customers depending on your category.",
        "Get Order Notifications: Receive real-time alerts and order details through your seller dashboard or mobile app.",
      ],
    },
    {
      title: "Fulfil Orders Seamlessly",
      image: "image4.png",
      imagePosition: "left",
      points: [
        "Pack & Dispatch: Prepare the items as per packaging guidelines and dispatch them through partnered logistics or your own.",
        "Track Shipments: Monitor the delivery status and ensure timely order fulfillment to boost customer satisfaction and ratings.",
      ],
    },
  ];

  const categories = [
    {
      name: "Mineral Water Plant",
      image: require("../../Assets/BecomeSeller/Catagory/image1.png"),
    },
    {
      name: "Soft Drink Plant",
      image: require("../../Assets/BecomeSeller/Catagory/image2.png"),
    },
    {
      name: "Pouch Packing Machine",
      image: require("../../Assets/BecomeSeller/Catagory/image3.png"),
    },
    {
      name: "BOPP Labeling Machine",
      image: require("../../Assets/BecomeSeller/Catagory/image4.png"),
    },
    {
      name: "RO Water System",
      image: require("../../Assets/BecomeSeller/Catagory/image5.png"),
    },
    {
      name: "Juice Plant",
      image: require("../../Assets/BecomeSeller/Catagory/image6.png"),
    },
    {
      name: "Capping Machine",
      image: require("../../Assets/BecomeSeller/Catagory/image7.png"),
    },
    {
      name: "Pasteurizer Unit",
      image: require("../../Assets/BecomeSeller/Catagory/image7.png"),
    },
    {
      name: "Mineral Water Plant",
      image: require("../../Assets/BecomeSeller/Catagory/image1.png"),
    },
    {
      name: "Soft Drink Plant",
      image: require("../../Assets/BecomeSeller/Catagory/image2.png"),
    },
    {
      name: "Pouch Packing Machine",
      image: require("../../Assets/BecomeSeller/Catagory/image3.png"),
    },
    {
      name: "BOPP Labeling Machine",
      image: require("../../Assets/BecomeSeller/Catagory/image4.png"),
    },
    {
      name: "RO Water System",
      image: require("../../Assets/BecomeSeller/Catagory/image5.png"),
    },
    {
      name: "Juice Plant",
      image: require("../../Assets/BecomeSeller/Catagory/image6.png"),
    },
    {
      name: "Capping Machine",
      image: require("../../Assets/BecomeSeller/Catagory/image7.png"),
    },
    {
      name: "Pasteurizer Unit",
      image: require("../../Assets/BecomeSeller/Catagory/image7.png"),
    },
    {
      name: "Mineral Water Plant",
      image: require("../../Assets/BecomeSeller/Catagory/image1.png"),
    },
    {
      name: "Soft Drink Plant",
      image: require("../../Assets/BecomeSeller/Catagory/image2.png"),
    },
    {
      name: "Pouch Packing Machine",
      image: require("../../Assets/BecomeSeller/Catagory/image3.png"),
    },
    {
      name: "BOPP Labeling Machine",
      image: require("../../Assets/BecomeSeller/Catagory/image4.png"),
    },
    {
      name: "RO Water System",
      image: require("../../Assets/BecomeSeller/Catagory/image5.png"),
    },
    {
      name: "Juice Plant",
      image: require("../../Assets/BecomeSeller/Catagory/image6.png"),
    },
    {
      name: "Capping Machine",
      image: require("../../Assets/BecomeSeller/Catagory/image7.png"),
    },
    {
      name: "Pasteurizer Unit",
      image: require("../../Assets/BecomeSeller/Catagory/image7.png"),
    },
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

  const StatCard = ({ count, label, image }) => (
    <div className="bg-white shadow-sm rounded-md p-3 sm:p-4 md:p-6 md:py-4">
      <img 
        className="h-6 w-8 sm:h-7 sm:w-9 md:h-8 md:w-10 mx-auto" 
        src={image} 
        alt={label} 
      />
      <p className="text-lg sm:text-xl md:text-xl font-semibold text-blue-900 mt-1 md:mt-2">
        {count}
      </p>
      <p className="text-xs sm:text-sm md:text-sm tracking-wide text-gray-700">
        {label}
      </p>
    </div>
  );

  const ProcessStep = ({ step, index }) => {
    return (
      <div className={`flex flex-col ${step.imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} justify-between md:gap-20 items-center `}>
        {/* Image Section */}
        <div className={`w-full md:w-2/5 lg:w-1/3 mb-4 md:mb-0 ${step.imagePosition === 'left' ? 'md:pr-4' : 'md:pl-4'}`}>
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-80">
            <img
              src={require(`../../Assets/BecomeSeller/ProcessStep/${step.image}`)}
              alt={`${step.title} illustration`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-3/5 lg:w-2/3 px-2 sm:px-4">
          <h4 className="font-semibold text-xl sm:text-2xl md:text-2xl lg:text-3xl tracking-wide text-gray-800 mb-3 md:mb-4 text-center md:text-left">
            {step.title}
          </h4>
          <ul className="space-y-3 md:space-y-4">
            {step.points.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 sm:mt-2.5 md:mt-3 bg-gray-700 rounded-full mr-2"></span>
                <p className="font-medium text-base sm:text-lg md:text-lg lg:text-xl tracking-wide text-gray-700">
                  {point}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const CategoryCard = ({ name, image }) => (
    <div className="bg-white py-3 px-2 sm:py-4 sm:px-3 md:py-4 md:px-2 rounded-md shadow text-center hover:bg-blue-50 transition-colors flex flex-col items-center">
      <img 
        src={image} 
        alt={name} 
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain mb-1 sm:mb-2" 
      />
      <span className="text-xs sm:text-sm md:text-md font-medium tracking-wide text-gray-600">
        {name}
      </span>
    </div>
  );

  const FAQItem = ({ faq }) => (
    <details className="group bg-white p-3 sm:p-4 md:p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-300 ease-in-out mb-3 md:mb-4">
      <summary className="flex justify-between items-center cursor-pointer list-none focus:outline-none">
        <span className="font-semibold text-sm sm:text-base md:text-base lg:text-lg tracking-wide text-gray-800">
          {faq.q}
        </span>
        <div className="relative flex-shrink-0 ml-2 sm:ml-3 md:ml-4 p-1 rounded-md bg-orange-50 group-hover:bg-orange-100 transition-colors duration-300 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8">
          <GoPlus
            size={16}
            className="absolute text-gray-500 group-hover:text-orange-600 transition-all duration-300 transform group-open:rotate-90 group-open:opacity-0"
          />
          <RxCross2
            size={16}
            className="absolute text-gray-500 group-hover:text-orange-600 transition-all duration-300 transform -rotate-90 opacity-0 group-open:rotate-0 group-open:opacity-100"
          />
        </div>
      </summary>
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden max-h-0 group-open:max-h-[300px]">
        <p className="pb-1 sm:pb-2 text-medium text-zinc-600 text-xs sm:text-sm md:text-base opacity-0 group-open:opacity-100 transition-opacity duration-300 delay-200">
          {faq.a}
        </p>
      </div>
    </details>
  );

  return (
    <React.Fragment>
      <SellersNav />
      <section className="bg-orange-50 text-gray-800">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between bg-[#F2F0E6] px-4 md:px-6 py-8 sm:py-10 md:py-12">
          <div className="mb-6 md:mb-0 md:pr-4 lg:pr-8">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8">
              {[
                "Sell smarter. Sell faster.",
                "Sell to the world's largest",
                "B2B network.",
              ].map((text, idx) => (
                <h4
                  key={idx}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide text-gray-800"
                >
                  {text}
                </h4>
              ))}
            </div>
            <p className="text-sm sm:text-base md:text-lg tracking-wider text-gray-700">
              Turn your business into a global brand with our B2B marketplace.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="md:col-start-2">
              <StatCard
                count={stats[0].count}
                label={stats[0].label}
                image={stats[0].image}
              />
            </div>
            {stats.slice(1).map((stat, idx) => (
              <StatCard
                key={idx + 1}
                count={stat.count}
                label={stat.label}
                image={stat.image}
              />
            ))}
          </div>
        </div>

        {/* 4-Step Process */}
        <div className="px-4 md:px-6 py-8 sm:py-10 md:py-12">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
            <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl tracking-wide text-gray-900">
              How it works?
            </h1>
            <p className="text-sm sm:text-base md:text-lg tracking-wide font-light text-gray-700 mt-2 sm:mt-3 md:mt-4">
              A simple 4-step process to start selling and grow your business online:
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-10">
            {processSteps.map((step, idx) => (
              <ProcessStep key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div className="px-4 md:px-6 py-8 sm:py-10 md:py-12 bg-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 sm:mb-8 md:mb-10 text-center text-gray-800">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {categories.map((category, idx) => (
              <CategoryCard
                key={idx}
                name={category.name}
                image={category.image}
              />
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="px-4 md:px-6 py-8 sm:py-10 md:py-12">
          <div className="flex flex-col lg:flex-row items-stretch gap-6 sm:gap-8 md:gap-10 justify-between mx-auto">
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5 md:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 md:mb-8 text-center lg:text-left text-gray-800">
                Frequently Asked Questions
              </h2>
              {faqs.map((faq, idx) => (
                <FAQItem key={idx} faq={faq} />
              ))}
            </div>

            <div className="hidden lg:flex md:mt-16  lg:w-1/2 bg-white items-center justify-center pl-6 md:pl-8 lg:pl-10">
              <img
                src={require("../../Assets/Faq/FaqImg.png")}
                className="w-full max-h-[400px] md:max-h-[400px] object-cover"
                alt="FAQ illustration"
              />
            </div>
          </div>
        </div>
      </section>
      <SellersFooter />
    </React.Fragment>
  );
};

export default BecomeSeller;