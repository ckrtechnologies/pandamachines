import axios from "axios";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import MainBanners from "../../../components/AdminSideComponents/AppBanner/MainBanners";
import SmallBanners from "../../../components/AdminSideComponents/AppBanner/SmallBanners";
import DeleteAlertModal from "../../../components/AdminSideComponents/Common/DeleteAlertModal";
import ModalButtonLoader from "../../../components/AdminSideComponents/Common/ModalButtonLoader";

// =====================================================
// BANNER MODAL
// =====================================================

const BannerModal = ({
  formBanner,
  setFormBanner,
  onSave,
  onClose,
  modalLoading,
  imageUploading,
  handleImageUpload,
  allBanners,
  error,
  isAddMode = false,
}) => {
  // ===================================================
  // CHECK BANNER LIMIT
  // ===================================================

  const isCurrentBannerTypeLimitReached = () => {
    const existingBanners = allBanners.filter(
      (b) =>
        b.bannerType === `${formBanner.bannerType}-banner`
    );

    if (
      formBanner.bannerType === "main" &&
      existingBanners.length >= 6
    ) {
      return true;
    }

    if (
      formBanner.bannerType === "small" &&
      existingBanners.length >= 4
    ) {
      return true;
    }

    return false;
  };

  // ===================================================
  // BANNER TYPE ERROR
  // ===================================================

  const getBannerTypeError = () => {
    if (!isAddMode) return null;

    const existingBanners = allBanners.filter(
      (b) =>
        b.bannerType === `${formBanner.bannerType}-banner`
    );

    if (
      formBanner.bannerType === "main" &&
      existingBanners.length >= 6
    ) {
      return "Maximum limit of 6 main banners reached.";
    }

    if (
      formBanner.bannerType === "small" &&
      existingBanners.length >= 4
    ) {
      return "Maximum limit of 4 small banners reached.";
    }

    return null;
  };

  const bannerTypeError = getBannerTypeError();

  const isLimitReached =
    isCurrentBannerTypeLimitReached();

  // ===================================================
  // UI
  // ===================================================

  return (
    <div
      className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-96 max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-primaryColor">
            {formBanner._id ? "Edit" : "Add"} Banner
          </h1>

          <IoClose
            className="cursor-pointer"
            size={24}
            onClick={onClose}
          />
        </div>

        <div className="space-y-4">
          {/* =================================================
              BANNER TYPE
          ================================================= */}

          <div>
            <label className="text-sm font-medium text-primaryColor">
              Banner Type
            </label>

            <select
              className="w-full border rounded p-2 mt-1"
              value={formBanner.bannerType}
              onChange={(e) =>
                setFormBanner((prev) => ({
                  ...prev,
                  bannerType: e.target.value,
                }))
              }
              disabled={modalLoading}
            >
              <option value="main">
                Main Banner
              </option>

              <option value="small">
                Small Banner
              </option>
            </select>
          </div>

          {/* =================================================
              BANNER NAME
          ================================================= */}

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
                setFormBanner((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Enter banner name"
              disabled={modalLoading}
            />
          </div>

          {/* =================================================
              BANNER IMAGE
          ================================================= */}

          <div>
            <label className="text-sm font-medium text-primaryColor">
              Banner Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border rounded p-2 mt-1"
              disabled={modalLoading || imageUploading}
            />

            {imageUploading && (
              <p className="text-gray-500 text-sm mt-2">
                Uploading image...
              </p>
            )}

            {formBanner.imgUrl && (
              <div className="mt-2">
                <img
                  src={formBanner.imgUrl}
                  alt="Banner preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>

          {/* =================================================
              PRODUCT ID
          ================================================= */}

          <div>
            <label className="text-sm font-medium text-primaryColor">
              Product ID
              <span className="text-gray-400 ml-1">
                (Optional)
              </span>
            </label>

            <input
              type="text"
              className="w-full border rounded p-2 mt-1"
              placeholder="Enter Product ID"
              autoComplete="off"
              value={formBanner?.productId || ""}
              onChange={(e) =>
                setFormBanner((prev) => ({
                  ...prev,
                  productId: e.target.value.trim(),
                }))
              }
              disabled={modalLoading}
            />

            <p className="text-xs text-gray-500 mt-1">
              Enter the MongoDB Product ID that should open
              when this banner is clicked.
            </p>

            {formBanner?.productId && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-xs text-green-700 break-all">
                  Linked Product ID:
                </p>

                <p className="text-xs text-green-600 break-all font-mono">
                  {formBanner.productId}
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              BANNER LIMIT ERROR
          ================================================= */}

          {bannerTypeError && (
            <p className="text-red-500 text-sm mt-1">
              {bannerTypeError}
            </p>
          )}
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* =================================================
            BUTTONS
        ================================================= */}

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
            className={`px-4 py-2 rounded bg-primaryBtnColor text-white hover:bg-primaryBtnHoverColor ${
              isAddMode && isLimitReached
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            disabled={
              modalLoading ||
              imageUploading ||
              !formBanner.name?.trim() ||
              !formBanner.imgUrl?.trim() ||
              (isAddMode && isLimitReached)
            }
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
};

// =====================================================
// APP BANNERS
// =====================================================

const AppBanners = () => {
  // ===================================================
  // ACTIVE TAB
  // ===================================================

  const [activeBanner, setActiveBanner] =
    useState("main");

  // ===================================================
  // BANNERS
  // ===================================================

  const [allBanners, setAllBanners] =
    useState([]);

  const [filteredBanners, setFilteredBanners] =
    useState([]);

  // ===================================================
  // MODALS
  // ===================================================

  const [addModalOpen, setAddModalOpen] =
    useState(false);

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  // ===================================================
  // SELECTED BANNER
  // ===================================================

  const [selectedBanner, setSelectedBanner] =
    useState(null);

  // ===================================================
  // LOADING
  // ===================================================

  const [isLoading, setIsLoading] =
    useState(true);

  const [imageUploading, setImageUploading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [modalLoading, setModalLoading] =
    useState(false);

  // ===================================================
  // ERROR
  // ===================================================

  const [error, setError] =
    useState("");

  // ===================================================
  // FORM STATE
  // ===================================================

  const [formBanner, setFormBanner] =
    useState({
      name: "",
      bannerType: "main",
      imgUrl: "",
      productId: "",
    });

  // ===================================================
  // FETCH BANNERS ON PAGE LOAD
  // ===================================================

  useEffect(() => {
    fetchBanners();
  }, []);

  // ===================================================
  // FILTER BANNERS
  // ===================================================

  useEffect(() => {
    const filtered = allBanners.filter(
      (b) =>
        b.bannerType ===
        `${activeBanner}-banner`
    );

    setFilteredBanners(filtered);
  }, [allBanners, activeBanner]);

  // ===================================================
  // GET ALL BANNERS
  // ===================================================

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/banners/all-banners`
      );

      console.log(
        "Fetched banners:",
        res.data
      );

      setAllBanners(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "Fetch banner error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch banners"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================================
  // IMAGE UPLOAD
  // ===================================================

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // -------------------------------------------------
    // IMAGE TYPE
    // -------------------------------------------------

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      e.target.value = "";
      return;
    }

    // -------------------------------------------------
    // IMAGE SIZE
    // -------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size should be less than 5MB."
      );

      e.target.value = "";
      return;
    }

    // -------------------------------------------------
    // START UPLOAD
    // -------------------------------------------------

    setImageUploading(true);
    setError("");

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "upload_preset",
      process.env.REACT_APP_UPLOAD_PRESET
    );

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        formData
      );

      console.log(
        "Cloudinary response:",
        res.data
      );

      setFormBanner((prev) => ({
        ...prev,
        imgUrl: res.data.secure_url,
      }));
    } catch (err) {
      console.error(
        "Image upload failed:",
        err
      );

      setError(
        err.response?.data?.error?.message ||
          "Failed to upload image. Please try again."
      );
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  // ===================================================
  // VALIDATE FORM
  // ===================================================

  const validateForm = () => {
    setError("");

    // -------------------------------------------------
    // BANNER NAME
    // -------------------------------------------------

    if (!formBanner.name?.trim()) {
      setError(
        "Banner name is required."
      );

      return false;
    }

    // -------------------------------------------------
    // IMAGE
    // -------------------------------------------------

    if (!formBanner.imgUrl?.trim()) {
      setError(
        "Banner image is required."
      );

      return false;
    }

    // -------------------------------------------------
    // PRODUCT ID
    // -------------------------------------------------

    if (formBanner.productId?.trim()) {
      const objectIdRegex =
        /^[0-9a-fA-F]{24}$/;

      if (
        !objectIdRegex.test(
          formBanner.productId.trim()
        )
      ) {
        setError(
          "Please enter a valid 24-character MongoDB Product ID."
        );

        return false;
      }
    }

    return true;
  };

  // ===================================================
  // CHECK BANNER LIMITS
  // ===================================================

  const checkBannerLimits = (
    bannerType
  ) => {
    const existingBanners =
      allBanners.filter(
        (b) =>
          b.bannerType ===
          `${bannerType}-banner`
      );

    if (
      bannerType === "main" &&
      existingBanners.length >= 6
    ) {
      setError(
        "Maximum limit of 6 main banners reached."
      );

      return false;
    }

    if (
      bannerType === "small" &&
      existingBanners.length >= 4
    ) {
      setError(
        "Maximum limit of 4 small banners reached."
      );

      return false;
    }

    return true;
  };

  // ===================================================
  // ADD BANNER
  // ===================================================

  const handleAddBanner = async () => {
    if (!validateForm()) {
      return;
    }

    if (
      !checkBannerLimits(
        formBanner.bannerType
      )
    ) {
      return;
    }

    try {
      setModalLoading(true);
      setError("");

      const productId =
        formBanner.productId?.trim();

      const bannerData = {
        name: formBanner.name.trim(),

        bannerType:
          `${formBanner.bannerType}-banner`,

        imgUrl:
          formBanner.imgUrl.trim(),

        // Send null when no product is selected
        productId:
          productId || null,
      };

      console.log(
        "Sending banner data:",
        bannerData
      );

      const response =
        await axios.post(
          `${process.env.REACT_APP_API_URL}/banners/create-banner`,
          bannerData
        );

      console.log(
        "Banner created:",
        response.data
      );

      await fetchBanners();

      setAddModalOpen(false);

      resetForm();
    } catch (err) {
      console.error(
        "Create banner failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create banner."
      );
    } finally {
      setModalLoading(false);
    }
  };

  // ===================================================
  // UPDATE BANNER
  // ===================================================

  const handleUpdateBanner = async () => {
    if (!formBanner?._id) {
      setError(
        "Banner ID is missing."
      );

      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setModalLoading(true);
      setError("");

      const productId =
        formBanner.productId?.trim();

      const bannerData = {
        name: formBanner.name.trim(),

        bannerType:
          `${formBanner.bannerType}-banner`,

        imgUrl:
          formBanner.imgUrl.trim(),

        productId:
          productId || null,
      };

      console.log(
        "Updating banner:",
        bannerData
      );

      const response =
        await axios.put(
          `${process.env.REACT_APP_API_URL}/banners/update-banner/${formBanner._id}`,
          bannerData
        );

      console.log(
        "Banner updated:",
        response.data
      );

      await fetchBanners();

      setEditModalOpen(false);

      resetForm();
    } catch (err) {
      console.error(
        "Update banner failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update banner."
      );
    } finally {
      setModalLoading(false);
    }
  };

  // ===================================================
  // DELETE BANNER
  // ===================================================

  const handleDeleteBanner = async () => {
    if (!selectedBanner?._id) {
      return;
    }

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
      console.error(
        "Delete banner failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete banner."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ===================================================
  // RESET FORM
  // ===================================================

  const resetForm = () => {
    setFormBanner({
      name: "",
      bannerType: "main",
      imgUrl: "",
      productId: "",
    });

    setError("");
  };

  // ===================================================
  // EDIT BANNER
  // ===================================================

  const handleEdit = (banner) => {
    if (!banner) {
      return;
    }

    /*
      productId can come from backend as:

      productId: "6a0c3279334e306a51b0baa9"

      OR after populate:

      productId: {
        _id: "6a0c3279334e306a51b0baa9",
        ...
      }
    */

    let productId = "";

    if (
      banner.productId &&
      typeof banner.productId === "object"
    ) {
      productId =
        banner.productId._id || "";
    } else {
      productId =
        banner.productId || "";
    }

    const formattedBanner = {
      _id:
        banner._id || "",

      name:
        banner.name || "",

      bannerType:
        banner.bannerType
          ?.replace("-banner", "") ||
        "main",

      imgUrl:
        banner.imgUrl || "",

      productId:
        productId,
    };

    console.log(
      "Editing banner:",
      formattedBanner
    );

    setFormBanner(
      formattedBanner
    );

    setError("");

    setEditModalOpen(true);
  };

  // ===================================================
  // DELETE CLICK
  // ===================================================

  const handleDelete = (banner) => {
    setSelectedBanner(
      banner
    );

    setDeleteModalOpen(
      true
    );
  };

  // ===================================================
  // OPEN ADD MODAL
  // ===================================================

  const openAddModal = () => {
    resetForm();

    setAddModalOpen(true);
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="p-4 md:p-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            All Banners
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your all banners
          </p>
        </div>

        <button
          className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
          onClick={openAddModal}
        >
          <FiPlus className="mr-2" />

          Add Banner
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && !addModalOpen && !editModalOpen && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* =================================================
          TABS
      ================================================= */}

      <div className="flex gap-4 mb-6">
        {["main", "small"].map(
          (type) => (
            <button
              key={type}
              onClick={() =>
                setActiveBanner(type)
              }
              className={`px-4 py-2 border-b-2 font-medium ${
                activeBanner === type
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent"
              }`}
            >
              {type
                .charAt(0)
                .toUpperCase() +
                type.slice(1)}{" "}
              Banners
            </button>
          )
        )}
      </div>

      {/* =================================================
          BANNER LIST
      ================================================= */}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map(
            (_, i) => (
              <div
                key={i}
                className="w-full h-[200px] bg-gray-200 rounded-lg animate-pulse"
              />
            )
          )}
        </div>
      ) : (
        <>
          {activeBanner === "main" ? (
            <MainBanners
              banners={
                filteredBanners
              }
              onEdit={
                handleEdit
              }
              onDelete={
                handleDelete
              }
            />
          ) : (
            <SmallBanners
              banners={
                filteredBanners
              }
              onEdit={
                handleEdit
              }
              onDelete={
                handleDelete
              }
            />
          )}
        </>
      )}

      {/* =================================================
          ADD MODAL
      ================================================= */}

      {addModalOpen && (
        <BannerModal
          formBanner={
            formBanner
          }
          setFormBanner={
            setFormBanner
          }
          onClose={() => {
            if (modalLoading) {
              return;
            }

            setAddModalOpen(
              false
            );

            resetForm();
          }}
          onSave={
            handleAddBanner
          }
          modalLoading={
            modalLoading
          }
          imageUploading={
            imageUploading
          }
          handleImageUpload={
            handleImageUpload
          }
          allBanners={
            allBanners
          }
          error={
            error
          }
          isAddMode={
            true
          }
        />
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editModalOpen && (
        <BannerModal
          formBanner={
            formBanner
          }
          setFormBanner={
            setFormBanner
          }
          onClose={() => {
            if (modalLoading) {
              return;
            }

            setEditModalOpen(
              false
            );

            resetForm();
          }}
          onSave={
            handleUpdateBanner
          }
          modalLoading={
            modalLoading
          }
          imageUploading={
            imageUploading
          }
          handleImageUpload={
            handleImageUpload
          }
          allBanners={
            allBanners
          }
          error={
            error
          }
          isAddMode={
            false
          }
        />
      )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      <DeleteAlertModal
        isOpen={
          deleteModalOpen
        }
        onClose={() => {
          if (!deleteLoading) {
            setDeleteModalOpen(
              false
            );
          }
        }}
        onConfirm={
          handleDeleteBanner
        }
        dltType="Banner"
        dltName={
          selectedBanner?.name
        }
        dltLoading={
          deleteLoading
        }
      />
    </div>
  );
};

export default AppBanners;