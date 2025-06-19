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
        primaryColor: "#00569e",
        primaryFadedColor: "#a6c9e9",
        accentColor: "#8cc441",

        primaryTextColor: "#1f2937",
        secondaryTextColor: "#6b7280",

        primaryBtnColor: "#004680",
        primaryBtnHoverColor: "#00365f",

        skeletonLoaderColor: "#e5e7eb",
      },

      animation: {
        fadeSlide: 'fadeSlide 0.6s ease-in-out forwards',
      },
      keyframes: {
        fadeSlide: {
          '0%': {
            opacity: 0,
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0px)',
          },
        },
      },
    },
  },
  plugins: [],
};
