/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: [
          "inter_semi_bold",
          "fallback-inter_semi_bold",
          "Arial",
          "sans-serif",
        ],
        subheading: [
          "inter_regular",
          "fallback-inter_regular",
          "Arial",
          "sans-serif",
        ],
      },
      noScrollbar: {
        "&::-webkit-scrollbar": {
          width: "0px",
          height: "8px",
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

        orangeAccent: "#FF5B00",

        skeletonLoaderColor: "#e5e7eb",
      },

      animation: {
        fadeSlide: "fadeSlide 0.6s ease-in-out forwards",
        fadeIn: "fadeIn 0.2s ease-in-out",
        slideUp: "slideUp 0.3s ease-out forwards",
        slideDown: "slideDown 0.25s ease-in forwards",
      },

      keyframes: {
        fadeSlide: {
          "0%": {
            opacity: 0,
            transform: "translateX(30px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0px)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: 0,
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        slideDown: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
