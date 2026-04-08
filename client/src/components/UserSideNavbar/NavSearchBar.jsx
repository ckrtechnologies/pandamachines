import React, { useState, useRef, useEffect } from "react";
import { BiSearchAlt2, BiMicrophone } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const NavSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const isSpeechSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (isSpeechSupported) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);

        setTimeout(() => {
          navigate(
            `/products-search-results/${encodeURIComponent(transcript.trim())}`
          );
        }, 1000);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [navigate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(
        `/products-search-results/${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice search is not supported on this device");
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (err) {
      console.error("Mic error:", err);
      setIsListening(false);
    }
  };

  const animationStyles = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
      100% { transform: translateY(0px); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes mic-pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
  `;

  return (
    <div className="flex w-full relative z-10">
      <style>{animationStyles}</style>

      <div className={`flex items-center w-full border-2 border-primaryFadedColor rounded-full bg-white px-3 py-2.5 transition-all duration-300 ${isFocused ? "border-primaryColor shadow-md" : "shadow-sm hover:shadow-md"}`}>

        {/* 🔍 LEFT SEARCH ICON */}
        <button
          onClick={handleSearch}
          className="text-gray-500 mr-2"
        >
          <BiSearchAlt2 className="size-5" />
        </button>

        {/* INPUT */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products by names or brands..."
          className="flex-1 bg-transparent outline-none text-xs sm:text-sm lg:text-base placeholder-gray-400"
        />

        {/* 🎤 MIC ICON (RIGHT MOST) */}
        <button
          onClick={toggleListening}
          disabled={!isSpeechSupported}
          className={`ml-2 transition-all duration-300 ${isListening
            ? "text-red-500"
            : "text-gray-500 hover:text-gray-700"
            } ${!isSpeechSupported
              ? "opacity-50 cursor-not-allowed"
              : ""
            }`}
        >
          <BiMicrophone
            className={`${isListening ? "animate-[mic-pulse_1s_infinite" : ""} size-5`}
          />
        </button>
      </div>

      {/* Voice search status indicator */}
      {isListening && (
        <div className="absolute z-[60] top-full mt-1 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
          Listening...
          <div className="ml-1 inline-block w-2 h-2 bg-white rounded-full animate-mic-pulse"></div>
        </div>
      )}

      {/* Animated dot */}
      {searchQuery && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-2 bg-primaryColor rounded-full animate-bounce"></div>
        </div>
      )}
    </div>
  );
};

export default NavSearchBar;
