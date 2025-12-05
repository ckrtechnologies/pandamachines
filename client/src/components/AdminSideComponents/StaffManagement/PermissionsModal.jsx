import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const PermissionsModal = ({ isOpen, setIsOpen, staffData, setStaffData, refetchStaff }) => {
  const [isLoading, setIsLoading] = useState(false);

  // 16 Permissions + readable label names
  const permissionsList = [
    { key: "dashboard", label: "Dashboard" },
    { key: "categories", label: "Categories" },
    { key: "subCategories", label: "Sub Categories" },
    { key: "tier3Categories", label: "Tier-3 Categories" },
    { key: "products", label: "Products" },
    { key: "orders", label: "Orders" },
    { key: "customers", label: "Customers" },
    { key: "suppliers", label: "Suppliers" },
    { key: "guideBookings", label: "E-Consult" },          
    { key: "appBanners", label: "App Banners" },
    { key: "allBlogs", label: "Blogs" },
    { key: "inquiry", label: "Inquiry" },
    { key: "ourStaffs", label: "Our Staffs" },
    { key: "allOffers", label: "Offers Management" },      
    { key: "staffManagement", label: "Staff Management" }, 
    { key: "p_approve", label: "Product Approve" }        
  ];

  const handlePermissionToggle = (permission) => {
    setStaffData({
      ...staffData,
      permissions: {
        ...staffData.permissions,
        [permission]: !staffData.permissions?.[permission],
      },
    });
  };

  const handleSavePermissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admins/update-permissions/${staffData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissions: staffData.permissions }),
        }
      );
      if (response.ok) {
        refetchStaff();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      alert("Failed to update permissions");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
      <div className="w-[600px] rounded-lg bg-white shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Manage Permissions</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 transition duration-150 hover:text-gray-800"
          >
            <MdClose size={22} />
          </button>
        </div>
        <hr className="border-gray-300" />

        {/* Staff Name */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-4">
            Staff: <span className="font-semibold">{staffData.name}</span>
          </p>

          {/* 2 Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {permissionsList.map((perm) => (
              <div key={perm.key} className="flex items-center justify-between p-2 rounded-md border border-gray-200">
                <span className="text-sm text-gray-700">{perm.label}</span>

                {/* Toggle Switch */}
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={staffData.permissions?.[perm.key] || false}
                    onChange={() => handlePermissionToggle(perm.key)}
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-[#FF8617] rounded-full peer 
                                  peer-checked:bg-[#FF8617] transition"></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transform 
                                  peer-checked:translate-x-5 transition"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <hr className="border-gray-300 my-4" />
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 transition"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="rounded bg-[#FF8617] px-4 py-2 text-white hover:bg-[#CC5F0F] transition disabled:opacity-50"
            onClick={handleSavePermissions}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Permissions"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
