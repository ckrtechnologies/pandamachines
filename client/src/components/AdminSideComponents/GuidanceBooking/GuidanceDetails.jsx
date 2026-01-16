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

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
      completed: "bg-blue-100 text-blue-700 border border-blue-300",
      rejected: "bg-red-100 text-red-700 border border-red-300",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border border-gray-300"
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-600">Loading guidance details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!guidanceData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No guidance data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 mr-3"
          >
            <MdArrowBackIosNew size={18} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Guidance Details
          </h1>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <p className="text-gray-800">{guidanceData.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Mobile Number
                </label>
                <p className="text-gray-800">{guidanceData.mobileNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <p className="text-gray-800">{guidanceData.email}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Category Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category
                </label>
                <p className="text-gray-800">{guidanceData.category?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sub Category
                </label>
                <p className="text-gray-800">
                  {guidanceData.subCategory?.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sub Sub Category
                </label>
                <p className="text-gray-800">
                  {guidanceData.subSubCategory?.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Product
                </label>
                <p className="text-gray-800">{guidanceData.product?.name}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-5">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Financial Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Investment Amount
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    ₹{guidanceData.investmentAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Discussion Fee
                  </label>
                  <p className="text-lg font-semibold text-blue-600">
                    ₹{guidanceData.discussionFee?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-5">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Scheduling Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Date
                  </label>
                  <p className="text-gray-800">
                    {new Date(guidanceData.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Time
                  </label>
                  <p className="text-gray-800">{guidanceData.time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Discussion Time
                  </label>
                  <p className="text-gray-800">{guidanceData.discussionTime}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-5">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Status</h2>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  guidanceData.status
                )}`}
              >
                {guidanceData.status?.charAt(0).toUpperCase() +
                  guidanceData.status?.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidanceDetails;
