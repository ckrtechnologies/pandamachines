import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { MdMyLocation } from "react-icons/md";

const GOOGLE_MAP_KEY = process.env.REACT_APP_GOOGLE_MAP_KEY;
const GOOGLE_LIBRARIES = ["places"];

const containerStyle = {
  width: "100%",
  height: "100%",
};

const DEFAULT_CENTER = {
  lat: 20.2961,
  lng: 85.8245,
};

const MAP_OPTIONS = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  clickableIcons: false,
  gestureHandling: "greedy",
};

const getPart = (components, types) => {
  const tset = Array.isArray(types) ? types : [types];
  const comp = components.find((c) => tset.every((t) => c.types.includes(t)));
  return comp?.long_name || "";
};

const parseAddressComponents = (components) => {
  const streetNumber = getPart(components, "street_number");
  const route = getPart(components, "route");
  const street = [streetNumber, route].filter(Boolean).join(" ").trim();

  const locality =
    getPart(components, "sublocality") ||
    getPart(components, "sublocality_level_1") ||
    getPart(components, "neighborhood") ||
    "";

  const city =
    getPart(components, "locality") ||
    getPart(components, "administrative_area_level_3") ||
    getPart(components, "administrative_area_level_2") ||
    "";

  const state = getPart(components, "administrative_area_level_1");
  const country = getPart(components, "country") || "India";
  const pincode = getPart(components, "postal_code");

  return { street, locality, city, state, country, pincode };
};

const GoogleMapPicker = ({ location, onChange }) => {
  const [isLocating, setIsLocating] = useState(false);

  const [markerPos, setMarkerPos] = useState(
    location.coordinates.length === 2
      ? { lat: location.coordinates[1], lng: location.coordinates[0] }
      : DEFAULT_CENTER,
  );
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);

  const handleMapLoad = (map) => {
    placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    autocompleteServiceRef.current =
      new window.google.maps.places.AutocompleteService();
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_KEY,
    libraries: GOOGLE_LIBRARIES,
  });

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarkerPos({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== "OK" || !results[0]) return;

      const parsed = parseAddressComponents(results[0].address_components);

      onChange({
        type: "Point",
        coordinates: [lng, lat],
        address: {
          formatted: results[0].formatted_address,
          ...parsed,
        },
      });
    });
  };

  const fetchSuggestions = (input) => {
    if (!input || !autocompleteServiceRef.current) {
      setSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: "in" }, // 🇮🇳 optional
      },
      (predictions, status) => {
        if (
          status !== window.google.maps.places.PlacesServiceStatus.OK ||
          !predictions
        ) {
          setSuggestions([]);
          return;
        }

        setSuggestions(predictions);
      },
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleClearSearch = () => {
    setQuery("");
    setSuggestions([]);
  };

  const handleSuggestionSelect = (placeId, description) => {
    if (!placesServiceRef.current) return;

    placesServiceRef.current.getDetails(
      {
        placeId,
        fields: ["geometry", "formatted_address", "address_components"],
      },
      (place, status) => {
        if (
          status !== window.google.maps.places.PlacesServiceStatus.OK ||
          !place.geometry
        )
          return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setMarkerPos({ lat, lng });
        setQuery(description);
        setSuggestions([]);

        const parsed = parseAddressComponents(place.address_components || []);

        onChange({
          type: "Point",
          coordinates: [lng, lat],
          address: {
            formatted: place.formatted_address,
            ...parsed,
          },
        });
      },
    );
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    if (isLocating) return;

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Reject weak fixes
        if (accuracy > 300) {
          setIsLocating(false);
          alert("Unable to get accurate location. Please adjust on map.");
          return;
        }

        const lat = latitude;
        const lng = longitude;

        setMarkerPos({ lat, lng });

        try {
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status !== "OK" || !results[0]) {
              setIsLocating(false);
              return;
            }

            const parsed = parseAddressComponents(
              results[0].address_components,
            );

            onChange({
              type: "Point",
              coordinates: [lng, lat],
              address: {
                formatted: results[0].formatted_address,
                ...parsed,
              },
            });

            setIsLocating(false);
          });
        } catch (err) {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location unavailable");
            break;
          case error.TIMEOUT:
            alert("Unable to fetch location");
            break;
          default:
            alert("Unable to fetch location");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0, // force fresh GPS
        timeout: 25000, // allow GPS time to lock
      },
    );
  };

  return (
    <div className="space-y-3">
      {/* MAP */}
      <div className="w-full relative h-[26rem] sm:h-[23rem] overflow-hidden">
        {/* SEARCHBAR */}
        <div className="absolute top-2 left-2 right-2 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search your location"
              className=" w-full px-10 py-2.5 rounded-xl text-sm border border-gray-300 bg-white/90 shadow-md outline-none focus:ring-1 focus:ring-accentTextColor "
            />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition "
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}

            {/* CUSTOM DROPDOWN */}
            {suggestions.length > 0 && (
              <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s.place_id}
                    onClick={() =>
                      handleSuggestionSelect(s.place_id, s.description)
                    }
                    className="
              w-full text-left px-4 py-3
              text-sm
              hover:bg-gray-50
              transition
            "
                  >
                    {s.description}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {!isLoaded ? (
          <MapSkeleton />
        ) : (
          <GoogleMap
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={15}
            mapContainerStyle={containerStyle}
            center={markerPos}
            zoom={15}
            onLoad={handleMapLoad}
            onClick={handleMapClick}
            options={MAP_OPTIONS}
          >
            <Marker
              key={`${markerPos.lat}-${markerPos.lng}`}
              position={markerPos}
            />
          </GoogleMap>
        )}

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className={` flex absolute backdrop-blur-md bottom-2 left-2 items-center justify-center px-2.5 py-2 active:scale-[0.98] rounded-lg border border-accentTextColor text-accentTextColor bg-accentTextColor/5 transition ${
            isLocating
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-accentTextColor/10"
          }
  `}
          aria-label="Use my current location"
        >
          {isLocating ? (
            <span
              className="
        w-5 h-5
        border-2 border-accentTextColor/40
        border-t-accentTextColor
        rounded-full
        animate-spin
      "
            />
          ) : (
            <MdMyLocation className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

const MapSkeleton = () => (
  <div className="w-full h-full bg-gray-200 animate-pulse relative">
    {/* Fake search bar */}
    <div className="absolute top-2 left-2 right-2 h-10 bg-white/70 rounded-xl shadow" />

    {/* Fake current location button */}
    <div className="absolute bottom-2 left-2 w-10 h-10 bg-white/70 rounded-lg shadow" />

    {/* Subtle grid shimmer */}
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent" />
  </div>
);

export default GoogleMapPicker;
