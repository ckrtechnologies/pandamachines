import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdArrowBackIosNew } from "react-icons/md";

const GuidanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guidanceData, setGuidanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuidanceDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/guidance-booking/get-book-by-id/${id}`
        );
        setGuidanceData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch guidance details");
        console.error("Error fetching guidance details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGuidanceDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading guidance details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!guidanceData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">No guidance data found</div>
      </div>
    );
  }

  return (
    <div className=" p-6">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="flex justify-start items-center mb-6 gap-3">
          <MdArrowBackIosNew
            size={26}
            onClick={() => {
              navigate(-1);
            }}
            className="cursor-pointer"
          />

          <h1 className="text-3xl font-bold text-gray-800">Guidance Details</h1>
        </div>

        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Full Name
              </label>
              <p className="text-lg text-gray-800">{guidanceData.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Mobile Number
              </label>
              <p className="text-lg text-gray-800">
                {guidanceData.mobileNumber}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="text-lg text-gray-800">{guidanceData.email}</p>
            </div>
          </div>
        </div>

        {/* Category Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Category Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Category
              </label>
              <p className="text-lg text-gray-800">
                {guidanceData.category?.name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Sub Category
              </label>
              <p className="text-lg text-gray-800">
                {guidanceData.subCategory?.name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Sub Sub Category
              </label>
              <p className="text-lg text-gray-800">
                {guidanceData.subSubCategory?.name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Product
              </label>
              <p className="text-lg text-gray-800">
                {guidanceData.product?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Financial Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Investment Amount
              </label>
              <p className="text-lg text-gray-800">
                ₹{guidanceData.investmentAmount?.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Discussion Fee
              </label>
              <p className="text-lg text-gray-800">
                ₹{guidanceData.discussionFee?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Scheduling Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Scheduling Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Date
              </label>
              <p className="text-lg text-gray-800">
                {new Date(guidanceData.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Time
              </label>
              <p className="text-lg text-gray-800">{guidanceData.time}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Discussion Time
              </label>
              <p className="text-lg text-gray-800">
                {guidanceData.discussionTime}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Status</h2>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {guidanceData.status?.charAt(0).toUpperCase() +
              guidanceData.status?.slice(1)}
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Timestamps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <label className="block font-medium">Created At</label>
              <p>{new Date(guidanceData.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="block font-medium">Updated At</label>
              <p>{new Date(guidanceData.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidanceDetails;
