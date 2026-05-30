import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUserEdit,
    FaAddressCard,
    FaUserCircle,
    FaShoppingCart,
} from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { FaTruckFast, FaHeartCrack } from "react-icons/fa6";
import { PiPoliceCarFill } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";

import UserLoginModal from "../../components/Login/UserLoginModal";

const UserProfileMenu = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Smart Auth Check
    useEffect(() => {
        const storedUser = localStorage.getItem("pm-user-data");

        if (!storedUser) {
            setShowLoginModal(true); // SHOW MODAL INSTEAD OF REDIRECT
        } else {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    // After login → reload user
    const handleLoginSuccess = () => {
        const storedUser = localStorage.getItem("pm-user-data");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
            setShowLoginModal(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("pm-user-data");
        setUserData(null);
        setShowLogoutConfirm(false);
        setShowLoginModal(true); // optional: show login again
    };

    const menuItems = [
        {
            label: "My Profile",
            icon: <FaUserEdit />,
            path: "/user-profile-details",
        },
        {
            label: "Wishlist",
            icon: <FaHeartCrack />,
            path: "/wishlist",
        },
        {
            label: "My Cart",
            icon: <FaShoppingCart />,
            path: "/cart",
        },
        {
            label: "My Orders",
            icon: <GiNotebook />,
            path: "/orders",
        },
        {
            label: "Saved Addresses",
            icon: <FaAddressCard />,
            path: "/saved-addresses",
        },
        {
            label: "Track Order",
            icon: <FaTruckFast />,
            path: "/orders",
        },
        // {
        //     label: "Bulk Orders",
        //     icon: <PiPoliceCarFill />,
        //     path: "/bulk-orders",
        // },
        
    ];

    return (
        <>
            {/* LOGIN MODAL */}
            {showLoginModal && (
                <UserLoginModal
                    onClose={() => navigate("/")} // optional fallback
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            {/* Prevent UI flicker when not logged */}
            {!userData ? null : (
                <div className="min-h-screen bg-gray-50 pb-20">

                    {/* Profile Section */}
                    <div className="bg-white px-4 py-5 shadow-sm flex items-center gap-4">
                        <div className="text-4xl text-[#00395F]">
                            <FaUserCircle />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-md font-semibold">
                                {userData?.firstName || "User"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {userData?.email || "No email"}
                            </p>

                            <button
                                onClick={() => navigate("/user-profile-details")}
                                className="text-xs text-[#FF8617] mt-1 font-medium"
                            >
                                View Profile →
                            </button>
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="mt-3 bg-white divide-y shadow-sm">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(item.path)}
                                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
                            >
                                <span className="text-[#00395F] text-lg">
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Logout */}
                    <div className="mt-3 bg-white shadow-sm">
                        <div
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center gap-3 p-4 cursor-pointer text-red-600 hover:bg-red-50"
                        >
                            <FiLogOut className="text-lg" />
                            <span className="text-sm font-medium">Logout</span>
                        </div>
                    </div>

                    {/* Logout Modal */}
                    {showLogoutConfirm && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-5 w-[90%] max-w-sm shadow-lg">
                                <h3 className="text-md font-semibold mb-2">
                                    Confirm Logout
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Are you sure you want to logout?
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="px-4 py-2 text-sm rounded-md border"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm rounded-md bg-red-600 text-white"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default UserProfileMenu;