import {
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

const MainBanners = ({
  banners = [],
  onEdit,
  onDelete,
}) => {
  if (!banners.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">
          No main banners found
        </p>

        <p className="text-gray-400 text-sm">
          Add your first main banner
          to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {banners.map((banner) => {
        const productId =
          banner?.productId?._id ||
          banner?.productId ||
          "";

        return (
          <div
            key={banner._id}
            className="relative group rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={banner.imgUrl}
              alt={banner.name}
              className="w-full h-[200px] object-cover"
            />

            {/* ACTION BUTTONS */}

            <div className="absolute top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                type="button"
                onClick={() =>
                  onEdit &&
                  onEdit(banner)
                }
                className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
              >
                <FiEdit
                  className="text-blue-600"
                  size={16}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete &&
                  onDelete(banner)
                }
                className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
              >
                <FiTrash2
                  className="text-red-600"
                  size={16}
                />
              </button>
            </div>

            {/* BANNER INFO */}

            <div className="p-4 bg-white">
              <h2 className="font-semibold text-lg text-gray-800 truncate">
                {banner.name}
              </h2>

              <p className="text-sm text-gray-500 capitalize">
                {banner.bannerType}
              </p>

              {/* PRODUCT ID */}

              {productId ? (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-xs text-green-700">
                    Product ID
                  </p>

                  <p className="text-xs text-green-600 font-mono break-all">
                    {productId}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-2">
                  No product linked
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MainBanners;