import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AiOutlineHome,
    AiFillHome
} from "react-icons/ai";
import { RiLuggageCartFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { BiCategory } from "react-icons/bi";

const MobileBottomBar = ({ cartCount = 0, isLoggedIn }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            label: "Home",
            icon: AiOutlineHome,
            activeIcon: AiFillHome,
            path: "/",
        },
        {
            label: "Categories",
            icon: BiCategory,
            path: "/categories",
        },
        {
            label: "Profile",
            icon: FaUser,
            path: isLoggedIn ? "/user-profile" : "/login",
        },
        {
            label: "Cart",
            icon: RiLuggageCartFill,
            path: "/my-carts",
            badge: cartCount,
        },
        {
            label: "Wishlist",
            icon: FaHeart,
            path: "/wishlist",
        },
       
    ];

    return (
        <>
            {/* Bottom Bar */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">
                <div className="flex justify-between items-center px-2 py-4">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;

                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className="flex flex-col items-center justify-center flex-1 relative text-xs"
                            >
                                <div className={`text-xl ${isActive ? "text-[#FF8617]" : "text-[#00395F]"}`}>
                                    <Icon />
                                </div>

                                {item.badge > 0 && (
                                    <span className="absolute -top-1 right-5 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}

                                <span
                                    className={`text-xs mt-1 ${isActive ? "text-[#FF8617]" : "text-gray-600"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Spacer (VERY IMPORTANT) */}
            <div className="sm:hidden h-[72px]" />
        </>
    );
};

export default MobileBottomBar;