import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BedsCarousel() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/carousel/get-all-carousel`,
          {
            method: "GET",
            headers: {
              "Content-Type": "text/plain",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setBanners(result.data);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const goToPrev = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  if (loading) {
    return <BedsCarouselSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full h-96 bg-red-100 flex items-center justify-center shadow-lg rounded">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center shadow-lg rounded">
        <p className="text-gray-600">No banners available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden shadow-lg rounded">
      {banners.map((banner, index) => (
        <img
          key={banner._id}
          src={banner.image}
          alt={banner.title}
          className={`w-full h-auto transition-opacity duration-700 ${index === current
            ? "opacity-100"
            : "opacity-0 absolute top-0 left-0"
            }`}
        />
      ))}

      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-r-md p-2 shadow transition-all"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-l-md p-2 shadow transition-all"
        aria-label="Next banner"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current ? "bg-white w-6" : "bg-white/60"
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
}
const BedsCarouselSkeleton = () => {
  return (
    <div className="relative w-full overflow-hidden rounded shadow-lg animate-pulse">

      {/* Banner */}
      <div className="w-full aspect-[16/9] max-h-44 bg-gray-200" />

      {/* Left Arrow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        <div className="w-10 h-12 bg-white/80 rounded-r-md shadow" />
      </div>

      {/* Right Arrow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <div className="w-10 h-12 bg-white/80 rounded-l-md shadow" />
      </div>

    </div>
  );
};