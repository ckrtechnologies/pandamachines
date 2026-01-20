import React, { useState } from "react";

const HowToBuySteps = ({ product }) => {
  const [showAllSteps, setShowAllSteps] = useState(false);

  // Default fallback steps
  const defaultSteps = [
    {
      step: "01",
      title: "Login / Register",
      desc: "Sign in to your account or create a new account to continue shopping.",
    },
    {
      step: "02",
      title: "Select Your Product",
      desc: "Choose the product you want and review details like price, variant, and delivery.",
    },
    {
      step: "03",
      title: "Add to Cart OR Buy Now",
      desc: "Click “Add to Cart” to shop more, or “Buy Now” to proceed directly to checkout.",
    },
    {
      step: "04",
      title: "If You Choose “Add to Cart”",
      desc: "Go to your Cart, confirm quantity, apply offers (if any), then click Checkout.",
    },
    {
      step: "05",
      title: "Checkout & Address Details",
      desc: "Enter your delivery address and verify your order details before placing the order.",
    },
    {
      step: "06",
      title: "Choose Payment & Place Order",
      desc: "Select your payment mode (UPI/Card/COD) and confirm to place your order successfully.",
    },
  ];

  // If product explicitly disables howToBuy, don't render anything
  if (product?.howToBuy?.enabled === false) {
    return null;
  }

  // Determine which steps to show
  let steps = defaultSteps;
  let showLimit = 4;

  if (product?.howToBuy?.steps && product.howToBuy.steps.length > 0) {
    const activeSteps = product.howToBuy.steps
      .filter((step) => step.isActive !== false)
      .sort((a, b) => a.stepNo - b.stepNo);

    if (activeSteps.length > 0) {
      steps = activeSteps.map((step) => ({
        step: step.stepNo.toString().padStart(2, "0"),
        title: step.title,
        desc: step.desc,
      }));
    }
    
    // Use dynamic show limit if available
    if (product.howToBuy.showLimit) {
      showLimit = product.howToBuy.showLimit;
    }
  }

  return (
    <div className="rounded-md border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50 shadow-xs mb-6 transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h3 className="font-bold text-lg text-gray-800 tracking-wide">
            How to Buy This Product
          </h3>
        </div>

        {/* Steps Grid */}
        <div className="text-sm">
          {/* ✅ ONE STEP PER ROW */}
          <div className="grid grid-cols-1 gap-3">
            {steps
              .slice(0, showAllSteps ? undefined : showLimit)
              .map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-orange-100 p-4 hover:border-orange-200 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    {/* Step Number Circle (Replaced Icon) */}
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center text-lg font-bold text-orange-600 shadow-sm border border-orange-100">
                      {item.step}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          {item.title}
                        </h4>
                      </div>

                      <p className="text-gray-900 font-medium text-sm leading-relaxed break-words">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Hover Line */}
                  <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-orange-400 to-orange-300 transition-all duration-300"></div>
                </div>
              ))}
          </div>
        </div>

        {/* Show More/Less Button - Only show if total steps > showLimit */}
        {steps.length > showLimit && (
          <div className="mt-6 pt-4 border-t border-orange-100">
            <button
              onClick={() => setShowAllSteps(!showAllSteps)}
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 w-full md:w-auto text-sm font-semibold text-orange-600 hover:text-orange-700 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg border border-orange-200 hover:border-orange-300 shadow-sm hover:shadow transition-all duration-300"
            >
              <span>
                {showAllSteps ? "Show Less Steps" : "Show All Steps"}
              </span>

              <div
                className={`transform transition-transform duration-300 ${
                  showAllSteps ? "rotate-180" : ""
                }`}
              >
                {showAllSteps ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HowToBuySteps;
