/** @type {import('tailwindcss').Config} */

const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/.{js,ts,jsx,tsx,mdx}",
    "./src/components/.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customLight: "#fdf6e3", // light background
        customDark: "#2A1B3D", // dark background
        customTextLight: "#222222",
        customTextDark: "#ffffff",
      },
    },
  },
  plugins: [],
};
export default config;
