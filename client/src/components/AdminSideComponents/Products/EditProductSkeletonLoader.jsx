import React from "react";

const EditProductSkeletonLoader = () => {
  return (
    <div className="w-full mx-auto p-6 bg-white">
      <div className="flex items-center mb-8">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse mr-3"></div>
        <div className="w-32 h-7 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
          <div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
          <div>
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          {/* Shipping Charges */}
          <div>
            <div className="w-28 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          {/* GST */}
          <div>
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          {/* Return Policy */}
          <div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Price */}
          <div>
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          {/* Ratings */}
          <div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          {/* Measurement */}
          <div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          {/* Stock Status */}
          <div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          {/* Extra Tax */}
          <div>
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-6">
        <div className="w-40 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="w-full h-20 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-24 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};

export default EditProductSkeletonLoader;
