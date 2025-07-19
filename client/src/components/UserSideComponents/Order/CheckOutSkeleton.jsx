import React from "react";

const CheckoutSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-orange-50 min-h-screen">
      {/* Delivery Address Skeleton */}
      <div className="w-full md:w-2/3 space-y-6">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>

        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 space-y-3 bg-white animate-pulse"
          >
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 rounded-full bg-gray-300" />
              <div className="h-4 w-1/4 bg-gray-300 rounded" />
              <div className="h-5 w-12 bg-gray-300 rounded" />
            </div>
            <div className="h-3 w-2/3 bg-gray-300 rounded" />
            <div className="h-3 w-1/2 bg-gray-300 rounded" />
            <div className="h-3 w-1/4 bg-gray-300 rounded" />
            <div className="h-3 w-1/3 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      {/* Order Summary Skeleton */}
      <div className="w-full md:w-1/3 space-y-4 bg-white rounded-lg p-4 animate-pulse">
        <div className="h-6 w-1/2 bg-gray-300 rounded"></div>

        {/* Product Skeleton */}
        <div className="flex items-center space-x-4">
          <div className="h-16 w-20 bg-gray-300 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 bg-gray-300 rounded" />
            <div className="h-3 w-1/2 bg-gray-300 rounded" />
          </div>
          <div className="h-4 w-12 bg-gray-300 rounded" />
        </div>

        {/* Price Summary */}
        <div className="space-y-2">
          {["Subtotal", "Shipping", "GST", "Extra Tax"].map((label, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-1/3 bg-gray-300 rounded" />
              <div className="h-3 w-12 bg-gray-300 rounded" />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="h-4 w-1/4 bg-gray-300 rounded" />
          <div className="h-4 w-16 bg-gray-300 rounded" />
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <div className="h-4 w-1/3 bg-gray-300 rounded" />
          <div className="h-3 w-2/3 bg-gray-300 rounded" />
          <div className="h-3 w-1/3 bg-gray-300 rounded" />
        </div>

        {/* Place Order Button */}
        <div className="h-10 w-full bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
