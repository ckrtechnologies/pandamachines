import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  { id: 1, image: 'https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/e8a78ecc184f5eb7.jpg?q=60' },
  { id: 2, image: 'https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/1206619937a5421c.jpeg?q=60' },
  { id: 3, image: 'https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/5b309e98775e22e4.jpg?q=60' },
  { id: 4, image: 'https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/076c4f2ee87225d7.jpg?q=60' },
  { id: 5, image: 'https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/74f0ad81e44e6e6f.jpg?q=60' },
];

export default function BedsCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-play every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToPrev = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden shadow-lg">
      {banners.map((banner, index) => (
        <img
          key={banner.id}
          src={banner.image}
          alt={`Banner ${banner.id}`}
          className={`w-full transition-opacity duration-700 ${
            index === current ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
          }`}
        />
      ))}

      {/* Arrows */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-r-md py-2 shadow"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-l-md py-2 shadow"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
