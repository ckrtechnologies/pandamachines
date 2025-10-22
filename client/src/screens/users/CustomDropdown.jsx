import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

const CustomDropdown = ({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const selectedOption = options?.find(
    (opt) => opt._id === value || opt.id === value
  );
  const filteredOptions = options?.filter((opt) =>
    opt.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionId) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm("");
  };

  // 🎨 FI Color Palette
  const colors = {
    primaryColor: "#00569e",
    primaryFadedColor: "#a6c9e9",
    accentColor: "#8cc441",
    primaryTextColor: "#1f2937",
    secondaryTextColor: "#6b7280",
    primaryBtnColor: "#004680",
    primaryBtnHoverColor: "#00365f",
    skeletonLoaderColor: "#e5e7eb",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label
        className="block text-sm font-semibold mb-2"
        style={{ color: colors.primaryTextColor }}
      >
        {label}
      </label>

      {/* Dropdown Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          backgroundColor: disabled ? colors.skeletonLoaderColor : "white",
          borderColor: isOpen ? colors.primaryColor : "#d1d5db",
          boxShadow: isOpen ? `0 0 0 3px ${colors.primaryFadedColor}` : "none",
          opacity: disabled ? 0.6 : 1,
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg border-2 transition-all duration-200 ${
          disabled ? "cursor-not-allowed" : "hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {Icon && (
            <Icon
              className="w-5 h-5 flex-shrink-0"
              style={{ color: colors.primaryColor }}
            />
          )}
          <span
            className={`truncate font-medium ${
              selectedOption ? "" : "text-gray-400"
            }`}
            style={{
              color: selectedOption
                ? colors.primaryTextColor
                : colors.secondaryTextColor,
            }}
          >
            {selectedOption?.name || placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: colors.secondaryTextColor }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-50 overflow-hidden"
          style={{
            backgroundColor: "white",
            border: `2px solid ${colors.primaryFadedColor}`,
          }}
        >
          {/* Search Input */}
          <div
            className="p-3 border-b bg-gray-50"
            style={{ borderColor: colors.skeletonLoaderColor }}
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: colors.secondaryTextColor }}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none text-sm"
                style={{
                  borderColor: colors.skeletonLoaderColor,
                  color: colors.primaryTextColor,
                  boxShadow: `0 0 0 2px transparent`,
                }}
                onFocus={(e) =>
                  (e.target.style.boxShadow = `0 0 0 2px ${colors.primaryFadedColor}`)
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions?.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value === (option._id || option.id);
                return (
                  <button
                    key={option._id || option.id}
                    onClick={() => handleSelect(option._id || option.id)}
                    className="w-full px-4 py-3 flex items-center justify-between transition-colors duration-150 border-b last:border-b-0"
                    style={{
                      borderColor: colors.skeletonLoaderColor,
                      backgroundColor: isSelected
                        ? colors.primaryFadedColor
                        : "white",
                      color: isSelected
                        ? colors.primaryBtnColor
                        : colors.primaryTextColor,
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    <span className="truncate">{option.name}</span>
                    {isSelected && (
                      <Check
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: colors.primaryBtnColor }}
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div
                className="px-4 py-6 text-center text-sm"
                style={{ color: colors.secondaryTextColor }}
              >
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
