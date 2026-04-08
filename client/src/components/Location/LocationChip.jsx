import { useEffect, useState } from "react";
import { MdLocationOn } from "react-icons/md";
import LocationPicker from "./LocationPicker";

const LOCATION_KEY = "pm-user-location";

const LocationChip = () => {
    const [location, setLocation] = useState(null);
    const [openPicker, setOpenPicker] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(LOCATION_KEY);
        if (stored) {
            setLocation(JSON.parse(stored));
        }
    }, []);

    return (
        <>
            <div
                onClick={() => setOpenPicker(true)}
                className="flex items-center gap-1 cursor-pointer group"
            >
                <MdLocationOn className="text-red-500 text-base shrink-0" />

                <div
                    title={location?.full}
                    className="flex flex-col leading-tight"
                >
                    <span className="text-[10px] text-gray-500">
                        Deliver to
                    </span>

                    <span className="text-sm font-semibold text-gray-800 group-hover:text-primaryColor transition-colors duration-200">
                        {location?.pincode || location?.name || "Select location"}
                    </span>
                </div>
            </div>

            {openPicker && (
                <LocationPicker
                    onClose={() => setOpenPicker(false)}
                    onSelect={(data) => {
                        setLocation(data);
                        localStorage.setItem(LOCATION_KEY, JSON.stringify(data));
                        setOpenPicker(false);
                    }}
                />
            )}
        </>
    );
};

export default LocationChip;