/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      noScrollbar: {
        "&::-webkit-scrollbar": {
          width: "0px",
          height: "8px", // Keep horizontal scrollbar height if needed
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      },
      colors: {
        primaryColor: "#00569e", // Main brand blue
        primaryFadedColor: "#a6c9e9", // Lighter version for backgrounds
        accentColor: "#8cc441", // Lime green accent from logo

        primaryTextColor: "#1f2937", // Dark neutral text (better than pure black)
        secondaryTextColor: "#6b7280", // Muted gray for secondary text

        primaryBtnColor: "#004680", // Button color — slightly darker than main
        primaryBtnHoverColor: "#00365f", // Even darker for hover

        skeletonLoaderColor: "#e5e7eb", // Light neutral gray (tailwind's gray-200)
      },
    },
  },
  plugins: [],
};
