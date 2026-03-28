import { useEffect, useState } from "react";
import {
    AiFillHome,
    AiOutlineHome
} from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaUser, FaWhatsapp } from "react-icons/fa";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { MdVideoCall } from "react-icons/md";
import { RiFileList3Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

const MobileBottomBar = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

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
            label: "Quotation",
            icon: RiFileList3Fill,
            path: "/user-quotation",
        },
        {
            label: "Profile",
            icon: FaUser,
            path: isLoggedIn ? "/user-profile" : "/login",
        },
    ];

    const icons = [
        { icon: FaWhatsapp, color: "text-green-500" },
        { icon: HiQuestionMarkCircle, color: "text-gray-700" },
        { icon: MdVideoCall, color: "text-blue-500" },
    ];


    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % icons.length);
        }, 2000); // change every 2 sec

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {
                isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-black/20 blur-sm"></div>
            }

            {/* Bottom Bar */}
            <div className="sm:hidden fixed bottom-0 z-50 left-0 w-full bg-white border-t shadow-md">
                <div className="flex justify-between items-center px-2 py-3 relative">

                    {/* LEFT ITEMS */}
                    {navItems.slice(0, 2).map((item, index) => {
                        const isActive = location.pathname === item.path;
                        const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;

                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className="flex flex-col items-center flex-1 text-xs"
                            >
                                <Icon className={`text-xl ${isActive ? "text-[#FF8617]" : "text-[#00395F]"}`} />
                                <span className={`mt-1 ${isActive ? "text-[#FF8617]" : "text-gray-600"}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                    {/* CENTER BUTTON */}
                    <div className="relative flex flex-col items-center flex-1">
                        {/* MAIN BUTTON */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-orange-50 text-white p-4 rounded-full shadow-lg -mt-12 z-50 flex items-center justify-center overflow-hidden"
                        >
                            <div className="relative w-8 h-8 flex items-center justify-center">

                                {icons.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = index === activeIndex;

                                    return (
                                        <Icon
                                            key={index}
                                            size={28}
                                            className={`absolute transition-all duration-500 ease-in-out ${isActive
                                                ? "opacity-100 scale-100"
                                                : "opacity-0 scale-50"
                                                } ${item.color} `}
                                        />
                                    );
                                })}

                            </div>
                        </button>

                        {/* RADIAL MENU */}
                        <div className="absolute bottom-16 flex items-center justify-center">

                            {/* CHAT WITH US */}
                            <button
                                onClick={() => {
                                    window.open("https://wa.me/919393991563", "_blank");
                                    setIsOpen(false);
                                }}
                                className={`absolute flex items-center gap-2 bg-green-500 px-4 py-2 rounded-full text-white shadow-md transition-all duration-300
        ${isOpen
                                        ? "opacity-100 translate-x-[-90px] translate-y-[-40px] scale-100"
                                        : "opacity-0 scale-50 pointer-events-none"
                                    }`}
                            >
                                <FaWhatsapp size={20} />
                                <span className="text-xs whitespace-nowrap">Chat with us</span>
                            </button>

                            {/* VIDEO CONSULTANCY */}
                            <button
                                onClick={() => {
                                    navigate("/consult-guidance");
                                    setIsOpen(false);
                                }}
                                className={`absolute flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-full text-white shadow-md transition-all duration-300
        ${isOpen
                                        ? "opacity-100 translate-y-[-90px] scale-100"
                                        : "opacity-0 scale-50 pointer-events-none"
                                    }`}
                            >
                                <MdVideoCall size={20} />
                                <span className="text-xs whitespace-nowrap">Video Consultancy</span>
                            </button>

                            {/* SEND INQUIRY */}
                            <button
                                onClick={() => {
                                    // trigger inquiry modal (we'll handle below)
                                    document.dispatchEvent(new Event("openInquiryModal"));
                                    setIsOpen(false);
                                }}
                                className={`absolute flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full text-white shadow-md transition-all duration-300
        ${isOpen
                                        ? "opacity-100 translate-x-[90px] translate-y-[-40px] scale-100"
                                        : "opacity-0 scale-50 pointer-events-none"
                                    }`}
                            >
                                <HiQuestionMarkCircle size={20} />
                                <span className="text-xs whitespace-nowrap">Send Inquiry</span>
                            </button>

                        </div>
                    </div>

                    {/* RIGHT ITEMS */}
                    {navItems.slice(2).map((item, index) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className="flex flex-col items-center flex-1 text-xs"
                            >
                                <Icon className={`text-xl ${isActive ? "text-[#FF8617]" : "text-[#00395F]"}`} />
                                <span className={`mt-1 ${isActive ? "text-[#FF8617]" : "text-gray-600"}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Spacer */}
            <div className="sm:hidden h-[72px]" />
        </>
    );
};

export default MobileBottomBar;