import { createPortal } from "react-dom";
import GoogleMapPicker from "./GoogleMapPicker";

const LocationPicker = ({ onClose, onSelect }) => {
    const isMobile = window.innerWidth < 768;

    const content = (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm">
            <div
                className={`
        bg-white w-full
        ${isMobile
                        ? "absolute bottom-0 h-[85%] rounded-t-2xl animate-slideUp"
                        : "max-w-2xl mx-auto mt-20 rounded-xl"
                    }
        p-4
      `}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold text-lg">
                        Select Delivery Location
                    </h2>
                    <button onClick={onClose} className="text-xl">
                        ✕
                    </button>
                </div>

                {/* MAP PICKER */}
                <GoogleMapPicker
                    location={{ coordinates: [] }}
                    onChange={(data) => {
                        onSelect({
                            name:
                                data.address.city ||
                                data.address.locality ||
                                data.address.state,
                            full: data.address.formatted,
                            coordinates: data.coordinates,
                        });
                    }}
                />
            </div>
        </div>
    );

    return createPortal(content, document.body);
};

export default LocationPicker;