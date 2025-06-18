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

  const tags = [
    "Water",
    "Filling",
    "Soft Drinks",
    "Packing",
    "Food",
    "Powder",
    "Pouch",
    "RO",
    "Mineral",
    "Soya",
    "Juice",
  ];

  const blogData = {
    id: 2,
    title: "Water Purification Systems: A Complete Guide for Industries",
    content: [
      "In the ever-evolving landscape of industrial water solutions, Reverse Osmosis (RO) Water Purification Plants have emerged as the best-selling solution for clean and safe water, earning the trust of industries, businesses, and households alike over the past decade.",
      "RO plants use advanced membrane technology to remove dissolved salts, heavy metals, bacteria, and other impurities, delivering water that meets WHO and BIS standards. This technology has revolutionized water treatment across multiple sectors.",
      "From bottled water manufacturing units and pharmaceutical industries to commercial buildings and apartment complexes, RO plants have a wide range of industrial and commercial applications. Their versatility makes them indispensable in today's water treatment landscape.",
    ],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?fm=jpg&q=80&w=800&h=600",
    author: "Sarah Johnson",
    date: "2024-12-12",
    readTime: "7 min read",
    category: "Water Treatment",
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
      phone: "+29 562 2317",
      text: "This article perfectly summarizes why we chose RO systems for our manufacturing plant. The water quality improvement has been remarkable!",
      date: "2024-12-13",
    },
    {
      id: 2,
      name: "Dominant Industries",
      phone: "+34 740 2021",
      text: "We've been using RO systems for years, but the new digital monitoring features mentioned here are game-changers for large-scale operations.",
      date: "2024-12-14",
    },
    {
      id: 3,
      name: "Jamil Jamil",
      phone: "+27 842 2101",
      text: "The section on multi-stage filtration helped us understand why our previous system wasn't as effective. Great insights!",
      date: "2024-12-15",
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

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "bg-blue-100 text-blue-800",
      "Water Treatment": "bg-cyan-100 text-cyan-800",
      "Food Processing": "bg-green-100 text-green-800",
      Sustainability: "bg-emerald-100 text-emerald-800",
      "Quality Control": "bg-purple-100 text-purple-800",
      IoT: "bg-orange-100 text-orange-800",
      Maintenance: "bg-red-100 text-red-800",
      Business: "bg-indigo-100 text-indigo-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-rose-50 ">
      <UserNavbar />
      <header className="bg-slate-700 text-white">
        <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-orange-400">Blogs</span>
            <ChevronRight className="w-4 h-4" />
            <span>Water Purification</span>
          </nav>
        </div>
      </header>
      <div className="flex gap-4 mx-auto px-4 xl:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Blog Header */}
          <div className="mb-8">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
              <img
                src={blogData.image}
                alt={blogData.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleLike}
                  className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 mr-1 ${
                      liked ? "text-red-500 fill-red-500" : ""
                    }`}
                  />
                  <span>{likesCount}</span>
                </button>
                <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-5 h-5 mr-1" />
                  <span>{blogData.comments}</span>
                </button>
                <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {blogData.title}
            </h1>
          </div>
          <div className="flex items-center text-gray-600 mb-4 border border-gray-200 rounded-md px-4 py-6">
            <div className="flex items-center mr-4">
              <User className="w-4 h-4 mr-2" />
              <span className="font-semibold">{blogData.author}</span>
            </div>
            <div className="flex items-center mr-4">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(blogData.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{blogData.readTime}</span>
            </div>
          </div>
          {/* Blog Content */}
          <div className="prose max-w-none mb-12">
            {showFullContent ? (
              <>
                {blogData.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4">
                    {paragraph}
                  </p>
                ))}
                <p className="text-gray-700 mb-4">
                  Whether you need 100 LPH (liters per hour) for a small
                  facility or a 10,000+ LPH solution for an industrial setup, RO
                  plants are highly scalable and customizable to specific
                  business needs. The technology continues to evolve, with newer
                  models offering better energy efficiency and lower water
                  wastage.
                </p>

                <div className="bg-gray-50 p-6 rounded-xl my-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Key Features of Modern RO Plants
                  </h3>
                  <ul className="space-y-3">
                    {blogData.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 mr-2"></span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-4">{blogData.content[0]}</p>
                <p className="text-gray-700 mb-4">{blogData.content[1]}</p>
              </>
            )}

            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="mt-4 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-6 py-2 rounded-md transition-colors duration-200"
            >
              <span className="text-sm tracking-wide font-medium">
                {showFullContent ? "Show Less" : "Read Full Article"}
              </span>
            </button>
          </div>

          {/* Comment Form */}
          <div className=" p-6 rounded-xl shadow-sm border">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Leave a Comment
            </h4>

            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Your Comment
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32"
                  placeholder="Share your thoughts..."
                ></textarea>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="notify"
                  className="h-4 w-4 text-cyan-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="notify"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Notify me about new comments on this article
                </label>
              </div>

              <button
                type="submit"
                className="bg-orange-400 focus:ring-orange-500 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
              >
                Post Comment
              </button>
            </form>
          </div>
          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Comments ({blogData.comments})
            </h3>

            <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-gray-200 rounded-xl p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {comment.name}
                      </h4>
                      {/* <p className="text-sm text-gray-500">{comment.phone}</p> */}
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(comment.date)}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
              <button className="mt-4 inline-flex items-center justify-center gap-2  hover:bg-white border border-orange-400 text-black hover:text-orange-400 px-6 py-2 rounded-full transition-colors duration-200">
                Load More
              </button>
            </div>
          </div>
        </div>
        <div className=" max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm">
          {/* Popular Tags Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Popular Tag
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Our Gallery Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Our Gallery
            </h2>
            <div className="flex overflow-hidden gap-2">
                <img
              src="https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Gallery"
              className="max-w-[100px] h-[80px] object-cover"
            />
                <img
              src="https://media.istockphoto.com/id/510162486/photo/production-line-of-plastic-industry.jpg?s=612x612&w=0&k=20&c=n5y1V3eYDO7mBf1PR7Q-zARjqyxkWD4eKpe9UhKD6IM="
              alt="Gallery"
              className="max-w-[100px] h-[80px] object-cover"
            />
            <img
              src="https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Gallery"
              className="max-w-[100px] h-[80px] object-cover"
            />
            <img
              src="https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Gallery"
              className="max-w-[100px] h-[80px] object-cover"
            />
            </div>
          </div>
        </div>
      </div>

      <AllUserFooter />
    </div>
  );
};

export default BlogDetails;
