import React, { useState } from "react";
import { Star, Play, User, ShoppingBag, FileText } from "lucide-react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";

const ProductDetails = () => {
  const products = [
    {
      id: 1,
      name: "Wireless Bluetooth",
      price: 89.99,
      rating: 4.5,
      image: "https://gesrepair.com/wp-content/uploads/bigstock-140745698.jpg",
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 199.99,
      rating: 4.2,
      image:
        "https://plus.unsplash.com/premium_photo-1682144572574-2305752c0f63?fm=jpg&q=60&w=3000",
    },
    {
      id: 3,
      name: "Ultra HD 4K Camera",
      price: 349.99,
      rating: 4.8,
      image:
        "https://cf-images.eu-west-1.prod.boltdns.net/v1/static/1813624294001/2c89c066-8491-4680-8040-3be63b2d44e6/f956c882-92b6-43ec-9404-b40d6bafa6ff/1280x720/match/image.jpg",
    },
    {
      id: 4,
      name: "Ergonomic Keyboard",
      price: 59.99,
      rating: 4.3,
      image:
        "https://img.freepik.com/premium-photo/printing-house_692498-5564.jpg",
    },
    {
      id: 5,
      name: "Noise Cancelling Earbuds",
      price: 129.99,
      rating: 4.7,
      image:
        "https://img.freepik.com/premium-photo/control-panel-equipment_692498-4452.jpg",
    },
  ];

  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <FaStar
            key={i}
            size={14}
            className={
              ratingValue <= rating
                ? "text-yellow-400"
                : ratingValue - 0.5 <= rating
                ? "text-yellow-400 opacity-60"
                : "text-gray-300"
            }
          />
        );
      })}
    </div>
  );

  return (
    <React.Fragment>
      <UserNavbar />
      <div className="bg-rose-50 min-h-screen px-4 md:px-6 xl:px-6 py-4">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className=" rounded border">
                {/* Product Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <div>
                    <div className="bg-gray-100 rounded-lg mb-4 h-80 overflow-hidden shadow-md">
                      <img
                        src="https://plus.unsplash.com/premium_photo-1681426673022-db3d911ea11a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Water Purification RO Plant"
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="w-16 md:w-28 h-16 bg-gray-200 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer"
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <h1 className="text-xl font-bold mb-2">
                      Water Purification RO Plant
                    </h1>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">4 Reviews</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold">₹80,000</span>
                      <span className="text-sm text-gray-500">/Unit</span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        Discount
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Brand:</span>
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Share:</span>
                        <div className="flex gap-2">
                          <FaWhatsapp
                            size={20}
                            color="green"
                            className="cursor-pointer hover:scale-110 transition"
                          />
                          <FaFacebookSquare
                            size={20}
                            color="blue"
                            className="cursor-pointer hover:scale-110 transition"
                          />
                          <IoLogoInstagram
                            size={20}
                            color="pink"
                            className="cursor-pointer hover:scale-110 transition"
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      The Industrial Soda Bottle Filling Machine is an automatic
                      grade machine with a control system operated through a
                      human machine interface. Made of durable metal, this
                      machine is designed to provide lower energy consumption
                      and high efficiency in filling soda bottles.
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm">
                        <button className="px-3 py-1 hover:bg-gray-200 transition">
                          -
                        </button>
                        <span className="px-3 py-1">01</span>
                        <button className="px-3 py-1 hover:bg-gray-200 transition">
                          +
                        </button>
                      </div>

                      <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform">
                        Add to Cart
                        <ShoppingBag size={14} />
                      </button>

                      <button className="border px-4 py-2 text-sm rounded-full hover:bg-gray-100 transition duration-300">
                        Buy Now
                      </button>

                      <FileText
                        size={20}
                        className="text-blue-600 hover:scale-110 transition-transform duration-300 cursor-pointer"
                      />
                    </div>

                    <div className="text-sm pt-4 border-t">
                      <div className="mb-1">
                        <span className="font-medium">Categories: </span>
                        <span className="text-gray-600">RO Plant</span>
                      </div>
                      <div>
                        <span className="font-medium">Tag: </span>
                        <span className="text-gray-600">Field 1, Field 2</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs Section */}
                <div className="border-t">
                  <div className="flex justify-center md:pt-2 border-b">
                    <button className="px-6 py-3 text-sm font-medium text-orange-600 border-b-2 border-orange-600 transition-colors">
                      Descriptions
                    </button>
                    <button className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-orange-600 transition">
                      Additional Information
                    </button>
                    <button className="px-6 py-3 text-sm font-medium text-gray-600 relative hover:text-orange-600 transition">
                      Customer feedback
                      <span className="absolute -top-1 -right-2 bg-orange-100 text-orange-600 text-xs px-1 rounded-full">
                        4
                      </span>
                    </button>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-700 mb-6">
                      The Industrial Soda Bottle Filling Machine is an automatic
                      grade machine with a control system operated through a
                      human machine interface. Made of durable metal, this
                      machine is designed to provide lower energy consumption
                      and high efficiency in filling soda bottles. With advanced
                      technology and reliable performance, this machine ensures
                      efficient production processes.
                    </p>

                    <h3 className="font-bold text-lg mb-4">Product Details</h3>

                    <div className="grid gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">
                          Industrial Soda Bottle Filling Machine Product
                          Specifications
                        </h4>
                        <div className="text-sm">
                          {[
                            { label: "Warranty", value: "Yes" },
                            { label: "Automatic Grade", value: "Automatic" },
                            {
                              label: "Control System",
                              value: "Human Machine Interface",
                            },
                            {
                              label: "Product Type",
                              value: "Industrial Soda Bottle Filling Machine",
                            },
                            { label: "Material", value: "Metal" },
                            {
                              label: "Lower Energy Consumption",
                              value: "High Efficiency",
                            },
                          ].map((spec, index) => (
                            <div
                              key={index}
                              className="flex py-1 border-b border-gray-100"
                            >
                              <span className="text-gray-600 font-bold w-48">
                                {spec.label}
                              </span>
                              <span className="text-gray-900">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">
                          Industrial Soda Bottle Filling Machine Trade
                          Information
                        </h4>
                        <div className="text-sm">
                          {[
                            {
                              label: "Payment Terms",
                              value: "Cash Advance (CA)",
                            },
                            { label: "Delivery Time", value: "20 Days" },
                            { label: "Supply Ability", value: "10 Per Month" },
                            {
                              label: "Main Domestic Market",
                              value: "All India",
                            },
                          ].map((info, index) => (
                            <div
                              key={index}
                              className="flex py-1 border-b border-gray-100"
                            >
                              <span className="text-gray-600 font-bold w-48">
                                {info.label}
                              </span>
                              <span className="text-gray-900">
                                {info.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Sidebar - Right 1/3 */}
            <div className="space-y-4">
              {/* Video Section */}
              <div className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gray-100 h-32 flex items-center justify-center relative">
                  <button className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-xl hover:bg-orange-600">
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  </button>
                </div>
              </div>

              {/* Expert Call Section */}
              <div className="bg-white rounded-lg border p-4 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-sm mb-3">
                  Talk To Our Expert On Video Call!
                </h3>
                <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform">
                  Book Consultation
                </button>
              </div>

              {/* Quote Form */}
              <div className="bg-white rounded-lg border shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="bg-orange-50 p-6 rounded-t-lg">
                  <h3 className="text-center font-bold text-base mb-6 text-gray-800">
                    Enter Your Details &<br />
                    Download Free{" "}
                    <span className="text-orange-500">Quotation</span>
                  </h3>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      type="email"
                      placeholder="Email ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <textarea
                      placeholder="Address"
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button className="w-full bg-orange-500 text-white py-2 rounded-md text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 transform">
                      Download Quotation
                    </button>
                  </div>
                </div>
              </div>

              {/* Technical Support */}
              <div className="bg-white rounded-lg border p-4 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-sm mb-4 text-gray-800">
                  Technical Operators Are Provided
                </h3>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm shadow-md hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform">
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 text-gray-900 text-xl md:text-3xl tracking-wide font-semibold">
            Related Products
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:py-12">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-md overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-md text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      {renderStars(product.rating)}
                      <span className="ml-2">{product.rating.toFixed(1)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-2 bg-[#dbe5ec] backdrop-blur-sm text-gray-600 hover:text-red-500 rounded-full shadow-xl transition-all duration-300 hover:bg-gray-200 hover:scale-110"
                        aria-label="Add to wishlist"
                      >
                        {wishlist.includes(product.id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="" />
                        )}
                      </button>

                      <div className="bg-[#dbe5ec] backdrop-blur-sm p-2 rounded-full shadow-xl transition-all duration-300 hover:bg-gray-200 hover:scale-110 cursor-pointer">
                        <FaShoppingCart className="text-gray-700 text-sm group-hover:text-black transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#FFBCA0] text-white hover:text-gray-900 px-4 py-2 rounded-md transition duration-200">
                      <BiSolidPurchaseTag />
                      <span className="text-sm tracking-wide font-medium">
                        Buy Now
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AllUserFooter />
    </React.Fragment>
  );
};

export default ProductDetails;
