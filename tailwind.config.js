// tailwind.config.js
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        arizona: ["ABCArizonaMix", "sans-serif"],
        gintoNord: ["ArdorGinto-Nord", "sans-serif"],
        gintoNormal: ["ArdorGintoNormal", "sans-serif"],
      },
    },
  },
  plugins: [],
};
