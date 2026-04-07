import { useEffect, useState } from "react";
import { MdLocationOn } from "react-icons/md";
import LocationPicker from "./LocationPicker";

const LOCATION_KEY = "pm-user-location";

const LocationBar = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openPicker, setOpenPicker] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const stored = localStorage.getItem(LOCATION_KEY);

                if (stored) {
                    setLocation(JSON.parse(stored));
                    setLoading(false);
                    return;
                }

                const loc = await getBrowserLocation();

                if (loc) {
                    setLocation(loc);
                    localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const getBrowserLocation = () => {
        if (!navigator.geolocation) return null;

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude, accuracy } = pos.coords;

                    // reject weak GPS
                    if (accuracy > 300) return resolve(null);

                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await res.json();

                        const place =
                            data?.address?.suburb ||
                            data?.address?.city ||
                            data?.address?.town;

                        resolve({
                            name: place,
                            full: data?.display_name,
                            coordinates: [longitude, latitude],
                        });
                    } catch {
                        resolve(null);
                    }
                },
                () => resolve(null),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                }
            );
        });
    };

    return (
        <>
            <div
                onClick={() => setOpenPicker(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-white border-b cursor-pointer"
            >
                <MdLocationOn className="text-red-500 text-lg" />

                {loading ? (
                    <div className="flex flex-col gap-1 w-full">
                        <div className="h-3 w-32 bg-gray-200 animate-pulse rounded" />
                        <div className="h-3 w-48 bg-gray-100 animate-pulse rounded" />
                    </div>
                ) : location ? (
                    <div className="flex flex-col leading-tight">
                        <span className="font-medium text-gray-800">
                            {location.name || "Your Location"}
                        </span>
                        <span className="text-gray-500 text-xs truncate">
                            {location.full}
                        </span>
                    </div>
                ) : (
                    <span className="text-gray-500">
                        Select delivery location
                    </span>
                )}
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

export default LocationBar;