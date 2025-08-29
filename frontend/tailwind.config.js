/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ["Pacifico", "cursive"],
      },
      backgroundImage: (theme) => ({
        "texture-pattern": "url('/src/assets/img/texture2.jpg')",
      }),

      colors: {
        "primary-color": "#160d08",
        "secondary-color": "#362817",
        "text-color-first": "#61452e",
        "text-color-second": "#8a6f46",
        "navbar-text-color": "#c3a176",
        brown: {
          800: "#6B4226", // Warna coklat tua
        },
        brown: {
          100: "#d2bfa6",
          200: "#b59a6f",
          300: "#9e7f53",
          400: "#8a6441",
          500: "#6e4f31",
          600: "#564030",
          700: "#3e2c21",
          800: "#291b13",
          900: "#160a07",
        },
        black: "#000000",
        white: "#ffffff",
        hijaukuat: "1A3636",
        hijaukuatkurang: "40534C",
        hijaulembut: "677D6A",
        lembut: "D6BD98",
      },
      fontFamily: {
        pacifico: ["Pacifico", "cursive"],
      },

      animation: {
        bounce: "bounce 2s infinite",
        fadeIn: "fadeIn 1s ease-in",
        zoomIn: "zoomIn 1s ease-in",
        pulse: "pulse 2s infinite",
      },
      keyframes: {
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        zoomIn: {
          from: { transform: "scale(0.5)" },
          to: { transform: "scale(1)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
};
