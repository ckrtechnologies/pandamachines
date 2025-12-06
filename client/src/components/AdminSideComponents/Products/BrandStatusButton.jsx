import { useState } from "react";

const BrandStatusButton = ({ condition, onToggle }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConditionClickButton = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const newState = !condition;

    try {
      if (onToggle) {
        await onToggle(newState);
      }
    } catch (error) {
      console.error("Error toggling brand status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        onClick={handleConditionClickButton}
        className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : condition
            ? "bg-blue-500"
            : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-gray-100 w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
            condition ? "translate-x-3" : "translate-x-0"
          } ${isLoading ? "opacity-50" : ""}`}
        ></div>
      </div>
    </div>
  );
};

export default BrandStatusButton;