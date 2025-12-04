import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col mb-4">
    <label className="block text-sm font-medium tracking-wide text-gray-700">
      {label}
    </label>
    <input
      className="mt-2 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const AddStaffModal = ({ isOpen, setIsOpen, refetchStaff }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    userType: "staff",
    gender: "",
    dateOfBirth: "",
    address: "",
    nationality: "",
    profilePic: "",
  });

  // Upload Image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

    setImageUploading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: formDataUpload }
      );
      const data = await response.json();

      setStaffData((prev) => ({
        ...prev,
        profilePic: data.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  // Save Staff API
  const handleSaveStaff = async () => {
    if (!staffData.name.trim() || !staffData.email.trim()) {
      alert("Please fill in required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admins/admin-register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(staffData),
        }
      );

      if (response.ok) {
        refetchStaff();
        setIsOpen(false);
        setStaffData({
          name: "",
          email: "",
          phoneNumber: "",
          userType: "staff",
          gender: "",
          dateOfBirth: "",
          address: "",
          nationality: "",
          profilePic: "",
        });
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to add staff member");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
      <div className="w-[600px] rounded-lg bg-white shadow-lg max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-semibold text-gray-800">Add Staff Member</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <MdClose size={22} />
          </button>
        </div>
        <hr className="border-gray-300" />

        {/* FORM START - 2 COLUMN LAYOUT */}
        <div className="px-6 pt-4 grid grid-cols-2 gap-4">

          <InputField
            label="Name *"
            value={staffData.name}
            onChange={(e) => setStaffData({ ...staffData, name: e.target.value })}
            placeholder="Enter staff name"
          />

          <InputField
            label="Email *"
            type="email"
            value={staffData.email}
            onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
            placeholder="Enter email"
          />

          <InputField
            label="Phone Number"
            value={staffData.phoneNumber}
            onChange={(e) => setStaffData({ ...staffData, phoneNumber: e.target.value })}
            placeholder="Enter phone number"
          />

          {/* Gender */}
          <div className="flex flex-col mb-4">
            <label className="block text-sm font-medium tracking-wide text-gray-700">
              Gender
            </label>
            <select
              value={staffData.gender}
              onChange={(e) => setStaffData({ ...staffData, gender: e.target.value })}
              className="mt-2 w-full rounded border border-gray-300 p-2 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <InputField
            label="Date of Birth"
            type="date"
            value={staffData.dateOfBirth}
            onChange={(e) => setStaffData({ ...staffData, dateOfBirth: e.target.value })}
          />

          <InputField
            label="Nationality"
            value={staffData.nationality}
            onChange={(e) =>
              setStaffData({ ...staffData, nationality: e.target.value })
            }
            placeholder="Enter nationality"
          />

          {/* Address Full Width */}
          <div className="col-span-2">
            <InputField
              label="Address"
              value={staffData.address}
              onChange={(e) => setStaffData({ ...staffData, address: e.target.value })}
              placeholder="Enter address"
            />
          </div>

          {/* Upload Image */}
          <div className="col-span-2">
            <label className="block text-sm font-medium tracking-wide text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2 w-full rounded border border-gray-300 p-2"
            />
            {imageUploading && (
              <p className="mt-2 text-sm text-gray-500">Uploading...</p>
            )}
            {staffData.profilePic && (
              <img
                src={staffData.profilePic}
                alt="Profile"
                className="mt-2 h-20 w-20 rounded-full object-cover"
              />
            )}
          </div>

        </div>
        {/* FORM END */}

        <hr className="border-gray-300 my-4" />

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveStaff}
            disabled={isLoading || !staffData.name.trim() || !staffData.email.trim()}
            className="rounded bg-[#FF8617] px-4 py-2 text-white hover:bg-[#CC5F0F] transition disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddStaffModal;
