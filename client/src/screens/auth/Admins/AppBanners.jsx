import React, { useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const AppBanners = () => {
  const [activeBanner, setActiveBanner] = useState("main");
  const [addBanner, setAddBanner] = useState(false);

  const mainDummyBannerDetails = [
    {
      img: "https://edit.org/img/blog/1us-e-commerce-advertising-banners-editable.jpg",
      heading: "Dummy 1",
      this_banner_from: "Main Banner",
    },
    {
      img: "https://marketplace.canva.com/EAGTPnb3Pe8/2/0/1600w/canva-teal-orange-yellow-and-white-illustrative-e-commerce-trends-presentation-BmbteSOKUVE.jpg",
      heading: "Dummy 2",
      this_banner_from: "Main Banner",
    },
    {
      img: "https://i.pinimg.com/736x/76/1c/74/761c749dafe37daa7cd575491fbddb04.jpg",
      heading: "Dummy 3",
      this_banner_from: "Main Banner",
    },
    {
      img: "https://edit.org/img/blog/byz-e-commerce-banner-design-editable.webp",
      heading: "Dummy 4",
      this_banner_from: "Main Banner",
    },
    {
      img: "https://previews.123rf.com/images/liravega258/liravega2581701/liravega258170100013/69265219-word-sale-for-website-banners-flat-line-business-illustration-design-and-infographic-elements-for.jpg",
      heading: "Dummy 5",
      this_banner_from: "Main Banner",
    },
    {
      img: "https://www.zilliondesigns.com/blog/wp-content/uploads/Promotional-banner.png",
      heading: "Dummy 6",
      this_banner_from: "Main Banner",
    },
  ];

  const sideDummyBannerDetails = mainDummyBannerDetails.slice(3, 6);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Banners
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your banners</p>
        </div>
        <div>
          <button
            className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
            onClick={() => setAddBanner(true)}
          >
            <FiPlus className="mr-2" />
            Add Banner
          </button>
        </div>
      </div>

      {/* Banner Division */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveBanner("main")}
          className={`px-4 py-2 font-medium ${
            activeBanner === "main"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-700"
          }`}
        >
          Main Banners
        </button>
        <button
          onClick={() => setActiveBanner("side")}
          className={`px-4 py-2 font-medium ${
            activeBanner === "side"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-700"
          }`}
        >
          Side Banners
        </button>
      </div>

      <div className="bg-white ">
        {activeBanner === "main" && (
          <div className="grid grid-cols-3 gap-4">
            {mainDummyBannerDetails.map((dummy, index) => (
              <div
                className="relative group rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:duration-300"
                key={index}
              >
                <div className="absolute top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-transform">
                  <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                    <FiEdit className="text-blue-600" />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                    <FiTrash2 className="text-red-600" />
                  </button>
                </div>
                <div>
                  <img
                    src={dummy.img}
                    alt={dummy.heading}
                    className="w-full h-[200px] rounded-t-lg"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-lg pl-3 pt-4">
                    {dummy.heading}
                  </h1>
                </div>
                <div>
                  <p className="pl-3 pb-4 text-gray-600">
                    {dummy.this_banner_from}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeBanner === "side" && (
          <div className="grid grid-cols-3 gap-4">
            {sideDummyBannerDetails.map((dummy, index) => (
              <div
                className="relative group rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:duration-300"
                key={index}
              >
                <div className="absolute top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-transform">
                  <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                    <FiEdit className="text-blue-600" />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                    <FiTrash2 className="text-red-600" />
                  </button>
                </div>
                <div>
                  <img
                    src={dummy.img}
                    alt={dummy.heading}
                    className="w-full h-[200px] rounded-t-lg"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-lg pl-3 pt-4">
                    {dummy.heading}
                  </h1>
                </div>
                <div>
                  <p className="pl-3 pb-4 text-gray-600">
                    {dummy.this_banner_from}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {addBanner && (
        <div className="inset-0 backdrop-blur-sm bg-black bg-opacity-50 z-50 fixed flex items-center justify-center">
          <div
            className="bg-white rounded-lg w-auto h-auto"
            onClick={(e) => e.stopPropagation(true)}
          >
            <div>
              <div className="px-6 py-4 rounded-t-lg flex justify-between items-center">
                <h1 className="text-left font-semibold text-lg text-blue-600">
                  Add Banner
                </h1>
                <IoClose
                  size={25}
                  onClick={() => setAddBanner(false)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                />
              </div>
              <hr />
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p>Banner Type</p>
                  <select
                    name="Type"
                    id="type"
                    className="w-full border p-1 rounded"
                  >
                    <option value="main">Main Banner</option>
                    <option value="side">Side Banner</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p>Banner Name</p>
                  <input type="text" className="w-full border p-1 rounded" />
                </div>
                <div className="space-y-2">
                  <p>Banner Image</p>
                  <input
                    type="file"
                    className="w-full border p-1 rounded pb-2"
                  />
                </div>
              </div>
              <hr />
              <div className="flex justify-end items-center gap-4 py-5 px-6">
                <button
                  className="px-3 py-1 rounded-md bg-gray-300 text-blue-600 hover:bg-gray-400"
                  onClick={() => setAddBanner(false)}
                >
                  Cancel
                </button>
                <button className="px-3 py-1 rounded-md bg-blue-800 hover:bg-blue-950 text-white">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppBanners;
