import axios from "axios";
import ModalButtonLoader from "../Common/ModalButtonLoader";
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="mb-4 px-6 pt-2">
    <label className="block text-sm font-medium tracking-wide text-primaryColor">
      {label}
    </label>
    <input
      className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const EditSubCatModal = ({
  catId,
  catName,
  setIsModalOpen,
  refreshFun,
  subCatId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editMdlLoading, setEditMdlLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({
    name: "",
    imgUrl: "",
    description: "",
    categoryId: catId,
  });

  useEffect(() => {
    fetchCategories();
    if (subCatId) {
      fetchSubCategoryById();
    }
  }, [subCatId]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubCategoryById = async () => {
    setEditMdlLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-category-by-id/${subCatId}`
      );
      setCategoryData({
        name: response?.data?.name || "",
        imgUrl: response?.data?.imgUrl || "",
        description: response?.data?.description || "",
        categoryId: response?.data?.categoryId || catId || "",
      });
    } catch (error) {
      console.error("Error fetching sub-category:", error);
    } finally {
      setEditMdlLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        formData
      );
      setCategoryData((prevData) => ({
        ...prevData,
        imgUrl: response.data.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryData.name.trim()) {
      alert("Please enter a sub-category name");
      return;
    }
    if (!categoryData.categoryId) {
      alert("Please select a category");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/sub-categories/update-sub-category/${subCatId}`,
        categoryData,
        { headers: { "Content-Type": "application/json" } }
      );
      refreshFun();
      setIsModalOpen();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update sub-category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen();
  };

  const getSelectedCategoryName = () => {
    const selectedCategory = categories.find(
      (cat) => cat._id === categoryData.categoryId
    );
    return selectedCategory ? selectedCategory.name : "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
      {editMdlLoading ? (
        <div className="w-96 rounded-lg bg-white shadow-lg">
          <div className="mb-4 flex w-full items-center justify-between px-6 pt-6">
            <h2 className="text-lg font-semibold tracking-normal text-primary">
              Edit Sub Category
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-600 transition duration-150 hover:text-gray-800"
            >
              <MdClose size={22} />
            </button>
          </div>
          <hr className="border-t-1 my-2 border-gray-300" />
          <SkeletonLoader />
        </div>
      ) : (
        <div className="w-96 rounded-lg bg-white shadow-lg">
          <div className="mb-4 flex w-full items-center justify-between px-6 pt-6">
            <h2 className="text-lg font-semibold tracking-normal text-primary">
              Edit Sub Category
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-600 transition duration-150 hover:text-gray-800"
            >
              <MdClose size={22} />
            </button>
          </div>
          <hr className="border-t-1 my-2 border-gray-300" />

          {/* Category Selection Dropdown */}
          <div className="mb-4 px-6 pt-2">
            <label className="block text-sm font-medium tracking-wide text-primaryColor">
              Select Category
            </label>
            {loadingCategories ? (
              <div className="mt-2">
                <div className="animate-pulse h-10 bg-gray-200 w-full rounded"></div>
              </div>
            ) : (
              <select
                className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                value={categoryData.categoryId}
                onChange={(e) =>
                  setCategoryData({
                    ...categoryData,
                    categoryId: e.target.value,
                  })
                }
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {categoryData.categoryId && (
            <div className="mx-6 rounded border-2 border-dotted border-primary py-2 text-center text-sm font-semibold tracking-normal text-primaryColor">
              Category - {getSelectedCategoryName()}
            </div>
          )}

          <InputField
            label="Sub Category Name"
            value={categoryData.name}
            onChange={(e) =>
              setCategoryData({ ...categoryData, name: e.target.value })
            }
          />
          <div className="mb-4 px-6">
            <label className="block text-sm font-medium tracking-wide text-primaryColor">
              Upload Image
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="mt-2 w-full"
            />
            {categoryData.imgUrl && (
              <img
                src={categoryData.imgUrl}
                alt="Uploaded"
                className="mt-2 w-10 h-10 object-contain rounded"
              />
            )}
          </div>
          <div className="mb-4 px-6">
            <label className="block text-sm font-medium tracking-wide text-primaryColor">
              Description
            </label>
            <textarea
              className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={categoryData.description}
              onChange={(e) =>
                setCategoryData({
                  ...categoryData,
                  description: e.target.value,
                })
              }
              placeholder="Category description"
            />
          </div>
          <hr className="border-t-1 my-4 border-gray-300" />
          <div className="flex justify-end gap-2 px-6 pb-6 font-medium tracking-wide">
            <button
              className="rounded bg-gray-300 px-4 py-2 text-primaryColor duration-150 hover:bg-gray-400"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              className="rounded bg-primaryBtnColor px-4 text-white duration-150 hover:bg-primaryBtnHoverColor disabled:opacity-50"
              onClick={handleSaveCategory}
              disabled={
                isLoading ||
                !categoryData.categoryId ||
                !categoryData.name.trim()
              }
            >
              {isLoading ? <ModalButtonLoader /> : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSubCatModal;

const SkeletonLoader = () => {
  return (
    <div className="w-full max-w-md animate-pulse rounded-lg bg-white px-6 py-3 shadow-lg">
      <div className="mb-6">
        <div className="border-gray-300p-3 flex items-center justify-center rounded-lg border p-3">
          <div className="h-4 w-60 rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-2 h-3 w-32 rounded bg-gray-200"></div>
          <div className="h-6 w-full rounded bg-gray-200"></div>
        </div>

        <div>
          <div className="mb-2 h-3 w-24 rounded bg-gray-200"></div>
          <div className="h-8 w-full rounded bg-gray-200"></div>
        </div>

        <div>
          <div className="mb-2 h-4 w-28 rounded bg-gray-200"></div>
          <div className="h-14 w-full rounded bg-gray-200"></div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <div className="h-8 w-24 rounded bg-gray-200"></div>
          <div className="h-8 w-24 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

// import axios from "axios";
// import ModalButtonLoader from "../Common/ModalButtonLoader";
// import React, { useState, useEffect } from "react";
// import { MdClose } from "react-icons/md";

// const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
//   <div className="mb-4 px-6 pt-2">
//     <label className="block text-sm font-medium tracking-wide text-primaryColor">
//       {label}
//     </label>
//     <input
//       className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
//       type={type}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//     />
//   </div>
// );

// const EditSubCatModal = ({
//   catId,
//   catName,
//   setIsModalOpen,
//   refreshFun,
//   subCatId,
// }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [editMdlLoading, setEditMdlLoading] = useState(false);
//   const [categoryData, setCategoryData] = useState({
//     name: "",
//     imgUrl: "",
//     description: "",
//     categoryId: catId,
//   });

//   useEffect(() => {
//     if (subCatId) {
//       fetchSubCategoryById();
//     }
//   }, [subCatId]);

//   const fetchSubCategoryById = async () => {
//     setEditMdlLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/sub-categories/get-sub-category-by-id/${subCatId}`
//       );
//       setCategoryData({
//         name: response?.data?.name || "",
//         imgUrl: response?.data?.imgUrl || "",
//         description: response?.data?.description || "",
//         categoryId: catId || "",
//       });
//     } catch (error) {
//       console.error("Error fetching sub-category:", error);
//     } finally {
//       setEditMdlLoading(false);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

//     try {
//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
//         formData
//       );
//       setCategoryData((prevData) => ({
//         ...prevData,
//         imgUrl: response.data.secure_url,
//       }));
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   const handleSaveCategory = async () => {
//     setIsLoading(true);
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API_URL}/sub-categories/update-sub-category/${subCatId}`,
//         categoryData,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       refreshFun();
//       setIsModalOpen();
//     } catch (error) {
//       console.error("Error updating category:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c0806] bg-opacity-60 backdrop-blur-sm">
//       {editMdlLoading ? (
//         <div className="w-96 rounded-lg bg-white shadow-lg">
//           <div className="mb-4 flex w-full items-center justify-between px-6 pt-6">
//             <h2 className="text-lg font-semibold tracking-normal text-primary">
//               Edit Sub Category
//             </h2>
//             <button
//               onClick={handleCloseModal}
//               className="text-gray-600 transition duration-150 hover:text-gray-800"
//             >
//               <MdClose size={22} />
//             </button>
//           </div>
//           <hr className="border-t-1 my-2 border-gray-300" />
//           <SkeletonLoader />
//         </div>
//       ) : (
//         <div className="w-96 rounded-lg bg-white shadow-lg">
//           <div className="mb-4 flex w-full items-center justify-between px-6 pt-6">
//             <h2 className="text-lg font-semibold tracking-normal text-primary">
//               Edit Sub Category
//             </h2>
//             <button
//               onClick={handleCloseModal}
//               className="text-gray-600 transition duration-150 hover:text-gray-800"
//             >
//               <MdClose size={22} />
//             </button>
//           </div>
//           <hr className="border-t-1 my-2 border-gray-300" />
//           <div className="mx-6 rounded border-2 border-dotted border-primary py-2 text-center text-sm font-semibold tracking-normal text-primaryColor">
//             Category - {catName}
//           </div>
//           <InputField
//             label="Sub Category Name"
//             value={categoryData.name}
//             onChange={(e) =>
//               setCategoryData({ ...categoryData, name: e.target.value })
//             }
//           />
//           <div className="mb-4 px-6">
//             <label className="block text-sm font-medium tracking-wide text-primaryColor">
//               Upload Image
//             </label>
//             <input
//               type="file"
//               onChange={handleImageUpload}
//               className="mt-2 w-full"
//             />
//             {categoryData.imgUrl && (
//               <img
//                 src={categoryData.imgUrl}
//                 alt="Uploaded"
//                 className="mt-2 w-10 h-10 object-contain rounded"
//               />
//             )}
//           </div>
//           <div className="mb-4 px-6">
//             <label className="block text-sm font-medium tracking-wide text-primaryColor">
//               Description
//             </label>
//             <textarea
//               className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-primary"
//               value={categoryData.description}
//               onChange={(e) =>
//                 setCategoryData({
//                   ...categoryData,
//                   description: e.target.value,
//                 })
//               }
//               placeholder="Category description"
//             />
//           </div>
//           <hr className="border-t-1 my-4 border-gray-300" />
//           <div className="flex justify-end gap-2 px-6 pb-6 font-medium tracking-wide">
//             <button
//               className="rounded bg-gray-300 px-4 py-2 text-primaryColor duration-150 hover:bg-gray-400"
//               onClick={handleCloseModal}
//             >
//               Cancel
//             </button>
//             <button
//               className="rounded bg-primaryBtnColor px-4 text-white duration-150 hover:bg-primaryBtnHoverColor"
//               onClick={handleSaveCategory}
//               disabled={isLoading}
//             >
//               {isLoading ? <ModalButtonLoader /> : "Save"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditSubCatModal;

// const SkeletonLoader = () => {
//   return (
//     <div className="w-full max-w-md animate-pulse rounded-lg bg-white px-6 py-3 shadow-lg">
//       <div className="mb-6">
//         <div className="border-gray-300p-3 flex items-center justify-center rounded-lg border p-3">
//           <div className="h-4 w-60 rounded bg-gray-200"></div>
//         </div>
//       </div>

//       <div className="space-y-6">
//         <div>
//           <div className="mb-2 h-3 w-32 rounded bg-gray-200"></div>
//           <div className="h-6 w-full rounded bg-gray-200"></div>
//         </div>

//         <div>
//           <div className="mb-2 h-3 w-24 rounded bg-gray-200"></div>
//           <div className="h-8 w-full rounded bg-gray-200"></div>
//         </div>

//         <div>
//           <div className="mb-2 h-4 w-28 rounded bg-gray-200"></div>
//           <div className="h-14 w-full rounded bg-gray-200"></div>
//         </div>

//         <div className="mt-6 flex justify-end space-x-4">
//           <div className="h-8 w-24 rounded bg-gray-200"></div>
//           <div className="h-8 w-24 rounded bg-gray-200"></div>
//         </div>
//       </div>
//     </div>
//   );
// };
