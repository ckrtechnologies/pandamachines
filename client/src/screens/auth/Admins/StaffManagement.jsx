import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import AddStaffModal from "../../../components/AdminSideComponents/StaffManagement/AddStaffModal";
import EditStaffModal from "../../../components/AdminSideComponents/StaffManagement/EditStaffModal";
import PermissionsModal from "../../../components/AdminSideComponents/StaffManagement/PermissionsModal";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState({
    _id: "",
    name: "",
    email: "",
    phoneNumber: "",
    userType: "staff",
    gender: "",
    dateOfBirth: "",
    address: "",
    nationality: "",
    profilePic: "",
    permissions: {},
  });

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admins/all-staff`
      );
      const data = await response.json();
      setStaffList(data.data || []);
      setFilteredStaff(data.data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    let results = staffList;
    if (searchQuery) {
      results = results.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredStaff(results);
  }, [searchQuery, staffList]);

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handlePermissions = (staff) => {
    setSelectedStaff(staff);
    setIsPermissionsModalOpen(true);
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admins/delete-admin/${staffId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        fetchStaff();
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff member");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your staff members and permissions</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search staff..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button
            className="flex items-center justify-center bg-[#FF8617] hover:bg-[#CC5F0F] transition duration-150 text-white px-4 py-2 rounded-lg whitespace-nowrap"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FiPlus className="mr-2" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Staff Table */}
      {isLoading ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Loading staff members...</p>
        </div>
      ) : filteredStaff.length > 0 ? (
        <div className="overflow-x-auto rounded-lg bg-white">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Sl</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredStaff.map((staff, index) => (
                <tr key={staff._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={staff.profilePic || "https://via.placeholder.com/40"}
                      alt={staff.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{staff.name}</td>
                  <td className="px-4 py-3">{staff.email}</td>
                  <td className="px-4 py-3">{staff.phoneNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePermissions(staff)}
                        className="text-orange-600 hover:text-orange-800 transition p-1 text-lg"
                        title="Manage Permissions"
                      >
                        🔐
                      </button>
                      <button
                        onClick={() => handleEdit(staff)}
                        className="text-blue-600 hover:text-blue-800 transition p-1"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(staff._id)}
                        className="text-red-600 hover:text-red-800 transition p-1"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No staff members found</p>
        </div>
      )}

      {/* Modals */}
      <AddStaffModal 
        isOpen={isAddModalOpen} 
        setIsOpen={setIsAddModalOpen} 
        refetchStaff={fetchStaff} 
      />
      <EditStaffModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        staffData={selectedStaff}
        setStaffData={setSelectedStaff}
        refetchStaff={fetchStaff}
      />
      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        setIsOpen={setIsPermissionsModalOpen}
        staffData={selectedStaff}
        setStaffData={setSelectedStaff}
        refetchStaff={fetchStaff}
      />
    </div>
  );
};

export default StaffManagement;