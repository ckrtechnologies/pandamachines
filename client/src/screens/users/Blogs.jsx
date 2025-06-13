import React, { useState } from "react";
import { Home, ChevronRight, Heart, MessageCircle, Share2, Calendar, User, Clock } from "lucide-react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Industrial Automation: Trends to Watch in 2025",
      excerpt: "Discover the latest technological advancements shaping the industrial automation landscape and their impact on manufacturing efficiency.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?fm=jpg&q=80&w=800&h=600",
      author: "John Smith",
      date: "2024-12-15",
      readTime: "5 min read",
      category: "Technology",
      likes: 42,
      comments: 8
    },
    {
      id: 2,
      title: "Water Purification Systems: A Complete Guide for Industries",
      excerpt: "Everything you need to know about selecting the right water purification system for your industrial needs and maintenance best practices.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?fm=jpg&q=80&w=800&h=600",
      author: "Sarah Johnson",
      date: "2024-12-12",
      readTime: "7 min read",
      category: "Water Treatment",
      likes: 38,
      comments: 12
    },
    {
      id: 3,
      title: "Maximizing Efficiency in Food Processing Equipment",
      excerpt: "Learn proven strategies to optimize your food processing operations and reduce operational costs while maintaining quality standards.",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?fm=jpg&q=80&w=800&h=600",
      author: "Mike Wilson",
      date: "2024-12-10",
      readTime: "6 min read",
      category: "Food Processing",
      likes: 55,
      comments: 15
    },
    {
      id: 4,
      title: "Sustainable Manufacturing: Green Solutions for Modern Industries",
      excerpt: "Explore eco-friendly manufacturing practices and technologies that help reduce environmental impact while improving profitability.",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?fm=jpg&q=80&w=800&h=600",
      author: "Emily Davis",
      date: "2024-12-08",
      readTime: "8 min read",
      category: "Sustainability",
      likes: 67,
      comments: 20
    },
    {
      id: 5,
      title: "Quality Control in Manufacturing: Best Practices and Technologies",
      excerpt: "Implement effective quality control measures using modern technologies to ensure consistent product quality and customer satisfaction.",
      image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?fm=jpg&q=80&w=800&h=600",
      author: "David Chen",
      date: "2024-12-05",
      readTime: "9 min read",
      category: "Quality Control",
      likes: 33,
      comments: 7
    },
    {
      id: 7,
      title: "Maintenance Strategies for Industrial Equipment",
      excerpt: "Develop effective maintenance schedules and strategies to minimize downtime and extend the lifespan of your industrial equipment.",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?fm=jpg&q=80&w=800&h=600",
      author: "Robert Brown",
      date: "2024-12-01",
      readTime: "6 min read",
      category: "Maintenance",
      likes: 45,
      comments: 11
    },
    {
      id: 8,
      title: "Cost-Effective Solutions for Small Manufacturing Businesses",
      excerpt: "Discover budget-friendly equipment and strategies that help small manufacturers compete effectively in today's market.",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?fm=jpg&q=80&w=800&h=600",
      author: "Jennifer Lee",
      date: "2024-11-28",
      readTime: "5 min read",
      category: "Business",
      likes: 52,
      comments: 14
    }
  ];

  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (postId) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Water Treatment': 'bg-cyan-100 text-cyan-800',
      'Food Processing': 'bg-green-100 text-green-800',
      'Sustainability': 'bg-emerald-100 text-emerald-800',
      'Quality Control': 'bg-purple-100 text-purple-800',
      'IoT': 'bg-orange-100 text-orange-800',
      'Maintenance': 'bg-red-100 text-red-800',
      'Business': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <UserNavbar />
      <header className="bg-slate-700 text-white">
        <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-orange-400">Blogs</span>
          </nav>
        </div>
      </header>

      {/* Blog Posts Section */}
      <div className="px-4 xl:px-6 mb-6 pt-6 pb-10 bg-gradient-to-br from-[#E0F2EA] via-[#F9F0DC] to-[#FFF8F8]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 px-1">
          <div className="text-center w-full mb-4 md:mb-0">
            <h2 className="text-xl tracking-wide md:text-2xl font-bold text-gray-900 mb-2">
              Latest Industry Insights
            </h2>
            <p className="text-gray-600 text-sm md:text-base tracking-wide">
              Stay updated with the latest trends, tips, and insights from industry experts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col p-4"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Category Tag */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => toggleLike(post.id)}
                  className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition"
                  aria-label="Like post"
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors ${
                      likedPosts.includes(post.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600 hover:text-red-500'
                    }`} 
                  />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-md text-gray-900 line-clamp-2 mb-2 leading-tight">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3 mb-3 flex-grow">
                  {post.excerpt}
                </p>

                {/* Author and Date */}
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <User className="w-3 h-3 mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="mr-3">{formatDate(post.date)}</span>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{post.readTime}</span>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{post.comments}</span>
                    </div>
                  </div>

                  <button className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md transition-all duration-300 hover:bg-gray-200 hover:scale-110 cursor-pointer">
                    <Share2 className="w-4 h-4 text-gray-700 group-hover:text-black transition-colors" />
                  </button>
                </div>

                {/* Read More Button */}
                <div className="mt-auto">
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-4 py-2 rounded-md transition-colors duration-200">
                    <span className="text-sm tracking-wide font-medium">
                      Read Full Article
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AllUserFooter />
    </div>
  );
};

export default Blogs;