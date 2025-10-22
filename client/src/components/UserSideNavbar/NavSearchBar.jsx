import React, { useState, useRef, useEffect } from "react";
import { BiSearchAlt2, BiMicrophone } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const NavSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  // useEffect(() => {
  //   if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  //     const SpeechRecognition =
  //       window.SpeechRecognition || window.webkitSpeechRecognition;
  //     recognitionRef.current = new SpeechRecognition();
  //     recognitionRef.current.continuous = false;
  //     recognitionRef.current.interimResults = false;
  //     recognitionRef.current.lang = "en-US";

  //     recognitionRef.current.onresult = (event) => {
  //       const transcript = event.results[0][0].transcript;
  //       setSearchQuery(transcript);
  //       setIsListening(false);
  //     };

  //     recognitionRef.current.onerror = (event) => {
  //       console.error("Speech recognition error", event.error);
  //       setIsListening(false);
  //     };

  //     recognitionRef.current.onend = () => {
  //       setIsListening(false);
  //     };
  //   }

  //   return () => {
  //     if (recognitionRef.current) {
  //       recognitionRef.current.abort();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
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
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Inline styles for animations
  const floatAnimation = {
    animation: "float 3s ease-in-out infinite",
  };

  const bounceAnimation = {
    animation: "bounce 1s infinite",
  };

  const pulseAnimation = {
    animation: "pulse 1.5s ease-in-out infinite",
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
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
  `;

  return (
    <div className="hidden sm:flex flex-1 max-w-2xl mx-6 relative group">
      {/* Inject animation styles */}
      <style>{animationStyles}</style>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search products by names or brands..."
        className="w-full pl-5 pr-20 py-3 text-md border-2 border-primaryFadedColor rounded-full focus:outline-none focus:border-primaryColor transition-all duration-300 shadow-sm hover:shadow-md bg-white relative z-10 placeholder-gray-400"
      />

      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center z-10">
        {/* Voice search button */}
        <button
          onClick={toggleListening}
          disabled={
            !(
              "webkitSpeechRecognition" in window ||
              "SpeechRecognition" in window
            )
          }
          className={`p-2 rounded-full mr-1 transition-all duration-300 ${
            isListening
              ? "bg-red-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } ${
            !(
              "webkitSpeechRecognition" in window ||
              "SpeechRecognition" in window
            )
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105"
          }`}
          aria-label="Voice search"
        >
          <BiMicrophone
            size={20}
            className={isListening ? "animate-pulse" : ""}
          />
        </button>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-primaryColor to-primaryBtnHoverColor text-white p-2.5 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primaryFadedColor focus:ring-offset-2 shadow-md"
          aria-label="Search products"
        >
          <BiSearchAlt2
            size={22}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </button>
      </div>

      {/* Voice search status indicator */}
      {isListening && (
        <div className="absolute -top-8 right-12 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
          Listening...
          <div
            style={pulseAnimation}
            className="ml-1 inline-block w-2 h-2 bg-white rounded-full"
          ></div>
        </div>
      )}

      {/* Animated elements */}
      {searchQuery && (
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
          <div
            style={bounceAnimation}
            className="w-2 h-2 bg-primaryColor rounded-full"
          ></div>
        </div>
      )}

      {/* Cute decorative elements */}
      {isFocused && (
        <>
          <div
            style={floatAnimation}
            className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-accentColor opacity-75"
          ></div>
          <div
            style={{ ...floatAnimation, animationDelay: "300ms" }}
            className="absolute -right-2 -bottom-2 w-3 h-3 rounded-full bg-primaryFadedColor opacity-75"
          ></div>
        </>
      )}

      {/* Floating elements when searching */}
      {isFocused && searchQuery && (
        <>
          {/* <div style={floatAnimation} className="absolute -left-4 -top-4 text-primaryColor text-xl opacity-70">🔍</div> */}
          <div
            style={{ ...floatAnimation, animationDelay: "200ms" }}
            className="absolute -right-4 -top-4 text-accentColor text-xl opacity-70"
          >
            ✨
          </div>
        </>
      )}
    </div>
  );
};

export default NavSearchBar;
