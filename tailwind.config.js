// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a0a0a",       // dark background base
        accent: "#eab308",        // gold / orchestra brand color
        gold: "#eab308",
      },
      boxShadow: {
        gold: "0 0 10px rgba(234,179,8,0.3)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(.96)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        lineGrow: {
          "0%": { transform: "scaleY(0)", opacity: 0 },
          "100%": { transform: "scaleY(1)", opacity: 1 },
        },
      },
      animation: {
        fadeUp: "fadeUp .5s ease-out forwards",
        fadeIn: "fadeIn .4s ease-out forwards",
        scaleIn: "scaleIn .35s ease-out forwards",
        shimmer: "shimmer 1.2s linear infinite",
        lineGrow: "lineGrow 1.5s ease-out forwards",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.22,.61,.36,1)",
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Inter', 'sans-serif'], // keep inter or replace
      },
    },
  },
  plugins: [],
};