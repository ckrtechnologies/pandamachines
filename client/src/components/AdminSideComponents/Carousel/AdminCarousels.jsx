import axios from "axios";
import { useEffect, useState } from "react";
import { FiEdit, FiInbox, FiPlus, FiTrash2 } from "react-icons/fi";
import DeleteAlertModal from "../../../components/AdminSideComponents/Common/DeleteAlertModal";
import AddCarouselModal from "./AddCarouselModal";
import EditCarouselModal from "./EditCarouselModal";

const AdminCarousels = () => {
  const [dummyCarouselDetails, setDummyCarouselDetails] = useState([]);
  const [isAddCarouselModalOpen, setIsAddCarouselModalOpen] = useState(false);
  const [isEditCarouselModalOpen, setIsEditCarouselModalOpen] = useState(false);
  const [isDeleteCarouselModalOpen, setIsDeleteCarouselModalOpen] =
    useState(false);
  const [selectedCarouselId, setSelectedCarouselId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [carouselToDelete, setCarouselToDelete] = useState(null);
  const [dltLoading, setDltLoading] = useState(false);

  const allCarousels = () => {
    setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/carousel/get-all-carousel`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        setDummyCarouselDetails(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    allCarousels();
  }, []);

  const handleDelete = () => {
    setDltLoading(true);
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/carousel/delete-carousel/${carouselToDelete._id}`,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        allCarousels();
        setIsDeleteCarouselModalOpen(false);
        setDltLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setDltLoading(false);
      });
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Carousels
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your carousels
          </p>
        </div>
        <div>
          <button
            className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
            onClick={() => setIsAddCarouselModalOpen(true)}
          >
            <FiPlus className="mr-2" />
            Add Carousel
          </button>
        </div>
      </div>
      {loading ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-[200px] bg-gray-300 w-full"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded w-full m-4"></div>
                </div>
              ))}
          </div>
        </div>
      ) : dummyCarouselDetails.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FiInbox className="text-gray-400 text-6xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No carousels found
          </h2>
          <p className="text-gray-500 text-center max-w-sm">
            It looks like you haven't added any carousels yet. Click the button
            above to create your first carousel!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {dummyCarouselDetails.map((data, index) => (
            <div
              className="relative group rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:duration-300"
              key={index}
            >
              <div className="absolute top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-transform">
                <button
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCarouselId(data._id);
                    setIsEditCarouselModalOpen(true);
                  }}
                >
                  <FiEdit className="text-blue-600" />
                </button>

                <button
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                  onClick={() => {
                    setCarouselToDelete(data);
                    setIsDeleteCarouselModalOpen(true);
                  }}
                >
                  <FiTrash2 className="text-red-600" />
                </button>
              </div>
              <div>
                <img
                  src={data.image}
                  alt={data.title}
                  className="h-[200px] w-[300px] object-cover"
                />
              </div>
              <div>
                <h1 className="font-semibold px-2 py-4">
                  {data.title.split(" ").slice(0, 10).join(" ") +
                    (data.title.split(" ").length > 10 ? "..." : "")}
                </h1>
              </div>
            </div>
          ))}
        </div>
      )}
      <AddCarouselModal
        isOpen={isAddCarouselModalOpen}
        setIsAddModalOpen={setIsAddCarouselModalOpen}
        refetchCarousels={allCarousels}
      />
      <EditCarouselModal
        isOpen={isEditCarouselModalOpen}
        setIsEditModalOpen={setIsEditCarouselModalOpen}
        carouselId={selectedCarouselId}
        refetchCarousels={allCarousels}
      />
      <DeleteAlertModal
        isOpen={isDeleteCarouselModalOpen}
        onClose={() => setIsDeleteCarouselModalOpen(false)}
        dltType="carousel"
        dltName={carouselToDelete?.title}
        onConfirm={handleDelete}
        dltLoading={dltLoading}
      />
    </div>
  );
};

export default AdminCarousels;
