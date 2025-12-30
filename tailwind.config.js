/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // أضف أي مسارات أخرى إذا لزم الأمر لضمان شمول الـ 24 دومين
  ],
  theme: {
    extend: {
      colors: {
        tec: {
          green: "#00ff9d",
          blue: "#00c6ff",
          dark: "#0a0e2b",
        },
      },
    },
  },
  plugins: [],
};
