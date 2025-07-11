import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import ModalButtonLoader from "../../../components/AdminSideComponents/Common/ModalButtonLoader";
import DeleteAlertModal from "../../../components/AdminSideComponents/Common/DeleteAlertModal";
import MainBanners from "../../../components/AdminSideComponents/AppBanner/MainBanners";
import SmallBanners from "../../../components/AdminSideComponents/AppBanner/SmallBanners";

const BannerModal = ({
  formBanner,
  setFormBanner,
  onSave,
  onClose,
  modalLoading,
  imageUploading,
  handleImageUpload,
}) => (
  <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
    <div
      className="w-96 rounded-lg bg-white shadow-lg p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-primaryColor">
          {formBanner._id ? "Save" : "Add"} Banner
        </h1>
        <IoClose className="cursor-pointer" size={24} onClick={onClose} />
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-primaryColor">
            Banner Type
          </label>
          <select
            className="w-full border rounded p-2 mt-1"
            value={formBanner.bannerType}
            onChange={(e) =>
              setFormBanner({ ...formBanner, bannerType: e.target.value })
            }
          >
            <option value="main">Main Banner</option>
            <option value="small">Small Banner</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-primaryColor">
            Banner Name
          </label>
          <input
            className="w-full border rounded p-2 mt-1"
            type="text"
            autoComplete="off"
            value={formBanner?.name || ""}
            onChange={(e) =>
              setFormBanner({ ...formBanner, name: e.target.value })
            }
            placeholder="Enter banner name"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-primaryColor">
            Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border rounded p-2 mt-1"
          />
          {imageUploading && (
            <p className="text-gray-500 text-sm mt-2">Uploading image...</p>
          )}
          {formBanner.imgUrl && (
            <img
              src={formBanner.imgUrl}
              alt="Banner preview"
              className="w-16 h-16 mt-2 object-cover rounded"
            />
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-300 text-primaryColor hover:bg-gray-400"
          disabled={modalLoading}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 rounded bg-primaryBtnColor text-white hover:bg-primaryBtnHoverColor"
          disabled={modalLoading || imageUploading || !formBanner.name.trim()}
        >
          {modalLoading ? (
            <ModalButtonLoader />
          ) : formBanner._id ? (
            "Save"
          ) : (
            "Add"
          )}
        </button>
      </div>
    </div>
  </div>
);

const AppBanners = () => {
  const [activeBanner, setActiveBanner] = useState("main");
  const [allBanners, setAllBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState("");

  const [formBanner, setFormBanner] = useState({
    name: "",
    bannerType: "main",
    imgUrl: "",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    const filtered = allBanners.filter(
      (b) => b.bannerType === `${activeBanner}-banner`
    );
    setFilteredBanners(filtered);
  }, [allBanners, activeBanner]);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/banners/all-banners`
      );
      setAllBanners(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch banners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setImageUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dqxlte6wf/image/upload",
        formData
      );
      setFormBanner((prev) => ({ ...prev, imgUrl: res.data.secure_url }));
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = () => {
    if (!formBanner.name.trim()) {
      setError("Banner name is required");
      return false;
    }
    if (!formBanner.imgUrl.trim()) {
      setError("Banner image is required");
      return false;
    }
    return true;
  };

  const handleAddBanner = async () => {
    if (!validateForm()) return;

    try {
      setModalLoading(true);
      setError("");

      // Transform bannerType to match backend format
      const bannerData = {
        ...formBanner,
        bannerType: `${formBanner.bannerType}-banner`,
      };

      console.log("Sending banner data:", bannerData); // Debug log

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/banners/create-banner`,
        bannerData
      );

      console.log("Banner created successfully:", response.data); // Debug log

      await fetchBanners();
      setAddModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Create failed:", err);
      setError(err.response?.data?.message || "Failed to create banner");
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateBanner = async () => {
    if (!validateForm()) return;

    try {
      setModalLoading(true);
      setError("");

      const bannerData = {
        name: formBanner.name,
        bannerType: `${formBanner.bannerType}-banner`,
        imgUrl: formBanner.imgUrl,
      };

      console.log("Updating banner data:", bannerData); // Debug log

      await axios.put(
        `${process.env.REACT_APP_API_URL}/banners/update-banner/${formBanner._id}`,
        bannerData
      );

      await fetchBanners();
      setEditModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Failed to update banner");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteBanner = async () => {
    try {
      setDeleteLoading(true);
      setError("");

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/banners/delete-banner/${selectedBanner._id}`
      );

      await fetchBanners();
      setDeleteModalOpen(false);
      setSelectedBanner(null);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err.response?.data?.message || "Failed to delete banner");
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetForm = () => {
    setFormBanner({
      name: "",
      bannerType: "main",
      imgUrl: "",
    });
    setError("");
  };

  const handleEdit = (banner) => {
    // Transform bannerType back to simple format for the form
    const formattedBanner = {
      ...banner,
      bannerType: banner.bannerType.replace("-banner", ""),
    };
    setFormBanner(formattedBanner);
    setEditModalOpen(true);
  };

  const handleDelete = (banner) => {
    setSelectedBanner(banner);
    setDeleteModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Banners
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your all banners</p>
        </div>
        <button
          className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
          onClick={() => {
            resetForm();
            setAddModalOpen(true);
          }}
        >
          <FiPlus className="mr-2" /> Add Banner
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        {["main", "small"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveBanner(type)}
            className={`px-4 py-2 border-b-2 font-medium ${
              activeBanner === type
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Banners
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full h-[200px] bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {activeBanner === "main" ? (
            <MainBanners
              banners={filteredBanners}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <SmallBanners
              banners={filteredBanners}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}

      {addModalOpen && (
        <BannerModal
          formBanner={formBanner}
          setFormBanner={setFormBanner}
          onClose={() => {
            setAddModalOpen(false);
            resetForm();
          }}
          onSave={handleAddBanner}
          modalLoading={modalLoading}
          imageUploading={imageUploading}
          handleImageUpload={handleImageUpload}
        />
      )}
      {editModalOpen && (
        <BannerModal
          formBanner={formBanner}
          setFormBanner={setFormBanner}
          onClose={() => {
            setEditModalOpen(false);
            resetForm();
          }}
          onSave={handleUpdateBanner}
          modalLoading={modalLoading}
          imageUploading={imageUploading}
          handleImageUpload={handleImageUpload}
        />
      )}
      <DeleteAlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteBanner}
        dltType="Banner"
        dltName={selectedBanner?.name}
        dltLoading={deleteLoading}
      />
    </div>
  );
};

export default AppBanners;
