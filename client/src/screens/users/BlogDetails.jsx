import React, { useState } from "react";
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

const BlogDetails = () => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(38);
  const [showFullContent, setShowFullContent] = useState(false);

  const blogData = {
    title: "Water Purification Systems: A Complete Guide for Industries",
    content: [
      "In the ever-evolving landscape of industrial water solutions, Reverse Osmosis (RO) Water Purification Plants have emerged as the best-selling solution for clean and safe water, earning the trust of industries, businesses, and households alike over the past decade.",
      "RO plants use advanced membrane technology to remove dissolved salts, heavy metals, bacteria, and other impurities, delivering water that meets WHO and BIS standards. This technology has revolutionized water treatment across multiple sectors.",
      "From bottled water manufacturing units and pharmaceutical industries to commercial buildings and apartment complexes, RO plants have a wide range of industrial and commercial applications. Their versatility makes them indispensable in today's water treatment landscape.",
    ],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?fm=jpg&q=80&w=800&h=600",
    author: "Sarah Johnson",
    date: "2024-12-12",
    readTime: "7 min read",
    likes: 38,
    comments: 12,
    features: [
      "Multi-stage filtration system for comprehensive purification",
      "Energy-efficient motors and components to reduce operational costs",
      "Automatic operation with minimal maintenance requirements",
      "Durable, corrosion-resistant materials for long lifespan",
      "Digital monitoring and real-time TDS control for precision",
    ],
  };

  const comments = [
    {
      id: 1,
      name: "Annette Bank",
      text: "This article perfectly summarizes why we chose RO systems for our manufacturing plant. The water quality improvement has been remarkable!",
      date: "2024-12-13",
    },
    {
      id: 2,
      name: "Dominant Industries",
      text: "We've been using RO systems for years, but the new digital monitoring features mentioned here are game-changers for large-scale operations.",
      date: "2024-12-14",
    },
  ];

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-rose-50">
      <UserNavbar />
      
      {/* Breadcrumb */}
      <header className="bg-gray-800 text-white py-4 px-4 md:px-6">
        <nav className="flex items-center space-x-2 text-sm">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <span className="text-orange-400">Blogs</span>
          <ChevronRight className="w-4 h-4" />
          <span>Blogs Details</span>
        </nav>
      </header>

      <main className="mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Blog Image */}
            <div className="rounded-xl overflow-hidden mb-6">
              <img
                src={blogData.image}
                alt={blogData.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Blog Actions */}
            <div className="flex items-center space-x-6 mb-6">
              <button onClick={toggleLike} className="flex items-center text-gray-600 hover:text-red-500">
                <Heart className={`w-5 h-5 mr-1 ${liked ? "text-red-500 fill-red-500" : ""}`} />
                <span>{likesCount}</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-500">
                <MessageCircle className="w-5 h-5 mr-1" />
                <span>{blogData.comments}</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-800">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Blog Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {blogData.title}
            </h1>

            {/* Blog Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{blogData.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(blogData.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{blogData.readTime}</span>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose max-w-none mb-8">
              {blogData.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              ))}

              {showFullContent && (
                <>
                  <p className="text-gray-700 mb-4">
                    Whether you need 100 LPH (liters per hour) for a small facility or a 10,000+ LPH solution for an industrial setup, RO plants are highly scalable and customizable to specific business needs.
                  </p>

                  <div className=" p-6 rounded-xl my-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Key Features of Modern RO Plants
                    </h3>
                    <ul className="space-y-3">
                      {blogData.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mt-2 mr-2"></span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="mt-4 bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                {showFullContent ? "Show Less" : "Read Full Article"}
              </button> */}
            </div>

            {/* Comments Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Comments ({blogData.comments})
              </h3>

              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.date)}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
              <button className="text-orange-500  border hover:text-black border-orange-500  px-4 py-2 rounded-full">Load More</button>
            </div>

            {/* Comment Form */}
            <div className=" p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Leave a Comment
              </h4>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Your Comment
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg h-32"
                    placeholder="Share your thoughts..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Popular Tags */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Popular Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {["Water", "Filling", "Soft Drinks", "Packing", "Food", "Powder"].map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Our Gallery
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <img
                    key={item}
                    src="https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    alt="Gallery"
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
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