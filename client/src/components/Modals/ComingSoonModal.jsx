import { FaGooglePlay } from "react-icons/fa";
import ModalWrapper from "./ModalWrapper";

const ComingSoonModal = ({ isOpen, onClose }) => {
    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose}>
            <div className="text-center flex flex-col items-center gap-4">
                <div className="bg-black text-white p-3 rounded-full">
                    <FaGooglePlay size={22} />
                </div>

                <h2 className="text-lg font-semibold text-gray-800">
                    App Coming Soon 🚀
                </h2>

                <p className="text-sm text-gray-500 leading-relaxed">
                    We're crafting something smooth, fast, and powerful for your mobile experience.
                    Stay tuned — the app will be live on Play Store very soon.
                </p>

                <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 bg-[#00395F] text-white text-sm rounded-md hover:bg-[#002a45] transition"
                >
                    Got it
                </button>
            </div>
        </ModalWrapper>
    );
};

export default ComingSoonModal;