import React, { useEffect, useState } from "react";
import { ChevronRight, Edit3, Home, LogOut, Save, User, Camera } from "lucide-react";
import UserNavbar from "../../components/common/UserNavbar";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../utils/CartContext";
import BedsCarousel from "../../components/common/BedsCarousel";


const SkeletonText = ({ width = "w-32", height = "h-6", className = "" }) => (
    <div className={`bg-gray-300 rounded ${width} ${height} animate-pulse ${className}`} />
);

const UserProfile = () => {
    const navigate = useNavigate();
    const { resetCartCount } = useCart();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editUserData, setEditUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        imageUrl: "",
    });

    const getUserData = async () => {
        try {
            const data = JSON.parse(localStorage.getItem("pm-user-data"));
            if (!data || !data._id) {
                setUser(null);
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/customers/get-user-by-id/${data._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch user data");

            const userData = await response.json();
            setUser(userData.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("pm-user-data");
        resetCartCount();
        navigate("/");
    };

    const handleEditClick = () => {
        if (user) {
            setEditUserData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                gender: user.gender || "",
                imageUrl: user.imageUrl || "",
            });
            setIsEditing(true);
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditUserData((prev) => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveEditProfile = async () => {
        try {
            const data = JSON.parse(localStorage.getItem("pm-user-data"));
            if (!data || !data._id) {
                console.error("No user ID found");
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/customers/update-by-user-id/${data._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.token}`,
                },
                body: JSON.stringify(editUserData),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const updatedUser = await response.json();
            setUser(updatedUser.data);

            localStorage.setItem("pm-user-data", JSON.stringify({
                ...data,
                ...updatedUser.data
            }));

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user profile:", error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <UserNavbar />
                <BedsCarousel />
                <div className="w-full mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <SkeletonText width="w-48" height="h-8" className="mb-6" />
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                                    <SkeletonText width="w-32" height="h-6" className="mb-4" />
                                    <SkeletonText width="w-full" height="h-4" className="mb-2" />
                                    <SkeletonText width="w-3/4" height="h-4" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-700">No user data found.</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <UserNavbar />
            <BedsCarousel />

            <div className="w-full mx-auto py-4 px-4 md:px-6 mt-4">
                <div className="bg-white rounded-md shadow overflow-hidden">
                    <div className="bg-[#c4d0d7] py-12 px-4 relative">
                        <div className="absolute -bottom-10 left-8 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden group">
                            {(isEditing ? editUserData.imageUrl : user.imageUrl) ? (
                                <img
                                    src={isEditing ? editUserData.imageUrl : user.imageUrl}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl transition-all duration-300"
                                />
                            ) : (
                                <User className="w-12 h-12 text-gray-400" />
                            )}
                            {isEditing && (
                                <label className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity rounded-full">
                                    <Camera className="w-6 h-6 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        {!isEditing && (
                            <button
                                onClick={handleEditClick}
                                className="absolute top-8 right-4 bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white px-4 py-2 rounded hover:shadow-lg flex items-center"
                            >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="px-8 pt-16 pb-8">
                        <h2 className="text-[1rem] font-semibold text-gray-700 mb-4">
                            {isEditing ? (
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={editUserData.firstName}
                                        onChange={handleEditInputChange}
                                        placeholder="First Name"
                                        className="border rounded px-2 py-1"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={editUserData.lastName}
                                        onChange={handleEditInputChange}
                                        placeholder="Last Name"
                                        className="border rounded px-2 py-1"
                                    />
                                </div>
                            ) : (
                                loading ? (
                                    <div className="flex space-x-2">
                                        <SkeletonText width="w-24" />
                                        <SkeletonText width="w-24" />
                                    </div>
                                ) : (
                                    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`
                                )
                            )}
                        </h2>

                        <p className="text-gray-800 mb-6">
                            Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </p>

                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 py-1">Email</p>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editUserData.email}
                                            onChange={handleEditInputChange}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        <p className="text-gray-700">{user.email}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 py-1">Phone</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editUserData.phone}
                                            onChange={handleEditInputChange}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        <p className="text-gray-700">{user.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                <div>
                                    <p className="text-sm text-gray-500 py-1">Gender</p>
                                    {isEditing ? (
                                        <select
                                            name="gender"
                                            value={editUserData.gender}
                                            onChange={handleEditInputChange}
                                            className="border rounded px-2 py-1 w-full"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-700">{user.gender}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border text-white rounded bg-[#a3091e] hover:shadow-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEditProfile}
                                    className="bg-gradient-to-r from-[#002B45] via-[#00395F] to-[#005B91] text-white px-4 py-2 rounded hover:shadow-lg flex items-center"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        )}

                        <div className="mt-8 border-t pt-4">
                            <button
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-800 flex items-center"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
