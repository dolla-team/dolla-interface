/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        alfa: ["AlfaSlabOne"]
      },
      transitionDuration: {
        600: "600ms"
      },
      screens: {
        pad: { max: "1240px", min: "768px" }
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".preserve-3d": {
          "transform-style": "preserve-3d"
        },
        ".backface-hidden": {
          "backface-visibility": "hidden"
        }
      };
      addUtilities(newUtilities);
    }
  ]
};
