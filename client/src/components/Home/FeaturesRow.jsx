import {
  FaShippingFast,
  FaLock,
  FaHeadset,
  FaMoneyBillWave,
  FaThumbsUp,
} from "react-icons/fa";

const FeaturesRow = () => {
  const features = [
    {
      icon: <FaShippingFast className="text-orange-500 text-2xl" />,
      title: "Free Shipping",
      desc: "Free shipping over $100",
    },
    {
      icon: <FaLock className="text-orange-500 text-2xl" />,
      title: "Payment Secure",
      desc: "Got 100% Payment Safe",
    },
    {
      icon: <FaHeadset className="text-orange-500 text-2xl" />,
      title: "Support 24/7",
      desc: "Top quality 24/7 Support",
    },
    {
      icon: <FaMoneyBillWave className="text-orange-500 text-2xl" />,
      title: "100% Money Back",
      desc: "Customers Money Backs",
    },
    {
      icon: <FaThumbsUp className="text-orange-500 text-2xl" />,
      title: "Quality Products",
      desc: "We Insure Product Quality",
    },
  ];

  return (
    <div className="px-4 xl:px-6 mb-6">
      <div className="border rounded-lg shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x bg-white overflow-hidden">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-4 py-6 justify-start"
          >
            <div>{feature.icon}</div>
            <div>
              <h4 className="font-semibold text-gray-800 text-base">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesRow;
