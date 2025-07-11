import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const SmallBanners = ({ banners = [], onEdit, onDelete }) => {
  if (banners.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No small banners found</p>
        <p className="text-gray-400 text-sm">
          Add your first small banner to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {banners.map((banner) => (
        <div
          key={banner._id}
          className="relative group rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <img
            src={banner.imgUrl}
            alt={banner.name}
            className="w-full h-[200px] object-cover"
          />
          <div className="absolute top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit && onEdit(banner)}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
            >
              <FiEdit className="text-blue-600" size={16} />
            </button>
            <button
              onClick={() => onDelete && onDelete(banner)}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
            >
              <FiTrash2 className="text-red-600" size={16} />
            </button>
          </div>
          <div className="p-4 bg-white">
            <h2 className="font-semibold text-lg text-gray-800 truncate">
              {banner.name}
            </h2>
            <p className="text-sm text-gray-500 capitalize">
              {banner.bannerType}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmallBanners;
