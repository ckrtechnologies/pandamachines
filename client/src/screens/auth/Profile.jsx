import React, { useEffect, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { SlCalender } from "react-icons/sl";
import axios from "axios";
import ModalButtonLoader from "../../components/AdminSideComponents/Common/ModalButtonLoader";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    profilePic: "",
  });

  const getAdminId = () => {
    const storedId = localStorage.getItem("pm-admin-data");
    return storedId ? JSON.parse(storedId) : null;
  };

  useEffect(() => {
    const adminId = getAdminId();

    if (adminId) {
      fetchData(adminId);
    } else {
      setError("Admin ID not found");
      setIsLoading(false);
    }
  }, []);

  const fetchData = async (adminId) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admins/admin-by-id/${adminId._id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAdminProfile(data);
      setFormData({
        name: data.data.name || "",
        email: data.data.email || "",
        phoneNumber: data.data.phoneNumber || "",
        gender: data.data.gender || "",
        dateOfBirth: data.data.dateOfBirth?.slice(0, 10) || "",
        profilePic: data.data.profilePic || "",
      });
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response) {
        setError(
          `API Error: ${error.response.status} - ${
            error.response.data?.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        setError("No response from server. Check your network connection.");
      } else {
        setError(`Request failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

    setImageUploading(true);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        formDataUpload
      );
      setFormData((prevData) => ({
        ...prevData,
        profilePic: response.data.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    const adminId = getAdminId();
    setModalLoading(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admins/edit-admin/${adminId._id}`,
        formData
      );
      setAdminProfile((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          ...formData,
        },
      }));
      setIsEditing(false);
    } catch (error) {
      console.log("Error", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
      setModalLoading(false);
    }
  };

  const onlyDate = (dateString) => {
    if (!dateString) return "";
    return dateString.slice(0, 10).split("-").reverse().join("-");
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-4">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-300" />
            <div>
              <div className="h-4 w-40 bg-gray-300 rounded mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
              <div className="mt-1 h-5 w-16 bg-orange-200 rounded-full" />
            </div>
          </div>
          <div className="h-10 w-28 bg-orange-300 rounded-md" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="h-4 w-24 bg-gray-300 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-orange-100 rounded-xl shadow space-y-2">
            <div className="h-4 w-20 bg-orange-300 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
          <div className="p-4 bg-blue-100 rounded-xl shadow space-y-2">
            <div className="h-4 w-20 bg-blue-300 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>
          <div className="p-4 bg-purple-100 rounded-xl shadow space-y-2 col-span-1">
            <div className="h-4 w-20 bg-purple-300 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="p-4 bg-green-100 rounded-xl shadow space-y-2 col-span-1">
            <div className="h-4 w-24 bg-green-300 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full text-center border border-red-100">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <BsExclamationCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-red-700 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!adminProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full text-center border border-gray-100">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <BsExclamationCircle className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">
            No Profile Data
          </h3>
          <p className="text-gray-600 text-sm">
            Check the browser console for API response details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 md:p-6">
      <div className="w-full mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-orange-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative">
                <img
                  src={formData.profilePic || adminProfile?.data?.profilePic}
                  alt="Admin Profile pic"
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-300 shadow-sm"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all">
                    <FaRegEdit className="w-3 h-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </label>
                )}
                {imageUploading && (
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  {isEditing ? (
                    <input
                      type="text"
                      className="border px-2 py-1 rounded"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  ) : (
                    adminProfile?.data?.name
                  )}
                </h1>
                <p className="text-gray-500 text-sm">
                  {isEditing ? (
                    <input
                      type="text"
                      className="border px-2 py-1 rounded"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  ) : (
                    adminProfile?.data?.email
                  )}
                </p>
                <div className="inline-flex items-center px-2 py-1 rounded-md bg-orange-100 text-orange-700 font-medium text-xs">
                  Admin
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-1">
                  <FaRegEdit className="w-4 h-4" />
                  Edit Profile
                </div>
              </button>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-blue-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-300 to-orange-600 rounded-md flex items-center justify-center">
                <IoInformationCircleOutline className="w-4 h-4 text-white" />
              </div>
              About
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-200">
              Panda Machine Admin Panel is a powerful backend dashboard that
              helps manage users, products, banners, and system settings
              efficiently, ensuring smooth operation of the entire platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-300 to-blue-600 rounded-md flex items-center justify-center">
                  <MdOutlineAlternateEmail className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Email</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {isEditing ? (
                  <input
                    type="text"
                    className="border px-2 py-1 rounded"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                ) : (
                  adminProfile?.data?.email
                )}
              </p>
            </div>

            {/* Phone */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-300 to-blue-600 rounded-md flex items-center justify-center">
                  <LuPhone className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Phone</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {isEditing ? (
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                ) : (
                  adminProfile?.data?.phoneNumber
                )}
              </p>
            </div>

            {/* Gender */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-300 to-blue-600 rounded-md flex items-center justify-center">
                  <CgProfile className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Gender</h3>
              </div>
              <p className="text-gray-600 text-sm capitalize">
                {isEditing ? (
                  <select
                    className="border px-2 py-1 rounded w-full"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  adminProfile?.data?.gender
                )}
              </p>
            </div>

            {/* Date Of Birth */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
                  <SlCalender className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Date of Birth
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {isEditing ? (
                  <input
                    type="date"
                    className="border px-2 py-1 rounded w-full"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                ) : (
                  onlyDate(adminProfile?.data?.dateOfBirth)
                )}
              </p>
            </div>
          </div>

          {/* Save / Cancel Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: adminProfile.data.name || "",
                    phoneNumber: adminProfile.data.phoneNumber || "",
                    gender: adminProfile.data.gender || "",
                    dateOfBirth:
                      adminProfile.data.dateOfBirth?.slice(0, 10) || "",
                    profilePic: adminProfile.data.profilePic || "",
                  });
                }}
                className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={imageUploading}
                className="px-4 rounded-md bg-orange-600 text-white hover:bg-orange-700 shadow disabled:opacity-50"
              >
                {modalLoading ? <ModalButtonLoader /> : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

// import React, { useEffect, useState } from "react";
// import { BsExclamationCircle } from "react-icons/bs";
// import { FaRegEdit } from "react-icons/fa";
// import { IoInformationCircleOutline } from "react-icons/io5";
// import { MdOutlineAlternateEmail } from "react-icons/md";
// import { LuPhone } from "react-icons/lu";
// import { CgProfile } from "react-icons/cg";
// import { SlCalender } from "react-icons/sl";
// import axios from "axios";
// import ModalButtonLoader from "../../components/AdminSideComponents/Common/ModalButtonLoader";

// const Profile = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [adminProfile, setAdminProfile] = useState(null);
//   const [error, setError] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     phoneNumber: "",
//     email: "",
//     gender: "",
//     dateOfBirth: "",
//   });

//   const getAdminId = () => {
//     const storedId = localStorage.getItem("pm-admin-data");
//     return storedId ? JSON.parse(storedId) : null;
//   };

//   useEffect(() => {
//     const adminId = getAdminId();

//     if (adminId) {
//       fetchData(adminId);
//     } else {
//       setError("Admin ID not found");
//       setIsLoading(false);
//     }
//   }, []);

//   const fetchData = async (adminId) => {
//     try {
//       setIsLoading(true);
//       setError("");

//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/admins/admin-by-id/${adminId._id}`
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setAdminProfile(data);
//       setFormData({
//         name: data.data.name || "",
//         email: data.data.email || "",
//         phoneNumber: data.data.phoneNumber || "",
//         gender: data.data.gender || "",
//         dateOfBirth: data.data.dateOfBirth?.slice(0, 10) || "",
//       });
//     } catch (error) {
//       console.error("Fetch error:", error);
//       if (error.response) {
//         setError(
//           `API Error: ${error.response.status} - ${
//             error.response.data?.message || "Unknown error"
//           }`
//         );
//       } else if (error.request) {
//         setError("No response from server. Check your network connection.");
//       } else {
//         setError(`Request failed: ${error.message}`);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     const adminId = getAdminId();
//     setModalLoading(true);

//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/admins/edit-admin/${adminId._id}`,
//         formData
//       );
//       setAdminProfile((prev) => ({
//         ...prev,
//         data: {
//           ...prev.data,
//           ...formData,
//         },
//       }));
//       setIsEditing(false);
//     } catch (error) {
//       console.log("Error", error);
//     } finally {
//       setIsLoading(false);
//       setModalLoading(false);
//     }
//   };
//   console.log("kn asuchi", adminProfile);

//   const onlyDate = (dateString) => {
//     if (!dateString) return "";
//     return dateString.slice(0, 10).split("-").reverse().join("-");
//   };

//   if (isLoading) {
//     return (
//       <div className="animate-pulse space-y-4 p-4">
//         <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow">
//           <div className="flex items-center space-x-4">
//             <div className="w-16 h-16 rounded-full bg-gray-300" />
//             <div>
//               <div className="h-4 w-40 bg-gray-300 rounded mb-2" />
//               <div className="h-3 w-32 bg-gray-200 rounded" />
//               <div className="mt-1 h-5 w-16 bg-orange-200 rounded-full" />
//             </div>
//           </div>
//           <div className="h-10 w-28 bg-orange-300 rounded-md" />
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow space-y-4">
//           <div className="h-4 w-24 bg-gray-300 rounded" />
//           <div className="h-4 w-full bg-gray-200 rounded" />
//           <div className="h-4 w-3/4 bg-gray-200 rounded" />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="p-4 bg-orange-100 rounded-xl shadow space-y-2">
//             <div className="h-4 w-20 bg-orange-300 rounded" />
//             <div className="h-4 w-40 bg-gray-200 rounded" />
//           </div>
//           <div className="p-4 bg-blue-100 rounded-xl shadow space-y-2">
//             <div className="h-4 w-20 bg-blue-300 rounded" />
//             <div className="h-4 w-36 bg-gray-200 rounded" />
//           </div>
//           <div className="p-4 bg-purple-100 rounded-xl shadow space-y-2 col-span-1">
//             <div className="h-4 w-20 bg-purple-300 rounded" />
//             <div className="h-4 w-16 bg-gray-200 rounded" />
//           </div>
//           <div className="p-4 bg-green-100 rounded-xl shadow space-y-2 col-span-1">
//             <div className="h-4 w-24 bg-green-300 rounded" />
//             <div className="h-4 w-24 bg-gray-200 rounded" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full text-center border border-red-100">
//           <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
//             <BsExclamationCircle className="w-6 h-6 text-red-500" />
//           </div>
//           <h3 className="text-base font-semibold text-red-700 mb-2">
//             Error Loading Profile
//           </h3>
//           <p className="text-red-600 text-sm">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!adminProfile) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full text-center border border-gray-100">
//           <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//             <BsExclamationCircle className="w-6 h-6 text-gray-500" />
//           </div>
//           <h3 className="text-base font-semibold text-gray-700 mb-2">
//             No Profile Data
//           </h3>
//           <p className="text-gray-600 text-sm">
//             Check the browser console for API response details.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 md:p-6">
//       <div className="w-full mx-auto">
//         {/* Header Card */}
//         <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-orange-100">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//               <img
//                 src={adminProfile?.data?.profilePic}
//                 alt="Admin Profile pic"
//                 className="w-20 h-20 rounded-full object-cover border-2 border-orange-300 shadow-sm"
//               />
//               <div className="space-y-1">
//                 <h1 className="text-2xl font-bold text-gray-800">
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       className="border px-2 py-1 rounded"
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                     />
//                   ) : (
//                     adminProfile?.data?.name
//                   )}
//                 </h1>
//                 <p className="text-gray-500 text-sm">
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       className="border px-2 py-1 rounded"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                     />
//                   ) : (
//                     adminProfile?.data?.email
//                   )}
//                 </p>
//                 <div className="inline-flex items-center px-2 py-1 rounded-md bg-orange-100 text-orange-700 font-medium text-xs">
//                   Admin
//                 </div>
//               </div>
//             </div>
//             {!isEditing && (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
//               >
//                 <div className="flex items-center gap-1">
//                   <FaRegEdit className="w-4 h-4" />
//                   Edit Profile
//                 </div>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* About Section */}
//         <div className="bg-white rounded-xl shadow-md p-5 border border-blue-100">
//           <div className="mb-4">
//             <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
//               <div className="w-6 h-6 bg-gradient-to-r from-orange-300 to-orange-600 rounded-md flex items-center justify-center">
//                 <IoInformationCircleOutline className="w-4 h-4 text-white" />
//               </div>
//               About
//             </h2>
//             <p className="text-gray-600 text-sm leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-200">
//               Panda Machine Admin Panel is a powerful backend dashboard that
//               helps manage users, products, banners, and system settings
//               efficiently, ensuring smooth operation of the entire platform.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Email */}
//             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-6 h-6 bg-gradient-to-r from-blue-300 to-blue-600 rounded-md flex items-center justify-center">
//                   <MdOutlineAlternateEmail className="text-white" />
//                 </div>
//                 <h3 className="font-semibold text-gray-800 text-sm">Email</h3>
//               </div>
//               <p className="text-gray-600 text-sm">
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     className="border px-2 py-1 rounded"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                   />
//                 ) : (
//                   adminProfile?.data?.email
//                 )}
//               </p>
//             </div>

//             {/* Phone */}
//             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-6 h-6 bg-gradient-to-r from-blue-300 to-blue-600 rounded-md flex items-center justify-center">
//                   <LuPhone className="text-white" />
//                 </div>
//                 <h3 className="font-semibold text-gray-800 text-sm">Phone</h3>
//               </div>
//               <p className="text-gray-600 text-sm">
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     className="border px-2 py-1 rounded w-full"
//                     value={formData.phoneNumber}
//                     onChange={(e) =>
//                       setFormData({ ...formData, phoneNumber: e.target.value })
//                     }
//                   />
//                 ) : (
//                   adminProfile?.data?.phoneNumber
//                 )}
//               </p>
//             </div>

//             {/* Gender */}
//             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-6 h-6 bg-gradient-to-r from-blue-300 to-blue-600 rounded-md flex items-center justify-center">
//                   <CgProfile className="text-white" />
//                 </div>
//                 <h3 className="font-semibold text-gray-800 text-sm">Gender</h3>
//               </div>
//               <p className="text-gray-600 text-sm capitalize">
//                 {isEditing ? (
//                   <select
//                     className="border px-2 py-1 rounded w-full"
//                     value={formData.gender}
//                     onChange={(e) =>
//                       setFormData({ ...formData, gender: e.target.value })
//                     }
//                   >
//                     <option value="">Select</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 ) : (
//                   adminProfile?.data?.gender
//                 )}
//               </p>
//             </div>

//             {/* Date Of Birth */}
//             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-700 rounded-md flex items-center justify-center">
//                   <SlCalender className="text-white" />
//                 </div>
//                 <h3 className="font-semibold text-gray-800 text-sm">
//                   Date of Birth
//                 </h3>
//               </div>
//               <p className="text-gray-600 text-sm">
//                 {isEditing ? (
//                   <input
//                     type="date"
//                     className="border px-2 py-1 rounded w-full"
//                     value={formData.dateOfBirth}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         dateOfBirth: e.target.value,
//                       })
//                     }
//                   />
//                 ) : (
//                   onlyDate(adminProfile?.data?.dateOfBirth)
//                 )}
//               </p>
//             </div>
//           </div>

//           {/* Save / Cancel Buttons */}
//           {isEditing && (
//             <div className="flex justify-end gap-4 mt-6">
//               <button
//                 onClick={() => {
//                   setIsEditing(false);
//                   setFormData({
//                     name: adminProfile.data.name || "",
//                     phoneNumber: adminProfile.data.phoneNumber || "",
//                     gender: adminProfile.data.gender || "",
//                     dateOfBirth:
//                       adminProfile.data.dateOfBirth?.slice(0, 10) || "",
//                   });
//                 }}
//                 className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:shadow"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4  rounded-md bg-orange-600 text-white hover:bg-orange-700 shadow"
//               >
//                 {modalLoading ? <ModalButtonLoader /> : "Save"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
