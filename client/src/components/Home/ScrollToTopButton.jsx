import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {showButton && (
                <button
                    onClick={scrollToTop}
                    className="
                        fixed bottom-28 sm:bottom-5 right-10 
                        lg:left-1/2 lg:-translate-x-1/2
                        z-50

                        flex items-center justify-center

                        w-12 h-12

                        rounded-full

                        bg-primaryColor/10
                        backdrop-blur-xl
                        border border-primaryBtnColor/20

                        shadow-[0_8px_30px_rgba(0,0,0,0.25)]

                        hover:scale-110
                        hover:bg-primaryBtnColor/20

                        transition-all duration-500

                        animate-[bounce_3s_infinite]
                    "
                >
                    <FaArrowUp className="text-base text-primaryColor" />
                </button>
            )}
        </>
    );
};

export default ScrollToTopButton;