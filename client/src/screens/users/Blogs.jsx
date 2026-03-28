import React, { useState } from "react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import BedsCarousel from "../../components/common/BedsCarousel";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const allBlogs = () => {
    setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/blog/get-all-blog`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        setBlogPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to load blog posts");
        setLoading(false);
      });
  };

  useEffect(() => {
    allBlogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content, maxLength = 105) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const BlogSkeleton = () => (
    <div className="group bg-white rounded-md overflow-hidden shadow-lg border border-gray-100 flex flex-col p-4 animate-pulse">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 rounded-md mb-4"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded mt-4"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div>
        <UserNavbar />
        <BedsCarousel />
        <div className="px-4 xl:px-6 mb-6 pt-6 pb-10 bg-gradient-to-br from-[#E0F2EA] via-[#F9F0DC] to-[#FFF8F8]">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={allBlogs}
              className="mt-4 px-6 py-2 bg-[#004680] hover:bg-[#00365f] text-white rounded-md transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
        <AllUserFooter />
      </div>
    );
  }

  return (
    <div>
      <UserNavbar />

      <BedsCarousel />

      <div className="px-4 xl:px-6 mb-6 pt-6 pb-10 bg-gradient-to-br from-[#E0F2EA] via-[#F9F0DC] to-[#FFF8F8]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 px-1">
          <div className="text-center w-full mb-4 md:mb-0">
            <h2 className="text-xl tracking-wide md:text-2xl font-bold text-[#1f2937] mb-2">
              Latest Industry Insights
            </h2>
            <p className="text-[#6b7280] text-sm md:text-base tracking-wide">
              Stay updated with the latest trends, tips, and insights from
              industry experts.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-[#6b7280]">📝</div>
            <h3 className="text-xl font-semibold text-[#1f2937] mb-2">
              No Blog Posts Yet
            </h3>
            <p className="text-[#6b7280]">Check back later for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post._id}
                className="group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-2 line-clamp-2 group-hover:text-[#00569e] transition-colors duration-200">
                    {post.title}
                  </h3>

                  <p className="text-[#6b7280] text-sm mb-3 flex-1 line-clamp-3">
                    {truncateContent(post.content)}
                  </p>

                  <div className="text-xs text-[#6b7280] mb-4 flex items-center justify-between">
                    <span className="font-medium text-[#00569e]">
                      By {post.author}
                    </span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>

                  <div className="mt-auto">
                    <button
                      className="w-full flex items-center justify-center gap-2 bg-[#004680] hover:bg-[#00365f] text-white px-4 py-2 rounded-md transition-colors duration-200"
                      onClick={() => {
                        navigate(`/blog-details/${post._id}`);
                      }}
                    >
                      <span className="text-sm tracking-wide font-medium">
                        Read Full Article
                      </span>
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AllUserFooter />
    </div>
  );
};

export default Blogs;
