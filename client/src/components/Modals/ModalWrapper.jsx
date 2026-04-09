import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

const ModalWrapper = ({ isOpen, onClose, children }) => {
    const modalRef = useRef(null);
    const closeBtnRef = useRef(null);

    /* ESC CLOSE */
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    /* SCROLL LOCK */
    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    /* AUTO FOCUS */
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => {
                closeBtnRef.current?.focus();
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-white rounded-xl shadow-xl animate-fadeIn"
            >
                {/* Close Button */}
                <button
                    ref={closeBtnRef}
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                    <FaTimes />
                </button>

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default ModalWrapper;