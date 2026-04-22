/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class", // toggled by adding "dark" class to <html>
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "#7c5dfa",
          light: "#9277ff",
        },
        navy: {
          DEFAULT: "#1e2139",
          light: "#252945",
          dark: "#141625",
        },
        "blue-muted": "#7e88c3",
        "blue-pale": "#dfe3fa",
        "blue-light": "#f9fafe",
        status: {
          paid: "#33d69f",
          "paid-bg": "#f3fcf9",
          pending: "#ff8f00",
          "pending-bg": "#fff8f0",
          draft: "#373b53",
          "draft-bg": "#f4f4f8",
        },
      },
    },
  },
  plugins: [],
};
