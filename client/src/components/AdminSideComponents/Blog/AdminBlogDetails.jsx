import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AdminBlogDetails = () => {
  const [blogData, setBlogData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const blogDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_URL}/blog/get-blog-by-id/${id}`,
        headers: {},
      };

      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      setBlogData(response.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load blog details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    blogDetails();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-8 rounded mb-4 bg-skeletonLoaderColor w-3/5" />
        <div className="h-4 rounded mb-2 bg-skeletonLoaderColor w-2/5" />
        <div className="h-4 rounded mb-6 bg-skeletonLoaderColor w-1/3" />
      </div>

      <div className="h-64 rounded-lg mb-8 bg-skeletonLoaderColor" />

      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded bg-skeletonLoaderColor ${
              i === 4 ? "w-3/5" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-primaryTextColor">
              Error Loading Blog
            </h2>
            <p className="mb-6 text-secondaryTextColor">{error}</p>
            <button
              onClick={blogDetails}
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors duration-200 hover:shadow-lg bg-primaryBtnColor hover:bg-primaryBtnHoverColor"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold mb-4 leading-tight text-primaryTextColor">
                  {blogData.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-secondaryTextColor"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-secondaryTextColor">
                  By{" "}
                  <span className="font-medium text-secondaryTextColor">
                    {blogData.author}
                  </span>
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-secondaryTextColor"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-secondaryTextColor">
                  Created: {formatDate(blogData.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {blogData.image && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <img
              src={blogData.image}
              alt={blogData.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-primaryTextColor">
            <svg
              className="w-6 h-6 mr-3 text-accentColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Content
          </h2>

          <div className="prose max-w-none text-lg leading-relaxed text-primaryTextColor">
            {blogData.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: blogData.content.replace(/\n/g, "<br />"),
                }}
              />
            ) : (
              <p className="text-secondaryTextColor">
                No content available for this blog post.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-lg font-medium border-2 transition-all duration-200 hover:shadow-lg border-primaryColor text-primaryColor bg-transparent hover:bg-primaryColor hover:text-white"
          >
            ← Back to Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogDetails;
