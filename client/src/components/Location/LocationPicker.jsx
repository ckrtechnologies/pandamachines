import { createPortal } from "react-dom";
import GoogleMapPicker from "./GoogleMapPicker";

import { useState } from "react";

const LocationPicker = ({ onClose, onSelect }) => {
    const isMobile = window.innerWidth < 768;

    const [selectedLocation, setSelectedLocation] = useState(null);

    const content = (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm">
            <div
                className={`
                    bg-white w-full flex flex-col
                    ${isMobile
                        ? "absolute bottom-0 h-auto rounded-t-2xl animate-slideUp"
                        : "max-w-2xl mx-auto mt-20 rounded-xl h-[80vh]"
                    }
                `}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">
                        Select Delivery Location
                    </h2>
                    <button onClick={onClose} className="text-xl">✕</button>
                </div>

                {/* MAP */}
                <div className="flex-1">
                    <GoogleMapPicker
                        location={{ coordinates: [] }}
                        onChange={(data) => {
                            const addr = data.address;

                            setSelectedLocation({
                                name:
                                    addr.locality ||
                                    addr.city ||
                                    addr.state,

                                full: addr.formatted,

                                city: addr.city || "",
                                state: addr.state || "",
                                pincode: addr.pincode || "",

                                coordinates: data.coordinates,
                            });
                        }}
                    />
                </div>
                {selectedLocation && (
                    <div className="px-4 py-3 border-t bg-gray-50">
                        <p className="text-sm text-gray-800 font-medium">
                            {selectedLocation.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {selectedLocation.full}
                        </p>
                    </div>
                )}

                {/* FOOTER BUTTON */}
                <div className="p-4 border-t">
                    <button
                        disabled={!selectedLocation}
                        onClick={() => onSelect(selectedLocation)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};
export default LocationPicker;