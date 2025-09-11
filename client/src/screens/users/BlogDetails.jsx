import React, { useEffect, useState } from "react";
import {
  Home,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import axios from "axios";
import { useParams } from "react-router-dom";

const BlogDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogData, setBlogData] = useState(null);
  const { id } = useParams();

  const blogDetails = async () => {
    try {
      setLoading(true);
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_URL}/blog/get-blog-by-id/${id}`,
        headers: {},
      };

      const response = await axios.request(config);
      console.log("Blog data:", response.data);
      setBlogData(response.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Failed to load blog details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      blogDetails();
    }
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // const calculateReadTime = (content) => {
  //   const wordsPerMinute = 200;
  //   const wordCount = content.split(" ").length;
  //   const readTime = Math.ceil(wordCount / wordsPerMinute);
  //   return `${readTime} min read`;
  // };

  const formatContent = (content) => {
    return content.split("\n").filter((paragraph) => paragraph.trim() !== "");
  };

  if (loading) {
    return (
      <div className="bg-rose-50 min-h-screen">
        <UserNavbar />
        <header className="bg-gray-800 text-white py-4 px-4 md:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span style={{ color: "#8cc441" }}>Blogs</span>
            <ChevronRight className="w-4 h-4" />
            <span>Blog Details</span>
          </nav>
        </header>
        <div className="flex justify-center items-center h-64">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: "#00569e" }}
          ></div>
        </div>
        <AllUserFooter />
      </div>
    );
  }

  if (error || !blogData) {
    return (
      <div className="bg-rose-50 min-h-screen">
        <UserNavbar />
        <header className="bg-gray-800 text-white py-4 px-4 md:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span style={{ color: "#8cc441" }}>Blogs</span>
            <ChevronRight className="w-4 h-4" />
            <span>Blog Details</span>
          </nav>
        </header>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "#1f2937" }}
            >
              {error || "Blog not found"}
            </h2>
            <p style={{ color: "#6b7280" }}>Please try again later.</p>
          </div>
        </div>
        <AllUserFooter />
      </div>
    );
  }

  return (
    <div className="bg-rose-50 min-h-screen">
      <UserNavbar />

      {/* Breadcrumb */}
      <header className="bg-gray-800 text-white py-4 px-4 md:px-6">
        <nav className="flex items-center space-x-2 text-sm">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <span style={{ color: "#8cc441" }}>Blogs</span>
          <ChevronRight className="w-4 h-4" />
          <span>Blog Details</span>
        </nav>
      </header>

      <main className="w-full mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Blog Image */}
            <div className="rounded-xl overflow-hidden mb-6 shadow-lg">
              <img
                src={blogData.image}
                alt={blogData.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>

            {/* Blog Title */}
            <h1
              className="text-2xl md:text-4xl font-bold mb-6 leading-tight"
              style={{ color: "#1f2937" }}
            >
              {blogData.title}
            </h1>

            {/* Blog Meta */}
            <div
              className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-lg"
              style={{
                backgroundColor: "#a6c9e9",
                backgroundColor: "rgba(166, 201, 233, 0.2)",
              }}
            >
              <div className="flex items-center" style={{ color: "#6b7280" }}>
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium">{blogData.author}</span>
              </div>
              <div className="flex items-center" style={{ color: "#6b7280" }}>
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(blogData.createdAt)}</span>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose max-w-none">
              <div className="space-y-4">
                {formatContent(blogData.content).map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg leading-relaxed"
                    style={{ color: "#6b7280" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-8">
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: "#1f2937" }}
              >
                About this Blog
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: "#6b7280" }}>Published:</span>
                  <span style={{ color: "#1f2937" }} className="font-medium">
                    {formatDate(blogData.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "#6b7280" }}>Author:</span>
                  <span style={{ color: "#1f2937" }} className="font-medium">
                    {blogData.author}
                  </span>
                </div>
              </div>

              <hr className="my-6" style={{ borderColor: "#e5e7eb" }} />

              <div className="space-y-3">
                <button
                  className="w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  style={{
                    backgroundColor: "#004680",
                    color: "white",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#00365f")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#004680")
                  }
                >
                  Share Article
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AllUserFooter />
    </div>
  );
};

export default BlogDetails;
