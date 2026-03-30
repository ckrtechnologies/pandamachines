import React, { useEffect, useState } from "react";
import SellersNav from "../../components/common/SellersNav";
import { GoPlus } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import SellersFooter from "../../components/common/SellersFooter";
import AOS from "aos";
import "aos/dist/aos.css";
import AllUserFooter from "../../components/common/AllUserFooter";

const BecomeSeller = () => {
  // const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

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
    <div className="bg-white shadow-sm rounded-md p-4 md:p-6">
      <img className="h-8 w-10 mx-auto" src={image} alt={label} />
      <p className="text-xl font-semibold text-blue-900 mt-4">{count}</p>
      <p className="text-sm tracking-wide text-gray-700">{label}</p>
    </div>
  );

  const ProcessStep = ({ step, index }) => {
    return (
      <div
        className={`flex flex-col ${
          step.imagePosition === "left" ? "md:flex-row" : "md:flex-row-reverse"
        } justify-between items-center mb-8 gap-6 md:gap-8 lg:gap-10`}
      >
        <div
          className={`w-full md:w-1/2 lg:w-2/5 ${
            step.imagePosition === "left" ? "md:pr-6" : "md:pl-6"
          }`}
        >
          <div
            className="relative h-60 sm:h-72 md:h-80 lg:h-96 w-full rounded-lg overflow-hidden bg-no-repeat bg-contain bg-center"
            style={{
              backgroundImage: `url(${require("../../Assets/BecomeSeller/ProcessStep/Bg-Image.png")})`,
            }}
          >
            <img
              src={require(`../../Assets/BecomeSeller/ProcessStep/${step.image}`)}
              alt={`${step.title} illustration`}
              className="w-full h-full object-contain object-center z-10 relative"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 lg:w-3/5 px-2 sm:px-4">
          <h4 className="font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide text-gray-800 mb-4 md:mb-6 text-center md:text-left">
            {step.title}
          </h4>
          <ul className="space-y-4">
            {step.points.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 mt-2.5 sm:mt-3 md:mt-3.5 bg-gray-700 rounded-full mr-3"></span>
                <p className="font-medium text-base sm:text-lg md:text-xl lg:text-xl tracking-wide text-gray-700">
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
    <div className="bg-white p-4 rounded-md shadow text-center hover:bg-blue-50 transition-colors flex flex-col items-center">
      <img src={image} alt={name} className="w-10 h-10 object-contain mb-4" />
      <span className="text-sm font-medium tracking-wide text-gray-600">
        {name}
      </span>
    </div>
  );

  const FAQItem = ({ faq }) => (
    <details className="group bg-white p-4 border rounded-lg hover:border-gray-300 transition mb-4">
      <summary className="flex justify-between items-center cursor-pointer list-none focus:outline-none">
        <span className="font-semibold text-base lg:text-lg tracking-wide text-gray-800">
          {faq.q}
        </span>
        <div className="relative flex-shrink-0 ml-4 p-2 rounded-md bg-orange-50 group-hover:bg-orange-100 transition-colors duration-300 h-8 w-8">
          {/* Plus icon with smooth rotation and fade */}
          <GoPlus
            size={16}
            className="absolute text-gray-500 group-hover:text-orange-600 
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
                    transform origin-center 
                    group-open:rotate-90 group-open:scale-90 group-open:opacity-0"
          />
          {/* Cross icon with smooth rotation and fade */}
          <RxCross2
            size={16}
            className="absolute text-gray-500 group-hover:text-orange-600 
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
                    transform origin-center -rotate-90 scale-90 opacity-0 
                    group-open:rotate-0 group-open:scale-100 group-open:opacity-100"
          />
        </div>
      </summary>
      {/* Content with smooth height and opacity transition */}
      <div
        className="mt-4 pt-4 border-t border-gray-100 
                  overflow-hidden 
                  transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                  max-h-0 group-open:max-h-[500px]"
      >
        <p
          className="pb-4 text-medium text-zinc-600 text-base 
                   transition-opacity duration-500 ease-in-out 
                   opacity-0 group-open:opacity-100 
                   delay-75 group-open:delay-150"
        >
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
        <div className="flex flex-col md:flex-row justify-between bg-[#F2F0E6] px-4 md:px-8 py-12">
          <div className="mb-8 md:mb-0 md:pr-8">
            <div className="space-y-2 sm:space-y-4 mb-8">
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
            <p className="text-base md:text-lg tracking-wider text-gray-700">
              Turn your business into a global brand with our B2B marketplace.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
        <div className="px-4 md:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="font-semibold text-3xl md:text-4xl tracking-wide text-gray-900">
              How it works?
            </h1>
            <p className="text-base md:text-lg tracking-wide font-light text-gray-700 mt-4">
              A simple 4-step process to start selling and grow your business
              online:
            </p>
          </div>

          <div className="space-y-2">
            {processSteps.map((step, idx) => (
              <ProcessStep key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div className="px-4 md:px-8 py-12 bg-white">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-gray-800">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
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
        <div className="px-4 md:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-stretch gap-8 justify-between mx-auto">
            <div className="w-full lg:w-1/2 space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center lg:text-left text-gray-800">
                Frequently Asked Questions
              </h2>
              {faqs.map((faq, idx) => (
                <FAQItem key={idx} faq={faq} />
              ))}
            </div>

            <div className="hidden lg:flex lg:w-1/2 md:mt-16 bg-white items-center justify-center pl-8">
              <img
                src={require("../../Assets/Faq/FaqImg.png")}
                className="w-full max-h-[400px] object-cover"
                alt="FAQ illustration"
              />
            </div>
          </div>
        </div>
      </section>
      <SellersFooter />
      <AllUserFooter />
    </React.Fragment>
  );
};

export default BecomeSeller;
